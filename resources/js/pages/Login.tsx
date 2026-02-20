import { Head, Link, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, BookOpen } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'

const Field = ({ label, error, children }) => (
    <div className="space-y-1.5">
        <Label className="text-xs font-medium text-white/60 uppercase tracking-wider">{label}</Label>
        {children}
        {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
)

export default function Login({ status, canResetPassword }) {
    const [showPw, setShowPw] = useState(false)

    const { data, setData, post, processing, errors } = useForm({
        email:    '',
        password: '',
        remember: false,
    })

    const submit = (e) => {
        e.preventDefault()
        post(route('login'))
    }

    return (
        <>
            <Head title="Login" />
            <div className="pt-8 min-h-screen w-full bg-gradient-to-b from-zinc-950 via-slate-800 to-slate-700 overflow-x-hidden">

                <Navbar />

                {/* Ambient blobs */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-20 left-1/4  w-96 h-96 bg-slate-500/8 rounded-full blur-[140px]" />
                    <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-slate-400/8 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
                    <div className="w-full max-w-md">

                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border border-white/10 mb-4 shadow-xl shadow-black/20">
                                <BookOpen className="w-7 h-7 text-white/70" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent">
                                Welcome Back
                            </h1>
                            <p className="text-white/40 text-sm mt-2">
                                Don't have an account?{' '}
                                <Link href="/register" className="text-white/70 hover:text-white underline underline-offset-2 transition-colors">
                                    Register
                                </Link>
                            </p>
                        </div>

                        {/* Status message (e.g. password reset success) */}
                        {status && (
                            <Alert className="mb-4 bg-emerald-500/10 border-emerald-400/20">
                                <AlertDescription className="text-emerald-400 text-sm">{status}</AlertDescription>
                            </Alert>
                        )}

                        {/* Card */}
                        <Card className="relative overflow-hidden bg-transparent border-white/10 shadow-2xl shadow-black/30">
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none" />

                            <CardContent className="relative p-6 sm:p-8">
                                <form onSubmit={submit} className="space-y-5">

                                    {/* Email */}
                                    <Field label="Email Address" error={errors.email}>
                                        <div className="relative">
                                            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none z-10" />
                                            <Input
                                                type="email"
                                                placeholder="juan@example.com"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                autoComplete="email"
                                                className={`bg-white/8 border-white/10 text-white placeholder:text-white/25 focus:border-white/25 focus-visible:ring-white/20 pl-9 h-10 ${errors.email ? 'border-red-400/40' : ''}`}
                                            />
                                        </div>
                                    </Field>

                                    {/* Password */}
                                    <Field label="Password" error={errors.password}>
                                        <div className="relative">
                                            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none z-10" />
                                            <Input
                                                type={showPw ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                autoComplete="current-password"
                                                className={`bg-white/8 border-white/10 text-white placeholder:text-white/25 focus:border-white/25 focus-visible:ring-white/20 pl-9 pr-10 h-10 ${errors.password ? 'border-red-400/40' : ''}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPw(!showPw)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors z-10"
                                            >
                                                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                        </div>
                                    </Field>

                                    {/* Remember + Forgot */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="remember"
                                                checked={data.remember}
                                                onCheckedChange={v => setData('remember', v)}
                                                className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-zinc-900"
                                            />
                                            <Label htmlFor="remember" className="text-sm text-white/50 cursor-pointer hover:text-white/70 transition-colors">
                                                Remember me
                                            </Label>
                                        </div>
                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-sm text-white/50 hover:text-white/80 transition-colors underline underline-offset-2"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>

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
                                        className="w-full h-11 rounded-xl bg-gradient-to-r from-white/90 to-white text-zinc-900 font-semibold text-sm hover:from-white hover:to-white transition-all shadow-lg shadow-black/20 disabled:opacity-50 mt-2"
                                    >
                                        {processing ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Signing in…
                                            </span>
                                        ) : 'Sign In'}
                                    </Button>

                                </form>

                                {/* Divider */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/8" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-3 text-xs text-white/25 uppercase tracking-widest">
                                            or continue as
                                        </span>
                                    </div>
                                </div>

                                {/* Guest browse */}
                                <Link
                                    href={route('books')}
                                    className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white/80 text-sm font-medium transition-all"
                                >
                                    <BookOpen size={15} />
                                    Browse Books as Guest
                                </Link>

                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </>
    )
}