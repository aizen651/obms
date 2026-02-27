import { useState } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { BookOpen, BookMarked, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, Hash, Library, PackageX } from 'lucide-react';
import Layout from '@/layouts/Layout';

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS = {
    borrowed:  { label: 'Borrowed',  cls: 'bg-blue-500/15 text-blue-600 ring-1 ring-blue-400/20 dark:text-blue-300'             },
    overdue:   { label: 'Overdue',   cls: 'bg-red-500/15 text-red-600 ring-1 ring-red-400/20 dark:text-red-300'                 },
    returned:  { label: 'Returned',  cls: 'bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-400/20 dark:text-emerald-300' },
    lost:      { label: 'Lost',      cls: 'bg-orange-500/15 text-orange-600 ring-1 ring-orange-400/20 dark:text-orange-300'     },
    cancelled: { label: 'Cancelled', cls: 'bg-zinc-100 text-zinc-400 ring-1 ring-zinc-200 dark:bg-white/8 dark:text-white/40 dark:ring-white/10' },
};

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const StatusBadge = ({ status }) => {
    const s = STATUS[status] || STATUS.cancelled;
    return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${s.cls}`}>{s.label}</span>;
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const STAT_STYLES = {
    'via-white/20':        { dark: 'bg-white/8 border-white/10 text-white/50',           light: 'bg-zinc-100 border-zinc-200 text-zinc-500'         },
    'via-blue-400/60':     { dark: 'bg-blue-500/15 border-blue-500/20 text-blue-400',    light: 'bg-blue-50 border-blue-200 text-blue-500'           },
    'via-red-400/60':      { dark: 'bg-red-500/15 border-red-500/20 text-red-400',       light: 'bg-red-50 border-red-200 text-red-500'              },
    'via-emerald-400/60':  { dark: 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400', light: 'bg-emerald-50 border-emerald-200 text-emerald-500' },
    'via-orange-400/60':   { dark: 'bg-orange-500/15 border-orange-500/20 text-orange-400', light: 'bg-orange-50 border-orange-200 text-orange-500'  },
};

const StatCard = ({ icon: Icon, label, value, color }) => {
    const styles = STAT_STYLES[color];
    return (
        <div className="relative overflow-hidden rounded-2xl border p-4
            bg-white border-zinc-200
            dark:bg-white/5 dark:border-white/10">
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${color} to-transparent`} />
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-white/40">{label}</p>
                    <p className="text-2xl font-bold mt-1 text-zinc-800 dark:text-white">{value}</p>
                </div>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${styles.light} dark:${styles.dark}`}>
                    <Icon size={18} />
                </div>
            </div>
        </div>
    );
};

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
        ? <button onClick={() => navigate(link.url)} className={`${btn} border
            bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 border-zinc-200
            dark:bg-white/10 dark:hover:bg-white/20 dark:text-white/60 dark:hover:text-white dark:border-white/10`}>{children}</button>
        : <span className={`${btn} border cursor-not-allowed
            bg-zinc-50 text-zinc-300 border-zinc-100
            dark:bg-white/5 dark:text-white/20 dark:border-white/5`}>{children}</span>;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border px-4 py-3 mt-4
            bg-zinc-50 border-zinc-200
            dark:bg-white/5 dark:border-white/10">
            <p className="text-sm text-zinc-400 dark:text-white/50">
                Showing {transactions.from}–{transactions.to} of {transactions.total}
            </p>
            <div className="flex items-center gap-1">
                <NavBtn link={prev}><ChevronLeft className="w-4 h-4" /></NavBtn>
                {pages.map((l, i) => (
                    <button key={i} onClick={() => navigate(l?.url)} disabled={!l?.url}
                        className={`${btn} ${
                            l?.active
                                ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow border-0 dark:from-slate-200 dark:to-white dark:text-slate-900'
                                : l?.url
                                    ? 'border bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 border-zinc-200 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white/60 dark:hover:text-white dark:border-white/10'
                                    : 'border cursor-not-allowed bg-zinc-50 text-zinc-300 border-zinc-100 dark:bg-white/5 dark:text-white/20 dark:border-white/5'
                        }`}>
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
                {/* Light */}
                <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-blue-200/40 rounded-full blur-[140px] dark:hidden" />
                <div className="absolute bottom-20 right-1/4 w-[400px] h-[300px] bg-emerald-200/30 rounded-full blur-[120px] dark:hidden" />
                {/* Dark — originals */}
                <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-blue-600/8 rounded-full blur-[140px] hidden dark:block" />
                <div className="absolute bottom-20 right-1/4 w-[400px] h-[300px] bg-emerald-400/8 rounded-full blur-[120px] hidden dark:block" />
            </div>

            {/* Header */}
            <div className="relative pt-16 mb-6 flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:via-white/90 dark:to-white/50 dark:bg-clip-text">
                        My Borrows
                    </h2>
                    <p className="text-sm mt-1 text-zinc-400 dark:text-white/40">Track your borrowed books and history</p>
                </div>

                <Link href="/books" className="group flex items-center gap-1.5 h-9 px-3 rounded-xl border transition-all duration-200 active:scale-95
                    bg-zinc-100 hover:bg-zinc-200 border-zinc-200 hover:border-zinc-300
                    dark:bg-white/8 dark:hover:bg-white/15 dark:border-white/12 dark:hover:border-white/25">
                    <Library size={13} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-xs font-semibold transition-colors hidden sm:inline
                        text-zinc-500 group-hover:text-zinc-800
                        dark:text-white/70 dark:group-hover:text-white">Browse Books</span>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
                <StatCard icon={BookOpen}      label="Total"    value={stats.total}    color="via-white/20"       />
                <StatCard icon={BookMarked}    label="Active"   value={stats.active}   color="via-blue-400/60"    />
                <StatCard icon={AlertTriangle} label="Overdue"  value={stats.overdue}  color="via-red-400/60"     />
                <StatCard icon={CheckCircle}   label="Returned" value={stats.returned} color="via-emerald-400/60" />
                <StatCard icon={PackageX}      label="Lost"     value={stats.lost}     color="via-orange-400/60"  />
            </div>

            {/* Table card */}
            <div className="relative overflow-hidden rounded-2xl border shadow-2xl
                bg-white border-zinc-200 shadow-zinc-100
                dark:border-white/10 dark:bg-transparent dark:shadow-black/30">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-white/30" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none hidden dark:block" />

                {/* Filter tabs */}
                <div className="relative flex items-center gap-1.5 border-b px-4 py-3 overflow-x-auto
                    bg-zinc-50 border-zinc-200
                    dark:bg-black/20 dark:border-white/8">
                    {FILTERS.map(f => (
                        <button key={f.value} onClick={() => handleFilter(f.value)}
                            className={`flex-shrink-0 h-7 px-3 rounded-full text-[11px] font-semibold transition-all ${
                                statusFilter === f.value
                                    ? 'bg-zinc-900 text-white shadow dark:bg-white dark:text-zinc-900'
                                    : 'border text-zinc-500 hover:text-zinc-800 bg-zinc-100 hover:bg-zinc-200 border-zinc-200 dark:bg-white/8 dark:text-white/50 dark:hover:bg-white/15 dark:hover:text-white dark:border-white/10'
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
                            <tr className="border-b border-zinc-100 bg-zinc-50 dark:border-white/8 dark:bg-black/10">
                                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-zinc-400 dark:text-white/40">Book</th>
                                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-zinc-400 dark:text-white/40">Ref #</th>
                                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-zinc-400 dark:text-white/40">Borrowed</th>
                                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-zinc-400 dark:text-white/40">Due Date</th>
                                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-zinc-400 dark:text-white/40">Returned</th>
                                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-zinc-400 dark:text-white/40">Fees</th>
                                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-zinc-400 dark:text-white/40">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.data.length > 0 ? transactions.data.map((t, i) => (
                                <tr key={t.id} className={`border-b transition-all
                                    border-zinc-100 hover:bg-zinc-50 ${i % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'}
                                    dark:border-white/5 dark:hover:bg-white/8 ${i % 2 === 0 ? 'dark:bg-transparent' : 'dark:bg-white/3'}`}>

                                    {/* Book */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {t.book?.image_url
                                                ? <img src={t.book.image_url} alt={t.book.title} className="w-8 h-11 object-cover rounded-lg shadow-md shadow-black/20 flex-shrink-0" />
                                                : <div className="w-8 h-11 rounded-lg flex items-center justify-center flex-shrink-0 border
                                                    bg-zinc-100 border-zinc-200
                                                    dark:bg-white/8 dark:border-white/10">
                                                    <BookOpen size={13} className="text-zinc-300 dark:text-white/25" />
                                                  </div>
                                            }
                                            <div className="min-w-0">
                                                <p className="font-medium truncate max-w-[160px] text-zinc-800 dark:text-white">{t.book?.title || 'Unknown'}</p>
                                                <p className="mt-0.5 text-zinc-400 dark:text-white/40">{t.book?.author}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Ref */}
                                    <td className="px-4 py-3">
                                        <span className="flex items-center gap-1 font-mono text-zinc-400 dark:text-white/50">
                                            <Hash size={10} className="text-zinc-300 dark:text-white/25" />{t.ref_nbr}
                                        </span>
                                    </td>

                                    {/* Borrowed */}
                                    <td className="px-4 py-3 text-zinc-500 dark:text-white/55">{fmt(t.date_borrowed)}</td>

                                    {/* Due date */}
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-0.5">
                                            <span className={t.is_overdue ? 'text-red-500 font-semibold dark:text-red-400' : 'text-zinc-500 dark:text-white/55'}>
                                                {fmt(t.expected_return_date)}
                                            </span>
                                            {t.is_overdue && <span className="text-[10px] text-red-400/70">{t.days_overdue}d overdue</span>}
                                        </div>
                                    </td>

                                    {/* Returned */}
                                    <td className="px-4 py-3 text-zinc-500 dark:text-white/55">{fmt(t.date_returned)}</td>

                                    {/* Fees */}
                                    <td className="px-4 py-3">
                                        {t.fees > 0
                                            ? <span className="text-red-500 font-semibold dark:text-red-300">₱{Number(t.fees).toFixed(2)}</span>
                                            : <span className="text-zinc-300 dark:text-white/25">—</span>
                                        }
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-4 py-16 text-center">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border
                                            bg-zinc-100 border-zinc-200
                                            dark:bg-white/5 dark:border-white/10">
                                            <BookOpen className="w-8 h-8 text-zinc-300 dark:text-white/20" />
                                        </div>
                                        <p className="font-medium text-zinc-400 dark:text-white/30">No borrow records found</p>
                                        <p className="text-xs mt-1 text-zinc-300 dark:text-white/20">
                                            {statusFilter ? 'Try a different filter' : 'Start borrowing books from the library'}
                                        </p>
                                        {!statusFilter && (
                                            <Link href="/books" className="inline-flex items-center gap-1.5 mt-4 h-8 px-4 rounded-xl text-xs font-semibold border transition-all
                                                bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border-emerald-200 hover:border-transparent
                                                dark:bg-emerald-500/15 dark:hover:bg-emerald-500 dark:text-emerald-300 dark:hover:text-white dark:border-emerald-500/25">
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