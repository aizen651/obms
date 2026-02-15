import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { 
    X, 
    BookPlus, 
    BookOpen, 
    Hash, 
    FolderOpen,
    User,
    Building,
    Calendar,
    Globe,
    FileText,
    Copy,
    MapPin,
    Image as ImageIcon,
    Upload,
    Camera,
    Sparkles,
    Trash2
} from 'lucide-react';

export default function BookCreateModal({ isOpen, onClose, categories }) {
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    
    const form = useForm({
        title: '',
        isbn: '',
        category_id: '',
        author: '',
        publisher: '',
        published_year: '',
        edition: '',
        language: '',
        pages: '',
        description: '',
        book_image: null,
        total_copies: '1',
        shelf_location: '',
        status: 'available',
    });

    const handleImageChange = (file) => {
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size should be less than 2MB');
                return;
            }

            form.setData('book_image', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        handleImageChange(file);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        handleImageChange(file);
    };

    const removeImage = () => {
        form.setData('book_image', null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post('/admin/books', {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Book added successfully!');
                onClose();
                form.reset();
                setImagePreview(null);
            },
            onError: () => {
                toast.error('Failed to add book. Check the form.');
            },
        });
    };

    const handleClose = () => {
        if (!form.processing) {
            onClose();
            form.reset();
            setImagePreview(null);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
                onClick={handleClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div 
                    className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-top-4 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <BookPlus className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Add New Book</h2>
                                <p className="text-amber-50 text-sm">Add a book to the library</p>
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
                            {/* Book Image Upload - NEW UNIQUE DESIGN */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-amber-600" />
                                    Book Cover Image
                                </h3>
                                
                                <div className="relative">
                                    {/* Main Upload Container */}
                                    <div 
                                        className={`relative overflow-hidden rounded-2xl border-3 transition-all duration-300 ${
                                            isDragging 
                                                ? 'border-amber-500 bg-amber-50 scale-105 shadow-xl' 
                                                : imagePreview 
                                                ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' 
                                                : 'border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-amber-50/30 hover:border-amber-400 hover:shadow-lg'
                                        }`}
                                        onDragEnter={handleDragEnter}
                                        onDragLeave={handleDragLeave}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                    >
                                        {imagePreview ? (
                                            /* Image Preview State */
                                            <div className="relative p-6">
                                                <div className="flex flex-col lg:flex-row items-center gap-6">
                                                    {/* Preview Image with 3D Effect */}
                                                    <div className="relative group">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                                        <div className="relative">
                                                            <img 
                                                                src={imagePreview} 
                                                                alt="Book cover preview" 
                                                                className="w-48 h-64 object-cover rounded-xl shadow-2xl border-4 border-white transform transition-transform group-hover:scale-105 group-hover:rotate-1"
                                                            />
                                                            {/* Remove Button Overlay */}
                                                            <button
                                                                type="button"
                                                                onClick={removeImage}
                                                                className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                                                            >
                                                                <X className="w-5 h-5" />
                                                            </button>
                                                            {/* Success Badge */}
                                                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                                                                <Sparkles className="w-3 h-3" />
                                                                Uploaded
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Image Info & Actions */}
                                                    <div className="flex-1 space-y-4 text-center lg:text-left">
                                                        <div>
                                                            <h4 className="text-lg font-bold text-gray-800 mb-2">Perfect! Your cover looks great</h4>
                                                            <p className="text-sm text-gray-600">
                                                                The book cover has been uploaded successfully. You can continue filling out the form or replace the image.
                                                            </p>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                                            <label className="cursor-pointer">
                                                                <div className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-md hover:shadow-xl transition-all flex items-center gap-2">
                                                                    <Camera className="w-5 h-5" />
                                                                    Replace Image
                                                                </div>
                                                                <input
                                                                    ref={fileInputRef}
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleFileInputChange}
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                            <button
                                                                type="button"
                                                                onClick={removeImage}
                                                                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-md hover:shadow-xl transition-all flex items-center gap-2"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Upload State */
                                            <div className="p-8 lg:p-12">
                                                <div className="flex flex-col items-center text-center space-y-6">
                                                    {/* Animated Icon */}
                                                    <div className="relative">
                                                        <div className={`absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl blur-2xl ${isDragging ? 'opacity-60 animate-pulse' : 'opacity-20'}`}></div>
                                                        <div className={`relative w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center transition-transform ${isDragging ? 'scale-110 rotate-6' : 'scale-100'}`}>
                                                            <Upload className={`w-12 h-12 text-white ${isDragging ? 'animate-bounce' : ''}`} />
                                                        </div>
                                                    </div>

                                                    {/* Text Content */}
                                                    <div className="space-y-2">
                                                        <h4 className="text-xl font-bold text-gray-800">
                                                            {isDragging ? 'Drop it like it\'s hot! 🔥' : 'Upload Book Cover'}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 max-w-md">
                                                            {isDragging 
                                                                ? 'Release to upload your awesome book cover'
                                                                : 'Drag and drop your book cover here, or click to browse'
                                                            }
                                                        </p>
                                                    </div>

                                                    {/* Upload Button */}
                                                    <label className="cursor-pointer group">
                                                        <div className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3">
                                                            <ImageIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                                            Choose Image
                                                        </div>
                                                        <input
                                                            ref={fileInputRef}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleFileInputChange}
                                                            className="hidden"
                                                        />
                                                    </label>

                                                    {/* Format Info */}
                                                    <div className="flex items-center gap-6 text-xs text-gray-500 pt-4 border-t border-gray-200 w-full max-w-md">
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                            <span>PNG, JPG, GIF, WEBP</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                            <span>Max 2MB</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Drag Overlay */}
                                        {isDragging && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/90 to-orange-500/90 backdrop-blur-sm flex items-center justify-center">
                                                <div className="text-center text-white">
                                                    <Upload className="w-16 h-16 mx-auto mb-4 animate-bounce" />
                                                    <p className="text-2xl font-bold">Drop to Upload!</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Error Message */}
                                    {form.errors.book_image && (
                                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <X className="w-3 h-3 text-white" />
                                            </div>
                                            <p className="text-red-700 text-sm font-medium">{form.errors.book_image}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-amber-600" />
                                    Basic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Book Title <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <BookOpen className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                value={form.data.title}
                                                onChange={(e) => form.setData('title', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                                placeholder="Enter book title"
                                                required
                                            />
                                        </div>
                                        {form.errors.title && (
                                            <p className="text-red-600 text-sm mt-1">{form.errors.title}</p>
                                        )}
                                    </div>

                                    {/* ISBN */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            ISBN <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Hash className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                value={form.data.isbn}
                                                onChange={(e) => form.setData('isbn', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                                placeholder="978-0-123456-78-9"
                                                required
                                            />
                                        </div>
                                        {form.errors.isbn && (
                                            <p className="text-red-600 text-sm mt-1">{form.errors.isbn}</p>
                                        )}
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <FolderOpen className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <select
                                                value={form.data.category_id}
                                                onChange={(e) => form.setData('category_id', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none appearance-none"
                                                required
                                            >
                                                <option value="">Select category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {form.errors.category_id && (
                                            <p className="text-red-600 text-sm mt-1">{form.errors.category_id}</p>
                                        )}
                                    </div>

                                    {/* Author */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Author <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                value={form.data.author}
                                                onChange={(e) => form.setData('author', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                                placeholder="Author name"
                                                required
                                            />
                                        </div>
                                        {form.errors.author && (
                                            <p className="text-red-600 text-sm mt-1">{form.errors.author}</p>
                                        )}
                                    </div>

                                    {/* Publisher */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Publisher <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Building className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                value={form.data.publisher}
                                                onChange={(e) => form.setData('publisher', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                                placeholder="Publisher name"
                                                required
                                            />
                                        </div>
                                        {form.errors.publisher && (
                                            <p className="text-red-600 text-sm mt-1">{form.errors.publisher}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-amber-600" />
                                    Additional Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Published Year */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Published Year
                                        </label>
                                        <div className="relative">
                                            <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="number"
                                                value={form.data.published_year}
                                                onChange={(e) => form.setData('published_year', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                                placeholder="2024"
                                                min="1000"
                                                max={new Date().getFullYear()}
                                            />
                                        </div>
                                        {form.errors.published_year && (
                                            <p className="text-red-600 text-sm mt-1">{form.errors.published_year}</p>
                                        )}
                                    </div>

                                    {/* Edition */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Edition
                                        </label>
                                        <input
                                            type="text"
                                            value={form.data.edition}
                                            onChange={(e) => form.setData('edition', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                            placeholder="1st, 2nd, etc."
                                        />
                                    </div>

                                    {/* Language */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Language
                                        </label>
                                        <div className="relative">
                                            <Globe className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                value={form.data.language}
                                                onChange={(e) => form.setData('language', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                                placeholder="English, Spanish, etc."
                                            />
                                        </div>
                                    </div>

                                    {/* Pages */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pages
                                        </label>
                                        <input
                                            type="number"
                                            value={form.data.pages}
                                            onChange={(e) => form.setData('pages', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                            placeholder="Number of pages"
                                            min="1"
                                        />
                                    </div>

                                    {/* Total Copies */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Total Copies <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Copy className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="number"
                                                value={form.data.total_copies}
                                                onChange={(e) => form.setData('total_copies', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                                placeholder="1"
                                                min="1"
                                                required
                                            />
                                        </div>
                                        {form.errors.total_copies && (
                                            <p className="text-red-600 text-sm mt-1">{form.errors.total_copies}</p>
                                        )}
                                    </div>

                                    {/* Shelf Location */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Shelf Location
                                        </label>
                                        <div className="relative">
                                            <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                value={form.data.shelf_location}
                                                onChange={(e) => form.setData('shelf_location', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                                placeholder="A-12, B-5, etc."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={form.data.description}
                                        onChange={(e) => form.setData('description', e.target.value)}
                                        rows="4"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                                        placeholder="Brief description of the book..."
                                    />
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="border-t pt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={form.processing}
                                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    {form.processing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <BookPlus className="w-5 h-5" />
                                            Add Book
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
                              