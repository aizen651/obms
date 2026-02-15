import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
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
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import UserCreateModal from '@/components/Admin/UserCreateModal';
import UserEditModal from '@/components/Admin/UserEditModal';
import DeleteConfirmationModal from '@/components/Admin/DeleteConfirmationModal';
import { toast } from 'sonner';
import { 
    Plus, 
    Search, 
    Filter, 
    Edit2, 
    Trash2, 
    Users as UsersIcon, 
    ChevronUp, 
    ChevronDown,
    ArrowUpDown
} from 'lucide-react';

export default function Users({ users, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [roleFilter, setRoleFilter] = useState(filters?.role || '');
    const [showFilters, setShowFilters] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/users', { 
            search, 
            role: roleFilter 
        }, { 
            preserveState: true 
        });
    };

    const handleSort = (column) => {
        const direction = filters?.sort === column && filters?.direction === 'asc' 
            ? 'desc' 
            : 'asc';
        
        router.get('/admin/users', { 
            search, 
            role: roleFilter, 
            sort: column, 
            direction 
        }, { 
            preserveState: true 
        });
    };

    const handleReset = () => {
        setSearch('');
        setRoleFilter('');
        router.get('/admin/users');
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
            onSuccess: () => {
                toast.success('User deleted successfully!');
                setIsDeleteModalOpen(false);
                setUserToDelete(null);
            },
            onError: () => {
                toast.error('Failed to delete user.');
            },
            onFinish: () => {
                setIsDeleting(false);
            }
        });
    };

    const getMemberId = (user) => {
        if (user.role === 'student') return user.student_id || 'N/A';
        if (user.role === 'teacher') return user.teacher_id || 'N/A';
        return 'Admin';
    };

    const SortIcon = ({ column }) => {
        if (filters?.sort !== column) return null;
        return filters?.direction === 'asc' ? (
            <ChevronUp className="w-4 h-4" />
        ) : (
            <ChevronDown className="w-4 h-4" />
        );
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
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add User
                    </button>
                </div>

                {/* Search & Filter Bar */}
<div className="bg-white rounded-xl shadow-md p-4">
    <form onSubmit={handleSearch}>
        <div className="flex w-full">

            {/* Search Input */}
            <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-9 pr-3 py-2 border border-r-0 border-amber-200 rounded-l-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                />
            </div>

            {/* Search Button */}
            <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-medium transition-all"
            >
                Search
            </button>

            {/* Filter Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-r-lg transition-all flex items-center justify-center"
                    >
                        <Filter className="w-4 h-4" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56">

                    {/* Role Filter */}
                    <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuRadioGroup
    value={roleFilter}
    onValueChange={(value) => {
        setRoleFilter(value);

        router.get('/admin/users', {
            search,
            role: value,
            sort: filters?.sort,
            direction: filters?.direction,
        }, { preserveState: true });
    }}
>
                        <DropdownMenuRadioItem value="">
                            All Roles
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="admin">
                            Admin
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="teacher">
                            Teacher
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="student">
                            Student
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />

                    {/* Sort Filter */}
<DropdownMenuLabel>Sort By</DropdownMenuLabel>
<DropdownMenuSeparator />

<DropdownMenuRadioGroup
    value={filters?.sort || ""}
    onValueChange={(value) => {
        const direction =
            filters?.sort === value && filters?.direction === 'asc'
                ? 'desc'
                : 'asc';

        router.get('/admin/users', {
            search,
            role: roleFilter,
            sort: value,
            direction,
        }, { preserveState: true });
    }}
>
    <DropdownMenuRadioItem value="firstname">
        Name
    </DropdownMenuRadioItem>

    <DropdownMenuRadioItem value="email">
        Email
    </DropdownMenuRadioItem>

    <DropdownMenuRadioItem value="role">
        Role
    </DropdownMenuRadioItem>
</DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />

                    {/* Reset */}
                    <DropdownMenuItem
                        onClick={handleReset}
                        className="text-red-500 focus:text-red-600"
                    >
                        Reset Filters
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    </form>
</div>

                {/* Users Grid - Mobile */}
                <div className="block lg:hidden space-y-3">
                    {users.data.length > 0 ? (
                        users.data.map((user) => (
                            <div 
                                key={user.id} 
                                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                                        {user.user_image ? (
                                            <img 
                                                src={`/storage/${user.user_image}`} 
                                                alt={user.firstname} 
                                                className="w-full h-full object-cover rounded-full" 
                                            />
                                        ) : (
                                            <span>
                                                {user.firstname?.charAt(0)}{user.lastname?.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {user.firstname} {user.lastname}
                                        </h3>
                                        <p className="text-sm text-gray-600 truncate">
                                            {user.email}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span 
                                                className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize
                                                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : ''}
                                                    ${user.role === 'teacher' ? 'bg-blue-100 text-blue-700' : ''}
                                                    ${user.role === 'student' ? 'bg-green-100 text-green-700' : ''}
                                                `}
                                            >
                                                {user.role}
                                            </span>
                                            <span className="text-xs text-gray-500 font-mono">
                                                {getMemberId(user)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm mb-3 pt-3 border-t">
                                    <div>
                                        <span className="text-gray-500">Contact:</span>
                                        <p className="font-medium text-gray-900">
                                            {user.contact || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Gender:</span>
                                        <p className="font-medium text-gray-900 capitalize">
                                            {user.gender || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Joined:</span>
                                        <p className="font-medium text-gray-900">
                                            {new Date(user.created_at).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric', 
                                                year: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Books:</span>
                                        <p className="font-medium text-amber-600">
                                            {user.borrowed_books_count || 0}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-center font-medium text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user)}
                                        className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors font-medium text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No users found</p>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
                        </div>
                    )}
                </div>

                {/* Users Table - Desktop */}
                <div className="hidden lg:block bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-amber-50 to-orange-50">
                                <tr className="border-b border-amber-100">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        <button 
                                            onClick={() => handleSort('firstname')} 
                                            className="flex items-center gap-1 hover:text-amber-600 transition-colors"
                                        >
                                            Name
                                            <SortIcon column="firstname" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        <button 
                                            onClick={() => handleSort('email')} 
                                            className="flex items-center gap-1 hover:text-amber-600 transition-colors"
                                        >
                                            Email
                                            <SortIcon column="email" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Contact
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        <button 
                                            onClick={() => handleSort('role')} 
                                            className="flex items-center gap-1 hover:text-amber-600 transition-colors"
                                        >
                                            Role
                                            <SortIcon column="role" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Member ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Books
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                        Actions
                                    </th>
                       </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-amber-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                        {user.user_image ? (
                                                            <img 
                                                                src={`/storage/${user.user_image}`} 
                                                                alt={user.firstname} 
                                                                className="w-full h-full object-cover rounded-full" 
                                                            />
                                                        ) : (
                                                            <span className="text-sm">
                                                                {user.firstname?.charAt(0)}{user.lastname?.charAt(0)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {user.firstname} {user.lastname}
                                                        </div>
                                                        <div className="text-xs text-gray-500 capitalize">
                                                            {user.gender || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {user.contact || 'N/A'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span 
                                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize
                                                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : ''}
                                                        ${user.role === 'teacher' ? 'bg-blue-100 text-blue-700' : ''}
                                                        ${user.role === 'student' ? 'bg-green-100 text-green-700' : ''}
                                                    `}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-sm font-medium text-gray-800">
                                                {getMemberId(user)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                                                    {user.borrowed_books_count || 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button 
                                                        onClick={() => handleEdit(user)} 
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(user)} 
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-12 text-center">
                                            <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 font-medium">No users found</p>
                                            <p className="text-gray-400 text-sm mt-1">
                                                Try adjusting your search
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {users.data.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md px-4 py-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium text-gray-800">
                                    {users.from}-{users.to}
                                </span> of{' '}
                                <span className="font-medium text-gray-800">
                                    {users.total}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1 justify-center">
                                {users.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        preserveState
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                                            ${link.active 
                                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' 
                                                : link.url 
                                                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <UserCreateModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
            
            <UserEditModal 
                isOpen={isEditModalOpen} 
                onClose={() => { 
                    setIsEditModalOpen(false); 
                    setSelectedUser(null); 
                }} 
                user={selectedUser} 
            />
            
            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setUserToDelete(null);
                }}
                onConfirm={confirmDelete}
                userName={userToDelete ? `${userToDelete.firstname} ${userToDelete.lastname}` : ''}
                isDeleting={isDeleting}
            />
        </AdminAuthLayout>
    );
}