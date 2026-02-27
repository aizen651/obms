import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, XCircle, BookOpen, Clock, Eye, AlertCircle, User } from 'lucide-react';
import AdminAuthLayout from '@/layouts/AdminAuthLayout';

const STATUS_STYLE = {
    draft:    'bg-gray-100 text-gray-600',
    pending:  'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

const Cover = ({ story }) => (
    <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
        {story.cover_url
            ? <img src={story.cover_url} alt={story.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <BookOpen size={28} className="text-white/60" />
              </div>}
    </div>
);

export default function AdminReview({ story }) {
    const [rejectModal, setRejectModal] = useState(false);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const paragraphs = story.content.split(/\n{2,}/).filter(Boolean);

    const handleApprove = () => {
        setLoading(true);
        router.post(`/admin/ebooks/${story.id}/approve`, {}, { onFinish: () => setLoading(false) });
    };

    const handleReject = () => {
        if (!reason.trim()) return;
        setLoading(true);
        router.post(`/admin/ebooks/${story.id}/reject`, { reason }, {
            onSuccess: () => setRejectModal(false),
            onFinish: () => setLoading(false),
        });
    };

    const ApproveBtn = ({ tall }) => (
        <button onClick={handleApprove} disabled={loading}
            className={`flex items-center gap-1.5 ${tall ? 'h-10 px-6' : 'h-9 px-4'} rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-semibold transition-all shadow disabled:opacity-50`}>
            <CheckCircle size={13} /> {loading ? 'Approving…' : 'Approve & Publish'}
        </button>
    );

    const RejectBtn = ({ tall }) => (
        <button onClick={() => setRejectModal(true)} disabled={loading}
            className={`flex items-center gap-1.5 ${tall ? 'h-10 px-6' : 'h-9 px-4'} rounded-xl bg-red-50 hover:bg-red-500 border border-red-200 hover:border-transparent text-red-600 hover:text-white text-xs font-semibold transition-all disabled:opacity-50`}>
            <XCircle size={13} /> {tall ? 'Reject Story' : 'Reject'}
        </button>
    );

    return (
        <AdminAuthLayout header="Review Story">
            <Head title={`Review: ${story.title}`} />

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mb-4">
                            <XCircle size={18} className="text-red-500" />
                        </div>
                        <p className="text-base font-bold text-gray-900 mb-1">Reject Story</p>
                        <p className="text-sm text-gray-500 mb-4">Provide a reason so the author knows what to fix.</p>
                        <textarea value={reason} onChange={e => setReason(e.target.value)}
                            placeholder="e.g. Content violates community guidelines. Please revise and resubmit."
                            rows={4}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-4" />
                        <div className="flex gap-3">
                            <button onClick={() => setRejectModal(false)} className="flex-1 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold transition-all">Cancel</button>
                            <button onClick={handleReject} disabled={!reason.trim() || loading}
                                className="flex-1 h-9 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow">
                                {loading ? 'Rejecting…' : 'Reject Story'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl space-y-4">

                {/* Back + actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <Link href="/admin/ebooks" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                        <ArrowLeft size={14} /> All Stories
                    </Link>
                    <div className="flex items-center gap-2">
                        {story.status === 'pending' && <><RejectBtn /><ApproveBtn /></>}
                        {story.status === 'approved' && (
                            <span className="flex items-center gap-1.5 text-xs text-green-700 bg-green-100 px-3 py-1.5 rounded-full border border-green-200">
                                <CheckCircle size={12} /> Published {story.approved_at}
                            </span>
                        )}
                        {story.status === 'rejected' && (
                            <span className="flex items-center gap-1.5 text-xs text-red-700 bg-red-100 px-3 py-1.5 rounded-full border border-red-200">
                                <XCircle size={12} /> Rejected
                            </span>
                        )}
                    </div>
                </div>

                {/* Story meta */}
                <div className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row gap-6">
                    <div className="w-full sm:w-32 flex-shrink-0"><Cover story={story} /></div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[story.status]}`}>{story.status}</span>
                            {story.genre && <span className="text-xs text-gray-500 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">{story.genre}</span>}
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 leading-tight mb-1">{story.title}</h1>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                            <User size={12} />
                            <span>by <span className="text-gray-700 font-medium">{story.author?.name}</span></span>
                        </div>
                        {story.synopsis && <p className="text-sm text-gray-500 leading-relaxed mb-4">{story.synopsis}</p>}

                        {story.status === 'rejected' && story.rejection_reason && (
                            <div className="flex gap-2 p-3 rounded-xl bg-red-50 border border-red-200 mb-4">
                                <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-red-700 mb-0.5">Rejection Reason</p>
                                    <p className="text-xs text-red-600">{story.rejection_reason}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-100">
                            <span className="flex items-center gap-1.5 text-xs text-gray-400"><Eye size={11} />{story.views} views</span>
                            <span className="flex items-center gap-1.5 text-xs text-gray-400"><Clock size={11} />{story.read_time} min read</span>
                            <span className="text-xs text-gray-400">Submitted {story.created_at}</span>
                        </div>
                    </div>
                </div>

                {/* Content preview */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-indigo-100">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Story Content</p>
                        <p className="text-xs text-gray-400">{story.content.trim().split(/\s+/).length} words</p>
                    </div>
                    <div className="px-6 py-6 max-h-[60vh] overflow-y-auto space-y-5">
                        {paragraphs.map((p, i) => (
                            <p key={i} className="text-sm text-gray-700 leading-[1.85]"
                                style={{ fontFamily: "'Georgia', serif", textIndent: i > 0 ? '1.5em' : '0' }}>
                                {p.trim()}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Bottom actions */}
                {story.status === 'pending' && (
                    <div className="flex justify-end gap-3">
                        <RejectBtn tall /><ApproveBtn tall />
                    </div>
                )}
            </div>
        </AdminAuthLayout>
    );
}