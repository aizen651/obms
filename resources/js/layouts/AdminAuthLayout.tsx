import React from 'react';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import { Link, usePage } from '@inertiajs/react';
import { Toaster } from 'sonner';

export default function AdminAuthLayout({ children, header }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%)' }}>

            {/* Ambient blobs */}
            <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full opacity-30"
                    style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 70%)' }} />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full opacity-20"
                    style={{ background: 'radial-gradient(ellipse, rgba(251,191,36,0.1) 0%, transparent 70%)' }} />
            </div>

            {/* Sidebar */}
            <AdminSidebar />

            {/* Main */}
            <div className="relative z-10 flex-1 flex flex-col min-w-0">

                {/* Top bar */}
                <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b shrink-0"
                    style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>

                    <div className="ml-14 lg:ml-0">
                        {header
                            ? <h1 className="text-lg font-bold text-white">{header}</h1>
                            : <p className="text-sm text-white/40">Welcome back, <span className="text-white/70 font-medium">{user.firstname}</span></p>
                        }
                    </div>

                    <Link href={route('admin.profile')}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all hover:bg-white/8"
                        style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-semibold text-sm text-white shrink-0"
                            style={{ background: 'linear-gradient(135deg, #7c3aed, #f59e0b)' }}>
                            {user.user_image
                                ? <img src={`/storage/${user.user_image}`} alt="Profile" className="w-full h-full object-cover" />
                                : <span>{user.firstname?.charAt(0)}{user.lastname?.charAt(0)}</span>
                            }
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-white leading-none">{user.firstname} {user.lastname}</p>
                            <p className="text-[11px] text-white/40 mt-0.5 capitalize">{user.role}</p>
                        </div>
                    </Link>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            <Toaster
                position="top-right"
                toastOptions={{
                    style: { background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' },
                }}
            />
        </div>
    );
}
