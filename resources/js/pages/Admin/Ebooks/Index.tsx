import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, BookOpen, Eye, Trash2 } from 'lucide-react';
import AdminAuthLayout from '@/layouts/AdminAuthLayout';

const STATUS_TABS = [
    { key: '',         label: 'All',      countKey: 'all'      },
    { key: 'pending',  label: 'Pending',  countKey: 'pending'  },
    { key: 'approved', label: 'Approved', countKey: 'approved' },
    { key: 'rejected', label: 'Rejected', countKey: 'rejected' },
    { key: 'draft',    label: 'Drafts',   countKey: 'draft'    },
];

const STATUS_STYLE = {
    draft:    'bg-white/15 text-white/70 ring-1 ring-white/20',
    pending:  'bg-amber-500/25 text-amber-200 ring-1 ring-amber-400/40',
    approved: 'bg-emerald-500/25 text-emerald-200 ring-1 ring-emerald-400/40',
    rejected: 'bg-red-500/25 text-red-200 ring-1 ring-red-400/40',
};

export default function AdminEBooksIndex({ stories, counts, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [status, setStatus] = useState(filters?.status ?? '');

    const apply = (s, st) => router.get('/admin/ebooks', { search: s, status: st }, { preserveState: true, replace: true });
    const handleSearch = (v) => { setSearch(v); apply(v, status); };
    const handleStatus = (v) => { setStatus(v); apply(search, v); };
    const handleDelete = (id) => {
        if (!confirm('Delete this story permanently?')) return;
        router.delete(`/admin/ebooks/${id}`);
    };

    return (
        <AdminAuthLayout>
            <Head title="E-Books — Admin" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-400 mb-1">Admin Panel</p>
                    <h1 className="text-2xl font-black text-white">E-Book <span className="italic text-amber-300">Stories</span></h1>
                    <p className="text-sm text-white/60 mt-1">{counts.pending} pending review</p>
                </div>
                <Link href="/ebooks"
                    className="self-start sm:self-end flex items-center gap-1.5 h-9 px-4 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold transition-all">
                    <BookOpen size={13} /> View Public Page
                </Link>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Pending',  value: counts.pending,  color: 'text-amber-300',   bg: 'bg-amber-500/15 border-amber-400/30'   },
                    { label: 'Approved', value: counts.approved, color: 'text-emerald-300', bg: 'bg-emerald-500/15 border-emerald-400/30' },
                    { label: 'Rejected', value: counts.rejected, color: 'text-red-300',     bg: 'bg-red-500/15 border-red-400/30'        },
                    { label: 'Total',    value: counts.all,      color: 'text-white',        bg: 'bg-white/10 border-white/20'            },
                ].map(({ label, value, color, bg }) => (
                    <div key={label} className={`rounded-xl border p-4 ${bg}`}>
                        <p className={`text-2xl font-black ${color}`}>{value}</p>
                        <p className="text-[10px] text-white/60 uppercase tracking-wider mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* Table card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/20">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white/5 border-b border-white/15 px-4 py-3">
                    <div className="relative flex-1 w-full sm:max-w-xs">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
                        <input type="text" placeholder="Search title, author…" value={search}
                            onChange={e => handleSearch(e.target.value)}
                            className="w-full h-8 pl-8 pr-3 rounded-lg bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-violet-400/60" />
                    </div>
                    <div className="flex gap-1 overflow-x-auto scrollbar-none">
                        {STATUS_TABS.map(t => (
                            <button key={t.key} onClick={() => handleStatus(t.key)}
                                className={`flex-shrink-0 h-8 px-3 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                                    status === t.key
                                        ? 'bg-white text-zinc-900 shadow'
                                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20'
                                }`}>
                                {t.label}
                                {counts[t.countKey] > 0 && (
                                    <span className={`text-[9px] h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center font-bold ${
                                        status === t.key ? 'bg-zinc-200 text-zinc-800' : 'bg-white/20 text-white/80'
                                    }`}>
                                        {counts[t.countKey]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-white/15 bg-white/5">
                                {['Story','Author','Genre','Status','Submitted','Views','Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-white/60 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {stories.data.length > 0 ? stories.data.map((story, i) => (
                                <tr key={story.id} className={`border-b border-white/10 hover:bg-white/8 transition-colors ${i % 2 !== 0 ? 'bg-white/[0.03]' : ''}`}>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-11 rounded-md overflow-hidden flex-shrink-0">
                                                {story.cover_url
                                                    ? <img src={story.cover_url} alt={story.title} className="w-full h-full object-cover" />
                                                    : <div className="w-full h-full bg-gradient-to-br from-violet-900 to-slate-950 flex items-center justify-center">
                                                        <BookOpen size={10} className="text-white/40" />
                                                      </div>
                                                }
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-white font-semibold truncate max-w-[180px]">{story.title}</p>
                                                <p className="text-white/50 mt-0.5">{story.read_time}m read</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-white/70">{story.author?.name ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        {story.genre
                                            ? <span className="bg-white/15 text-white/70 px-2 py-0.5 rounded-full text-[10px] border border-white/20">{story.genre}</span>
                                            : <span className="text-white/30">—</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${STATUS_STYLE[story.status]}`}>
                                            {story.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-white/60">{story.created_at}</td>
                                    <td className="px-4 py-3 text-white/60">{story.views}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <Link href={`/admin/ebooks/${story.id}`}
                                                className="h-7 px-2.5 rounded-lg bg-violet-500/25 hover:bg-violet-500/40 border border-violet-400/40 text-violet-300 hover:text-violet-200 text-[10px] font-semibold transition-all flex items-center gap-1">
                                                <Eye size={10} /> Review
                                            </Link>
                                            <button onClick={() => handleDelete(story.id)}
                                                className="h-7 w-7 rounded-lg bg-white/10 hover:bg-red-500/25 border border-white/20 hover:border-red-400/40 text-white/60 hover:text-red-300 transition-all flex items-center justify-center">
                                                <Trash2 size={11} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-4 py-16 text-center">
                                        <BookOpen size={32} className="text-white/20 mx-auto mb-3" />
                                        <p className="text-white/50 font-medium">No stories found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {stories.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/15 bg-white/5">
                        <p className="text-xs text-white/60">Showing {stories.from}–{stories.to} of {stories.total}</p>
                        <div className="flex gap-1">
                            {stories.links.map((l, i) => (
                                <button key={i} onClick={() => l.url && router.get(l.url)}
                                    className={`min-w-[32px] h-7 px-2 rounded text-xs font-medium transition-all ${
                                        l.active
                                            ? 'bg-white text-zinc-900 shadow'
                                            : l.url
                                            ? 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20'
                                            : 'text-white/30 cursor-not-allowed'
                                    }`}>
                                    {l.label === '&laquo; Previous' ? '←' : l.label === 'Next &raquo;' ? '→' : l.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminAuthLayout>
    );
}
