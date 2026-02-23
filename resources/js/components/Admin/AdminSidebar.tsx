import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const NAV = [
    { name: 'Dashboard',       href: '/admin/dashboard',    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Profile',         href: '/admin/profile',      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: 'User Management', href: '/admin/users',        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Category',        href: '/admin/categories',   icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
    { name: 'Books',           href: '/admin/books',        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Transactions',    href: '/admin/transactions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'E-Books',         href: '/admin/ebooks',       icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { name: 'Magazine',        href: '/admin/magazine',     icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-6-4h2' },
];

function Icon({ path }) {
    return (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={path} />
        </svg>
    );
}

export default function AdminSidebar() {
    const [open, setOpen] = useState(false);
    const { url } = usePage();
    const isActive = (href) => url.startsWith(href);

    return (
        <>
            {/* Hamburger — only visible when sidebar is CLOSED */}
            {!open && (
                <button onClick={() => setOpen(true)}
                    className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.2)', color: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            )}

            {/* Overlay */}
            {open && (
                <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-60 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:shrink-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
                style={{ background: 'rgba(15,15,15,0.92)', borderRight: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>

                <div className="flex flex-col h-full">

                    {/* Logo row — close button is INSIDE sidebar on mobile */}
                    <div className="h-16 flex items-center gap-3 px-4 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: 'linear-gradient(135deg, #7c3aed, #f59e0b)' }}>
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white leading-none">Library</p>
                            <p className="text-[10px] text-white/40 mt-0.5">Admin Panel</p>
                        </div>
                        {/* Close button — only on mobile, inside sidebar */}
                        <button onClick={() => setOpen(false)}
                            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white/40 hover:text-white transition-colors"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
                        {NAV.map(({ name, href, icon }) => {
                            const active = isActive(href);
                            return (
                                <Link key={name} href={href} onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                                    style={active
                                        ? { background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(245,158,11,0.2))', color: 'white', border: '1px solid rgba(124,58,237,0.3)' }
                                        : { color: 'rgba(255,255,255,0.55)', border: '1px solid transparent' }}
                                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'white'; } }}
                                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; } }}>
                                    <Icon path={icon} />
                                    {name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-3 border-t shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                        <Link href={route('admin.logout')} method="post" as="button"
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                            style={{ color: 'rgba(255,255,255,0.45)', border: '1px solid transparent' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = 'rgb(252,165,165)'; e.currentTarget.style.border = '1px solid rgba(239,68,68,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.border = '1px solid transparent'; }}>
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
