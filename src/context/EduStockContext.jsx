import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../utils/supabase/client";

const EduStockContext = createContext(null);

function unwrap({ data, error }) {
  if (error) throw error;
  return data;
}

function errorMessage(error) {
  return error?.message || "An unexpected database error occurred.";
}

function EduStockProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [classes, setClasses] = useState([]);
  const [classBooks, setClassBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    await Promise.resolve();
    if (!user) {
      setClasses([]);
      setClassBooks([]);
      setStudents([]);
      setDistributions([]);
      setInventory({});
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const [classRows, bookRows, studentRows, stockRows, distributionRows] = await Promise.all([
        supabase.from("classes").select("id,name,group_name,sort_order").order("sort_order"),
        supabase.from("books").select("id,class_id,title,subject,cover_image_path,cover_color"),
        supabase.from("students").select("id,class_id,name,student_code"),
        supabase.from("book_stock").select("book_id,total,damaged,lost"),
        supabase.from("distributions").select("id,student_id,book_id,action,staff_id,created_at").order("created_at").order("id"),
      ]);

      const classData = unwrap(classRows);
      const bookData = unwrap(bookRows);
      const studentData = unwrap(studentRows);
      const stockData = unwrap(stockRows);
      const distributionData = unwrap(distributionRows);

      const classNames = new Map(classData.map((item) => [String(item.id), item.name]));
      const stockByBook = Object.fromEntries(stockData.map((item) => [
        String(item.book_id),
        { total: Number(item.total), damaged: Number(item.damaged), lost: Number(item.lost) },
      ]));

      setClasses(classData);
      setClassBooks(bookData.map((book) => ({
        id: book.id,
        classId: book.class_id,
        className: classNames.get(String(book.class_id)) || "",
        title: book.title,
        subject: book.subject,
        copies: stockByBook[String(book.id)]?.total ?? 0,
        image: book.cover_image_path || "",
        coverColor: book.cover_color || "#1479F2",
      })));
      setStudents(studentData.map((student) => ({
        id: student.id,
        classId: student.class_id,
        className: classNames.get(String(student.class_id)) || "",
        name: student.name,
        studentId: student.student_code,
      })));
      setInventory(stockByBook);
      setDistributions(distributionData.map((item) => ({
        id: item.id,
        studentId: item.student_id,
        bookId: item.book_id,
        action: item.action,
        staffId: item.staff_id,
        date: item.created_at,
      })));
    } catch (loadError) {
      setError(`Could not load Supabase data: ${errorMessage(loadError)}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // This effect synchronizes the shared store with the authenticated Supabase session.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!authLoading) void reload();
  }, [authLoading, reload]);

  const getInventory = useCallback((bookId) => {
    const record = inventory[String(bookId)] || { total: 0, damaged: 0, lost: 0 };
    const issued = distributions.filter(
      (item) => String(item.bookId) === String(bookId) && item.action === "issued"
    ).length - distributions.filter(
      (item) => String(item.bookId) === String(bookId) && item.action === "returned"
    ).length;

    return {
      ...record,
      issued: Math.max(0, issued),
      available: Math.max(0, record.total - issued - record.damaged - record.lost),
    };
  }, [distributions, inventory]);

  const isCollected = useCallback((studentId, bookId) => {
    const latest = [...distributions]
      .reverse()
      .find((item) => String(item.studentId) === String(studentId) && String(item.bookId) === String(bookId));
    return latest?.action === "issued";
  }, [distributions]);

  const recordDistribution = useCallback(async (studentId, bookId, action) => {
    try {
      const result = await supabase.from("distributions").insert({
        student_id: studentId,
        book_id: bookId,
        action,
      }).select("id").single();
      unwrap(result);
      await reload();
      return { ok: true };
    } catch (writeError) {
      return { ok: false, reason: `Could not ${action === "issued" ? "issue" : "return"} this book: ${errorMessage(writeError)}` };
    }
  }, [reload]);

  const issueBook = useCallback(async (studentId, bookId) => {
    if (isCollected(studentId, bookId)) return { ok: false, reason: "This student already has this book. Return it first." };
    if (getInventory(bookId).available <= 0) return { ok: false, reason: "There are no available copies of this book." };
    return recordDistribution(studentId, bookId, "issued");
  }, [getInventory, isCollected, recordDistribution]);

  const returnBook = useCallback(async (studentId, bookId) => {
    if (!isCollected(studentId, bookId)) return { ok: false, reason: "This student has not collected this book." };
    return recordDistribution(studentId, bookId, "returned");
  }, [isCollected, recordDistribution]);

  const saveBook = useCallback(async (book, existingId) => {
    const classRecord = classes.find((item) => item.name === book.className);
    if (!classRecord) return { ok: false, reason: "Select a class from the existing classes." };

    try {
      const stock = inventory[String(existingId)] || { total: 0, damaged: 0, lost: 0 };
      const total = Number(book.copies);
      const issued = existingId ? getInventory(existingId).issued : 0;
      if (!Number.isFinite(total) || total < issued + stock.damaged + stock.lost) {
        return { ok: false, reason: "Total stock cannot be lower than issued, damaged, and lost copies combined." };
      }
      const values = {
        class_id: classRecord.id,
        title: book.title.trim(),
        subject: book.subject.trim(),
        cover_image_path: book.image || null,
        cover_color: book.coverColor || "#1479F2",
      };
      let bookId = existingId;
      if (existingId) {
        unwrap(await supabase.from("books").update(values).eq("id", existingId).select("id").single());
      } else {
        const inserted = unwrap(await supabase.from("books").insert(values).select("id").single());
        bookId = inserted.id;
      }

      unwrap(await supabase.from("book_stock").upsert({
        book_id: bookId,
        total,
        damaged: stock.damaged,
        lost: stock.lost,
      }));
      await reload();
      return { ok: true };
    } catch (writeError) {
      await reload();
      return { ok: false, reason: `Could not save the book: ${errorMessage(writeError)}` };
    }
  }, [classes, getInventory, inventory, reload]);

  const removeBook = useCallback(async (bookId) => {
    try {
      unwrap(await supabase.from("books").delete().eq("id", bookId).select("id").single());
      await reload();
      return { ok: true };
    } catch (writeError) {
      return { ok: false, reason: `Could not remove the book: ${errorMessage(writeError)}` };
    }
  }, [reload]);

  const saveStudent = useCallback(async (student, existingId) => {
    const classRecord = classes.find((item) => item.name === student.className);
    if (!classRecord) return { ok: false, reason: "Select a class from the existing classes." };
    try {
      const values = {
        class_id: classRecord.id,
        name: student.name.trim(),
        student_code: student.studentId.trim(),
      };
      if (existingId) {
        unwrap(await supabase.from("students").update(values).eq("id", existingId).select("id").single());
      } else {
        unwrap(await supabase.from("students").insert(values).select("id").single());
      }
      await reload();
      return { ok: true };
    } catch (writeError) {
      return { ok: false, reason: `Could not save the student: ${errorMessage(writeError)}` };
    }
  }, [classes, reload]);

  const removeStudent = useCallback(async (studentId) => {
    try {
      unwrap(await supabase.from("students").delete().eq("id", studentId).select("id").single());
      await reload();
      return { ok: true };
    } catch (writeError) {
      return { ok: false, reason: `Could not remove the student: ${errorMessage(writeError)}` };
    }
  }, [reload]);

  const saveStock = useCallback(async (bookId, values) => {
    const next = {
      total: Number(values.total),
      damaged: Number(values.damaged),
      lost: Number(values.lost),
    };
    const issued = getInventory(bookId).issued;
    if (Object.values(next).some((value) => !Number.isFinite(value) || value < 0)) {
      return { ok: false, reason: "Stock quantities must be valid non-negative numbers." };
    }
    if (next.total < issued + next.damaged + next.lost) {
      return { ok: false, reason: "Total stock cannot be lower than issued, damaged, and lost copies combined." };
    }
    try {
      unwrap(await supabase.from("book_stock").upsert({ book_id: bookId, ...next }).select("book_id").single());
      await reload();
      return { ok: true };
    } catch (writeError) {
      return { ok: false, reason: `Could not update stock: ${errorMessage(writeError)}` };
    }
  }, [getInventory, reload]);

  const addInventoryStock = useCallback((bookId, quantity) => {
    const current = getInventory(bookId);
    const amount = Number(quantity);
    if (!Number.isFinite(amount) || amount <= 0) return Promise.resolve({ ok: false, reason: "Enter a valid quantity." });
    return saveStock(bookId, { total: current.total + amount, damaged: current.damaged, lost: current.lost });
  }, [getInventory, saveStock]);

  const updateInventory = useCallback((bookId, values) => saveStock(bookId, values), [saveStock]);

  const recordInventoryLoss = useCallback((bookId, type, quantity) => {
    if (type !== "damaged" && type !== "lost") {
      return Promise.resolve({ ok: false, reason: "Select a valid stock adjustment." });
    }
    const current = getInventory(bookId);
    const amount = Number(quantity);
    if (!Number.isFinite(amount) || amount <= 0 || amount > current.available) {
      return Promise.resolve({ ok: false, reason: "The quantity must be within the available stock." });
    }
    return saveStock(bookId, { ...current, [type]: current[type] + amount });
  }, [getInventory, saveStock]);

  const value = useMemo(() => ({
    classes,
    classBooks,
    students,
    distributions,
    inventory,
    loading: authLoading || loading,
    error,
    reload,
    getInventory,
    isCollected,
    issueBook,
    returnBook,
    saveBook,
    removeBook,
    saveStudent,
    removeStudent,
    addInventoryStock,
    updateInventory,
    recordInventoryLoss,
  }), [classes, classBooks, students, distributions, inventory, authLoading, loading, error, reload, getInventory, isCollected, issueBook, returnBook, saveBook, removeBook, saveStudent, removeStudent, addInventoryStock, updateInventory, recordInventoryLoss]);

  return <EduStockContext.Provider value={value}>{children}</EduStockContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEduStock() {
  const context = useContext(EduStockContext);
  if (!context) throw new Error("useEduStock must be used inside EduStockProvider");
  return context;
}

export default EduStockProvider;
