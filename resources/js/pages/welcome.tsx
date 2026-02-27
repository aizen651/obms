import { Head, Link, usePage } from "@inertiajs/react"
import { useState } from "react"
import { ArrowRight, BookOpen, Layers, Sparkles } from "lucide-react"
import Navbar from "@/components/Navbar"
import GlobalChat from "@/components/GlobalChat"

const CARDS = [
    {
        title: "Journals",
        desc: "Access academic journals and research papers",
        btn: "Browse Journals",
        href: "/journal",
        icon: BookOpen,
        accent: "from-amber-500/20 to-orange-500/10 dark:from-amber-500/15 dark:to-orange-600/10",
        iconColor: "text-amber-600 dark:text-amber-400",
        iconBg: "bg-amber-100 dark:bg-amber-500/10",
        num: "01",
    },
    {
        title: "Magazines",
        desc: "Read the latest magazines and publications",
        btn: "View Magazines",
        href: "/magazine",
        icon: Layers,
        accent: "from-sky-500/20 to-blue-500/10 dark:from-sky-500/15 dark:to-blue-600/10",
        iconColor: "text-sky-600 dark:text-sky-400",
        iconBg: "bg-sky-100 dark:bg-sky-500/10",
        num: "02",
    },
    {
        title: "E-Books",
        desc: "Explore our extensive collection of e-books",
        btn: "Explore E-Books",
        href: "/ebooks",
        icon: Sparkles,
        accent: "from-violet-500/20 to-purple-500/10 dark:from-violet-500/15 dark:to-purple-600/10",
        iconColor: "text-violet-600 dark:text-violet-400",
        iconBg: "bg-violet-100 dark:bg-violet-500/10",
        num: "03",
    },
]

export default function Landing({ stats: propStats }) {
    const page = usePage()
    const [hovered, setHovered] = useState(false)

    // Try every possible location Inertia might put the data
    const stats = propStats ?? page?.props?.stats ?? page?.props ?? {}

    const fmt = (n, fallback = '0') => {
        if (n == null || n === undefined) return fallback
        const num = Number(n)
        if (isNaN(num)) return fallback
        if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K+'
        return num.toString()
    }

    const bookCount    = fmt(stats?.books)
    const journalCount = fmt(stats?.journals)
    const ebookCount   = fmt(stats?.ebooks)

    const STATS = [
        { value: bookCount,    label: "Books"    },
        { value: journalCount, label: "Journals" },
        { value: ebookCount,   label: "E-Books"  },
    ]

    return (
        <>
            <Head title="Library System" />
            <div className="flex flex-col min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 overflow-x-hidden">

                <Navbar />

                {/* ── HERO ── */}
                <section className="relative w-full min-h-[600px] md:min-h-[720px] flex items-end justify-start overflow-hidden">

                    {/* Background image */}
                    <div
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        style={{
                            backgroundImage: "url('/img/bg.jpg')",
                            transform: hovered ? "scale(1.04) translateZ(0)" : "scale(1) translateZ(0)",
                            transition: "transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                            willChange: "transform",
                        }}
                        className="absolute inset-0 bg-cover bg-center"
                    />

                    {/* Dark cinematic overlay — ensures white text always readable */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/75 to-zinc-950/40" />
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/20 to-transparent" />

                    {/* Hero content */}
                    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-20 pt-44">
                        <div className="max-w-2xl">

                            {/* Eyebrow */}
                            <div className="flex items-center gap-3 mb-5">
                                <div className="h-px w-10 bg-white/60" />
                                <span className="text-[11px] font-extrabold tracking-[0.25em] uppercase text-white/70">
                                    Enhanced Library System
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight mb-5">
                                <span className="text-white">Every Story</span>
                                <br />
                                <span className="italic font-light text-white/70">
                                    Awaits You
                                </span>
                            </h1>

                            {/* Body */}
                            <p className="text-base font-medium text-white/80 mb-10 leading-relaxed max-w-md">
                                Thousands of books, journals, magazines and e-books —
                                curated, organised, and ready to explore.
                            </p>

                            {/* CTAs — flex row, no wrap, equal height */}
                            <div className="flex flex-row items-center gap-3">
                                <Link
                                    href="/books"
                                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all active:scale-95
                                        bg-white text-zinc-900 hover:bg-zinc-100 shadow-xl shadow-black/30 whitespace-nowrap"
                                >
                                    Explore Books
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all active:scale-95
                                        bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/50 backdrop-blur-sm whitespace-nowrap"
                                >
                                    Get Started
                                </Link>
                            </div>

                            {/* Dynamic Stats */}
                            <div className="flex items-center gap-10 mt-12 pt-8 border-t border-white/15">
                                {STATS.map(({ value, label }) => (
                                    <div key={label}>
                                        <div className="text-2xl font-black text-white">{value}</div>
                                        <div className="text-[11px] font-bold text-white/50 tracking-widest uppercase">{label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FEATURE CARDS ── */}
                <section className="px-6 sm:px-10 lg:px-16 py-24 bg-zinc-50 dark:bg-zinc-950">
                    <div className="max-w-7xl mx-auto">

                        {/* Section header */}
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
                            <div>
                                <p className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-zinc-400 dark:text-white/30 mb-2">
                                    What's Available
                                </p>
                                <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white leading-tight">
                                    Browse Our<br className="hidden md:block" /> Collections
                                </h2>
                            </div>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-500 max-w-xs leading-relaxed">
                                From peer-reviewed research to leisure reading — we have it all under one roof.
                            </p>
                        </div>

                        {/* Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {CARDS.map(({ title, desc, btn, href, icon: Icon, accent, iconColor, iconBg, num }) => (
                                <Link
                                    key={title}
                                    href={href}
                                    className="group relative overflow-hidden rounded-3xl p-8 border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl
                                        bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-zinc-200/80
                                        dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:shadow-black/50"
                                >
                                    {/* Hover gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    <div className="relative z-10">
                                        {/* Icon + number */}
                                        <div className="flex items-start justify-between mb-8">
                                            <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center`}>
                                                <Icon className={`w-5 h-5 ${iconColor}`} />
                                            </div>
                                            {/* Number — visible in both modes */}
                                            <span className="text-5xl font-black select-none transition-colors
                                                text-zinc-200 group-hover:text-zinc-300
                                                dark:text-zinc-700 dark:group-hover:text-zinc-600">
                                                {num}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-black mb-2 text-zinc-900 dark:text-white">
                                            {title}
                                        </h3>
                                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
                                            {desc}
                                        </p>

                                        <div className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 group-hover:gap-3 transition-all">
                                            {btn}
                                            <ArrowRight className={`w-4 h-4 ${iconColor} transition-transform group-hover:translate-x-1`} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── BOTTOM CTA ── */}
                <section className="px-6 sm:px-10 lg:px-16 py-20 bg-zinc-100 dark:bg-zinc-900/60 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mb-2">
                                Ready to start reading?
                            </h3>
                            <p className="text-zinc-500 dark:text-zinc-500 text-sm font-medium">
                                Join thousands of readers already using our library.
                            </p>
                        </div>
                        <div className="flex flex-row gap-3">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all active:scale-95
                                    bg-zinc-900 text-white hover:bg-zinc-700
                                    dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                            >
                                Create Account <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all active:scale-95
                                    bg-white text-zinc-800 border border-zinc-300 hover:bg-zinc-50 hover:border-zinc-400
                                    dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </section>

            </div>

            <GlobalChat />
        </>
    )
}
