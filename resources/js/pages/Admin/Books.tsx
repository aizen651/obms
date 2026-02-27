import { useState, useEffect, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import BookCreateModal from '@/components/Admin/BookCreateModal';
import DeleteConfirmationModal from '@/components/Admin/DeleteConfirmationModal';
import { toast } from 'sonner';
import { Plus, Search, Filter, Trash2, BookOpen, ChevronUp, ChevronDown, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const btn = 'min-w-[32px] h-8 px-2 rounded text-sm font-medium flex items-center justify-center transition-colors select-none';

const BookCover = ({ book, size = 'sm' }) => {
    const cls = size === 'lg' ? 'w-16 h-20 rounded shadow-sm flex-shrink-0' : 'w-10 h-14 rounded shadow-sm flex-shrink-0';
    return book.image_url
        ? <img src={book.image_url} alt={book.title} className={`${cls} object-cover`} />
        : <div className={`${cls} bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white`}><BookOpen className={size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} /></div>;
};

const StatusBadge = ({ book }) => {
    const s = book.display_status || book.status;
    const styles = { available: 'bg-green-50 text-green-700 border-green-200', unavailable: 'bg-red-50 text-red-700 border-red-200', archived: 'bg-gray-50 text-gray-700 border-gray-200' };
    return <span className={`px-2 py-1 rounded-md text-xs font-medium border capitalize ${styles[s]}`}>{s}</span>;
};

const CopiesBadge = ({ book }) => (
    <span className={`font-semibold text-sm ${book.available_copies > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {book.available_copies}<span className="text-gray-400 font-normal">/{book.total_copies}</span>
    </span>
);

function Pagination({ books }) {
    const [maxVisible, setMaxVisible] = useState(5);
    const calc = useCallback(() => {
        const w = window.innerWidth;
        setMaxVisible(w < 380 ? 3 : w < 480 ? 4 : w < 640 ? 5 : w < 768 ? 7 : 9);
    }, []);
    useEffect(() => { calc(); window.addEventListener('resize', calc); return () => window.removeEventListener('resize', calc); }, [calc]);

    const prev = books.links[0], next = books.links[books.links.length - 1];
    const pages = books.links.slice(1, -1);
    const total = pages.length, cur = pages.findIndex(l => l.active);
    let start = Math.max(0, cur - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible);
    start = Math.max(0, end - maxVisible);
    const visible = pages.slice(start, end);

    const NavBtn = ({ link, children }) => link?.url
        ? <Link href={link.url} className={`${btn} bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 text-gray-700`} preserveState>{children}</Link>
        : <span className={`${btn} bg-gray-50 text-gray-300 cursor-not-allowed pointer-events-none`}>{children}</span>;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-lg shadow-sm border px-4 py-3">
            <p className="text-sm text-gray-600 whitespace-nowrap">Showing {books.from}–{books.to} of {books.total}</p>
            <div className="flex items-center gap-1 flex-nowrap overflow-hidden">
                <NavBtn link={prev}><ChevronLeft className="w-4 h-4" /></NavBtn>
                {start > 0 && <><NavBtn link={pages[0]}>1</NavBtn><span className={`${btn} text-gray-400 cursor-default`}>…</span></>}
                {visible.map((l, i) => l.url
                    ? <Link key={i} href={l.url} className={`${btn} ${l.active ? 'bg-indigo-500 text-white shadow-sm' : 'bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 text-gray-700'}`} preserveState dangerouslySetInnerHTML={{ __html: l.label }} />
                    : <span key={i} className={`${btn} bg-gray-50 text-gray-300`} dangerouslySetInnerHTML={{ __html: l.label }} />
                )}
                {end < total && <><span className={`${btn} text-gray-400 cursor-default`}>…</span><NavBtn link={pages[total - 1]}><span dangerouslySetInnerHTML={{ __html: pages[total - 1].label }} /></NavBtn></>}
                <NavBtn link={next}><ChevronRight className="w-4 h-4" /></NavBtn>
            </div>
        </div>
    );
}

export default function Books({ books, categories, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [category, setCategory] = useState(filters?.category || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [showFilters, setShowFilters] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => router.get('/admin/books', { search, category, status, sort: filters?.sort, direction: filters?.direction }, { preserveState: true, replace: true }), 500);
        return () => clearTimeout(t);
    }, [search, category, status]);

    const handleSort = (col) => {
        const dir = filters?.sort === col && filters?.direction === 'asc' ? 'desc' : 'asc';
        router.get('/admin/books', { search, category, status, sort: col, direction: dir }, { preserveState: true });
    };

    const handleReset = () => { setSearch(''); setCategory(''); setStatus(''); router.get('/admin/books'); };

    const confirmDelete = () => {
        if (!toDelete) return;
        setDeleting(true);
        router.delete(`/admin/books/${toDelete.id}`, {
            onSuccess: () => { toast.success('Book deleted!'); setDeleteOpen(false); setToDelete(null); },
            onError: (e) => toast.error(e.error || 'Failed to delete book.'),
            onFinish: () => setDeleting(false),
        });
    };

    const SortBtn = ({ col, children }) => (
        <button onClick={() => handleSort(col)} className="flex items-center gap-1 hover:text-indigo-500">
            {children}
            {filters?.sort === col && (filters?.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
        </button>
    );

    return (
        <AdminAuthLayout header="Books">
            <Head title="Books" />
            <div className="space-y-4">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Books</h2>
                        <p className="text-sm text-gray-500">{books.total} total</p>
                    </div>
                    <button onClick={() => setCreateOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow">
                        <Plus className="w-5 h-5" /> Add Book
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 space-y-3">
                    <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search books..."
                            className="w-full pl-10 pr-4 py-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none" />
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium">
                        <Filter className="w-4 h-4" /> Filters
                        {(category || status) && <span className="px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full">{[category, status].filter(Boolean).length}</span>}
                    </button>
                    {showFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t">
                            <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">All Categories</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">All Status</option>
                                <option value="available">Available</option>
                                <option value="unavailable">Unavailable</option>
                                <option value="archived">Archived</option>
                            </select>
                            <button onClick={handleReset} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Reset</button>
                        </div>
                    )}
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block bg-white rounded-lg shadow-sm border overflow-hidden">
                    {books.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-indigo-100">
                                    <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                        <th className="px-4 py-3"><SortBtn col="title">Book</SortBtn></th>
                                        <th className="px-4 py-3 hidden lg:table-cell">ISBN</th>
                                        <th className="px-4 py-3 hidden sm:table-cell"><SortBtn col="author">Author</SortBtn></th>
                                        <th className="px-4 py-3 hidden md:table-cell">Category</th>
                                        <th className="px-4 py-3 hidden sm:table-cell">Copies</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {books.data.map(book => (
                                        <tr key={book.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-4 py-3 flex items-center gap-3">
                                                <BookCover book={book} />
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-sm text-gray-900 line-clamp-1">{book.title}</p>
                                                    <p className="text-xs text-gray-500 line-clamp-1">{book.publisher}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden lg:table-cell">
                                                <span className="text-sm text-gray-600 font-mono">{book.isbn}</span>
                                            </td>
                                            <td className="px-4 py-3 hidden sm:table-cell">
                                                <span className="text-sm text-gray-900">{book.author}</span>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md text-xs font-medium">
                                                    {book.category?.name || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 hidden sm:table-cell"><CopiesBadge book={book} /></td>
                                            <td className="px-4 py-3"><StatusBadge book={book} /></td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Link href={route('admin.books.show', book.id)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View"><Eye className="w-4 h-4" /></Link>
                                                    <button onClick={() => { setToDelete(book); setDeleteOpen(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No books found</p>
                        </div>
                    )}
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden grid gap-3">
                    {books.data.map(book => (
                        <div key={book.id} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                            <BookCover book={book} size="lg" />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 line-clamp-1">{book.title}</p>
                                <p className="text-sm text-gray-500 line-clamp-1">{book.author}</p>
                                <p className="text-xs text-gray-400 mt-1"><CopiesBadge book={book} /> · <StatusBadge book={book} /></p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <Link href={route('admin.books.show', book.id)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View">
                                    <Eye className="w-4 h-4" />
                                </Link>
                                <button onClick={() => { setToDelete(book); setDeleteOpen(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {books.data.length === 0 && (
                        <div className="p-12 text-center col-span-full">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No books found</p>
                        </div>
                    )}
                </div>

                {books.data.length > 0 && books.last_page > 1 && <Pagination books={books} />}
            </div>

            <BookCreateModal isOpen={createOpen} onClose={() => setCreateOpen(false)} categories={categories} />
            <DeleteConfirmationModal
                isOpen={deleteOpen}
                onClose={() => { setDeleteOpen(false); setToDelete(null); }}
                onConfirm={confirmDelete}
                title="Delete Book"
                message={`Are you sure you want to delete "${toDelete?.title}"?`}
                isDeleting={deleting}
            />
        </AdminAuthLayout>
    );
}