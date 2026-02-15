import React from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { X, FolderPlus, Tag, FileText } from 'lucide-react';

export default function CategoryCreateModal({ isOpen, onClose }) {
    const form = useForm({
        name: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post('/admin/categories', {
            onSuccess: () => {
                toast.success('Category created successfully!');
                onClose();
                form.reset();
            },
            onError: () => {
                toast.error('Failed to create category. Check the form.');
            },
        });
    };

    const handleClose = () => {
        if (!form.processing) {
            onClose();
            form.reset();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div 
                    className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-top-4 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <FolderPlus className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Create Category</h2>
                                <p className="text-amber-50 text-sm">Add a new book category</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={form.processing}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="overflow-y-auto flex-1">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Category Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Tag className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                        placeholder="e.g., Fiction, Science, History"
                                        required
                                    />
                                </div>
                                {form.errors.name && (
                                    <p className="text-red-600 text-sm mt-1">{form.errors.name}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <div className="relative">
                                    <FileText className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                    <textarea
                                        value={form.data.description}
                                        onChange={(e) => form.setData('description', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                                        placeholder="Brief description of this category..."
                                        rows={4}
                                    />
                                </div>
                                {form.errors.description && (
                                    <p className="text-red-600 text-sm mt-1">{form.errors.description}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={form.processing}
                                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 shadow-md"
                                >
                                    {form.processing ? 'Creating...' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
