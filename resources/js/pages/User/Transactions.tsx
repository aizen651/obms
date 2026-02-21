import { useState } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { BookOpen, BookMarked, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, Hash, Library, PackageX } from 'lucide-react';
import Layout from '@/layouts/Layout';

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS = {
    borrowed:  { label: 'Borrowed',  cls: 'bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/20'         },
    overdue:   { label: 'Overdue',   cls: 'bg-red-500/15 text-red-300 ring-1 ring-red-400/20'            },
    returned:  { label: 'Returned',  cls: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20' },
    lost:      { label: 'Lost',      cls: 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/20'   },
    cancelled: { label: 'Cancelled', cls: 'bg-white/8 text-white/40 ring-1 ring-white/10'                },
};

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const StatusBadge = ({ status }) => {
    const s = STATUS[status] || STATUS.cancelled;
    return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${s.cls}`}>{s.label}</span>;
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const STAT_STYLES = {
    'via-white/20':        'bg-white/8 border-white/10 text-white/50',
    'via-blue-400/60':     'bg-blue-500/15 border-blue-500/20 text-blue-400',
    'via-red-400/60':      'bg-red-500/15 border-red-500/20 text-red-400',
    'via-emerald-400/60':  'bg-emerald-500/15 border-emerald-500/20 text-emerald-400',
    'via-orange-400/60':   'bg-orange-500/15 border-orange-500/20 text-orange-400',
};

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${color} to-transparent`} />
        <div className="flex items-center justify-between">
            <div>
                <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">{label}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
            </div>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${STAT_STYLES[color]}`}>
                <Icon size={18} />
            </div>
        </div>
    </div>
);

// ── Pagination ────────────────────────────────────────────────────────────────
const btn = 'min-w-[32px] h-8 px-2 rounded text-sm font-medium flex items-center justify-center transition-colors select-none';

function Pagination({ transactions, filters }) {
    const navigate = (url) => {
        if (!url) return;
        const page = new URL(url).searchParams.get('page');
        router.get('/transactions', { ...filters, page }, { preserveState: true, replace: true });
    };

    const prev  = transactions.links[0];
    const next  = transactions.links[transactions.links.length - 1];
    const pages = transactions.links.slice(1, -1);

    const NavBtn = ({ link, children }) => link?.url
        ? <button onClick={() => navigate(link.url)} className={`${btn} bg-white/10 hover:bg-white/20 text-white/60 hover:text-white border border-white/10`}>{children}</button>
        : <span className={`${btn} bg-white/5 text-white/20 cursor-not-allowed border border-white/5`}>{children}</span>;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-4">
            <p className="text-sm text-white/50">Showing {transactions.from}–{transactions.to} of {transactions.total}</p>
            <div className="flex items-center gap-1">
                <NavBtn link={prev}><ChevronLeft className="w-4 h-4" /></NavBtn>
                {pages.map((l, i) => (
                    <button key={i} onClick={() => navigate(l?.url)} disabled={!l?.url}
                        className={`${btn} ${l?.active ? 'bg-gradient-to-r from-slate-200 to-white text-slate-900 shadow border-0' : l?.url ? 'bg-white/10 hover:bg-white/20 text-white/60 hover:text-white border border-white/10' : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'}`}>
                        {l?.label}
                    </button>
                ))}
                <NavBtn link={next}><ChevronRight className="w-4 h-4" /></NavBtn>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const FILTERS = [
    { value: '',          label: 'All'       },
    { value: 'borrowed',  label: 'Borrowed'  },
    { value: 'overdue',   label: 'Overdue'   },
    { value: 'returned',  label: 'Returned'  },
    { value: 'lost',      label: 'Lost'      },
];

export default function Borrows({ transactions, stats, filters }) {

    // Sync initial state from server-provided filters
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');

    const handleFilter = (val) => {
        setStatusFilter(val);
        router.get('/transactions', val ? { status: val } : {}, { preserveState: true, replace: true });
    };

    return (
        <Layout>
            <Head title="My Borrows" />

            {/* Background glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
                <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-blue-600/8 rounded-full blur-[140px]" />
                <div className="absolute bottom-20 right-1/4 w-[400px] h-[300px] bg-emerald-400/8 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <div className="relative pt-16 mb-6 flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent">My Borrows</h2>
                    <p className="text-sm text-white/40 mt-1">Track your borrowed books and history</p>
                </div>

                {/* Browse Books button — icon only on mobile, text on sm+ */}
                <Link href="/books" className="group flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white/8 hover:bg-white/15 border border-white/12 hover:border-white/25 transition-all duration-200 active:scale-95">
                    <Library size={13} className="text-emerald-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors hidden sm:inline">Browse Books</span>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
                <StatCard icon={BookOpen}      label="Total"    value={stats.total}    color="via-white/20"      />
                <StatCard icon={BookMarked}    label="Active"   value={stats.active}   color="via-blue-400/60"   />
                <StatCard icon={AlertTriangle} label="Overdue"  value={stats.overdue}  color="via-red-400/60"    />
                <StatCard icon={CheckCircle}   label="Returned" value={stats.returned} color="via-emerald-400/60"/>
                <StatCard icon={PackageX}      label="Lost"     value={stats.lost}     color="via-orange-400/60" />
            </div>

            {/* Table card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/30">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none" />

                {/* Filter tabs */}
                <div className="relative flex items-center gap-1.5 bg-black/20 border-b border-white/8 px-4 py-3 overflow-x-auto">
                    {FILTERS.map(f => (
                        <button key={f.value} onClick={() => handleFilter(f.value)}
                            className={`flex-shrink-0 h-7 px-3 rounded-full text-[11px] font-semibold transition-all ${
                                statusFilter === f.value
                                    ? 'bg-white text-zinc-900 shadow'
                                    : 'bg-white/8 text-white/50 hover:bg-white/15 hover:text-white border border-white/10'
                            }`}>
                            {f.label}
                            {f.value === 'overdue' && stats.overdue > 0 && (
                                <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[9px]">{stats.overdue}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="relative overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-white/8 bg-black/10">
                                <th className="px-4 py-3 text-left font-semibold text-white/40 uppercase tracking-wider">Book</th>
                                <th className="px-4 py-3 text-left font-semibold text-white/40 uppercase tracking-wider">Ref #</th>
                                <th className="px-4 py-3 text-left font-semibold text-white/40 uppercase tracking-wider">Borrowed</th>
                                <th className="px-4 py-3 text-left font-semibold text-white/40 uppercase tracking-wider">Due Date</th>
                                <th className="px-4 py-3 text-left font-semibold text-white/40 uppercase tracking-wider">Returned</th>
                                <th className="px-4 py-3 text-left font-semibold text-white/40 uppercase tracking-wider">Fees</th>
                                <th className="px-4 py-3 text-left font-semibold text-white/40 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.data.length > 0 ? transactions.data.map((t, i) => (
                                <tr key={t.id} className={`border-b border-white/5 transition-all hover:bg-white/8 ${i % 2 === 0 ? 'bg-transparent' : 'bg-white/3'}`}>

                                    {/* Book */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {t.book?.image_url
                                                ? <img src={t.book.image_url} alt={t.book.title} className="w-8 h-11 object-cover rounded-lg shadow-md shadow-black/50 flex-shrink-0" />
                                                : <div className="w-8 h-11 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0"><BookOpen size={13} className="text-white/25" /></div>
                                            }
                                            <div className="min-w-0">
                                                <p className="text-white font-medium truncate max-w-[160px]">{t.book?.title || 'Unknown'}</p>
                                                <p className="text-white/40 mt-0.5">{t.book?.author}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Ref */}
                                    <td className="px-4 py-3">
                                        <span className="flex items-center gap-1 font-mono text-white/50">
                                            <Hash size={10} className="text-white/25" />{t.ref_nbr}
                                        </span>
                                    </td>

                                    {/* Borrowed */}
                                    <td className="px-4 py-3 text-white/55">{fmt(t.date_borrowed)}</td>

                                    {/* Due date */}
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-0.5">
                                            <span className={t.is_overdue ? 'text-red-400 font-semibold' : 'text-white/55'}>{fmt(t.expected_return_date)}</span>
                                            {t.is_overdue && <span className="text-[10px] text-red-400/70">{t.days_overdue}d overdue</span>}
                                        </div>
                                    </td>

                                    {/* Returned */}
                                    <td className="px-4 py-3 text-white/55">{fmt(t.date_returned)}</td>

                                    {/* Fees */}
                                    <td className="px-4 py-3">
                                        {t.fees > 0
                                            ? <span className="text-red-300 font-semibold">₱{Number(t.fees).toFixed(2)}</span>
                                            : <span className="text-white/25">—</span>
                                        }
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-4 py-16 text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                                            <BookOpen className="w-8 h-8 text-white/20" />
                                        </div>
                                        <p className="text-white/30 font-medium">No borrow records found</p>
                                        <p className="text-white/20 text-xs mt-1">
                                            {statusFilter ? 'Try a different filter' : 'Start borrowing books from the library'}
                                        </p>
                                        {!statusFilter && (
                                            <Link href="/books" className="inline-flex items-center gap-1.5 mt-4 h-8 px-4 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/25 transition-all">
                                                <BookMarked size={12} /> Browse Books
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {transactions.data.length > 0 && transactions.last_page > 1 && (
                <Pagination transactions={transactions} filters={{ status: statusFilter }} />
            )}
        </Layout>
    );
}
