import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import DeleteConfirmationModal from '@/components/Admin/DeleteConfirmationModal';
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
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Archive
} from 'lucide-react';

export default function BookShow({ book }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const getStatusConfig = (status) => {
        const configs = {
            available: { 
                icon: CheckCircle, 
                color: 'text-green-600', 
                bg: 'bg-green-50', 
                border: 'border-green-200',
                label: 'Available'
            },
            unavailable: { 
                icon: XCircle, 
                color: 'text-red-600', 
                bg: 'bg-red-50', 
                border: 'border-red-200',
                label: 'Unavailable'
            },
            archived: { 
                icon: Archive, 
                color: 'text-gray-600', 
                bg: 'bg-gray-50', 
                border: 'border-gray-200',
                label: 'Archived'
            }
        };
        return configs[status] || configs.archived;
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        setIsDeleting(true);
        router.delete(route('admin.books.destroy', book.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            }
        });
    };

    const statusConfig = getStatusConfig(book.status);
    const StatusIcon = statusConfig.icon;

    const InfoItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-semibold text-gray-900">{value || 'N/A'}</p>
            </div>
        </div>
    );

    return (
        <AdminAuthLayout header="Book Details">
            <Head title={`${book.title} - Book Details`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Link
                        href={route('admin.books.index')}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Books
                    </Link>
                    <div className="flex gap-2">
                        <Link
                            href={route('admin.books.edit', book.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </Link>
                        <button
                            onClick={handleDeleteClick}
                            type="button"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Book Cover & Status */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Book Cover */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            {book.image_url ? (
                                <img 
                                    src={book.image_url} 
                                    alt={book.title}
                                    className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg"
                                />
                            ) : (
                                <div className="w-full aspect-[2/3] rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
                                    <BookOpen className="w-24 h-24" />
                                </div>
                            )}
                        </div>

                        {/* Status Card */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
                            <div className={`flex items-center gap-3 p-4 rounded-lg border ${statusConfig.bg} ${statusConfig.border}`}>
                                <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
                                <div className="flex-1">
                                    <p className={`font-semibold ${statusConfig.color}`}>{statusConfig.label}</p>
                                    <p className="text-sm text-gray-600">Current status</p>
                                </div>
                            </div>

                            {/* Availability */}
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Available Copies</span>
                                    <span className="text-2xl font-bold text-amber-600">
                                        {book.available_copies}/{book.total_copies}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                        className="bg-amber-500 h-2.5 rounded-full" 
                                        style={{ width: `${(book.available_copies / book.total_copies) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {book.total_copies - book.available_copies} currently borrowed
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Book Details */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Basic Information */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-medium">
                                        {book.category?.name || 'Uncategorized'}
                                    </span>
                                    {book.published_year && (
                                        <span className="text-sm text-gray-500">
                                            Published {book.published_year}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {book.description && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Description</h3>
                                    <p className="text-gray-700 leading-relaxed">{book.description}</p>
                                </div>
                            )}

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InfoItem icon={User} label="Author" value={book.author} />
                                <InfoItem icon={Building} label="Publisher" value={book.publisher} />
                                <InfoItem icon={Hash} label="ISBN" value={book.isbn} />
                                <InfoItem icon={Calendar} label="Published Year" value={book.published_year} />
                                <InfoItem icon={Globe} label="Language" value={book.language} />
                                <InfoItem icon={FileText} label="Pages" value={book.pages} />
                                <InfoItem icon={Copy} label="Edition" value={book.edition} />
                                <InfoItem icon={MapPin} label="Shelf Location" value={book.shelf_location} />
                            </div>
                        </div>

                        {/* Borrowing History */}
                        {book.borrows && book.borrows.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Borrowing History</h3>
                                <div className="space-y-3">
                                    {book.borrows.slice(0, 5).map((borrow) => (
                                        <div key={borrow.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{borrow.user?.name || 'Unknown User'}</p>
                                                <p className="text-sm text-gray-500">
                                                    Borrowed: {new Date(borrow.borrowed_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                                    borrow.status === 'returned' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                    borrow.status === 'overdue' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                    'bg-blue-50 text-blue-700 border border-blue-200'
                                                }`}>
                                                    {borrow.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                userName={book.title}
                isDeleting={isDeleting}
            />
        </AdminAuthLayout>
    );
}
