import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BookOpen, Search, Clock, Eye, PenLine, ChevronRight, Sparkles, Filter } from 'lucide-react';
import Layout from '@/layouts/Layout';

const GENRE_COLORS = {
    Fantasy:   'bg-violet-500/15 text-violet-600 border-violet-500/20 dark:text-violet-300',
    Romance:   'bg-rose-500/15 text-rose-600 border-rose-500/20 dark:text-rose-300',
    Mystery:   'bg-amber-500/15 text-amber-600 border-amber-500/20 dark:text-amber-300',
    Horror:    'bg-red-500/15 text-red-600 border-red-500/20 dark:text-red-300',
    'Sci-Fi':  'bg-cyan-500/15 text-cyan-600 border-cyan-500/20 dark:text-cyan-300',
    Adventure: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20 dark:text-emerald-300',
    Drama:     'bg-blue-500/15 text-blue-600 border-blue-500/20 dark:text-blue-300',
    Thriller:  'bg-orange-500/15 text-orange-600 border-orange-500/20 dark:text-orange-300',
};

const genreColor = (g) =>
    GENRE_COLORS[g] ?? 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-white/8 dark:text-white/50 dark:border-white/10';

const COVER_BG = [
    'from-violet-900 to-slate-950 text-violet-200',
    'from-amber-900 to-stone-950 text-amber-200',
    'from-emerald-900 to-slate-950 text-emerald-200',
    'from-rose-900 to-slate-950 text-rose-200',
    'from-cyan-900 to-slate-950 text-cyan-200',
    'from-indigo-900 to-slate-950 text-indigo-200',
];

const StoryCard = ({ story }) => (
    <Link
        href={`/ebooks/${story.slug}`}
        className="group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
            bg-zinc-50 border-zinc-200 hover:bg-white hover:border-zinc-300 hover:shadow-zinc-200/60
            dark:bg-white/3 dark:border-white/8 dark:hover:bg-white/6 dark:hover:border-white/15 dark:hover:shadow-black/30"
    >
        {/* Cover */}
        <div className="relative aspect-[3/4] overflow-hidden flex-shrink-0">
            {story.cover_url
                ? <img src={story.cover_url} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                : <div className={`w-full h-full bg-gradient-to-br ${COVER_BG[story.id % 6]} flex flex-col items-center justify-center p-4 text-center`}>
                    <BookOpen size={28} className="opacity-30 mb-3" />
                    <p className="text-sm font-bold leading-snug opacity-60 line-clamp-3">{story.title}</p>
                  </div>
            }
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Genre badge */}
            {story.genre && (
                <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-sm ${genreColor(story.genre)}`}>
                    {story.genre}
                </span>
            )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-4">
            <h3 className="font-bold text-sm leading-snug line-clamp-2 mb-1 transition-colors
                text-zinc-800 group-hover:text-amber-700
                dark:text-white dark:group-hover:text-amber-100">
                {story.title}
            </h3>
            <p className="text-[11px] mb-2 truncate text-zinc-400 dark:text-white/40">
                by {story.author?.name ?? 'Unknown'}
            </p>
            {story.synopsis && (
                <p className="text-[11px] leading-relaxed line-clamp-2 flex-1 mb-3 text-zinc-400 dark:text-white/30">
                    {story.synopsis}
                </p>
            )}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-100 dark:border-white/6">
                <div className="flex items-center gap-2.5 text-[10px] text-zinc-400 dark:text-white/30">
                    <span className="flex items-center gap-1"><Eye size={10} />{story.views}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{story.read_time}m</span>
                </div>
                <span className="text-[10px] font-medium flex items-center gap-0.5 transition-colors
                    text-amber-600/70 group-hover:text-amber-600
                    dark:text-amber-400/60 dark:group-hover:text-amber-300">
                    Read <ChevronRight size={10} />
                </span>
            </div>
        </div>
    </Link>
);

export default function EBooksIndex({ stories, genres, filters }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters?.search ?? '');
    const [genre, setGenre]   = useState(filters?.genre ?? '');

    const apply = (newFilters) => {
        router.get('/ebooks', newFilters, { preserveState: true, replace: true });
    };

    const handleSearch = (v) => { setSearch(v); apply({ search: v, genre }); };
    const handleGenre  = (v) => { const g = genre === v ? '' : v; setGenre(g); apply({ search, genre: g }); };

    return (
        <Layout>
            <Head title="E-Books" />

            {/* Glows */}
            <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
                {/* Light */}
                <div className="absolute -top-20 left-1/3 w-[600px] h-[400px] bg-violet-200/40 rounded-full blur-[160px] dark:hidden" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-amber-200/30 rounded-full blur-[140px] dark:hidden" />
                {/* Dark */}
                <div className="absolute -top-20 left-1/3 w-[600px] h-[400px] bg-violet-600/8 rounded-full blur-[160px] hidden dark:block" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-amber-500/6 rounded-full blur-[140px] hidden dark:block" />
            </div>

            <div className="relative pt-16 pb-16">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2 flex items-center gap-1.5
                            text-violet-500 dark:text-violet-400/70">
                            <Sparkles size={10} /> Community Stories
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-black leading-none
                            text-zinc-900 dark:text-white">
                            E-<span className="italic text-amber-500/90 dark:text-amber-300/90">Books</span>
                        </h1>
                        <p className="text-sm mt-1.5 text-zinc-400 dark:text-white/30">
                            Stories written by your community
                        </p>
                    </div>

                    {auth?.user && (
                        <div className="flex items-center gap-2 self-start sm:self-end">
                            <Link
                                href="/ebooks/my-stories"
                                className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold transition-all border
                                    bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-500 hover:text-zinc-800
                                    dark:bg-white/8 dark:hover:bg-white/15 dark:border-white/10 dark:text-white/60 dark:hover:text-white"
                            >
                                <BookOpen size={13} /> My Stories
                            </Link>
                            <Link
                                href="/ebooks/create"
                                className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold transition-all active:scale-95 border shadow-lg
                                    bg-violet-100 hover:bg-violet-500 border-violet-300 hover:border-transparent text-violet-600 hover:text-white shadow-violet-100
                                    dark:bg-violet-500/20 dark:hover:bg-violet-500 dark:border-violet-500/30 dark:hover:border-transparent dark:text-violet-300 dark:hover:text-white dark:shadow-violet-500/10"
                            >
                                <PenLine size={13} /> Write a Story
                            </Link>
                        </div>
                    )}
                </div>

                {/* Search + Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none
                            text-zinc-400 dark:text-white/25" />
                        <input
                            type="text"
                            placeholder="Search stories, authors…"
                            value={search}
                            onChange={e => handleSearch(e.target.value)}
                            className="w-full h-10 pl-9 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all
                                bg-zinc-100 border border-zinc-200 text-zinc-800 placeholder-zinc-400
                                focus:ring-violet-400/30 focus:border-violet-300
                                dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-white/25
                                dark:focus:ring-violet-500/40 dark:focus:border-white/20"
                        />
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                        <Filter size={12} className="flex-shrink-0 ml-1 text-zinc-400 dark:text-white/25" />
                        {genres.map(g => (
                            <button
                                key={g}
                                onClick={() => handleGenre(g)}
                                className={`flex-shrink-0 h-8 px-3 rounded-full text-[11px] font-semibold border transition-all ${
                                    genre === g
                                        ? 'bg-violet-500 border-violet-400 text-white shadow-lg shadow-violet-500/20'
                                        : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800 dark:bg-white/5 dark:border-white/10 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white'
                                }`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {stories.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {stories.data.map(s => <StoryCard key={s.id} story={s} />)}
                        </div>

                        {/* Pagination */}
                        {stories.last_page > 1 && (
                            <div className="flex justify-center gap-1 mt-10">
                                {stories.links.slice(1, -1).map((l, i) => (
                                    <button
                                        key={i}
                                        onClick={() => l.url && router.get(l.url)}
                                        className={`min-w-[34px] h-8 px-2 rounded-lg text-xs font-medium transition-all ${
                                            l.active
                                                ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20'
                                                : l.url
                                                    ? 'border text-zinc-500 hover:text-zinc-800 bg-zinc-50 hover:bg-zinc-100 border-zinc-200 dark:bg-white/5 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white dark:border-white/8'
                                                    : 'text-zinc-300 cursor-not-allowed dark:text-white/20'
                                        }`}
                                    >
                                        {l.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4 border
                            bg-zinc-100 border-zinc-200
                            dark:bg-white/5 dark:border-white/8">
                            <BookOpen size={28} className="text-zinc-300 dark:text-white/20" />
                        </div>
                        <p className="font-semibold text-zinc-400 dark:text-white/30">No stories found</p>
                        <p className="text-sm mt-1 text-zinc-300 dark:text-white/20">Be the first to write one!</p>
                        {auth?.user && (
                            <Link
                                href="/ebooks/create"
                                className="mt-5 flex items-center gap-1.5 h-9 px-5 rounded-xl text-xs font-semibold transition-all border
                                    bg-violet-100 hover:bg-violet-500 border-violet-300 text-violet-600 hover:text-white
                                    dark:bg-violet-500/20 dark:hover:bg-violet-500 dark:border-violet-500/30 dark:text-violet-300 dark:hover:text-white"
                            >
                                <PenLine size={12} /> Write a Story
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}