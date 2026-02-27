import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import UserCreateModal from '@/components/Admin/UserCreateModal';
import UserEditModal from '@/components/Admin/UserEditModal';
import DeleteConfirmationModal from '@/components/Admin/DeleteConfirmationModal';
import { toast } from 'sonner';
import { Plus, Search, Filter, Edit2, Trash2, Users as UsersIcon, ChevronUp, ChevronDown, Eye, X, BookOpen } from 'lucide-react';

// --- Helpers ---
const roleClass = { admin: 'bg-purple-100 text-purple-700', teacher: 'bg-blue-100 text-blue-700', student: 'bg-green-100 text-green-700' };
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
const Avatar = ({ user, size = 'sm' }) => {
    const cls = size === 'lg' ? 'w-20 h-20 text-2xl font-bold' : 'w-10 h-10 text-sm font-semibold';
    return (
        <div className={`${cls} rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow`}>
            {user.user_image
                ? <img src={`/storage/${user.user_image}`} alt={user.firstname} className="w-full h-full object-cover rounded-full" />
                : <span>{user.firstname?.charAt(0)}{user.lastname?.charAt(0)}</span>}
        </div>
    );
};
const RoleBadge = ({ role }) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${roleClass[role] || 'bg-gray-100 text-gray-700'}`}>{role}</span>;
const SortBtn = ({ col, filters, onSort }) => (
    <button onClick={() => onSort(col)} className="flex items-center gap-1 hover:text-indigo-500">
        {col.charAt(0).toUpperCase() + col.slice(1)}
        {filters?.sort === col && (filters.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
    </button>
);

export default function Users({ users, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [roleFilter, setRoleFilter] = useState(filters?.role || '');
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const nav = (extra = {}) => router.get('/admin/users', { search, role: roleFilter, sort: filters?.sort, direction: filters?.direction, ...extra }, { preserveState: true, replace: true });

    useEffect(() => {
        const t = setTimeout(() => nav(), 500);
        return () => clearTimeout(t);
    }, [search, roleFilter]);

    const handleSort = (col) => {
        const direction = filters?.sort === col && filters?.direction === 'asc' ? 'desc' : 'asc';
        router.get('/admin/users', { search, role: roleFilter, sort: col, direction }, { preserveState: true });
    };

    const getMemberId = (u) => u.role === 'student' ? u.student_id || 'N/A' : u.role === 'teacher' ? u.teacher_id || 'N/A' : 'Admin';

    const confirmDelete = () => {
        if (!toDelete) return;
        setDeleting(true);
        router.delete(`/admin/users/${toDelete.id}`, {
            onSuccess: () => { toast.success('User deleted!'); setDeleteOpen(false); setToDelete(null); },
            onError: () => toast.error('Failed to delete user.'),
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <AdminAuthLayout header="Users">
            <Head title="Users" />
            <div className="space-y-4">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">All Users</h2>
                        <p className="text-sm text-gray-500">{users.total} total users</p>
                    </div>
                    <button onClick={() => setCreateOpen(true)} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow flex items-center gap-2 transition-all">
                        <Plus className="w-5 h-5" /> Add User
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex w-full">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
                                className="w-full pl-9 pr-3 py-2 border border-r-0 border-indigo-200 rounded-l-lg focus:ring-2 focus:ring-indigo-400 outline-none" />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-r-lg flex items-center"><Filter className="w-4 h-4" /></button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={roleFilter} onValueChange={setRoleFilter}>
                                    {['', 'admin', 'teacher', 'student'].map(r => <DropdownMenuRadioItem key={r} value={r}>{r ? r.charAt(0).toUpperCase() + r.slice(1) : 'All Roles'}</DropdownMenuRadioItem>)}
                                </DropdownMenuRadioGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={filters?.sort || ''} onValueChange={handleSort}>
                                    {['firstname', 'email', 'role'].map(c => <DropdownMenuRadioItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</DropdownMenuRadioItem>)}
                                </DropdownMenuRadioGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => { setSearch(''); setRoleFilter(''); router.get('/admin/users'); }} className="text-red-500">Reset Filters</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-indigo-100">
                                <tr>
                                    {[['firstname', ''], ['email', 'hidden md:table-cell'], ['role', 'hidden lg:table-cell']].map(([col, cls]) => (
                                        <th key={col} className={`${cls} px-4 py-3 text-left text-sm font-semibold text-gray-700`}>
                                            <SortBtn col={col} filters={filters} onSort={handleSort} />
                                        </th>
                                    ))}
                                    <th className="hidden xl:table-cell px-4 py-3 text-left text-sm font-semibold text-gray-700">Member ID</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Books</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.data.length > 0 ? users.data.map(user => (
                                    <tr key={user.id} className="hover:bg-blue-50/40 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar user={user} />
                                                <div className="min-w-0">
                                                    <div className="font-medium text-gray-900 truncate">{user.firstname} {user.lastname}</div>
                                                    <div className="md:hidden text-xs text-gray-500 truncate">{user.email}</div>
                                                    <div className="lg:hidden mt-1"><RoleBadge role={user.role} /></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                        <td className="hidden lg:table-cell px-4 py-3"><RoleBadge role={user.role} /></td>
                                        <td className="hidden xl:table-cell px-4 py-3 text-sm font-mono text-gray-600">{getMemberId(user)}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                                                <BookOpen className="w-4 h-4" />{user.borrowed_books_count || 0}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => { setSelected(user); setViewOpen(true); }} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                                                <button onClick={() => { setSelected(user); setEditOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => { setToDelete(user); setDeleteOpen(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" className="px-4 py-12 text-center">
                                        <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium">No users found</p>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links && (
                        <div className="px-4 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
                            <p className="text-sm text-gray-600">Showing {users.from || 0}–{users.to || 0} of {users.total}</p>
                            <div className="flex gap-1 flex-wrap justify-center">
                                {users.links.map((link, i) => (
                                    <button key={i} onClick={() => link.url && router.get(link.url)} disabled={!link.url}
                                        className={`px-3 py-1 text-sm rounded ${link.active ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                        dangerouslySetInnerHTML={{ __html: link.label }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* View Modal */}
            {viewOpen && selected && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setViewOpen(false)}>
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                            <h3 className="text-xl font-bold">User Details</h3>
                            <button onClick={() => setViewOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-start gap-4">
                                <Avatar user={selected} size="lg" />
                                <div>
                                    <h4 className="text-2xl font-bold text-gray-900">{selected.firstname} {selected.lastname}</h4>
                                    <p className="text-gray-500">{selected.email}</p>
                                    <div className="mt-2"><RoleBadge role={selected.role} /></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                {[['Member ID', getMemberId(selected)], ['Contact', selected.contact || 'N/A'], ['Gender', selected.gender || 'N/A'], ['Joined', fmtDate(selected.created_at)]].map(([label, val]) => (
                                    <div key={label}><span className="text-gray-500 text-sm">{label}:</span><p className="font-semibold capitalize">{val}</p></div>
                                ))}
                            </div>
                            <div className="pt-4 border-t">
                                <h5 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-indigo-500" /> Borrowed Books ({selected.borrowed_books?.length || 0})
                                </h5>
                                {selected.borrowed_books?.length > 0 ? (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {selected.borrowed_books.map(t => <BookItem key={t.id} transaction={t} />)}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-500">No books currently borrowed</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <UserCreateModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
            {selected && <UserEditModal isOpen={editOpen} onClose={() => setEditOpen(false)} user={selected} />}
            <DeleteConfirmationModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={confirmDelete} isDeleting={deleting}
                title="Delete User" message={`Are you sure you want to delete ${toDelete?.firstname} ${toDelete?.lastname}?`} />
        </AdminAuthLayout>
    );
}

function BookItem({ transaction: t }) {
    const statusClass = { borrowed: 'bg-blue-100 text-blue-700', returned: 'bg-green-100 text-green-700', overdue: 'bg-red-100 text-red-700' };
    return (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-16 h-20 flex-shrink-0">
                {t.book?.image_url
                    ? <img src={t.book.image_url} alt={t.book.title} className="w-full h-full object-cover rounded shadow" />
                    : <div className="w-full h-full bg-gradient-to-br from-blue-200 to-indigo-300 rounded flex items-center justify-center shadow"><BookOpen className="w-8 h-8 text-white" /></div>}
            </div>
            <div className="flex-1 min-w-0">
                <h6 className="font-semibold text-gray-900 truncate">{t.book?.title || 'Unknown Book'}</h6>
                <p className="text-sm text-gray-600 truncate">{t.book?.author || 'Unknown Author'}</p>
                <p className="text-xs text-gray-500 mt-1">Borrowed: {fmtDate(t.date_borrowed)} · Due: {fmtDate(t.expected_return_date)}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusClass[t.status] || 'bg-gray-100 text-gray-700'}`}>{t.status}</span>
            </div>
        </div>
    );
}