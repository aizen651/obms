import { useState, useEffect } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import {
    Search,
    Filter,
    BookMarked,
    BookOpen,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    Eye
} from 'lucide-react';
import GuestLayout from '@/layouts/GuestLayout';


export default function Books({ books, categories, filters }) {

    const COLS = [
        { key: "title",            label: "Title"  },
        { key: "author",           label: "Author" },
        { key: "category.name",    label: "Genre"  },
        { key: "published_year",   label: "Year"   },
        { key: "available_copies", label: "Copies" },
        { key: "display_status",   label: "Status" },
    ];

    const [search,         setSearch]         = useState(filters?.search    || '');
    const [categoryFilter, setCategoryFilter] = useState(filters?.category  || '');
    const [statusFilter,   setStatusFilter]   = useState(filters?.status    || '');

    // Initialise from URL filters so icons stay correct after pagination / refresh
    const [sort, setSort] = useState({
        col: filters?.sort      || 'title',
        dir: filters?.direction || 'asc',
    });

    const DEBOUNCE_DELAY = 400;

    // Single unified debounced effect — handles search, filters AND sort
    useEffect(() => {
        const handler = setTimeout(() => {
            router.get(
                '/books',
                {
                    search,
                    category:  categoryFilter,
                    status:    statusFilter,
                    sort:      sort.col,
                    direction: sort.dir,
                },
                {
                    preserveState: true,
                    replace:       true,
                }
            );
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(handler);
    }, [search, categoryFilter, statusFilter, sort]);

    // Clicking the same column toggles direction.
    // Clicking a NEW column always starts asc (so published_year = lowest → highest on first click).
    const toggleSort = (col) => {
        setSort((prev) => {
            if (prev.col === col) {
                return { col, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
            }
            return { col, dir: 'asc' };
        });
    };

    const handleReset = () => {
        setSearch('');
        setCategoryFilter('');
        setStatusFilter('');
        setSort({ col: 'title', dir: 'asc' });
        router.get('/books');
    };

    const SortIcon = ({ col }) => {
        if (sort.col !== col) return <ChevronsUpDown size={13} className="text-black" />;
        return sort.dir === 'asc'
            ? <ChevronUp   size={13} className="text-black" />
            : <ChevronDown size={13} className="text-black" />;
    };

    const StatusBadge = ({ book }) => {
        const displayStatus = book.display_status || book.status;
        const styles = {
            available:   'bg-green-50 text-green-700',
            unavailable: 'bg-red-50   text-red-700',
            archived:    'bg-gray-50  text-gray-700',
        };
        return (
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${styles[displayStatus]}`}>
                {displayStatus}
            </span>
        );
    };

    return (
        <>
            <GuestLayout>
                <Head title="Books" />

                <div className="space-y-4 pt-16">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl text-white font-bold">All Books</h2>
                            <p className="text-sm text-white">{books.total} total books</p>
                        </div>
                    </div>
                </div>

                {/* Card */}
                <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-emerald-700/40 backdrop-blur-sm shadow-2xl">

                    {/* Search / Filter bar */}
                    <div className="flex items-center gap-3 bg-emerald-800 border-b border-slate-800/50 px-4 py-3">
                        <div className="relative flex-1 max-w-xs">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search books…"
                                className="w-full rounded-lg bg-white py-2 pl-8 pr-3 text-xs text-black placeholder-slate-600 ring-1 ring-slate-800 focus:outline-none focus:ring-slate-500 transition-all"
                            />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-xs text-slate-800 ring-1 ring-slate-700/40 hover:bg-slate-700/50 transition-colors">
                                    <Filter size={13} /> Filter
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>All Categories</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <DropdownMenuRadioItem value="">All Categories</DropdownMenuRadioItem>
                                    {categories.map(cat => (
                                        <DropdownMenuRadioItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </DropdownMenuRadioItem>
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
                                <DropdownMenuItem onClick={handleReset} className="text-red-500 focus:text-red-600">
                                    Reset Filters
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-slate-800/50 bg-gray-950/30">
                                    <th className="px-3 py-3 text-right font-semibold text-black">Book</th>
                                    {COLS.map(c => (
                                        <th
                                            key={c.key}
                                            onClick={() => toggleSort(c.key)}
                                            className="px-3 py-3 text-left font-semibold uppercase tracking-wider cursor-pointer select-none hover:text-emerald-200 transition-colors"
                                        >
                                            <span className="flex items-center gap-1">
                                                {c.label} <SortIcon col={c.key} />
                                            </span>
                                        </th>
                                    ))}
                                    <th className="px-3 py-3 text-right font-semibold text-black uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.data.map((book, i) => (
                                    <tr
                                        key={book.id}
                                        className={`border-slate-900/50 transition-colors hover:bg-slate-800/20 ${
                                            i % 2 === 0 ? '' : 'bg-slate-950/20'
                                        }`}
                                    >
                                        {/* Cover image */}
                                        <td className="px-3 py-3">
                                            {book.image_url ? (
                                                <img
                                                    src={book.image_url}
                                                    alt={book.title}
                                                    className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-14 rounded bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                                                    <BookOpen className="w-5 h-5" />
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-3 py-3 text-slate-800 font-medium max-w-[180px] truncate">{book.title}</td>
                                        <td className="px-3 py-3 text-slate-600">{book.author}</td>
                                        <td className="px-3 py-3 text-slate-600">{book.category?.name || 'N/A'}</td>
                                        <td className="px-3 py-3 text-slate-600">{book.published_year}</td>

                                        {/* Available copies */}
                                        <td className="px-3 py-3 text-center">
                                            <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                                book.available_copies > 0
                                                    ? 'bg-emerald-500/20 text-emerald-600'
                                                    : 'bg-orange-500/20 text-red-400'
                                            }`}>
                                                {book.available_copies}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-3 py-3">
                                            <StatusBadge book={book} />
                                        </td>

                                        {/* Actions */}
                                        <td className="px-3 py-3">
                                            <div className="flex flex-col md:flex-row justify-center items-center gap-1">
                                                <button className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-1.5 px-2.5 md:py-2 md:px-3 rounded-md transition-colors">
                                                    <Eye size={15} />
                                                    View
                                                </button>
                                                <button className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white font-medium py-1.5 px-2.5 md:py-2 md:px-3 rounded-md transition-colors">
                                                    <BookMarked size={15} />
                                                    Borrow
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {books.data.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-lg shadow-sm border my-4 px-4 py-3">
                        <p className="text-sm text-gray-600">
                            Showing {books.from}–{books.to} of {books.total}
                        </p>
                        <div className="flex flex-wrap gap-1 justify-center">
                            {books.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-3 py-1.5 rounded text-sm font-medium ${
                                        link.active
                                            ? 'bg-emerald-700 text-white'
                                            : link.url
                                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}

            </GuestLayout>
        </>
    );
}