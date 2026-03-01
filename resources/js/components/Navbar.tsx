import { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    Library, Home, BookOpen, BookText, Newspaper, LayoutDashboard,
    Tablet, ArrowLeftRight, User, LogOut, ChevronDown, LogIn, UserPlus, X, Sun, Moon
} from 'lucide-react';

const PUBLIC_NAV = [
    { label: "Home",      href: "/",         icon: Home      },
    { label: "Books",     href: "/books",     icon: BookOpen  },
    { label: "Journal",   href: "/journal",   icon: BookText  },
    { label: "Magazine",  href: "/magazine",  icon: Newspaper },
    { label: "E-Book",    href: "/ebooks",    icon: Tablet    },
];

const AUTH_NAV = [
    { label: "Home",         href: "/",            icon: Home            },
    { label: "Dashboard",    href: "/dashboard",    icon: LayoutDashboard },
    { label: "Books",        href: "/books",        icon: BookOpen        },
    { label: "Transactions", href: "/transactions", icon: ArrowLeftRight  },
    { label: "Journal",      href: "/journal",      icon: BookText        },
    { label: "Magazine",     href: "/magazine",     icon: Newspaper       },
    { label: "E-Book",       href: "/ebooks",       icon: Tablet          },
];

export default function Navbar() {
    const [open, setOpen]               = useState(false);
    const [profileOpen, setProfile]     = useState(false);
    const [scrolled, setScrolled]       = useState(false);
    const [isDark, setIsDark]           = useState(true);
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
        const saved = localStorage.getItem('theme');
        const dark = saved ? saved === 'dark' : true;
        setIsDark(dark);
        if (dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        if (newDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', newDark ? 'dark' : 'light');
    };

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

    const ThemeToggle = ({ mobile = false, scrolled = false }) => (
        <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={
                mobile
                    ? 'flex items-center gap-2 px-4 py-2.5 w-full rounded-xl border text-sm font-medium transition-all ' +
                      'border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 ' +
                      'dark:border-white/10 dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white/80'
                    : scrolled
                        ? 'flex items-center justify-center w-9 h-9 rounded-xl border transition-all ' +
                          'bg-zinc-100 border-zinc-300 text-zinc-600 hover:bg-zinc-200 ' +
                          'dark:bg-white/5 dark:border-white/10 dark:text-white/50 dark:hover:bg-white/10'
                        // unscrolled — light: solid zinc, dark: translucent white
                        : 'flex items-center justify-center w-9 h-9 rounded-xl border transition-all ' +
                          'bg-zinc-100 border-zinc-300 text-zinc-600 hover:bg-zinc-200 ' +
                          'dark:bg-white/15 dark:border-white/25 dark:text-white dark:hover:bg-white/25 dark:backdrop-blur-sm'
            }
        >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {mobile && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
    );

    const Avatar = ({ size = 'sm' }) => (
        <div className={`${size === 'sm' ? 'w-7 h-7 rounded-lg' : 'w-9 h-9 rounded-xl'}
            bg-zinc-200 border border-zinc-300 dark:bg-white/10 dark:border-white/10
            flex items-center justify-center overflow-hidden flex-shrink-0`}>
           {user?.avatar_url
            ? <img src={user.avatar_url} alt={user.firstname} className="w-full h-full object-cover" />
            : <User className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-zinc-500 dark:text-white/40`} />
        }
        </div>
    );

    return (
        <>
            {/* ── HEADER ── */}
            <header className={`fixed top-0 inset-x-0 z-[110] transition-all duration-500 ${
                scrolled
                    ? 'bg-white/90 backdrop-blur-2xl border-b border-zinc-200 shadow-lg shadow-black/5 dark:bg-zinc-950/85 dark:border-white/8 dark:shadow-black/40'
                    : 'bg-transparent'
            }`}>
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-300/50 to-transparent dark:via-white/12" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-4">

                        {/* ── Logo ── */}
                        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shadow-lg group-hover:opacity-80 transition-all duration-300 ${
                                scrolled
                                    ? 'bg-zinc-900 border-zinc-700 dark:bg-white/10 dark:border-white/12'
                                    : 'bg-zinc-900 border-zinc-700 dark:bg-white/20 dark:border-white/30 dark:backdrop-blur-sm'
                            }`}>
                                <Library className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex flex-col leading-none">
                                {/* always dark text in light mode, always white in dark mode */}<span className="font-bold text-sm tracking-tight transition-colors duration-300 text-zinc-500 dark:text-white/60">
    Library
</span>
                               
                                <span className="text-[9px] tracking-widest uppercase transition-colors duration-300 text-zinc-500 dark:text-white/60">
                                    System
                                </span>
                            </div>
                        </Link>

                        {/* ── Desktop Nav ── */}
                        <nav className={`hidden lg:flex items-center gap-0.5 rounded-2xl px-2 py-1.5 border transition-all duration-300 ${
                            scrolled
                                ? 'bg-zinc-100 border-zinc-200 dark:bg-white/[0.03] dark:border-white/8'
                                : 'bg-zinc-100/80 border-zinc-200 dark:bg-white/10 dark:border-white/20 dark:backdrop-blur-sm'
                        }`}>
                            {NAV.map(({ label, href, icon: Icon }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all group ${
                                        isActive(href)
                                            ? 'bg-zinc-900 text-white dark:bg-white/20 dark:text-white dark:border dark:border-white/20'
                                            : scrolled
                                                ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 dark:text-white/40 dark:hover:text-white/75 dark:hover:bg-white/5'
                                                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/80 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/15'
                                    }`}
                                >
                                    <Icon className="w-3 h-3" />
                                    {label}
                                    {isActive(href) && (
                                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/60" />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* ── Right side ── */}
                        <div className="flex items-center gap-2 flex-shrink-0">

                            <ThemeToggle scrolled={scrolled} />

                            {user ? (
                                <div className="relative hidden md:block" ref={profileRef}>
                                    <button
                                        onClick={() => setProfile(v => !v)}
                                        className={`flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-xl border transition-all ${
                                            profileOpen
                                                ? 'bg-zinc-100 border-zinc-300 dark:bg-white/10 dark:border-white/15'
                                                : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 dark:bg-white/5 dark:border-white/8 dark:hover:bg-white/8'
                                        }`}
                                    >
                                        <Avatar />
                                        <span className="text-[11px] font-medium text-zinc-700 dark:text-white/65 max-w-[72px] truncate">{user.firstname}</span>
                                        <ChevronDown className={`w-3 h-3 text-zinc-400 dark:text-white/25 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <div className={`absolute right-0 top-full mt-2.5 w-52 transition-all duration-200 origin-top-right ${
                                        profileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                                    }`}>
                                        <div className="relative rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900 backdrop-blur-2xl shadow-xl shadow-black/10 overflow-hidden">
                                            <div className="p-4 border-b border-zinc-100 dark:border-white/6 flex items-center gap-3">
                                                <Avatar size="lg" />
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-zinc-800 dark:text-white/85 truncate">{user.firstname} {user.lastname}</p>
                                                    <p className="text-[10px] text-zinc-400 dark:text-white/30 capitalize">{user.role}</p>
                                                </div>
                                            </div>
                                            <div className="p-1.5 space-y-0.5">
                                                <Link
                                                    href="/profile"
                                                    onClick={() => setProfile(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-medium
                                                        text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100
                                                        dark:text-white/55 dark:hover:text-white/85 dark:hover:bg-white/6 transition-all"
                                                >
                                                    <User className="w-3.5 h-3.5" /> My Profile
                                                </Link>
                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    onClick={() => setProfile(false)}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-medium
                                                        text-red-500 hover:bg-red-50
                                                        dark:text-red-400/60 dark:hover:text-red-400 dark:hover:bg-red-500/8 transition-all"
                                                >
                                                    <LogOut className="w-3.5 h-3.5" /> Sign out
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center gap-2">
                                    <Link
                                        href="/login"
                                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                                            scrolled
                                                ? 'text-zinc-700 border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 dark:text-white/70 dark:border-white/15 dark:hover:bg-white/5 dark:hover:text-white'
                                                : 'text-zinc-700 border-zinc-300 bg-white/80 hover:bg-zinc-100 dark:text-white dark:border-white/40 dark:bg-white/10 dark:hover:bg-white/20 dark:backdrop-blur-sm'
                                        }`}
                                    >
                                        <LogIn className="w-3.5 h-3.5" /> Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-semibold transition-all shadow-lg active:scale-95 ${
                                            scrolled
                                                ? 'bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-white/90'
                                                : 'bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100'
                                        }`}
                                    >
                                        <UserPlus className="w-3.5 h-3.5" /> Register
                                    </Link>
                                </div>
                            )}

                            {/* ── Hamburger ── */}
                            <button
                                onClick={() => setOpen(v => !v)}
                                className={`lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${
                                    scrolled
                                        ? 'bg-zinc-100 border-zinc-200 hover:bg-zinc-200 dark:bg-white/5 dark:border-white/8 dark:hover:bg-white/10'
                                        : 'bg-zinc-100 border-zinc-200 hover:bg-zinc-200 dark:bg-white/15 dark:border-white/25 dark:hover:bg-white/25 dark:backdrop-blur-sm'
                                }`}
                            >
                                <div className="relative w-4 h-4">
                                    <span className={`absolute block h-0.5 w-4 rounded-full transition-all duration-300 bg-zinc-700 dark:bg-white/80 ${open ? 'rotate-45 top-1.5' : 'top-0'}`} />
                                    <span className={`absolute block h-0.5 w-4 rounded-full bg-zinc-700 dark:bg-white/80 top-1.5 transition-all duration-300 ${open ? 'opacity-0' : 'opacity-100'}`} />
                                    <span className={`absolute block h-0.5 w-4 rounded-full transition-all duration-300 bg-zinc-700 dark:bg-white/80 ${open ? '-rotate-45 top-1.5' : 'top-3'}`} />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── MOBILE SIDEBAR ── */}
            <div className={`lg:hidden fixed inset-0 z-[120] transition-all duration-500 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/30 dark:bg-zinc-950/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

                <div className={`absolute top-0 right-0 h-full w-72 flex flex-col transition-transform duration-500 ${open ? 'translate-x-0' : 'translate-x-full'}
                    bg-white border-l border-zinc-200 shadow-2xl
                    dark:bg-gradient-to-b dark:from-zinc-950 dark:via-zinc-800 dark:to-zinc-950 dark:border-white/8`}>

                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-100 dark:border-white/6 flex-shrink-0">
                        <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 group">
                            <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white/10 border border-zinc-700 dark:border-white/12
                                flex items-center justify-center group-hover:opacity-80 transition-all">
                                <Library className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="font-bold text-xs text-zinc-900 dark:text-white tracking-tight">Library</span>
                                <span className="text-[8px] text-zinc-500 dark:text-white/60 tracking-widest uppercase">System</span>
                            </div>
                        </Link>
                        <button
                            onClick={() => setOpen(false)}
                            className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 dark:bg-white/5 dark:border-white/8
                                flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-white/10 transition-all"
                        >
                            <X className="w-3.5 h-3.5 text-zinc-500 dark:text-white/50" />
                        </button>
     </div>

                    {/* Nav Links */}
                    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                        {NAV.map(({ label, href, icon: Icon }) => (
                            <Link
                                key={label}
                                href={href}
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    isActive(href)
                                        ? 'bg-zinc-900 text-white dark:bg-white/10 dark:text-white dark:border dark:border-white/10'
                                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-white/45 dark:hover:text-white/80 dark:hover:bg-white/5'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                    isActive(href)
                                        ? 'bg-white/20 dark:bg-white/10'
                                        : 'bg-zinc-100 dark:bg-white/4 border border-zinc-200 dark:border-white/6'
                                }`}>
                                    <Icon className={`w-3.5 h-3.5 ${isActive(href) ? 'text-white' : 'text-zinc-500 dark:text-white/50'}`} />
                                </div>
                                {label}
                                {isActive(href) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60 dark:bg-white/50 flex-shrink-0" />}
                            </Link>
                        ))}
                    </div>

                    {/* Bottom: Theme Toggle + Auth */}
                    <div className="px-3 py-4 border-t border-zinc-100 dark:border-white/6 space-y-2 flex-shrink-0">

                        <ThemeToggle mobile />

                        {user ? (
                            <>
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 dark:bg-white/4 dark:border-white/6">
                                    <Avatar size="lg" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-zinc-800 dark:text-white/75 truncate">{user.firstname} {user.lastname}</p>
                                        <p className="text-[10px] text-zinc-400 dark:text-white/30 capitalize">{user.role}</p>
                                    </div>
                                </div>
                                <Link
                                    href="/profile"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm
                                        text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100
                                        dark:text-white/50 dark:hover:text-white/80 dark:hover:bg-white/5 transition-all"
                                >
                                    <User className="w-4 h-4" /> Profile
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    onClick={() => setOpen(false)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm
                                        text-red-500 hover:bg-red-50
                                        dark:text-red-400/60 dark:hover:text-red-400 dark:hover:bg-red-500/8 transition-all"
                                >
                                    <LogOut className="w-4 h-4" /> Sign out
                                </Link>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium
                                        text-zinc-600 border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900
                                        dark:text-white/60 dark:border-white/10 dark:hover:bg-white/5 dark:hover:text-white/80 transition-all"
                                >
                                    <LogIn className="w-4 h-4" /> Login
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold
                                        bg-zinc-900 text-white hover:bg-zinc-700
                                        dark:bg-white dark:text-zinc-900 dark:hover:bg-white/90 transition-all active:scale-95"
                                >
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