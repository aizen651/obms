import { Head, Link, router } from '@inertiajs/react';
import { PenLine, BookOpen, Clock, Eye, Edit, Trash2, Send, CheckCircle, XCircle, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import Layout from '@/layouts/Layout';
import { useState } from 'react';

const STATUS = {
    draft:    { label: 'Draft',    cls: 'bg-white/8 text-white/40 ring-1 ring-white/10',               icon: FileText,    desc: 'Not yet submitted'              },
    pending:  { label: 'Pending',  cls: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/20',     icon: Clock,       desc: 'Awaiting admin review'          },
    approved: { label: 'Approved', cls: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20',icon: CheckCircle, desc: 'Published and visible to all'   },
    rejected: { label: 'Rejected', cls: 'bg-red-500/15 text-red-300 ring-1 ring-red-400/20',           icon: XCircle,     desc: 'See rejection reason below'      },
};

const StatusBadge = ({ status }) => {
    const s = STATUS[status] ?? STATUS.draft;
    return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${s.cls}`}>{s.label}</span>;
};

const DeleteModal = ({ story, onCancel, onConfirm }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d0d0f]/95 p-6 shadow-2xl">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-400/40 to-transparent rounded-t-2xl" />
            <div className="h-12 w-12 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center mb-4">
                <Trash2 size={20} className="text-red-400" />
            </div>
            <p className="text-base font-bold text-white mb-1">Delete Story?</p>
            <p className="text-sm text-white/40 mb-5">"{story.title}" will be permanently deleted. This cannot be undone.</p>
            <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 h-9 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white text-xs font-semibold transition-all">Cancel</button>
                <button onClick={onConfirm} className="flex-1 h-9 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-semibold transition-all shadow-lg shadow-red-500/20">Delete</button>
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

            <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-violet-600/7 rounded-full blur-[140px]" />
            </div>

            <div className="relative pt-16 pb-16">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-400/70 mb-2">Your Stories</p>
                        <h1 className="text-3xl font-black text-white leading-none">My <span className="italic text-amber-300/90">Stories</span></h1>
                        <p className="text-sm text-white/30 mt-1.5">{stories.total} {stories.total === 1 ? 'story' : 'stories'} total</p>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-end">
                        <Link href="/ebooks" className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white text-xs font-semibold transition-all">
                            <BookOpen size={13} /> Browse Stories
                        </Link>
                        <Link href="/ebooks/create" className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-violet-500/20 hover:bg-violet-500 border border-violet-500/30 hover:border-transparent text-violet-300 hover:text-white text-xs font-semibold transition-all active:scale-95">
                            <PenLine size={13} /> New Story
                        </Link>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {[
                        { label: 'Pending',  value: counts.pending,  color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20'   },
                        { label: 'Approved', value: counts.approved, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20'},
                        { label: 'Rejected', value: counts.rejected, color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20'       },
                        { label: 'Drafts',   value: counts.draft,    color: 'text-white/40',    bg: 'bg-white/5 border-white/10'            },
                    ].map(({ label, value, color, bg }) => (
                        <div key={label} className={`rounded-xl border p-4 ${bg}`}>
                            <p className={`text-2xl font-black ${color}`}>{value}</p>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">{label}</p>
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
                                <div key={story.id} className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/12 transition-all">
                                    <div className="flex gap-4 p-4">
                                        {/* Cover */}
                                        <div className="w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-lg shadow-black/30">
                                            {story.cover_url
                                                ? <img src={story.cover_url} alt={story.title} className="w-full h-full object-cover" />
                                                : <div className="w-full h-full bg-gradient-to-br from-violet-900 to-slate-950 flex items-center justify-center">
                                                    <BookOpen size={16} className="text-white/20" />
                                                  </div>
                                            }
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h3 className="font-bold text-white text-sm leading-snug line-clamp-1">{story.title}</h3>
                                                <StatusBadge status={story.status} />
                                                {story.genre && <span className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{story.genre}</span>}
                                            </div>

                                            {story.synopsis && <p className="text-xs text-white/30 line-clamp-1 mb-2">{story.synopsis}</p>}

                                            {story.status === 'rejected' && story.rejection_reason && (
                                                <div className="flex gap-1.5 items-start mb-2 p-2 rounded-lg bg-red-500/8 border border-red-500/15">
                                                    <AlertCircle size={11} className="text-red-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-[11px] text-red-400/80 leading-relaxed">{story.rejection_reason}</p>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-3 text-[10px] text-white/25">
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
                                                    className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold transition-all">
                                                    <BookOpen size={10} /> Read
                                                </Link>
                                            )}
                                            {story.status !== 'approved' && (
                                                <Link href={`/ebooks/${story.id}/edit`}
                                                    className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-white/8 hover:bg-white/15 border border-white/10 text-white/50 hover:text-white text-[10px] font-semibold transition-all">
                                                    <Edit size={10} /> Edit
                                                </Link>
                                            )}
                                            <button onClick={() => setDeleting(story)}
                                                className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-white/5 hover:bg-red-500/15 border border-white/8 hover:border-red-500/20 text-white/30 hover:text-red-400 text-[10px] font-semibold transition-all">
                                                <Trash2 size={10} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mb-4">
                            <PenLine size={28} className="text-white/20" />
                        </div>
                        <p className="text-white/30 font-semibold">No stories yet</p>
                        <p className="text-white/20 text-sm mt-1">Write your first story and share it with the community</p>
                        <Link href="/ebooks/create" className="mt-5 flex items-center gap-1.5 h-9 px-5 rounded-xl bg-violet-500/20 hover:bg-violet-500 border border-violet-500/30 text-violet-300 hover:text-white text-xs font-semibold transition-all">
                            <PenLine size={12} /> Write a Story
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {stories.last_page > 1 && (
                    <div className="flex justify-center gap-1 mt-8">
                        {stories.links.slice(1, -1).map((l, i) => (
                            <button key={i} onClick={() => l.url && router.get(l.url)}
                                className={`min-w-[34px] h-8 px-2 rounded-lg text-xs font-medium transition-all ${l.active ? 'bg-violet-500 text-white' : l.url ? 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/8' : 'text-white/20 cursor-not-allowed'}`}>
                                {l.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
