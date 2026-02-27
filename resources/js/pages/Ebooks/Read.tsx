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

    const paragraphs = story.content.split(/\n{2,}/).filter(Boolean);

    return (
        <Layout>
            <Head title={story.title} />

            {/* Page background */}
            <div className="fixed inset-0 -z-10
                bg-gradient-to-b from-zinc-100 via-zinc-50 to-white
                dark:from-zinc-950 dark:via-slate-800 dark:to-slate-700" />

            {/* Ambient cover glow */}
            <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
                {/* Light — soft tinted wash */}
                <div className={`absolute top-0 inset-x-0 h-[50vh] bg-gradient-to-b ${COVER_BG[story.id % 6]} opacity-[0.07] blur-3xl dark:hidden`} />
                {/* Dark — original strong glow */}
                <div className={`absolute top-0 inset-x-0 h-[50vh] bg-gradient-to-b ${COVER_BG[story.id % 6]} opacity-20 blur-3xl hidden dark:block`} />
            </div>

            <div className="relative pt-16 pb-20 max-w-3xl mx-auto px-4 sm:px-6">

                {/* Back */}
                <Link href="/ebooks" className="inline-flex items-center gap-1.5 text-xs transition-colors mb-8 mt-6
                    text-zinc-400 hover:text-zinc-700
                    dark:text-white/40 dark:hover:text-white/70">
                    <ArrowLeft size={13} /> Back to E-Books
                </Link>

                {/* Cover + Meta */}
                <div className="flex flex-col sm:flex-row gap-6 mb-10 p-6 rounded-2xl border
                    bg-white border-zinc-200 shadow-sm shadow-zinc-100
                    dark:bg-white/3 dark:border-white/8 dark:shadow-none">

                    {/* Cover */}
                    <div className="w-full sm:w-36 flex-shrink-0">
                        <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/50">
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
                                <span className="text-[10px] font-bold uppercase tracking-widest mb-3 inline-block px-2 py-0.5 rounded-full border
                                    bg-violet-50 border-violet-200 text-violet-600
                                    dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400/80">
                                    {story.genre}
                                </span>
                            )}
                            <h1 className="text-2xl sm:text-3xl font-black leading-tight mb-2
                                text-zinc-900 dark:text-white">
                                {story.title}
                            </h1>
                            <p className="text-sm mb-3 text-zinc-400 dark:text-white/45">
                                by <span className="font-medium text-zinc-600 dark:text-white/60">{story.author?.name}</span>
                            </p>
                            {story.synopsis && (
                                <p className="text-sm leading-relaxed text-zinc-400 dark:text-white/35">
                                    {story.synopsis}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t
                            border-zinc-100 dark:border-white/8">
                            <span className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-white/30">
                                <Eye size={12} />{story.views} views
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-white/30">
                                <Clock size={12} />{story.read_time} min read
                            </span>
                            {story.approved_at && (
                                <span className="text-xs text-zinc-300 dark:text-white/20">
                                    {story.approved_at}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reading controls */}
                <div className="flex items-center justify-between mb-8 px-1">
                    <p className="text-[11px] uppercase tracking-widest font-semibold
                        text-zinc-300 dark:text-white/25">
                        Story
                    </p>
                    <div className="flex items-center gap-1 rounded-lg p-1 border
                        bg-zinc-100 border-zinc-200
                        dark:bg-white/5 dark:border-white/8">
                        {['sm', 'base', 'lg', 'xl'].map((s, i) => (
                            <button key={s} onClick={() => setFontSize(s)}
                                className={`h-6 w-8 rounded text-[10px] font-bold transition-all
                                    ${fontSize === s
                                        ? 'bg-violet-500 text-white'
                                        : 'text-zinc-400 hover:text-zinc-700 dark:text-white/30 dark:hover:text-white/60'
                                    }`}
                                style={{ fontSize: `${10 + i * 2}px` }}>
                                A
                            </button>
                        ))}
                    </div>
                </div>

                {/* Story content */}
                <article className={`prose max-w-none prose-zinc dark:prose-invert ${fontMap[fontSize]}`}>
                    <div className="space-y-5">
                        {paragraphs.map((p, i) => (
                            <p key={i} className={`leading-[1.85] ${fontMap[fontSize]}
                                text-zinc-600 dark:text-white/75`}
                                style={{ fontFamily: "'Georgia', 'Times New Roman', serif", textIndent: i > 0 ? '1.5em' : '0' }}>
                                {p.trim()}
                            </p>
                        ))}
                    </div>
                </article>

                {/* End of story */}
                <div className="flex flex-col items-center gap-4 mt-16 pt-10 border-t
                    border-zinc-100 dark:border-white/8">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center border
                        bg-zinc-100 border-zinc-200
                        dark:bg-white/5 dark:border-white/10">
                        <BookOpen size={20} className="text-zinc-300 dark:text-white/30" />
                    </div>
                    <p className="text-sm font-medium italic text-zinc-400 dark:text-white/30">— The End —</p>
                    <p className="text-xs text-zinc-300 dark:text-white/20">by {story.author?.name}</p>
                    <div className="flex items-center gap-3 mt-2">
                        <button onClick={scrollTop} className="flex items-center gap-1.5 h-8 px-4 rounded-xl text-xs transition-all border
                            bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-400 hover:text-zinc-700
                            dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/8 dark:text-white/40 dark:hover:text-white">
                            <ChevronUp size={12} /> Back to top
                        </button>
                        <Link href="/ebooks" className="flex items-center gap-1.5 h-8 px-4 rounded-xl text-xs font-semibold transition-all border
                            bg-violet-100 hover:bg-violet-500 border-violet-200 hover:border-transparent text-violet-600 hover:text-white
                            dark:bg-violet-500/15 dark:hover:bg-violet-500 dark:border-violet-500/25 dark:text-violet-300 dark:hover:text-white">
                            More Stories
                        </Link>
                    </div>
                </div>

            </div>
        </Layout>
    );
}