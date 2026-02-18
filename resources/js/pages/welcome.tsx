import { Head, Link } from "@inertiajs/react"
import { useState, useEffect } from "react"
import {
  Library, Newspaper, Monitor,
  MessageCircle, User, ChevronDown,
  BookOpen, Repeat, CreditCard, LayoutDashboard,
} from "lucide-react"

const NAV = ["Home", "Books", "Journal", "Magazine", "E-Book"]



const CARDS = [
  { title: "Journals",  desc: "Access academic journals and research papers", btn: "Browse Journals" },
  { title: "Magazines", desc: "Read the latest magazines and publications",   btn: "View Magazines"  },
  { title: "E-Books",   desc: "Explore our extensive collection of e-books",  btn: "Explore E-Books" },
]

function Hamburger({ open, onClick }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus:outline-none z-[110]"
      aria-label="Toggle menu"
    >
      <span className={`block h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
      <span className={`block h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${open ? "opacity-0" : ""}`} />
      <span className={`block h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
    </button>
  )
}

export default function Landing() {
  const [open, setOpen] = useState(false)

  // Lock page scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      <Head title="Library System" />

      <div className="flex flex-col min-h-screen w-full bg-[#032e26] text-white selection:bg-emerald-500 overflow-x-hidden">

        {/* NAVBAR */ }
       
        <header className="fixed top-0 z-[110] w-full px-4 sm:px-12 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500 p-1.5 rounded-md shadow-lg shadow-emerald-900/50">
                <Library size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">Library System</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6 bg-black/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
              {NAV.map((n) => (
                <Link
                  key={n}
                  href="#"
                  className={`text-xs font-medium transition-colors ${n === "Home" ? "text-emerald-400" : "text-gray-300 hover:text-white"}`}
                >
                  {n}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons — desktop only */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/register" className="text-xs font-medium px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition">
                Register
              </Link>
              <Link href="/login" className="text-xs font-medium px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/40">
                Login
              </Link>
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20 cursor-pointer">
                <User size={18} />
              </div>
            </div>

            {/* Hamburger */}
            <Hamburger open={open} onClick={() => setOpen(!open)} />
          </div>
        </header>

        {/* ══ MOBILE MENU — */}
        <div
          className={`md:hidden fixed inset-0 bg-[#032e26] z-[100]
            transition-transform duration-500 ease-in-out
            ${open ? "translate-y-0 pointer-events-auto" : "-translate-y-full pointer-events-none"}`}
        >
          
          <div className="flex flex-col items-center justify-start h-full gap-6 pt-28 px-8">

            {/* Nav links */}
            {NAV.map((n) => (
              <Link
                key={n}
                href="#"
                onClick={() => setOpen(false)}
                className={`text-2xl font-bold transition-colors ${n === "Home" ? "text-emerald-400" : "hover:text-emerald-400"}`}
              >
                {n}
              </Link>
            ))}

            {/* Divider */}
            <div className="w-24 h-px bg-white/10 my-2" />

            {/* Auth buttons */}
            <div className="flex items-center gap-4">
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="text-sm font-semibold px-6 py-2.5 rounded-lg border border-white/20 hover:bg-white/10 transition"
              >
                Register
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-sm font-semibold px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/40"
              >
                Login
              </Link>
            </div>

          </div>
        </div>

        {/* HERO SECTION WITH ARC */}
        <section className="relative w-full h-[550px] md:h-[650px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
            style={{ backgroundImage: "url('/img/library.jpg')" }}
            
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#032e26]/80 via-transparent to-[#032e26]" />
          <div className="absolute inset-0 bg-emerald-900/30 mix-blend-multiply" />

          <div className="relative z-10 text-center px-4 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-2xl">
              Welcome to the <span className="text-white">Library System</span>
            </h1>
            <p className="text-gray-200 text-lg mb-8 font-light italic">
              "Discover, Borrow, and Enjoy Your Favorite Books!"
            </p>
            <div className="flex gap-4 justify-center">
              <Link
              href={route('books')}
              className="px-8 py-3 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-900/50">
                Explore Books
              </Link>
              <button className="px-8 py-3 bg-emerald-700/80 backdrop-blur-sm text-white rounded-lg font-bold hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95 border border-white/10">
                Get Started
              </button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full leading-none z-20">
            <svg className="relative block w-full h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#032e26" opacity=".25" />
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.51,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="#032e26" opacity=".5" />
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#032e26" />
            </svg>
          </div>
        </section>

        {/* ══ THE ICON TILES ═════════════════════════════════════════ */}
     

        {/* ══ FEATURE CARDS ══════════════════════════════════════════ */}
        <section className="px-4 sm:px-12 py-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {CARDS.map(({ title, desc, btn }) => (
              <div
                key={title}
                className="bg-gradient-to-br from-[#0a4d3e] to-[#042c24] p-8 rounded-3xl border border-white/5 relative overflow-hidden group"
              >
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3">{title}</h3>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed">{desc}</p>
                  <button className="flex items-center gap-2 bg-emerald-600/20 text-emerald-400 px-5 py-2.5 rounded-full text-sm font-bold border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    {btn} <ChevronDown size={16} />
                  </button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
              </div>
            ))}
          </div>
        </section>

      
      </div>
    </>
  )
}
