import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { X, BookMarked, Calendar, BookOpen, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';

export default function BorrowModal({ book, isOpen, onClose, auth }) {
    const defaultDue = () => { const d = new Date(); d.setDate(d.getDate() + 14); return d.toISOString().split('T')[0]; };
    const [step, setStep]       = useState(1);
    const [dueDate, setDueDate] = useState(defaultDue);
    const [notes, setNotes]     = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors]   = useState({});

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        if (!isOpen) setTimeout(() => { setStep(1); setNotes(''); setErrors({}); }, 300);
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!book) return null;

    const days = dueDate ? Math.round((new Date(dueDate) - new Date()) / 86400000) : 14;
    const maxDate = (() => { const d = new Date(); d.setDate(d.getDate() + 60); return d.toISOString().split('T')[0]; })();
    const formattedDue = dueDate && new Date(dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const handleBorrow = () => {
        setLoading(true);
        router.post(`/transaction/${book.id}`, { due_date: dueDate, notes }, {
            onSuccess: () => { setLoading(false); setStep(3); },
            onError: (e) => {
                setLoading(false);
                setErrors(e);
                if (e.book) {
                    toast.error(e.book, { description: book.title });
                    onClose();
                }
                if (e.due_date) {
                    toast.error('Invalid due date', { description: e.due_date });
                    setStep(1);
                }
            },
        });
    };

    const Row = ({ label, value }) => (
        <div className="flex justify-between text-xs py-1.5 border-b last:border-0
            border-zinc-100 dark:border-white/6">
            <span className="text-zinc-400 dark:text-white/40">{label}</span>
            <span className="text-zinc-600 dark:text-white/75">{value}</span>
        </div>
    );

    return (
        <>
            {/* Backdrop */}
            <div onClick={onClose}
                className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className={`relative w-full max-w-md pointer-events-auto transition-all duration-300
                    ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>

                    {/* Glow ring — dark only */}
                    <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-transparent to-white/5 blur-sm hidden dark:block" />

                    {/* Modal panel */}
                    <div className="relative overflow-hidden rounded-2xl border shadow-2xl
                        bg-white border-zinc-200 shadow-zinc-200
                        dark:border-white/15 dark:bg-[#0d0d0f]/95 dark:shadow-black/60">

                        {/* Top shimmer */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

                        {step !== 3 ? (
                            <>
                                {/* Header */}
                                <div className="flex items-center justify-between px-5 py-4 border-b
                                    border-zinc-100 dark:border-white/8">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-8 w-8 rounded-xl flex items-center justify-center border
                                            bg-emerald-50 border-emerald-200
                                            dark:bg-emerald-500/15 dark:border-emerald-500/25">
                                            <BookMarked size={14} className="text-emerald-500 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-800 dark:text-white">Borrow Book</p>
                                            <p className="text-[10px] text-zinc-400 dark:text-white/40">
                                                {step === 1 ? 'Set details' : 'Confirm request'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {/* Step dots */}
                                        <div className="flex gap-1">
                                            {[1, 2].map(s => (
                                                <div key={s} className={`h-1.5 rounded-full transition-all ${
                                                    s === step
                                                        ? 'w-5 bg-emerald-500 dark:bg-emerald-400'
                                                        : s < step
                                                            ? 'w-1.5 bg-emerald-400/40 dark:bg-emerald-500/40'
                                                            : 'w-1.5 bg-zinc-200 dark:bg-white/15'
                                                }`} />
                                            ))}
                                        </div>
                                        <button onClick={onClose}
                                            className="h-7 w-7 rounded-lg flex items-center justify-center transition-all
                                                bg-zinc-100 hover:bg-zinc-200 text-zinc-400 hover:text-zinc-700
                                                dark:bg-white/8 dark:hover:bg-white/15 dark:text-white/40 dark:hover:text-white">
                                            <X size={13} />
                                        </button>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="px-5 py-4 space-y-4">

                                    {/* Book card */}
                                    <div className="flex gap-3 p-3 rounded-xl border
                                        bg-zinc-50 border-zinc-200
                                        dark:bg-white/5 dark:border-white/8">
                                        {book.image_url
                                            ? <img src={book.image_url} alt={book.title} className="w-12 object-cover rounded-lg shadow-lg flex-shrink-0" />
                                            : <div className="w-12 h-16 rounded-lg flex items-center justify-center flex-shrink-0 border
                                                bg-zinc-100 border-zinc-200
                                                dark:bg-white/8 dark:border-white/10">
                                                <BookOpen size={18} className="text-zinc-300 dark:text-white/25" />
                                              </div>
                                        }
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold line-clamp-2 leading-snug text-zinc-800 dark:text-white">
                                                {book.title}
                                            </p>
                                            <p className="text-xs mt-0.5 text-zinc-400 dark:text-white/45">{book.author}</p>
                                            <p className="text-[10px] mt-1 text-zinc-400 dark:text-white/30">{book.category?.name}</p>
                                            <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ring-1 ${
                                                book.display_status === 'available'
                                                    ? 'bg-emerald-500/15 text-emerald-600 ring-emerald-400/20 dark:text-emerald-300'
                                                    : 'bg-red-500/15 text-red-600 ring-red-400/20 dark:text-red-300'
                                            }`}>{book.display_status}</span>
                                        </div>
                                    </div>

                                    {step === 1 ? (
                                        <>
                                            {/* Due date */}
                                            <div className="space-y-1.5">
                                                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider
                                                    text-zinc-400 dark:text-white/45">
                                                    <Calendar size={10} /> Due Date
                                                </label>
                                                <input type="date" value={dueDate}
                                                    min={new Date().toISOString().split('T')[0]} max={maxDate}
                                                    onChange={e => setDueDate(e.target.value)}
                                                    className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all
                                                        bg-zinc-50 border-zinc-200 text-zinc-800 [color-scheme:light]
                                                        dark:bg-white/8 dark:border-white/12 dark:text-white dark:[color-scheme:dark]"
                                                />
                                                {dueDate && (
                                                    <p className="text-[11px] text-zinc-400 dark:text-white/35">
                                                        {days} day borrowing period
                                                    </p>
                                                )}
                                                {errors.due_date && (
                                                    <p className="text-[11px] text-red-500 dark:text-red-400 flex items-center gap-1">
                                                        <AlertCircle size={10} />{errors.due_date}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Notes */}
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-white/45">
                                                    Notes <span className="font-normal normal-case text-zinc-300 dark:text-white/25">(optional)</span>
                                                </label>
                                                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                                                    placeholder="Any special requests…" rows={2}
                                                    className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all resize-none
                                                        bg-zinc-50 border-zinc-200 text-zinc-800 placeholder:text-zinc-400
                                                        dark:bg-white/8 dark:border-white/12 dark:text-white dark:placeholder-white/25"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        /* Step 2 — confirm */
                                        <div className="space-y-1 p-3 rounded-xl border
                                            bg-zinc-50 border-zinc-200
                                            dark:bg-white/5 dark:border-white/8">
                                            <Row label="Borrower" value={auth?.user?.name} />
                                            <Row label="Due Date" value={formattedDue} />
                                            <Row label="Duration" value={`${days} days`} />
                                            {notes && <Row label="Notes" value={notes} />}
                                            <div className="flex gap-2 mt-3 pt-3 border-t border-zinc-100 dark:border-white/8">
                                                <AlertCircle size={12} className="text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                                <p className="text-[11px] text-amber-600/70 leading-relaxed dark:text-amber-300/60">
                                                    Late returns may incur fees. Return by the due date or contact the library to extend.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t
                                    bg-zinc-50 border-zinc-100
                                    dark:bg-black/20 dark:border-white/8">
                                    <button
                                        onClick={step === 1 ? onClose : () => setStep(1)}
                                        className="h-9 px-4 rounded-xl text-xs font-medium transition-all border
                                            bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-zinc-800
                                            dark:bg-white/8 dark:hover:bg-white/15 dark:border-white/10 dark:text-white/50 dark:hover:text-white">
                                        {step === 1 ? 'Cancel' : '← Back'}
                                    </button>
                                    {step === 1 ? (
                                        <button onClick={() => setStep(2)} disabled={!dueDate}
                                            className="flex items-center gap-1.5 h-9 px-5 rounded-xl text-xs font-semibold text-white transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed
                                                bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20">
                                            Review <ChevronRight size={13} />
                                        </button>
                                    ) : (
                                        <button onClick={handleBorrow} disabled={loading}
                                            className="flex items-center gap-2 h-9 px-5 rounded-xl text-xs font-semibold text-white transition-all shadow-md active:scale-95 disabled:opacity-60
                                                bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20">
                                            {loading
                                                ? <><svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                                  </svg> Processing…</>
                                                : <><BookMarked size={13} /> Confirm</>
                                            }
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* ── Success screen ── */
                            <div className="px-8 py-10 flex flex-col items-center text-center">
                                <div className="relative mb-5">
                                    <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: '1.5s' }} />
                                    <div className="relative h-14 w-14 rounded-full flex items-center justify-center border
                                        bg-emerald-50 border-emerald-200
                                        dark:bg-emerald-500/15 dark:border-emerald-500/30">
                                        <CheckCircle size={24} className="text-emerald-500 dark:text-emerald-400" />
                                    </div>
                                </div>
                                <p className="text-sm font-semibold text-zinc-800 dark:text-white">Request Sent!</p>
                                <p className="text-xs mt-1.5 max-w-xs text-zinc-400 dark:text-white/40">
                                    Your borrow request for{' '}
                                    <span className="text-zinc-600 dark:text-white/65">"{book.title}"</span>{' '}
                                    has been submitted.
                                </p>
                                <div className="mt-4 w-full p-3 rounded-xl border space-y-1.5
                                    bg-zinc-50 border-zinc-200
                                    dark:bg-white/5 dark:border-white/8">
                                    <Row label="Due Date" value={formattedDue} />
                                    <Row label="Duration" value={`${days} days`} />
                                </div>
                                <button onClick={onClose}
                                    className="mt-5 h-9 w-full rounded-xl text-xs font-semibold transition-all border
                                        bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-500 hover:text-zinc-800
                                        dark:bg-white/10 dark:hover:bg-white/15 dark:border-white/10 dark:text-white/60 dark:hover:text-white">
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}