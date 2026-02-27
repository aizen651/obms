import React, { useState, useEffect, useRef } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Lock, Globe, Plus, X, BookOpen, Pencil, Trash2, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';

const initials = (u) => `${u.firstname?.[0] ?? ''}${u.lastname?.[0] ?? ''}`.toUpperCase();
const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const avatarSrc = (user_image) => user_image ? `/storage/${user_image}` : null;

// ── Scroll Reveal Hook ────────────────────────────────────────────
function useScrollReveal(options = {}) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); }
        }, { threshold: options.threshold ?? 0.1, rootMargin: options.rootMargin ?? '0px 0px -40px 0px' });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return [ref, visible];
}

// ── Scroll Reveal Wrapper ─────────────────────────────────────────
function Reveal({ children, delay = 0, direction = 'up', className = '' }) {
    const [ref, visible] = useScrollReveal();
    const transforms = {
        up: 'translateY(24px)', down: 'translateY(-24px)',
        left: 'translateX(24px)', right: 'translateX(-24px)',
        scale: 'scale(0.95)', none: 'none',
    };
    return (
        <div ref={ref} className={className} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : transforms[direction],
            transition: `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
            willChange: 'opacity, transform',
        }}>
            {children}
        </div>
    );
}

// ── Avatar ────────────────────────────────────────────────────────
function Avatar({ user, size = 'md' }) {
    const sz = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm';
    const src = avatarSrc(user.user_image);
    return src
        ? <img src={src} alt="" className={`${sz} ring-2 ring-zinc-200 dark:ring-white/20 rounded-full shrink-0 object-cover`} />
        : <div className={`${sz} ring-2 ring-zinc-200 dark:ring-white/20 rounded-full shrink-0 flex items-center justify-center font-bold bg-zinc-200 text-zinc-600 dark:bg-gradient-to-br dark:from-white/20 dark:to-white/5 dark:text-white`}>{initials(user)}</div>;
}

// ── Journal Card ──────────────────────────────────────────────────
function JournalCard({ entry, authUser, onEdit, onDelete, isDark }) {
    const [expanded, setExpanded] = useState(false);
    const isOwner = authUser && authUser.id === entry.user_id;
    const preview = entry.content?.slice(0, 200);
    const hasMore = (entry.content?.length ?? 0) > 200;

    return (
        <article
            className="card-hover relative rounded-2xl overflow-hidden flex flex-col gap-4 p-5 sm:p-6 bg-white border border-zinc-200 shadow-sm dark:bg-transparent dark:border-transparent dark:shadow-none"
            style={isDark ? {
                background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)'
            } : undefined}
        >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-white/20" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <Avatar user={entry.user} size="sm" />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-800 dark:text-white truncate leading-tight">
                            {entry.user.firstname} {entry.user.lastname}
                        </p>
                        <p className="text-[11px] text-zinc-400 dark:text-white/40 flex items-center gap-1 mt-0.5">
                            <Clock size={9} />{fmt(entry.created_at)}
                        </p>
                    </div>
                </div>
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border shrink-0 ${
                    entry.is_public
                        ? 'border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-white/20 dark:bg-white/10 dark:text-white/70'
                        : 'border-zinc-100 bg-zinc-50 text-zinc-400 dark:border-white/10 dark:bg-white/5 dark:text-white/35'
                }`}>
                    {entry.is_public ? <Globe size={9} /> : <Lock size={9} />}
                    {entry.is_public ? 'Public' : 'Private'}
                </span>
            </div>

            {entry.title && (
                <h3 className="text-base sm:text-lg font-bold text-zinc-800 dark:text-white leading-snug tracking-tight">
                    {entry.title}
                </h3>
            )}

            <p className="text-sm text-zinc-500 dark:text-white/55 leading-relaxed whitespace-pre-wrap break-words flex-1">
                {expanded ? entry.content : preview}
                {hasMore && !expanded && <span className="text-zinc-300 dark:text-white/25">…</span>}
            </p>

            {hasMore && (
                <button onClick={() => setExpanded(p => !p)}
                    className="self-start flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700 dark:text-white/35 dark:hover:text-white/70 transition-colors">
                    {expanded ? <><ChevronUp size={12} />Show less</> : <><ChevronDown size={12} />Read more</>}
                </button>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-zinc-100 dark:border-white/[0.07] mt-auto">
                {entry.book
                    ? <div className="flex items-center gap-1.5 min-w-0">
                        <BookOpen size={11} className="text-zinc-300 dark:text-white/25 shrink-0" />
                        <span className="text-[11px] text-zinc-400 dark:text-white/25 truncate italic">{entry.book.title}</span>
                      </div>
                    : <div />}
                {isOwner && (
                    <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => onEdit(entry)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-transparent transition-all
                                text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 hover:border-zinc-200
                                dark:text-white/45 dark:hover:text-white dark:hover:bg-white/10 dark:hover:border-white/10">
                            <Pencil size={11} /> Edit
                        </button>
                        <button onClick={() => onDelete(entry)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-transparent transition-all
                                text-red-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200
                                dark:text-red-400/50 dark:hover:text-red-300 dark:hover:bg-red-500/10 dark:hover:border-red-500/20">
                            <Trash2 size={11} /> Delete
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
}

// ── Modal ─────────────────────────────────────────────────────────
function JournalModal({ open, onClose, editing, books, isDark }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({ title: '', content: '', is_public: false, book_id: '' });

    React.useEffect(() => {
        if (open) setData({ title: editing?.title ?? '', content: editing?.content ?? '', is_public: editing?.is_public ?? false, book_id: editing?.book_id ?? '' });
    }, [open, editing?.id]);

    const submit = (e) => {
        e.preventDefault();
        const opts = { onSuccess: () => { reset(); onClose(); } };
        editing ? put(route('journals.update', editing.id), opts) : post(route('journals.store'), opts);
    };

    // Original dark mode inline styles
    const darkInputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="fade-in absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-md" onClick={onClose} />
            <div
                className="scale-in relative w-full sm:max-w-lg z-10 rounded-t-3xl sm:rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-2xl dark:bg-transparent dark:border-transparent dark:shadow-none"
                style={isDark ? {
                    background: 'linear-gradient(160deg, rgba(28,28,28,0.97) 0%, rgba(8,8,8,0.99) 100%)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(40px)'
                } : undefined}
            >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-white/30" />
                <div className="flex justify-center pt-3 sm:hidden">
                    <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-white/20" />
                </div>
                <div className="p-5 sm:p-7">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
                                {editing ? 'Edit Entry' : 'New Entry'}
                            </h2>
                            <p className="text-xs text-zinc-400 dark:text-white/30 mt-0.5">
                                {editing ? 'Update your thoughts' : 'Capture your reading thoughts'}
                            </p>
                        </div>
                        <button onClick={onClose}
                            className="p-2 rounded-xl border transition-all
                                text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 border-zinc-200
                                dark:text-white/40 dark:hover:text-white dark:hover:bg-white/10 dark:border-white/10">
                            <X size={15} />
                        </button>
                    </div>
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div>
                            <input value={data.title} onChange={e => setData('title', e.target.value)} placeholder="Title (optional)"
                                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all
                                    bg-zinc-50 border border-zinc-200 text-zinc-800 placeholder-zinc-400 focus:ring-2 focus:ring-zinc-300
                                    dark:text-white dark:placeholder-white/25 dark:focus:ring-white/20"
                                style={isDark ? darkInputStyle : undefined} />
                            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <textarea value={data.content} onChange={e => setData('content', e.target.value)}
                                placeholder="What are you thinking about this book…" rows={5} required
                                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all resize-none leading-relaxed
                                    bg-zinc-50 border border-zinc-200 text-zinc-800 placeholder-zinc-400 focus:ring-2 focus:ring-zinc-300
                                    dark:text-white dark:placeholder-white/25 dark:focus:ring-white/20"
                                style={isDark ? darkInputStyle : undefined} />
                            {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
                        </div>
                        {books?.length > 0 && (
                            <select value={data.book_id} onChange={e => setData('book_id', e.target.value)}
                                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all
                                    bg-zinc-50 border border-zinc-200 text-zinc-500 focus:ring-2 focus:ring-zinc-300
                                    dark:text-white/60 dark:focus:ring-white/20"
                                style={isDark ? darkInputStyle : undefined}>
                                <option value="" className="bg-white dark:bg-zinc-900">Link a book (optional)</option>
                                {books.map(b => <option key={b.id} value={b.id} className="bg-white dark:bg-zinc-900">{b.title}</option>)}
                            </select>
                        )}
                        <button type="button" onClick={() => setData('is_public', !data.is_public)}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all text-left border"
                            style={isDark
                                ? (data.is_public
                                    ? { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)' }
                                    : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' })
                                : { borderColor: data.is_public ? '#d4d4d8' : '#e4e4e7', background: data.is_public ? '#f4f4f5' : '#fafafa' }
                            }>
                            <div className={`p-1.5 rounded-lg ${data.is_public ? 'bg-zinc-200 dark:bg-white/10' : 'bg-zinc-100 dark:bg-white/5'}`}>
                                {data.is_public
                                    ? <Globe size={14} className="text-zinc-600 dark:text-white/70" />
                                    : <Lock size={14} className="text-zinc-400 dark:text-white/40" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${data.is_public ? 'text-zinc-800 dark:text-white' : 'text-zinc-400 dark:text-white/50'}`}>
                                    {data.is_public ? 'Public' : 'Private'}
                                </p>
                                <p className="text-[11px] text-zinc-400 dark:text-white/30">
                                    {data.is_public ? 'Everyone can read this entry' : 'Only you can see this entry'}
                                </p>
                            </div>
                            <div className={`w-9 h-5 rounded-full relative transition-all shrink-0 ${data.is_public ? 'bg-zinc-700 dark:bg-white/40' : 'bg-zinc-200 dark:bg-white/10'}`}>
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${data.is_public ? 'left-4' : 'left-0.5'}`} />
                            </div>
                        </button>
                        <div className="flex gap-3 pt-1">
                            <button type="button" onClick={onClose}
                                className="flex-1 py-3 rounded-xl text-sm transition-all
                                    text-zinc-500 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-800
                                    dark:text-white/50 dark:hover:text-white"
                                style={isDark ? { border: '1px solid rgba(255,255,255,0.1)' } : undefined}>
                                Cancel
                            </button>
                            <button type="submit" disabled={processing}
                                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 hover:opacity-90
                                    bg-zinc-900 text-white hover:bg-zinc-700
                                    dark:text-black"
                                style={isDark ? { background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d4 100%)' } : undefined}>
                                {processing ? 'Saving…' : editing ? 'Save changes' : 'Post entry'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// ── Delete Confirm ────────────────────────────────────────────────
function DeleteConfirm({ entry, onClose, isDark }) {
    const { delete: destroy, processing } = useForm();
    if (!entry) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fade-in absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-md" onClick={onClose} />
            <div
                className="scale-in relative w-full max-w-sm z-10 rounded-2xl p-6 text-center overflow-hidden bg-white border border-zinc-200 shadow-2xl dark:bg-transparent dark:border-transparent"
                style={isDark ? {
                    background: 'linear-gradient(160deg, rgba(28,28,28,0.97) 0%, rgba(8,8,8,0.99) 100%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(40px)'
                } : undefined}
            >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-white/20" />
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4
                    bg-red-50 border border-red-200
                    dark:bg-red-500/10 dark:border-red-500/20">
                    <Trash2 size={20} className="text-red-500 dark:text-red-400" />
                </div>
                <h3 className="text-base font-bold text-zinc-800 dark:text-white mb-1">Delete this entry?</h3>
                <p className="text-sm text-zinc-400 dark:text-white/40 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                    <button onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl text-sm transition-all
                            text-zinc-500 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-800
                            dark:text-white/50 dark:hover:text-white"
                        style={isDark ? { border: '1px solid rgba(255,255,255,0.1)' } : undefined}>
                        Cancel
                    </button>
                    <button disabled={processing}
                        onClick={() => destroy(route('journals.destroy', entry.id), { onSuccess: onClose })}
                        className="flex-1 py-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-sm font-semibold text-white transition-all disabled:opacity-50">
                        {processing ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function Journal({ journals, books = [], filter: currentFilter = 'all' }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [isDark, setIsDark] = useState(false);

    // Sync with current theme
    useEffect(() => {
        const check = () => setIsDark(document.documentElement.classList.contains('dark'));
        check();
        const observer = new MutationObserver(check);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const entries = journals?.data ?? [];
    const currentPage = journals?.current_page ?? 1;
    const lastPage = journals?.last_page ?? 1;
    const total = journals?.total ?? 0;
    const perPage = journals?.per_page ?? 6;

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const openCreate = () => { setEditing(null); setModalOpen(true); };
    const openEdit = (e) => { setEditing(e); setModalOpen(true); };

    const filters = ['all', 'public', ...(user ? ['mine'] : [])];
    const filterLabels = { all: 'All', public: 'Public', mine: 'My Entries' };

    const goToPage = (page) => {
        router.get(route('journals.index'), { page, filter: currentFilter }, { preserveScroll: false, preserveState: false });
    };

    const changeFilter = (f) => {
        router.get(route('journals.index'), { page: 1, filter: f }, { preserveScroll: false, preserveState: false });
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:text-white dark:bg-[#080808]"
            style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
            <Head title="Journal" />
            <style>{`
                @keyframes fade-up { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
                .fade-up { animation: fade-up 0.35s cubic-bezier(0.22,1,0.36,1) both; }
                @keyframes fade-in { from { opacity:0; } to { opacity:1; } }
                .fade-in { animation: fade-in 0.25s ease both; }
                @keyframes glow-pulse { 0%,100%{opacity:.4} 50%{opacity:.7} }
                .glow { animation: glow-pulse 6s ease-in-out infinite; }
                @keyframes scale-in { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }
                .scale-in { animation: scale-in 0.3s cubic-bezier(0.22,1,0.36,1) both; }
                .card-hover { transition: transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s ease, border-color 0.2s ease; }
                .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.5); border-color: rgba(255,255,255,0.18) !important; }
                .btn-press { transition: transform 0.15s cubic-bezier(0.22,1,0.36,1), opacity 0.15s ease; }
                .btn-press:hover { opacity: 0.85; }
                .btn-press:active { transform: scale(0.96); }
                .shimmer-line { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); background-size: 200% 100%; }
            `}</style>

            {/* Background */}
            <div aria-hidden className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Light mode */}
                <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full dark:hidden"
                    style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,0.02) 0%, transparent 70%)' }} />
                {/* Dark mode — original */}
                <div className="glow absolute -top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full hidden dark:block"
                    style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full hidden dark:block"
                    style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.02) 0%, transparent 70%)' }} />
            </div>

            <Navbar />

            <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

                {/* Header */}
                <Reveal direction="up" delay={0}>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-400 dark:text-white/25 mb-2 flex items-center gap-2">
                                <BookOpen size={11} /> Reading Journal
                            </p>
                            <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-zinc-900 dark:text-white leading-none">
                                Journal
                            </h1>
                            <p className="text-zinc-400 dark:text-white/30 text-sm mt-2">
                                {total} {total === 1 ? 'entry' : 'entries'}
                            </p>
                        </div>
                        {user && (
                            <button onClick={openCreate}
                                className="btn-press flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold shrink-0
                                    bg-zinc-900 text-white hover:bg-zinc-700
                                    dark:text-black"
                                style={isDark ? { background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)', boxShadow: '0 0 30px rgba(255,255,255,0.1)' } : undefined}>
                                <Plus size={15} /> New Entry
                            </button>
                        )}
                    </div>
                </Reveal>

                {/* Filter tabs */}
                <Reveal direction="up" delay={80}>
                    <div className="flex gap-1 mb-8 p-1 rounded-2xl w-fit
                        bg-zinc-100 border border-zinc-200
                        dark:bg-transparent dark:border-transparent"
                        style={isDark ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' } : undefined}>
                        {filters.map(f => (
                            <button key={f} onClick={() => changeFilter(f)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                                    currentFilter === f
                                        ? 'bg-white border border-zinc-200 text-zinc-800 shadow-sm dark:border-transparent dark:bg-transparent dark:text-white'
                                        : 'border border-transparent text-zinc-400 hover:text-zinc-700 dark:text-white/35'
                                }`}
                                style={isDark && currentFilter === f
                                    ? { background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }
                                    : isDark
                                    ? { color: 'rgba(255,255,255,0.35)', border: '1px solid transparent' }
                                    : undefined}>
                                {filterLabels[f]}
                            </button>
                        ))}
                    </div>
                </Reveal>

                {/* Show Less */}
                {currentPage > 1 && (
                    <Reveal direction="up" delay={0}>
                        <div className="flex justify-center mb-6">
                            <button onClick={() => goToPage(currentPage - 1)}
                                className="btn-press flex items-center gap-2 text-xs font-medium px-5 py-2 rounded-full border transition-all
                                    text-zinc-400 hover:text-zinc-700 border-zinc-200 bg-white
                                    dark:text-white/40 dark:hover:text-white/70 dark:border-transparent dark:bg-transparent"
                                style={isDark ? { border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' } : undefined}>
                                <ChevronUp size={13} /> Show less
                            </button>
                        </div>
                    </Reveal>
                )}

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {entries.length > 0
                        ? entries.map((entry, i) => (
                            <Reveal key={entry.id} direction="up" delay={i * 60}>
                                <JournalCard entry={entry} authUser={user} onEdit={openEdit} onDelete={setDeleting} isDark={isDark} />
                            </Reveal>
                        ))
                        : (
                            <Reveal direction="scale" className="col-span-full">
                                <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
                                    <div className="w-20 h-20 rounded-3xl flex items-center justify-center
                                        bg-zinc-100 border border-zinc-200
                                        dark:bg-transparent dark:border-transparent"
                                        style={isDark ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' } : undefined}>
                                        <BookOpen size={32} className="text-zinc-300 dark:text-white/20" />
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 dark:text-white/60 font-semibold text-lg">No entries yet</p>
                                        <p className="text-zinc-400 dark:text-white/25 text-sm mt-1">
                                            {user ? 'Share your reading thoughts.' : 'Sign in to start your journal.'}
                                        </p>
                                    </div>
                                    {user && (
                                        <button onClick={openCreate}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
                                                bg-zinc-900 text-white hover:bg-zinc-700
                                                dark:text-black"
                                            style={isDark ? { background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d4 100%)' } : undefined}>
                                            <Plus size={14} /> Write your first entry
                                        </button>
                                    )}
                                </div>
                            </Reveal>
                        )}
                </div>

                {/* Show More */}
                {currentPage < lastPage && (
                    <Reveal direction="up" delay={0}>
                        <div className="flex flex-col items-center gap-2 mt-10">
                            <button onClick={() => goToPage(currentPage + 1)}
                                className="btn-press flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium transition-all
                                    text-zinc-500 hover:text-zinc-800 border border-zinc-200 bg-white hover:bg-zinc-50
                                    dark:text-white/60 dark:hover:text-white dark:border-transparent dark:bg-transparent"
                                style={isDark ? { border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' } : undefined}>
                                <ChevronDown size={15} /> Show more
                            </button>
                            <p className="text-[11px] text-zinc-300 dark:text-white/20">
                                {(lastPage - currentPage) * perPage} more entries
                            </p>
                        </div>
                    </Reveal>
                )}
            </main>

            <JournalModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} books={books} isDark={isDark} />
            <DeleteConfirm entry={deleting} onClose={() => setDeleting(null)} isDark={isDark} />
        </div>
    );
}