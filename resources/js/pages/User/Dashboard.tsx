import { Head, Link, usePage } from '@inertiajs/react'
import Layout from '@/layouts/Layout'
import {
    BookOpen, BookMarked, Clock, CheckCircle,
    AlertTriangle, ArrowRight, Calendar, User,
     TrendingUp, RotateCcw
} from 'lucide-react'

const StatCard = ({ icon: Icon, label, value, sub, color = 'text-white' }) => (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-xl shadow-black/20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none" />
        <div className="relative p-5 flex flex-col justify-between gap-6">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="pl-2 text-xs text-white/40 uppercase tracking-wider">{label}</p>
            </div>
            <div className="flex flex-col gap-1">
                <p className={`text-2xl font-bold leading-none ${color}`}>{value}</p>
                {sub && <p className="text-xs text-white/30">{sub}</p>}
            </div>
        </div>
    </div>
)

const SectionCard = ({ title, children }) => (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-xl shadow-black/20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none" />
        <div className="relative p-6">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">{title}</h2>
            {children}
        </div>
    </div>
)

const BorrowRow = ({ borrow }) => {
    const isOverdue  = borrow.status === 'overdue'
    const isBorrowed = borrow.status === 'borrowed'
    const isReturned = borrow.status === 'returned'

    const badgeClass = isOverdue
        ? 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'
        : isBorrowed
        ? 'bg-white/8 text-white/50 ring-1 ring-white/10'
        : 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'

    return (
        <div className="flex items-center gap-3 p-3 bg-white/3 hover:bg-white/5 border border-white/8 rounded-xl transition-colors">
            <div className="w-10 h-14 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {borrow.book?.image_url
                    ? <img src={borrow.book.image_url} alt={borrow.book.title} className="w-full h-full object-cover" />
                    : <BookOpen className="w-4 h-4 text-white/30" />
                }
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/80 truncate">{borrow.book?.title || 'Unknown'}</p>
                <p className="text-xs text-white/30 truncate">{borrow.book?.author}</p>
                <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-white/20" />
                    <span className="text-[10px] text-white/30">
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
                <div className="absolute top-10 left-1/3  w-[500px] h-[300px] bg-slate-600/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-20 right-1/3 w-[400px] h-[300px] bg-slate-400/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative space-y-6 pt-16">

                {/* Welcome Header */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/30">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-white/3 pointer-events-none" />

                    {/* Spotlight */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/3 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-xl shadow-black/20">
                                {user?.user_image
                                    ? <img src={`/storage/${user.user_image}`} alt={user.firstname} className="w-full h-full object-cover" />
                                    : <User className="w-7 h-7 text-white/50" />
                                }
                            </div>
                            <div>
                                <p className="text-xs text-white/40 uppercase tracking-widest">{greeting()}</p>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent">
                                    {user?.firstname} {user?.lastname}
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
    <span className="px-2 py-0.5 bg-white/8 border border-white/10 rounded-full text-[10px] text-white/50 capitalize font-medium">
        {user?.role}
    </span>
    {user?.member_id && (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-white/8 border border-white/10 rounded-full text-[10px] text-white/50 font-mono">
            {user.member_id}
        </span>
    )}
</div>
                            </div>
                        </div>
                  <Link
                   href="/profile"
                   className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-white/90 to-white text-zinc-900 rounded-xl font-semibold text-sm hover:from-white hover:to-white transition-all shadow-lg shadow-black/20 active:scale-95 flex-shrink-0"
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
                    />
                    <StatCard
                        icon={AlertTriangle}
                        label="Overdue"
                        value={stats.overdue}
                        sub={stats.overdue > 0 ? 'please return soon' : 'all good!'}
                        color={stats.overdue > 0 ? 'text-red-400' : 'text-emerald-400'}
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="Total Returned"
                        value={stats.total_returned}
                        sub="books returned"
                        color="text-emerald-400"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Total Borrowed"
                        value={stats.total_borrowed}
                        sub="all time"
                        color="text-white/70"
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
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mx-auto mb-3">
                                    <BookMarked className="w-5 h-5 text-white/20" />
                                </div>
                                <p className="text-sm text-white/30">No active borrows</p>
                                <Link href="/books" className="text-xs text-white/50 hover:text-white underline underline-offset-2 mt-1 inline-block transition-colors">
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
                                    className="flex items-center justify-center gap-2 w-full mt-3 py-2.5 bg-white/5 hover:bg-white/8 border border-white/8 rounded-xl text-xs text-white/50 hover:text-white/80 transition-all"
                                >
                                    View all history <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mx-auto mb-3">
                                    <RotateCcw className="w-5 h-5 text-white/20" />
                                </div>
                                <p className="text-sm text-white/30">No borrow history yet</p>
                            </div>
                        )}
                    </SectionCard>
                </div>

                {/* Overdue Warning */}
                {stats.overdue > 0 && (
                    <div className="relative overflow-hidden rounded-2xl border border-red-500/20 shadow-xl shadow-black/20">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-400/30 to-transparent" />
                        <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
                        <div className="relative p-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-red-400">
                                    You have {stats.overdue} overdue {stats.overdue === 1 ? 'book' : 'books'}
                                </p>
                                <p className="text-xs text-white/40 mt-0.5">
                                    Please return them as soon as possible to avoid penalties.
                                </p>
                            </div>
                            <Link
                                href="/transactions"
                                className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl transition-colors flex-shrink-0"
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