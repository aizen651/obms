import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import { Printer, Filter, FileText } from 'lucide-react';

export default function PrintTransactions({ transactions, filters, users, books, summary }) {
    const [startDate, setStartDate] = useState(filters?.start_date || '');
    const [endDate, setEndDate] = useState(filters?.end_date || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [borrowerId, setBorrowerId] = useState(filters?.borrower_id || '');
    const [bookId, setBookId] = useState(filters?.book_id || '');
    const [currentPage, setCurrentPage] = useState(1);
    
    const itemsPerPage = 10;
    const transactionsArray = Array.isArray(transactions) ? transactions : [];
    const totalPages = Math.ceil(transactionsArray.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTransactions = transactionsArray.slice(startIndex, endIndex);

    useEffect(() => {
        const handler = setTimeout(() => {
            router.get('/admin/transactions/print/report', {
                start_date: startDate,
                end_date: endDate,
                status: status,
                borrower_id: borrowerId,
                book_id: bookId,
            }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(handler);
    }, [startDate, endDate, status, borrowerId, bookId]);

    const handleReset = () => {
        setStartDate(''); setEndDate(''); setStatus(''); setBorrowerId(''); setBookId('');
        setCurrentPage(1);
        router.get('/admin/transactions/print/report');
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(amount || 0);
    };

    const getStatusColor = (status) => {
        const colors = {
            borrowed: 'bg-blue-100 text-blue-800',
            returned: 'bg-green-100 text-green-800',
            overdue: 'bg-red-100 text-red-800',
            canceled: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const goToPage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AdminAuthLayout header="Print Transactions">
            <Head title="Print Transactions" />

            <div className="space-y-4">
                {/* Header */}
                <div className="print:hidden">
                    <h1 className="text-2xl font-bold text-gray-900">Print Transaction Report</h1>
                    <p className="text-gray-600 mt-1">Filter and print transaction records</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-md p-6 print:hidden">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-amber-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-sm">
                                <option value="">All Status</option>
                                <option value="borrowed">Borrowed</option>
                                <option value="returned">Returned</option>
                                <option value="overdue">Overdue</option>
                                <option value="canceled">Canceled</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Borrower</label>
                            <select value={borrowerId} onChange={(e) => setBorrowerId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-sm">
                                <option value="">All Borrowers</option>
                                {users?.map(user => (
                                    <option key={user.id} value={user.id}>{user.firstname} {user.lastname}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Book</label>
                            <select value={bookId} onChange={(e) => setBookId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-sm">
                                <option value="">All Books</option>
                                {books?.map(book => (
                                    <option key={book.id} value={book.id}>{book.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-amber-50 px-3 py-2 rounded-lg">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                            <span>Filters update automatically</span>
                        </div>
                        <button onClick={handleReset}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all flex items-center gap-2">
                            Reset All
                        </button>
                        <button onClick={() => window.print()}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-md flex items-center gap-2 ml-auto">
                            <Printer className="w-4 h-4" />
                            Print Report
                        </button>
                    </div>
                </div>

                {/* Print Content */}
                <div className="bg-white rounded-xl shadow-md print:shadow-none print:rounded-none overflow-hidden print-content">
                    {/* Print Header */}
                    <div className="hidden print:block p-4 border-b border-gray-300">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">Cebu Technological University</h1>
                            <h2 className="text-lg font-semibold text-gray-700 mb-1">Library Management System</h2>
                            <h3 className="text-base text-gray-600">Transaction Report</h3>
                            {(startDate || endDate) && (
                                <p className="text-xs text-gray-600 mt-1">
                                    Period: {startDate ? formatDate(startDate) : 'Beginning'} to {endDate ? formatDate(endDate) : 'Present'}
                                </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Generated on: {new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
                            </p>
                        </div>
                    </div>

                    {/* Summary */}
                    {summary && (
                        <div className="p-4 sm:p-6 print:p-4 border-b print:border-gray-300">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 print:text-base print:mb-2">Summary</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 print:gap-3">
                                <div className="text-center p-2 bg-blue-50 rounded-lg print:bg-white print:border print:border-blue-200">
                                    <p className="text-xs text-gray-600">Total Transactions</p>
                                    <p className="text-xl font-bold text-blue-600 print:text-xl">{summary.total}</p>
                                </div>
                                <div className="text-center p-2 bg-green-50 rounded-lg print:bg-white print:border print:border-green-200">
                                    <p className="text-xs text-gray-600">Returned</p>
                                    <p className="text-xl font-bold text-green-600 print:text-xl">{summary.returned}</p>
                                </div>
                                <div className="text-center p-2 bg-amber-50 rounded-lg print:bg-white print:border print:border-amber-200">
                                    <p className="text-xs text-gray-600">Borrowed</p>
                                    <p className="text-xl font-bold text-amber-600 print:text-xl">{summary.borrowed}</p>
                                </div>
                                <div className="text-center p-2 bg-purple-50 rounded-lg print:bg-white print:border print:border-purple-200">
                                    <p className="text-xs text-gray-600">Total Fees</p>
                                    <p className="text-xl font-bold text-purple-600 print:text-xl">{formatCurrency(summary.total_fees)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    {transactionsArray.length > 0 && (
                        <div className="table-footer-wrapper">
                            {/* Screen View Table */}
                            <div className="w-full overflow-x-auto print:hidden">
                                <table className="min-w-full divide-y divide-gray-200 border-collapse">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ref No.</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Book</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Borrower</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Borrowed</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Due Date</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                                            <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Fees</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentTransactions.map((transaction, index) => (
                                            <tr key={transaction.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-3 py-3 text-xs font-mono text-gray-900">{transaction.ref_nbr}</td>
                                                <td className="px-3 py-3">
                                                    <div className="text-sm font-medium text-gray-900">{transaction.book?.title}</div>
                                                    <div className="text-xs text-gray-500">{transaction.book?.author}</div>
                                                </td>
                                                <td className="px-3 py-3 text-sm text-gray-900">{transaction.borrower?.firstname} {transaction.borrower?.lastname}</td>
                                                <td className="px-3 py-3 text-sm text-gray-900">{formatDate(transaction.date_borrowed)}</td>
                                                <td className="px-3 py-3 text-sm text-gray-900">{formatDate(transaction.expected_return_date)}</td>
                                                <td className="px-3 py-3">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(transaction.status)}`}>
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3 text-sm font-semibold text-gray-900 text-right">
                                                    {formatCurrency(transaction.calculated_fees || transaction.fees || 0)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Print View Table - Shows ALL transactions */}
                            <div className="hidden print:block w-full overflow-visible">
                                <table className="min-w-full divide-y divide-gray-200 border-collapse print:text-xs">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 uppercase">Ref No.</th>
                                            <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 uppercase">Book</th>
                                            <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 uppercase">Borrower</th>
                                            <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 uppercase">Borrowed</th>
                                            <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 uppercase">Due Date</th>
                                            <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                                            <th className="px-1 py-1 text-right text-xs font-semibold text-gray-700 uppercase">Fees</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {transactionsArray.map((transaction, index) => (
                                            <tr key={transaction.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-1 py-1 text-xs font-mono text-gray-900">{transaction.ref_nbr}</td>
                                                <td className="px-1 py-1">
                                                    <div className="text-xs font-medium text-gray-900">{transaction.book?.title}</div>
                                                    <div className="text-xs text-gray-500">{transaction.book?.author}</div>
                                                </td>
                                                <td className="px-1 py-1 text-xs text-gray-900">{transaction.borrower?.firstname} {transaction.borrower?.lastname}</td>
                                                <td className="px-1 py-1 text-xs text-gray-900">{formatDate(transaction.date_borrowed)}</td>
                                                <td className="px-1 py-1 text-xs text-gray-900">{formatDate(transaction.expected_return_date)}</td>
                                                <td className="px-1 py-1">
                                                    <span className={`inline-flex px-1 py-0 text-xs font-semibold rounded-full capitalize ${getStatusColor(transaction.status)}`}>
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                                <td className="px-1 py-1 text-xs font-semibold text-gray-900 text-right">
                                                    {formatCurrency(transaction.calculated_fees || transaction.fees || 0)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                  {/* Pagination */}
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 print:hidden">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-600">
                                        Showing <span className="font-semibold">{startIndex + 1}</span> to <span className="font-semibold">{Math.min(endIndex, transactionsArray.length)}</span> of <span className="font-semibold">{transactionsArray.length}</span> transactions
                                    </div>
                                    {totalPages > 1 && (
                                        <div className="flex gap-2">
                                            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                                                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                                Previous
                                            </button>
                                            <div className="flex gap-1">
                                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                    let page;
                                                    if (totalPages <= 5) {
                                                        page = i + 1;
                                                    } else if (currentPage <= 3) {
                                                        page = i + 1;
                                                    } else if (currentPage >= totalPages - 2) {
                                                        page = totalPages - 4 + i;
                                                    } else {
                                                        page = currentPage - 2 + i;
                                                    }
                                                    return (
                                                        <button key={page} onClick={() => goToPage(page)}
                                                            className={`px-3 py-1 text-sm border rounded-lg transition-colors ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}>
                                                            {page}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
                                                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Print Footer with Total and Signatures */}
                            <div className="hidden print:block px-4 py-3 border-t-2 border-gray-300 print-footer">
                                <div className="flex justify-end mb-3 pb-2 border-b border-gray-300">
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-gray-900 mr-4">Total:</span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {formatCurrency(transactionsArray.reduce((sum, t) => sum + (parseFloat(t.calculated_fees || t.fees) || 0), 0))}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6 text-center text-xs">
                                    <div>
                                        <p className="font-medium mb-8">Prepared by:</p>
                                        <div className="pt-1 border-t border-gray-400"><p className="font-semibold">Librarian</p></div>
                                    </div>
                                    <div>
                                        <p className="font-medium mb-8">Reviewed by:</p>
                                        <div className="pt-1 border-t border-gray-400"><p className="font-semibold">Library Head</p></div>
                                    </div>
                                    <div>
                                        <p className="font-medium mb-8">Approved by:</p>
                                        <div className="pt-1 border-t border-gray-400"><p className="font-semibold">Administrator</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {transactionsArray.length === 0 && (
                        <div className="text-center py-12 px-4">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No transactions found</p>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    @page { size: A4 landscape; margin: 0.5cm; }
                    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                    body * { visibility: hidden; }
                    .print-content, .print-content * { visibility: visible; }
                    .print-content { position: absolute; left: 0; top: 0; width: 100%; }
                    .print\\:hidden { display: none !important; }
                    .print\\:block { display: block !important; }
                    
                    .table-footer-wrapper { page-break-inside: auto; }
                    .print-footer { page-break-inside: avoid !important; page-break-before: avoid !important; }
                    
                    table { page-break-inside: auto; width: 100%; border-collapse: collapse; }
                    tr { page-break-inside: avoid; page-break-after: auto; }
                    thead { display: table-header-group; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `}</style>
        </AdminAuthLayout>
    );
}