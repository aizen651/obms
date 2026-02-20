import { Head, Link } from "@inertiajs/react"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import Navbar from "@/components/Navbar"

const CARDS = [
    { title: "Journals",  desc: "Access academic journals and research papers", btn: "Browse Journals", href: "/journal"  },
    { title: "Magazines", desc: "Read the latest magazines and publications",   btn: "View Magazines",  href: "/magazine" },
    { title: "E-Books",   desc: "Explore our extensive collection of e-books",  btn: "Explore E-Books", href: "/ebook"    },
]

export default function Landing() {
    const [hovered, setHovered] = useState(false)

    return (
        <>
            <Head title="Library System" />
            <div className="flex flex-col min-h-screen w-full bg-zinc-950 text-white selection:bg-white/20 overflow-x-hidden">

                <Navbar />

                {/* Hero */}
                <section className="relative w-full h-[550px] md:h-[680px] flex items-center justify-center overflow-hidden pt-[73px]">

                    {/* Background image */}
                    <div
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        style={{
                            backgroundImage: "url('/img/library.jpg')",
                            transform:  hovered ? "scale(1.04) translateZ(0)" : "scale(1) translateZ(0)",
                            transition: "transform 600ms ease-out",
                            willChange: "transform",
                        }}
                        className="absolute inset-0 bg-cover bg-center opacity-20"
                    />

                    {/* Spotlight glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[300px] bg-white/10 rounded-full blur-[60px] pointer-events-none" />

                    {/* Seamless fade — no hard arc, just blends into zinc-950 */}
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-transparent to-zinc-950" />

                    <div className="relative z-10 text-center px-4 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <p className="text-white/40 text-xs font-medium tracking-widest uppercase mb-4">
                            Thousands of Books Available
                        </p>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white leading-tight">
                            Discover and Borrow<br />
                            <span className="text-white/60">Books You'll Love</span>
                        </h1>
                        <p className="text-white/40 text-base mb-10">
                            Browse our collection of books, journals, magazines and e-books.<br className="hidden md:block" />
                            All in one place.
                        </p>
                        <div className="flex gap-3 justify-center flex-wrap">
                            <Link href="/books" className="px-7 py-3 bg-white text-zinc-900 rounded-full font-semibold hover:bg-white/90 transition-colors shadow-lg shadow-white/10 active:scale-95 text-sm">
                                Explore Books
                            </Link>
                            <Link href="/register" className="px-7 py-3 bg-white/5 text-white/70 rounded-full font-semibold hover:bg-white/10 transition-colors border border-white/10 active:scale-95 text-sm">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Feature Cards */}
                <section className="px-4 sm:px-12 py-20">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                        {CARDS.map(({ title, desc, btn, href }) => (
                            <div key={title} className="bg-white/3 border border-white/8 p-8 rounded-2xl relative overflow-hidden group hover:bg-white/5 hover:border-white/15 transition-all duration-300">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
                                    <p className="text-white/40 text-sm mb-8 leading-relaxed">{desc}</p>
                                    <Link href={href} className="inline-flex items-center gap-2 bg-white/5 text-white/70 px-5 py-2.5 rounded-full text-sm font-medium border border-white/10 group-hover:bg-white group-hover:text-zinc-900 group-hover:border-white transition-all">
                                        {btn} <ChevronDown size={16} />
                                    </Link>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/3 rounded-full blur-3xl group-hover:bg-white/8 transition-all" />
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </>
    )
}