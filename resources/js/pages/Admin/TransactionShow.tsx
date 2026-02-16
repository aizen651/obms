import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Badge } from "@/components/ui/badge";
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import { toast } from 'sonner';
import { 
    ArrowLeft,
    BookOpen,
    User,
    Calendar,
    DollarSign,
    Hash,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Clock,
    Edit
} from 'lucide-react';

export default function TransactionShow({ transaction, lateFeeConfig }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [status, setStatus] = useState(transaction.status);
    const [isLost, setIsLost] = useState(transaction.is_lost);
    const [fees, setFees] = useState(transaction.fees);
    const [useAutoFees, setUseAutoFees] = useState(transaction.fees === null);
    const [dateReturned, setDateReturned] = useState(transaction.date_returned || '');

    // Calculate auto fee in real-time
    const calculatedFee = transaction.calculated_fees || 0;
    const displayFee = useAutoFees ? calculatedFee : (parseFloat(fees) || 0);

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount || 0);
    };

    const handleUpdate = () => {
        setIsUpdating(true);
        
        const updateData = {
            status,
            is_lost: isLost,
            fees: useAutoFees ? null : (parseFloat(fees) || 0),
        };

        if (status === 'returned' && dateReturned) {
            updateData.date_returned = dateReturned;
        }

        if (status === 'canceled') {
            updateData.date_canceled = new Date().toISOString().split('T')[0];
        }

        router.put(`/admin/transactions/${transaction.id}`, updateData, {
            onSuccess: () => {
                toast.success('Transaction updated successfully!');
            },
            onError: (errors) => {
                toast.error('Failed to update transaction.');
                console.error(errors);
            },
            onFinish: () => {
                setIsUpdating(false);
            }
        });
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            borrowed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock },
            returned: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
            overdue: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle },
            canceled: { bg: 'bg-gray-100', text: 'text-gray-700', icon: XCircle },
        };
        
        const style = styles[status] || styles.borrowed;
        const Icon = style.icon;
        
        return (
            <Badge className={`${style.bg} ${style.text} border-0 flex items-center gap-1 text-base px-3 py-1`}>
                <Icon className="w-4 h-4" />
                <span className="capitalize">{status}</span>
            </Badge>
        );
    };

    return (
        <AdminAuthLayout header="Transaction Details">
            <Head title={`Transaction ${transaction.ref_nbr}`} />

            <div className="space-y-6">
                {/* Back Button */}
                <Link
                    href="/admin/transactions"
                    className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Transactions
                </Link>

                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 font-mono mb-2">
                                {transaction.ref_nbr}
                            </h1>
                            <p className="text-sm text-gray-600">
                                Transaction Date: {formatDate(transaction.transaction_date)}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <StatusBadge status={transaction.status} />
                            {transaction.is_lost && (
                                <Badge className="bg-red-100 text-red-700 border-0 text-base px-3 py-1">
                                    Book Lost
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Transaction Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Book Information */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-amber-600" />
                                Book Information
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm text-gray-600">Title</label>
                                    <p className="text-gray-900 font-semibold text-lg">
                                        {transaction.book?.title || 'N/A'}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600">Author</label>
                                        <p className="text-gray-900 font-medium">
                                            {transaction.book?.author || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">ISBN</label>
                                        <p className="text-gray-900 font-mono">
                                            {transaction.book?.isbn || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Borrower Information */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Borrower Information
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm text-gray-600">Name</label>
                                    <p className="text-gray-900 font-semibold text-lg">
                                        {transaction.borrower?.firstname} {transaction.borrower?.lastname}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600">Role</label>
                                        <p className="text-gray-900 font-medium capitalize">
                                            {transaction.borrower?.role || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">ID</label>
                                        <p className="text-gray-900 font-mono">
                                            {transaction.borrower?.student_id || transaction.borrower?.teacher_id || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Email</label>
                                        <p className="text-gray-900">
                                            {transaction.borrower?.email || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Contact</label>
                                        <p className="text-gray-900">
                                            {transaction.borrower?.contact || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Timeline */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-purple-600" />
                                Transaction Timeline
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600">Date Borrowed</p>
                                        <p className="text-gray-900 font-semibold">
                                            {formatDate(transaction.date_borrowed)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600">Expected Return Date</p>
                                        <p className="text-gray-900 font-semibold">
                                            {formatDate(transaction.expected_return_date)}
                                        </p>
                                    </div>
                                </div>
                                {transaction.date_returned && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600">Date Returned</p>
                                            <p className="text-green-600 font-semibold">
                                                {formatDate(transaction.date_returned)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {transaction.date_canceled && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600">Date Canceled</p>
                                            <p className="text-red-600 font-semibold">
                                                {formatDate(transaction.date_canceled)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Update Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Edit className="w-5 h-5 text-amber-600" />
                                Update Transaction
                            </h2>

                            <div className="space-y-4">
                                {/* Quantity (Read-only) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <Hash className="w-4 h-4 inline mr-1" />
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        value={transaction.quantity}
                                        disabled
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50"
                                    />
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                                    >
                                        <option value="borrowed">Borrowed</option>
                                        <option value="returned">Returned</option>
                                        <option value="overdue">Overdue</option>
                                        <option value="canceled">Canceled</option>
                                    </select>
                                </div>

                                {/* Date Returned (if status is returned) */}
                                {status === 'returned' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            Date Returned
                                        </label>
                                        <input
                                            type="date"
                                            value={dateReturned}
                                            onChange={(e) => setDateReturned(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                                        />
                                    </div>
                                )}

                                {/* Fees */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <DollarSign className="w-4 h-4 inline mr-1" />
                                        Fees (PHP)
                                    </label>
                                    
                                    {/* Auto-calculate toggle */}
                                    {lateFeeConfig?.enabled && (
                                        <div className="flex items-center gap-2 mb-3 p-2 bg-amber-50 rounded border border-amber-200">
                                            <input
                                                type="checkbox"
                                                id="auto_fees"
                                                checked={useAutoFees}
                                                onChange={(e) => setUseAutoFees(e.target.checked)}
                                                className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="auto_fees" className="text-sm font-medium text-amber-900">
                                                Auto-calculate late fees
                                            </label>
                                        </div>
                                    )}
                                    
                                    <input
                                        type="number"
                                        value={useAutoFees ? calculatedFee : fees}
                                        onChange={(e) => {
                                            setFees(e.target.value);
                                            setUseAutoFees(false);
                                        }}
                                        min="0"
                                        step="0.01"
                                        disabled={useAutoFees}
                                        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none ${
                                            useAutoFees ? 'bg-amber-50 cursor-not-allowed' : ''
                                        }`}
                                    />
                                    <div className="mt-2 space-y-1">
                                        <p className="text-sm text-gray-600">
                                            Display Fee: {formatCurrency(displayFee)}
                                        </p>
                                        {useAutoFees && lateFeeConfig?.enabled && (
                                            <p className="text-xs text-amber-600">
                                                ₱{lateFeeConfig.rate} per {lateFeeConfig.interval} · Auto-calculated
                                            </p>
                                        )}
                                    </div>
                                </div>

                       {/* Is Lost */}
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="is_lost"
                                        checked={isLost}
                                        onChange={(e) => setIsLost(e.target.checked)}
                                        className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="is_lost" className="text-sm font-medium text-gray-700">
                                        Mark as Lost
                                    </label>
                                </div>

                                {/* Update Button */}
                                <button
                                    onClick={handleUpdate}
                                    disabled={isUpdating}
                                    className="w-full px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUpdating ? 'Updating...' : 'Update Transaction'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthLayout>
    );
}