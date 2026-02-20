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
            icon: CheckCircle,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            label: 'Available'
        } : {
            icon: XCircle,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            label: 'Unavailable'
        })
    });

    const statusConfig = getStatusConfig(book.available_copies);
    const StatusIcon   = statusConfig.icon;

    const InfoItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-white/50" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm font-medium text-white/80 truncate">{value || 'N/A'}</p>
            </div>
        </div>
    );

    const availabilityPct = book.total_copies > 0
        ? (book.available_copies / book.total_copies) * 100
        : 0;

    return (
        <Layout>
            <Head title="Book Details" />

            {/* Ambient blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
                <div className="absolute top-10 left-1/3  w-[500px] h-[300px] bg-slate-600/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-20 right-1/3 w-[400px] h-[300px] bg-slate-400/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative space-y-6 pt-16">

                {/* Back */}
                <Link
                    href={route('books')}
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Books
                </Link>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── Left Column ── */}
                    <div className="lg:col-span-1 space-y-4">

                        {/* Cover */}
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/30">
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none" />
                            <div className="relative p-5">
                                {book.image_url ? (
                                    <img
                                        src={book.image_url}
                                        alt={book.title}
                                        className="w-full aspect-[2/3] object-cover rounded-xl shadow-xl shadow-black/40"
                                    />
                                ) : (
                                    <div className="w-full aspect-[2/3] rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
                                        <BookOpen className="w-20 h-20 text-white/20" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Card */}
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-xl shadow-black/20">
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none" />
                            <div className="relative p-5 space-y-4">
                                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Availability</h3>

                                {/* Status badge */}
                                <div className={`flex items-center gap-3 p-3 rounded-xl border ${statusConfig.bg} ${statusConfig.border}`}>
                                    <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                                    <div>
                                        <p className={`text-sm font-semibold ${statusConfig.color}`}>{statusConfig.label}</p>
                                        <p className="text-xs text-white/30">Current status</p>
                                    </div>
                                </div>

                                {/* Copies counter */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-white/40">Available Copies</span>
                                    <span className="text-xl font-bold text-white">
                                        {book.available_copies}
                                        <span className="text-sm text-white/30 font-normal">/{book.total_copies}</span>
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full bg-white/8 rounded-full h-1.5">
                                    <div
                                        className="bg-gradient-to-r from-emerald-400 to-emerald-300 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${availabilityPct}%` }}
                                    />
                                </div>
                                <p className="text-xs text-white/30">
                                    {book.total_copies - book.available_copies} currently borrowed
                                </p>

                                {/* Borrow button — auth only */}
                                {auth?.user && book.available_copies > 0 && (
                                    <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-white/90 to-white text-zinc-900 font-semibold text-sm py-2.5 rounded-xl hover:from-white hover:to-white transition-all shadow-lg shadow-black/20 active:scale-[0.98]">
                                        <BookMarked className="w-4 h-4" /> Borrow This Book
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Right Column ── */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Book Info */}
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-xl shadow-black/20">
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none" />
                            <div className="relative p-6 space-y-6">

                                {/* Title + category */}
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent leading-tight mb-3">
                                        {book.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="px-3 py-1 bg-white/8 text-white/60 border border-white/10 rounded-full text-xs font-medium">
                                            {book.category?.name || 'Uncategorized'}
                                        </span>
                                        {book.published_year && (
                                            <span className="text-xs text-white/30">
                                                Published {book.published_year}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                {book.description && (
                                    <div>
                                        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Description</h3>
                                        <p className="text-sm text-white/60 leading-relaxed">{book.description}</p>
                                    </div>
                                )}

                                {/* Divider */}
                                <div className="border-t border-white/8" />

                                {/* Details grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InfoItem icon={User}     label="Author"         value={book.author}         />
                                    <InfoItem icon={Building} label="Publisher"       value={book.publisher}      />
                                    <InfoItem icon={Hash}     label="ISBN"            value={book.isbn}           />
                                    <InfoItem icon={Calendar} label="Published Year"  value={book.published_year} />
                                    <InfoItem icon={Globe}    label="Language"        value={book.language}       />
                                    <InfoItem icon={FileText} label="Pages"           value={book.pages}          />
                                    <InfoItem icon={Copy}     label="Edition"         value={book.edition}        />
                                    <InfoItem icon={MapPin}   label="Shelf Location"  value={book.shelf_location} />
                                </div>
                            </div>
                        </div>

                        {/* Borrowing History */}
                        {book.borrows && book.borrows.length > 0 && (
                            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-xl shadow-black/20">
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none" />
                                <div className="relative p-6">
                                    <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                                        Recent Borrowing History
                                    </h3>
                                    <div className="space-y-2">
                                        {book.borrows.slice(0, 5).map((borrow) => (
                                            <div key={borrow.id} className="flex items-center justify-between p-3 bg-white/3 hover:bg-white/5 border border-white/8 rounded-xl transition-colors">
                                                <div>
                                                    <p className="text-sm font-medium text-white/80">
                                                        {borrow.user?.name || 'Unknown User'}
                                                    </p>
                                                    <p className="text-xs text-white/30 mt-0.5">
                                                        Borrowed: {new Date(borrow.borrowed_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${
                                                    borrow.status === 'returned' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' :
                                                    borrow.status === 'overdue'  ? 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20' :
                                                    'bg-white/8 text-white/50 ring-1 ring-white/10'
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