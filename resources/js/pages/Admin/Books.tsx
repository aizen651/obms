import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import BookCreateModal from '@/components/Admin/BookCreateModal';
import DeleteConfirmationModal from '@/components/Admin/DeleteConfirmationModal';
import { toast } from 'sonner';
import { Plus, Search, Filter, Trash2, BookOpen, ChevronUp, ChevronDown, Eye } from 'lucide-react';

export default function Books({ books, categories, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters?.category || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [showFilters, setShowFilters] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/books', { search, category: categoryFilter, status: statusFilter }, { preserveState: true });
    };

    const handleSort = (column) => {
        const direction = filters?.sort === column && filters?.direction === 'asc' ? 'desc' : 'asc';
        router.get('/admin/books', { search, category: categoryFilter, status: statusFilter, sort: column, direction }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setCategoryFilter('');
        setStatusFilter('');
        router.get('/admin/books');
    };

    const confirmDelete = () => {
        if (!bookToDelete) return;
        setIsDeleting(true);
        router.delete(`/admin/books/${bookToDelete.id}`, {
            onSuccess: () => {
                toast.success('Book deleted successfully!');
                setIsDeleteModalOpen(false);
                setBookToDelete(null);
            },
            onError: (errors) => toast.error(errors.error || 'Failed to delete book.'),
            onFinish: () => setIsDeleting(false)
        });
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            available: 'bg-green-50 text-green-700 border-green-200',
            unavailable: 'bg-red-50 text-red-700 border-red-200',
            archived: 'bg-gray-50 text-gray-700 border-gray-200'
        };
        return <span className={`px-2 py-1 rounded-md text-xs font-medium border ${styles[status]}`}>{status}</span>;
    };

    const SortButton = ({ column, children }) => (
        <button onClick={() => handleSort(column)} className="flex items-center gap-1 hover:text-amber-600">
            {children}
            {filters?.sort === column && (filters?.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
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
                    <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg shadow-md">
                        <Plus className="w-5 h-5" />
                        Add Book
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4">
                    <form onSubmit={handleSearch} className="space-y-3">
                        <div className="relative">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search books..."
                                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <button type="button" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium">
                            <Filter className="w-4 h-4" />
                            Filters
                            {(categoryFilter || statusFilter) && <span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">{[categoryFilter, statusFilter].filter(Boolean).length}</span>}
                        </button>

                        {showFilters && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t">
                                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500">
                                    <option value="">All Categories</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500">
                                    <option value="">All Status</option>
                                    <option value="available">Available</option>
                                    <option value="unavailable">Unavailable</option>
                                    <option value="archived">Archived</option>
                                </select>
                                <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium">Apply</button>
                                <button type="button" onClick={handleReset} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Reset</button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {books.data.length > 0 ? (
                        <>
                            {/* Mobile View - Cards */}
                            <div className="block md:hidden divide-y">
                                {books.data.map(book => (
                                    <div key={book.id} className="p-4">
                                        <div className="flex gap-3 mb-3">
                                            {book.image_url ? (
                                                <img src={book.image_url} alt={book.title} className="w-16 h-20 object-cover rounded shadow-sm flex-shrink-0" />
                                            ) : (
                                                <div className="w-16 h-20 rounded bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                                                    <BookOpen className="w-6 h-6" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{book.title}</h3>
                                                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    <StatusBadge status={book.status} />
                                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-medium">
                                                        {book.category?.name || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm mb-3 pb-3 border-b">
                                            <div>
                                                <span className="text-gray-500">ISBN:</span>
                                                <p className="font-medium text-gray-900 text-xs">{book.isbn}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Available:</span>
                                                <p className="font-semibold text-gray-900">{book.available_copies}/{book.total_copies}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={route('admin.books.show', book.id)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-sm font-medium">
                                                <Eye className="w-4 h-4" />
                                                View
                                            </Link>
                                            <button onClick={() => { setBookToDelete(book); setIsDeleteModalOpen(true); }} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop View - Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr className="text-left text-xs font-semibold text-gray-700 uppercase">
                                            <th className="px-4 py-3"><SortButton column="title">Book</SortButton></th>
                                            <th className="px-4 py-3">ISBN</th>
                                            <th className="px-4 py-3"><SortButton column="author">Author</SortButton></th>
                                            <th className="px-4 py-3">Category</th>
                                            <th className="px-4 py-3">Available</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {books.data.map(book => (
                                            <tr key={book.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        {book.image_url ? (
                                                            <img src={book.image_url} alt={book.title} className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0" />
                                                        ) : (
                                                            <div className="w-10 h-14 rounded bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                                                                <BookOpen className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-sm text-gray-900 line-clamp-1">{book.title}</p>
                                                            <p className="text-xs text-gray-500 line-clamp-1">{book.publisher}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-sm text-gray-600 font-mono">{book.isbn}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-sm text-gray-900">{book.author}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-medium">
                                                        {book.category?.name || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm">
                                                        <span className="font-semibold text-gray-900">{book.available_copies}</span>
                                                        <span className="text-gray-500">/{book.total_copies}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={book.status} />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Link href={route('admin.books.show', book.id)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="View">
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                        <button onClick={() => { setBookToDelete(book); setIsDeleteModalOpen(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="p-12 text-center">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No books found</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {books.data.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-lg shadow-sm border px-4 py-3">
                        <p className="text-sm text-gray-600">
                            Showing {books.from}-{books.to} of {books.total}
                        </p>
                        <div className="flex flex-wrap gap-1 justify-center">
                            {books.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-3 py-1.5 rounded text-sm font-medium ${
                                        link.active ? 'bg-amber-500 text-white' : link.url ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <BookCreateModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} categories={categories} />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setBookToDelete(null); }}
                onConfirm={confirmDelete}
                title="Delete Book"
                message={`Are you sure you want to delete "${bookToDelete?.title}"?`}
                isDeleting={isDeleting}
            />
        </AdminAuthLayout>
    );
}
