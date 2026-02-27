import { Head, Link, router } from '@inertiajs/react';
import { PenLine, BookOpen, Clock, Eye, Edit, Trash2, Send, CheckCircle, XCircle, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import Layout from '@/layouts/Layout';
import { useState } from 'react';

const STATUS = {
    draft:    { label: 'Draft',    cls: 'bg-zinc-100 text-zinc-400 ring-1 ring-zinc-200 dark:bg-white/8 dark:text-white/40 dark:ring-white/10',                             icon: FileText,    desc: 'Not yet submitted'           },
    pending:  { label: 'Pending',  cls: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/20',                 icon: Clock,       desc: 'Awaiting admin review'       },
    approved: { label: 'Approved', cls: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/20',     icon: CheckCircle, desc: 'Published and visible to all' },
    rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-600 ring-1 ring-red-200 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-400/20',                             icon: XCircle,     desc: 'See rejection reason below'   },
};

const StatusBadge = ({ status }) => {
    const s = STATUS[status] ?? STATUS.draft;
    return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${s.cls}`}>{s.label}</span>;
};

const DeleteModal = ({ story, onCancel, onConfirm }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-sm">
        <div className="relative w-full max-w-sm rounded-2xl border shadow-2xl p-6
            bg-white border-zinc-200 shadow-zinc-200
            dark:border-white/10 dark:bg-[#0d0d0f]/95 dark:shadow-black">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent rounded-t-2xl dark:via-red-400/40" />
            <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 border
                bg-red-50 border-red-200
                dark:bg-red-500/15 dark:border-red-500/25">
                <Trash2 size={20} className="text-red-500 dark:text-red-400" />
            </div>
            <p className="text-base font-bold mb-1 text-zinc-900 dark:text-white">Delete Story?</p>
            <p className="text-sm mb-5 text-zinc-400 dark:text-white/40">"{story.title}" will be permanently deleted. This cannot be undone.</p>
            <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 h-9 rounded-xl text-xs font-semibold transition-all border
                    bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-500 hover:text-zinc-800
                    dark:bg-white/8 dark:hover:bg-white/15 dark:border-white/10 dark:text-white/60 dark:hover:text-white">
                    Cancel
                </button>
                <button onClick={onConfirm} className="flex-1 h-9 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-semibold transition-all shadow-lg shadow-red-500/20">
                    Delete
                </button>
            </div>
        </div>
    </div>
);

export default function MyStories({ stories }) {
    const [deleting, setDeleting] = useState(null);

    const handleDelete = (story) => {
        router.delete(`/ebooks/${story.id}`);
        setDeleting(null);
    };

    const counts = {
        all:      stories.total,
        draft:    stories.data.filter(s => s.status === 'draft').length,
        pending:  stories.data.filter(s => s.status === 'pending').length,
        approved: stories.data.filter(s => s.status === 'approved').length,
        rejected: stories.data.filter(s => s.status === 'rejected').length,
    };

    return (
        <Layout>
            <Head title="My Stories" />

            {deleting && <DeleteModal story={deleting} onCancel={() => setDeleting(null)} onConfirm={() => handleDelete(deleting)} />}

            {/* Page background */}
            <div className="fixed inset-0 -z-10
                bg-gradient-to-b from-zinc-100 via-zinc-50 to-white
                dark:from-zinc-950 dark:via-slate-800 dark:to-slate-700" />

            {/* Ambient blob */}
            <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[500px] h-[300px] rounded-full blur-[140px]
                    bg-violet-200/50 dark:bg-violet-600/7" />
            </div>

            <div className="relative pt-16 pb-16">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2
                            text-violet-500 dark:text-violet-400/70">
                            Your Stories
                        </p>
                        <h1 className="text-3xl font-black leading-none
                            text-zinc-900 dark:text-white">
                            My <span className="italic text-amber-500 dark:text-amber-300/90">Stories</span>
                        </h1>
                        <p className="text-sm mt-1.5 text-zinc-400 dark:text-white/30">
                            {stories.total} {stories.total === 1 ? 'story' : 'stories'} total
                        </p>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-end">
                        <Link href="/ebooks" className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold transition-all border
                            bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-zinc-800
                            dark:bg-white/8 dark:hover:bg-white/15 dark:border-white/10 dark:text-white/60 dark:hover:text-white">
                            <BookOpen size={13} /> Browse Stories
                        </Link>
                        <Link href="/ebooks/create" className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold transition-all active:scale-95 border
                            bg-violet-100 hover:bg-violet-500 border-violet-300 hover:border-transparent text-violet-600 hover:text-white
                            dark:bg-violet-500/20 dark:hover:bg-violet-500 dark:border-violet-500/30 dark:hover:border-transparent dark:text-violet-300 dark:hover:text-white">
                            <PenLine size={13} /> New Story
                        </Link>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {[
                        { label: 'Pending',  value: counts.pending,  lightColor: 'text-amber-500',   lightBg: 'bg-amber-50 border-amber-200',     darkColor: 'dark:text-amber-400',   darkBg: 'dark:bg-amber-500/10 dark:border-amber-500/20'   },
                        { label: 'Approved', value: counts.approved, lightColor: 'text-emerald-600', lightBg: 'bg-emerald-50 border-emerald-200', darkColor: 'dark:text-emerald-400', darkBg: 'dark:bg-emerald-500/10 dark:border-emerald-500/20'},
                        { label: 'Rejected', value: counts.rejected, lightColor: 'text-red-500',     lightBg: 'bg-red-50 border-red-200',         darkColor: 'dark:text-red-400',     darkBg: 'dark:bg-red-500/10 dark:border-red-500/20'       },
                        { label: 'Drafts',   value: counts.draft,    lightColor: 'text-zinc-400',    lightBg: 'bg-zinc-100 border-zinc-200',      darkColor: 'dark:text-white/40',    darkBg: 'dark:bg-white/5 dark:border-white/10'            },
                    ].map(({ label, value, lightColor, lightBg, darkColor, darkBg }) => (
                        <div key={label} className={`rounded-xl border p-4 ${lightBg} ${darkBg}`}>
                            <p className={`text-2xl font-black ${lightColor} ${darkColor}`}>{value}</p>
                            <p className="text-[10px] uppercase tracking-wider mt-0.5 text-zinc-400 dark:text-white/30">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Stories list */}
                {stories.data.length > 0 ? (
                    <div className="space-y-3">
                        {stories.data.map(story => {
                            const s = STATUS[story.status] ?? STATUS.draft;
                            const Icon = s.icon;
                            return (
                                <div key={story.id} className="group relative overflow-hidden rounded-2xl border transition-all
                                    bg-white hover:bg-zinc-50 border-zinc-200 hover:border-zinc-300 shadow-sm shadow-zinc-100
                                    dark:bg-white/3 dark:hover:bg-white/5 dark:border-white/8 dark:hover:border-white/12 dark:shadow-none">
                                    <div className="flex gap-4 p-4">

                                        {/* Cover */}
                                        <div className="w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-lg shadow-black/10 dark:shadow-black/30">
                                            {story.cover_url
                                                ? <img src={story.cover_url} alt={story.title} className="w-full h-full object-cover" />
                                                : <div className="w-full h-full flex items-center justify-center
                                                    bg-gradient-to-br from-violet-100 to-zinc-100
                                                    dark:from-violet-900 dark:to-slate-950">
                                                    <BookOpen size={16} className="text-violet-300 dark:text-white/20" />
                                                  </div>
                                            }
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h3 className="font-bold text-sm leading-snug line-clamp-1
                                                    text-zinc-900 dark:text-white">
                                                    {story.title}
                                                </h3>
                                                <StatusBadge status={story.status} />
                                                {story.genre && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full
                                                        bg-zinc-100 text-zinc-400
                                                        dark:bg-white/5 dark:text-white/30">
                                                        {story.genre}
                                                    </span>
                                                )}
                                            </div>

                                            {story.synopsis && (
                                                <p className="text-xs line-clamp-1 mb-2 text-zinc-400 dark:text-white/30">
                                                    {story.synopsis}
                                                </p>
                                            )}

                                            {story.status === 'rejected' && story.rejection_reason && (
                                                <div className="flex gap-1.5 items-start mb-2 p-2 rounded-lg border
                                                    bg-red-50 border-red-100
                                                    dark:bg-red-500/8 dark:border-red-500/15">
                                                    <AlertCircle size={11} className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-[11px] leading-relaxed text-red-500 dark:text-red-400/80">
                                                        {story.rejection_reason}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-3 text-[10px] text-zinc-400 dark:text-white/25">
                                                <span className="flex items-center gap-1"><Eye size={9} />{story.views}</span>
                                                <span className="flex items-center gap-1"><Clock size={9} />{story.read_time}m</span>
                                                <span>{story.created_at}</span>
                                                <span className="flex items-center gap-1"><Icon size={9} />{s.desc}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-1.5 flex-shrink-0 self-start">
                                            {story.status === 'approved' && (
                                                <Link href={`/ebooks/${story.slug}`}
                                                    className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[10px] font-semibold transition-all border
                                                        bg-emerald-50 hover:bg-emerald-500/20 border-emerald-200 text-emerald-600
                                                        dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 dark:border-emerald-500/20 dark:text-emerald-400">
                                                    <BookOpen size={10} /> Read
                                                </Link>
                                            )}
                                            {story.status !== 'approved' && (
                                                <Link href={`/ebooks/${story.id}/edit`}
                                                    className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[10px] font-semibold transition-all border
                                                        bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-500 hover:text-zinc-800
                                                        dark:bg-white/8 dark:hover:bg-white/15 dark:border-white/10 dark:text-white/50 dark:hover:text-white">
                                                    <Edit size={10} /> Edit
                                                </Link>
                                            )}
                                            <button onClick={() => setDeleting(story)}
                                                className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[10px] font-semibold transition-all border
                                                    bg-zinc-50 hover:bg-red-50 border-zinc-200 hover:border-red-200 text-zinc-400 hover:text-red-500
                                                    dark:bg-white/5 dark:hover:bg-red-500/15 dark:border-white/8 dark:hover:border-red-500/20 dark:text-white/30 dark:hover:text-red-400">
                                                <Trash2 size={10} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4 border
                            bg-zinc-100 border-zinc-200
                            dark:bg-white/5 dark:border-white/8">
                            <PenLine size={28} className="text-zinc-300 dark:text-white/20" />
                        </div>
                        <p className="font-semibold text-zinc-400 dark:text-white/30">No stories yet</p>
                        <p className="text-sm mt-1 text-zinc-300 dark:text-white/20">
                            Write your first story and share it with the community
                        </p>
                        <Link href="/ebooks/create" className="mt-5 flex items-center gap-1.5 h-9 px-5 rounded-xl text-xs font-semibold transition-all border
                            bg-violet-100 hover:bg-violet-500 border-violet-300 hover:border-transparent text-violet-600 hover:text-white
                            dark:bg-violet-500/20 dark:hover:bg-violet-500 dark:border-violet-500/30 dark:text-violet-300 dark:hover:text-white">
                            <PenLine size={12} /> Write a Story
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {stories.last_page > 1 && (
                    <div className="flex justify-center gap-1 mt-8">
                        {stories.links.slice(1, -1).map((l, i) => (
                            <button key={i} onClick={() => l.url && router.get(l.url)}
                                className={`min-w-[34px] h-8 px-2 rounded-lg text-xs font-medium transition-all
                                    ${l.active
                                        ? 'bg-violet-500 text-white'
                                        : l.url
                                            ? 'border bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-zinc-800 dark:bg-white/5 dark:text-white/50 dark:hover:bg-white/10 dark:border-white/8'
                                            : 'text-zinc-300 dark:text-white/20 cursor-not-allowed'
                                    }`}>
                                {l.label}
                            </button>
                        ))}
                    </div>
                )}

            </div>
        </Layout>
    );
}