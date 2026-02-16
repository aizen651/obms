import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import { AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, GraduationCap, BookOpen, BookCheck, BookX, Clock, AlertCircle, ShieldCheck, BookMarked, Download } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, iconBg }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-amber-100">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-600 mb-1">{title}</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">{value || 0}</p>
                <div className="h-1 w-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mt-2"></div>
            </div>
            <div className={`w-16 h-16 bg-gradient-to-br ${iconBg} rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 text-white" />
            </div>
        </div>
    </div>
);

const MiniStatCard = ({ title, value, icon: Icon, gradient }) => (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-5 shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-white/20`}>
        <div className="p-2 bg-white/90 rounded-lg shadow w-fit mb-3">
            <Icon className="w-6 h-6 text-amber-600" />
        </div>
        <p className="text-3xl font-bold text-white mb-1">{value || 0}</p>
        <p className="text-xs text-white/90">{title}</p>
    </div>
);

const QuickAction = ({ title, description, icon: Icon, gradient, href }) => (
    <Link href={href} className={`flex items-center gap-4 p-5 bg-gradient-to-r ${gradient} rounded-xl hover:scale-105 hover:shadow-xl transition-all border border-white/30 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
        <div className="relative w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg hover:rotate-6 transition-transform">
            <Icon className="w-7 h-7 text-amber-600" />
        </div>
        <div>
            <p className="font-bold text-gray-800 text-lg">{title}</p>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </Link>
);

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white p-4 rounded-xl shadow-2xl border-2 border-amber-200">
            {payload.map((entry, i) => (
                <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
                    {entry.name}: {entry.value}
                </p>
            ))}
        </div>
    );
};

const RadarTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const data = payload[0]?.payload;
    if (!data) return null;
    return (
        <div className="bg-white p-4 rounded-xl shadow-2xl border-2 border-amber-200">
            <p className="font-bold text-gray-800 mb-2">{data.category}</p>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <p className="text-sm font-semibold text-amber-600">Books: <span className="text-gray-800">{data.books}</span></p>
            </div>
        </div>
    );
};

const SectionHeader = ({ title }) => (
    <div className="flex items-center gap-2 mb-6">
        <div className="h-8 w-1 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    </div>
);

export default function Dashboard() {
    const { auth, stats = {}, borrowingTrend = [], categoryDistribution = [] } = usePage().props;

    const safeStats = { 
        total_users: 0, total_students: 0, total_teachers: 0, total_admins: 0, 
        total_books: 0, total_borrowed: 0, total_returned: 0, total_cancelled: 0, 
        total_overdue: 0, total_lost: 0, ...stats 
    };

    const hasCategories = categoryDistribution.length > 0 && categoryDistribution[0]?.category !== 'No Categories';
    const radarData = categoryDistribution.filter(cat => cat?.category && cat?.count !== undefined).map(cat => ({ category: cat.category, books: cat.count }));

    const userStats = [
        { title: 'Total Users', value: safeStats.total_users, icon: Users, iconBg: 'from-amber-400 to-orange-500' },
        { title: 'Students', value: safeStats.total_students, icon: GraduationCap, iconBg: 'from-orange-400 to-amber-500' },
        { title: 'Teachers', value: safeStats.total_teachers, icon: BookMarked, iconBg: 'from-amber-500 to-orange-600' },
        { title: 'Admins', value: safeStats.total_admins, icon: ShieldCheck, iconBg: 'from-orange-500 to-amber-600' }
    ];

    const bookStats = [
        { title: 'Total Books', value: safeStats.total_books, icon: BookOpen, gradient: 'from-amber-400 to-orange-500' },
        { title: 'Borrowed', value: safeStats.total_borrowed, icon: BookCheck, gradient: 'from-orange-400 to-amber-500' },
        { title: 'Returned', value: safeStats.total_returned, icon: BookCheck, gradient: 'from-amber-500 to-orange-600' },
        { title: 'Cancelled', value: safeStats.total_cancelled, icon: BookX, gradient: 'from-orange-500 to-red-500' },
        { title: 'Overdue', value: safeStats.total_overdue, icon: Clock, gradient: 'from-red-400 to-orange-500' },
        { title: 'Lost', value: safeStats.total_lost, icon: AlertCircle, gradient: 'from-gray-400 to-gray-600' }
    ];

    const quickActions = [
        { title: 'Export Database', description: 'Download system data', icon: Download, gradient: 'from-orange-50 to-amber-50', href: '/admin/export' }
    ];

    return (
        <AdminAuthLayout>
            <Head title="Dashboard" />
            
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
                <header className="bg-gradient-to-r from-white via-amber-50 to-white border-b-2 border-amber-200 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">Admin Dashboard</h1>
                                <p className="text-sm text-gray-600">Welcome back, <span className="text-amber-600">{auth.user.firstname} {auth.user.lastname}</span></p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    <section>
                        <SectionHeader title="User Overview" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {userStats.map((stat, i) => <StatCard key={i} {...stat} />)}
                        </div>
                    </section>

                    <section>
                        <SectionHeader title="Book Statistics" />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {bookStats.map((stat, i) => <MiniStatCard key={i} {...stat} />)}
                        </div>
                    </section>

                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-amber-100">
                            <div className="flex items-center gap-2 mb-4">
                                <BookCheck className="w-6 h-6 text-amber-600" />
                                <h3 className="text-xl font-bold text-gray-800">Borrowing Trend</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">Last 6 Months Performance</p>
                            {borrowingTrend.length > 0 ? (
                                <ResponsiveContainer width="100%" height={320}>
                                    <AreaChart data={borrowingTrend}>
                                        <defs>
                                            <linearGradient id="colorBorrowed" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                                            </linearGradient>
                                            <linearGradient id="colorReturned" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#FED7AA" opacity={0.5} />
                                        <XAxis dataKey="month" stroke="#92400E" tick={{ fontSize: 12 }} />
                                        <YAxis stroke="#92400E" tick={{ fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                        <Area type="monotone" dataKey="borrowed" stroke="#F59E0B" fillOpacity={1} fill="url(#colorBorrowed)" name="Borrowed" strokeWidth={2} />
                                        <Area type="monotone" dataKey="returned" stroke="#10B981" fillOpacity={1} fill="url(#colorReturned)" name="Returned" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-80 bg-amber-50 rounded-xl">
                                    <p className="text-gray-500">No data available</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-amber-100">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="w-6 h-6 text-amber-600" />
                                <h3 className="text-xl font-bold text-gray-800">Category Distribution</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">Books by Category</p>
                            {hasCategories ? (
                                <ResponsiveContainer width="100%" height={320}>
                                    <RadarChart data={radarData}>
                                        <PolarGrid stroke="#FED7AA" strokeDasharray="3 3" />
                                        <PolarAngleAxis dataKey="category" tick={{ fill: '#92400E', fontSize: 11, fontWeight: 500 }} tickFormatter={(value) => value.length > 12 ? value.substring(0, 12) + '...' : value} />
                                        <PolarRadiusAxis angle={90} domain={[0, 'auto']} tick={{ fill: '#92400E', fontSize: 10 }} stroke="#FED7AA" />
                                        <Radar name="Books" dataKey="books" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} strokeWidth={2} />
                                        <Tooltip content={<RadarTooltip />} cursor={{ fill: 'rgba(245, 158, 11, 0.1)' }} />
                                        <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
                                    </RadarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-80 bg-amber-50 rounded-xl">
                                    <div className="text-center">
                                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No categories available</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-8 shadow-xl border-2 border-amber-100">
                            <SectionHeader title="Backup Database" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {quickActions.map((action, i) => <QuickAction key={i} {...action} />)}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </AdminAuthLayout>
    );
}