import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import CategoryCreateModal from '@/components/Admin/CategoryCreateModal';
import CategoryEditModal from '@/components/Admin/CategoryEditModal';
import DeleteConfirmationModal from '@/components/Admin/DeleteConfirmationModal';
import { toast } from 'sonner';
import { Plus, Search, Edit2, Trash2, FolderOpen, BookOpen, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const SortBtn = ({ col, label, filters, onSort, asText = false }) => {
    const active = filters?.sort === col;
    const Icon = active ? (filters.direction === 'asc' ? ChevronUp : ChevronDown) : null;
    const cls = `flex items-center gap-1 ${asText ? 'hover:text-indigo-500' : `px-4 py-2 rounded-lg font-medium text-sm border-2 transition-all flex items-center gap-2 ${active ? 'bg-indigo-100 text-indigo-700 border-indigo-500' : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'}`}`;
    return (
        <button onClick={() => onSort(col)} className={cls}>
            {!asText && <ArrowUpDown className="w-4 h-4" />}
            {label}
            {Icon && <Icon className="w-4 h-4" />}
        </button>
    );
};

const Empty = () => (
    <div className="text-center py-12">
        <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">No categories found</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
    </div>
);

const FolderIcon = ({ size = 'sm' }) => (
    <div className={`${size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'} rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white flex-shrink-0 shadow`}>
        <FolderOpen className={size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
    </div>
);

export default function Categories({ categories, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const nav = (extra = {}) => router.get('/admin/categories', { search, sort: filters?.sort, direction: filters?.direction, ...extra }, { preserveState: true, replace: true });

    useEffect(() => {
        const t = setTimeout(() => nav(), 500);
        return () => clearTimeout(t);
    }, [search]);

    const handleSort = (col) => {
        const direction = filters?.sort === col && filters?.direction === 'asc' ? 'desc' : 'asc';
        router.get('/admin/categories', { search, sort: col, direction }, { preserveState: true });
    };

    const confirmDelete = () => {
        if (!toDelete) return;
        setDeleting(true);
        router.delete(`/admin/categories/${toDelete.id}`, {
            onSuccess: () => { toast.success('Category deleted!'); setDeleteOpen(false); setToDelete(null); },
            onError: (e) => toast.error(e.error || 'Failed to delete category.'),
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <AdminAuthLayout header="Category">
            <Head title="Categories" />
            <div className="space-y-4">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Book Categories</h2>
                        <p className="text-sm text-gray-500">{categories.total} total categories</p>
                    </div>
                    <button onClick={() => setCreateOpen(true)} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow flex items-center gap-2 transition-all">
                        <Plus className="w-5 h-5" /> Add Category
                    </button>
                </div>

                {/* Search & Sort */}
                <div className="bg-white rounded-xl shadow p-4 space-y-3">
                    <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories..."
                            className="w-full pl-10 pr-4 py-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <SortBtn col="name" label="Name" filters={filters} onSort={handleSort} />
                        <SortBtn col="created_at" label="Date Created" filters={filters} onSort={handleSort} />
                        {search && <button onClick={() => { setSearch(''); router.get('/admin/categories'); }} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium border-2 border-transparent">Reset</button>}
                    </div>
                </div>

                {/* Mobile Cards */}
                <div className="block lg:hidden space-y-3">
                    {categories.data.length > 0 ? categories.data.map(cat => (
                        <div key={cat.id} className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3 mb-3">
                                <FolderIcon size="lg" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate text-lg">{cat.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{cat.description || 'No description'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm mb-3 pt-3 border-t">
                                <div className="flex items-center gap-2 text-indigo-600">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="font-semibold">{cat.books_count || 0}</span>
                                    <span className="text-gray-500">books</span>
                                </div>
                                <span className="text-gray-500">Added {fmtDate(cat.created_at)}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setSelected(cat); setEditOpen(true); }} className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">Edit</button>
                                <button onClick={() => { setToDelete(cat); setDeleteOpen(true); }} className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium">Delete</button>
                            </div>
                        </div>
                    )) : <div className="bg-white rounded-xl shadow p-4"><Empty /></div>}
                </div>

                {/* Desktop Table */}
                <div className="hidden lg:block bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-indigo-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700"><SortBtn col="name" label="Category Name" filters={filters} onSort={handleSort} asText /></th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Books</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700"><SortBtn col="created_at" label="Created" filters={filters} onSort={handleSort} asText /></th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.data.length > 0 ? categories.data.map(cat => (
                                <tr key={cat.id} className="hover:bg-blue-50/40 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <FolderIcon />
                                            <span className="font-medium text-gray-900">{cat.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 max-w-md">
                                        <p className="line-clamp-2">{cat.description || <span className="text-gray-400 italic">No description</span>}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-4 h-4 text-indigo-500" />
                                            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">{cat.books_count || 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(cat.created_at)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => { setSelected(cat); setEditOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => { setToDelete(cat); setDeleteOpen(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan="5"><Empty /></td></tr>}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {categories.data.length > 0 && (
                    <div className="bg-white rounded-xl shadow px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600"><span className="font-medium text-gray-800">{categories.from}–{categories.to}</span> of <span className="font-medium text-gray-800">{categories.total}</span></p>
                        <div className="flex flex-wrap gap-1 justify-center">
                            {categories.links.map((link, i) => (
                                <Link key={i} href={link.url || '#'} preserveState
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${link.active ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow' : link.url ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-50 text-gray-400 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <CategoryCreateModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
            <CategoryEditModal isOpen={editOpen} onClose={() => { setEditOpen(false); setSelected(null); }} category={selected} />
            <DeleteConfirmationModal isOpen={deleteOpen} onClose={() => { setDeleteOpen(false); setToDelete(null); }} onConfirm={confirmDelete} userName={toDelete?.name || ''} isDeleting={deleting} />
        </AdminAuthLayout>
    );
}