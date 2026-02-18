 

import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Library, User } from 'lucide-react';

const NAV = [
  {
  label: "Home",
  href: "/",
  },
 {
 label:"Books",
 href:"/books",
 },
 {
 label: "Journal",
 href: "#",
},
{
 label: "Magazine",
 href: '#',
},
{
label: "E-Book",
href: '#',
}
];

function Hamburger({ open, onClick }) {
  return (
    <button onClick={onClick} className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus:outline-none z-[110]" aria-label="Toggle menu" >
      <span className={`block h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
      <span className={`block h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${open ? "opacity-0" : ""}`} />
      <span className={`block h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
    </button>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      <header className="bg-[#032e26] fixed top-0 z-[110] w-full px-4 sm:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-md shadow-lg shadow-emerald-900/50">
              <Library size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Library System</span>
          </div>
          {/* Desktop Nav */}
          <nav className="text-white hidden lg:flex items-center gap-6 bg-black/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} className={`text-xs text-white font-medium transition-colors ${n.label === "Home" ? "text-emerald-400" : "text-gray-300 hover:text-white"}`} >
                {n.label}
              </Link>
            ))}
          </nav>
          {/* Auth Buttons — desktop only */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/register" className="text-xs text-white font-medium px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition"> Register </Link>
            <Link href="/login" className="text-xs text-white font-medium px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/40"> Login </Link>
            <div className="w-9 h-9 rounded-full text-white bg-white/10 flex items-center justify-center border border-white/20 cursor-pointer">
              <User size={18} />
            </div>
          </div>
          {/* Hamburger */}
          <Hamburger open={open} onClick={() => setOpen(!open)} />
        </div>
      </header>
      {/* ══ MOBILE MENU — */}
      <div className={`md:hidden fixed inset-0 bg-[#032e26] z-[100] transition-transform duration-500 ease-in-out ${open ? "translate-y-0 pointer-events-auto" : "-translate-y-full pointer-events-none"}`} >
        <div className="flex flex-col items-center justify-start h-full gap-6 pt-28 px-8">
          {/* Nav links */}
          {NAV.map((n) => (
            <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className={`text-2xl text-white font-bold transition-colors ${n.label === "Home" ? "text-emerald-400" : "hover:text-emerald-400"}`} >
              {n.label}
            </Link>
          ))}
          {/* Divider */}
          <div className="w-24 h-px bg-white/10 my-2" />
          {/* Auth buttons */}
          <div className="flex items-center gap-4">
            <Link href="/register" onClick={() => setOpen(false)} className="text-white text-sm font-semibold px-6 py-2.5 rounded-lg border border-white/20 hover:bg-white/10 transition" >
              Register
            </Link>
            <Link href="/login" onClick={() => setOpen(false)} className="text-white text-sm font-semibold px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/40" >
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}