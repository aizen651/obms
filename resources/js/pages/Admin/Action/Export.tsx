import { Head } from '@inertiajs/react';
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import { Download, Users, BookOpen, FileText, Database, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function Export({ counts }) {
    const [loading, setLoading] = useState(null);

    const handleExport = (type) => {
        setLoading(type);
        const link = document.createElement('a');
        link.href = `/admin/export/${type}`;
        link.download = `${type}_${new Date().toISOString().split('T')[0]}.${type === 'all' ? 'zip' : 'csv'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => {
            toast.success('Download started! Check your Downloads folder.', {
                description: `File: ${type}_${new Date().toISOString().split('T')[0]}.${type === 'all' ? 'zip' : 'csv'}`,
                duration: 5000,
            });
            setLoading(null);
        }, 500);
    };

    const exportItems = [
        { title: 'Users',        description: 'Export all user accounts and profile information',  icon: Users,    count: counts.users,        type: 'users',        color: '#4f46e5' },
        { title: 'Books',        description: 'Export the full book catalog and inventory data',   icon: BookOpen, count: counts.books,        type: 'books',        color: '#2563eb' },
        { title: 'Transactions', description: 'Export all borrowing and return transaction history', icon: FileText, count: counts.transactions, type: 'transactions', color: '#0891b2' },
    ];

    return (
        <AdminAuthLayout header="Export Database">
            <Head title="Export Database" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
                .export-root { font-family: 'DM Sans', sans-serif; }

                .export-card-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 18px;
                    margin-bottom: 24px;
                }
                @media (max-width: 1024px) { .export-card-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 640px)  { .export-card-grid { grid-template-columns: 1fr; } }

                .export-btn {
                    width: 100%;
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    padding: 11px 16px;
                    border-radius: 10px;
                    font-size: 13.5px;
                    font-weight: 600;
                    font-family: 'DM Sans', sans-serif;
                    cursor: pointer;
                    border: none;
                    transition: background 0.15s, box-shadow 0.15s, transform 0.15s, opacity 0.15s;
                }
                .export-btn:disabled { opacity: 0.55; cursor: not-allowed; }
                .export-btn:not(:disabled):hover { transform: translateY(-1px); }

                .spinner {
                    width: 15px; height: 15px;
                    border: 2px solid currentColor;
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                    flex-shrink: 0;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .step-num {
                    width: 22px; height: 22px;
                    border-radius: 50%;
                    background: rgba(79,70,229,0.1);
                    color: #4f46e5;
                    font-size: 11px;
                    font-weight: 700;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                    margin-top: 1px;
                }
            `}</style>

            <div className="export-root" style={{ maxWidth: 900, margin: '0 auto' }}>

                {/* Page header */}
                <div style={{
                    background: '#fff',
                    borderRadius: 18,
                    padding: '24px 28px',
                    marginBottom: 22,
                    border: '1px solid rgba(0,0,0,0.07)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #4f46e5, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(79,70,229,0.3)', flexShrink: 0 }}>
                        <Database size={22} color="#fff" strokeWidth={1.75} />
                    </div>
                    <div>
                        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: '#1e1b4b', letterSpacing: '-0.02em', lineHeight: 1.15 }}>Export Database</h1>
                        <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.38)', marginTop: 4 }}>Download your data as CSV or ZIP files</p>
                    </div>
                </div>

                {/* Info banner */}
                <div style={{
                    background: 'rgba(79,70,229,0.05)',
                    border: '1px solid rgba(79,70,229,0.18)',
                    borderRadius: 12,
                    padding: '14px 18px',
                    marginBottom: 22,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                }}>
                    <CheckCircle size={17} color="#4f46e5" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div style={{ fontSize: 13, color: '#3730a3' }}>
                        <span style={{ fontWeight: 600 }}>Downloads location — </span>
                        Exported files go directly to your device's <strong>Downloads folder</strong>. Check there after clicking export.
                    </div>
                </div>

                {/* Export cards */}
                <div className="export-card-grid">
                    {exportItems.map(({ title, description, icon: Icon, count, type, color }) => (
                        <div key={type} style={{
                            background: '#fff',
                            borderRadius: 16,
                            padding: '24px',
                            border: '1px solid rgba(0,0,0,0.07)',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0,
                        }}>
                            {/* Icon + count */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                                <div style={{ width: 46, height: 46, borderRadius: 12, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={21} style={{ color }} strokeWidth={1.75} />
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: 28, fontWeight: 700, color: '#1e1b4b', lineHeight: 1 }}>{count}</p>
                                    <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', fontWeight: 500, marginTop: 3 }}>records</p>
                                </div>
                            </div>

                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e1b4b', marginBottom: 6 }}>{title}</h3>
                            <p style={{ fontSize: 12.5, color: 'rgba(0,0,0,0.45)', lineHeight: 1.5, marginBottom: 18, flex: 1 }}>{description}</p>

                            {/* Divider */}
                            <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', marginBottom: 16 }} />

                            <button
                                className="export-btn"
                                onClick={() => handleExport(type)}
                                disabled={loading === type}
                                style={{ background: `${color}10`, color }}
                                onMouseEnter={e => { if (loading !== type) e.currentTarget.style.background = `${color}1e`; }}
                                onMouseLeave={e => { e.currentTarget.style.background = `${color}10`; }}
                            >
                                {loading === type
                                    ? <><span className="spinner" />Downloading…</>
                                    : <><Download size={15} strokeWidth={2} />Export CSV</>
                                }
                            </button>
                        </div>
                    ))}
                </div>

                {/* Export all */}
                <div style={{
                    background: '#fff',
                    borderRadius: 18,
                    padding: '28px 32px',
                    marginBottom: 22,
                    border: '1px solid rgba(79,70,229,0.14)',
                    boxShadow: '0 2px 16px rgba(79,70,229,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 24,
                    flexWrap: 'wrap',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 54, height: 54, borderRadius: 14, background: 'linear-gradient(135deg, #4f46e5, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(79,70,229,0.28)', flexShrink: 0 }}>
                            <Database size={23} color="#fff" strokeWidth={1.75} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>Export Everything</h2>
                            <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', lineHeight: 1.5 }}>
                                Download all data as a ZIP file<br />
                                <span style={{ fontSize: 12 }}>Includes: Users, Books, Transactions & Categories</span>
                            </p>
                        </div>
                    </div>

                    <button
                        className="export-btn"
                        onClick={() => handleExport('all')}
                        disabled={loading === 'all'}
                        style={{
                            width: 'auto',
                            background: 'linear-gradient(135deg, #4f46e5, #2563eb)',
                            color: '#fff',
                            padding: '13px 28px',
                            boxShadow: '0 4px 14px rgba(79,70,229,0.28)',
                            flexShrink: 0,
                        }}
                        onMouseEnter={e => { if (loading !== 'all') e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.38)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(79,70,229,0.28)'; }}
                    >
                        {loading === 'all'
                            ? <><span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.6)', borderTopColor: 'transparent' }} />Downloading…</>
                            : <><Database size={16} strokeWidth={2} />Export All Data</>
                        }
                    </button>
                </div>

                {/* Instructions */}
                <div style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: '22px 24px',
                    border: '1px solid rgba(0,0,0,0.07)',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(79,70,229,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Download size={15} color="#4f46e5" strokeWidth={2} />
                        </div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e1b4b' }}>Download Instructions</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            'Click on any export button above.',
                            'The file will automatically download to your Downloads folder.',
                            <>Look for files like: <code style={{ background: 'rgba(79,70,229,0.07)', color: '#4f46e5', padding: '2px 7px', borderRadius: 5, fontSize: 12, fontFamily: 'monospace' }}>users_2026-02-17.csv</code></>,
                            'Open CSV files with Excel, Google Sheets, or any spreadsheet app.',
                        ].map((step, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                <span className="step-num">{i + 1}</span>
                                <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.55)', lineHeight: 1.5, paddingTop: 2 }}>{step}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </AdminAuthLayout>
    );
}
