import { useState } from "react";
import { router } from "@inertiajs/react";
import {
  BookOpen, Search, Plus, Edit2, Trash2, ChevronUp,
  ChevronDown, ChevronsUpDown, Eye, Filter, Download,
} from "lucide-react";

const COLS = [
  { key: "title",   label: "Title" },
  { key: "author",  label: "Author" },
  { key: "genre",   label: "Genre" },
  { key: "year",    label: "Year" },
  { key: "copies",  label: "Copies" },
  { key: "status",  label: "Status" },
];

const STATUS = {
  available:  "bg-emerald-100 text-emerald-700 ring-emerald-200",
  borrowed:   "bg-amber-100  text-amber-700  ring-amber-200",
  reserved:   "bg-sky-100    text-sky-700    ring-sky-200",
  lost:       "bg-red-100    text-red-700    ring-red-200",
};

const SAMPLE = [
  { id:1, title:"The Great Gatsby",         author:"F. Scott Fitzgerald", genre:"Classic",    year:1925, copies:4, status:"available" },
  { id:2, title:"To Kill a Mockingbird",    author:"Harper Lee",          genre:"Fiction",    year:1960, copies:2, status:"borrowed"  },
  { id:3, title:"1984",                     author:"George Orwell",       genre:"Dystopian",  year:1949, copies:5, status:"available" },
  { id:4, title:"Pride and Prejudice",      author:"Jane Austen",         genre:"Romance",    year:1813, copies:3, status:"reserved"  },
  { id:5, title:"The Catcher in the Rye",   author:"J.D. Salinger",       genre:"Fiction",    year:1951, copies:1, status:"lost"      },
  { id:6, title:"Brave New World",          author:"Aldous Huxley",       genre:"Dystopian",  year:1932, copies:6, status:"available" },
  { id:7, title:"The Hobbit",               author:"J.R.R. Tolkien",      genre:"Fantasy",    year:1937, copies:8, status:"borrowed"  },
  { id:8, title:"Fahrenheit 451",           author:"Ray Bradbury",        genre:"Sci-Fi",     year:1953, copies:3, status:"available" },
];

const SortIcon = ({ col, sort }) => {
  if (sort.col !== col) return <ChevronsUpDown size={13} className="text-emerald-300" />;
  return sort.dir === "asc" ? <ChevronUp size={13} className="text-emerald-400" /> : <ChevronDown size={13} className="text-emerald-400" />;
};

export default function BooksTable({ books = SAMPLE }) {
  const [q, setQ]         = useState("");
  const [sort, setSort]   = useState({ col: "title", dir: "asc" });
  const [page, setPage]   = useState(1);
  const [sel, setSel]     = useState([]);
  const PER = 5;

  const toggleSort = (col) =>
    setSort(s => ({ col, dir: s.col === col && s.dir === "asc" ? "desc" : "asc" }));

  const filtered = books
    .filter(b => [b.title, b.author, b.genre].some(v => v.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => {
      const [av, bv] = [a[sort.col], b[sort.col]];
      return (av < bv ? -1 : av > bv ? 1 : 0) * (sort.dir === "asc" ? 1 : -1);
    });

  const pages   = Math.ceil(filtered.length / PER);
  const visible = filtered.slice((page - 1) * PER, page * PER);
  const allSel  = visible.every(b => sel.includes(b.id));

  const toggleAll  = () => setSel(allSel ? sel.filter(id => !visible.find(b => b.id === id)) : [...new Set([...sel, ...visible.map(b => b.id)])]);
  const toggleOne  = (id) => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const del = (id) => router.delete(`/books/${id}`, { preserveScroll: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 p-6 font-sans">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/30">
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Library Books</h1>
            <p className="text-xs text-emerald-400">{filtered.length} records</p>
          </div>
        </div>
        <div className="flex gap-2">
          {sel.length > 0 && (
            <button className="flex items-center gap-1.5 rounded-lg bg-red-500/20 px-3 py-2 text-xs font-medium text-red-300 ring-1 ring-red-500/30 hover:bg-red-500/30 transition-colors">
              <Trash2 size={13} /> Delete ({sel.length})
            </button>
          )}
          <button className="flex items-center gap-1.5 rounded-lg bg-emerald-800/60 px-3 py-2 text-xs font-medium text-emerald-300 ring-1 ring-emerald-700/50 hover:bg-emerald-700/60 transition-colors">
            <Download size={13} /> Export
          </button>
          <button
            onClick={() => router.visit("/books/create")}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/30 hover:bg-emerald-400 transition-colors"
          >
            <Plus size={13} /> Add Book
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-2xl bg-emerald-900/40 ring-1 ring-emerald-700/40 backdrop-blur-sm shadow-2xl">
        {/* Search / Filter bar */}
        <div className="flex items-center gap-3 border-b border-emerald-800/50 px-4 py-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
            <input
              value={q}
              onChange={e => { setQ(e.target.value); setPage(1); }}
              placeholder="Search books…"
              className="w-full rounded-lg bg-emerald-950/60 py-2 pl-8 pr-3 text-xs text-emerald-100 placeholder-emerald-600 ring-1 ring-emerald-800 focus:outline-none focus:ring-emerald-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-lg bg-emerald-800/50 px-3 py-2 text-xs text-emerald-400 ring-1 ring-emerald-700/40 hover:bg-emerald-700/50 transition-colors">
            <Filter size={13} /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-emerald-800/50 bg-emerald-950/30">
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={allSel} onChange={toggleAll}
                    className="rounded border-emerald-700 bg-emerald-900 accent-emerald-500 cursor-pointer" />
                </th>
                {COLS.map(c => (
                  <th key={c.key}
                    onClick={() => toggleSort(c.key)}
                    className="px-3 py-3 text-left font-semibold text-emerald-400 uppercase tracking-wider cursor-pointer select-none hover:text-emerald-200 transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      {c.label} <SortIcon col={c.key} sort={sort} />
                    </span>
                  </th>
                ))}
                <th className="px-3 py-3 text-right font-semibold text-emerald-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr><td colSpan={8} className="py-16 text-center text-emerald-600">No books found.</td></tr>
              ) : visible.map((b, i) => (
                <tr key={b.id}
                  className={`border-b border-emerald-900/50 transition-colors hover:bg-emerald-800/20 ${sel.includes(b.id) ? "bg-emerald-800/30" : i % 2 === 0 ? "" : "bg-emerald-950/20"}`}
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={sel.includes(b.id)} onChange={() => toggleOne(b.id)}
                      className="rounded border-emerald-700 bg-emerald-900 accent-emerald-500 cursor-pointer" />
                  </td>
                  <td className="px-3 py-3 font-medium text-white max-w-[180px] truncate">{b.title}</td>
                  <td className="px-3 py-3 text-emerald-300">{b.author}</td>
                  <td className="px-3 py-3 text-emerald-400">{b.genre}</td>
                  <td className="px-3 py-3 text-emerald-400">{b.year}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${b.copies > 3 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                      {b.copies}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ring-1 ${STATUS[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex justify-end gap-1">
                      {[
                        { icon: Eye,   cls: "hover:bg-sky-500/20 hover:text-sky-400",     action: () => router.visit(`/books/${b.id}`) },
                        { icon: Edit2, cls: "hover:bg-emerald-500/20 hover:text-emerald-300", action: () => router.visit(`/books/${b.id}/edit`) },
                        { icon: Trash2,cls: "hover:bg-red-500/20 hover:text-red-400",     action: () => del(b.id) },
                      ].map(({ icon: Icon, cls, action }, idx) => (
                        <button key={idx} onClick={action}
                          className={`rounded-lg p-1.5 text-emerald-600 transition-all ${cls}`}>
                          <Icon size={13} />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-emerald-800/50 px-4 py-3">
          <span className="text-xs text-emerald-600">
            Showing {Math.min((page-1)*PER+1, filtered.length)}–{Math.min(page*PER, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`h-7 w-7 rounded-lg text-xs font-medium transition-all ${p === page ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" : "text-emerald-500 hover:bg-emerald-800/50 hover:text-emerald-300"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}