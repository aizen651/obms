import React from 'react';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import { Link, usePage } from '@inertiajs/react';

export default function AdminAuthLayout({ children, header }) {
    const { auth } = usePage().props;

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-amber-100 shadow-sm h-20">
                    <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                        <div className="flex items-center gap-4 ml-16 lg:ml-0">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{header}</h1>
                                <p className="text-sm text-gray-600">
                                    Welcome back, {auth.user.firstname}!
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {/* User Avatar & Info */}
                            <Link href={route('admin.profile')} className="flex items-center gap-3 hover:bg-amber-50 rounded-lg p-2 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold shadow-md">
                                    {auth.user.user_image ? (
                                        <img 
                                            src={`/storage/${auth.user.user_image}`} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover rounded-full" 
                                        />
                                    ) : (
                                        <span className="text-sm">
                                            {auth.user.firstname?.charAt(0)}{auth.user.lastname?.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-gray-800">
                                        {auth.user.firstname} {auth.user.lastname}
                                    </p>
                                    <p className="text-xs text-gray-500">{auth.user.role}</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
