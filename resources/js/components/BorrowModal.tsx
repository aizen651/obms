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
                    setStep(1); // go back so user can fix it
                }
            },
        });
    };

    const Row = ({ label, value }) => (
        <div className="flex justify-between text-xs py-1.5 border-b border-white/6 last:border-0">
            <span className="text-white/40">{label}</span>
            <span className="text-white/75">{value}</span>
        </div>
    );

    return (
        <>
            <div onClick={onClose} className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className={`relative w-full max-w-md pointer-events-auto transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                    <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-transparent to-white/5 blur-sm" />

                    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0d0d0f]/95 shadow-2xl shadow-black/60">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

                        {step !== 3 ? (
                            <>
                                {/* Header */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-8 w-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                                            <BookMarked size={14} className="text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Borrow Book</p>
                                            <p className="text-[10px] text-white/40">{step === 1 ? 'Set details' : 'Confirm request'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1">
                                            {[1, 2].map(s => <div key={s} className={`h-1.5 rounded-full transition-all ${s === step ? 'w-5 bg-emerald-400' : s < step ? 'w-1.5 bg-emerald-500/40' : 'w-1.5 bg-white/15'}`} />)}
                                        </div>
                                        <button onClick={onClose} className="h-7 w-7 rounded-lg bg-white/8 hover:bg-white/15 text-white/40 hover:text-white flex items-center justify-center transition-all">
                                            <X size={13} />
                                        </button>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="px-5 py-4 space-y-4">
                                    {/* Book card */}
                                    <div className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/8">
                                        {book.image_url
                                            ? <img src={book.image_url} alt={book.title} className="w-12 object-cover rounded-lg shadow-lg flex-shrink-0" />
                                            : <div className="w-12 h-16 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0"><BookOpen size={18} className="text-white/25" /></div>
                                        }
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-white line-clamp-2 leading-snug">{book.title}</p>
                                            <p className="text-xs text-white/45 mt-0.5">{book.author}</p>
                                            <p className="text-[10px] text-white/30 mt-1">{book.category?.name}</p>
                                            <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ring-1 ${
                                                book.display_status === 'available' ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/20' : 'bg-red-500/15 text-red-300 ring-red-400/20'
                                            }`}>{book.display_status}</span>
                                        </div>
                                    </div>

                                    {step === 1 ? (
                                        <>
                                            {/* Due date */}
                                            <div className="space-y-1.5">
                                                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-white/45 uppercase tracking-wider">
                                                    <Calendar size={10} /> Due Date
                                                </label>
                                                <input type="date" value={dueDate} min={new Date().toISOString().split('T')[0]} max={maxDate}
                                                    onChange={e => setDueDate(e.target.value)}
                                                    className="w-full rounded-xl bg-white/8 border border-white/12 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all [color-scheme:dark]"
                                                />
                                                {dueDate && <p className="text-[11px] text-white/35">{days} day borrowing period</p>}
                                                {errors.due_date && <p className="text-[11px] text-red-400 flex items-center gap-1"><AlertCircle size={10} />{errors.due_date}</p>}
                                            </div>

                                            {/* Notes */}
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-semibold text-white/45 uppercase tracking-wider">Notes <span className="font-normal normal-case text-white/25">(optional)</span></label>
                                                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special requests…" rows={2}
                                                    className="w-full rounded-xl bg-white/8 border border-white/12 px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all resize-none"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-1 p-3 rounded-xl bg-white/5 border border-white/8">
                                            <Row label="Borrower" value={auth?.user?.name} />
                                            <Row label="Due Date" value={formattedDue} />
                                            <Row label="Duration" value={`${days} days`} />
                                            {notes && <Row label="Notes" value={notes} />}
                                            <div className="flex gap-2 mt-3 pt-3 border-t border-white/8">
                                                <AlertCircle size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />
                                                <p className="text-[11px] text-amber-300/60 leading-relaxed">Late returns may incur fees. Return by the due date or contact the library to extend.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-white/8 bg-black/20">
                                    <button onClick={step === 1 ? onClose : () => setStep(1)}
                                        className="h-9 px-4 rounded-xl text-xs font-medium text-white/50 hover:text-white bg-white/8 hover:bg-white/15 border border-white/10 transition-all">
                                        {step === 1 ? 'Cancel' : '← Back'}
                                    </button>
                                    {step === 1 ? (
                                        <button onClick={() => setStep(2)} disabled={!dueDate}
                                            className="flex items-center gap-1.5 h-9 px-5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-md shadow-emerald-500/20 active:scale-95">
                                            Review <ChevronRight size={13} />
                                        </button>
                                    ) : (
                                        <button onClick={handleBorrow} disabled={loading}
                                            className="flex items-center gap-2 h-9 px-5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white transition-all shadow-md shadow-emerald-500/20 active:scale-95">
                                            {loading
                                                ? <><svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Processing…</>
                                                : <><BookMarked size={13} /> Confirm</>
                                            }
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Success */
                            <div className="px-8 py-10 flex flex-col items-center text-center">
                                <div className="relative mb-5">
                                    <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: '1.5s' }} />
                                    <div className="relative h-14 w-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                                        <CheckCircle size={24} className="text-emerald-400" />
                                    </div>
                                </div>
                                <p className="text-sm font-semibold text-white">Request Sent!</p>
                                <p className="text-xs text-white/40 mt-1.5 max-w-xs">Your borrow request for <span className="text-white/65">"{book.title}"</span> has been submitted.</p>
                                <div className="mt-4 w-full p-3 rounded-xl bg-white/5 border border-white/8 space-y-1.5">
                                    <Row label="Due Date" value={formattedDue} />
                                    <Row label="Duration" value={`${days} days`} />
                                </div>
                                <button onClick={onClose} className="mt-5 h-9 w-full rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white/60 hover:text-white border border-white/10 transition-all">
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
