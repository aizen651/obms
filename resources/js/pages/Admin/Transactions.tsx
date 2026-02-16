import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import TransactionCreateModal from '@/components/Admin/TransactionCreateModal';
import DeleteConfirmationModal from '@/components/Admin/DeleteConfirmationModal';
import { toast } from 'sonner';
import { 
    Plus, 
    Search, 
    Filter, 
    Eye,
    Trash2, 
    BookOpen,
    User,
    Calendar,
    DollarSign,
    ChevronUp, 
    ChevronDown,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Clock,
    Printer,
    Settings
} from 'lucide-react';

export default function Transactions({ transactions, books, users, lateFeeConfig, filters }) {
    // State declarations
    const [search, setSearch] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [isLostFilter, setIsLostFilter] = useState(filters?.is_lost || '');
    const [showFilters, setShowFilters] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Live search with debounce
    const DEBOUNCE_DELAY = 500;

    useEffect(() => {
        const handler = setTimeout(() => {
            router.get('/admin/transactions', {
                search,
                status: statusFilter,
                is_lost: isLostFilter,
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
    }, [search, statusFilter, isLostFilter]);

    const handleSort = (column) => {
        const direction = filters?.sort === column && filters?.direction === 'asc' ? 'desc' : 'asc';
        router.get('/admin/transactions', { 
            search, 
            status: statusFilter,
            is_lost: isLostFilter,
            sort: column, 
            direction 
        }, { 
            preserveState: true 
        });
    };

    const handleReset = () => {
        setSearch('');
        setStatusFilter('');
        setIsLostFilter('');
        router.get('/admin/transactions');
    };

    const handleDelete = (transaction) => {
        setTransactionToDelete(transaction);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!transactionToDelete) return;
        
        setIsDeleting(true);
        router.delete(`/admin/transactions/${transactionToDelete.id}`, {
            onSuccess: () => {
                toast.success('Transaction deleted successfully!');
                setIsDeleteModalOpen(false);
                setTransactionToDelete(null);
            },
            onError: (errors) => {
                toast.error(errors.error || 'Failed to delete transaction.');
            },
            onFinish: () => {
                setIsDeleting(false);
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
            <Badge className={`${style.bg} ${style.text} border-0 flex items-center gap-1`}>
                <Icon className="w-3 h-3" />
                <span className="capitalize">{status}</span>
            </Badge>
        );
    };

    const SortIcon = ({ column }) => {
        if (filters?.sort !== column) return null;
        return filters?.direction === 'asc' ? (
            <ChevronUp className="w-4 h-4" />
        ) : (
            <ChevronDown className="w-4 h-4" />
        );
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount || 0);
    };

    return (
        <AdminAuthLayout header="Transactions">
            <Head title="Transactions" />

            <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Book Transactions</h2>
                        <p className="text-sm text-gray-600">{transactions.total} total transactions</p>
                    </div>
                    <div className="flex gap-2">
        {/* Print button */}
        <Link
            href="/admin/transactions/print/report"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
        >
            <Printer className="w-5 h-5" />
            Print Report
        </Link>
        <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
        >
            <Plus className="w-5 h-5" />
            New Transaction
        </button>
        </div>
        
        
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by ref number, book, or borrower..."
                                className="w-full pl-9 pr-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                            />
                        </div>

                        {/* Filter Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Filter className="w-4 h-4" />
                                    Filters
                                    {(statusFilter || isLostFilter) && (
                                        <span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">
                                            {[statusFilter, isLostFilter].filter(Boolean).length}
                                        </span>
                                    )}
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-56">
                                {/* Status Filter */}
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <DropdownMenuRadioItem value="">All Status</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="borrowed">Borrowed</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="returned">Returned</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="overdue">Overdue</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="canceled">Canceled</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>

                                <DropdownMenuSeparator />

                                {/* Lost Filter */}
                                <DropdownMenuLabel>Lost Books</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup
                                    value={isLostFilter}
                                    onValueChange={setIsLostFilter}
                                >
                                    <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="1">Lost Only</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="0">Not Lost</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>

                                <DropdownMenuSeparator />

                                {/* Reset */}
                                <DropdownMenuItem
                                    onClick={handleReset}
                                    className="text-red-500 focus:text-red-600"
                                >
                                    Reset Filters
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Link
                        href="/admin/settings"
                        className="px-4 py-2 bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600 text-white font-medium rounded-lg transition-all shadow-md flex items-center justify-center gap-2"><Settings className='h-5 w-5'/>
                        Payment settings
                        </Link>
                    </div>
                </div>

                {/* Transactions Grid - Mobile */}
                <div className="block lg:hidden space-y-3">
                    {transactions.data.length > 0 ? (
                        transactions.data.map((transaction) => (
                            <div 
                                key={transaction.id} 
                                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-amber-500"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm font-mono">
                                            {transaction.ref_nbr}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {formatDate(transaction.transaction_date)}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <StatusBadge status={transaction.status} />
                                        {transaction.is_lost && (
                                            <Badge className="bg-red-100 text-red-700 border-0">
                                                Lost
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Book & Borrower Info */}
                                <div className="space-y-2 mb-3 pb-3 border-b">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                        <span className="text-sm text-gray-900 font-medium line-clamp-1">
                                            {transaction.book?.title || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                        <span className="text-sm text-gray-900">
                                            {transaction.borrower?.firstname} {transaction.borrower?.lastname}
                                        </span>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                                    <div>
                                        <span className="text-gray-500">Quantity:</span>
                                        <p className="font-semibold text-gray-900">{transaction.quantity}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Fees:</span>
                                        <p className="font-semibold text-amber-600">
                                            {formatCurrency(transaction.calculated_fees || transaction.fees || 0)}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Borrowed:</span>
                                        <p className="font-medium text-gray-900">{formatDate(transaction.date_borrowed)}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Expected Return:</span>
                                        <p className="font-medium text-gray-900">{formatDate(transaction.expected_return_date)}</p>
                                    </div>
                                    {transaction.date_returned && (
                                        <div className="col-span-2">
                                            <span className="text-gray-500">Returned:</span>
                                            <p className="font-medium text-green-600">{formatDate(transaction.date_returned)}</p>
                                        </div>
                                    )}
                                    {transaction.date_canceled && (
                                        <div className="col-span-2">
                                            <span className="text-gray-500">Canceled:</span>
                                            <p className="font-medium text-red-600">{formatDate(transaction.date_canceled)}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/transactions/${transaction.id}`}
                                        className="flex-1 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors text-center font-medium text-sm flex items-center justify-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(transaction)}
                                        className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No transactions found</p>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                        </div>
                    )}
                </div>

                {/* Transactions Table - Desktop */}
                <div className="hidden lg:block bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-amber-50 to-orange-50">
                                <tr className="border-b border-amber-100">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        <button 
                                            onClick={() => handleSort('ref_nbr')} 
                                            className="flex items-center gap-1 hover:text-amber-600 transition-colors"
                                        >
                                            Reference
                                            <SortIcon column="ref_nbr" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Book
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Borrower
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Qty
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        <button 
                                            onClick={() => handleSort('date_borrowed')} 
                                            className="flex items-center gap-1 hover:text-amber-600 transition-colors"
                                        >
                                            Borrowed
                                            <SortIcon column="date_borrowed" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Expected Return
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Fees
                                    </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions.data.length > 0 ? (
                                    transactions.data.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-amber-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-mono text-sm font-semibold text-gray-900">
                                                        {transaction.ref_nbr}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {formatDate(transaction.transaction_date)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4 text-amber-600" />
                                                    <span className="text-sm text-gray-900 font-medium">
                                                        {transaction.book?.title || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm text-gray-900">
                                                        {transaction.borrower?.firstname} {transaction.borrower?.lastname}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {transaction.quantity}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-gray-700">
                                                    {formatDate(transaction.date_borrowed)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-gray-700">
                                                    {formatDate(transaction.expected_return_date)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-semibold text-amber-600">
                                                    {formatCurrency(transaction.calculated_fees || transaction.fees || 0)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1">
                                                    <StatusBadge status={transaction.status} />
                                                    {transaction.is_lost && (
                                                        <Badge className="bg-red-100 text-red-700 border-0 w-fit">
                                                            Lost
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Link
                                                        href={`/admin/transactions/${transaction.id}`}
                                                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(transaction)} 
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
                                        <td colSpan="9" className="px-4 py-12 text-center">
                                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 font-medium">No transactions found</p>
                                            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {transactions.data.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md px-4 py-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium text-gray-800">
                                    {transactions.from}-{transactions.to}
                                </span> of{' '}
                                <span className="font-medium text-gray-800">
                                    {transactions.total}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1 justify-center">
                                {transactions.links.map((link, index) => (
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
            <TransactionCreateModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                books={books}
                users={users}
            />
            
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setTransactionToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Transaction"
                message={`Are you sure you want to delete transaction ${transactionToDelete?.ref_nbr}? This action cannot be undone.`}
                isDeleting={isDeleting}
            />
        </AdminAuthLayout>
    );
}