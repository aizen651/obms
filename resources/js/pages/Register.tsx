import { Head, Link, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { User, Mail, Phone, Lock, Eye, EyeOff, BookOpen, GraduationCap, Users } from 'lucide-react'
import Layout from '@/layouts/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

const Field = ({ label, error, children }) => (
    <div className="space-y-1.5">
        <Label className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-white/60">
            {label}
        </Label>
        {children}
        {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
)

const GlassInput = ({ icon: Icon, showToggle, onToggle, shown, error, ...props }) => (
    <div className="relative">
        {Icon && (
            <Icon
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10
                    text-zinc-400 dark:text-white/30"
            />
        )}
        <Input
            {...props}
            className={`h-10
                bg-zinc-50 border-zinc-200 text-zinc-800 placeholder:text-zinc-400
                focus:border-zinc-400 focus-visible:ring-zinc-200
                dark:bg-white/8 dark:border-white/10 dark:text-white dark:placeholder:text-white/25
                dark:focus:border-white/25 dark:focus-visible:ring-white/20
                ${Icon ? 'pl-9' : ''}
                ${showToggle ? 'pr-10' : ''}
                ${error ? 'border-red-300 dark:border-red-400/40' : ''}
            `}
        />
        {showToggle && (
            <button
                type="button"
                onClick={onToggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 transition-colors
                    text-zinc-400 hover:text-zinc-700
                    dark:text-white/30 dark:hover:text-white/60"
            >
                {shown ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
        )}
    </div>
)

export default function Register() {
    const [showPw, setShowPw] = useState(false)
    const [showConfPw, setShowConfPw] = useState(false)

    const { data, setData, post, processing, errors } = useForm({
        firstname:             '',
        lastname:              '',
        email:                 '',
        contact:               null,
        gender:                '',
        role:                  '',
        password:              '',
        password_confirmation: '',
        user_image:            null,
    })

    const submit = (e) => {
        e.preventDefault()
        post(route('register'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('You are now successfully registered.')
            },
            onError: () => toast.error('Registration failed.'),
        })
    }

    const ROLES = [
        { value: 'student', label: 'Student',    Icon: GraduationCap, desc: 'Auto ID: STD-XXXXXX'  },
        { value: 'teacher', label: 'Instructor', Icon: Users,         desc: 'Auto ID: INST-XXXXXX' },
    ]

    return (
        <>
            <Head title="Register" />

            <Layout>
                {/* Ambient blobs */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                    {/* Light mode blobs */}
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-[140px] dark:hidden" />
                    <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-100/30 rounded-full blur-[120px] dark:hidden" />
                    {/* Dark mode blobs */}
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-slate-500/8 rounded-full blur-[140px] hidden dark:block" />
                    <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-slate-400/8 rounded-full blur-[120px] hidden dark:block" />
                </div>

                <div className="relative z-10 flex justify-center min-h-screen pt-16 pb-12 px-4">
                    <div className="w-full max-w-2xl">

                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-xl
                                bg-zinc-900 border border-zinc-700
                                dark:bg-gradient-to-br dark:from-white/15 dark:to-white/5 dark:border-white/10 dark:shadow-black/20">
                                <BookOpen className="w-7 h-7 text-white dark:text-white/70" />
                            </div>
                            <h1 className="text-3xl font-bold
                                text-zinc-900
                                dark:bg-gradient-to-r dark:from-white dark:via-white/90 dark:to-white/50 dark:bg-clip-text dark:text-transparent">
                                Create Account
                            </h1>
                            <p className="text-sm mt-2 text-zinc-500 dark:text-white/40">
                                Already have an account?{' '}
                                <Link href="/login" className="underline underline-offset-2 transition-colors
                                    text-zinc-700 hover:text-zinc-900
                                    dark:text-white/70 dark:hover:text-white">
                                    Sign in
                                </Link>
                            </p>
                        </div>

                        {/* Card */}
                        <Card className="relative overflow-hidden shadow-xl
                            bg-white border-zinc-200
                            dark:bg-transparent dark:border-white/10 dark:shadow-2xl dark:shadow-black/30">

                            {/* Top shimmer */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-white/30" />

                            {/* Dark inner overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none hidden dark:block" />

                            <CardContent className="relative p-6 sm:p-8">
                                <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">

                                    {/* Role Selector */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-white/60">
                                            I am a
                                        </Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {ROLES.map(({ value, label, Icon, desc }) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    onClick={() => setData('role', value)}
                                                    className={`relative flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                                                        data.role === value
                                                            ? 'bg-zinc-100 border-zinc-300 shadow-md dark:bg-white/15 dark:border-white/30 dark:shadow-black/20'
                                                            : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 dark:bg-white/5 dark:border-white/8 dark:hover:bg-white/10 dark:hover:border-white/15'
                                                    }`}
                                                >
                                                    {data.role === value && (
                                                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-400/40 to-transparent rounded-t-xl dark:via-white/40" />
                                                    )}
                                                    <div className={`p-2 rounded-lg shrink-0 ${
                                                        data.role === value
                                                            ? 'bg-zinc-200 dark:bg-white/15'
                                                            : 'bg-zinc-100 dark:bg-white/8'
                                                    }`}>
                                                        <Icon
                                                            size={18}
                                                            className={data.role === value
                                                                ? 'text-zinc-800 dark:text-white'
                                                                : 'text-zinc-400 dark:text-white/40'
                                                            }
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className={`text-sm font-semibold ${
                                                            data.role === value
                                                                ? 'text-zinc-900 dark:text-white'
                                                                : 'text-zinc-400 dark:text-white/50'
                                                        }`}>
                                                            {label}
                                                        </p>
                                                        <p className="text-[10px] font-mono mt-0.5 text-zinc-400 dark:text-white/30">
                                                            {desc}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        {errors.role && <p className="text-xs text-red-500 dark:text-red-400">{errors.role}</p>}
                                    </div>

                                    {/* Divider */}
                                    <Divider label="Personal Info" />

                                    {/* Name */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="First Name" error={errors.firstname}>
                                            <GlassInput icon={User} type="text" placeholder="Juan" value={data.firstname} onChange={e => setData('firstname', e.target.value)} error={errors.firstname} />
                                        </Field>
                                        <Field label="Last Name" error={errors.lastname}>
                                            <GlassInput type="text" placeholder="Dela Cruz" value={data.lastname} onChange={e => setData('lastname', e.target.value)} error={errors.lastname} />
                                        </Field>
                                    </div>

                                    {/* Email */}
                                    <Field label="Email Address" error={errors.email}>
                                        <GlassInput icon={Mail} type="email" placeholder="juan@example.com" value={data.email} onChange={e => setData('email', e.target.value)} error={errors.email} />
                                    </Field>

                                    {/* Contact + Gender */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="Contact Number" error={errors.contact}>
                                            <GlassInput icon={Phone} type="text" placeholder="09XXXXXXXXX" value={data.contact} onChange={e => setData('contact', e.target.value)} error={errors.contact} />
                                        </Field>
                                        <Field label="Gender" error={errors.gender}>
                                            <Select value={data.gender} onValueChange={v => setData('gender', v)}>
                                                <SelectTrigger className="h-10
                                                    bg-zinc-50 border-zinc-200 text-zinc-800
                                                    focus:ring-zinc-200 data-[placeholder]:text-zinc-400
                                                    dark:bg-white/8 dark:border-white/10 dark:text-white
                                                    dark:focus:ring-white/25 dark:data-[placeholder]:text-white/25">
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent className="
                                                    bg-white border-zinc-200 text-zinc-800
                                                    dark:bg-slate-800 dark:border-white/10 dark:text-white">
                                                    <SelectItem value="male"   className="focus:bg-zinc-100 dark:focus:bg-white/10 dark:focus:text-white">Male</SelectItem>
                                                    <SelectItem value="female" className="focus:bg-zinc-100 dark:focus:bg-white/10 dark:focus:text-white">Female</SelectItem>
                                                    <SelectItem value="other"  className="focus:bg-zinc-100 dark:focus:bg-white/10 dark:focus:text-white">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    </div>

                                    {/* Divider */}
                                    <Divider label="Security" />

                                    {/* Passwords */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="Password" error={errors.password}>
                                            <GlassInput
                                                icon={Lock}
                                                type={showPw ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                showToggle onToggle={() => setShowPw(!showPw)} shown={showPw}
                                                error={errors.password}
                                            />
                                        </Field>
                                        <Field label="Confirm Password" error={errors.password_confirmation}>
                                            <GlassInput
                                                icon={Lock}
                                                type={showConfPw ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={data.password_confirmation}
                                                onChange={e => setData('password_confirmation', e.target.value)}
                                                showToggle onToggle={() => setShowConfPw(!showConfPw)} shown={showConfPw}
                                                error={errors.password_confirmation}
                                            />
                                        </Field>
                                    </div>

                                    {/* Profile Photo */}
                                    <Field
                                        label={<>Profile Photo <span className="normal-case font-normal text-zinc-400 dark:text-white/25">(optional)</span></>}
                                        error={errors.user_image}
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setData('user_image', e.target.files[0])}
                                            className="w-full rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 transition-all
                                                bg-zinc-50 border border-zinc-200 text-zinc-500
                                                focus:ring-zinc-200
                                                file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium
                                                file:bg-zinc-200 file:text-zinc-700 hover:file:bg-zinc-300 file:transition-colors file:cursor-pointer
                                                dark:bg-white/8 dark:border-white/10 dark:text-white/50
                                                dark:focus:ring-white/25
                                                dark:file:bg-white/10 dark:file:text-white/70 dark:hover:file:bg-white/15"
                                        />
                                    </Field>

                                    {/* Global error */}
                                    {errors.general && (
                                        <Alert className="bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-400/20">
                                            <AlertDescription className="text-red-600 dark:text-red-400 text-sm">
                                                {errors.general}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Submit */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full h-11 rounded-xl font-semibold text-sm transition-all shadow-lg disabled:opacity-50
                                            bg-zinc-900 text-white hover:bg-zinc-700 shadow-black/10
                                            dark:bg-gradient-to-r dark:from-white/90 dark:to-white dark:text-zinc-900 dark:hover:from-white dark:hover:to-white dark:shadow-black/20"
                                    >
                                        {processing ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Creating account…
                                            </span>
                                        ) : 'Create Account'}
                                    </Button>

                                    <p className="text-center text-xs text-zinc-400 dark:text-white/25">
                                        Your Student or Instructor ID will be automatically generated upon registration.
                                    </p>

                                </form>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </Layout>
        </>
    )
}

function Divider({ label }) {
    return (
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-white/8" />
            </div>
            <div className="relative flex justify-center">
                <span className="px-3 text-xs uppercase tracking-widest
                    bg-white text-zinc-400
                    dark:bg-transparent dark:text-white/25">
                    {label}
                </span>
            </div>
        </div>
    )
} 