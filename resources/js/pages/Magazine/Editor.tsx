import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { Book, Feather, Globe, Eye, EyeOff, Upload, Plus, ImageOff, Lock } from 'lucide-react';
import { toast } from 'sonner';
import AdminAuthLayout from '@/layouts/AdminAuthLayout';

const ICONS = ['feather', 'globe', 'book'];
const ICON_MAP = { feather: <Feather className="w-5 h-5" />, globe: <Globe className="w-5 h-5" />, book: <Book className="w-5 h-5" /> };
const CSRF = () => decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? '');

const uploadImage = async (file) => {
    const form = new FormData();
    form.append('image', file);
    const res = await fetch(route('admin.magazine.image'), { method: 'POST', headers: { 'X-XSRF-TOKEN': CSRF() }, body: form });
    return (await res.json()).url;
};

function EditableText({ value, onChange, tag: Tag = 'p', multiline, placeholder = 'Click to edit…', className = '', locked }) {
    const [editing, setEditing] = useState(false);
    const ref = useRef(null);
    const base = `bg-transparent outline-none w-full resize-none ${className}`;
    if (locked) return <Tag className={`${className} ${!value ? 'opacity-30' : ''}`}>{value || placeholder}</Tag>;
    if (editing) return multiline
        ? <textarea ref={ref} value={value ?? ''} onChange={e => onChange(e.target.value)} onBlur={() => setEditing(false)} rows={3} placeholder={placeholder} className={base} />
        : <input ref={ref} value={value ?? ''} onChange={e => onChange(e.target.value)} onBlur={() => setEditing(false)} placeholder={placeholder} className={base} />;
    return (
        <Tag onClick={() => { setEditing(true); setTimeout(() => ref.current?.focus(), 0); }}
            className={`cursor-text relative group ${className} ${!value ? 'opacity-30' : ''}`}>
            {value || placeholder}
            <span className="absolute -top-5 right-0 text-[8px] font-sans uppercase tracking-widest text-amber-400/60 opacity-0 group-hover:opacity-100 transition-opacity select-none">edit</span>
        </Tag>
    );
}

const Ring = ({ children, label }) => (
    <div className="relative group/ring">
        {children}
        <div className="absolute inset-0 rounded-3xl border border-amber-400/0 group-hover/ring:border-amber-400/40 transition-all pointer-events-none" />
        {label && <span className="absolute top-2 left-3 text-[8px] font-sans uppercase tracking-widest text-amber-400/0 group-hover/ring:text-amber-400/60 transition-all select-none pointer-events-none">{label}</span>}
    </div>
);

function CardImageUpload({ image, onUpload, onRemove, locked }) {
    const [busy, setBusy] = useState(false);
    const ref = useRef(null);
    const upload = async (e) => {
        const file = e.target.files?.[0]; if (!file) return;
        setBusy(true);
        try { onUpload(await uploadImage(file)); } finally { setBusy(false); e.target.value = ''; }
    };
    const fileInput = <input ref={ref} type="file" accept="image/*" className="hidden" onChange={upload} />;

    if (image) return (
        <>
            <img key={image} src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
            {!locked && (
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity z-20" style={{ background: 'rgba(0,0,0,0.45)' }}>
                    <button onClick={e => { e.stopPropagation(); ref.current?.click(); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-sans uppercase tracking-widest text-white" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
                        {busy ? 'Uploading…' : <><Upload size={11} /> Replace</>}
                    </button>
                    <button onClick={e => { e.stopPropagation(); onRemove(); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-sans uppercase tracking-widest text-red-300" style={{ background: 'rgba(255,0,0,0.12)', border: '1px solid rgba(255,80,80,0.25)' }}>
                        <ImageOff size={11} /> Remove
                    </button>
                </div>
            )}
            {fileInput}
        </>
    );

    if (locked) return null;
    return (
        <div className="relative z-10 mx-4 mt-4 h-20 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer group/upload"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.12)' }}
            onClick={() => ref.current?.click()}>
            {busy ? <span className="text-[10px] font-sans text-white">Uploading…</span> : <>
                <Upload size={14} className="text-zinc-600 group-hover/upload:text-zinc-300 transition-colors" />
                <span className="text-[9px] font-sans uppercase tracking-widest text-zinc-600 group-hover/upload:text-zinc-300 transition-colors">Add cover image</span>
            </>}
            {fileInput}
        </div>
    );
}

export default function MagazineEditor({ issue: initial }) {
    const [d, setD] = useState(initial);
    const [saving, setSaving] = useState(false);
    const imgRef = useRef(null);
    const locked = d.is_published;

    const set = (k, v) => setD(p => ({ ...p, [k]: v }));
    const setFeature = (i, k, v) => { const a = [...(d.features ?? [])]; a[i] = { ...a[i], [k]: v }; set('features', a); };
    const setCuration = (i, v) => { const a = [...(d.curations ?? [])]; a[i] = { ...a[i], title: v }; set('curations', a); };
    const setBook = (i, k, v) => { const a = [...(d.book_picks ?? [])]; a[i] = { ...a[i], [k]: v }; set('book_picks', a); };

    const togglePublish = () => {
        const next = !d.is_published;
        setD(p => ({ ...p, is_published: next }));
        setSaving(true);
        const tid = toast.loading(next ? 'Publishing…' : 'Unpublishing…');
        router.post(route('admin.magazine.save'), { ...d, is_published: next }, {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => toast.success(next ? 'Published! Live to users.' : 'Unpublished. Back to draft.', { id: tid }),
            onError: () => { setD(p => ({ ...p, is_published: !next })); toast.error('Something went wrong.', { id: tid }); },
            onFinish: () => setSaving(false),
        });
    };

    const uploadHero = async (e) => {
        if (locked) return;
        const file = e.target.files?.[0]; if (!file) return;
        const tid = toast.loading('Uploading image…');
        try {
            set('hero_image', await uploadImage(file));
            toast.success('Image uploaded!', { id: tid });
        } catch { toast.error('Image upload failed.', { id: tid }); }
    };

    return (
      <>
      <AdminAuthLayout>
        <div className="min-h-screen bg-[#030303] text-zinc-200 font-serif">
            <Head title="Magazine Editor — ECHO Admin" />

            {/* Background blobs */}
            <div aria-hidden className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-[10%] -right-[5%] w-[min(700px,80vw)] h-[min(700px,80vw)] bg-white/[0.07] rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] -left-[10%] w-[min(500px,60vw)] h-[min(500px,60vw)] bg-zinc-800/20 rounded-full blur-[100px]" />
            </div>

            {/* Floating toolbar */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-xl rounded-2xl overflow-hidden"
                style={{ background: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)' }}>
                <div className="flex items-center gap-3 px-4 pt-3 pb-2 border-b border-white/[0.06]">
                    <span className="text-[9px] font-sans uppercase tracking-widest text-zinc-600 shrink-0">Issue</span>
                    <input value={d.issue_number ?? ''} onChange={e => !locked && set('issue_number', e.target.value)} readOnly={locked}
                        className="w-10 bg-transparent text-center text-sm text-white border-b border-white/20 focus:outline-none focus:border-white/60 read-only:opacity-40 read-only:cursor-not-allowed" placeholder="01" />
                    <input value={d.season ?? ''} onChange={e => !locked && set('season', e.target.value)} readOnly={locked}
                        className="flex-1 min-w-0 bg-transparent text-xs text-zinc-400 focus:outline-none focus:text-white border-b border-white/10 focus:border-white/40 read-only:opacity-40 read-only:cursor-not-allowed" placeholder="WINTER 2026" />
                </div>
                <div className="px-4 py-2.5">
                    <button onClick={togglePublish} disabled={saving}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all w-full disabled:opacity-50"
                        style={locked
                            ? { background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', color: '#6ee7b7' }
                            : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                        {saving ? 'Saving…' : locked
                            ? <><Eye size={12} /> Published — click to unpublish &amp; edit</>
                            : <><EyeOff size={12} /> Draft — click to publish</>}
                    </button>
                </div>
            </div>

            {/* Hint banner + nav */}
            <div className="relative z-50 pt-20 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto mb-4 rounded-xl px-4 py-2.5"
                    style={{ background: locked ? 'rgba(52,211,153,0.04)' : 'rgba(251,191,36,0.06)', border: locked ? '1px solid rgba(52,211,153,0.15)' : '1px solid rgba(251,191,36,0.15)' }}>
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between text-[9px] font-sans uppercase tracking-widest"
                        style={{ color: locked ? 'rgba(52,211,153,0.7)' : 'rgba(251,191,36,0.7)' }}>
                        {locked
                            ? <span><Lock size={9} className="inline mr-1" />Content is locked — unpublish to make changes</span>
                            : <span>✦ Click any text to edit · Click image to upload · Click publish to go live</span>}
                        <span style={{ opacity: 0.5 }}>{locked ? '● Live to users' : '○ Draft — not visible'}</span>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto flex items-center gap-4 sm:gap-8 backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl px-4 sm:px-6 py-3">
                    <span className="font-sans font-bold tracking-tighter text-xl">ECHO.</span>
                    <div className="hidden sm:flex gap-6 text-[10px] uppercase tracking-[0.2em] font-sans text-zinc-500">
                        <span>Volumes</span><span>Curations</span>
                    </div>
                </div>
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-40">

                {/* Hero */}
                <section className="relative mb-16 sm:mb-32">
                    <div className="absolute -top-16 sm:-top-20 -left-2 sm:-left-4 text-[8rem] sm:text-[15rem] font-sans font-bold text-white/[0.02] select-none leading-none pointer-events-none">{d.issue_number}</div>
                    <div className="flex flex-col md:flex-row">
                        {/* Text panel — grows to fill available space */}
                        <Ring label={locked ? '' : 'Hero text'}>
                            <div className="md:flex-[2] backdrop-blur-2xl bg-white/[0.03] border border-white/10 p-8 sm:p-12 md:p-16 rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl shadow-2xl">
                                <EditableText locked={locked} value={d.hero_category} onChange={v => set('hero_category', v)} className="font-sans text-xs uppercase tracking-[0.5em] text-zinc-500 block mb-4 sm:mb-6" placeholder="Category" />
                                <div className="text-4xl sm:text-6xl md:text-7xl font-medium leading-[0.9] tracking-tighter text-white mb-6 sm:mb-8">
                                    <EditableText locked={locked} value={d.hero_title} onChange={v => set('hero_title', v)} tag="span" placeholder="Main Title" className="block" />
                                    <EditableText locked={locked} value={d.hero_subtitle} onChange={v => set('hero_subtitle', v)} tag="span" placeholder="Subtitle (optional)" className="block italic font-light text-zinc-400" />
                                </div>
                                <EditableText locked={locked} value={d.hero_excerpt} onChange={v => set('hero_excerpt', v)} multiline tag="p" className="text-base sm:text-lg text-zinc-400 max-w-md leading-relaxed" placeholder="Write a short description…" />
                            </div>
                        </Ring>
                        {/* Image panel — fixed width on desktop, natural height on mobile */}
                        <div className={`md:flex-1 h-56 sm:h-72 md:h-auto min-h-[200px] relative overflow-hidden rounded-b-3xl md:rounded-bl-none md:rounded-r-3xl border border-white/10 border-t-0 md:border-t md:border-l-0 ${!locked ? 'group/img cursor-pointer' : ''}`}
                            onClick={() => !locked && imgRef.current?.click()}>
                            {d.hero_image
                                ? <img key={d.hero_image} src={d.hero_image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                : <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />}
                            <div className="absolute inset-0 bg-white/5" />
                            {!locked && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all" style={{ background: 'rgba(0,0,0,0.6)' }}>
                                    <Upload size={24} className="text-white mb-2" />
                                    <span className="text-white text-xs font-sans uppercase tracking-widest">Replace Image</span>
                                </div>
                            )}
                            <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={uploadHero} />
                        </div>
                    </div>
                </section>

                {/* Feature Cards */}
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-32">
                    {(d.features ?? []).map((item, i) => (
                        <Ring key={i} label={locked ? '' : `Feature ${i + 1}`}>
                            <div className="group/card relative rounded-3xl overflow-hidden border border-white/10 flex flex-col"
                                style={{ minHeight: '280px', background: 'linear-gradient(135deg,rgba(255,255,255,0.05) 0%,transparent 100%)' }}>
                                <CardImageUpload locked={locked} image={item.image} onUpload={url => setFeature(i, 'image', url)} onRemove={() => setFeature(i, 'image', null)} />
                                <div className="relative z-10 mt-auto p-5 sm:p-6">
                                    {!item.image && !locked && (
                                        <div className="flex gap-2 mb-4">
                                            {ICONS.map(ic => (
                                                <button key={ic} onClick={() => setFeature(i, 'icon', ic)} className="p-1.5 rounded-lg transition-all"
                                                    style={item.icon === ic ? { background: 'rgba(255,255,255,0.15)', color: 'white' } : { background: 'rgba(255,255,255,0.03)', color: '#52525b' }}>
                                                    {ICON_MAP[ic]}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {!item.image && locked && <div className="mb-4 text-zinc-500">{ICON_MAP[item.icon] ?? <Book className="w-5 h-5" />}</div>}
                                    <EditableText locked={locked} value={item.category} onChange={v => setFeature(i, 'category', v)} className="font-sans text-[10px] uppercase tracking-widest text-zinc-400 block mb-1" placeholder="Category" />
                                    <EditableText locked={locked} value={item.title} onChange={v => setFeature(i, 'title', v)} tag="h3" className="text-xl sm:text-2xl font-normal text-white" placeholder="Feature title" />
                                </div>
                            </div>
                        </Ring>
                    ))}
                </section>

                {/* Curations + Quote */}
                <section className="border-t border-white/10 pt-10 sm:pt-12">
                    <div className="flex flex-col md:flex-row gap-10 sm:gap-12">
                        <div className="w-full md:w-1/3">
                            <h2 className="text-sm font-sans uppercase tracking-[0.3em] text-zinc-500 mb-6 sm:mb-8">Latest Curations</h2>
                            <div className="space-y-6 sm:space-y-8">
                                {(d.curations ?? []).map((item, i) => (
                                    <Ring key={i} label="">
                                        <div className="flex gap-4 items-start">
                                            <span className="font-sans text-xs text-zinc-700 mt-1 shrink-0">0{i + 1}</span>
                                            <div className="flex-1 border-b border-white/5 pb-4">
                                                <EditableText locked={locked} value={item.title} onChange={v => setCuration(i, v)} className="text-lg sm:text-xl text-zinc-200 w-full" placeholder="Curation title…" />
                                            </div>
                                        </div>
                                    </Ring>
                                ))}
                                {!locked && (
                                    <button onClick={() => set('curations', [...(d.curations ?? []), { title: '' }])} className="flex items-center gap-2 text-xs font-sans text-zinc-700 hover:text-zinc-400 transition-colors">
                                        <Plus size={12} /> Add curation
                                    </button>
                                )}
                            </div>
                        </div>
                        <Ring label={locked ? '' : 'Quote'}>
                            <div className="w-full md:w-2/3 backdrop-blur-3xl bg-white/[0.01] border border-white/5 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 flex flex-col items-center justify-center text-center">
                                <EditableText locked={locked} value={d.quote_text} onChange={v => set('quote_text', v)} multiline tag="p"
                                    className="text-2xl sm:text-3xl md:text-4xl italic text-zinc-500 max-w-2xl leading-tight" placeholder="Write your issue quote…" />
                                <div className="mt-8 sm:mt-12 w-20 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                <EditableText locked={locked} value={d.quote_highlight} onChange={v => set('quote_highlight', v)}
                                    className="mt-4 font-sans text-[10px] uppercase tracking-widest text-zinc-600" placeholder="Highlight word" />
                            </div>
                        </Ring>
                    </div>
                </section>

                {/* Book Picks */}
                <section className="mt-16 sm:mt-24 border-t border-white/10 pt-10 sm:pt-12">
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <h2 className="text-sm font-sans uppercase tracking-[0.3em] text-zinc-500">Book Picks</h2>
                        {!locked && (
                            <button onClick={() => set('book_picks', [...(d.book_picks ?? []), { title: '', author: '' }])} className="flex items-center gap-2 text-xs font-sans text-zinc-700 hover:text-zinc-400 transition-colors">
                                <Plus size={12} /> Add book
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        {(d.book_picks ?? []).map((b, i) => (
                            <Ring key={i} label={locked ? '' : `Book ${i + 1}`}>
                                <div className="p-4 sm:p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                    <EditableText locked={locked} value={b.title} onChange={v => setBook(i, 'title', v)} className="font-semibold text-sm text-slate-200 mb-1 block" placeholder="Book title" />
                                    <EditableText locked={locked} value={b.author} onChange={v => setBook(i, 'author', v)} className="text-xs text-zinc-500 block" placeholder="Author" />
                                </div>
                            </Ring>
                        ))}
                    </div>
                </section>

            </main>

            <footer className="relative z-10 py-12 sm:py-20 text-center font-sans text-[10px] uppercase tracking-[0.4em] text-zinc-600">
                Echo Magazine — Issue No. {d.issue_number} — MMXXVI
            </footer>
        </div>
      </AdminAuthLayout>
      </>
    );
}