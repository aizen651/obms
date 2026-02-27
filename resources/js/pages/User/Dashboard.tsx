import { Head, Link, usePage } from '@inertiajs/react'
import Layout from '@/layouts/Layout'
import {
    BookOpen, BookMarked, Clock, CheckCircle,
    AlertTriangle, ArrowRight, Calendar, User,
    TrendingUp, RotateCcw
} from 'lucide-react'

const StatCard = ({ icon: Icon, label, value, sub, color = 'text-white', lightColor = 'text-zinc-800' }) => (
    <div className="relative overflow-hidden rounded-2xl border shadow-xl
        border-zinc-200 bg-white shadow-zinc-100
        dark:border-white/10 dark:bg-transparent dark:shadow-black/20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-white/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none hidden dark:block" />
        <div className="relative p-5 flex flex-col justify-between gap-6">
            <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border
                    bg-zinc-100 border-zinc-200
                    dark:bg-white/8 dark:border-white/10">
                    <Icon className={`w-5 h-5 ${lightColor} dark:hidden`} />
                    <Icon className={`w-5 h-5 ${color} hidden dark:block`} />
                </div>
                <p className="pl-2 text-xs uppercase tracking-wider text-zinc-400 dark:text-white/40">{label}</p>
            </div>
            <div className="flex flex-col gap-1">
                <p className={`text-2xl font-bold leading-none ${lightColor} dark:hidden`}>{value}</p>
                <p className={`text-2xl font-bold leading-none ${color} hidden dark:block`}>{value}</p>
                {sub && <p className="text-xs text-zinc-400 dark:text-white/30">{sub}</p>}
            </div>
        </div>
    </div>
)

const SectionCard = ({ title, children }) => (
    <div className="relative overflow-hidden rounded-2xl border shadow-xl
        border-zinc-200 bg-white shadow-zinc-100
        dark:border-white/10 dark:bg-transparent dark:shadow-black/20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-white/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none hidden dark:block" />
        <div className="relative p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 text-zinc-400 dark:text-white/50">{title}</h2>
            {children}
        </div>
    </div>
)

const BorrowRow = ({ borrow }) => {
    const isOverdue  = borrow.status === 'overdue'
    const isBorrowed = borrow.status === 'borrowed'

    const badgeClass = isOverdue
        ? 'bg-red-500/10 text-red-500 ring-1 ring-red-500/20 dark:text-red-400'
        : isBorrowed
        ? 'bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200 dark:bg-white/8 dark:text-white/50 dark:ring-white/10'
        : 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400'

    return (
        <div className="flex items-center gap-3 p-3 rounded-xl transition-colors border
            bg-zinc-50 hover:bg-zinc-100 border-zinc-100
            dark:bg-white/3 dark:hover:bg-white/5 dark:border-white/8">
            <div className="w-10 h-14 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border
                bg-zinc-100 border-zinc-200
                dark:bg-gradient-to-br dark:from-white/10 dark:to-white/5 dark:border-white/10">
                {borrow.book?.image_url
                    ? <img src={borrow.book.image_url} alt={borrow.book.title} className="w-full h-full object-cover" />
                    : <BookOpen className="w-4 h-4 text-zinc-300 dark:text-white/30" />
                }
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-zinc-700 dark:text-white/80">{borrow.book?.title || 'Unknown'}</p>
                <p className="text-xs truncate text-zinc-400 dark:text-white/30">{borrow.book?.author}</p>
                <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-zinc-300 dark:text-white/20" />
                    <span className="text-[10px] text-zinc-400 dark:text-white/30">
                        Due: {borrow.due_date ? new Date(borrow.due_date).toLocaleDateString() : 'N/A'}
                    </span>
                </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize flex-shrink-0 ${badgeClass}`}>
                {borrow.status}
            </span>
        </div>
    )
}

export default function Dashboard({ stats, currentBorrows, recentHistory }) {
    const { auth } = usePage().props
    const user = auth.user

    const greeting = () => {
        const h = new Date().getHours()
        return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
    }

    return (
        <Layout>
            <Head title="Dashboard" />

            {/* Ambient blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
                {/* Light */}
                <div className="absolute top-10 left-1/3 w-[500px] h-[300px] bg-blue-100/60 rounded-full blur-[140px] dark:hidden" />
                <div className="absolute bottom-20 right-1/3 w-[400px] h-[300px] bg-violet-100/50 rounded-full blur-[120px] dark:hidden" />
                {/* Dark — your originals */}
                <div className="absolute top-10 left-1/3 w-[500px] h-[300px] bg-slate-600/10 rounded-full blur-[140px] hidden dark:block" />
                <div className="absolute bottom-20 right-1/3 w-[400px] h-[300px] bg-slate-400/10 rounded-full blur-[120px] hidden dark:block" />
            </div>

            <div className="relative space-y-6 pt-16">

                {/* Welcome Header */}
                <div className="relative overflow-hidden rounded-2xl border shadow-2xl
                    border-zinc-200 bg-white shadow-zinc-100
                    dark:border-white/10 dark:bg-transparent dark:shadow-black/30">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-white/30" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-white/3 pointer-events-none hidden dark:block" />
                    {/* Spotlight — dark only */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/3 rounded-full blur-[80px] pointer-events-none hidden dark:block" />

                    <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-xl border
                                bg-zinc-100 border-zinc-200 shadow-zinc-200
                                dark:bg-gradient-to-br dark:from-white/15 dark:to-white/5 dark:border-white/10 dark:shadow-black/20">
                                {user?.user_image
                                    ? <img src={`/storage/${user.user_image}`} alt={user.firstname} className="w-full h-full object-cover" />
                                    : <User className="w-7 h-7 text-zinc-400 dark:text-white/50" />
                                }
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest text-zinc-400 dark:text-white/40">{greeting()}</p>
                                {/* Light: solid dark text | Dark: gradient text — your original */}
                                <h1 className="text-2xl font-bold text-zinc-900 dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:via-white/90 dark:to-white/50 dark:bg-clip-text">
                                    {user?.firstname} {user?.lastname}
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] capitalize font-medium border
                                        bg-zinc-100 border-zinc-200 text-zinc-500
                                        dark:bg-white/8 dark:border-white/10 dark:text-white/50">
                                        {user?.role}
                                    </span>
                                    {user?.member_id && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border
                                            bg-zinc-100 border-zinc-200 text-zinc-500
                                            dark:bg-white/8 dark:border-white/10 dark:text-white/50">
                                            {user.member_id}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Update Profile button */}
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg active:scale-95 flex-shrink-0
                                bg-zinc-900 text-white hover:bg-zinc-700 shadow-zinc-300
                                dark:bg-gradient-to-r dark:from-white/90 dark:to-white dark:text-zinc-900 dark:hover:from-white dark:hover:to-white dark:shadow-black/20"
                        >
                            <User className="w-4 h-4" /> Update Profile
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <StatCard
                        icon={BookMarked}
                        label="Currently Borrowing"
                        value={stats.currently_borrowing}
                        sub="active loans"
                        color="text-white"
                        lightColor="text-zinc-800"
                    />
                    <StatCard
                        icon={AlertTriangle}
                        label="Overdue"
                        value={stats.overdue}
                        sub={stats.overdue > 0 ? 'please return soon' : 'all good!'}
                        color={stats.overdue > 0 ? 'text-red-400' : 'text-emerald-400'}
                        lightColor={stats.overdue > 0 ? 'text-red-500' : 'text-emerald-600'}
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="Total Returned"
                        value={stats.total_returned}
                        sub="books returned"
                        color="text-emerald-400"
                        lightColor="text-emerald-600"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Total Borrowed"
                        value={stats.total_borrowed}
                        sub="all time"
                        color="text-white/70"
                        lightColor="text-zinc-500"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Currently Borrowing */}
                    <SectionCard title="Currently Borrowing">
                        {currentBorrows.length > 0 ? (
                            <div className="space-y-2">
                                {currentBorrows.map(b => <BorrowRow key={b.id} borrow={b} />)}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border
                                    bg-zinc-100 border-zinc-200
                                    dark:bg-white/5 dark:border-white/8">
                                    <BookMarked className="w-5 h-5 text-zinc-300 dark:text-white/20" />
                                </div>
                                <p className="text-sm text-zinc-400 dark:text-white/30">No active borrows</p>
                                <Link href="/books" className="text-xs underline underline-offset-2 mt-1 inline-block transition-colors
                                    text-zinc-400 hover:text-zinc-800
                                    dark:text-white/50 dark:hover:text-white">
                                    Browse books to borrow
                                </Link>
                            </div>
                        )}
                    </SectionCard>

                    {/* Borrow History */}
                    <SectionCard title="Recent History">
                        {recentHistory.length > 0 ? (
                            <div className="space-y-2">
                                {recentHistory.map(b => <BorrowRow key={b.id} borrow={b} />)}
                                <Link
                                    href="/transactions"
                                    className="flex items-center justify-center gap-2 w-full mt-3 py-2.5 rounded-xl text-xs transition-all border
                                        bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-400 hover:text-zinc-700
                                        dark:bg-white/5 dark:hover:bg-white/8 dark:border-white/8 dark:text-white/50 dark:hover:text-white/80"
                                >
                                    View all history <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border
                                    bg-zinc-100 border-zinc-200
                                    dark:bg-white/5 dark:border-white/8">
                                    <RotateCcw className="w-5 h-5 text-zinc-300 dark:text-white/20" />
                                </div>
                                <p className="text-sm text-zinc-400 dark:text-white/30">No borrow history yet</p>
                            </div>
                        )}
                    </SectionCard>
                </div>

                {/* Overdue Warning */}
                {stats.overdue > 0 && (
                    <div className="relative overflow-hidden rounded-2xl border shadow-xl
                        bg-red-50 border-red-200 shadow-red-100
                        dark:bg-transparent dark:border-red-500/20 dark:shadow-black/20">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent dark:via-red-400/30" />
                        <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
                        <div className="relative p-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border
                                bg-red-100 border-red-200
                                dark:bg-red-500/10 dark:border-red-500/20">
                                <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-red-500 dark:text-red-400">
                                    You have {stats.overdue} overdue {stats.overdue === 1 ? 'book' : 'books'}
                                </p>
                                <p className="text-xs mt-0.5 text-red-400/70 dark:text-white/40">
                                    Please return them as soon as possible to avoid penalties.
                                </p>
                            </div>
                            <Link
                                href="/transactions"
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-colors flex-shrink-0 border
                                    bg-red-100 hover:bg-red-200 border-red-200 text-red-500
                                    dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:border-red-500/20 dark:text-red-400"
                            >
                                View <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    )
}