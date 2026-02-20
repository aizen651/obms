import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import UserCreateModal from '@/components/Admin/UserCreateModal';
import UserEditModal from '@/components/Admin/UserEditModal';
import DeleteConfirmationModal from '@/components/Admin/DeleteConfirmationModal';
import { toast } from 'sonner';
import { Plus, Search, Filter, Edit2, Trash2, Users as UsersIcon, ChevronUp, ChevronDown, Eye, X, BookOpen } from 'lucide-react';

export default function Users({ users, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [roleFilter, setRoleFilter] = useState(filters?.role || '');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            router.get('/admin/users', { search, role: roleFilter, sort: filters?.sort, direction: filters?.direction }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(handler);
    }, [search, roleFilter]);

    const handleSort = (column) => {
        const direction = filters?.sort === column && filters?.direction === 'asc' ? 'desc' : 'asc';
        router.get('/admin/users', { search, role: roleFilter, sort: column, direction }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setRoleFilter('');
        router.get('/admin/users');
    };

    const handleView = (user) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDelete = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        router.delete(`/admin/users/${userToDelete.id}`, {
            onSuccess: () => { toast.success('User deleted successfully!'); setIsDeleteModalOpen(false); setUserToDelete(null); },
            onError: () => toast.error('Failed to delete user.'),
            onFinish: () => setIsDeleting(false)
        });
    };

    const getMemberId = (user) => {
        if (user.role === 'student') return user.student_id || 'N/A';
        if (user.role === 'teacher') return user.teacher_id || 'N/A';
        return 'Admin';
    };

    const SortIcon = ({ column }) => {
        if (filters?.sort !== column) return null;
        return filters?.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
    };

    return (
        <AdminAuthLayout header="Users">
            <Head title="Users" />

            <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">All Users</h2>
                        <p className="text-sm text-gray-600">{users.total} total users</p>
                    </div>
                    <button onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all shadow-md flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" />Add User
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex w-full">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
                                className="w-full pl-9 pr-3 py-2 border border-r-0 border-amber-200 rounded-l-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none" />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-r-lg transition-all flex items-center justify-center">
                                    <Filter className="w-4 h-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={roleFilter} onValueChange={setRoleFilter}>
                                    <DropdownMenuRadioItem value="">All Roles</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="teacher">Teacher</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="student">Student</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={filters?.sort || ""} onValueChange={(value) => handleSort(value)}>
                                    <DropdownMenuRadioItem value="firstname">Name</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="email">Email</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="role">Role</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleReset} className="text-red-500 focus:text-red-600">Reset Filters</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Responsive Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-amber-50 to-orange-50">
                                <tr className="border-b border-amber-100">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        <button onClick={() => handleSort('firstname')} className="flex items-center gap-1 hover:text-amber-600">
                                            Name <SortIcon column="firstname" />
                                        </button>
                                    </th>
                                    <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        <button onClick={() => handleSort('email')} className="flex items-center gap-1 hover:text-amber-600">
                                            Email <SortIcon column="email" />
                                        </button>
                                    </th>
                                    <th className="hidden lg:table-cell px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        <button onClick={() => handleSort('role')} className="flex items-center gap-1 hover:text-amber-600">
                                            Role <SortIcon column="role" />
                                        </button>
                                    </th>
                                    <th className="hidden xl:table-cell px-4 py-3 text-left text-sm font-semibold text-gray-700">Member ID</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Books</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.data.length > 0 ? users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-amber-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                    {user.user_image ? (
                                                        <img src={`/storage/${user.user_image}`} alt={user.firstname} className="w-full h-full object-cover rounded-full" />
                                                    ) : (
                                                        <span className="text-sm">{user.firstname?.charAt(0)}{user.lastname?.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-medium text-gray-900 truncate">{user.firstname} {user.lastname}</div>
                                                    <div className="md:hidden text-xs text-gray-500 truncate">{user.email}</div>
                                                    <span className={`lg:hidden inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : user.role === 'teacher' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                        <td className="hidden lg:table-cell px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : user.role === 'teacher' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="hidden xl:table-cell px-4 py-3 text-sm font-mono text-gray-600">{getMemberId(user)}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                                                <BookOpen className="w-4 h-4" />
                                                {user.borrowed_books_count || 0}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleView(user)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="View">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleEdit(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(user)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-12 text-center">
                                            <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 font-medium">No users found</p>
                
                         </td>
                      </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {users.links && (
                        <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-sm text-gray-600">
                                Showing {users.from || 0} to {users.to || 0} of {users.total} users
                            </div>
                            <div className="flex gap-1 flex-wrap justify-center">
                                {users.links.map((link, index) => (
                                    <button key={index} onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        className={`px-3 py-1 text-sm rounded ${link.active ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                        dangerouslySetInnerHTML={{ __html: link.label }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* View User Modal */}
            {isViewModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setIsViewModalOpen(false)}>
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                            <h3 className="text-xl font-bold text-gray-900">User Details</h3>
                            <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Profile */}
                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg">
                                    {selectedUser.user_image ? (
                                        <img src={`/storage/${selectedUser.user_image}`} alt={selectedUser.firstname} className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <span>{selectedUser.firstname?.charAt(0)}{selectedUser.lastname?.charAt(0)}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-2xl font-bold text-gray-900">{selectedUser.firstname} {selectedUser.lastname}</h4>
                                    <p className="text-gray-600">{selectedUser.email}</p>
                                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold capitalize ${selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-700' : selectedUser.role === 'teacher' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                        {selectedUser.role}
                                    </span>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div><span className="text-gray-500 text-sm">Member ID:</span><p className="font-semibold">{getMemberId(selectedUser)}</p></div>
                                <div><span className="text-gray-500 text-sm">Contact:</span><p className="font-semibold">{selectedUser.contact || 'N/A'}</p></div>
                                <div><span className="text-gray-500 text-sm">Gender:</span><p className="font-semibold capitalize">{selectedUser.gender || 'N/A'}</p></div>
                                <div><span className="text-gray-500 text-sm">Joined:</span><p className="font-semibold">{new Date(selectedUser.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p></div>
                            </div>

                            {/* Borrowed Books */}
                            <div className="pt-4 border-t">
                                <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-amber-600" />
                                    Borrowed Books ({selectedUser.borrowed_books?.length || 0})
                                </h5>
                                {selectedUser.borrowed_books && selectedUser.borrowed_books.length > 0 ? (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {selectedUser.borrowed_books.map((transaction) => (
                                            <BookItem key={transaction.id} transaction={transaction} />
                                        ))}
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

            <UserCreateModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
            {selectedUser && <UserEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={selectedUser} />}
            <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} isDeleting={isDeleting} 
                title="Delete User" message={`Are you sure you want to delete ${userToDelete?.firstname} ${userToDelete?.lastname}?`} />
        </AdminAuthLayout>
    );
}

// Separate component for book items - USES image_url JUST LIKE BOOKS PAGE
function BookItem({ transaction }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            {/* Book Image */}
            <div className="w-16 h-20 flex-shrink-0">
                {transaction.book?.image_url ? (
                    <img 
                        src={transaction.book.image_url}
                        alt={transaction.book.title || 'Book cover'} 
                        className="w-full h-full object-cover rounded shadow"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-200 to-orange-300 rounded flex items-center justify-center shadow">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                )}
            </div>

            {/* Book Details */}
            <div className="flex-1 min-w-0">
                <h6 className="font-semibold text-gray-900 truncate">{transaction.book?.title || 'Unknown Book'}</h6>
                <p className="text-sm text-gray-600 truncate">{transaction.book?.author || 'Unknown Author'}</p>
                
                <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-gray-500">
                    <span>Borrowed: {transaction.date_borrowed ? new Date(transaction.date_borrowed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                    <span className="text-gray-400">•</span>
                    <span>Due: {transaction.expected_return_date ? new Date(transaction.expected_return_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                </div>
                
                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                    transaction.status === 'borrowed' ? 'bg-blue-100 text-blue-700' : 
                    transaction.status === 'returned' ? 'bg-green-100 text-green-700' : 
                    transaction.status === 'overdue' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                }`}>
                    {transaction.status}
                </span>
            </div>
        </div>
    );
}