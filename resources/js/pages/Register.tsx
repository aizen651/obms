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
import { toast } from 'sonner';

const Field = ({ label, error, children }) => (
    <div className="space-y-1.5">
        <Label className="text-xs font-medium text-white/60 uppercase tracking-wider">{label}</Label>
        {children}
        {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
)

const GlassInput = ({ icon: Icon, showToggle, onToggle, shown, error, ...props }) => (
    <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none z-10" />}
        <Input
            {...props}
            className={`bg-white/8 border-white/10 text-white placeholder:text-white/25 focus:border-white/25 focus:ring-white/25 ${Icon ? 'pl-9' : ''} ${showToggle ? 'pr-10' : ''} ${error ? 'border-red-400/40' : ''} h-10`}
        />
        {showToggle && (
            <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors z-10">
                {shown ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
        )}
    </div>
)

export default function Register() {
    const [showPw,    setShowPw]    = useState(false)
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
        post(route('register'), { forceFormData: true,
        onSuccess: () => {
            setPreview(null)
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
                    <div className="absolute top-20 left-1/4  w-96 h-96 bg-slate-500/8 rounded-full blur-[140px]" />
                    <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-slate-400/8 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 flex justify-center min-h-screen pt-16 pb-12 px-4">
                    <div className="w-full max-w-2xl">

                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border border-white/10 mb-4 shadow-xl shadow-black/20">
                                <BookOpen className="w-7 h-7 text-white/70" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent">
                                Create Account
                            </h1>
                            <p className="text-white/40 text-sm mt-2">
                                Already have an account?{' '}
                                <Link href="/login" className="text-white/70 hover:text-white underline underline-offset-2 transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>

                        {/* Card */}
                        <Card className="relative overflow-hidden bg-transparent border-white/10 shadow-2xl shadow-black/30">
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none" />

                            <CardContent className="relative p-6 sm:p-8">
                                <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">

                                    {/* Role Selector */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-white/60 uppercase tracking-wider">I am a</Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {ROLES.map(({ value, label, Icon, desc }) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    onClick={() => setData('role', value)}
                                                    className={`relative flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                                                        data.role === value
                                                            ? 'bg-white/15 border-white/30 shadow-lg shadow-black/20'
                                                            : 'bg-white/5 border-white/8 hover:bg-white/10 hover:border-white/15'
                                                    }`}
                                                >
                                                    {data.role === value && (
                                                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-t-xl" />
                                                    )}
                                                    <div className={`p-2 rounded-lg shrink-0 ${data.role === value ? 'bg-white/15' : 'bg-white/8'}`}>
                                                        <Icon size={18} className={data.role === value ? 'text-white' : 'text-white/40'} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className={`text-sm font-semibold ${data.role === value ? 'text-white' : 'text-white/50'}`}>{label}</p>
                                                        <p className="text-[10px] text-white/30 font-mono mt-0.5">{desc}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        {errors.role && <p className="text-xs text-red-400">{errors.role}</p>}
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
                                                <SelectTrigger className="bg-white/8 border-white/10 text-white focus:ring-white/25 h-10 data-[placeholder]:text-white/25">
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-800 border-white/10 text-white">
                                                    <SelectItem value="male"   className="focus:bg-white/10 focus:text-white">Male</SelectItem>
                                                    <SelectItem value="female" className="focus:bg-white/10 focus:text-white">Female</SelectItem>
                                                    <SelectItem value="other"  className="focus:bg-white/10 focus:text-white">Other</SelectItem>
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
                                    <Field label={<>Profile Photo <span className="text-white/25 normal-case font-normal">(optional)</span></>} error={errors.user_image}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setData('user_image', e.target.files[0])}
                                            className="w-full rounded-lg bg-white/8 border border-white/10 py-2 px-3 text-sm text-white/50 focus:outline-none focus:ring-2 focus:ring-white/25 transition-all file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-white/10 file:text-white/70 hover:file:bg-white/15 file:transition-colors file:cursor-pointer"
                                        />
                                    </Field>

                                    {/* Global error */}
                                    {errors.general && (
                                        <Alert className="bg-red-500/10 border-red-400/20">
                                            <AlertDescription className="text-red-400 text-sm">{errors.general}</AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Submit */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full h-11 rounded-xl bg-gradient-to-r from-white/90 to-white text-zinc-900 font-semibold text-sm hover:from-white hover:to-white transition-all shadow-lg shadow-black/20 disabled:opacity-50"
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

                                    <p className="text-center text-xs text-white/25">
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
                <div className="w-full border-t border-white/8" />
            </div>
            <div className="relative flex justify-center">
                <span className="px-3 text-xs text-white/25 uppercase tracking-widest bg-transparent">{label}</span>
            </div>
        </div>
    )
}