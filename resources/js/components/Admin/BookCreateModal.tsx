import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { X, BookPlus, BookOpen, Hash, FolderOpen, User, Building, Calendar, Globe, FileText, Copy, MapPin, Image as ImageIcon, Upload, Camera, Sparkles, Trash2 } from 'lucide-react';

// Shared input class
const inputCls = "w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm";

// Reusable field wrapper
const Field = ({ label, required, error, icon: Icon, children, className = '' }) => (
    <div className={className}>
        {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
        <div className="relative">
            {Icon && <Icon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />}
            {children}
        </div>
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
);

// Section header
const Section = ({ icon: Icon, title }) => (
    <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2 border-t pt-5">
        <Icon className="w-5 h-5 text-indigo-500" />{title}
    </h3>
);

export default function BookCreateModal({ isOpen, onClose, categories }) {
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const form = useForm({
        title: '', isbn: '', category_id: '', author: '', publisher: '',
        published_year: '', edition: '', language: '', pages: '',
        description: '', book_image: null, total_copies: '1', shelf_location: '', status: 'available',
    });

    const handleImageChange = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
        if (file.size > 2 * 1024 * 1024) { toast.error('Image size should be less than 2MB'); return; }
        form.setData('book_image', file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        form.setData('book_image', null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleClose = () => {
        if (!form.processing) { onClose(); form.reset(); setImagePreview(null); }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post('/admin/books', {
            forceFormData: true,
            onSuccess: () => { toast.success('Book added successfully!'); handleClose(); },
            onError: () => toast.error('Failed to add book. Check the form.'),
        });
    };

    const dragProps = {
        onDragEnter: (e) => { e.preventDefault(); setIsDragging(true); },
        onDragLeave: (e) => { e.preventDefault(); setIsDragging(false); },
        onDragOver: (e) => e.preventDefault(),
        onDrop: (e) => { e.preventDefault(); setIsDragging(false); handleImageChange(e.dataTransfer.files[0]); },
    };

    const set = (key) => (e) => form.setData(key, e.target.value);

    const FileInput = () => (
        <input ref={fileInputRef} type="file" accept="image/*" onChange={e => handleImageChange(e.target.files[0])} className="hidden" />
    );

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={handleClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-top-4 duration-300" onClick={e => e.stopPropagation()}>

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <BookPlus className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Add New Book</h2>
                                <p className="text-blue-100 text-sm">Add a book to the library</p>
                            </div>
                        </div>
                        <button onClick={handleClose} disabled={form.processing} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50">
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">

                        {/* Cover Image Upload */}
                        <div>
                            <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-indigo-500" /> Book Cover Image
                            </h3>
                            <div
                                {...dragProps}
                                className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                                    isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
                                    : imagePreview ? 'border-green-300 bg-green-50'
                                    : 'border-dashed border-gray-300 bg-gray-50 hover:border-indigo-400'
                                }`}
                            >
                                {imagePreview ? (
                                    <div className="p-5 flex flex-col sm:flex-row items-center gap-5">
                                        {/* Preview */}
                                        <div className="relative flex-shrink-0">
                                            <img src={imagePreview} alt="Cover preview" className="w-32 h-44 object-cover rounded-lg shadow-lg border-2 border-white" />
                                            <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
                                                <X className="w-4 h-4" />
                                            </button>
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full shadow flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" /> Uploaded
                                            </div>
                                        </div>
                                        {/* Actions */}
                                        <div className="space-y-3 text-center sm:text-left">
                                            <div>
                                                <p className="font-semibold text-gray-800">Cover looks great!</p>
                                                <p className="text-sm text-gray-500 mt-1">You can replace or remove the image below.</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                                <label className="cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow flex items-center gap-2">
                                                    <Camera className="w-4 h-4" /> Replace <FileInput />
                                                </label>
                                                <button type="button" onClick={removeImage} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg shadow flex items-center gap-2">
                                                    <Trash2 className="w-4 h-4" /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 flex flex-col items-center text-center gap-4">
                                        <div className={`w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow transition-transform ${isDragging ? 'scale-110 rotate-6' : ''}`}>
                                            <Upload className={`w-8 h-8 text-white ${isDragging ? 'animate-bounce' : ''}`} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{isDragging ? "Drop it here!" : "Upload Book Cover"}</p>
                                            <p className="text-sm text-gray-500 mt-1">{isDragging ? "Release to upload" : "Drag & drop or click to browse"}</p>
                                        </div>
                                        <label className="cursor-pointer px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-all flex items-center gap-2">
                                            <ImageIcon className="w-5 h-5" /> Choose Image <FileInput />
                                        </label>
                                        <p className="text-xs text-gray-400">PNG, JPG, WEBP · Max 2MB</p>
                                        {isDragging && (
                                            <div className="absolute inset-0 bg-indigo-500/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                                                <div className="text-white text-center">
                                                    <Upload className="w-12 h-12 mx-auto mb-2 animate-bounce" />
                                                    <p className="text-xl font-bold">Drop to Upload!</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {form.errors.book_image && <p className="text-red-600 text-xs mt-2">{form.errors.book_image}</p>}
                        </div>

                        {/* Basic Info */}
                        <Section icon={BookOpen} title="Basic Information" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Title" required error={form.errors.title} icon={BookOpen} className="md:col-span-2">
                                <input type="text" value={form.data.title} onChange={set('title')} className={inputCls} placeholder="Book title" required />
                            </Field>
                            <Field label="ISBN" error={form.errors.isbn} icon={Hash}>
                                <input type="text" value={form.data.isbn} onChange={set('isbn')} className={inputCls} placeholder="978-3-16-148410-0" />
                            </Field>
                            <Field label="Category" error={form.errors.category_id} icon={FolderOpen}>
                                <select value={form.data.category_id} onChange={set('category_id')} className={inputCls}>
                                    <option value="">Select category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </Field>
                            <Field label="Author" required error={form.errors.author} icon={User}>
                                <input type="text" value={form.data.author} onChange={set('author')} className={inputCls} placeholder="Author name" required />
                            </Field>
                            <Field label="Publisher" error={form.errors.publisher} icon={Building}>
                                <input type="text" value={form.data.publisher} onChange={set('publisher')} className={inputCls} placeholder="Publisher name" />
                            </Field>
                        </div>

                        {/* Publication Details */}
                        <Section icon={Calendar} title="Publication Details" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <Field label="Year" error={form.errors.published_year} icon={Calendar}>
                                <input type="number" value={form.data.published_year} onChange={set('published_year')} className={inputCls} placeholder="2024" min="1000" max={new Date().getFullYear()} />
                            </Field>
                            <Field label="Edition" error={form.errors.edition} icon={Copy}>
                                <input type="text" value={form.data.edition} onChange={set('edition')} className={inputCls} placeholder="1st" />
                            </Field>
                            <Field label="Language" error={form.errors.language} icon={Globe}>
                                <input type="text" value={form.data.language} onChange={set('language')} className={inputCls} placeholder="English" />
                            </Field>
                            <Field label="Pages" error={form.errors.pages} icon={FileText}>
                                <input type="number" value={form.data.pages} onChange={set('pages')} className={inputCls} placeholder="200" min="1" />
                            </Field>
                        </div>

                        {/* Library Details */}
                        <Section icon={MapPin} title="Library Details" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <Field label="Total Copies" required error={form.errors.total_copies} icon={Copy}>
                                <input type="number" value={form.data.total_copies} onChange={set('total_copies')} className={inputCls} placeholder="1" min="1" required />
                            </Field>
                            <Field label="Shelf Location" error={form.errors.shelf_location} icon={MapPin}>
                                <input type="text" value={form.data.shelf_location} onChange={set('shelf_location')} className={inputCls} placeholder="A1-01" />
                            </Field>
                            <Field label="Status" error={form.errors.status} icon={BookOpen}>
                                <select value={form.data.status} onChange={set('status')} className={inputCls}>
                                    <option value="available">Available</option>
                                    <option value="unavailable">Unavailable</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </Field>
                        </div>

                        {/* Description */}
                        <Field label="Description" error={form.errors.description} icon={FileText}>
                            <textarea value={form.data.description} onChange={set('description')} rows={3}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm"
                                placeholder="Brief description of the book..." />
                        </Field>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t">
                            <button type="button" onClick={handleClose} disabled={form.processing} className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all disabled:opacity-50">Cancel</button>
                            <button type="submit" disabled={form.processing} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 shadow-md">
                                {form.processing ? 'Adding...' : 'Add Book'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}