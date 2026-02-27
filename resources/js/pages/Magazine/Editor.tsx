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
            className={`cursor-text relative group ${className} ${!value ? 'opacity-40' : ''}`}>
            {value || placeholder}
            <span className="absolute -top-5 right-0 text-[8px] font-sans uppercase tracking-widest text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity select-none">edit</span>
        </Tag>
    );
}

const Ring = ({ children, label }) => (
    <div className="relative group/ring">
        {children}
        <div className="absolute inset-0 rounded-3xl border border-indigo-400/0 group-hover/ring:border-indigo-400/40 transition-all pointer-events-none" />
        {label && <span className="absolute top-2 left-3 text-[8px] font-sans uppercase tracking-widest text-indigo-400/0 group-hover/ring:text-indigo-500/70 transition-all select-none pointer-events-none">{label}</span>}
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
            <img key={image} src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
            {!locked && (
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity z-20 bg-black/40">
                    <button onClick={e => { e.stopPropagation(); ref.current?.click(); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-sans uppercase tracking-widest text-white bg-white/20 border border-white/30">
                        {busy ? 'Uploading…' : <><Upload size={11} /> Replace</>}
                    </button>
                    <button onClick={e => { e.stopPropagation(); onRemove(); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-sans uppercase tracking-widest text-red-200 bg-red-500/20 border border-red-400/30">
                        <ImageOff size={11} /> Remove
                    </button>
                </div>
            )}
            {fileInput}
        </>
    );

    if (locked) return null;
    return (
        <div className="relative z-10 mx-4 mt-4 h-20 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer group/upload border-2 border-dashed border-gray-200 hover:border-indigo-300 bg-gray-50 hover:bg-indigo-50 transition-colors"
            onClick={() => ref.current?.click()}>
            {busy ? <span className="text-[10px] font-sans text-gray-500">Uploading…</span> : <>
                <Upload size={14} className="text-gray-400 group-hover/upload:text-indigo-500 transition-colors" />
                <span className="text-[9px] font-sans uppercase tracking-widest text-gray-400 group-hover/upload:text-indigo-500 transition-colors">Add cover image</span>
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
        try { set('hero_image', await uploadImage(file)); toast.success('Image uploaded!', { id: tid }); }
        catch { toast.error('Image upload failed.', { id: tid }); }
    };

    return (
        <AdminAuthLayout header="Magazine Editor">
            <Head title="Magazine Editor — ECHO Admin" />

            <div className="min-h-screen bg-gray-50 text-gray-900 font-serif pb-32">

                {/* Hint banner */}
                <div className={`rounded-xl px-4 py-2.5 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs font-sans
                    ${locked ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-indigo-50 border border-indigo-200 text-indigo-700'}`}>
                    {locked
                        ? <span className="flex items-center gap-1.5"><Lock size={11} /> Content is locked — unpublish to make changes</span>
                        : <span>✦ Click any text to edit · Click image to upload · Click publish to go live</span>}
                    <span className="opacity-60 text-[10px] uppercase tracking-widest">{locked ? '● Live to users' : '○ Draft — not visible'}</span>
                </div>

                {/* Floating toolbar */}
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-xl rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-xl">
                    <div className="flex items-center gap-3 px-4 pt-3 pb-2 border-b border-gray-100">
                        <span className="text-[9px] font-sans uppercase tracking-widest text-gray-400 shrink-0">Issue</span>
                        <input value={d.issue_number ?? ''} onChange={e => !locked && set('issue_number', e.target.value)} readOnly={locked}
                            className="w-10 bg-transparent text-center text-sm text-gray-800 border-b border-gray-300 focus:outline-none focus:border-indigo-400 read-only:opacity-40 read-only:cursor-not-allowed" placeholder="01" />
                        <input value={d.season ?? ''} onChange={e => !locked && set('season', e.target.value)} readOnly={locked}
                            className="flex-1 min-w-0 bg-transparent text-xs text-gray-500 focus:outline-none focus:text-gray-800 border-b border-gray-200 focus:border-indigo-400 read-only:opacity-40 read-only:cursor-not-allowed" placeholder="WINTER 2026" />
                    </div>
                    <div className="px-4 py-2.5">
                        <button onClick={togglePublish} disabled={saving}
                            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all w-full disabled:opacity-50
                                ${locked ? 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100' : 'bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100'}`}>
                            {saving ? 'Saving…' : locked
                                ? <><Eye size={12} /> Published — click to unpublish &amp; edit</>
                                : <><EyeOff size={12} /> Draft — click to publish</>}
                        </button>
                    </div>
                </div>

                {/* ECHO nav bar */}
                <div className="max-w-7xl mx-auto flex items-center gap-4 sm:gap-8 bg-white border border-gray-200 rounded-2xl px-4 sm:px-6 py-3 mb-8 shadow-sm">
                    <span className="font-sans font-black tracking-tighter text-xl text-gray-900">ECHO.</span>
                    <div className="hidden sm:flex gap-6 text-[10px] uppercase tracking-[0.2em] font-sans text-gray-400">
                        <span>Volumes</span><span>Curations</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto space-y-12">

                    {/* Hero */}
                    <section className="relative">
                        <div className="absolute -top-8 -left-2 text-[6rem] sm:text-[10rem] font-sans font-black text-gray-100 select-none leading-none pointer-events-none">{d.issue_number}</div>
                        <div className="flex flex-col md:flex-row rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
                            <Ring label={locked ? '' : 'Hero text'}>
                                <div className="md:flex-[2] bg-white p-8 sm:p-12 md:p-16">
                                    <EditableText locked={locked} value={d.hero_category} onChange={v => set('hero_category', v)} className="font-sans text-xs uppercase tracking-[0.5em] text-indigo-500 block mb-4" placeholder="Category" />
                                    <div className="text-4xl sm:text-5xl md:text-6xl font-medium leading-[0.95] tracking-tight text-gray-900 mb-6">
                                        <EditableText locked={locked} value={d.hero_title} onChange={v => set('hero_title', v)} tag="span" placeholder="Main Title" className="block" />
                                        <EditableText locked={locked} value={d.hero_subtitle} onChange={v => set('hero_subtitle', v)} tag="span" placeholder="Subtitle (optional)" className="block italic font-light text-gray-400" />
                                    </div>
                                    <EditableText locked={locked} value={d.hero_excerpt} onChange={v => set('hero_excerpt', v)} multiline tag="p" className="text-base text-gray-500 max-w-md leading-relaxed" placeholder="Write a short description…" />
                                </div>
                            </Ring>
                            <div className={`md:flex-1 h-56 sm:h-72 md:h-auto min-h-[220px] relative overflow-hidden border-t md:border-t-0 md:border-l border-gray-200 ${!locked ? 'group/img cursor-pointer' : ''}`}
                                onClick={() => !locked && imgRef.current?.click()}>
                                {d.hero_image
                                    ? <img key={d.hero_image} src={d.hero_image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                    : <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                                        <Book size={40} className="text-indigo-300" />
                                      </div>}
                                {!locked && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all bg-black/40">
                                        <Upload size={24} className="text-white mb-2" />
                                        <span className="text-white text-xs font-sans uppercase tracking-widest">Upload Image</span>
                                    </div>
                                )}
                                <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={uploadHero} />
                            </div>
                        </div>
                    </section>

                    {/* Feature Cards */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        {(d.features ?? []).map((item, i) => (
                            <Ring key={i} label={locked ? '' : `Feature ${i + 1}`}>
                                <div className="group/card relative rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm flex flex-col" style={{ minHeight: '280px' }}>
                                    <CardImageUpload locked={locked} image={item.image} onUpload={url => setFeature(i, 'image', url)} onRemove={() => setFeature(i, 'image', null)} />
                                    <div className="relative z-10 mt-auto p-5 sm:p-6">
                                        {!item.image && !locked && (
                                            <div className="flex gap-2 mb-4">
                                                {ICONS.map(ic => (
                                                    <button key={ic} onClick={() => setFeature(i, 'icon', ic)}
                                                        className={`p-1.5 rounded-lg transition-all ${item.icon === ic ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                                                        {ICON_MAP[ic]}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {!item.image && locked && <div className="mb-4 text-gray-400">{ICON_MAP[item.icon] ?? <Book className="w-5 h-5" />}</div>}
                                        <EditableText locked={locked} value={item.category} onChange={v => setFeature(i, 'category', v)} className="font-sans text-[10px] uppercase tracking-widest text-indigo-500 block mb-1" placeholder="Category" />
                                        <EditableText locked={locked} value={item.title} onChange={v => setFeature(i, 'title', v)} tag="h3" className={`text-xl sm:text-2xl font-semibold ${item.image ? 'text-white' : 'text-gray-900'}`} placeholder="Feature title" />
                                    </div>
                                </div>
                            </Ring>
                        ))}
                    </section>

                    {/* Curations + Quote */}
                    <section className="border-t border-gray-200 pt-10 sm:pt-12">
                        <div className="flex flex-col md:flex-row gap-10 sm:gap-12">
                            <div className="w-full md:w-1/3">
                                <h2 className="text-sm font-sans uppercase tracking-[0.3em] text-gray-400 mb-6">Latest Curations</h2>
                                <div className="space-y-6">
                                    {(d.curations ?? []).map((item, i) => (
                                        <Ring key={i} label="">
                                            <div className="flex gap-4 items-start">
                                                <span className="font-sans text-xs text-gray-300 mt-1 shrink-0">0{i + 1}</span>
                                                <div className="flex-1 border-b border-gray-100 pb-4">
                                                    <EditableText locked={locked} value={item.title} onChange={v => setCuration(i, v)} className="text-lg sm:text-xl text-gray-700 w-full" placeholder="Curation title…" />
                                                </div>
                                            </div>
                                        </Ring>
                                    ))}
                                    {!locked && (
                                        <button onClick={() => set('curations', [...(d.curations ?? []), { title: '' }])} className="flex items-center gap-2 text-xs font-sans text-gray-400 hover:text-indigo-600 transition-colors">
                                            <Plus size={12} /> Add curation
                                        </button>
                                    )}
                                </div>
                            </div>
                            <Ring label={locked ? '' : 'Quote'}>
                                <div className="w-full md:w-2/3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 flex flex-col items-center justify-center text-center">
                                    <EditableText locked={locked} value={d.quote_text} onChange={v => set('quote_text', v)} multiline tag="p"
                                        className="text-2xl sm:text-3xl md:text-4xl italic text-gray-500 max-w-2xl leading-tight" placeholder="Write your issue quote…" />
                                    <div className="mt-8 w-20 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
                                    <EditableText locked={locked} value={d.quote_highlight} onChange={v => set('quote_highlight', v)}
                                        className="mt-4 font-sans text-[10px] uppercase tracking-widest text-indigo-400" placeholder="Highlight word" />
                                </div>
                            </Ring>
                        </div>
                    </section>

                    {/* Book Picks */}
                    <section className="border-t border-gray-200 pt-10 sm:pt-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-sans uppercase tracking-[0.3em] text-gray-400">Book Picks</h2>
                            {!locked && (
                                <button onClick={() => set('book_picks', [...(d.book_picks ?? []), { title: '', author: '' }])} className="flex items-center gap-2 text-xs font-sans text-gray-400 hover:text-indigo-600 transition-colors">
                                    <Plus size={12} /> Add book
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                            {(d.book_picks ?? []).map((b, i) => (
                                <Ring key={i} label={locked ? '' : `Book ${i + 1}`}>
                                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                        <EditableText locked={locked} value={b.title} onChange={v => setBook(i, 'title', v)} className="font-semibold text-sm text-gray-800 mb-1 block" placeholder="Book title" />
                                        <EditableText locked={locked} value={b.author} onChange={v => setBook(i, 'author', v)} className="text-xs text-gray-400 block" placeholder="Author" />
                                    </div>
                                </Ring>
                            ))}
                        </div>
                    </section>
                </div>

                <footer className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-200 text-center font-sans text-[10px] uppercase tracking-[0.4em] text-gray-300">
                    Echo Magazine — Issue No. {d.issue_number} — MMXXVI
                </footer>
            </div>
        </AdminAuthLayout>
    );
}