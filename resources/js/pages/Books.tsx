import { useState, useEffect, useCallback } from 'react'
import { Head, router, usePage } from '@inertiajs/react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Search, Filter, BookMarked, BookOpen, ChevronUp, ChevronDown, ChevronsUpDown, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import Layout from '@/layouts/Layout';

const btn = 'min-w-[32px] h-8 px-2 rounded text-sm font-medium flex items-center justify-center transition-colors select-none';

const StatusBadge = ({ book }) => {
    const s = book.display_status || book.status;
    const styles = {
        available:   'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20',
        unavailable: 'bg-red-500/15 text-red-300 ring-1 ring-red-400/20',
        archived:    'bg-white/8 text-white/40 ring-1 ring-white/10',
    };
    return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${styles[s]}`}>{s}</span>;
};

function Pagination({ books, search, categoryFilter, statusFilter, sort }) {
    const [maxVisible, setMaxVisible] = useState(5);
    const calc = useCallback(() => {
        const w = window.innerWidth;
        setMaxVisible(w < 380 ? 3 : w < 480 ? 4 : w < 640 ? 5 : w < 768 ? 7 : 9);
    }, []);
    useEffect(() => { calc(); window.addEventListener('resize', calc); return () => window.removeEventListener('resize', calc); }, [calc]);

    const navigate = (url) => {
        if (!url) return;
        const page = new URL(url).searchParams.get('page');
        router.get('/books', { search, category: categoryFilter, status: statusFilter, sort: sort.col, direction: sort.dir, page }, { preserveState: true, replace: true });
    };

    const prev    = books.links[0];
    const next    = books.links[books.links.length - 1];
    const pages   = books.links.slice(1, -1);
    const total   = pages.length;
    const cur     = pages.findIndex(l => l.active);
    let start     = Math.max(0, cur - Math.floor(maxVisible / 2));
    let end       = Math.min(total, start + maxVisible);
    start         = Math.max(0, end - maxVisible);
    const visible = pages.slice(start, end);

    const NavBtn = ({ link, children }) => link?.url
        ? <button onClick={() => navigate(link.url)} className={`${btn} bg-white/10 hover:bg-white/20 text-white/60 hover:text-white border border-white/10`}>{children}</button>
        : <span className={`${btn} bg-white/5 text-white/20 cursor-not-allowed pointer-events-none border border-white/5`}>{children}</span>;

    const PageBtn = ({ l, label }) => (
        <button onClick={() => navigate(l?.url)} disabled={!l?.url}
            className={`${btn} ${l?.active
                ? 'bg-gradient-to-r from-slate-200 to-white text-slate-900 shadow-lg shadow-white/10 border-0'
                : l?.url
                ? 'bg-white/10 hover:bg-white/20 text-white/60 hover:text-white border border-white/10'
                : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
            }`}>
            {label ?? l?.label}
        </button>
    );

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl my-4 px-4 py-3">
            <p className="text-sm text-white/50 whitespace-nowrap">Showing {books.from}–{books.to} of {books.total}</p>
            <div className="flex items-center gap-1 flex-nowrap">
                <NavBtn link={prev}><ChevronLeft className="w-4 h-4" /></NavBtn>
                {start > 0 && <><PageBtn l={pages[0]} label="1" /><span className={`${btn} text-white/30`}>…</span></>}
                {visible.map((l, i) => <PageBtn key={i} l={l} />)}
                {end < total && <><span className={`${btn} text-white/30`}>…</span><PageBtn l={pages[total - 1]} /></>}
                <NavBtn link={next}><ChevronRight className="w-4 h-4" /></NavBtn>
            </div>
        </div>
    );
}

const COLS = [
    { key: "title",            label: "Title"  },
    { key: "author",           label: "Author" },
    { key: "category.name",    label: "Genre"  },
    { key: "published_year",   label: "Year"   },
    { key: "available_copies", label: "Copies" },
    { key: "display_status",   label: "Status" },
];

export default function Books({ books, categories, filters }) {

    const { auth } = usePage().props

    const [search,         setSearch]         = useState(filters?.search   || '');
    const [categoryFilter, setCategoryFilter] = useState(filters?.category || '');
    const [statusFilter,   setStatusFilter]   = useState(filters?.status   || '');
    const [sort,           setSort]           = useState({ col: filters?.sort || 'title', dir: filters?.direction || 'asc' });

    useEffect(() => {
        const handler = setTimeout(() => {
            router.get('/books', { search, category: categoryFilter, status: statusFilter, sort: sort.col, direction: sort.dir }, { preserveState: true, replace: true });
        }, 400);
        return () => clearTimeout(handler);
    }, [search, categoryFilter, statusFilter, sort]);

    const toggleSort  = (col) => setSort(prev => ({ col, dir: prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc' }));
    const handleReset = () => { setSearch(''); setCategoryFilter(''); setStatusFilter(''); setSort({ col: 'title', dir: 'asc' }); router.get('/books'); };

    const SortIcon = ({ col }) => sort.col !== col
        ? <ChevronsUpDown size={13} className="text-white/20" />
        : sort.dir === 'asc'
            ? <ChevronUp   size={13} className="text-white/80" />
            : <ChevronDown size={13} className="text-white/80" />;

    return (
        <Layout>
            <Head title="Books" />

            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
                <div className="absolute top-10 left-1/3 w-[500px] h-[300px] bg-slate-600/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-20 right-1/3 w-[400px] h-[300px] bg-slate-400/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative pt-16 mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent">All Books</h2>
                <p className="text-sm text-white/40 mt-1">{books.total} total books</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/30">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none" />

                {/* Search / Filter bar */}
                <div className="relative flex items-center gap-3 bg-black/20 border-b border-white/8 px-4 py-3">
                    <div className="relative flex-1 max-w-xs">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                            type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search books…"
                            className="w-full rounded-lg bg-white/8 py-2 pl-8 pr-3 text-xs text-white placeholder-white/30 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-white/25 transition-all"
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1.5 rounded-lg bg-white/8 px-3 py-2 text-xs text-white/60 ring-1 ring-white/10 hover:bg-white/15 transition-colors">
                                <Filter size={13} /> Filter
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Category</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={categoryFilter} onValueChange={setCategoryFilter}>
                                <DropdownMenuRadioItem value="">All Categories</DropdownMenuRadioItem>
                                {categories.map(cat => <DropdownMenuRadioItem key={cat.id} value={cat.id}>{cat.name}</DropdownMenuRadioItem>)}
                            </DropdownMenuRadioGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                                <DropdownMenuRadioItem value="">All Status</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="available">Available</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="unavailable">Unavailable</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="archived">Archived</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleReset} className="text-red-400 focus:text-red-300">Reset Filters</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Table */}
                <div className="relative overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-white/8 bg-black/10">
                                <th className="px-3 py-3 text-left font-semibold text-white/40 uppercase tracking-wider">Book</th>
                                {COLS.map(c => (
                                    <th key={c.key} onClick={() => toggleSort(c.key)} className="px-3 py-3 text-left font-semibold text-white/40 uppercase tracking-wider cursor-pointer select-none hover:text-white/70 transition-colors">
                                        <span className="flex items-center gap-1">{c.label} <SortIcon col={c.key} /></span>
                                    </th>
                                ))}
                                <th className="px-3 py-3 text-center font-semibold text-white/40 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.data.length > 0 ? books.data.map((book, i) => (
                                <tr key={book.id} className={`border-b border-white/5 transition-all hover:bg-white/8 ${i % 2 === 0 ? 'bg-transparent' : 'bg-white/3'}`}>
                                    <td className="px-3 py-3">
                                        {book.image_url
                                            ? <img src={book.image_url} alt={book.title} className="w-10 h-14 object-cover rounded-lg shadow-md shadow-black/50" />
                                            : <div className="w-10 h-14 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white/30">
                                                <BookOpen className="w-5 h-5" />
                                              </div>
                                        }
                                    </td>
                                    <td className="px-3 py-3 text-white font-medium max-w-[180px] truncate">{book.title}</td>
                                    <td className="px-3 py-3 text-white/55">{book.author}</td>
                                    <td className="px-3 py-3 text-white/55">{book.category?.name || 'N/A'}</td>
                                    <td className="px-3 py-3 text-white/55">{book.published_year}</td>
                                    <td className="px-3 py-3 text-center">
                                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                            book.available_copies > 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-orange-500/15 text-orange-300'
                                        }`}>
                                            {book.available_copies}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3"><StatusBadge book={book} /></td>

                                    {/* ── ACTIONS ── */}
                                    <td className="px-3 py-3">
                                        <div className="flex items-center justify-center gap-1.5">

                                            {/* View — always visible, clean white pill */}
                                            <Link
                                                href={`/books/${book.id}`}
                                                className="group flex items-center gap-1.5 h-7 pl-2 pr-3 rounded-full bg-white/10 hover:bg-white text-white/60 hover:text-zinc-900 border border-white/10 hover:border-transparent transition-all duration-200 hover:shadow-md hover:shadow-white/10 active:scale-95"
                                            >
                                                <Eye size={11} className="flex-shrink-0" />
                                                <span className="text-[10px] font-semibold">View</span>
                                            </Link>

                                            {/* Borrow — only for auth users */}
                                            {auth?.user && (
                                                book.available_copies > 0 ? (
                                                    <Link
                                                        href={`/borrow/${book.id}`}
                                                        className="group relative flex items-center gap-1.5 h-7 pl-2 pr-3 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/30 hover:border-transparent transition-all duration-200 hover:shadow-md hover:shadow-emerald-500/20 active:scale-95 overflow-hidden"
                                                    >
                                                        {/* Subtle pulse dot indicator */}
                                                        <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                                                        </span>
                                                        <BookMarked size={11} className="flex-shrink-0" />
                                                        <span className="text-[10px] font-semibold">Borrow</span>
                                                    </Link>
                                                ) : (
                                                    /* Unavailable — muted, disabled look */
                                                    <span className="flex items-center gap-1.5 h-7 pl-2 pr-3 rounded-full bg-white/4 text-white/20 border border-white/6 cursor-not-allowed">
                                                        <BookMarked size={11} className="flex-shrink-0" />
                                                        <span className="text-[10px] font-semibold">Unavailable</span>
                                                    </span>
                                                )
                                            )}

                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" className="px-4 py-16 text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 flex items-center justify-center mx-auto mb-4">
                                            <BookOpen className="w-8 h-8 text-white/20" />
                                        </div>
                                        <p className="text-white/30 font-medium">No books found</p>
                                        <p className="text-white/20 text-xs mt-1">Try adjusting your search or filters</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {books.data.length > 0 && books.last_page > 1 && (
                <Pagination books={books} search={search} categoryFilter={categoryFilter} statusFilter={statusFilter} sort={sort} />
            )}
        </Layout>
    );
}
