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
        <Label className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-white/60">
            {label}
        </Label>
        {children}
        {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
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
            <div className="pt-8 min-h-screen w-full overflow-x-hidden
                bg-gradient-to-b from-zinc-100 via-zinc-50 to-white
                dark:bg-gradient-to-b dark:from-zinc-950 dark:via-slate-800 dark:to-slate-700">

                <Navbar />

                {/* Ambient blobs */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                    {/* Light */}
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-[140px] dark:hidden" />
                    <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-100/30 rounded-full blur-[120px] dark:hidden" />
                    {/* Dark */}
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-slate-500/8 rounded-full blur-[140px] hidden dark:block" />
                    <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-slate-400/8 rounded-full blur-[120px] hidden dark:block" />
                </div>

                <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
                    <div className="w-full max-w-md">

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
                                Welcome Back
                            </h1>
                            <p className="text-sm mt-2 text-zinc-500 dark:text-white/40">
                                Don't have an account?{' '}
                                <Link href="/register" className="underline underline-offset-2 transition-colors
                                    text-zinc-700 hover:text-zinc-900
                                    dark:text-white/70 dark:hover:text-white">
                                    Register
                                </Link>
                            </p>
                        </div>

                        {/* Status message */}
                        {status && (
                            <Alert className="mb-4 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-400/20">
                                <AlertDescription className="text-emerald-700 dark:text-emerald-400 text-sm">
                                    {status}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Card */}
                        <Card className="relative overflow-hidden shadow-xl
                            bg-white border-zinc-200
                            dark:bg-transparent dark:border-white/10 dark:shadow-2xl dark:shadow-black/30">

                            {/* Top shimmer */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-white/30" />

                            {/* Dark inner overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/5 to-white/3 pointer-events-none hidden dark:block" />

                            <CardContent className="relative p-6 sm:p-8">
                                <form onSubmit={submit} className="space-y-5">

                                    {/* Email */}
                                    <Field label="Email Address" error={errors.email}>
                                        <div className="relative">
                                            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-zinc-400 dark:text-white/30" />
                                            <Input
                                                type="email"
                                                placeholder="juan@example.com"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                autoComplete="email"
                                                className={`pl-9 h-10
                                                    bg-zinc-50 border-zinc-200 text-zinc-800 placeholder:text-zinc-400
                                                    focus:border-zinc-400 focus-visible:ring-zinc-200
                                                    dark:bg-white/8 dark:border-white/10 dark:text-white dark:placeholder:text-white/25
                                                    dark:focus:border-white/25 dark:focus-visible:ring-white/20
                                                    ${errors.email ? 'border-red-300 dark:border-red-400/40' : ''}`}
                                            />
                                        </div>
                                    </Field>

                                    {/* Password */}
                                    <Field label="Password" error={errors.password}>
                                        <div className="relative">
                                            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-zinc-400 dark:text-white/30" />
                                            <Input
                                                type={showPw ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                autoComplete="current-password"
                                                className={`pl-9 pr-10 h-10
                                                    bg-zinc-50 border-zinc-200 text-zinc-800 placeholder:text-zinc-400
                                                    focus:border-zinc-400 focus-visible:ring-zinc-200
                                                    dark:bg-white/8 dark:border-white/10 dark:text-white dark:placeholder:text-white/25
                                                    dark:focus:border-white/25 dark:focus-visible:ring-white/20
                                                    ${errors.password ? 'border-red-300 dark:border-red-400/40' : ''}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPw(!showPw)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 transition-colors
                                                    text-zinc-400 hover:text-zinc-700
                                                    dark:text-white/30 dark:hover:text-white/60"
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
                                                className="border-zinc-300 data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900 data-[state=checked]:text-white
                                                    dark:border-white/20 dark:data-[state=checked]:bg-white dark:data-[state=checked]:border-white dark:data-[state=checked]:text-zinc-900"
                                            />
                                            <Label htmlFor="remember" className="text-sm cursor-pointer transition-colors
                                                text-zinc-500 hover:text-zinc-800
                                                dark:text-white/50 dark:hover:text-white/70">
                                                Remember me
                                            </Label>
                                        </div>
                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-sm underline underline-offset-2 transition-colors
                                                    text-zinc-500 hover:text-zinc-800
                                                    dark:text-white/50 dark:hover:text-white/80"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>

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
                                        className="w-full h-11 rounded-xl font-semibold text-sm transition-all shadow-lg disabled:opacity-50 mt-2
                                            bg-zinc-900 text-white hover:bg-zinc-700 shadow-black/10
                                            dark:bg-gradient-to-r dark:from-white/90 dark:to-white dark:text-zinc-900 dark:hover:from-white dark:hover:to-white dark:shadow-black/20"
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
                                        <div className="w-full border-t border-zinc-200 dark:border-white/8" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-3 text-xs uppercase tracking-widest
                                            bg-white text-zinc-400
                                            dark:bg-transparent dark:text-white/25">
                                            or continue as
                                        </span>
                                    </div>
                                </div>

                                {/* Guest browse */}
                                <Link
                                    href={route('books')}
                                    className="flex items-center justify-center gap-2 w-full h-10 rounded-xl text-sm font-medium transition-all
                                        bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-zinc-800
                                        dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-white/50 dark:hover:text-white/80"
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
