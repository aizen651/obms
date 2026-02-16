import { Head, router } from '@inertiajs/react';
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import { Download, Users, BookOpen, FileText, Database, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function Export({ counts }) {
    const [loading, setLoading] = useState(null);

    const handleExport = (type) => {
        setLoading(type);
        
        // Use window.location for direct download - works on all devices
        const url = `/admin/export/${type}`;
        
        // Create temporary link and click it
        const link = document.createElement('a');
        link.href = url;
        link.download = `${type}_${new Date().toISOString().split('T')[0]}.${type === 'all' ? 'zip' : 'csv'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        setTimeout(() => {
            toast.success('Download started! Check your Downloads folder.', {
                description: `File: ${type}_${new Date().toISOString().split('T')[0]}.${type === 'all' ? 'zip' : 'csv'}`,
                duration: 5000,
            });
            setLoading(null);
        }, 500);
    };

    const ExportCard = ({ title, description, icon: Icon, count, type, gradient }) => (
        <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 border-2 border-white/20 shadow-lg hover:shadow-xl transition-all`}>
            <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md">
                    <Icon className="w-7 h-7 text-amber-600" />
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-white">{count}</p>
                    <p className="text-xs text-white/80">records</p>
                </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-white/90 mb-4">{description}</p>
            <button 
                onClick={() => handleExport(type)} 
                disabled={loading === type} 
                className="w-full px-4 py-2.5 bg-white hover:bg-gray-50 text-amber-600 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading === type ? (
                    <>
                        <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                        Downloading...
                    </>
                ) : (
                    <>
                        <Download className="w-4 h-4" />
                        Export CSV
                    </>
                )}
            </button>
        </div>
    );

    return (
        <AdminAuthLayout header="Export Database">
            <Head title="Export Database" />
            
            <div className="space-y-6">
                {/* Info Banner */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-semibold mb-1">📥 Downloads Location</p>
                            <p>All exported files will be downloaded to your device's <strong>Downloads folder</strong>. Check your downloads after clicking export!</p>
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-100">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                            <Database className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">Export Database</h1>
                            <p className="text-gray-600 mt-1">Download your data in CSV format</p>
                        </div>
                    </div>
                </div>

                {/* Export Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ExportCard title="Users" description="Export all user accounts and information" icon={Users} count={counts.users} type="users" gradient="from-blue-400 to-blue-600" />
                    <ExportCard title="Books" description="Export book catalog and inventory" icon={BookOpen} count={counts.books} type="books" gradient="from-green-400 to-green-600" />
                    <ExportCard title="Transactions" description="Export borrowing transaction history" icon={FileText} count={counts.transactions} type="transactions" gradient="from-purple-400 to-purple-600" />
                </div>

                {/* Export All */}
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-8 shadow-xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Export Everything</h2>
                            <p className="text-white/90">Download all data as a ZIP file containing multiple CSV files</p>
                            <p className="text-sm text-white/70 mt-1">Includes: Users, Books, Transactions, and Categories</p>
                        </div>
                        <button 
                            onClick={() => handleExport('all')} 
                            disabled={loading === 'all'} 
                            className="px-8 py-4 bg-white hover:bg-gray-50 text-amber-600 font-bold rounded-xl transition-all flex items-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {loading === 'all' ? (
                                <>
                                    <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                                    Downloading...
                                </>
                            ) : (
                                <>
                                    <Database className="w-6 h-6" />
                                    Export All Data
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Help Section */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Download className="w-5 h-5 text-gray-600" />
                        Download Instructions
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-amber-600">1.</span>
                            <span>Click on any export button above</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-amber-600">2.</span>
                            <span>The file will automatically download to your Downloads folder</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-amber-600">3.</span>
                            <span>Look for files like: <code className="bg-gray-200 px-2 py-0.5 rounded text-xs">users_2026-02-17.csv</code></span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-amber-600">4.</span>
                            <span>Open CSV files with Excel, Google Sheets, or any spreadsheet app</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthLayout>
    );
}