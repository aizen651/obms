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
    draft:    'bg-gray-100 text-gray-600',
    pending:  'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

const STAT_CARDS = [
    { label: 'Pending',  key: 'pending',  color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200'   },
    { label: 'Approved', key: 'approved', color: 'text-green-600',  bg: 'bg-green-50 border-green-200'   },
    { label: 'Rejected', key: 'rejected', color: 'text-red-600',    bg: 'bg-red-50 border-red-200'       },
    { label: 'Total',    key: 'all',      color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
];

const Cover = ({ story }) => (
    <div className="w-8 h-11 rounded-md overflow-hidden flex-shrink-0">
        {story.cover_url
            ? <img src={story.cover_url} alt={story.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center"><BookOpen size={10} className="text-white" /></div>}
    </div>
);

export default function AdminEBooksIndex({ stories, counts, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [status, setStatus] = useState(filters?.status ?? '');

    const apply = (s, st) => router.get('/admin/ebooks', { search: s, status: st }, { preserveState: true, replace: true });
    const handleSearch = (v) => { setSearch(v); apply(v, status); };
    const handleStatus = (v) => { setStatus(v); apply(search, v); };
    const handleDelete = (id) => { if (confirm('Delete this story permanently?')) router.delete(`/admin/ebooks/${id}`); };

    return (
        <AdminAuthLayout header="E-Books">
            <Head title="E-Books — Admin" />
            <div className="space-y-4">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">E-Book Stories</h2>
                        <p className="text-sm text-gray-500">{counts.pending} pending review</p>
                    </div>
                    <Link href="/ebooks" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow transition-all self-start sm:self-auto">
                        <BookOpen size={16} /> View Public Page
                    </Link>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {STAT_CARDS.map(({ label, key, color, bg }) => (
                        <div key={label} className={`rounded-xl border p-4 ${bg}`}>
                            <p className={`text-2xl font-black ${color}`}>{counts[key]}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-xl shadow overflow-hidden">

                    {/* Toolbar */}
                    <div className="border-b border-gray-100 px-4 py-3 space-y-3">
                        {/* Search — full width */}
                        <div className="relative w-full">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input type="text" placeholder="Search title, author…" value={search} onChange={e => handleSearch(e.target.value)}
                                className="w-full h-9 pl-8 pr-3 rounded-lg border border-indigo-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                        </div>
                        {/* Status tabs — wrappable */}
                        <div className="flex flex-wrap gap-2">
                            {STATUS_TABS.map(t => (
                                <button key={t.key} onClick={() => handleStatus(t.key)}
                                    className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                                        status === t.key
                                            ? 'bg-indigo-500 text-white shadow'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'}`}>
                                    {t.label}
                                    {counts[t.countKey] > 0 && (
                                        <span className={`text-[10px] h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center font-bold ${
                                            status === t.key ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                            {counts[t.countKey]}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-indigo-100">
                                <tr>
                                    {['Story', 'Author', 'Genre', 'Status', 'Submitted', 'Views', 'Actions'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stories.data.length > 0 ? stories.data.map(story => (
                                    <tr key={story.id} className="hover:bg-blue-50/40 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <Cover story={story} />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">{story.title}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{story.read_time}m read</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{story.author?.name ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            {story.genre
                                                ? <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full text-xs">{story.genre}</span>
                                                : <span className="text-gray-400">—</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[story.status]}`}>{story.status}</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{story.created_at}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{story.views}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <Link href={`/admin/ebooks/${story.id}`} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Review"><Eye className="w-4 h-4" /></Link>
                                                <button onClick={() => handleDelete(story.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="7" className="px-4 py-16 text-center">
                                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">No stories found</p>
                                        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {stories.last_page > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100">
                            <p className="text-sm text-gray-500">Showing <span className="font-medium text-gray-800">{stories.from}–{stories.to}</span> of <span className="font-medium text-gray-800">{stories.total}</span></p>
                            <div className="flex gap-1 flex-wrap justify-center sm:justify-end">
                                {stories.links.map((l, i) => (
                                    <button key={i} onClick={() => l.url && router.get(l.url)} disabled={!l.url}
                                        className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-all ${
                                            l.active ? 'bg-indigo-500 text-white shadow'
                                            : l.url ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                                            : 'text-gray-300 cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: l.label }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminAuthLayout>
    );
}