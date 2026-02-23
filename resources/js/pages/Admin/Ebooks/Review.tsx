import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, XCircle, BookOpen, Clock, Eye, AlertCircle, User } from 'lucide-react';
import AdminAuthLayout from '@/layouts/AdminAuthLayout';

const COVER_BG = [
    'from-violet-900 to-slate-950',
    'from-amber-900 to-stone-950',
    'from-emerald-900 to-slate-950',
    'from-rose-900 to-slate-950',
    'from-cyan-900 to-slate-950',
    'from-indigo-900 to-slate-950',
];

const STATUS_STYLE = {
    draft:    'bg-white/8 text-white/40',
    pending:  'bg-amber-500/15 text-amber-300',
    approved: 'bg-emerald-500/15 text-emerald-300',
    rejected: 'bg-red-500/15 text-red-300',
};

export default function AdminReview({ story }) {
    const [rejectModal, setRejectModal] = useState(false);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const paragraphs = story.content.split(/\n{2,}/).filter(Boolean);

    const handleApprove = () => {
        setLoading(true);
        router.post(`/admin/ebooks/${story.id}/approve`, {}, {
            onFinish: () => setLoading(false),
        });
    };

    const handleReject = () => {
        if (!reason.trim()) return;
        setLoading(true);
        router.post(`/admin/ebooks/${story.id}/reject`, { reason }, {
            onSuccess: () => setRejectModal(false),
            onFinish:  () => setLoading(false),
        });
    };

    return (
        <AdminAuthLayout>
            <Head title={`Review: ${story.title}`} />

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0d0f]/95 p-6 shadow-2xl">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-400/40 to-transparent rounded-t-2xl" />
                        <div className="h-10 w-10 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center mb-4">
                            <XCircle size={18} className="text-red-400" />
                        </div>
                        <p className="text-base font-bold text-white mb-1">Reject Story</p>
                        <p className="text-xs text-white/40 mb-4">Provide a reason so the author knows what to fix.</p>
                        <textarea value={reason} onChange={e => setReason(e.target.value)}
                            placeholder="e.g. Content violates community guidelines. Please revise and resubmit."
                            rows={4}
                            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/40 resize-none mb-4" />
                        <div className="flex gap-3">
                            <button onClick={() => setRejectModal(false)} className="flex-1 h-9 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white text-xs font-semibold transition-all">Cancel</button>
                            <button onClick={handleReject} disabled={!reason.trim() || loading}
                                className="flex-1 h-9 rounded-xl bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-lg shadow-red-500/20">
                                {loading ? 'Rejecting…' : 'Reject Story'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl">
                {/* Back + actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <Link href="/admin/ebooks" className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors">
                        <ArrowLeft size={13} /> All Stories
                    </Link>
                    {story.status === 'pending' && (
                        <div className="flex items-center gap-2">
                            <button onClick={() => setRejectModal(true)} disabled={loading}
                                className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-red-500/15 hover:bg-red-500 border border-red-500/25 hover:border-transparent text-red-300 hover:text-white text-xs font-semibold transition-all disabled:opacity-50">
                                <XCircle size={13} /> Reject
                            </button>
                            <button onClick={handleApprove} disabled={loading}
                                className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 active:scale-95">
                                <CheckCircle size={13} /> {loading ? 'Approving…' : 'Approve & Publish'}
                            </button>
                        </div>
                    )}
                    {story.status === 'approved' && (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/15 px-3 py-1.5 rounded-full border border-emerald-500/25">
                            <CheckCircle size={12} /> Published {story.approved_at}
                        </span>
                    )}
                    {story.status === 'rejected' && (
                        <span className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/15 px-3 py-1.5 rounded-full border border-red-500/25">
                            <XCircle size={12} /> Rejected
                        </span>
                    )}
                </div>

                {/* Story meta */}
                <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl border border-white/8 bg-white/3 mb-6">
                    <div className="w-full sm:w-32 flex-shrink-0">
                        <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-xl shadow-black/40">
                            {story.cover_url
                                ? <img src={story.cover_url} alt={story.title} className="w-full h-full object-cover" />
                                : <div className={`w-full h-full bg-gradient-to-br ${COVER_BG[story.id % 6]} flex items-center justify-center`}>
                                    <BookOpen size={24} className="text-white/20" />
                                  </div>
                            }
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[story.status]}`}>{story.status}</span>
                            {story.genre && <span className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{story.genre}</span>}
                        </div>
                        <h1 className="text-2xl font-black text-white leading-tight mb-1">{story.title}</h1>
                        <div className="flex items-center gap-1.5 text-sm text-white/40 mb-3">
                            <User size={12} />
                            <span>by <span className="text-white/60 font-medium">{story.author?.name}</span></span>
                        </div>
                        {story.synopsis && <p className="text-sm text-white/35 leading-relaxed mb-4">{story.synopsis}</p>}

                        {story.status === 'rejected' && story.rejection_reason && (
                            <div className="flex gap-2 p-3 rounded-xl bg-red-500/8 border border-red-500/15 mb-4">
                                <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-red-300 mb-0.5">Rejection Reason</p>
                                    <p className="text-xs text-red-400/70">{story.rejection_reason}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-4 pt-3 border-t border-white/8">
                            <span className="flex items-center gap-1.5 text-xs text-white/30"><Eye size={11} />{story.views} views</span>
                            <span className="flex items-center gap-1.5 text-xs text-white/30"><Clock size={11} />{story.read_time} min read</span>
                            <span className="text-xs text-white/20">Submitted {story.created_at}</span>
                        </div>
                    </div>
                </div>

                {/* Content preview */}
                <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 bg-black/20 border-b border-white/8">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Story Content</p>
                        <p className="text-[10px] text-white/20">{story.content.trim().split(/\s+/).length} words</p>
                    </div>
                    <div className="px-6 py-6 max-h-[60vh] overflow-y-auto space-y-5">
                        {paragraphs.map((p, i) => (
                            <p key={i} className="text-sm text-white/65 leading-[1.85]"
                                style={{ fontFamily: "'Georgia', serif", textIndent: i > 0 ? '1.5em' : '0' }}>
                                {p.trim()}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Bottom actions for pending */}
                {story.status === 'pending' && (
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setRejectModal(true)} disabled={loading}
                            className="flex items-center gap-1.5 h-10 px-6 rounded-xl bg-red-500/15 hover:bg-red-500 border border-red-500/25 hover:border-transparent text-red-300 hover:text-white text-xs font-semibold transition-all disabled:opacity-50">
                            <XCircle size={13} /> Reject Story
                        </button>
                        <button onClick={handleApprove} disabled={loading}
                            className="flex items-center gap-1.5 h-10 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 active:scale-95">
                            <CheckCircle size={13} /> {loading ? 'Approving…' : 'Approve & Publish'}
                        </button>
                    </div>
                )}
            </div>
        </AdminAuthLayout>
    );
}
