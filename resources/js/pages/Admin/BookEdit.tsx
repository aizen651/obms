import React, { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import { toast } from 'sonner';
import { 
    ArrowLeft, 
    BookOpen, 
    User, 
    Building, 
    Calendar, 
    Hash, 
    Globe, 
    FileText, 
    MapPin,
    Copy,
    Save,
    X,
    Upload,
    Image as ImageIcon
} from 'lucide-react';

export default function BookEdit({ book, categories }) {
    const [imagePreview, setImagePreview] = useState(book.image_url || null);

    const { data, setData, post, processing, errors } = useForm({
        title: book.title || '',
        isbn: book.isbn || '',
        category_id: book.category_id || '',
        author: book.author || '',
        publisher: book.publisher || '',
        published_year: book.published_year || '',
        edition: book.edition || '',
        language: book.language || '',
        pages: book.pages || '',
        description: book.description || '',
        book_image: null,
        total_copies: book.total_copies || 1,
        shelf_location: book.shelf_location || '',
        status: book.status || 'available',
        _method: 'PUT'
    });

    // Prevent backspace from navigating back
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Backspace' && 
                e.target.tagName !== 'INPUT' && 
                e.target.tagName !== 'TEXTAREA' &&
                !e.target.isContentEditable) {
                e.preventDefault();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('book_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.books.update', book.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Book updated successfully!');
            },
            onError: (errors) => {
                if (errors.error) {
                    toast.error(errors.error);
                } else {
                    toast.error('Failed to update book');
                }
            }
        });
    };

    return (
        <AdminAuthLayout header="Edit Book">
            <Head title={`Edit ${book.title}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={() => router.visit(route('admin.books.show', book.id))}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Book Details
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Image Upload */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border p-6 lg:sticky lg:top-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Cover</h3>
                                
                                {/* Image Preview */}
                                <div className="mb-4">
                                    {imagePreview ? (
                                        <div className="relative group">
                                            <img 
                                                src={imagePreview} 
                                                alt="Book cover preview"
                                                className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setData('book_image', null);
                                                }}
                                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-full aspect-[2/3] rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
                                            <ImageIcon className="w-16 h-16 mb-2" />
                                            <p className="text-sm">No image</p>
                                        </div>
                                    )}
                                </div>

                                {/* Upload Button */}
                                <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg cursor-pointer transition">
                                    <Upload className="w-4 h-4" />
                                    {imagePreview ? 'Change Image' : 'Upload Image'}
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                                {errors.book_image && (
                                    <p className="mt-2 text-sm text-red-600">{errors.book_image}</p>
                                )}
                                <p className="mt-2 text-xs text-gray-500">
                                    Supported formats: JPEG, PNG, GIF, WebP. Max size: 2MB
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Form Fields */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Book Title <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <BookOpen className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition ${
                                                    errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                                placeholder="Enter book title"
                                            />
                                        </div>
                                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            ISBN <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Hash className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={data.isbn}
                                                onChange={(e) => setData('isbn', e.target.value)}
                                                className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition ${
                                                    errors.isbn ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                                placeholder="978-3-16-148410-0"
                                            />
                                        </div>
                                        {errors.isbn && <p className="mt-1 text-sm text-red-600">{errors.isbn}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            className={`block w-full pl-3 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition ${
                                                errors.category_id ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Author <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={data.author}
                                                onChange={(e) => setData('author', e.target.value)}
                                                className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition ${
                                                    errors.author ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                                placeholder="Author name"
                                            />
                                        </div>
                                        {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Publisher <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Building className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={data.publisher}
                                                onChange={(e) => setData('publisher', e.target.value)}
                                                className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition ${
                                                    errors.publisher ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                                placeholder="Publisher name"
                                            />
                                        </div>
                                        {errors.publisher && <p className="mt-1 text-sm text-red-600">{errors.publisher}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Published Year
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Calendar className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                value={data.published_year}
                                                onChange={(e) => setData('published_year', e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                                                placeholder="2024"
                                                min="1000"
                                                max={new Date().getFullYear()}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Edition
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Copy className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={data.edition}
                                                onChange={(e) => setData('edition', e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                                                placeholder="1st Edition"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Language
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Globe className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={data.language}
                                                onChange={(e) => setData('language', e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                                                placeholder="English"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Number of Pages
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FileText className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                value={data.pages}
                                                onChange={(e) => setData('pages', e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                                                placeholder="250"
                                                min="1"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={4}
                                            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none"
                                            placeholder="Enter book description..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Library Management</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Total Copies <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={data.total_copies}
                                            onChange={(e) => setData('total_copies', e.target.value)}
                                            className={`block w-full pl-3 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition ${
                                                errors.total_copies ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            placeholder="1"
                                            min="1"
                                        />
                                        {errors.total_copies && <p className="mt-1 text-sm text-red-600">{errors.total_copies}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Shelf Location
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <MapPin className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={data.shelf_location}
                                                onChange={(e) => setData('shelf_location', e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                                                placeholder="A-12-3"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className={`block w-full pl-3 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition ${
                                                errors.status ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="available">Available</option>
                                            <option value="unavailable">Unavailable</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                        {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => router.visit(route('admin.books.show', book.id))}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
                                    >
                                        <Save className="w-4 h-4" />
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminAuthLayout>
    );
}