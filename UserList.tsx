import { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import AdminLayout from '@/layouts/admin-layout';
import { Users, UserPlus, Edit, Trash2, ChevronLeft, ChevronRight, Search, Filter, X, Eye } from 'lucide-react';
import ViewUserModal from '@/components/admin/users/ViewUserModal';
import DeleteUserModal from '@/components/admin/users/DeleteUserModal';
import AddUserModal from '@/components/admin/users/AddUserModal';
import EditUserModal from '@/components/admin/users/EditUserModal';

export default function UserList({ users, filters: initialFilters, auth }) {
  const tableRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    role: initialFilters.role || '',
    status: initialFilters.status || '',
    gender: initialFilters.gender || '',
  });

  useEffect(() => {
    checkScroll();
  }, [users]);

  const checkScroll = () => {
    const el = tableRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }
  };

  const scrollTable = (direction) => {
    const el = tableRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
    setTimeout(checkScroll, 100);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    router.get(route('admin.users'), newFilters, { preserveState: true, preserveScroll: true });
  };

  const clearFilters = () => {
    const cleared = { search: '', role: '', status: '', gender: '' };
    setFilters(cleared);
    router.get(route('admin.users'), {}, { preserveState: true });
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedUser) return;
    router.delete(route('admin.users.destroy', selectedUser.id), {
      onSuccess: () => {
        toast.success('User deleted successfully');
        setSelectedUser(null);
        setIsDeleteModalOpen(false);
      },
      onError: () => toast.error('Failed to delete user'),
    });
  };

  const handleAddUser = (formData) => {
    router.post(route('admin.users.store'), formData, {
      onSuccess: () => {
        toast.success('User added successfully');
        setShowAddModal(false);
      },
      onError: (errors) => {
        if (errors.email) {
          toast.error(errors.email);
        } else {
          toast.error('Failed to add user. Please check the form.');
        }
      },
    });
  };

  const handleEditUser = (userId, formData) => {
    router.put(route('admin.users.update', userId), formData, {
      onSuccess: () => {
        toast.success('User updated successfully');
        setEditUser(null);
      },
      onError: (errors) => {
        if (errors.email) {
          toast.error(errors.email);
        } else {
          toast.error('Failed to update user. Please check the form.');
        }
      },
    });
  };

  const getInitials = (user) => {
    return ((user.firstname?.[0] || '') + (user.lastname?.[0] || '')).toUpperCase();
  };

  const hasActiveFilters = filters.search || filters.role || filters.status || filters.gender;

  return (
    <AdminLayout user={auth.user}>
      <Head title="User Management" />

      <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-teal-50 to-teal-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-green-600 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-sm text-gray-600">{users.total} total users</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <UserPlus size={20} />
            <span>Add User</span>
          </button>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium"
            >
              <Filter size={16} />
              Filters
              {hasActiveFilters && (
                <span className="px-2 py-0.5 bg-teal-500 text-white text-xs rounded-full">
                  {[filters.role, filters.status, filters.gender].filter(Boolean).length}
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition text-sm font-medium"
              >
                <X size={16} />
                Clear
              </button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                >
                  <option value="">All Roles</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                >
                  <option value="">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="relative bg-white rounded-xl shadow-md overflow-hidden">
          {canScrollLeft && (
            <button onClick={() => scrollTable('left')} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-full hover:bg-gray-50 z-10">
              <ChevronLeft size={20} />
            </button>
          )}
          {canScrollRight && (
            <button onClick={() => scrollTable('right')} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-full hover:bg-gray-50 z-10">
              <ChevronRight size={20} />
            </button>
          )}

          <div ref={tableRef} className="overflow-x-auto" onScroll={checkScroll}>
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.data.length > 0 ? (
                  users.data.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.profile_image_url ? (
                            <img src={user.profile_image_url} alt={user.firstname} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-green-500 flex items-center justify-center text-white font-semibold text-sm">
                              {getInitials(user)}
                            </div>
                          )}
                          <span className="font-medium">{user.firstname} {user.lastname}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700 capitalize">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => setViewUser(user)} className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition">
                            <Eye size={18} />
                          </button>
                          <button onClick={() => setEditUser(user)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(user)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4 gap-1 flex-wrap">
          {users.links.map((link, idx) => (
            <button
              key={idx}
              disabled={!link.url}
              onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${link.active ? 'bg-teal-500 text-white' : 'bg-white text-gray-700 hover:bg-teal-50'} disabled:opacity-50`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>

        {/* Modals */}
        <ViewUserModal 
          user={viewUser} 
          isOpen={!!viewUser} 
          onClose={() => setViewUser(null)} 
        />

        <EditUserModal
          user={editUser}
          isOpen={!!editUser}
          onClose={() => setEditUser(null)}
          onSubmit={handleEditUser}
        />

        <DeleteUserModal
          user={selectedUser}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />

        <AddUserModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddUser}
        />
      </div>
    </AdminLayout>
  );
}
