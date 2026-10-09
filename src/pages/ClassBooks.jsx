import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  BookPlus,
  ChevronRight,
  Edit3,
  GraduationCap,
  ImagePlus,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEduStock } from "../context/EduStockContext";

const emptyForm = {
  title: "",
  subject: "",
  className: "",
  copies: "",
  image: "",
};

const classAccent = {
  "Play Group": "blue",
  "Nursery 1": "purple",
  "Nursery 2": "green",
  KG: "orange",
  "Primary 1": "blue",
  "Primary 2": "purple",
  "Primary 3": "green",
  "Primary 4": "orange",
  "Primary 5": "red",
  "JSS 1": "blue",
  "JSS 2": "purple",
  "JSS 3": "green",
  "SS 1": "blue",
  "SS 2": "purple",
  "SS 3": "orange",
};

function ClassIcon({ className }) {
  const accent = classAccent[className] || "blue";
  const styles = {
    blue: "bg-[#EAF3FF] text-[#1479F2]",
    purple: "bg-[#F1EBFF] text-[#7C3AED]",
    green: "bg-[#EAF9F0] text-[#16A34A]",
    orange: "bg-[#FFF5DF] text-[#F59E0B]",
    red: "bg-[#FFF0F0] text-[#EF4444]",
  };
  return (
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${styles[accent]}`}>
      <GraduationCap size={21} />
    </div>
  );
}

function StatusBadge({ copies }) {
  if (Number(copies) <= 0) {
    return <span className="inline-flex px-2.5 py-1 rounded-full bg-[#FEE2E2] text-[#DC2626] text-[11px] font-semibold">Out of Stock</span>;
  }
  if (Number(copies) <= 15) {
    return <span className="inline-flex px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] text-[11px] font-semibold">Low Stock</span>;
  }
  return <span className="inline-flex px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-[11px] font-semibold">Available</span>;
}

function BookCover({ book }) {
  if (book.image) {
    return <img src={book.image} alt={book.title} className="w-full h-full object-cover" />;
  }

  return (
    <div
      className="w-full h-full p-3 flex flex-col justify-between text-white"
      style={{ background: `linear-gradient(145deg, ${book.coverColor || "#1479F2"}, #0B2D5C)` }}
    >
      <BookOpen size={20} />
      <div>
        <p className="text-[10px] font-semibold leading-tight line-clamp-3">{book.title}</p>
        <p className="text-[8px] text-white/70 mt-1">{book.subject}</p>
      </div>
    </div>
  );
}

function BookModal({ mode, form, setForm, onClose, onSave, onRemove, books, groups }) {
  const isEdit = mode === "edit";
  const isRemove = mode === "remove";

  if (isRemove) {
    const target = books.find((b) => b.id === form.id);
    return (
      <div className="fixed inset-0 z-50 bg-[#0B2D5C]/35 backdrop-blur-[2px] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] p-6">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
              <Trash2 size={21} />
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F4F8FD] text-[#64748B]" aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <h3 className="mt-5 text-lg font-bold text-[#102A43]">Remove {target?.title}?</h3>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            This book will no longer appear in the {target?.className} book list. This action can be undone by adding the book again.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC]">
              Cancel
            </button>
            <button onClick={onRemove} className="px-4 py-2.5 rounded-xl bg-[#DC2626] text-white text-sm font-semibold hover:bg-[#B91C1C]">
              Remove Book
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0B2D5C]/35 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-[#E2E8F0]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-lg font-bold text-[#102A43]">{isEdit ? "Edit Book" : "Add Book to Class"}</h3>
            <p className="text-xs text-[#64748B] mt-1">Manage the books assigned to a class.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F4F8FD] text-[#64748B]" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSave} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold text-[#334155]">Class</span>
              <select
                value={form.className}
                onChange={(e) => setForm((p) => ({ ...p, className: e.target.value }))}
                required
                className="mt-1.5 w-full px-3.5 py-2.75 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#1479F2]/15 focus:border-[#1479F2]"
              >
                <option value="">Select class</option>
                {groups.flatMap((group) => group.classes).map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-[#334155]">Subject</span>
              <input
                value={form.subject}
                onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                required
                placeholder="e.g. Mathematics"
                className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#102A43] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1479F2]/15 focus:border-[#1479F2]"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold text-[#334155]">Book Title</span>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                required
                placeholder="Enter book title"
                className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#102A43] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1479F2]/15 focus:border-[#1479F2]"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-[#334155]">Copies Assigned</span>
              <input
                type="number"
                min="0"
                value={form.copies}
                onChange={(e) => setForm((p) => ({ ...p, copies: e.target.value }))}
                required
                placeholder="e.g. 50"
                className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#1479F2]/15 focus:border-[#1479F2]"
              />
            </label>
          </div>

          <div>
            <label htmlFor="cover-image-path" className="text-xs font-semibold text-[#334155]">Book Image Path</label>
            <div className="mt-1.5 flex gap-4 items-center">
              <div className="w-20 h-24 rounded-xl overflow-hidden border border-[#CBD5E1] bg-[#F4F8FD] shrink-0">
                {form.image ? <img src={form.image} alt="Book preview" className="w-full h-full object-cover" /> : <div className="h-full flex flex-col items-center justify-center text-[#94A3B8]"><ImagePlus size={20} /><span className="text-[9px] mt-1">Preview</span></div>}
              </div>
              <input
                id="cover-image-path"
                type="text"
                value={form.image}
                onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
                placeholder="Paste an image URL or existing storage path"
                className="min-w-0 flex-1 px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#102A43] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1479F2]/15 focus:border-[#1479F2]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC]">
              Cancel
            </button>
            <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1479F2] text-white text-sm font-semibold hover:bg-[#0F6AD6] shadow-sm">
              <BookPlus size={17} />
              {isEdit ? "Save Changes" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ClassBooks() {
  const { classes, classBooks: books, saveBook: persistBook, removeBook: deleteBook } = useEduStock();
  const [selectedClass, setSelectedClass] = useState(null);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const classCount = (className) => books.filter((book) => book.className === className).length;
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

  const subjects = useMemo(() => {
    if (!selectedClass) return [];
    return ["All Subjects", ...new Set(books.filter((b) => b.className === selectedClass).map((b) => b.subject))];
  }, [books, selectedClass]);

  const selectedBooks = useMemo(() => {
    if (!selectedClass) return [];
    return books.filter((book) => {
      const matchesClass = book.className === selectedClass;
      const matchesSearch = `${book.title} ${book.subject}`.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = subjectFilter === "All Subjects" || book.subject === subjectFilter;
      return matchesClass && matchesSearch && matchesSubject;
    });
  }, [books, selectedClass, search, subjectFilter]);

  const openAdd = () => {
    setForm({ ...emptyForm, className: selectedClass || "" });
    setModal("add");
  };

  const openEdit = (book) => {
    setForm({ ...book, copies: String(book.copies) });
    setModal("edit");
  };

  const openRemove = (book) => {
    setForm({ id: book.id });
    setModal("remove");
  };

  const closeModal = () => {
    setModal(null);
    setForm(emptyForm);
  };

  const saveBook = async (event) => {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      subject: form.subject.trim(),
      className: form.className,
      copies: Math.max(0, Number(form.copies) || 0),
      image: form.image || "",
      coverColor: form.coverColor || "#1479F2",
    };

    const result = await persistBook(payload, form.id);
    if (!result.ok) {
      window.alert(result.reason);
      return;
    }
    setSelectedClass(payload.className);
    closeModal();
  };

  const removeBook = async () => {
    const result = await deleteBook(form.id);
    if (!result.ok) {
      window.alert(result.reason);
      return;
    }
    closeModal();
  };

  const openClass = (name) => {
    setSelectedClass(name);
    setSearch("");
    setSubjectFilter("All Subjects");
  };

  return (
    <div className="space-y-6">
      {!selectedClass ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#102A43]">Class Books</h2>
              <p className="text-sm text-[#64748B] mt-1">Select a class to view and manage its books.</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#EAF3FF] text-[#1479F2] text-sm font-semibold">
              <BookOpen size={18} />
              Manage books for all classes
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-sm">
            {classGroups.map((group) => (
              <section key={group.id} className="mb-7 last:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap size={17} className="text-[#1479F2]" />
                  <h3 className="text-sm font-bold text-[#102A43]">{group.title}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {group.classes.map((className) => (
                    <button
                      key={className}
                      onClick={() => openClass(className)}
                      className="group flex items-center gap-3 p-3.5 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#1479F2]/40 hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
                    >
                      <ClassIcon className={className} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-[#102A43]">{className}</span>
                        <span className="block text-xs text-[#64748B] mt-0.5">{classCount(className)} {classCount(className) === 1 ? "book" : "books"}</span>
                      </span>
                      <ChevronRight size={17} className="text-[#94A3B8] group-hover:text-[#1479F2] transition-colors" />
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => setSelectedClass(null)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1479F2] hover:text-[#0F6AD6]"
          >
            <ArrowLeft size={17} /> Back to Classes
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <ClassIcon className={selectedClass} />
                <div>
                  <h2 className="text-2xl font-bold text-[#102A43]">{selectedClass} Books</h2>
                  <p className="text-sm text-[#64748B] mt-0.5">Books assigned to {selectedClass}.</p>
                </div>
              </div>
            </div>
            <button onClick={openAdd} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1479F2] text-white text-sm font-semibold hover:bg-[#0F6AD6] shadow-sm">
              <Plus size={18} /> Add Book
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4"><p className="text-xs text-[#64748B]">Books Assigned</p><p className="text-xl font-bold text-[#102A43] mt-1">{books.filter((b) => b.className === selectedClass).length}</p></div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4"><p className="text-xs text-[#64748B]">Total Copies</p><p className="text-xl font-bold text-[#102A43] mt-1">{books.filter((b) => b.className === selectedClass).reduce((s, b) => s + Number(b.copies), 0)}</p></div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4"><p className="text-xs text-[#64748B]">Subjects</p><p className="text-xl font-bold text-[#102A43] mt-1">{new Set(books.filter((b) => b.className === selectedClass).map((b) => b.subject)).size}</p></div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4"><p className="text-xs text-[#64748B]">Low / Out</p><p className="text-xl font-bold text-[#DC2626] mt-1">{books.filter((b) => b.className === selectedClass && Number(b.copies) <= 15).length}</p></div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search books..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F8FD] border border-transparent text-sm text-[#102A43] placeholder:text-[#94A3B8] focus:bg-white focus:border-[#1479F2] focus:outline-none" />
              </div>
              <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="md:w-48 px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#334155] focus:outline-none focus:border-[#1479F2]">
                {subjects.map((subject) => <option key={subject}>{subject}</option>)}
              </select>
            </div>
          </div>

          {selectedBooks.length === 0 ? (
            <div className="bg-white border border-dashed border-[#CBD5E1] rounded-2xl p-12 text-center">
              <BookOpen size={32} className="mx-auto text-[#94A3B8]" />
              <h3 className="mt-3 font-semibold text-[#102A43]">No books found</h3>
              <p className="text-sm text-[#64748B] mt-1">Add a book or change your search/filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {selectedBooks.map((book) => (
                <article key={book.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 rounded-xl overflow-hidden bg-[#F4F8FD] border border-[#E2E8F0]">
                    <BookCover book={book} />
                  </div>
                  <div className="pt-3 px-1">
                    <h3 className="font-bold text-sm text-[#102A43] line-clamp-2 min-h-10">{book.title}</h3>
                    <p className="text-xs text-[#64748B] mt-1">{book.subject}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs font-semibold text-[#334155]">{book.copies} copies</span>
                      <StatusBadge copies={book.copies} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button onClick={() => openEdit(book)} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#93C5FD] text-[#1479F2] text-xs font-semibold hover:bg-[#EAF3FF]"><Edit3 size={14} /> Edit</button>
                      <button onClick={() => openRemove(book)} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#FCA5A5] text-[#DC2626] text-xs font-semibold hover:bg-[#FEF2F2]"><Trash2 size={14} /> Remove</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      <div className="pt-3 flex items-center justify-between border-t border-[#E2E8F0] text-xs text-[#94A3B8]">
        <span>© 2026 Jobade Academy | School Book Inventory</span>
        <span className="hidden sm:block">Better Books • Brighter Futures</span>
      </div>

      {modal && <BookModal mode={modal} form={form} setForm={setForm} onClose={closeModal} onSave={saveBook} onRemove={removeBook} books={books} groups={classGroups} />}
    </div>
  );
}

export default ClassBooks;
