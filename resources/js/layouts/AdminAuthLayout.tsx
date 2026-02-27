import React from 'react';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import { Link, usePage } from '@inertiajs/react';

export default function AdminAuthLayout({ children, header }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

                .admin-layout-root {
                    display: flex;
                    min-height: 100vh;
                    background: #f5f6fa;
                    background-image:
                        radial-gradient(ellipse 70% 50% at 0% 0%,   rgba(79,70,229,0.07) 0%, transparent 60%),
                        radial-gradient(ellipse 50% 40% at 100% 100%, rgba(37,99,235,0.05) 0%, transparent 60%);
                    font-family: 'DM Sans', sans-serif;
                    position: relative;
                    overflow: hidden;
                }

                .admin-layout-root::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background-image: radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px);
                    background-size: 28px 28px;
                    pointer-events: none;
                    z-index: 0;
                }

                .admin-ambient {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 0;
                    overflow: hidden;
                }

                .admin-ambient-1 {
                    position: absolute;
                    top: -120px; left: -80px;
                    width: 560px; height: 560px;
                    border-radius: 50%;
                    background: radial-gradient(ellipse, rgba(79,70,229,0.08) 0%, transparent 70%);
                    animation: drift1 18s ease-in-out infinite alternate;
                }

                .admin-ambient-2 {
                    position: absolute;
                    bottom: -100px; right: -60px;
                    width: 480px; height: 480px;
                    border-radius: 50%;
                    background: radial-gradient(ellipse, rgba(37,99,235,0.06) 0%, transparent 70%);
                    animation: drift2 22s ease-in-out infinite alternate;
                }

                @keyframes drift1 {
                    from { transform: translate(0, 0) scale(1); }
                    to   { transform: translate(40px, 30px) scale(1.08); }
                }
                @keyframes drift2 {
                    from { transform: translate(0, 0) scale(1); }
                    to   { transform: translate(-30px, -40px) scale(1.05); }
                }

                .admin-main {
                    position: relative;
                    z-index: 10;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                }

                .admin-topbar {
                    height: 64px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 32px;
                    flex-shrink: 0;
                    position: sticky;
                    top: 0;
                    z-index: 20;
                    background: rgba(255,255,255,0.80);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border-bottom: 1px solid rgba(0,0,0,0.07);
                    box-shadow: 0 1px 0 rgba(79,70,229,0.08), 0 2px 12px rgba(0,0,0,0.04);
                }

                .admin-topbar::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, transparent 0%, #4f46e5 30%, #2563eb 70%, transparent 100%);
                    opacity: 0.7;
                }

                .topbar-left {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-left: 56px;
                }

                @media (min-width: 1024px) {
                    .topbar-left { margin-left: 0; }
                }

                .topbar-breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .topbar-dot {
                    width: 6px; height: 6px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #4f46e5, #2563eb);
                    box-shadow: 0 0 8px rgba(79,70,229,0.6);
                    flex-shrink: 0;
                }

                .topbar-title {
                    font-family: 'DM Serif Display', serif;
                    font-size: 17px;
                    color: #1e1b4b;
                    letter-spacing: -0.01em;
                }

                .topbar-welcome {
                    font-size: 13px;
                    color: rgba(0,0,0,0.38);
                    font-weight: 300;
                }

                .topbar-welcome span {
                    color: rgba(0,0,0,0.65);
                    font-weight: 500;
                }

                .topbar-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 6px 14px 6px 6px;
                    border-radius: 100px;
                    border: 1px solid rgba(0,0,0,0.09);
                    background: #fff;
                    text-decoration: none;
                    transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
                    cursor: pointer;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
                }

                .topbar-profile:hover {
                    background: #f5f3ff;
                    border-color: rgba(79,70,229,0.3);
                    box-shadow: 0 0 0 3px rgba(79,70,229,0.08), 0 1px 4px rgba(0,0,0,0.06);
                }

                .profile-avatar {
                    width: 32px; height: 32px;
                    border-radius: 50%;
                    overflow: hidden;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 12px;
                    font-weight: 600;
                    color: #fff;
                    flex-shrink: 0;
                    background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
                    box-shadow: 0 0 0 2px rgba(79,70,229,0.4);
                }

                .profile-avatar img {
                    width: 100%; height: 100%;
                    object-fit: cover;
                }

                .profile-info {
                    display: none;
                    text-align: left;
                }

                @media (min-width: 768px) {
                    .profile-info { display: block; }
                }

                .profile-name {
                    font-size: 13px;
                    font-weight: 500;
                    color: #1e1b4b;
                    line-height: 1;
                    white-space: nowrap;
                }

                .profile-role {
                    font-size: 11px;
                    color: rgba(0,0,0,0.38);
                    margin-top: 3px;
                    text-transform: capitalize;
                    letter-spacing: 0.03em;
                }

                .profile-chevron {
                    color: rgba(0,0,0,0.2);
                    transition: color 0.2s;
                }

                .topbar-profile:hover .profile-chevron {
                    color: rgba(79,70,229,0.6);
                }

                .admin-content {
                    flex: 1;
                    overflow-x: hidden;
                    overflow-y: auto;
                    padding: 32px;
                }

                @media (max-width: 640px) {
                    .admin-content { padding: 20px 16px; }
                    .admin-topbar { padding: 0 16px; }
                }
            `}</style>

            <div className="admin-layout-root">

                {/* Ambient glows */}
                <div className="admin-ambient" aria-hidden>
                    <div className="admin-ambient-1" />
                    <div className="admin-ambient-2" />
                </div>

                {/* Sidebar */}
                <AdminSidebar />

                {/* Main */}
                <div className="admin-main">

                    {/* Topbar */}
                    <header className="admin-topbar">
                        <div className="topbar-left">
                            <div className="topbar-breadcrumb">
                                <span className="topbar-dot" />
                                {header
                                    ? <h1 className="topbar-title">{header}</h1>
                                    : <p className="topbar-welcome">
                                        Welcome back, <span>{user.firstname}</span>
                                      </p>
                                }
                            </div>
                        </div>

                        <Link href={route('admin.profile')} className="topbar-profile">
                            <div className="profile-avatar">
                                {user.avatar_url
        ? <img src={user.avatar_url} alt="Profile" />
        : <span>{user.firstname?.charAt(0)}{user.lastname?.charAt(0)}</span>
    }
                            </div>
                            <div className="profile-info">
                                <p className="profile-name">{user.firstname} {user.lastname}</p>
                                <p className="profile-role">{user.role}</p>
                            </div>
                            <svg className="profile-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                            </svg>
                        </Link>
                    </header>

                    {/* Content */}
                    <main className="admin-content">
                        {children}
                    </main>

                </div>
            </div>
        </>
    );
}
