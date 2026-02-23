import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Clock, Eye, BookOpen, ChevronUp } from 'lucide-react';
import Layout from '@/layouts/Layout';

const COVER_BG = [
    'from-violet-900 to-slate-950',
    'from-amber-900 to-stone-950',
    'from-emerald-900 to-slate-950',
    'from-rose-900 to-slate-950',
    'from-cyan-900 to-slate-950',
    'from-indigo-900 to-slate-950',
];

export default function Read({ story }) {
    const [fontSize, setFontSize] = useState('base');

    const fontMap = { sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl' };

    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    // Convert plain text newlines to paragraphs
    const paragraphs = story.content.split(/\n{2,}/).filter(Boolean);

    return (
        <Layout>
            <Head title={story.title} />

            {/* Ambient cover glow */}
            <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
                <div className={`absolute top-0 inset-x-0 h-[50vh] bg-gradient-to-b ${COVER_BG[story.id % 6]} opacity-20 blur-3xl`} />
            </div>

            <div className="relative pt-16 pb-20 max-w-3xl mx-auto px-4 sm:px-6">

                {/* Back */}
                <Link href="/ebooks" className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-8 mt-6">
                    <ArrowLeft size={13} /> Back to E-Books
                </Link>

                {/* Cover + Meta */}
                <div className="flex flex-col sm:flex-row gap-6 mb-10 p-6 rounded-2xl border border-white/8 bg-white/3">
                    {/* Cover */}
                    <div className="w-full sm:w-36 flex-shrink-0">
                        <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-xl shadow-black/50">
                            {story.cover_url
                                ? <img src={story.cover_url} alt={story.title} className="w-full h-full object-cover" />
                                : <div className={`w-full h-full bg-gradient-to-br ${COVER_BG[story.id % 6]} flex items-center justify-center`}>
                                    <BookOpen size={28} className="text-white/30" />
                                  </div>
                            }
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-between">
                        <div>
                            {story.genre && (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400/80 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20 mb-3 inline-block">
                                    {story.genre}
                                </span>
                            )}
                            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">{story.title}</h1>
                            <p className="text-sm text-white/45 mb-3">by <span className="text-white/60 font-medium">{story.author?.name}</span></p>
                            {story.synopsis && <p className="text-sm text-white/35 leading-relaxed">{story.synopsis}</p>}
                        </div>
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/8">
                            <span className="flex items-center gap-1.5 text-xs text-white/30"><Eye size={12} />{story.views} views</span>
                            <span className="flex items-center gap-1.5 text-xs text-white/30"><Clock size={12} />{story.read_time} min read</span>
                            {story.approved_at && <span className="text-xs text-white/20">{story.approved_at}</span>}
                        </div>
                    </div>
                </div>

                {/* Reading controls */}
                <div className="flex items-center justify-between mb-8 px-1">
                    <p className="text-[11px] text-white/25 uppercase tracking-widest font-semibold">Story</p>
                    <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-lg p-1">
                        {['sm', 'base', 'lg', 'xl'].map(s => (
                            <button key={s} onClick={() => setFontSize(s)}
                                className={`h-6 w-8 rounded text-[10px] font-bold transition-all ${fontSize === s ? 'bg-violet-500 text-white' : 'text-white/30 hover:text-white/60'}`}>
                                {s === 'sm' ? 'A' : s === 'base' ? 'A' : s === 'lg' ? 'A' : 'A'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Story content */}
                <article className={`prose prose-invert max-w-none ${fontMap[fontSize]}`}>
                    <div className="space-y-5">
                        {paragraphs.map((p, i) => (
                            <p key={i} className={`leading-[1.85] text-white/75 ${fontMap[fontSize]}`}
                                style={{ fontFamily: "'Georgia', 'Times New Roman', serif", textIndent: i > 0 ? '1.5em' : '0' }}>
                                {p.trim()}
                            </p>
                        ))}
                    </div>
                </article>

                {/* End of story */}
                <div className="flex flex-col items-center gap-4 mt-16 pt-10 border-t border-white/8">
                    <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <BookOpen size={20} className="text-white/30" />
                    </div>
                    <p className="text-sm text-white/30 font-medium italic">— The End —</p>
                    <p className="text-xs text-white/20">by {story.author?.name}</p>
                    <div className="flex items-center gap-3 mt-2">
                        <button onClick={scrollTop} className="flex items-center gap-1.5 h-8 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-white/40 hover:text-white text-xs transition-all">
                            <ChevronUp size={12} /> Back to top
                        </button>
                        <Link href="/ebooks" className="flex items-center gap-1.5 h-8 px-4 rounded-xl bg-violet-500/15 hover:bg-violet-500 border border-violet-500/25 text-violet-300 hover:text-white text-xs font-semibold transition-all">
                            More Stories
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
