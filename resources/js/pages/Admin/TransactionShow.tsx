import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Badge } from "@/components/ui/badge";
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import { toast } from 'sonner';
import { ArrowLeft, BookOpen, User, Calendar, DollarSign, Hash, CheckCircle2, XCircle, AlertCircle, Clock, Edit } from 'lucide-react';

export default function TransactionShow({ transaction, lateFeeConfig }) {
    const [state, setState] = useState({
        status: transaction.status,
        isLost: transaction.is_lost,
        fees: transaction.fees ?? 0,
        useAutoFees: transaction.fees === null,
        dateReturned: transaction.date_returned || '',
        isUpdating: false
    });

    const autoEnabled = lateFeeConfig?.enabled;
    const calculatedFee = transaction.calculated_fees || 0;
    const displayFee = (state.useAutoFees && autoEnabled) ? calculatedFee : parseFloat(state.fees) || 0;

    const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));
    const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';
    const formatCurrency = (amount) => `₱${parseFloat(amount || 0).toFixed(2)}`;

    const handleUpdate = () => {
        updateState({ isUpdating: true });
        router.put(`/admin/transactions/${transaction.id}`, {
            status: state.status,
            is_lost: state.isLost,
            fees: (state.useAutoFees && autoEnabled) ? null : parseFloat(state.fees) || 0,
            ...(state.status === 'returned' && state.dateReturned && { date_returned: state.dateReturned }),
            ...(state.status === 'canceled' && { date_canceled: new Date().toISOString().split('T')[0] })
        }, {
            onSuccess: () => toast.success('Transaction updated!'),
            onError: () => toast.error('Update failed'),
            onFinish: () => updateState({ isUpdating: false })
        });
    };

    const StatusBadge = ({ status }) => {
        const config = { borrowed: ['bg-blue-100 text-blue-700', Clock], returned: ['bg-green-100 text-green-700', CheckCircle2], overdue: ['bg-red-100 text-red-700', AlertCircle], canceled: ['bg-gray-100 text-gray-700', XCircle] };
        const [className, Icon] = config[status] || config.borrowed;
        return <Badge className={`${className} border-0 flex items-center gap-1 px-3 py-1`}><Icon className="w-4 h-4" /><span className="capitalize">{status}</span></Badge>;
    };

    const InfoCard = ({ icon: Icon, title, children, color = "amber" }) => (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className={`text-lg font-bold mb-4 flex items-center gap-2`}><Icon className={`w-5 h-5 text-${color}-600`} />{title}</h2>
            {children}
        </div>
    );

    return (
        <AdminAuthLayout header="Transaction Details">
            <Head title={`Transaction ${transaction.ref_nbr}`} />
            <div className="space-y-6">
                <Link href="/admin/transactions" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium">
                    <ArrowLeft className="w-4 h-4" />Back to Transactions
                </Link>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold font-mono mb-2">{transaction.ref_nbr}</h1>
                            <p className="text-sm text-gray-600">Transaction Date: {formatDate(transaction.transaction_date)}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <StatusBadge status={transaction.status} />
                            {transaction.is_lost && <Badge className="bg-red-100 text-red-700 border-0 px-3 py-1">Book Lost</Badge>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <InfoCard icon={BookOpen} title="Book Information">
                            <div className="space-y-3">
                                <div><label className="text-sm text-gray-600">Title</label><p className="font-semibold text-lg">{transaction.book?.title || 'N/A'}</p></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-sm text-gray-600">Author</label><p className="font-medium">{transaction.book?.author || 'N/A'}</p></div>
                                    <div><label className="text-sm text-gray-600">ISBN</label><p className="font-mono">{transaction.book?.isbn || 'N/A'}</p></div>
                                </div>
                            </div>
                        </InfoCard>

                        <InfoCard icon={User} title="Borrower Information" color="blue">
                            <div className="space-y-3">
                                <div><label className="text-sm text-gray-600">Name</label><p className="font-semibold text-lg">{transaction.borrower?.firstname} {transaction.borrower?.lastname}</p></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-sm text-gray-600">Role</label><p className="font-medium capitalize">{transaction.borrower?.role || 'N/A'}</p></div>
                                    <div><label className="text-sm text-gray-600">ID</label><p className="font-mono">{transaction.borrower?.student_id || transaction.borrower?.teacher_id || 'N/A'}</p></div>
                                    <div><label className="text-sm text-gray-600">Email</label><p>{transaction.borrower?.email || 'N/A'}</p></div>
                                    <div><label className="text-sm text-gray-600">Contact</label><p>{transaction.borrower?.contact || 'N/A'}</p></div>
                                </div>
                            </div>
                        </InfoCard>

                        <InfoCard icon={Calendar} title="Transaction Timeline" color="purple">
                            <div className="space-y-4">
                                {[
                                    { label: 'Date Borrowed', date: transaction.date_borrowed, color: 'blue' },
                                    { label: 'Expected Return', date: transaction.expected_return_date, color: 'amber' },
                                    ...(transaction.date_returned ? [{ label: 'Date Returned', date: transaction.date_returned, color: 'green' }] : []),
                                    ...(transaction.date_canceled ? [{ label: 'Date Canceled', date: transaction.date_canceled, color: 'red' }] : [])
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className={`w-2 h-2 bg-${item.color}-500 rounded-full mt-2`}></div>
                                        <div><p className="text-sm text-gray-600">{item.label}</p><p className={`text-${item.color}-600 font-semibold`}>{formatDate(item.date)}</p></div>
                                    </div>
                                ))}
                            </div>
                        </InfoCard>
                    </div>

                    <div>
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Edit className="w-5 h-5 text-amber-600" />Update Transaction</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2"><Hash className="w-4 h-4 inline mr-1" />Quantity</label>
                                    <input type="number" value={transaction.quantity} disabled className="w-full px-4 py-2.5 border rounded-lg bg-gray-50" />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                    <select value={state.status} onChange={(e) => updateState({ status: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none">
                                        {['borrowed', 'returned', 'overdue', 'canceled'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                    </select>
                                </div>

                                {state.status === 'returned' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2"><Calendar className="w-4 h-4 inline mr-1" />Date Returned</label>
                                        <input type="date" value={state.dateReturned} onChange={(e) => updateState({ dateReturned: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none" />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2"><DollarSign className="w-4 h-4 inline mr-1" />Fees (PHP)</label>
                                    
                                    {autoEnabled && (
                                        <div className="flex items-center gap-2 mb-3 p-2 bg-amber-50 rounded border border-amber-200">
                                            <input type="checkbox" id="auto_fees" checked={state.useAutoFees} onChange={(e) => updateState({ useAutoFees: e.target.checked })} className="w-4 h-4 text-amber-600 rounded" />
                                            <label htmlFor="auto_fees" className="text-sm font-medium text-amber-900">Auto-calculate late fees</label>
                                        </div>
                                    )}
                                    
                                    <input
                                        type="number"
                                        value={state.useAutoFees && autoEnabled ? calculatedFee : state.fees}
                                        onChange={(e) => updateState({ fees: e.target.value, useAutoFees: false })}
                                        disabled={state.useAutoFees && autoEnabled}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none ${state.useAutoFees && autoEnabled ? 'bg-amber-50' : ''}`}
                                        min="0"
                                        step="0.01"
                                    />
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">Display Fee: {formatCurrency(displayFee)}</p>
                                        {state.useAutoFees && autoEnabled && <p className="text-xs text-amber-600">₱{lateFeeConfig.rate} per {lateFeeConfig.interval} · Auto-calculated</p>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <input type="checkbox" id="is_lost" checked={state.isLost} onChange={(e) => updateState({ isLost: e.target.checked })} className="w-4 h-4 text-amber-600 rounded" />
                                    <label htmlFor="is_lost" className="text-sm font-medium">Mark as Lost</label>
                                </div>

                                <button onClick={handleUpdate} disabled={state.isUpdating} className="w-full px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg shadow-md disabled:opacity-50">
                                    {state.isUpdating ? 'Updating...' : 'Update Transaction'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthLayout>
    );
}