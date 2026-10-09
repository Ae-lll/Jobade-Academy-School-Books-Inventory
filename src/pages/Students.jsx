import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Edit3,
  GraduationCap,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEduStock } from "../context/EduStockContext";

const emptyStudentForm = {
  name: "",
  studentId: "",
};

function ClassIcon() {
  return (
    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-[#EAF3FF] text-[#1479F2]">
      <GraduationCap size={21} />
    </div>
  );
}

function Students() {
  const {
    classes,
    students,
    classBooks,
    isCollected,
    issueBook,
    returnBook,
    saveStudent: persistStudent,
    removeStudent: deleteStudentRecord,
  } = useEduStock();

  const [selectedClass, setSelectedClass] = useState(null);
  const [search, setSearch] = useState("");

  const [modal, setModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [form, setForm] = useState(emptyStudentForm);

  const classGroups = useMemo(() => {
    const groups = new Map();
    classes.forEach((item) => {
      if (!groups.has(item.group_name)) groups.set(item.group_name, []);
      groups.get(item.group_name).push(item);
    });
    return [...groups].map(([title, items]) => ({
      id: title,
      title,
      classes: items.sort((a, b) => a.sort_order - b.sort_order).map((item) => item.name),
    }));
  }, [classes]);

  // --------------------------------------------------
  // Selected class books
  // --------------------------------------------------

  const selectedBooks = useMemo(() => {
    if (!selectedClass) return [];

    return classBooks.filter(
      (book) => book.className === selectedClass
    );
  }, [classBooks, selectedClass]);

  // --------------------------------------------------
  // Selected class students
  // --------------------------------------------------

  const selectedStudents = useMemo(() => {
    if (!selectedClass) return [];

    return students
      .filter(
        (student) => student.className === selectedClass
      )
      .filter((student) =>
        student.name
          .toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [students, selectedClass, search]);

  // --------------------------------------------------
  // Class count
  // --------------------------------------------------

  const studentCount = (className) =>
    students.filter(
      (student) => student.className === className
    ).length;

  const bookCount = (className) =>
    classBooks.filter(
      (book) => book.className === className
    ).length;

  // --------------------------------------------------
  // Open class
  // --------------------------------------------------

  const openClass = (className) => {
    setSelectedClass(className);
    setSearch("");
  };

  // --------------------------------------------------
  // Collection functions
  // --------------------------------------------------

  const toggleCollection = async (studentId, bookId) => {
    const result = isCollected(studentId, bookId)
      ? await returnBook(studentId, bookId)
      : await issueBook(studentId, bookId);
    if (!result.ok) window.alert(result.reason);
  };

  const updateCollections = async (studentId, collected) => {
    for (const book of selectedBooks) {
      if (isCollected(studentId, book.id) === collected) continue;
      const result = collected
        ? await issueBook(studentId, book.id)
        : await returnBook(studentId, book.id);
      if (!result.ok) {
        window.alert(result.reason);
        return;
      }
    }
  };

  // --------------------------------------------------
  // Student progress
  // --------------------------------------------------

  const getProgress = (studentId) => {
    const collected = selectedBooks.filter((book) => isCollected(studentId, book.id)).length;

    const total = selectedBooks.length;

    return {
      collected,
      total,
      complete: total > 0 && collected === total,
    };
  };

  // --------------------------------------------------
  // Add student
  // --------------------------------------------------

  const openAddStudent = () => {
    setEditingStudent(null);

    setForm({
      name: "",
      studentId: "",
    });

    setModal(true);
  };

  // --------------------------------------------------
  // Edit student
  // --------------------------------------------------

  const openEditStudent = (student) => {
    setEditingStudent(student);

    setForm({
      name: student.name,
      studentId: student.studentId,
    });

    setModal(true);
  };

  // --------------------------------------------------
  // Save student
  // --------------------------------------------------

  const saveStudent = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !selectedClass) return;

    const studentId = form.studentId.trim() || editingStudent?.studentId ||
      `${selectedClass.replace(/[^a-z0-9]/gi, "").toUpperCase()}-${String(students.filter((student) => student.className === selectedClass).length + 1).padStart(3, "0")}`;
    const result = await persistStudent({
      name: form.name,
      studentId,
      className: selectedClass,
    }, editingStudent?.id);
    if (!result.ok) {
      window.alert(result.reason);
      return;
    }

    closeModal();
  };

  // --------------------------------------------------
  // Delete student
  // --------------------------------------------------

  const deleteStudent = async (studentId) => {
    const student = students.find(
      (item) => item.id === studentId
    );

    if (
      !window.confirm(
        `Remove ${student?.name || "this student"}?`
      )
    ) {
      return;
    }

    const result = await deleteStudentRecord(studentId);
    if (!result.ok) window.alert(result.reason);
  };

  const closeModal = () => {
    setModal(false);
    setEditingStudent(null);
    setForm(emptyStudentForm);
  };

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const totalStudents = students.length;

  const completeStudents = selectedStudents.filter(
    (student) => getProgress(student.id).complete
  ).length;

  const pendingStudents =
    selectedStudents.length - completeStudents;

  return (
    <div className="space-y-6">

      {/* =================================================
          CLASS SELECTION
      ================================================= */}

      {!selectedClass ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

            <div>
              <h2 className="text-2xl font-bold text-[#102A43]">
                Students
              </h2>

              <p className="text-sm text-[#64748B] mt-1">
                Select a class to manage students and track
                book collection.
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#EAF3FF] text-[#1479F2] text-sm font-semibold">
              <Users size={18} />
              {totalStudents} students registered
            </div>

          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-sm">

            {classGroups.map((group) => (
              <section
                key={group.id}
                className="mb-7 last:mb-0"
              >

                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap
                    size={17}
                    className="text-[#1479F2]"
                  />

                  <h3 className="text-sm font-bold text-[#102A43]">
                    {group.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">

                  {group.classes.map((className) => (
                    <button
                      key={className}
                      onClick={() =>
                        openClass(className)
                      }
                      className="group flex items-center gap-3 p-3.5 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#1479F2]/40 hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
                    >

                      <ClassIcon />

                      <span className="min-w-0 flex-1">

                        <span className="block text-sm font-semibold text-[#102A43]">
                          {className}
                        </span>

                        <span className="block text-xs text-[#64748B] mt-0.5">
                          {studentCount(className)}{" "}
                          {studentCount(className) === 1
                            ? "student"
                            : "students"}{" "}
                          • {bookCount(className)}{" "}
                          {bookCount(className) === 1
                            ? "book"
                            : "books"}
                        </span>

                      </span>

                      <ChevronDown
                        size={17}
                        className="-rotate-90 text-[#94A3B8] group-hover:text-[#1479F2]"
                      />

                    </button>
                  ))}

                </div>

              </section>
            ))}

          </div>
        </>
      ) : (

        /* =================================================
           SELECTED CLASS
        ================================================= */

        <>
          <button
            onClick={() => setSelectedClass(null)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1479F2] hover:text-[#0F6AD6]"
          >
            <ArrowLeft size={17} />
            Back to Classes
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">

            <div className="flex items-center gap-3">

              <ClassIcon />

              <div>
                <h2 className="text-2xl font-bold text-[#102A43]">
                  {selectedClass} Students
                </h2>

                <p className="text-sm text-[#64748B] mt-0.5">
                  Manage students and track the books they
                  have collected.
                </p>
              </div>

            </div>

            <button
              onClick={openAddStudent}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1479F2] text-white text-sm font-semibold hover:bg-[#0F6AD6] shadow-sm"
            >
              <UserPlus size={18} />
              Add Student
            </button>

          </div>

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <p className="text-xs text-[#64748B]">
                Students
              </p>

              <p className="text-xl font-bold text-[#102A43] mt-1">
                {selectedStudents.length}
              </p>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <p className="text-xs text-[#64748B]">
                Class Books
              </p>

              <p className="text-xl font-bold text-[#102A43] mt-1">
                {selectedBooks.length}
              </p>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <p className="text-xs text-[#64748B]">
                Complete
              </p>

              <p className="text-xl font-bold text-[#16A34A] mt-1">
                {completeStudents}
              </p>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <p className="text-xs text-[#64748B]">
                Pending
              </p>

              <p className="text-xl font-bold text-[#F59E0B] mt-1">
                {pendingStudents}
              </p>
            </div>

          </div>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-sm">

            <div className="relative">

              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F8FD] border border-transparent text-sm text-[#102A43] placeholder:text-[#94A3B8] focus:bg-white focus:border-[#1479F2] focus:outline-none"
              />

            </div>

          </div>

          {/* =================================================
              CLASS BOOK INFORMATION
          ================================================= */}

          <div className="flex items-center justify-between gap-4 bg-[#EAF3FF] border border-[#D7E8FF] rounded-xl px-4 py-3">

            <div className="flex items-center gap-3">

              <BookOpen
                size={19}
                className="text-[#1479F2]"
              />

              <div>
                <p className="text-sm font-bold text-[#102A43]">
                  {selectedClass} Books
                </p>

                <p className="text-xs text-[#64748B] mt-0.5">
                  These books come directly from Class Books.
                </p>
              </div>

            </div>

            <span className="text-xs font-semibold text-[#1479F2]">
              {selectedBooks.length} books
            </span>

          </div>

          {/* =================================================
              STUDENT TABLE
          ================================================= */}

          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-[#E2E8F0]">

              <h3 className="font-bold text-[#102A43]">
                Book Collection Register
              </h3>

              <p className="text-xs text-[#64748B] mt-1">
                Tick a book when the student has collected it.
              </p>

            </div>

            {selectedBooks.length === 0 ? (

              <div className="p-12 text-center">

                <BookOpen
                  size={35}
                  className="mx-auto text-[#94A3B8]"
                />

                <h3 className="mt-3 font-semibold text-[#102A43]">
                  No books assigned
                </h3>

                <p className="text-sm text-[#64748B] mt-1">
                  Add books for {selectedClass} from the
                  Class Books page first.
                </p>

              </div>

            ) : selectedStudents.length === 0 ? (

              <div className="p-12 text-center">

                <Users
                  size={35}
                  className="mx-auto text-[#94A3B8]"
                />

                <h3 className="mt-3 font-semibold text-[#102A43]">
                  No students found
                </h3>

                <p className="text-sm text-[#64748B] mt-1">
                  Add a student to {selectedClass} to begin.
                </p>

                <button
                  onClick={openAddStudent}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1479F2] text-white text-sm font-semibold"
                >
                  <Plus size={17} />
                  Add Student
                </button>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1050px] border-collapse">

                  <thead>

                    <tr className="bg-[#F8FAFC]">

                      <th className="sticky left-0 z-10 bg-[#F8FAFC] border-b border-r border-[#E2E8F0] px-4 py-3 text-left text-[11px] font-bold text-[#64748B] w-12">
                        #
                      </th>

                      <th className="sticky left-12 z-10 bg-[#F8FAFC] border-b border-r border-[#E2E8F0] px-4 py-3 text-left text-[11px] font-bold text-[#64748B] min-w-[190px]">
                        STUDENT
                      </th>

                      <th className="border-b border-r border-[#E2E8F0] px-4 py-3 text-left text-[11px] font-bold text-[#64748B] min-w-[110px]">
                        ID
                      </th>

                      {selectedBooks.map((book) => (

                        <th
                          key={book.id}
                          className="border-b border-r border-[#E2E8F0] px-3 py-3 text-center min-w-[135px]"
                        >

                          <div className="flex flex-col items-center gap-2">

                            <div className="w-8 h-10 rounded-md overflow-hidden bg-[#EAF3FF] border border-[#DCE6F0]">

                              {book.image ? (
                                <img
                                  src={book.image}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#1479F2]">
                                  <BookOpen size={15} />
                                </div>
                              )}

                            </div>

                            <span className="text-[10px] font-bold text-[#334155] leading-tight">
                              {book.title}
                            </span>

                            <span className="text-[9px] text-[#94A3B8] font-normal">
                              {book.subject}
                            </span>

                          </div>

                        </th>

                      ))}

                      <th className="border-b border-r border-[#E2E8F0] px-4 py-3 text-center text-[11px] font-bold text-[#64748B] min-w-[115px]">
                        PROGRESS
                      </th>

                      <th className="border-b border-[#E2E8F0] px-4 py-3 text-center text-[11px] font-bold text-[#64748B] min-w-[120px]">
                        ACTIONS
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {selectedStudents.map(
                      (student, index) => {

                        const progress =
                          getProgress(student.id);

                        return (
                          <tr
                            key={student.id}
                            className="hover:bg-[#F8FBFF] transition-colors"
                          >

                            {/* NUMBER */}

                            <td className="sticky left-0 z-10 bg-white border-b border-r border-[#E2E8F0] px-4 py-3 text-xs text-[#64748B]">
                              {index + 1}
                            </td>

                            {/* STUDENT */}

                            <td className="sticky left-12 z-10 bg-white border-b border-r border-[#E2E8F0] px-4 py-3">

                              <div className="flex items-center gap-3">

                                <div className="w-9 h-9 rounded-full bg-[#EAF3FF] text-[#1479F2] flex items-center justify-center text-xs font-bold shrink-0">
                                  {student.name
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div>
                                  <p className="text-xs font-bold text-[#102A43]">
                                    {student.name}
                                  </p>

                                  <p className="text-[10px] text-[#94A3B8] mt-0.5">
                                    {student.className}
                                  </p>
                                </div>

                              </div>

                            </td>

                            {/* STUDENT ID */}

                            <td className="border-b border-r border-[#E2E8F0] px-4 py-3 text-xs text-[#64748B] font-mono">
                              {student.studentId}
                            </td>

                            {/* BOOK CHECKBOXES */}

                            {selectedBooks.map((book) => {

                              const collected = isCollected(student.id, book.id);

                              return (
                                <td
                                  key={book.id}
                                  className={`border-b border-r border-[#E2E8F0] px-3 py-3 text-center ${
                                    collected
                                      ? "bg-[#F0FDF4]"
                                      : ""
                                  }`}
                                >

                                  <button
                                    onClick={() =>
                                      toggleCollection(
                                        student.id,
                                        book.id
                                      )
                                    }
                                    className={`w-7 h-7 rounded-lg border flex items-center justify-center mx-auto transition-all ${
                                      collected
                                        ? "bg-[#16A34A] border-[#16A34A] text-white"
                                        : "bg-white border-[#CBD5E1] text-transparent hover:border-[#1479F2]"
                                    }`}
                                    title={
                                      collected
                                        ? "Mark as not collected"
                                        : "Mark as collected"
                                    }
                                  >

                                    {collected && (
                                      <Check size={15} />
                                    )}

                                  </button>

                                </td>
                              );
                            })}

                            {/* PROGRESS */}

                            <td className="border-b border-r border-[#E2E8F0] px-4 py-3">

                              <div className="flex flex-col items-center gap-1.5">

                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                                    progress.complete
                                      ? "bg-[#DCFCE7] text-[#15803D]"
                                      : "bg-[#FEF3C7] text-[#B45309]"
                                  }`}
                                >
                                  {progress.collected}/
                                  {progress.total}{" "}
                                  {progress.complete
                                    ? "Complete"
                                    : "Pending"}
                                </span>

                                <div className="w-20 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">

                                  <div
                                    className="h-full bg-[#16A34A] rounded-full transition-all"
                                    style={{
                                      width: `${
                                        progress.total
                                          ? (progress.collected /
                                              progress.total) *
                                            100
                                          : 0
                                      }%`,
                                    }}
                                  />

                                </div>

                              </div>

                            </td>

                            {/* ACTIONS */}

                            <td className="border-b border-[#E2E8F0] px-3 py-3">

                              <div className="flex justify-center gap-1.5">

                                <button
                                  onClick={() =>
                                    updateCollections(student.id, true)
                                  }
                                  title="Mark all collected"
                                  className="w-8 h-8 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center hover:bg-[#DCFCE7]"
                                >
                                  <CheckCircle2 size={15} />
                                </button>

                                <button
                                  onClick={() =>
                                    updateCollections(student.id, false)
                                  }
                                  title="Clear collection"
                                  className="w-8 h-8 rounded-lg border border-[#CBD5E1] bg-white text-[#64748B] flex items-center justify-center hover:bg-[#F4F8FD]"
                                >
                                  <X size={15} />
                                </button>

                                <button
                                  onClick={() =>
                                    openEditStudent(student)
                                  }
                                  title="Edit student"
                                  className="w-8 h-8 rounded-lg border border-[#BFDBFE] bg-white text-[#1479F2] flex items-center justify-center hover:bg-[#EAF3FF]"
                                >
                                  <Edit3 size={15} />
                                </button>

                                <button
                                  onClick={() =>
                                    deleteStudent(
                                      student.id
                                    )
                                  }
                                  title="Delete student"
                                  className="w-8 h-8 rounded-lg border border-[#FECACA] bg-white text-[#DC2626] flex items-center justify-center hover:bg-[#FEF2F2]"
                                >
                                  <Trash2 size={15} />
                                </button>

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

          {/* FOOTER */}

          <div className="pt-3 flex items-center justify-between border-t border-[#E2E8F0] text-xs text-[#94A3B8]">

            <span>
              © 2026 Jobade Academy | School Book Inventory
            </span>

            <span className="hidden sm:block">
              Better Books • Brighter Futures
            </span>

          </div>
        </>
      )}

      {/* =================================================
          ADD / EDIT STUDENT MODAL
      ================================================= */}

      {modal && (
        <div className="fixed inset-0 z-50 bg-[#0B2D5C]/35 backdrop-blur-[2px] flex items-center justify-center p-4">

          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E2E8F0]">

            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">

              <div>

                <h3 className="text-lg font-bold text-[#102A43]">
                  {editingStudent
                    ? "Edit Student"
                    : "Add Student"}
                </h3>

                <p className="text-xs text-[#64748B] mt-1">
                  {editingStudent
                    ? "Update this student's information."
                    : `Add a new student to ${selectedClass}.`}
                </p>

              </div>

              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-[#F4F8FD] text-[#64748B]"
              >
                <X size={18} />
              </button>

            </div>

            <form
              onSubmit={saveStudent}
              className="p-6 space-y-5"
            >

              <label className="block">

                <span className="text-xs font-semibold text-[#334155]">
                  Student Name
                </span>

                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      name: e.target.value,
                    }))
                  }
                  required
                  placeholder="Enter student's full name"
                  className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#102A43] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1479F2]/15 focus:border-[#1479F2]"
                />

              </label>

              <label className="block">

                <span className="text-xs font-semibold text-[#334155]">
                  Student ID
                </span>

                <input
                  value={form.studentId}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      studentId: e.target.value,
                    }))
                  }
                  placeholder="e.g. JSS1-001"
                  className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#102A43] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1479F2]/15 focus:border-[#1479F2]"
                />

              </label>

              <div className="rounded-xl bg-[#F4F8FD] border border-[#E2E8F0] p-3">

                <div className="flex items-center gap-2">

                  <GraduationCap
                    size={17}
                    className="text-[#1479F2]"
                  />

                  <div>
                    <p className="text-xs font-semibold text-[#334155]">
                      Class
                    </p>

                    <p className="text-sm font-bold text-[#102A43]">
                      {selectedClass}
                    </p>
                  </div>

                </div>

              </div>

              <div className="pt-2 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1479F2] text-white text-sm font-semibold hover:bg-[#0F6AD6]"
                >
                  <UserPlus size={17} />
                  {editingStudent
                    ? "Save Changes"
                    : "Add Student"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Students;