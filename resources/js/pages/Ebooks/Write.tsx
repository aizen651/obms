import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, PenLine, Save, Send, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';
import Layout from '@/layouts/Layout';
import { toast } from 'sonner';

const GENRES = ['Fantasy','Romance','Mystery','Horror','Sci-Fi','Adventure','Drama','Thriller','Historical','Comedy','Other'];

const Field = ({ label, required, error, children }) => (
    <div className="space-y-1.5">
        {label && (
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
        )}
        {children}
        {error && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={10} />{error}</p>}
    </div>
);

export default function Write({ story }) {
    const isEdit = !!story;

    const { data, setData, processing, errors } = useForm({
        title:       story?.title    ?? '',
        genre:       story?.genre    ?? '',
        synopsis:    story?.synopsis ?? '',
        content:     story?.content  ?? '',
        cover_image: null,
        submit:      false,
    });

    const [preview, setPreview] = useState(story?.cover_url ?? null);
    const [wordCount, setWordCount] = useState(() =>
        story?.content ? story.content.trim().split(/\s+/).length : 0
    );

    const handleContent = (v) => {
        setData('content', v);
        setWordCount(v.trim() ? v.trim().split(/\s+/).length : 0);
    };

    const handleCover = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('cover_image', file);
        setPreview(URL.createObjectURL(file));
    };

    const submit = (asDraft) => {
        const url = isEdit ? `/ebooks/${story.id}` : '/ebooks';
        const payload = { ...data, submit: !asDraft, ...(isEdit && { _method: 'PUT' }) };

        router.post(url, payload, {
            forceFormData: true,
            onSuccess: () => toast.success(asDraft ? 'Draft saved!' : 'Submitted for review!'),
            onError: () => toast.error('Please fix the errors below.'),
        });
    };

    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const inputCls = "w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all resize-none";
    const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' };

    return (
        <Layout>
            <Head title={isEdit ? 'Edit Story' : 'Write a Story'} />

            <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[500px] h-[400px] rounded-full blur-[160px]"
                    style={{ background: 'rgba(139,92,246,0.08)' }} />
            </div>

            <div className="relative pt-20 pb-24 max-w-5xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                        <Link href={isEdit ? '/ebooks/my-stories' : '/ebooks'}
                            className="h-9 w-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-all"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                            <ArrowLeft size={15} />
                        </Link>
                        <div>
                            <h1 className="text-lg font-black text-white flex items-center gap-2">
                                <PenLine size={15} className="text-violet-400" />
                                {isEdit ? 'Edit Story' : 'Write a Story'}
                            </h1>
                            <p className="text-[11px] text-white/30">{wordCount} words · ~{readTime} min read</p>
                        </div>
                    </div>

                    {/* Desktop action buttons */}
                    <div className="hidden sm:flex items-center gap-2">
                        <button onClick={() => submit(true)} disabled={processing}
                            className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 text-white/70 hover:text-white"
                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                            <Save size={13} /> Save Draft
                        </button>
                        <button onClick={() => submit(false)} disabled={processing}
                            className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-violet-500 hover:bg-violet-400 text-white text-xs font-semibold transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50 active:scale-95">
                            <Send size={13} /> Submit for Review
                        </button>
                    </div>
                </div>

                {/* Rejection notice */}
                {isEdit && story.status === 'rejected' && (
                    <div className="flex gap-3 p-4 rounded-xl mb-6" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                        <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-red-300">Story Rejected</p>
                            <p className="text-xs text-red-400/70 mt-0.5">{story.rejection_reason}</p>
                            <p className="text-xs text-white/30 mt-1">Fix the issues and re-submit for review.</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-5">

                    {/* ── Main editor ── */}
                    <div className="space-y-5 min-w-0">

                        {/* Title */}
                        <Field error={errors.title}>
                            <input type="text" placeholder="Your story title…"
                                value={data.title} onChange={e => setData('title', e.target.value)}
                                className="w-full bg-transparent border-b pb-3 text-2xl sm:text-3xl font-black text-white placeholder-white/15 focus:outline-none transition-colors"
                                style={{ borderColor: 'rgba(255,255,255,0.12)' }}
                                onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.6)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                            />
                        </Field>

                        {/* Synopsis */}
                        <Field label="Synopsis" error={errors.synopsis}>
                            <textarea value={data.synopsis} onChange={e => setData('synopsis', e.target.value)}
                                placeholder="A brief summary of your story…" rows={2}
                                className={inputCls} style={inputStyle} />
                        </Field>

                        {/* Content */}
                        <Field label="Story Content" required error={errors.content}>
                            <textarea value={data.content} onChange={e => handleContent(e.target.value)}
                                placeholder={"Once upon a time…\n\nUse blank lines to separate paragraphs."}
                                rows={22}
                                className={`${inputCls} leading-relaxed`}
                                style={{ ...inputStyle, fontFamily: "'Georgia', serif", fontSize: '15px', color: 'rgba(255,255,255,0.8)' }}
                            />
                            <p className="text-[10px] text-white/25 text-right">{wordCount} words · min 100 required</p>
                        </Field>
                    </div>

                    {/* ── Sidebar ── */}
                    <div className="space-y-5">

                        {/* Cover image */}
                        <Field label="Cover Image">
                            <label className="block cursor-pointer group">
                                <div className="relative aspect-[3/4] rounded-xl overflow-hidden transition-all"
                                    style={{ border: preview ? '1px solid rgba(255,255,255,0.1)' : '2px dashed rgba(255,255,255,0.12)' }}>
                                    {preview
                                        ? <img src={preview} alt="Cover" className="w-full h-full object-cover" />
                                        : <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/25 group-hover:text-white/50 transition-colors"
                                            style={{ background: 'rgba(255,255,255,0.03)' }}>
                                            <Image size={28} />
                                            <p className="text-[11px] text-center px-2">
                                                Click to upload cover<br />
                                                <span className="text-[10px] text-white/15">JPG, PNG · max 2MB</span>
                                            </p>
                                          </div>
                                    }
                                </div>
                                <input type="file" accept="image/*" className="hidden" onChange={handleCover} />
                            </label>
                            {preview && (
                                <button onClick={() => { setPreview(null); setData('cover_image', null); }}
                                    className="w-full h-7 rounded-lg text-[11px] transition-all text-white/35 hover:text-red-400"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.border = '1px solid rgba(239,68,68,0.2)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; }}>
                                    Remove cover
                                </button>
                            )}
                        </Field>

                        {/* Genre */}
                        <Field label="Genre" error={errors.genre}>
                            <div className="flex flex-wrap gap-1.5">
                                {GENRES.map(g => (
                                    <button key={g} type="button" onClick={() => setData('genre', data.genre === g ? '' : g)}
                                        className="h-6 px-2.5 rounded-full text-[10px] font-semibold border transition-all"
                                        style={data.genre === g
                                            ? { background: '#7c3aed', borderColor: '#8b5cf6', color: 'white' }
                                            : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.45)' }}>
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </Field>

                        {/* Publishing info */}
                        <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">Publishing</p>
                            {[
                                { icon: <Save size={9} className="text-white/40" />, bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', label: 'Save Draft', desc: 'stores privately, not visible to others' },
                                { icon: <Send size={9} className="text-violet-400" />, bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.3)', label: 'Submit', desc: 'sends to admin for review before publishing' },
                                { icon: <CheckCircle size={9} className="text-emerald-400" />, bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', label: 'Approved', desc: 'published and visible to all readers' },
                            ].map(({ icon, bg, border, label, desc }) => (
                                <div key={label} className="flex items-start gap-2 text-[11px] text-white/35">
                                    <div className="h-4 w-4 rounded flex items-center justify-center shrink-0 mt-0.5"
                                        style={{ background: bg, border: `1px solid ${border}` }}>{icon}</div>
                                    <span><strong className="text-white/55">{label}</strong> — {desc}</span>
                                </div>
                            ))}
                        </div>

                        {/* Mobile action buttons */}
                        <div className="flex flex-col gap-2 sm:hidden">
                            <button onClick={() => submit(false)} disabled={processing}
                                className="flex items-center justify-center gap-1.5 h-11 rounded-xl bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50">
                                <Send size={14} /> Submit for Review
                            </button>
                            <button onClick={() => submit(true)} disabled={processing}
                                className="flex items-center justify-center gap-1.5 h-10 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 text-white/70 hover:text-white"
                                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                                <Save size={14} /> Save Draft
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
