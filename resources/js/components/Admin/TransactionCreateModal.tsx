import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { X, Calendar, User, BookOpen, Hash, DollarSign } from 'lucide-react';

export default function TransactionCreateModal({ isOpen, onClose, books, users }) {
    const [formData, setFormData] = useState({
        book_id: '',
        borrower_id: '',
        quantity: 1,
        date_borrowed: new Date().toISOString().split('T')[0],
        expected_return_date: '',
        fees: 0,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post('/admin/transactions', formData, {
            onSuccess: (response) => {
                toast.success(`Transaction created! Ref: ${response.props.refNumber || 'Success'}`);
                onClose();
                resetForm();
            },
            onError: (errors) => {
                setErrors(errors);
                toast.error('Failed to create transaction. Please check the form.');
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    };

    const resetForm = () => {
        setFormData({
            book_id: '',
            borrower_id: '',
            quantity: 1,
            date_borrowed: new Date().toISOString().split('T')[0],
            expected_return_date: '',
            fees: 0,
        });
        setErrors({});
    };

    const handleClose = () => {
        if (!isSubmitting) {
            resetForm();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
                    <h2 className="text-xl font-bold">New Transaction</h2>
                    <button 
                        onClick={handleClose} 
                        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        disabled={isSubmitting}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Info Box */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-800">
                            <span className="font-semibold">Note:</span> A unique reference number (CTU-XXXXXX) will be automatically generated for this transaction.
                        </p>
                    </div>

                    {/* Book Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <BookOpen className="w-4 h-4 inline mr-1" />
                            Book <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="book_id"
                            value={formData.book_id}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none ${
                                errors.book_id ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        >
                            <option value="">Select a book</option>
                            {books?.map(book => (
                                <option key={book.id} value={book.id}>
                                    {book.title} - {book.author} (Available: {book.available_copies})
                                </option>
                            ))}
                        </select>
                        {errors.book_id && (
                            <p className="text-red-500 text-xs mt-1">{errors.book_id}</p>
                        )}
                    </div>

                    {/* Borrower Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-1" />
                            Borrower <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="borrower_id"
                            value={formData.borrower_id}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none ${
                                errors.borrower_id ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        >
                            <option value="">Select a borrower</option>
                            {users?.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.firstname} {user.lastname} - {user.role} ({user.student_id || user.teacher_id})
                                </option>
                            ))}
                        </select>
                        {errors.borrower_id && (
                            <p className="text-red-500 text-xs mt-1">{errors.borrower_id}</p>
                        )}
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Hash className="w-4 h-4 inline mr-1" />
                            Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="1"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none ${
                                errors.quantity ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        />
                        {errors.quantity && (
                            <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
                        )}
                    </div>

                    {/* Date Borrowed & Expected Return */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Date Borrowed <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="date_borrowed"
                                value={formData.date_borrowed}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none ${
                                    errors.date_borrowed ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            {errors.date_borrowed && (
                                <p className="text-red-500 text-xs mt-1">{errors.date_borrowed}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Expected Return <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="expected_return_date"
                                value={formData.expected_return_date}
                                onChange={handleChange}
                                min={formData.date_borrowed}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none ${
                                    errors.expected_return_date ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            {errors.expected_return_date && (
                                <p className="text-red-500 text-xs mt-1">{errors.expected_return_date}</p>
                            )}
                        </div>
                    </div>

                    {/* Fees */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <DollarSign className="w-4 h-4 inline mr-1" />
                            Fees (PHP)
                        </label>
                        <input
                            type="number"
                            name="fees"
                            value={formData.fees}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none ${
                                errors.fees ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.fees && (
                            <p className="text-red-500 text-xs mt-1">{errors.fees}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
