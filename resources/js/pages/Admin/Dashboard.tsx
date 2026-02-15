import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminAuthLayout from '@/layouts/AdminAuthLayout'

export default function Dashboard() {
    const { auth, stats } = usePage().props;

    // Sample chart data - replace with real data from backend
    const borrowingTrend = [
        { month: 'Jan', borrowed: 45, returned: 40 },
        { month: 'Feb', borrowed: 52, returned: 48 },
        { month: 'Mar', borrowed: 61, returned: 55 },
        { month: 'Apr', borrowed: 58, returned: 60 },
        { month: 'May', borrowed: 70, returned: 65 },
        { month: 'Jun', borrowed: 68, returned: 70 },
    ];

    const categoryDistribution = [
        { category: 'Fiction', count: 120, color: 'bg-blue-500' },
        { category: 'Science', count: 85, color: 'bg-green-500' },
        { category: 'History', count: 65, color: 'bg-yellow-500' },
        { category: 'Technology', count: 95, color: 'bg-purple-500' },
        { category: 'Arts', count: 45, color: 'bg-pink-500' },
    ];

    const maxCategory = Math.max(...categoryDistribution.map(c => c.count));

    return (
        <>
          <AdminAuthLayout>
            <Head title="Admin Dashboard" />
            
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
                {/* Header */}
                <header className="bg-white border-b border-amber-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                                    <p className="text-sm text-gray-600">
                                        Welcome, {auth.user.firstname} {auth.user.lastname}
                                    </p>
                                </div>
                            </div>
                            
                            
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* User Stats Grid */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">User Statistics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Total Users */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Total Users</p>
                                        <p className="text-3xl font-bold text-blue-600">{stats.total_users}</p>
                                    </div>
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                                        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Total Students */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Total Students</p>
                                        <p className="text-3xl font-bold text-amber-600">{stats.total_students}</p>
                                    </div>
                                    <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                                        <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Total Teachers */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Total Teachers</p>
                                        <p className="text-3xl font-bold text-orange-600">{stats.total_teachers}</p>
                                    </div>
                                    <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                                        <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Total Admins */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Total Admins</p>
                                        <p className="text-3xl font-bold text-purple-600">{stats.total_admins}</p>
                                    </div>
                                    <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                                        <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Book Statistics */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Book Statistics</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {/* Total Books */}
                            <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-blue-500">
                                <div className="flex items-center justify-between mb-2">
                                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">{stats.total_books || 0}</p>
                                <p className="text-xs text-gray-600 mt-1">Total Books</p>
                            </div>

                            {/* Total Borrowed */}
                            <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-amber-500">
                                <div className="flex items-center justify-between mb-2">
                                    <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">{stats.total_borrowed || 0}</p>
                                <p className="text-xs text-gray-600 mt-1">Borrowed</p>
                            </div>

                            {/* Total Returned */}
                            <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-green-500">
                                <div className="flex items-center justify-between mb-2">
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">{stats.total_returned || 0}</p>
                                <p className="text-xs text-gray-600 mt-1">Returned</p>
                            </div>

                            {/* Total Cancelled */}
                            <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-red-500">
                                <div className="flex items-center justify-between mb-2">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">{stats.total_cancelled || 0}</p>
                                <p className="text-xs text-gray-600 mt-1">Cancelled</p>
                            </div>

                            {/* Total Overdue */}
                            <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-orange-500">
                                <div className="flex items-center justify-between mb-2">
                                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">{stats.total_overdue || 0}</p>
                                <p className="text-xs text-gray-600 mt-1">Overdue</p>
                            </div>

                            {/* Lost Books */}
                            <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-gray-500">
                                <div className="flex items-center justify-between mb-2">
                                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">{stats.total_lost || 0}</p>
                                <p className="text-xs text-gray-600 mt-1">Lost</p>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Borrowing Trend Chart */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Borrowing Trend (Last 6 Months)</h3>
                            <div className="space-y-2">
                                {borrowingTrend.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-600 w-12">{item.month}</span>
                                        <div className="flex-1 flex gap-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                                                        <div 
                                                            className="bg-gradient-to-r from-amber-400 to-amber-600 h-full flex items-center justify-end pr-2 transition-all"
                                                            style={{ width: `${(item.borrowed / 80) * 100}%` }}
                                                        >
                                                            <span className="text-xs text-white font-semibold">{item.borrowed}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                                                        <div 
                                                            className="bg-gradient-to-r from-green-400 to-green-600 h-full flex items-center justify-end pr-2 transition-all"
                                                            style={{ width: `${(item.returned / 80) * 100}%` }}
                                                        >
                                                            <span className="text-xs text-white font-semibold">{item.returned}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                    <span className="text-xs text-gray-600">Borrowed</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-xs text-gray-600">Returned</span>
                                </div>
                            </div>
                        </div>

                        {/* Category Distribution Chart */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Books by Category</h3>
                            <div className="space-y-3">
                                {categoryDistribution.map((item, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">{item.category}</span>
                                            <span className="text-sm font-bold text-gray-800">{item.count}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                            <div 
                                                className={`${item.color} h-full transition-all duration-500`}
                                                style={{ width: `${(item.count / maxCategory) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 rounded-xl transition-colors text-left border border-amber-200">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Manage Users</p>
                                    <p className="text-sm text-gray-600">View and edit user accounts</p>
                                </div>
                            </button>

                            <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-colors text-left border border-blue-200">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Manage Books</p>
                                    <p className="text-sm text-gray-600">Add or modify books</p>
                                </div>
                            </button>

                            <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl transition-colors text-left border border-green-200">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Borrowing Records</p>
                                    <p className="text-sm text-gray-600">Track book borrowing</p>
                                </div>
                            </button>

                            <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-colors text-left border border-purple-200">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Reports & Analytics</p>
                                    <p className="text-sm text-gray-600">View detailed reports</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
          </AdminAuthLayout>
        </>
    );
}
                     