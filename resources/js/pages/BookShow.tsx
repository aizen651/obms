import Layout from "@/layouts/Layout"
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft, BookOpen, User, Building, Calendar,
    Hash, Globe, FileText, MapPin, Copy,
    CheckCircle, XCircle, Archive, BookMarked
} from 'lucide-react';

export default function BookShow({ book }) {
    const { auth } = usePage().props

    const getStatusConfig = (availableCopies = 0) => ({
        ...(availableCopies > 0 ? {
            icon:   CheckCircle,
            color:  'text-emerald-600 dark:text-emerald-400',
            bg:     'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            label:  'Available',
            sub:    'text-zinc-500 dark:text-white/30',
        } : {
            icon:   XCircle,
            color:  'text-red-600 dark:text-red-400',
            bg:     'bg-red-500/10',
            border: 'border-red-500/20',
            label:  'Unavailable',
            sub:    'text-zinc-500 dark:text-white/30',
        })
    });

    const statusConfig = getStatusConfig(book.available_copies);
    const StatusIcon   = statusConfig.icon;

    const InfoItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border
                bg-zinc-100 border-zinc-200
                dark:bg-white/8 dark:border-white/10">
                <Icon className="w-4 h-4 text-zinc-400 dark:text-white/50" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wider mb-0.5 text-zinc-400 dark:text-white/40">{label}</p>
                <p className="text-sm font-medium truncate text-zinc-700 dark:text-white/80">{value || 'N/A'}</p>
            </div>
        </div>
    );

    const availabilityPct = book.total_copies > 0
        ? (book.available_copies / book.total_copies) * 100
        : 0;

    return (
        <Layout>
            <Head title="Book Details" />

            {/* ── Page background ── */}
            <div className="fixed inset-0 -z-10
                bg-gradient-to-b from-zinc-100 via-zinc-50 to-white
                dark:from-zinc-950 dark:via-slate-800 dark:to-slate-700" />

            {/* Ambient blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
                {/* Light */}
                <div className="absolute top-10 left-1/3 w-[500px] h-[300px] bg-blue-100/50 rounded-full blur-[140px] dark:hidden" />
                <div className="absolute bottom-20 right-1/3 w-[400px] h-[300px] bg-violet-100/40 rounded-full blur-[120px] dark:hidden" />
                {/* Dark */}
                <div className="absolute top-10 left-1/3 w-[500px] h-[300px] bg-slate-600/10 rounded-full blur-[140px] hidden dark:block" />
                <div className="absolute bottom-20 right-1/3 w-[400px] h-[300px] bg-slate-400/10 rounded-full blur-[120px] hidden dark:block" />
            </div>

            <div className="relative space-y-6 pt-16">

                {/* Back */}
                <Link
                    href={route('books')}
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors
                        text-zinc-400 hover:text-zinc-800
                        dark:text-white/50 dark:hover:text-white"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Books
                </Link>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── Left Column ── */}
                    <div className="lg:col-span-1 space-y-4">

                        {/* Cover card */}
                        <div className="relative overflow-hidden rounded-2xl border shadow-xl
                            bg-white border-zinc-200 shadow-zinc-100/80
                            dark:bg-transparent dark:border-white/10 dark:shadow-black/30">
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-white/20" />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none hidden dark:block" />
                            <div className="relative p-5">
                                {book.image_url ? (
                                    <img
                                        src={book.image_url}
                                        alt={book.title}
                                        className="w-full aspect-[2/3] object-cover rounded-xl shadow-xl shadow-black/10"
                                    />
                                ) : (
<div className="w-full aspect-[2/3] rounded-xl flex items-center justify-center border
    bg-zinc-50 border-zinc-200
    dark:bg-zinc-900 dark:bg-gradient-to-br dark:from-white/10 dark:to-white/5 dark:border-white/10">
    <BookOpen className="w-20 h-20 text-zinc-300 dark:text-white/20" />
</div>
                                )}
                            </div>
                        </div>

                        {/* Status card */}
                        <div className="relative overflow-hidden rounded-2xl border shadow-xl
                            bg-white border-zinc-200 shadow-zinc-100/80
                            dark:bg-transparent dark:border-white/10 dark:shadow-black/20">
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-white/20" />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none hidden dark:block" />
                            <div className="relative p-5 space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-white/60">
                                    Availability
                                </h3>

                                {/* Status badge */}
                                <div className={`flex items-center gap-3 p-3 rounded-xl border ${statusConfig.bg} ${statusConfig.border}`}>
                                    <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                                    <div>
                                        <p className={`text-sm font-semibold ${statusConfig.color}`}>{statusConfig.label}</p>
                                        <p className={`text-xs ${statusConfig.sub}`}>Current status</p>
                                    </div>
                                </div>

                                {/* Copies counter */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-zinc-400 dark:text-white/40">Available Copies</span>
                                    <span className="text-xl font-bold text-zinc-800 dark:text-white">
                                        {book.available_copies}
                                        <span className="text-sm font-normal text-zinc-400 dark:text-white/30">
                                            /{book.total_copies}
                                        </span>
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full rounded-full h-1.5 bg-zinc-100 dark:bg-white/8">
                                    <div
                                        className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${availabilityPct}%` }}
                                    />
                                </div>
                                <p className="text-xs text-zinc-400 dark:text-white/30">
                                    {book.total_copies - book.available_copies} currently borrowed
                                </p>

                                {/* Borrow button */}
                                {auth?.user && book.available_copies > 0 && (
                                    <button className="w-full flex items-center justify-center gap-2 font-semibold text-sm py-2.5 rounded-xl transition-all shadow-lg active:scale-[0.98]
                                        bg-zinc-900 text-white hover:bg-zinc-700 shadow-black/10
                                        dark:bg-gradient-to-r dark:from-white/90 dark:to-white dark:text-zinc-900 dark:hover:from-white dark:hover:to-white dark:shadow-black/20">
                                        <BookMarked className="w-4 h-4" /> Borrow This Book
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Right Column ── */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Book Info card */}
                        <div className="relative overflow-hidden rounded-2xl border shadow-xl
                            bg-white border-zinc-200 shadow-zinc-100/80
                            dark:bg-transparent dark:border-white/10 dark:shadow-black/20">
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-white/20" />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none hidden dark:block" />
                            <div className="relative p-6 space-y-6">

                                {/* Title + category */}
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3
                                        text-zinc-900
                                        dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:via-white/90 dark:to-white/60 dark:bg-clip-text">
                                        {book.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium border
                                            bg-zinc-100 border-zinc-200 text-zinc-500
                                            dark:bg-white/8 dark:border-white/10 dark:text-white/60">
                                            {book.category?.name || 'Uncategorized'}
                                        </span>
                                        {book.published_year && (
                                            <span className="text-xs text-zinc-400 dark:text-white/30">
                                                Published {book.published_year}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                {book.description && (
                                    <div>
                                        <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 text-zinc-400 dark:text-white/40">
                                            Description
                                        </h3>
                                        <p className="text-sm leading-relaxed text-zinc-500 dark:text-white/60">
                                            {book.description}
                                        </p>
                                    </div>
                                )}

                                {/* Divider */}
                                <div className="border-t border-zinc-100 dark:border-white/8" />

                                {/* Details grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InfoItem icon={User}     label="Author"        value={book.author}         />
                                    <InfoItem icon={Building} label="Publisher"      value={book.publisher}      />
                                    <InfoItem icon={Hash}     label="ISBN"           value={book.isbn}           />
                                    <InfoItem icon={Calendar} label="Published Year" value={book.published_year} />
                                    <InfoItem icon={Globe}    label="Language"       value={book.language}       />
                                    <InfoItem icon={FileText} label="Pages"          value={book.pages}          />
                                    <InfoItem icon={Copy}     label="Edition"        value={book.edition}        />
                                    <InfoItem icon={MapPin}   label="Shelf Location" value={book.shelf_location} />
                                </div>
                            </div>
                        </div>

                        {/* Borrowing History card */}
                        {book.borrows && book.borrows.length > 0 && (
                            <div className="relative overflow-hidden rounded-2xl border shadow-xl
                                bg-white border-zinc-200 shadow-zinc-100/80
                                dark:bg-transparent dark:border-white/10 dark:shadow-black/20">
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-white/20" />
                                <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none hidden dark:block" />
                                <div className="relative p-6">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-zinc-400 dark:text-white/60">
                                        Recent Borrowing History
                                    </h3>
                                    <div className="space-y-2">
                                        {book.borrows.slice(0, 5).map((borrow) => (
                                            <div key={borrow.id}
                                                className="flex items-center justify-between p-3 rounded-xl transition-colors border
                                                    bg-zinc-50 hover:bg-zinc-100 border-zinc-100
                                                    dark:bg-white/3 dark:hover:bg-white/5 dark:border-white/8">
                                                <div>
                                                    <p className="text-sm font-medium text-zinc-700 dark:text-white/80">
                                                        {borrow.user?.name || 'Unknown User'}
                                                    </p>
                                                    <p className="text-xs mt-0.5 text-zinc-400 dark:text-white/30">
                                                        Borrowed: {new Date(borrow.borrowed_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${
                                                    borrow.status === 'returned'
                                                        ? 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400'
                                                        : borrow.status === 'overdue'
                                                            ? 'bg-red-500/10 text-red-600 ring-1 ring-red-500/20 dark:text-red-400'
                                                            : 'bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200 dark:bg-white/8 dark:text-white/50 dark:ring-white/10'
                                                }`}>
                                                    {borrow.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}