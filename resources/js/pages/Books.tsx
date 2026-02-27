import { useState, useEffect, useCallback } from 'react'
import { Head, router, usePage } from '@inertiajs/react'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup,
    DropdownMenuRadioItem, DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Search, Filter, BookMarked, BookOpen, ChevronUp, ChevronDown, ChevronsUpDown, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { toast } from 'sonner';
import Layout from '@/layouts/Layout';
import BorrowModal from '@/components/BorrowModal';

const btn = 'min-w-[32px] h-8 px-2 rounded text-sm font-medium flex items-center justify-center transition-colors select-none';

const StatusBadge = ({ book }) => {
    const s = book.display_status || book.status;
    const styles = {
        available:   'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/20',
        unavailable: 'bg-red-50 text-red-600 ring-1 ring-red-200 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-400/20',
        archived:    'bg-zinc-100 text-zinc-400 ring-1 ring-zinc-200 dark:bg-white/8 dark:text-white/40 dark:ring-white/10',
    };
    return (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${styles[s] ?? styles.archived}`}>
            {s}
        </span>
    );
};

function Pagination({ books, search, categoryFilter, statusFilter, sort }) {
    const [maxVisible, setMaxVisible] = useState(5);
    const calc = useCallback(() => {
        const w = window.innerWidth;
        setMaxVisible(w < 380 ? 3 : w < 480 ? 4 : w < 640 ? 5 : w < 768 ? 7 : 9);
    }, []);
    useEffect(() => {
        calc();
        window.addEventListener('resize', calc);
        return () => window.removeEventListener('resize', calc);
    }, [calc]);

    const navigate = (url) => {
        if (!url) return;
        const page = new URL(url).searchParams.get('page');
        router.get('/books', {
            search, category: categoryFilter, status: statusFilter,
            sort: sort.col, direction: sort.dir, page
        }, { preserveState: true, replace: true });
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
        ? <button onClick={() => navigate(link.url)} className={`${btn} bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-800 border border-zinc-200 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white/60 dark:hover:text-white dark:border-white/10`}>{children}</button>
        : <span className={`${btn} bg-zinc-50 text-zinc-300 cursor-not-allowed pointer-events-none border border-zinc-100 dark:bg-white/5 dark:text-white/20 dark:border-white/5`}>{children}</span>;

    const PageBtn = ({ l, label }) => (
        <button
            onClick={() => navigate(l?.url)}
            disabled={!l?.url}
            className={`${btn} ${
                l?.active
                    ? 'bg-zinc-900 text-white shadow-md border-0 dark:bg-gradient-to-r dark:from-slate-200 dark:to-white dark:text-slate-900 dark:shadow-white/10'
                    : l?.url
                    ? 'bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-800 border border-zinc-200 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white/60 dark:hover:text-white dark:border-white/10'
                    : 'bg-zinc-50 text-zinc-300 cursor-not-allowed border border-zinc-100 dark:bg-white/5 dark:text-white/20 dark:border-white/5'
            }`}
        >
            {label ?? l?.label}
        </button>
    );

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-zinc-200 shadow-sm rounded-xl my-4 px-4 py-3 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10 dark:shadow-none">
            <p className="text-sm text-zinc-400 whitespace-nowrap dark:text-white/50">
                Showing {books.from}–{books.to} of {books.total}
            </p>
            <div className="flex items-center gap-1 flex-nowrap">
                <NavBtn link={prev}><ChevronLeft className="w-4 h-4" /></NavBtn>
                {start > 0 && (
                    <>
                        <PageBtn l={pages[0]} label="1" />
                        <span className={`${btn} text-zinc-300 dark:text-white/30`}>…</span>
                    </>
                )}
                {visible.map((l, i) => <PageBtn key={i} l={l} />)}
                {end < total && (
                    <>
                        <span className={`${btn} text-zinc-300 dark:text-white/30`}>…</span>
                        <PageBtn l={pages[total - 1]} />
                    </>
                )}
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

export default function Books({ books, categories, filters, borrowedBookIds = [] }) {
    const { auth } = usePage().props;

    const [search,         setSearch]         = useState(filters?.search   || '');
    const [categoryFilter, setCategoryFilter] = useState(filters?.category || '');
    const [statusFilter,   setStatusFilter]   = useState(filters?.status   || '');
    const [sort,           setSort]           = useState({ col: filters?.sort || 'title', dir: filters?.direction || 'asc' });
    const [borrowModal,    setBorrowModal]    = useState({ open: false, book: null });

    const handleBorrowClick = (book) => {
        if (borrowedBookIds.includes(book.id)) {
            toast.error('You already have an active borrow for this book.', { description: book.title });
            return;
        }
        setBorrowModal({ open: true, book });
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            router.get('/books', {
                search, category: categoryFilter,
                status: statusFilter, sort: sort.col, direction: sort.dir
            }, { preserveState: true, replace: true });
        }, 400);
        return () => clearTimeout(handler);
    }, [search, categoryFilter, statusFilter, sort]);

    const toggleSort  = (col) => setSort(prev => ({ col, dir: prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc' }));
    const handleReset = () => {
        setSearch(''); setCategoryFilter(''); setStatusFilter('');
        setSort({ col: 'title', dir: 'asc' });
        router.get('/books');
    };

    const SortIcon = ({ col }) => sort.col !== col
        ? <ChevronsUpDown size={13} className="text-zinc-300 dark:text-white/20" />
        : sort.dir === 'asc'
            ? <ChevronUp   size={13} className="text-zinc-600 dark:text-white/80" />
            : <ChevronDown size={13} className="text-zinc-600 dark:text-white/80" />;

    return (
        <Layout>
            <Head title="Books" />

            {/* Background blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
                <div className="absolute top-10 left-1/3 w-[500px] h-[300px] bg-blue-100/60 rounded-full blur-[140px] dark:bg-slate-600/10" />
                <div className="absolute bottom-20 right-1/3 w-[400px] h-[300px] bg-violet-100/40 rounded-full blur-[120px] dark:bg-slate-400/10" />
            </div>

            {/* Page header */}
            <div className="relative pt-16 mb-6">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:via-white/90 dark:to-white/50 dark:bg-clip-text">
                    All Books
                </h2>
                <p className="text-sm text-zinc-400 mt-1 dark:text-white/40">{books.total} total books</p>
            </div>

            {/* Main card */}
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 shadow-sm bg-white dark:bg-transparent dark:border-white/10 dark:shadow-2xl dark:shadow-black/30">

                {/* Top shimmer line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-white/30" />

                {/* Dark mode inner bg overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none hidden dark:block" />

                {/* Search / Filter bar */}
                <div className="relative flex items-center justify-center gap-3 bg-zinc-50 border-b border-zinc-200 px-4 py-3 dark:bg-black/20 dark:border-white/8">
                    <div className="relative flex-1 max-w-xs">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-white/30" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search books…"
                            className="w-full rounded-lg bg-white py-2 pl-8 pr-3 text-xs text-zinc-800 placeholder-zinc-400 ring-1 ring-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all shadow-sm dark:bg-white/8 dark:text-white dark:placeholder-white/30 dark:ring-white/10 dark:focus:ring-white/25 dark:shadow-none"
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50 transition-colors shadow-sm dark:bg-white/8 dark:text-white/60 dark:ring-white/10 dark:hover:bg-white/15 dark:shadow-none">
                                <Filter size={13} /> Filter
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Category</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={categoryFilter} onValueChange={setCategoryFilter}>
                                <DropdownMenuRadioItem value="">All Categories</DropdownMenuRadioItem>
                                {categories.map(cat => (
                                    <DropdownMenuRadioItem key={cat.id} value={cat.id}>{cat.name}</DropdownMenuRadioItem>
                                ))}
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
                            <DropdownMenuItem onClick={handleReset} className="text-red-500 focus:text-red-400 dark:text-red-400 dark:focus:text-red-300">
                                Reset Filters
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Table */}
                <div className="relative overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50/80 dark:border-white/8 dark:bg-black/10">
                                <th className="px-3 py-3 text-left font-semibold text-zinc-400 uppercase tracking-wider dark:text-white/40">Book</th>
                                {COLS.map(c => (
                                    <th
                                        key={c.key}
                                        onClick={() => toggleSort(c.key)}
                                        className="px-3 py-3 text-left font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer select-none hover:text-zinc-700 transition-colors dark:text-white/40 dark:hover:text-white/70"
                                    >
                                        <span className="flex items-center gap-1">{c.label} <SortIcon col={c.key} /></span>
                                    </th>
                                ))}
                                <th className="px-3 py-3 text-center font-semibold text-zinc-400 uppercase tracking-wider dark:text-white/40">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.data.length > 0 ? books.data.map((book, i) => (
                                <tr
                                    key={book.id}
                                    className={`border-b border-zinc-100 transition-all hover:bg-zinc-50 dark:border-white/5 dark:hover:bg-white/8 ${
                                        i % 2 === 0
                                            ? 'bg-white dark:bg-transparent'
                                            : 'bg-zinc-50/50 dark:bg-white/3'
                                    }`}
                                >
                                    {/* Cover */}
                                    <td className="px-3 py-3">
                                        {book.image_url
                                            ? <img src={book.image_url} alt={book.title} className="w-10 h-14 object-cover rounded-lg ring-1 ring-zinc-200 dark:ring-white/10" />
                                            : <div className="w-10 h-14 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-600">
                                                <BookOpen className="w-5 h-5" />
                                              </div>
                                        }
                                    </td>

                                    <td className="px-3 py-3 text-zinc-800 font-medium max-w-[180px] truncate dark:text-white">{book.title}</td>
                                    <td className="px-3 py-3 text-zinc-500 dark:text-white/55">{book.author}</td>
                                    <td className="px-3 py-3 text-zinc-500 dark:text-white/55">{book.category?.name || 'N/A'}</td>
                                    <td className="px-3 py-3 text-zinc-500 dark:text-white/55">{book.published_year}</td>

                                    {/* Copies badge */}
                                    <td className="px-3 py-3 text-center">
                                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                            book.available_copies > 0
                                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-0'
                                                : 'bg-orange-50 text-orange-600 ring-1 ring-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:ring-0'
                                        }`}>
                                            {book.available_copies}
                                        </span>
                                    </td>

                                    <td className="px-3 py-3"><StatusBadge book={book} /></td>

                                    {/* Actions */}
                                    <td className="px-3 py-3">
                                        <div className="flex items-center justify-center gap-1.5">

                                            {/* View */}
                                            <Link
                                                href={`/books/${book.id}`}
                                                className="group flex items-center gap-1.5 h-7 pl-2 pr-3 rounded-full bg-zinc-100 hover:bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-200 hover:border-transparent transition-all duration-200 hover:shadow-md active:scale-95 dark:bg-white/10 dark:hover:bg-white dark:text-white/60 dark:hover:text-zinc-900 dark:border-white/10 dark:hover:border-transparent dark:hover:shadow-white/10"
                                            >
                                                <Eye size={11} className="flex-shrink-0" />
                                                <span className="text-[10px] font-semibold">View</span>
                                            </Link>

                                            {/* Borrow */}
                                            {auth?.user && (
                                                book.available_copies > 0 ? (
                                                    <button
                                                        onClick={() => handleBorrowClick(book)}
                                                        className="group relative flex items-center gap-1.5 h-7 pl-2 pr-3 rounded-full bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-transparent transition-all duration-200 hover:shadow-md hover:shadow-emerald-100 active:scale-95 overflow-hidden dark:bg-emerald-500/20 dark:hover:bg-emerald-500 dark:text-emerald-300 dark:hover:text-white dark:border-emerald-500/30 dark:hover:border-transparent dark:hover:shadow-emerald-500/20"
                                                    >
                                                        <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                                        </span>
                                                        <BookMarked size={11} className="flex-shrink-0" />
                                                        <span className="text-[10px] font-semibold">Borrow</span>
                                                    </button>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 h-7 pl-2 pr-3 rounded-full bg-zinc-50 text-zinc-300 border border-zinc-100 cursor-not-allowed dark:bg-white/4 dark:text-white/20 dark:border-white/6">
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
                                        <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-4 dark:bg-gradient-to-br dark:from-white/8 dark:to-white/3 dark:border-white/10">
                                            <BookOpen className="w-8 h-8 text-zinc-300 dark:text-white/20" />
                                        </div>
                                        <p className="text-zinc-400 font-medium dark:text-white/30">No books found</p>
                                        <p className="text-zinc-300 text-xs mt-1 dark:text-white/20">Try adjusting your search or filters</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {books.data.length > 0 && books.last_page > 1 && (
                <Pagination
                    books={books}
                    search={search}
                    categoryFilter={categoryFilter}
                    statusFilter={statusFilter}
                    sort={sort}
                />
            )}

            <BorrowModal
                book={borrowModal.book}
                isOpen={borrowModal.open}
                onClose={() => setBorrowModal({ open: false, book: null })}
                auth={auth}
            />
        </Layout>
    );
}