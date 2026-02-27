import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import TransactionCreateModal from '@/components/Admin/TransactionCreateModal';
import DeleteConfirmationModal from '@/components/Admin/DeleteConfirmationModal';
import { toast } from 'sonner';
import { Plus, Search, Filter, Eye, Trash2, BookOpen, User, Calendar, DollarSign, ChevronUp, ChevronDown, AlertCircle, CheckCircle2, XCircle, Clock, Printer, Settings } from 'lucide-react';

// --- Helpers ---
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
const fmtCurrency = (a) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(a || 0);

const STATUS_STYLES = {
    borrowed:  { bg: 'bg-blue-100',  text: 'text-blue-700',  icon: Clock },
    returned:  { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
    overdue:   { bg: 'bg-red-100',   text: 'text-red-700',   icon: AlertCircle },
    canceled:  { bg: 'bg-gray-100',  text: 'text-gray-700',  icon: XCircle },
};

const StatusBadge = ({ status }) => {
    const { bg, text, icon: Icon } = STATUS_STYLES[status] || STATUS_STYLES.borrowed;
    return (
        <Badge className={`${bg} ${text} border-0 flex items-center gap-1`}>
            <Icon className="w-3 h-3" /><span className="capitalize">{status}</span>
        </Badge>
    );
};

const SortBtn = ({ col, label, filters, onSort }) => (
    <button onClick={() => onSort(col)} className="flex items-center gap-1 hover:text-indigo-500 transition-colors">
        {label}
        {filters?.sort === col && (filters.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
    </button>
);

export default function Transactions({ transactions, books, users, lateFeeConfig, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [isLostFilter, setIsLostFilter] = useState(filters?.is_lost || '');
    const [createOpen, setCreateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const navParams = { search, status: statusFilter, is_lost: isLostFilter, sort: filters?.sort, direction: filters?.direction };

    useEffect(() => {
        const t = setTimeout(() => router.get('/admin/transactions', navParams, { preserveState: true, replace: true }), 500);
        return () => clearTimeout(t);
    }, [search, statusFilter, isLostFilter]);

    const handleSort = (col) => {
        const direction = filters?.sort === col && filters?.direction === 'asc' ? 'desc' : 'asc';
        router.get('/admin/transactions', { ...navParams, sort: col, direction }, { preserveState: true });
    };

    const handleReset = () => { setSearch(''); setStatusFilter(''); setIsLostFilter(''); router.get('/admin/transactions'); };

    const confirmDelete = () => {
        if (!toDelete) return;
        setDeleting(true);
        router.delete(`/admin/transactions/${toDelete.id}`, {
            onSuccess: () => { toast.success('Transaction deleted!'); setDeleteOpen(false); setToDelete(null); },
            onError: (e) => toast.error(e.error || 'Failed to delete transaction.'),
            onFinish: () => setDeleting(false),
        });
    };

    const activeFilterCount = [statusFilter, isLostFilter].filter(Boolean).length;

    return (
        <AdminAuthLayout header="Transactions">
            <Head title="Transactions" />
            <div className="space-y-4">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Book Transactions</h2>
                        <p className="text-sm text-gray-500">{transactions.total} total transactions</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Link href="/admin/transactions/print/report" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow flex items-center gap-2 transition-all">
                            <Printer className="w-4 h-4" /> Print Report
                        </Link>
                        <button onClick={() => setCreateOpen(true)} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow flex items-center gap-2 transition-all">
                            <Plus className="w-4 h-4" /> New Transaction
                        </button>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ref, book, or borrower..."
                                className="w-full pl-9 pr-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none" />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-all">
                                    <Filter className="w-4 h-4" /> Filters
                                    {activeFilterCount > 0 && <span className="px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full">{activeFilterCount}</span>}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                                    {['', 'borrowed', 'returned', 'overdue', 'canceled'].map(v => (
                                        <DropdownMenuRadioItem key={v} value={v}>{v ? v.charAt(0).toUpperCase() + v.slice(1) : 'All Status'}</DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Lost Books</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={isLostFilter} onValueChange={setIsLostFilter}>
                                    <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="1">Lost Only</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="0">Not Lost</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleReset} className="text-red-500 focus:text-red-600">Reset Filters</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Link href="/admin/settings" className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg shadow flex items-center gap-2 transition-all">
                            <Settings className="w-4 h-4" /> Payment Settings
                        </Link>
                    </div>
                </div>

                {/* Unified Responsive Table */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    {transactions.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-indigo-100">
                                    <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                        <th className="px-4 py-3"><SortBtn col="ref_nbr" label="Reference" filters={filters} onSort={handleSort} /></th>
                                        <th className="px-4 py-3 hidden md:table-cell">Book</th>
                                        <th className="px-4 py-3 hidden sm:table-cell">Borrower</th>
                                        <th className="px-4 py-3 hidden lg:table-cell">Qty</th>
                                        <th className="px-4 py-3 hidden lg:table-cell"><SortBtn col="date_borrowed" label="Borrowed" filters={filters} onSort={handleSort} /></th>
                                        <th className="px-4 py-3 hidden xl:table-cell"><SortBtn col="expected_return_date" label="Due" filters={filters} onSort={handleSort} /></th>
                                        <th className="px-4 py-3 hidden sm:table-cell"><SortBtn col="fees" label="Fees" filters={filters} onSort={handleSort} /></th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {transactions.data.map(tx => (
                                        <tr key={tx.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-mono text-sm font-semibold text-gray-900">{tx.ref_nbr}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{fmtDate(tx.transaction_date)}</p>
                                                {/* Mobile-only book + borrower */}
                                                <p className="md:hidden text-xs text-gray-600 mt-1 font-medium line-clamp-1">{tx.book?.title || 'N/A'}</p>
                                                <p className="sm:hidden text-xs text-gray-500 mt-0.5">{tx.borrower?.firstname} {tx.borrower?.lastname}</p>
                                                {/* Mobile-only fees */}
                                                <p className="sm:hidden text-xs text-indigo-600 font-semibold mt-0.5">{fmtCurrency(tx.calculated_fees || tx.fees || 0)}</p>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                                    <span className="text-sm text-gray-900 line-clamp-1 max-w-[160px]">{tx.book?.title || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden sm:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                                    <span className="text-sm text-gray-900">{tx.borrower?.firstname} {tx.borrower?.lastname}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden lg:table-cell">
                                                <span className="text-sm text-gray-700">{tx.quantity}</span>
                                            </td>
                                            <td className="px-4 py-3 hidden lg:table-cell">
                                                <span className="text-sm text-gray-700">{fmtDate(tx.date_borrowed)}</span>
                                            </td>
                                            <td className="px-4 py-3 hidden xl:table-cell">
                                                <span className="text-sm text-gray-700">{fmtDate(tx.expected_return_date)}</span>
                                            </td>
                                            <td className="px-4 py-3 hidden sm:table-cell">
                                                <span className="text-sm font-semibold text-indigo-600">{fmtCurrency(tx.calculated_fees || tx.fees || 0)}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1">
                                                    <StatusBadge status={tx.status} />
                                                    {tx.is_lost && <Badge className="bg-red-100 text-red-700 border-0">Lost</Badge>}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Link href={`/admin/transactions/${tx.id}`} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View"><Eye className="w-4 h-4" /></Link>
                                                    <button onClick={() => { setToDelete(tx); setDeleteOpen(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No transactions found</p>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {transactions.links && transactions.data.length > 0 && (
                    <div className="bg-white rounded-xl shadow px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-sm text-gray-600">Showing <span className="font-medium text-gray-800">{transactions.from}–{transactions.to}</span> of <span className="font-medium text-gray-800">{transactions.total}</span></p>
                        <div className="flex gap-1 flex-wrap justify-center">
                            {transactions.links.map((link, i) => (
                                <Link key={i} href={link.url || '#'} preserveState
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${link.active ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow' : link.url ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-50 text-gray-400 cursor-not-allowed pointer-events-none'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <TransactionCreateModal isOpen={createOpen} onClose={() => setCreateOpen(false)} books={books} users={users} lateFeeConfig={lateFeeConfig} />
            <DeleteConfirmationModal isOpen={deleteOpen} onClose={() => { setDeleteOpen(false); setToDelete(null); }} onConfirm={confirmDelete} isDeleting={deleting}
                title="Delete Transaction" message={`Are you sure you want to delete transaction ${toDelete?.ref_nbr}?`} />
        </AdminAuthLayout>
    );
}