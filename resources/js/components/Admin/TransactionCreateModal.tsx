import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { X, Calendar, User, BookOpen, Hash, DollarSign } from 'lucide-react';

const today = new Date().toISOString().split('T')[0];
const defaultForm = { book_id: '', borrower_id: '', quantity: 1, date_borrowed: today, expected_return_date: '', fees: 0 };

const inputCls = (err) => `w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none ${err ? 'border-red-500' : 'border-gray-300'}`;

const Field = ({ label, icon: Icon, required, error, children }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            {Icon && <Icon className="w-4 h-4" />}{label}{required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

export default function TransactionCreateModal({ isOpen, onClose, books, users }) {
    const [formData, setFormData] = useState(defaultForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const resetForm = () => { setFormData(defaultForm); setErrors({}); };
    const handleClose = () => { if (!isSubmitting) { resetForm(); onClose(); } };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post('/admin/transactions', formData, {
            onSuccess: (res) => { toast.success(`Transaction created! Ref: ${res.props.refNumber || 'Success'}`); handleClose(); },
            onError: (errs) => { setErrors(errs); toast.error('Failed to create transaction. Please check the form.'); },
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-top-4 duration-300">

                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
                    <div>
                        <h2 className="text-xl font-bold">New Transaction</h2>
                        <p className="text-blue-100 text-sm">Borrow a book from the library</p>
                    </div>
                    <button onClick={handleClose} disabled={isSubmitting} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Note */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <p className="text-sm text-indigo-800"><span className="font-semibold">Note:</span> A unique reference number (CTU-XXXXXX) will be automatically generated for this transaction.</p>
                    </div>

                    {/* Book */}
                    <Field label="Book" icon={BookOpen} required error={errors.book_id}>
                        <select name="book_id" value={formData.book_id} onChange={handleChange} className={inputCls(errors.book_id)} required>
                            <option value="">Select a book</option>
                            {books?.map(b => <option key={b.id} value={b.id}>{b.title} — {b.author} (Available: {b.available_copies})</option>)}
                        </select>
                    </Field>

                    {/* Borrower */}
                    <Field label="Borrower" icon={User} required error={errors.borrower_id}>
                        <select name="borrower_id" value={formData.borrower_id} onChange={handleChange} className={inputCls(errors.borrower_id)} required>
                            <option value="">Select a borrower</option>
                            {users?.map(u => <option key={u.id} value={u.id}>{u.firstname} {u.lastname} — {u.role} ({u.student_id || u.teacher_id})</option>)}
                        </select>
                    </Field>

                    {/* Quantity */}
                    <Field label="Quantity" icon={Hash} required error={errors.quantity}>
                        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" className={inputCls(errors.quantity)} required />
                    </Field>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Date Borrowed" icon={Calendar} required error={errors.date_borrowed}>
                            <input type="date" name="date_borrowed" value={formData.date_borrowed} onChange={handleChange} className={inputCls(errors.date_borrowed)} required />
                        </Field>
                        <Field label="Expected Return" icon={Calendar} required error={errors.expected_return_date}>
                            <input type="date" name="expected_return_date" value={formData.expected_return_date} onChange={handleChange} min={formData.date_borrowed} className={inputCls(errors.expected_return_date)} required />
                        </Field>
                    </div>

                    {/* Fees */}
                    <Field label="Fees (PHP)" icon={DollarSign} error={errors.fees}>
                        <input type="number" name="fees" value={formData.fees} onChange={handleChange} min="0" step="0.01" className={inputCls(errors.fees)} />
                    </Field>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button type="button" onClick={handleClose} disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? 'Creating...' : 'Create Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}