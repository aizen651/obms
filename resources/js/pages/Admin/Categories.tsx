import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import CategoryCreateModal from '@/components/Admin/CategoryCreateModal';
import CategoryEditModal from '@/components/Admin/CategoryEditModal';
import DeleteConfirmationModal from '@/components/Admin/DeleteConfirmationModal';
import { toast } from 'sonner';
import { 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    FolderOpen,
    BookOpen,
    ChevronUp,
    ChevronDown,
    ArrowUpDown
} from 'lucide-react';

export default function Categories({ categories, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    // Add live search with debounce
    const DEBOUNCE_DELAY = 500;

    useEffect(() => {
        const handler = setTimeout(() => {
            router.get('/admin/categories', {
                search,
                sort: filters?.sort,
                direction: filters?.direction,
            }, {
                preserveState: true,
                replace: true,
            });
        }, DEBOUNCE_DELAY);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

   {/* const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/categories', { search }, { preserveState: true });
    }; */}

    const handleSort = (column) => {
        const direction = filters?.sort === column && filters?.direction === 'asc' 
            ? 'desc' 
            : 'asc';
        
        router.get('/admin/categories', { 
            search, 
            sort: column, 
            direction 
        }, { 
            preserveState: true 
        });
    };

    const handleReset = () => {
        setSearch('');
        router.get('/admin/categories');
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };

    const handleDelete = (category) => {
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!categoryToDelete) return;
        
        setIsDeleting(true);
        router.delete(`/admin/categories/${categoryToDelete.id}`, {
            onSuccess: () => {
                toast.success('Category deleted successfully!');
                setIsDeleteModalOpen(false);
                setCategoryToDelete(null);
            },
            onError: (errors) => {
                if (errors.error) {
                    toast.error(errors.error);
                } else {
                    toast.error('Failed to delete category.');
                }
            },
            onFinish: () => {
                setIsDeleting(false);
            }
        });
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
        <AdminAuthLayout>
            <Head title="Categories" />

            <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Book Categories</h2>
                        <p className="text-sm text-gray-600">{categories.total} total categories</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Category
                    </button>
                </div>

                {/* Search & Sort Bar */}
                <div className="bg-white rounded-xl shadow-md p-4">
                   
                        {/* Search Input */}
                        <div className="relative">
                           <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search categories..."
                                className="w-full pl-10 pr-4 py-2.5 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>

                        {/* Sort Buttons */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => handleSort('name')}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                                    filters?.sort === 'name'
                                        ? 'bg-amber-100 text-amber-700 border-2 border-amber-500'
                                        : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                                }`}
                            >
                                <ArrowUpDown className="w-4 h-4" />
                                Name
                                <SortIcon column="name" />
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSort('created_at')}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                                    filters?.sort === 'created_at'
                                        ? 'bg-amber-100 text-amber-700 border-2 border-amber-500'
                                        : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                                }`}
                            >
                                <ArrowUpDown className="w-4 h-4" />
                                Date Created
                                <SortIcon column="created_at" />
                            </button>

                            {search && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all font-medium text-sm"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
      
                </div>

                {/* Categories Grid - Mobile */}
                <div className="block lg:hidden space-y-3">
                    {categories.data.length > 0 ? (
                        categories.data.map((category) => (
                            <div 
                                key={category.id} 
                                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                                        <FolderOpen className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate text-lg">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                            {category.description || 'No description'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm mb-3 pt-3 border-t">
                                    <div className="flex items-center gap-2 text-amber-600">
                                        <BookOpen className="w-4 h-4" />
                                        <span className="font-semibold">{category.books_count || 0}</span>
                                        <span className="text-gray-500">books</span>
                                    </div>
                                    <div className="text-gray-500">
                                        Added {new Date(category.created_at).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        })}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-center font-medium text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category)}
                                        className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors font-medium text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No categories found</p>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
                        </div>
                    )}
                </div>

                {/* Categories Table - Desktop */}
                <div className="hidden lg:block bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-amber-50 to-orange-50">
                                <tr className="border-b border-amber-100">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        <button 
                                            onClick={() => handleSort('name')} 
                                            className="flex items-center gap-1 hover:text-amber-600 transition-colors"
                                        >
                                            Category Name
                                            <SortIcon column="name" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Description
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Books
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        <button 
                                            onClick={() => handleSort('created_at')} 
                                            className="flex items-center gap-1 hover:text-amber-600 transition-colors"
                                        >
                                            Created
                                            <SortIcon column="created_at" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.data.length > 0 ? (
                                    categories.data.map((category) => (
                                        <tr key={category.id} className="hover:bg-amber-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white flex-shrink-0">
                                                        <FolderOpen className="w-5 h-5" />
                                                    </div>
                                                    <div className="font-medium text-gray-900">
                                                        {category.name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 max-w-md">
                                                <p className="line-clamp-2">
                                                    {category.description || (
                                                        <span className="text-gray-400 italic">No description</span>
                                                    )}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4 text-amber-600" />
                                                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                                                        {category.books_count || 0}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {new Date(category.created_at).toLocaleDateString('en-US', { 
                                                    month: 'short', 
                                                    day: 'numeric', 
                                                    year: 'numeric' 
                                                })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button 
                                                        onClick={() => handleEdit(category)} 
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(category)} 
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
                                        <td colSpan="5" className="px-4 py-12 text-center">
                                            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 font-medium">No categories found</p>
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
                {categories.data.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md px-4 py-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium text-gray-800">
                                    {categories.from}-{categories.to}
                                </span> of{' '}
                                <span className="font-medium text-gray-800">
                                    {categories.total}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1 justify-center">
                                {categories.links.map((link, index) => (
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
            <CategoryCreateModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
            
            <CategoryEditModal 
                isOpen={isEditModalOpen} 
                onClose={() => { 
                    setIsEditModalOpen(false); 
                    setSelectedCategory(null); 
                }} 
                category={selectedCategory} 
            />
            
            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setCategoryToDelete(null);
                }}
                onConfirm={confirmDelete}
                userName={categoryToDelete?.name || ''}
                isDeleting={isDeleting}
            />
        </AdminAuthLayout>
    );
}