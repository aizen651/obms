import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, PenLine, Save, Send, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';
import Layout from '@/layouts/Layout';
import { toast } from 'sonner';

const GENRES = ['Fantasy','Romance','Mystery','Horror','Sci-Fi','Adventure','Drama','Thriller','Historical','Comedy','Other'];

const Field = ({ label, required, error, children }) => (
    <div className="space-y-1.5">
        {label && (
            <label className="text-[10px] font-bold uppercase tracking-widest
                text-zinc-400 dark:text-white/40">
                {label} {required && <span className="text-red-400 dark:text-red-400">*</span>}
            </label>
        )}
        {children}
        {error && (
            <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                <AlertCircle size={10} />{error}
            </p>
        )}
    </div>
);

export default function Write({ story }) {
    const isEdit = !!story;

    const { data, setData, post, processing, errors } = useForm({
        title:       story?.title    ?? '',
        genre:       story?.genre    ?? '',
        synopsis:    story?.synopsis ?? '',
        content:     story?.content  ?? '',
        cover_image: null,
        submit:      false,
    });

    const [preview, setPreview]     = useState(story?.cover_url ?? null);
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

    const submit = (asDraft: boolean) => {
        setData('submit', !asDraft);

        const url = isEdit ? `/ebooks/${story.id}` : '/ebooks';

        const options = {
            forceFormData: true,
            onSuccess: () => toast.success(asDraft ? 'Draft saved!' : 'Submitted for review!'),
            onError: (errs) => {
                const messages = Object.values(errs as Record<string, string>).join(', ');
                toast.error(messages || 'Please fix the errors below.');
            },
            ...(isEdit && { _method: 'PUT' }),
        };

        post(url, options);
    };

    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <Layout>
            <Head title={isEdit ? 'Edit Story' : 'Write a Story'} />

            {/* Page background */}
            <div className="fixed inset-0 -z-10
                bg-gradient-to-b from-zinc-100 via-zinc-50 to-white
                dark:from-zinc-950 dark:via-slate-800 dark:to-slate-700" />

            {/* Ambient blob */}
            <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[500px] h-[400px] rounded-full blur-[160px]
                    bg-violet-200/40 dark:bg-violet-500/8" />
            </div>

            <div className="relative pt-20 pb-24 max-w-5xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                        <Link href={isEdit ? '/ebooks/my-stories' : '/ebooks'}
                            className="h-9 w-9 rounded-xl flex items-center justify-center transition-all border
                                bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-400 hover:text-zinc-700
                                dark:bg-white/6 dark:hover:bg-white/10 dark:border-white/12 dark:text-white/50 dark:hover:text-white">
                            <ArrowLeft size={15} />
                        </Link>
                        <div>
                            <h1 className="text-lg font-black flex items-center gap-2
                                text-zinc-900 dark:text-white">
                                <PenLine size={15} className="text-violet-500 dark:text-violet-400" />
                                {isEdit ? 'Edit Story' : 'Write a Story'}
                            </h1>
                            <p className="text-[11px] text-zinc-400 dark:text-white/30">
                                {wordCount} words · ~{readTime} min read
                            </p>
                        </div>
                    </div>

                    {/* Desktop action buttons */}
                    <div className="hidden sm:flex items-center gap-2">
                        <button onClick={() => submit(true)} disabled={processing}
                            className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 border
                                bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-zinc-800
                                dark:bg-white/8 dark:hover:bg-white/15 dark:border-white/15 dark:text-white/70 dark:hover:text-white">
                            <Save size={13} /> Save Draft
                        </button>
                        <button onClick={() => submit(false)} disabled={processing}
                            className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-white text-xs font-semibold transition-all shadow-lg active:scale-95 disabled:opacity-50
                                bg-violet-500 hover:bg-violet-400 shadow-violet-500/20">
                            <Send size={13} /> Submit for Review
                        </button>
                    </div>
                </div>

                {/* Rejection notice */}
                {isEdit && story.status === 'rejected' && (
                    <div className="flex gap-3 p-4 rounded-xl mb-6 border
                        bg-red-50 border-red-200
                        dark:bg-red-500/8 dark:border-red-500/20">
                        <AlertCircle size={16} className="text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-red-600 dark:text-red-300">Story Rejected</p>
                            <p className="text-xs mt-0.5 text-red-500 dark:text-red-400/70">{story.rejection_reason}</p>
                            <p className="text-xs mt-1 text-zinc-400 dark:text-white/30">Fix the issues and re-submit for review.</p>
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
                                className="w-full bg-transparent border-b pb-3 text-2xl sm:text-3xl font-black focus:outline-none transition-colors
                                    text-zinc-900 placeholder-zinc-300 border-zinc-200 focus:border-violet-400
                                    dark:text-white dark:placeholder-white/15 dark:border-white/12 dark:focus:border-violet-500/60"
                            />
                        </Field>

                        {/* Synopsis */}
                        <Field label="Synopsis" error={errors.synopsis}>
                            <textarea value={data.synopsis} onChange={e => setData('synopsis', e.target.value)}
                                placeholder="A brief summary of your story…" rows={2}
                                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all resize-none border
                                    bg-white border-zinc-200 text-zinc-700 placeholder-zinc-300 focus:ring-violet-400/30 focus:border-violet-300
                                    dark:bg-white/6 dark:border-white/12 dark:text-white dark:placeholder-white/25 dark:focus:ring-violet-500/40 dark:focus:border-violet-500/40"
                            />
                        </Field>

                        {/* Content */}
                        <Field label="Story Content" required error={errors.content}>
                            <textarea value={data.content} onChange={e => handleContent(e.target.value)}
                                placeholder={"Once upon a time…\n\nUse blank lines to separate paragraphs."}
                                rows={22}
                                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all resize-none leading-relaxed border
                                    bg-white border-zinc-200 text-zinc-700 placeholder-zinc-300 focus:ring-violet-400/30 focus:border-violet-300
                                    dark:bg-white/6 dark:border-white/12 dark:text-white/80 dark:placeholder-white/25 dark:focus:ring-violet-500/40 dark:focus:border-violet-500/40"
                                style={{ fontFamily: "'Georgia', serif", fontSize: '15px' }}
                            />
                            <p className="text-[10px] text-right text-zinc-300 dark:text-white/25">
                                {wordCount} words · min 100 required
                            </p>
                        </Field>
                    </div>

                    {/* ── Sidebar ── */}
                    <div className="space-y-5">

                        {/* Cover image */}
                        <Field label="Cover Image">
                            <label className="block cursor-pointer group">
                                <div className={`relative aspect-[3/4] rounded-xl overflow-hidden transition-all border
                                    ${preview
                                        ? 'border-zinc-200 dark:border-white/10'
                                        : 'border-dashed border-zinc-300 dark:border-white/12'
                                    }`}>
                                    {preview
                                        ? <img src={preview} alt="Cover" className="w-full h-full object-cover" />
                                        : <div className="w-full h-full flex flex-col items-center justify-center gap-2 transition-colors
                                            bg-zinc-50 group-hover:bg-zinc-100 text-zinc-300 group-hover:text-zinc-400
                                            dark:bg-white/3 dark:group-hover:bg-white/5 dark:text-white/25 dark:group-hover:text-white/50">
                                            <Image size={28} />
                                            <p className="text-[11px] text-center px-2">
                                                Click to upload cover<br />
                                                <span className="text-[10px] text-zinc-300 dark:text-white/15">JPG, PNG · max 2MB</span>
                                            </p>
                                          </div>
                                    }
                                </div>
                                <input type="file" accept="image/*" className="hidden" onChange={handleCover} />
                            </label>
                            {preview && (
                                <button onClick={() => { setPreview(null); setData('cover_image', null); }}
                                    className="w-full h-7 rounded-lg text-[11px] transition-all border
                                        bg-zinc-50 hover:bg-red-50 border-zinc-200 hover:border-red-200 text-zinc-400 hover:text-red-500
                                        dark:bg-white/5 dark:hover:bg-red-500/10 dark:border-white/8 dark:hover:border-red-500/20 dark:text-white/35 dark:hover:text-red-400">
                                    Remove cover
                                </button>
                            )}
                        </Field>

                        {/* Genre */}
                        <Field label="Genre" error={errors.genre}>
                            <div className="flex flex-wrap gap-1.5">
                                {GENRES.map(g => (
                                    <button key={g} type="button" onClick={() => setData('genre', data.genre === g ? '' : g)}
                                        className={`h-6 px-2.5 rounded-full text-[10px] font-semibold border transition-all
                                            ${data.genre === g
                                                ? 'bg-violet-500 border-violet-500 text-white dark:bg-violet-600 dark:border-violet-500'
                                                : 'bg-zinc-100 border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:border-zinc-300 dark:bg-white/5 dark:border-white/12 dark:text-white/45 dark:hover:text-white/70'
                                            }`}>
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </Field>

                        {/* Publishing info */}
                        <div className="rounded-xl p-4 space-y-3 border
                            bg-zinc-50 border-zinc-200
                            dark:bg-white/3 dark:border-white/8">
                            <p className="text-[10px] font-bold uppercase tracking-widest
                                text-zinc-400 dark:text-white/25">
                                Publishing
                            </p>
                            {[
                                {
                                    icon: <Save size={9} />,
                                    iconCls: 'text-zinc-400 dark:text-white/40',
                                    bg: 'bg-zinc-100 border-zinc-200 dark:bg-white/6 dark:border-white/12',
                                    label: 'Save Draft',
                                    desc: 'stores privately, not visible to others'
                                },
                                {
                                    icon: <Send size={9} />,
                                    iconCls: 'text-violet-500 dark:text-violet-400',
                                    bg: 'bg-violet-50 border-violet-200 dark:bg-violet-500/15 dark:border-violet-500/30',
                                    label: 'Submit',
                                    desc: 'sends to admin for review before publishing'
                                },
                                {
                                    icon: <CheckCircle size={9} />,
                                    iconCls: 'text-emerald-500 dark:text-emerald-400',
                                    bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/15 dark:border-emerald-500/30',
                                    label: 'Approved',
                                    desc: 'published and visible to all readers'
                                },
                            ].map(({ icon, iconCls, bg, label, desc }) => (
                                <div key={label} className="flex items-start gap-2 text-[11px]
                                    text-zinc-400 dark:text-white/35">
                                    <div className={`h-4 w-4 rounded flex items-center justify-center shrink-0 mt-0.5 border ${bg}`}>
                                        <span className={iconCls}>{icon}</span>
                                    </div>
                                    <span>
                                        <strong className="text-zinc-600 dark:text-white/55">{label}</strong> — {desc}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Mobile action buttons */}
                        <div className="flex flex-col gap-2 sm:hidden">
                            <button onClick={() => submit(false)} disabled={processing}
                                className="flex items-center justify-center gap-1.5 h-11 rounded-xl text-white text-sm font-semibold transition-all shadow-lg disabled:opacity-50
                                    bg-violet-500 hover:bg-violet-400 shadow-violet-500/20">
                                <Send size={14} /> Submit for Review
                            </button>
                            <button onClick={() => submit(true)} disabled={processing}
                                className="flex items-center justify-center gap-1.5 h-10 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 border
                                    bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-zinc-800
                                    dark:bg-white/8 dark:hover:bg-white/15 dark:border-white/15 dark:text-white/70 dark:hover:text-white">
                                <Save size={14} /> Save Draft
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}