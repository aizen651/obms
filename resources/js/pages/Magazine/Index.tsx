import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Search, ArrowUpRight, Book, Feather, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';

const ICON_MAP = {
    feather: <Feather className="w-5 h-5" />,
    globe: <Globe className="w-5 h-5" />,
    book: <Book className="w-5 h-5" />,
};

const FALLBACK = {
    issue_number: '01', hero_category: 'Editorial Feature',
    hero_title: 'The Haptic Archive.', hero_subtitle: null,
    hero_excerpt: 'Exploring the translucency of digital thought through the lens of modern glassmorphism.',
    hero_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200',
    quote_text: 'Design is the transparent medium through which we perceive the archive.',
    quote_highlight: 'transparent',
    features: [
        { title: 'Luminescent Text', category: 'Typography', icon: 'feather', image: null },
        { title: 'The Borderless Web', category: 'Interface', icon: 'globe', image: null },
        { title: 'Static & Noise', category: 'Medium', icon: 'book', image: null },
    ],
    curations: [
        { title: 'The influence of Brutalist shadows.' },
        { title: 'On whitespace as a design language.' },
        { title: 'When the grid breaks: a case study.' },
    ],
    book_picks: [],
};

function Reveal({ children, delay = 0, slide = 'up', className = '' }) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const tx = slide === 'left' ? 'translateX(-20px)' : slide === 'right' ? 'translateX(20px)' : 'translateY(20px)';
        el.style.cssText = `opacity:0;transform:${tx}`;
        const show = () => { el.style.cssText = `transition:opacity 1s ${delay}ms cubic-bezier(.25,.46,.45,.94),transform 1s ${delay}ms cubic-bezier(.25,.46,.45,.94);opacity:1;transform:none`; };
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { show(); obs.disconnect(); } }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
        el.getBoundingClientRect().top < window.innerHeight ? setTimeout(show, delay) : obs.observe(el);
        return () => obs.disconnect();
    }, [delay, slide]);
    return <div ref={ref} className={className}>{children}</div>;
}

export default function MagazineIndex({ issue: serverIssue = null }) {
    const { auth } = usePage().props;
    const [issue, setIssue] = useState(serverIssue);
    const d = issue ?? FALLBACK;

    const poll = useCallback(async () => {
        try {
            const res = await fetch(route('magazine.data'), { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } });
            if (!res.ok) return;
            const data = await res.json();
            setIssue(prev => (!prev && !data) || (prev?.updated_at === data?.updated_at) ? prev : data);
        } catch { /* ignore */ }
    }, []);

    useEffect(() => { const id = setInterval(poll, 5000); return () => clearInterval(id); }, [poll]);

    const parts = d.quote_text && d.quote_highlight
        ? d.quote_text.split(new RegExp(`(${d.quote_highlight})`, 'i')) : [d.quote_text ?? ''];

    return (
        <div className="min-h-screen bg-[#030303] text-zinc-200 font-serif selection:bg-white selection:text-black">
            <Head title="ECHO Magazine" />
            <style>{`
                @keyframes float-a{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(24px,-16px) scale(1.04)}}
                @keyframes float-b{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-16px,24px) scale(1.06)}}
                .blob-a{animation:float-a 14s ease-in-out infinite}.blob-b{animation:float-b 18s ease-in-out infinite}
                @keyframes shimmer{0%,100%{opacity:.015}50%{opacity:.04}}.num-shimmer{animation:shimmer 6s ease-in-out infinite}
                @keyframes img-zoom{from{transform:scale(1.06);opacity:0}to{transform:scale(1);opacity:1}}.img-zoom{animation:img-zoom 1.6s .3s cubic-bezier(.25,.46,.45,.94) both}
                @keyframes line-grow{from{width:0}to{width:5rem}}.line-grow{animation:line-grow 1.2s .8s cubic-bezier(.25,.46,.45,.94) both}
                @keyframes soft-glow{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 20px 2px rgba(255,255,255,.05)}}.btn-glow{animation:soft-glow 4s ease-in-out infinite}
                .card-img{transition:transform .7s cubic-bezier(.25,.46,.45,.94),opacity .5s ease}
                .card-wrap:hover .card-img{transform:scale(1.04);opacity:.8}
            `}</style>
            <Navbar />

            {/* Background blobs */}
            <div aria-hidden className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="blob-a absolute -top-[10%] -right-[5%] w-[min(700px,80vw)] h-[min(700px,80vw)] bg-white/[0.07] rounded-full blur-[120px]" />
                <div className="blob-b absolute bottom-[10%] -left-[10%] w-[min(500px,60vw)] h-[min(500px,60vw)] bg-zinc-800/20 rounded-full blur-[100px]" />
            </div>

            {/* Nav bar */}
            <Reveal className="relative z-50 pt-20 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl px-4 sm:px-6 py-3">
                    <div className="flex items-center gap-4 sm:gap-8">
                        <span className="font-sans font-bold tracking-tighter text-xl">ECHO.</span>
                        <div className="hidden sm:flex gap-6 text-[10px] uppercase tracking-[0.2em] font-sans text-zinc-500">
                            <a href="#features" className="hover:text-white transition-colors duration-300">Volumes</a>
                            <a href="#curations" className="hover:text-white transition-colors duration-300">Curations</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-4 w-px bg-white/10 hidden sm:block" />
                        <Search className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-white transition-colors duration-300" />
                    </div>
                </div>
            </Reveal>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {!issue && (
                    <Reveal delay={80}>
                        <div className="mb-8 text-center py-3 rounded-2xl text-xs font-sans uppercase tracking-widest text-zinc-600"
                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            Preview — No issue published yet
                        </div>
                    </Reveal>
                )}

                {/* Hero */}
                <section className="relative mb-16 sm:mb-32">
                    <div className="num-shimmer absolute -top-16 sm:-top-20 -left-2 sm:-left-4 text-[8rem] sm:text-[15rem] font-sans font-bold text-white/[0.02] select-none leading-none pointer-events-none">{d.issue_number}</div>
                    {/* Stack on mobile, side-by-side on md+ */}
                    <div className="flex flex-col md:grid md:grid-cols-12">
                        <Reveal delay={100} slide="left" className="md:col-span-8">
                            <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 p-8 sm:p-14 md:p-20 rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl shadow-2xl">
                                <Reveal delay={200}><span className="font-sans text-xs uppercase tracking-[0.5em] text-zinc-500 block mb-4 sm:mb-6">{d.hero_category}</span></Reveal>
                                <Reveal delay={300}>
                                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-medium leading-[0.9] tracking-tighter text-white mb-6 sm:mb-8">
                                        {d.hero_title}
                                        {d.hero_subtitle && <><br /><span className="italic font-light text-zinc-400">{d.hero_subtitle}</span></>}
                                    </h1>
                                </Reveal>
                                <Reveal delay={420}><p className="text-base sm:text-xl text-zinc-400 max-w-md leading-relaxed">{d.hero_excerpt}</p></Reveal>
                                <Reveal delay={540}>
                                    <div className="mt-8 sm:mt-12">
                                        <button className="btn-glow group flex items-center gap-3 font-sans text-xs uppercase tracking-widest border border-white/20 px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white hover:text-black transition-all duration-500">
                                            Read Issue <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
                                        </button>
                                    </div>
                                </Reveal>
                            </div>
                        </Reveal>
                        <Reveal delay={200} slide="right" className="md:col-span-4">
                            <div className="h-56 sm:h-80 md:h-full relative overflow-hidden rounded-b-3xl md:rounded-bl-none md:rounded-r-3xl border border-white/10 md:border-l-0">
                                {d.hero_image
                                    ? <img key={d.hero_image} src={d.hero_image} alt={d.hero_title ?? ''} className="img-zoom w-full h-full object-cover opacity-60" />
                                    : <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950" />}
                                <div className="absolute inset-0 bg-white/5" />
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* Feature Cards */}
                {d.features?.length > 0 && (
                    <section id="features" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-32">
                        {d.features.map((item, i) => (
                            <Reveal key={i} delay={i * 100}>
                                <div className="card-wrap group relative rounded-3xl overflow-hidden border border-white/10 hover:border-white/25 hover:-translate-y-1.5 transition-all duration-700 flex flex-col"
                                    style={{ minHeight: '280px', background: 'linear-gradient(135deg,rgba(255,255,255,.05) 0%,transparent 100%)' }}>
                                    {item.image && (
                                        <>
                                            <img key={item.image} src={item.image} alt={item.title} className="card-img absolute inset-0 w-full h-full object-cover opacity-50" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                                        </>
                                    )}
                                    <div className="relative z-10 mt-auto p-5 sm:p-6">
                                        {!item.image && (
                                            <div className="mb-4 text-zinc-500 group-hover:text-white transition-colors duration-500">
                                                {ICON_MAP[item.icon] ?? <Book className="w-5 h-5" />}
                                            </div>
                                        )}
                                        <span className="font-sans text-[10px] uppercase tracking-widest text-zinc-400 block mb-1 group-hover:text-zinc-300 transition-colors duration-500">{item.category}</span>
                                        <h3 className="text-xl sm:text-2xl font-normal text-white group-hover:translate-x-1.5 transition-transform duration-500">{item.title}</h3>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </section>
                )}

                {/* Curations + Quote */}
                <section id="curations" className="border-t border-white/10 pt-10 sm:pt-12">
                    <div className="flex flex-col md:flex-row gap-10 sm:gap-12">
                        <Reveal delay={100} slide="left" className="w-full md:w-1/3">
                            <h2 className="text-sm font-sans uppercase tracking-[0.3em] text-zinc-500 mb-6 sm:mb-8">Latest Curations</h2>
                            <div className="space-y-8 sm:space-y-12">
                                {d.curations?.map((item, i) => (
                                    <Reveal key={i} delay={200 + i * 100} slide="left">
                                        <div className="flex gap-6 items-start group">
                                            <span className="font-sans text-xs text-zinc-700 mt-1 shrink-0">0{i + 1}</span>
                                            <p className="text-lg sm:text-xl border-b border-white/5 pb-4 group-hover:border-white/30 transition-colors duration-500 flex-1">{item.title}</p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </Reveal>
                        {d.quote_text && (
                            <Reveal delay={150} slide="right" className="w-full md:w-2/3">
                                <div className="backdrop-blur-3xl bg-white/[0.01] border border-white/5 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 flex flex-col items-center justify-center text-center">
                                    <p className="text-2xl sm:text-4xl md:text-5xl italic text-zinc-500 max-w-2xl leading-tight">
                                        {parts.map((part, i) =>
                                            part.toLowerCase() === d.quote_highlight?.toLowerCase()
                                                ? <span key={i} className="text-white">{part}</span> : part
                                        )}
                                    </p>
                                    <div className="mt-10 sm:mt-12 h-px line-grow bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                </div>
                            </Reveal>
                        )}
                    </div>
                </section>

                {/* Book Picks */}
                {d.book_picks?.length > 0 && (
                    <section className="mt-16 sm:mt-24">
                        <Reveal><h2 className="text-sm font-sans uppercase tracking-[0.3em] text-zinc-500 mb-6 sm:mb-8">Issue Book Picks</h2></Reveal>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                            {d.book_picks.map((b, i) => (
                                <Reveal key={i} delay={i * 60}>
                                    <div className="p-4 sm:p-5 rounded-2xl hover:-translate-y-1 transition-transform duration-500"
                                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                        <p className="font-semibold text-sm text-slate-200 mb-1">{b.title}</p>
                                        <p className="text-xs text-zinc-500">{b.author}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </section>
                )}

                {/* CTA */}
                {!auth?.user && (
                    <Reveal className="mt-16 sm:mt-24">
                        <section className="rounded-3xl backdrop-blur-xl bg-white/[0.02] border border-white/10 p-8 sm:p-16 text-center">
                            <Reveal delay={100}>
                                <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-4">ECHO Magazine</p>
                                <h2 className="text-3xl sm:text-5xl font-medium tracking-tighter text-white mb-4">Have something to say?</h2>
                                <p className="text-zinc-500 max-w-md mx-auto mb-8 leading-relaxed">Create an account to stay updated with every issue.</p>
                            </Reveal>
                            <Reveal delay={200}>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                                    <Link href={route('register')} className="w-full sm:w-auto text-center font-sans text-xs uppercase tracking-widest bg-white text-black px-8 py-4 rounded-full hover:bg-zinc-100 transition-all duration-300">Create account</Link>
                                    <Link href={route('login')} className="w-full sm:w-auto text-center font-sans text-xs uppercase tracking-widest border border-white/20 text-zinc-400 px-8 py-4 rounded-full hover:text-white hover:border-white/40 transition-all duration-300">Sign in</Link>
                                </div>
                            </Reveal>
                        </section>
                    </Reveal>
                )}
            </main>

            <footer className="relative z-10 py-12 sm:py-20 text-center font-sans text-[10px] uppercase tracking-[0.4em] text-zinc-600">
                Echo Magazine — Issue No. {d.issue_number} — MMXXVI
            </footer>
        </div>
    );
}
