import { useState, useRef } from 'react'
import { toast } from 'sonner';
import { Head, useForm, usePage, router } from '@inertiajs/react'
import Layout from '@/layouts/Layout'
import {
    User, Mail, Phone, Venus, Hash, Shield,
    Camera, Pencil, Lock,
    BookMarked, BookOpen, RotateCcw, AlertTriangle, X, Save, Eye, EyeOff
} from 'lucide-react'

// Static map — both light and dark classes written out fully so Tailwind can detect them
const STAT_MAP = {
    'bg-white/10 text-white': {
        card:  'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-white/10',
        icon:  'bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-white',
        value: 'text-zinc-600 dark:text-white',
    },
    'bg-red-500/15 text-red-300': {
        card:  'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-white/10',
        icon:  'bg-red-50 text-red-500 dark:bg-red-500/15 dark:text-red-300',
        value: 'text-red-500 dark:text-red-300',
    },
    'bg-emerald-500/15 text-emerald-300': {
        card:  'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-white/10',
        icon:  'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
        value: 'text-emerald-600 dark:text-emerald-300',
    },
    'bg-white/8 text-white/60': {
        card:  'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-white/10',
        icon:  'bg-zinc-100 text-zinc-500 dark:bg-white/8 dark:text-white/60',
        value: 'text-zinc-500 dark:text-white/60',
    },
}

const StatCard = ({ icon: Icon, label, value, color }) => {
    const s = STAT_MAP[color]
    return (
        <div className={`relative overflow-hidden rounded-2xl border p-4 flex items-center gap-3 ${s.card}`}>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-white/20" />
            {/* Dark shimmer overlay — sits on top of dark:bg-zinc-900 */}
            <div className="absolute inset-0 pointer-events-none hidden dark:block bg-gradient-to-b from-white/8 via-white/4 to-white/2" />
            <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.icon}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="relative">
                <p className={`text-xl font-bold leading-none ${s.value}`}>{value}</p>
                <p className="text-[10px] mt-0.5 uppercase tracking-wide text-zinc-400 dark:text-white/40">{label}</p>
            </div>
        </div>
    )
}

const Field = ({ label, icon: Icon, children }) => (
    <div>
        <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider mb-1.5
            text-zinc-400 dark:text-white/40">
            <Icon className="w-3 h-3" /> {label}
        </label>
        {children}
    </div>
)

const inputCls = `w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all
    bg-zinc-50 border-zinc-200 text-zinc-800 placeholder:text-zinc-400 focus:ring-zinc-300 focus:border-zinc-400
    dark:bg-white/6 dark:border-white/10 dark:text-white dark:placeholder:text-white/25 dark:focus:ring-white/20 dark:focus:border-white/20`

export default function Profile({ user, stats }) {
    const [tab, setTab]                 = useState('info')
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew]         = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [preview, setPreview]         = useState(null)
    const fileRef                       = useRef(null)
    const { flash }                     = usePage().props

    const profileForm = useForm({
        firstname:  user.firstname,
        lastname:   user.lastname,
        email:      user.email,
        contact:    user.contact || '',
        gender:     user.gender,
        user_image: null,
    })

    const passwordForm = useForm({
        current_password:      '',
        password:              '',
        password_confirmation: '',
    })

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        profileForm.setData('user_image', file)
        setPreview(URL.createObjectURL(file))
    }

    const submitProfile = (e) => {
        e.preventDefault()
        profileForm.post('/profile', {
            forceFormData: true,
            onSuccess: () => { setPreview(null); toast.success('Profile updated successfully.') },
            onError:   () => toast.error('Failed to update profile.'),
        })
    }

    const submitPassword = (e) => {
        e.preventDefault()
        passwordForm.post('/profile/password', {
            onSuccess: () => { passwordForm.reset(); toast.success('Password updated successfully.') },
            onError:   () => toast.error('Failed to update password.'),
        })
    }

    const removeImage = () => {
        router.delete('/profile/image', {
            onSuccess: () => toast.success('Profile image removed.'),
        })
        setPreview(null)
    }

  const avatarSrc = preview || user.avatar_url || null

    const tabs = [
        { key: 'info',     label: 'Personal Info' },
        { key: 'password', label: 'Password'       },
    ]

    return (
        <Layout>
            <Head title="Profile" />

            {/* Ambient blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
                {/* Light */}
                <div className="absolute top-10 left-1/3 w-[500px] h-[300px] bg-blue-100/60 rounded-full blur-[140px] dark:hidden" />
                <div className="absolute bottom-20 right-1/3 w-[400px] h-[300px] bg-violet-100/50 rounded-full blur-[120px] dark:hidden" />
                {/* Dark — originals untouched */}
                <div className="absolute top-10 left-1/3 w-[500px] h-[300px] bg-slate-600/10 rounded-full blur-[140px] hidden dark:block" />
                <div className="absolute bottom-20 right-1/3 w-[400px] h-[300px] bg-slate-400/10 rounded-full blur-[120px] hidden dark:block" />
            </div>

            <div className="relative pt-16 pb-12 max-w-4xl mx-auto space-y-6">

                {/* ── HERO CARD ── */}
                <div className="relative overflow-hidden rounded-2xl border shadow-2xl
                    border-zinc-200 shadow-zinc-100
                    dark:border-white/10 dark:shadow-black/30">

                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-white/30" />

                    {/* Light background */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:hidden" />
                    {/* Dark background — your originals */}
                    <div className="absolute inset-0 pointer-events-none hidden dark:block bg-gradient-to-br from-zinc-950 via-zinc-800/60 to-zinc-950" />
                    <div className="absolute inset-0 pointer-events-none hidden dark:block bg-gradient-to-b from-white/8 via-white/4 to-white/2" />
                    {/* Corner glow — dark only */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/3 rounded-full blur-[80px] pointer-events-none hidden dark:block" />

                    <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">

                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 shadow-2xl
                                bg-zinc-100 border-zinc-200 shadow-zinc-200
                                dark:bg-gradient-to-br dark:from-white/15 dark:to-white/5 dark:border-white/15 dark:shadow-black/40">
                                {avatarSrc
                                    ? <img src={avatarSrc} alt={user.firstname} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-10 h-10 text-zinc-300 dark:text-white/30" />
                                      </div>
                                }
                            </div>
                            <button
                                onClick={() => fileRef.current?.click()}
                                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all
                                    bg-zinc-800 text-white hover:bg-zinc-700
                                    dark:bg-white dark:text-zinc-900 dark:hover:bg-white/90"
                            >
                                <Camera className="w-3.5 h-3.5" />
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center sm:text-left min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold truncate
                                text-zinc-900
                                dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:via-white/90 dark:to-white/50 dark:bg-clip-text">
                                {user.firstname} {user.lastname}
                            </h1>
                            <p className="text-sm mt-1 truncate text-zinc-400 dark:text-white/40">{user.email}</p>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize border
                                    bg-zinc-100 border-zinc-200 text-zinc-500
                                    dark:bg-white/8 dark:border-white/10 dark:text-white/60">
                                    <Shield className="w-3 h-3" /> {user.role}
                                </span>
                                {user.member_id && (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold font-mono border
                                        bg-zinc-100 border-zinc-200 text-zinc-500
                                        dark:bg-white/8 dark:border-white/10 dark:text-white/60">
                                        <Hash className="w-3 h-3" /> {user.member_id}
                                    </span>
                                )}
                                {user.gender && (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize border
                                        bg-zinc-100 border-zinc-200 text-zinc-500
                                        dark:bg-white/8 dark:border-white/10 dark:text-white/60">
                                        <Venus className="w-3 h-3" /> {user.gender}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Remove image button */}
                        {avatarSrc && (
                            <button onClick={removeImage}
                                className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center transition-all border
                                    bg-zinc-100 border-zinc-200 text-zinc-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200
                                    dark:bg-white/5 dark:border-white/10 dark:text-white/30 dark:hover:text-red-400 dark:hover:bg-red-500/10 dark:hover:border-red-500/20">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Stats row */}
                    <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 sm:px-8 pb-6">
                        <StatCard icon={BookMarked}    label="Borrowing" value={stats.currently_borrowing} color="bg-white/10 text-white"            />
                        <StatCard icon={AlertTriangle} label="Overdue"   value={stats.overdue}             color="bg-red-500/15 text-red-300"         />
                        <StatCard icon={RotateCcw}     label="Returned"  value={stats.total_returned}      color="bg-emerald-500/15 text-emerald-300" />
                        <StatCard icon={BookOpen}      label="All Time"  value={stats.total_borrowed}      color="bg-white/8 text-white/60"           />
                    </div>
                </div>

                {/* ── TABS + FORM CARD ── */}
                <div className="relative overflow-hidden rounded-2xl border shadow-xl
                    border-zinc-200 bg-white shadow-zinc-100
                    dark:border-white/10 dark:bg-transparent dark:shadow-black/20">

                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-white/20" />
                    {/* Dark overlays — your originals, only in dark */}
                    <div className="absolute inset-0 pointer-events-none hidden dark:block bg-gradient-to-b from-zinc-900/80 via-zinc-800/40 to-zinc-900/80" />
                    <div className="absolute inset-0 pointer-events-none hidden dark:block bg-gradient-to-b from-white/6 via-white/3 to-white/2" />

                    {/* Tab bar */}
                    <div className="relative flex border-b px-4 pt-3 gap-1
                        bg-zinc-50 border-zinc-200
                        dark:bg-black/20 dark:border-white/8">
                        {tabs.map(t => (
                            <button key={t.key} onClick={() => setTab(t.key)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-t-xl text-xs font-semibold transition-all border-b-2 ${
                                    tab === t.key
                                        ? 'border-zinc-700 text-zinc-800 bg-white dark:border-white/60 dark:text-white dark:bg-white/5'
                                        : 'border-transparent text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:text-white/40 dark:hover:text-white/70 dark:hover:bg-white/4'
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
                                    <input type="text" value={profileForm.data.firstname}
                                        onChange={e => profileForm.setData('firstname', e.target.value)}
                                        className={inputCls} placeholder="First name" />
                                    {profileForm.errors.firstname && <p className="text-[10px] mt-1 text-red-500 dark:text-red-400">{profileForm.errors.firstname}</p>}
                                </Field>

                                <Field label="Last Name" icon={User}>
                                    <input type="text" value={profileForm.data.lastname}
                                        onChange={e => profileForm.setData('lastname', e.target.value)}
                                        className={inputCls} placeholder="Last name" />
                                    {profileForm.errors.lastname && <p className="text-[10px] mt-1 text-red-500 dark:text-red-400">{profileForm.errors.lastname}</p>}
                                </Field>

                                <Field label="Email" icon={Mail}>
                                    <input type="email" value={profileForm.data.email}
                                        onChange={e => profileForm.setData('email', e.target.value)}
                                        className={inputCls} placeholder="Email address" />
                                    {profileForm.errors.email && <p className="text-[10px] mt-1 text-red-500 dark:text-red-400">{profileForm.errors.email}</p>}
                                </Field>

                                <Field label="Contact" icon={Phone}>
                                    <input type="text" value={profileForm.data.contact}
                                        onChange={e => profileForm.setData('contact', e.target.value)}
                                        className={inputCls} placeholder="Phone number" />
                                    {profileForm.errors.contact && <p className="text-[10px] mt-1 text-red-500 dark:text-red-400">{profileForm.errors.contact}</p>}
                                </Field>

                                <Field label="Gender" icon={Venus}>
                                    <select value={profileForm.data.gender}
                                        onChange={e => profileForm.setData('gender', e.target.value)}
                                        className={`${inputCls} appearance-none`}>
                                        <option value=""       className="bg-white dark:bg-zinc-900">Select gender</option>
                                        <option value="male"   className="bg-white dark:bg-zinc-900">Male</option>
                                        <option value="female" className="bg-white dark:bg-zinc-900">Female</option>
                                        <option value="other"  className="bg-white dark:bg-zinc-900">Other</option>
                                    </select>
                                    {profileForm.errors.gender && <p className="text-[10px] mt-1 text-red-500 dark:text-red-400">{profileForm.errors.gender}</p>}
                                </Field>

                                <Field label="Role" icon={Shield}>
                                    <div className={`${inputCls} cursor-not-allowed capitalize text-zinc-400 dark:text-white/40`}>
                                        {user.role}
                                    </div>
                                </Field>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button type="submit" disabled={profileForm.processing}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all shadow-lg disabled:opacity-50
                                        bg-zinc-900 text-white hover:bg-zinc-700 shadow-zinc-200
                                        dark:bg-white dark:text-zinc-900 dark:hover:bg-white/90 dark:shadow-black/20">
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
                                            className={`${inputCls} pr-10`} placeholder="Enter current password" />
                                        <button type="button" onClick={() => setShowCurrent(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors
                                                text-zinc-400 hover:text-zinc-600
                                                dark:text-white/30 dark:hover:text-white/60">
                                            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {passwordForm.errors.current_password && <p className="text-[10px] mt-1 text-red-500 dark:text-red-400">{passwordForm.errors.current_password}</p>}
                                </Field>

                                <Field label="New Password" icon={Lock}>
                                    <div className="relative">
                                        <input
                                            type={showNew ? 'text' : 'password'}
                                            value={passwordForm.data.password}
                                            onChange={e => passwordForm.setData('password', e.target.value)}
                                            className={`${inputCls} pr-10`} placeholder="Enter new password" />
                                        <button type="button" onClick={() => setShowNew(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors
                                                text-zinc-400 hover:text-zinc-600
                                                dark:text-white/30 dark:hover:text-white/60">
                                            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {passwordForm.errors.password && <p className="text-[10px] mt-1 text-red-500 dark:text-red-400">{passwordForm.errors.password}</p>}
                                </Field>

                                <Field label="Confirm New Password" icon={Lock}>
                                    <div className="relative">
                                        <input
                                            type={showConfirm ? 'text' : 'password'}
                                            value={passwordForm.data.password_confirmation}
                                            onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                                            className={`${inputCls} pr-10`} placeholder="Confirm new password" />
                                        <button type="button" onClick={() => setShowConfirm(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors
                                                text-zinc-400 hover:text-zinc-600
                                                dark:text-white/30 dark:hover:text-white/60">
                                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {passwordForm.errors.password_confirmation && <p className="text-[10px] mt-1 text-red-500 dark:text-red-400">{passwordForm.errors.password_confirmation}</p>}
                                </Field>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button type="submit" disabled={passwordForm.processing}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all shadow-lg disabled:opacity-50
                                        bg-zinc-900 text-white hover:bg-zinc-700 shadow-zinc-200
                                        dark:bg-white dark:text-zinc-900 dark:hover:bg-white/90 dark:shadow-black/20">
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
                               