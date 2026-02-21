import { useState, useRef } from 'react'
import { toast } from 'sonner';
import { Head, useForm, usePage, router } from '@inertiajs/react'
import Layout from '@/layouts/Layout'
import {
    User, Mail, Phone, Venus, Hash, Shield,
    Camera, Pencil, Lock, CheckCircle, AlertCircle,
    BookMarked, BookOpen, RotateCcw, AlertTriangle, X, Save, Eye, EyeOff
} from 'lucide-react'

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/8 to-white/3 p-4 flex items-center gap-3">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
            <Icon className="w-4 h-4" />
        </div>
        <div>
            <p className={`text-xl font-bold leading-none ${color.replace('bg-', 'text-').replace('/15', '')}`}>{value}</p>
            <p className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wide">{label}</p>
        </div>
    </div>
)

const Field = ({ label, icon: Icon, children }) => (
    <div>
        <label className="flex items-center gap-1.5 text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
            <Icon className="w-3 h-3" /> {label}
        </label>
        {children}
    </div>
)

const inputCls = "w-full rounded-xl bg-white/6 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"

export default function Profile({ user, stats }) {
    const [tab, setTab]             = useState('info')
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew]     = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [preview, setPreview]     = useState(null)
    const fileRef                   = useRef(null)
    const { flash }                 = usePage().props

    // Profile form
    const profileForm = useForm({
        firstname:  user.firstname,
        lastname:   user.lastname,
        email:      user.email,
        contact:    user.contact || '',
        gender:     user.gender,
        user_image: null,
    })

    // Password form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    })

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        profileForm.setData('user_image', file)
        setPreview(URL.createObjectURL(file))
    }

    // Profile form
    const submitProfile = (e) => {
    e.preventDefault()
    profileForm.post('/profile', {
        forceFormData: true,
        onSuccess: () => {
            setPreview(null)
            toast.success('Profile updated successfully.')
        },
        onError: () => toast.error('Failed to update profile.'),
        })
    }

    // Password form
    const submitPassword = (e) => {
    e.preventDefault()
    passwordForm.post('/profile/password', {
        onSuccess: () => {
            passwordForm.reset()
            toast.success('Password updated successfully.')
        },
        onError: () => toast.error('Failed to update password.'),
        })
    }
    
    // Remove image
    const removeImage = () => {
      router.delete('/profile/image', {
        onSuccess: () => toast.success('Profile image removed.'),
     })
      setPreview(null)
    }
    

    const avatarSrc = preview || (user.user_image ? `/storage/${user.user_image}` : null)

    const tabs = [
        { key: 'info',     label: 'Personal Info' },
        { key: 'password', label: 'Password'       },
    ]

    return (
        <Layout>
            <Head title="Profile" />

            {/* Ambient blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
                <div className="absolute top-10 left-1/3 w-[500px] h-[300px] bg-slate-600/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-20 right-1/3 w-[400px] h-[300px] bg-slate-400/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative pt-16 pb-12 max-w-4xl mx-auto space-y-6">

                

                {/* ── HERO CARD ── */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/30">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                    {/* Dark-light gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-800/60 to-zinc-950 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/4 to-white/2 pointer-events-none" />

                    {/* Decorative corner glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/3 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">

                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/15 shadow-2xl shadow-black/40 bg-gradient-to-br from-white/15 to-white/5">
                                {avatarSrc
                                    ? <img src={avatarSrc} alt={user.firstname} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center"><User className="w-10 h-10 text-white/30" /></div>
                                }
                            </div>
                            {/* Camera button */}
                            <button
                                onClick={() => fileRef.current?.click()}
                                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white text-zinc-900 flex items-center justify-center shadow-lg hover:bg-white/90 active:scale-95 transition-all"
                            >
                                <Camera className="w-3.5 h-3.5" />
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center sm:text-left min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent truncate">
                                {user.firstname} {user.lastname}
                            </h1>
                            <p className="text-sm text-white/40 mt-1 truncate">{user.email}</p>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/8 border border-white/10 text-[10px] font-semibold text-white/60 capitalize">
                                    <Shield className="w-3 h-3" /> {user.role}
                                </span>
                                {user.member_id && (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/8 border border-white/10 text-[10px] font-semibold text-white/60 font-mono">
                                        <Hash className="w-3 h-3" /> {user.member_id}
                                    </span>
                                )}
                                {user.gender && (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/8 border border-white/10 text-[10px] font-semibold text-white/60 capitalize">
                                        <Venus className="w-3 h-3" /> {user.gender}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Remove image button */}
                        {(avatarSrc) && (
                            <button onClick={removeImage} className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Stats row */}
                    <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 sm:px-8 pb-6">
                        <StatCard icon={BookMarked}   label="Borrowing"  value={stats.currently_borrowing} color="bg-white/10 text-white"         />
                        <StatCard icon={AlertTriangle} label="Overdue"   value={stats.overdue}             color="bg-red-500/15 text-red-300"      />
                        <StatCard icon={RotateCcw}    label="Returned"   value={stats.total_returned}      color="bg-emerald-500/15 text-emerald-300" />
                        <StatCard icon={BookOpen}     label="All Time"   value={stats.total_borrowed}      color="bg-white/8 text-white/60"        />
                    </div>
                </div>

                {/* ── TABS + FORM CARD ── */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-xl shadow-black/20">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/80 via-zinc-800/40 to-zinc-900/80 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/6 via-white/3 to-white/2 pointer-events-none" />

                    {/* Tab bar */}
                    <div className="relative flex border-b border-white/8 bg-black/20 px-4 pt-3 gap-1">
                        {tabs.map(t => (
                            <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-t-xl text-xs font-semibold transition-all border-b-2 ${
                                tab === t.key
                                    ? 'text-white border-white/60 bg-white/5'
                                    : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/4'
                            }`}>
                                {t.key === 'info' ? <Pencil className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* ── PERSONAL INFO FORM ── */}
                    {tab === 'info' && (
                        <form onSubmit={submitProfile} className="relative p-6 sm:p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="First Name" icon={User}>
                                    <input
                                        type="text" value={profileForm.data.firstname}
                                        onChange={e => profileForm.setData('firstname', e.target.value)}
                                        className={inputCls} placeholder="First name"
                                    />
                                    {profileForm.errors.firstname && <p className="text-[10px] text-red-400 mt-1">{profileForm.errors.firstname}</p>}
                                </Field>

                                <Field label="Last Name" icon={User}>
                                    <input
                                        type="text" value={profileForm.data.lastname}
                                        onChange={e => profileForm.setData('lastname', e.target.value)}
                                        className={inputCls} placeholder="Last name"
                                    />
                                    {profileForm.errors.lastname && <p className="text-[10px] text-red-400 mt-1">{profileForm.errors.lastname}</p>}
                                </Field>

                                <Field label="Email" icon={Mail}>
                                    <input
                                        type="email" value={profileForm.data.email}
                                        onChange={e => profileForm.setData('email', e.target.value)}
                                        className={inputCls} placeholder="Email address"
                                    />
                                    {profileForm.errors.email && <p className="text-[10px] text-red-400 mt-1">{profileForm.errors.email}</p>}
                                </Field>

                                <Field label="Contact" icon={Phone}>
                                    <input
                                        type="text" value={profileForm.data.contact}
                                        onChange={e => profileForm.setData('contact', e.target.value)}
                                        className={inputCls} placeholder="Phone number"
                                    />
                                    {profileForm.errors.contact && <p className="text-[10px] text-red-400 mt-1">{profileForm.errors.contact}</p>}
                                </Field>

                                <Field label="Gender" icon={Venus}>
                                    <select
                                        value={profileForm.data.gender}
                                        onChange={e => profileForm.setData('gender', e.target.value)}
                                        className={`${inputCls} appearance-none`}
                                    >
                                        <option value="" className="bg-zinc-900">Select gender</option>
                                        <option value="male" className="bg-zinc-900">Male</option>
                                        <option value="female" className="bg-zinc-900">Female</option>
                                        <option value="other" className="bg-zinc-900">Other</option>
                                    </select>
                                    {profileForm.errors.gender && <p className="text-[10px] text-red-400 mt-1">{profileForm.errors.gender}</p>}
                                </Field>

                                {/* Read-only role */}
                                <Field label="Role" icon={Shield}>
                                    <div className={`${inputCls} text-white/40 cursor-not-allowed capitalize`}>{user.role}</div>
                                </Field>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-white/90 active:scale-95 transition-all shadow-lg shadow-black/20 disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {profileForm.processing ? 'Saving…' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ── PASSWORD FORM ── */}
                    {tab === 'password' && (
                        <form onSubmit={submitPassword} className="relative p-6 sm:p-8">
                            <div className="max-w-md space-y-4">

                                <Field label="Current Password" icon={Lock}>
                                    <div className="relative">
                                        <input
                                            type={showCurrent ? 'text' : 'password'}
                                            value={passwordForm.data.current_password}
                                            onChange={e => passwordForm.setData('current_password', e.target.value)}
                                            className={`${inputCls} pr-10`} placeholder="Enter current password"
                                        />
                                        <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                                            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {passwordForm.errors.current_password && <p className="text-[10px] text-red-400 mt-1">{passwordForm.errors.current_password}</p>}
                                </Field>

                                <Field label="New Password" icon={Lock}>
                                    <div className="relative">
                                        <input
                                            type={showNew ? 'text' : 'password'}
                                            value={passwordForm.data.password}
                                            onChange={e => passwordForm.setData('password', e.target.value)}
                                            className={`${inputCls} pr-10`} placeholder="Enter new password"
                                        />
                                        <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                                            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {passwordForm.errors.password && <p className="text-[10px] text-red-400 mt-1">{passwordForm.errors.password}</p>}
                                </Field>

                                <Field label="Confirm New Password" icon={Lock}>
                                    <div className="relative">
                                        <input
                                            type={showConfirm ? 'text' : 'password'}
                                            value={passwordForm.data.password_confirmation}
                                            onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                                            className={`${inputCls} pr-10`} placeholder="Confirm new password"
                                        />
                                        <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {passwordForm.errors.password_confirmation && <p className="text-[10px] text-red-400 mt-1">{passwordForm.errors.password_confirmation}</p>}
                                </Field>
                            </div>
                    <div className="flex justify-end mt-6">
                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-white/90 active:scale-95 transition-all shadow-lg shadow-black/20 disabled:opacity-50"
                                >
                                    <Lock className="w-4 h-4" />
                                    {passwordForm.processing ? 'Updating…' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Layout>
    )
}