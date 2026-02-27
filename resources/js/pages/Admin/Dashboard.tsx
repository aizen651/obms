import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import { AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, GraduationCap, BookOpen, BookCheck, BookX, Clock, AlertCircle, ShieldCheck, BookMarked, Download } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '24px',
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'box-shadow 0.2s, transform 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(79,70,229,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
        <div>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{title}</p>
            <p style={{ fontSize: 36, fontWeight: 700, color: '#1e1b4b', lineHeight: 1 }}>{value || 0}</p>
            <div style={{ height: 3, width: 36, background: color, borderRadius: 99, marginTop: 10 }} />
        </div>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={24} style={{ color }} strokeWidth={1.75} />
        </div>
    </div>
);

const MiniStatCard = ({ title, value, icon: Icon, color }) => (
    <div style={{
        background: '#fff',
        borderRadius: 14,
        padding: '20px 18px',
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.2s, transform 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.10)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Icon size={18} style={{ color }} strokeWidth={1.75} />
        </div>
        <p style={{ fontSize: 28, fontWeight: 700, color: '#1e1b4b', lineHeight: 1, marginBottom: 6 }}>{value || 0}</p>
        <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', fontWeight: 500 }}>{title}</p>
    </div>
);

const QuickAction = ({ title, description, icon: Icon, href }) => (
    <Link href={href} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '20px',
        background: '#fff',
        borderRadius: 14,
        border: '1px solid rgba(79,70,229,0.12)',
        textDecoration: 'none',
        transition: 'box-shadow 0.2s, transform 0.2s, background 0.2s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
        <div style={{ width: 52, height: 52, borderRadius: 13, background: 'linear-gradient(135deg, #4f46e5, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>
            <Icon size={22} color="#fff" strokeWidth={1.75} />
        </div>
        <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#1e1b4b', marginBottom: 3 }}>{title}</p>
            <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)' }}>{description}</p>
        </div>
    </Link>
);

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid rgba(79,70,229,0.15)' }}>
            {payload.map((entry, i) => (
                <p key={i} style={{ fontSize: 13, fontWeight: 600, color: entry.color, margin: '2px 0' }}>
                    {entry.name}: <span style={{ color: '#1e1b4b' }}>{entry.value}</span>
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
        <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid rgba(79,70,229,0.15)' }}>
            <p style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 6, fontSize: 13 }}>{data.category}</p>
            <p style={{ fontSize: 13, color: '#4f46e5', fontWeight: 600 }}>Books: <span style={{ color: '#1e1b4b' }}>{data.books}</span></p>
        </div>
    );
};

const SectionHeader = ({ title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ height: 24, width: 4, background: 'linear-gradient(180deg, #4f46e5, #2563eb)', borderRadius: 99 }} />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e1b4b', letterSpacing: '-0.01em' }}>{title}</h2>
    </div>
);

const ChartCard = ({ icon: Icon, title, subtitle, children, emptyIcon: EmptyIcon, isEmpty }) => (
    <div style={{ background: '#fff', borderRadius: 18, padding: '24px', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(79,70,229,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={17} color="#4f46e5" strokeWidth={1.75} />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e1b4b' }}>{title}</h3>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.38)', marginBottom: 20, marginLeft: 44 }}>{subtitle}</p>
        {isEmpty ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, background: '#fafafa', borderRadius: 12 }}>
                {EmptyIcon && <EmptyIcon size={48} color="rgba(0,0,0,0.12)" strokeWidth={1.25} style={{ marginBottom: 12 }} />}
                <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.3)' }}>No data available</p>
            </div>
        ) : children}
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
    const radarData = categoryDistribution.filter(c => c?.category && c?.count !== undefined).map(c => ({ category: c.category, books: c.count }));

    const userStats = [
        { title: 'Total Users',  value: safeStats.total_users,     icon: Users,        color: '#4f46e5' },
        { title: 'Students',     value: safeStats.total_students,   icon: GraduationCap, color: '#2563eb' },
        { title: 'Teachers',     value: safeStats.total_teachers,   icon: BookMarked,   color: '#0891b2' },
        { title: 'Admins',       value: safeStats.total_admins,     icon: ShieldCheck,  color: '#7c3aed' },
    ];

    const bookStats = [
        { title: 'Total Books', value: safeStats.total_books,      icon: BookOpen,  color: '#4f46e5' },
        { title: 'Borrowed',    value: safeStats.total_borrowed,   icon: BookCheck, color: '#2563eb' },
        { title: 'Returned',    value: safeStats.total_returned,   icon: BookCheck, color: '#059669' },
        { title: 'Cancelled',   value: safeStats.total_cancelled,  icon: BookX,     color: '#d97706' },
        { title: 'Overdue',     value: safeStats.total_overdue,    icon: Clock,     color: '#dc2626' },
        { title: 'Lost',        value: safeStats.total_lost,       icon: AlertCircle, color: '#6b7280' },
    ];

    return (
        <AdminAuthLayout>
            <Head title="Dashboard" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
                .dash-root { font-family: 'DM Sans', sans-serif; }

                .stat-grid-4 {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 18px;
                }
                .stat-grid-6 {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 14px;
                }
                .chart-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                @media (max-width: 1024px) {
                    .stat-grid-4 { grid-template-columns: repeat(2, 1fr); }
                    .stat-grid-6 { grid-template-columns: repeat(3, 1fr); }
                    .chart-grid  { grid-template-columns: 1fr; }
                }
                @media (max-width: 640px) {
                    .stat-grid-4 { grid-template-columns: 1fr; }
                    .stat-grid-6 { grid-template-columns: repeat(2, 1fr); }
                }
            `}</style>

            <div className="dash-root" style={{ minHeight: '100vh' }}>

                {/* Page header */}
                <div style={{
                    background: '#fff',
                    borderRadius: 18,
                    padding: '24px 28px',
                    marginBottom: 28,
                    border: '1px solid rgba(0,0,0,0.07)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #4f46e5, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(79,70,229,0.3)', flexShrink: 0 }}>
                        <Users size={24} color="#fff" strokeWidth={1.75} />
                    </div>
                    <div>
                        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1e1b4b', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Admin Dashboard</h1>
                        <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)', marginTop: 4 }}>
                            Welcome back, <span style={{ color: '#4f46e5', fontWeight: 600 }}>{auth.user.firstname} {auth.user.lastname}</span>
                        </p>
                    </div>
                    {/* Decorative pill */}
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(79,70,229,0.07)', border: '1px solid rgba(79,70,229,0.14)', borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 500, color: '#4f46e5' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 2px rgba(34,197,94,0.25)' }} />
                        System Online
                    </div>
                </div>

                {/* User stats */}
                <div style={{ marginBottom: 28 }}>
                    <SectionHeader title="User Overview" />
                    <div className="stat-grid-4">
                        {userStats.map((s, i) => <StatCard key={i} {...s} />)}
                    </div>
                </div>

                {/* Book stats */}
                <div style={{ marginBottom: 28 }}>
                    <SectionHeader title="Book Statistics" />
                    <div className="stat-grid-6">
                        {bookStats.map((s, i) => <MiniStatCard key={i} {...s} />)}
                    </div>
                </div>

                {/* Charts */}
                <div className="chart-grid" style={{ marginBottom: 28 }}>
                    <ChartCard
                        icon={BookCheck}
                        title="Borrowing Trend"
                        subtitle="Last 6 months performance"
                        isEmpty={borrowingTrend.length === 0}
                        emptyIcon={BookCheck}
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={borrowingTrend}>
                                <defs>
                                    <linearGradient id="gBorrowed" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gReturned" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#059669" stopOpacity={0.18} />
                                        <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                                <XAxis dataKey="month" stroke="rgba(0,0,0,0.3)" tick={{ fontSize: 11, fontFamily: 'DM Sans' }} />
                                <YAxis stroke="rgba(0,0,0,0.3)" tick={{ fontSize: 11, fontFamily: 'DM Sans' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12, fontFamily: 'DM Sans' }} />
                                <Area type="monotone" dataKey="borrowed" stroke="#4f46e5" fill="url(#gBorrowed)" name="Borrowed" strokeWidth={2} dot={false} />
                                <Area type="monotone" dataKey="returned" stroke="#059669" fill="url(#gReturned)" name="Returned" strokeWidth={2} dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard
                        icon={BookOpen}
                        title="Category Distribution"
                        subtitle="Books by category"
                        isEmpty={!hasCategories}
                        emptyIcon={BookOpen}
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="rgba(79,70,229,0.12)" strokeDasharray="3 3" />
                                <PolarAngleAxis dataKey="category" tick={{ fill: 'rgba(0,0,0,0.5)', fontSize: 11, fontFamily: 'DM Sans' }} tickFormatter={v => v.length > 12 ? v.slice(0, 12) + '…' : v} />
                                <PolarRadiusAxis angle={90} domain={[0, 'auto']} tick={{ fill: 'rgba(0,0,0,0.3)', fontSize: 10 }} stroke="rgba(79,70,229,0.08)" />
                                <Radar name="Books" dataKey="books" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.15} strokeWidth={2} />
                                <Tooltip content={<RadarTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12, fontFamily: 'DM Sans' }} iconType="circle" />
                            </RadarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                {/* Quick Actions */}
                <div style={{ background: '#fff', borderRadius: 18, padding: '24px 28px', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                    <SectionHeader title="Backup Database" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                        <QuickAction title="Export Database" description="Download system data as a backup" icon={Download} href="/admin/export" />
                    </div>
                </div>
            </div>
        </AdminAuthLayout>
    );
}
