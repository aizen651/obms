import { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    Library, Home, BookOpen, BookText, Newspaper, LayoutDashboard,
    Tablet, MessageSquare, BookMarked, ArrowLeftRight,
    User, LogOut, ChevronDown, LogIn, UserPlus, X
} from 'lucide-react';

const PUBLIC_NAV = [
    { label: "Home",      href: "/",          icon: Home          },
    { label: "Books",     href: "/books",      icon: BookOpen      },
    { label: "Journal",   href: "/journal",    icon: BookText      },
    { label: "Magazine",  href: "/magazine",   icon: Newspaper     },
    { label: "E-Book",    href: "/ebooks",     icon: Tablet        },
];

const AUTH_NAV = [
    { label: "Home",         href: "/",            icon: Home            },
    { label: "Dashboard",    href: "/dashboard",    icon: LayoutDashboard },
    { label: "Books",        href: "/books",        icon: BookOpen        },
    { label: "Borrow",       href: "/borrow",       icon: BookMarked      },
    { label: "Transactions", href: "/transactions", icon: ArrowLeftRight  },
    { label: "Journal",      href: "/journal",      icon: BookText        },
    { label: "Magazine",     href: "/magazine",     icon: Newspaper       },
    { label: "E-Book",       href: "/ebooks",       icon: Tablet          },
    { label: "Chat",         href: "/chat",         icon: MessageSquare   },
];

export default function Navbar() {
    const [open, setOpen]               = useState(false);
    const [profileOpen, setProfile]     = useState(false);
    const [scrolled, setScrolled]       = useState(false);
    const [currentPath, setCurrentPath] = useState(() =>
        typeof window !== 'undefined' ? window.location.pathname : '/'
    );
    const profileRef = useRef(null);
    const { auth }   = usePage().props;
    const user       = auth?.user;
    const NAV        = user ? AUTH_NAV : PUBLIC_NAV;

    const isActive = (href) =>
        href === '/' ? currentPath === '/' : currentPath.startsWith(href);

    useEffect(() => {
        const unsubscribe = router.on('navigate', (e) => {
            setCurrentPath(e.detail.page.url);
            setOpen(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfile(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const Avatar = ({ size = 'sm' }) => (
        <div className={`${size === 'sm' ? 'w-7 h-7 rounded-lg' : 'w-9 h-9 rounded-xl'} bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0`}>
            {user?.user_image
                ? <img src={`/storage/${user.user_image}`} alt={user.firstname} className="w-full h-full object-cover" />
                : <User className={size === 'sm' ? 'w-3.5 h-3.5 text-white/50' : 'w-4 h-4 text-white/40'} />
            }
        </div>
    );

    return (
        <>
            {/* ── HEADER (original theme) ── */}
            <header className={`fixed top-0 inset-x-0 z-[110] transition-all duration-500 ${
                scrolled ? 'bg-zinc-950/85 backdrop-blur-2xl border-b border-white/6 shadow-2xl shadow-black/40' : 'bg-transparent'
            }`}>
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-4">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/12 flex items-center justify-center shadow-lg shadow-black/30 group-hover:border-white/25 transition-all duration-300">
                                <Library className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="font-bold text-sm text-white tracking-tight">Library</span>
                                <span className="text-[9px] text-white/30 tracking-widest uppercase">System</span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-0.5 bg-white/[0.03] border border-white/8 rounded-2xl px-2 py-1.5">
                            {NAV.map(({ label, href, icon: Icon }) => (
                                <Link key={label} href={href} className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all group ${
                                    isActive(href) ? 'bg-white/10 text-white border border-white/10' : 'text-white/40 hover:text-white/75 hover:bg-white/5'
                                }`}>
                                    <Icon className={`w-3 h-3 ${isActive(href) ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`} />
                                    {label}
                                    {isActive(href) && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/60" />}
                                </Link>
                            ))}
                        </nav>

                        {/* Right side */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {user ? (
                                <div className="relative hidden md:block" ref={profileRef}>
                                    <button onClick={() => setProfile(v => !v)} className={`flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-xl border transition-all ${
                                        profileOpen ? 'bg-white/10 border-white/15' : 'bg-white/5 border-white/8 hover:bg-white/8 hover:border-white/12'
                                    }`}>
                                        <Avatar />
                                        <span className="text-[11px] font-medium text-white/65 max-w-[72px] truncate">{user.firstname}</span>
                                        <ChevronDown className={`w-3 h-3 text-white/25 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <div className={`absolute right-0 top-full mt-2.5 w-52 transition-all duration-200 origin-top-right ${
                                        profileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                                    }`}>
                                        <div className="relative rounded-2xl border border-white/10 bg-zinc-900/98 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden">
                                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                            <div className="p-4 border-b border-white/6 flex items-center gap-3">
                                                <Avatar size="lg" />
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-white/85 truncate">{user.firstname} {user.lastname}</p>
                                                    <p className="text-[10px] text-white/30 capitalize">{user.role}</p>
                                                </div>
                                            </div>
                                            <div className="p-1.5 space-y-0.5">
                                                <Link href="/profile" onClick={() => setProfile(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-medium text-white/55 hover:text-white/85 hover:bg-white/6 transition-all">
                                                    <User className="w-3.5 h-3.5" /> My Profile
                                                </Link>
                                                <Link href="/logout" method="post" as="button" onClick={() => setProfile(false)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/8 transition-all">
                                                    <LogOut className="w-3.5 h-3.5" /> Sign out
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center gap-2">
                                    <Link href="/login" className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-medium text-white/55 hover:text-white/80 border border-white/8 hover:border-white/15 hover:bg-white/5 transition-all">
                                        <LogIn className="w-3.5 h-3.5" /> Login
                                    </Link>
                                    <Link href="/register" className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-semibold bg-white text-zinc-900 hover:bg-white/90 transition-all shadow-lg shadow-black/20 active:scale-95">
                                        <UserPlus className="w-3.5 h-3.5" /> Register
                                    </Link>
                                </div>
                            )}

                            {/* Hamburger */}
                            <button onClick={() => setOpen(v => !v)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 transition-all">
                                <div className="relative w-4 h-4">
                                    <span className={`absolute block h-0.5 w-4 bg-white/70 rounded-full transition-all duration-300 ${open ? 'rotate-45 top-1.5' : 'top-0'}`} />
                                    <span className={`absolute block h-0.5 w-4 bg-white/70 rounded-full top-1.5 transition-all duration-300 ${open ? 'opacity-0' : 'opacity-100'}`} />
                                    <span className={`absolute block h-0.5 w-4 bg-white/70 rounded-full transition-all duration-300 ${open ? '-rotate-45 top-1.5' : 'top-3'}`} />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── MOBILE SIDEBAR (dark-light gradient background) ── */}
            <div className={`lg:hidden fixed inset-0 z-[120] transition-all duration-500 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

                {/* Sidebar panel — gradient from dark top to lighter middle to dark bottom */}
                <div className={`absolute top-0 right-0 h-full w-72 flex flex-col transition-transform duration-500 ${open ? 'translate-x-0' : 'translate-x-full'}
                    bg-gradient-to-b from-zinc-950 via-zinc-800 to-zinc-950
                    border-l border-white/8 shadow-2xl shadow-black/60`}>

                    {/* Subtle left accent line */}
                    <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />

                    {/* Sidebar header */}
                    <div className="flex items-center justify-between px-5 h-16 border-b border-white/6 flex-shrink-0">
                        <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 group">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-white/15 to-white/5 border border-white/12 flex items-center justify-center group-hover:border-white/25 transition-all">
                                <Library className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="font-bold text-xs text-white tracking-tight">Library</span>
                                <span className="text-[8px] text-white/30 tracking-widest uppercase">System</span>
                            </div>
                        </Link>
                        <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 transition-all">
                            <X className="w-3.5 h-3.5 text-white/50" />
                        </button>
                    </div>

                    {/* Nav links */}
                    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                        {NAV.map(({ label, href, icon: Icon }) => (
                            <Link key={label} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                isActive(href) ? 'bg-white/10 text-white border border-white/10' : 'text-white/45 hover:text-white/80 hover:bg-white/5'
                            }`}>
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive(href) ? 'bg-white/10 border border-white/10' : 'bg-white/4 border border-white/6'}`}>
                                    <Icon className="w-3.5 h-3.5" />
                                </div>
                                {label}
                                {isActive(href) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50 flex-shrink-0" />}
                            </Link>
                        ))}
                    </div>

                    {/* Bottom auth section */}
                    <div className="px-3 py-4 border-t border-white/6 space-y-2 flex-shrink-0">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/4 border border-white/6">
                                    <Avatar size="lg" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-white/75 truncate">{user.firstname} {user.lastname}</p>
                                        <p className="text-[10px] text-white/30 capitalize">{user.role}</p>
                                    </div>
                                </div>
                                <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">
                                    <User className="w-4 h-4" /> Profile
                                </Link>
                                <Link href="/logout" method="post" as="button" onClick={() => setOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/8 transition-all">
                                    <LogOut className="w-4 h-4" /> Sign out
                                </Link>
                            </>
                        ) : (
                            <div className="md:hidden flex flex-col gap-2">
                                <Link href="/login" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white/60 border border-white/10 hover:bg-white/5 hover:text-white/80 transition-all">
                                    <LogIn className="w-4 h-4" /> Login
                                </Link>
                                <Link href="/register" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-white text-zinc-900 hover:bg-white/90 transition-all active:scale-95">
                                    <UserPlus className="w-4 h-4" /> Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
