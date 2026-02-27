import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    User,
    Users,
    Tag,
    BookOpen,
    ClipboardList,
    Smartphone,
    Newspaper,
    Menu,
    X,
    LogOut,
    Library,
} from 'lucide-react';

const NAV = [
    { name: 'Dashboard',       href: '/admin/dashboard',    icon: LayoutDashboard },
    { name: 'Profile',         href: '/admin/profile',      icon: User },
    { name: 'User Management', href: '/admin/users',        icon: Users },
    { name: 'Category',        href: '/admin/categories',   icon: Tag },
    { name: 'Books',           href: '/admin/books',        icon: BookOpen },
    { name: 'Transactions',    href: '/admin/transactions', icon: ClipboardList },
    { name: 'E-Books',         href: '/admin/ebooks',       icon: Smartphone },
    { name: 'Magazine',        href: '/admin/magazine',     icon: Newspaper },
];

export default function AdminSidebar() {
    const [open, setOpen] = useState(false);
    const { url } = usePage();
    const isActive = (href) => url.startsWith(href);

    return (
        <>
            <style>{`
                .sidebar-root {
                    position: fixed;
                    top: 0; left: 0;
                    height: 100%;
                    width: 232px;
                    z-index: 50;
                    transform: translateX(-100%);
                    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    background: #ffffff;
                    border-right: 1px solid rgba(0,0,0,0.07);
                    box-shadow: 4px 0 24px rgba(0,0,0,0.06);
                }

                @media (min-width: 1024px) {
                    .sidebar-root {
                        position: static;
                        transform: none;
                        flex-shrink: 0;
                    }
                }

                .sidebar-root.is-open {
                    transform: translateX(0);
                }

                .sidebar-logo-row {
                    height: 64px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 0 16px;
                    border-bottom: 1px solid rgba(0,0,0,0.06);
                    flex-shrink: 0;
                }

                .sidebar-logo-icon {
                    width: 34px; height: 34px;
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                    background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
                    box-shadow: 0 2px 8px rgba(79,70,229,0.3);
                }

                .sidebar-brand-name {
                    font-size: 14px;
                    font-weight: 700;
                    color: #1e1b4b;
                    line-height: 1;
                    letter-spacing: -0.01em;
                }

                .sidebar-brand-sub {
                    font-size: 10px;
                    color: rgba(0,0,0,0.35);
                    margin-top: 3px;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                }

                .sidebar-close-btn {
                    margin-left: auto;
                    width: 30px; height: 30px;
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(0,0,0,0.04);
                    border: 1px solid rgba(0,0,0,0.08);
                    color: rgba(0,0,0,0.4);
                    cursor: pointer;
                    transition: background 0.15s, color 0.15s;
                    flex-shrink: 0;
                }

                .sidebar-close-btn:hover {
                    background: rgba(0,0,0,0.08);
                    color: rgba(0,0,0,0.7);
                }

                /* Section label */
                .sidebar-section-label {
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: rgba(0,0,0,0.28);
                    padding: 16px 16px 6px;
                }

                .sidebar-nav {
                    flex: 1;
                    overflow-y: auto;
                    padding: 8px 10px;
                }

                .sidebar-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 9px 12px;
                    border-radius: 10px;
                    font-size: 13.5px;
                    font-weight: 500;
                    text-decoration: none;
                    margin-bottom: 1px;
                    transition: background 0.15s, color 0.15s, box-shadow 0.15s;
                    color: rgba(0,0,0,0.5);
                    border: 1px solid transparent;
                    position: relative;
                }

                .sidebar-nav-item:hover {
                    background: rgba(79,70,229,0.05);
                    color: #4f46e5;
                }

                .sidebar-nav-item.active {
                    background: linear-gradient(135deg, rgba(79,70,229,0.10) 0%, rgba(37,99,235,0.07) 100%);
                    color: #4f46e5;
                    border-color: rgba(79,70,229,0.15);
                    box-shadow: 0 1px 4px rgba(79,70,229,0.08);
                }

                /* Active left accent bar */
                .sidebar-nav-item.active::before {
                    content: '';
                    position: absolute;
                    left: -10px;
                    top: 20%;
                    bottom: 20%;
                    width: 3px;
                    border-radius: 0 3px 3px 0;
                    background: linear-gradient(180deg, #4f46e5, #2563eb);
                }

                .sidebar-nav-item .nav-icon {
                    flex-shrink: 0;
                    opacity: 0.7;
                }

                .sidebar-nav-item.active .nav-icon,
                .sidebar-nav-item:hover .nav-icon {
                    opacity: 1;
                }

                /* Bottom logout */
                .sidebar-footer {
                    padding: 10px;
                    border-top: 1px solid rgba(0,0,0,0.06);
                    flex-shrink: 0;
                }

                .sidebar-logout-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 9px 12px;
                    border-radius: 10px;
                    font-size: 13.5px;
                    font-weight: 500;
                    color: rgba(0,0,0,0.45);
                    background: none;
                    border: 1px solid transparent;
                    cursor: pointer;
                    transition: background 0.15s, color 0.15s, border-color 0.15s;
                    text-decoration: none;
                    text-align: left;
                }

                .sidebar-logout-btn:hover {
                    background: rgba(239,68,68,0.07);
                    color: #dc2626;
                    border-color: rgba(239,68,68,0.15);
                }

                /* Hamburger */
                .sidebar-hamburger {
                    position: fixed;
                    top: 14px; left: 14px;
                    z-index: 40;
                    width: 36px; height: 36px;
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    background: #fff;
                    border: 1px solid rgba(0,0,0,0.1);
                    color: rgba(0,0,0,0.6);
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    transition: background 0.15s, box-shadow 0.15s;
                }

                .sidebar-hamburger:hover {
                    background: #f5f3ff;
                    color: #4f46e5;
                }

                .sidebar-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.25);
                    backdrop-filter: blur(2px);
                    z-index: 40;
                }
            `}</style>

            {/* Hamburger — mobile only, when sidebar is closed */}
            {!open && (
                <button className="sidebar-hamburger lg:hidden" onClick={() => setOpen(true)}>
                    <Menu size={18} />
                </button>
            )}

            {/* Overlay */}
            {open && (
                <div className="sidebar-overlay lg:hidden" onClick={() => setOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`sidebar-root${open ? ' is-open' : ''}`}>

                {/* Logo row */}
                <div className="sidebar-logo-row">
                    <div className="sidebar-logo-icon">
                        <Library size={16} color="#fff" strokeWidth={2} />
                    </div>
                    <div>
                        <p className="sidebar-brand-name">Library</p>
                        <p className="sidebar-brand-sub">Admin Panel</p>
                    </div>
                    <button className="sidebar-close-btn lg:hidden" onClick={() => setOpen(false)}>
                        <X size={15} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="sidebar-nav">
                    <p className="sidebar-section-label">Navigation</p>
                    {NAV.map(({ name, href, icon: Icon }) => {
                        const active = isActive(href);
                        return (
                            <Link
                                key={name}
                                href={href}
                                onClick={() => setOpen(false)}
                                className={`sidebar-nav-item${active ? ' active' : ''}`}
                            >
                                <Icon size={17} className="nav-icon" strokeWidth={1.75} />
                                {name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="sidebar-footer">
                    <Link
                        href={route('admin.logout')}
                        method="post"
                        as="button"
                        className="sidebar-logout-btn"
                    >
                        <LogOut size={17} strokeWidth={1.75} />
                        Logout
                    </Link>
                </div>
            </aside>
        </>
    );
}
