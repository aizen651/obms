import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.login'));
    };

    return (
        <>
            <Head title="Admin Login" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

                * { box-sizing: border-box; margin: 0; padding: 0; }

                .login-root {
                    min-height: 100vh;
                    background-color: #faf8f5;
                    background-image:
                        radial-gradient(ellipse 80% 50% at 20% 10%, rgba(99, 102, 241, 0.12) 0%, transparent 60%),
                        radial-gradient(ellipse 60% 40% at 80% 90%, rgba(59, 130, 246, 0.10) 0%, transparent 60%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    font-family: 'DM Sans', sans-serif;
                    position: relative;
                    overflow: hidden;
                }

                /* Subtle grid texture */
                .login-root::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
                    background-size: 40px 40px;
                    pointer-events: none;
                }

                .login-layout {
                    display: flex;
                    width: 100%;
                    max-width: 900px;
                    min-height: 560px;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow:
                        0 0 0 1px rgba(0,0,0,0.06),
                        0 24px 64px rgba(0,0,0,0.10),
                        0 4px 12px rgba(0,0,0,0.06);
                    position: relative;
                    z-index: 1;
                    animation: rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
                }

                @keyframes rise {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* Left decorative panel */
                .login-panel {
                    width: 340px;
                    flex-shrink: 0;
                    background: linear-gradient(145deg, #4f46e5 0%, #2563eb 100%);
                    padding: 48px 40px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                }

                .login-panel::before {
                    content: '';
                    position: absolute;
                    top: -60px; right: -60px;
                    width: 240px; height: 240px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.08);
                }

                .login-panel::after {
                    content: '';
                    position: absolute;
                    bottom: -40px; left: -40px;
                    width: 180px; height: 180px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.06);
                }

                .panel-brand {
                    position: relative;
                    z-index: 1;
                }

                .panel-icon {
                    width: 48px; height: 48px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 14px;
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 24px;
                    backdrop-filter: blur(8px);
                }

                .panel-title {
                    font-family: 'DM Serif Display', serif;
                    font-size: 32px;
                    color: #fff;
                    line-height: 1.2;
                    margin-bottom: 12px;
                }

                .panel-subtitle {
                    font-size: 14px;
                    color: rgba(255,255,255,0.75);
                    line-height: 1.6;
                    font-weight: 300;
                }

                .panel-footer {
                    position: relative;
                    z-index: 1;
                }

                .panel-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(255,255,255,0.15);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 100px;
                    padding: 6px 14px;
                    font-size: 12px;
                    color: rgba(255,255,255,0.9);
                    font-weight: 500;
                    backdrop-filter: blur(8px);
                }

                .panel-badge-dot {
                    width: 6px; height: 6px;
                    background: #86efac;
                    border-radius: 50%;
                    box-shadow: 0 0 0 2px rgba(134,239,172,0.3);
                }

                /* Right form panel */
                .login-form-wrap {
                    flex: 1;
                    background: #ffffff;
                    padding: 52px 48px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .form-heading {
                    margin-bottom: 36px;
                }

                .form-eyebrow {
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #4f46e5;
                    margin-bottom: 8px;
                }

                .form-title {
                    font-family: 'DM Serif Display', serif;
                    font-size: 26px;
                    color: #1c1917;
                    margin-bottom: 6px;
                }

                .form-desc {
                    font-size: 14px;
                    color: #78716c;
                    font-weight: 300;
                }

                .field {
                    margin-bottom: 20px;
                    position: relative;
                }

                .float-wrap {
                    position: relative;
                }

                .field-input {
                    width: 100%;
                    padding: 14px 16px;
                    border: 1.5px solid #e7e5e4;
                    border-radius: 10px;
                    font-size: 15px;
                    font-family: 'DM Sans', sans-serif;
                    color: #1c1917;
                    background: #fafaf9;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                }

                .field-input::placeholder { color: transparent; }

                .field-input:focus {
                    border-color: #4f46e5;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(79,70,229,0.14);
                }

                .field-input.has-error { border-color: #ef4444; }
                .field-input.has-error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }

                .field-label {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 15px;
                    font-weight: 400;
                    color: #a8a29e;
                    pointer-events: none;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    transform-origin: left top;
                    padding: 0 2px;
                }

                .field-input:focus ~ .field-label,
                .field-input:not(:placeholder-shown) ~ .field-label {
                    top: -1px;
                    transform: translateY(-50%) scale(0.78);
                    color: #4f46e5;
                    font-weight: 500;
                    background: #fff;
                    padding: 0 6px;
                    left: 12px;
                }

                .field-input.has-error:not(:placeholder-shown) ~ .field-label,
                .field-input.has-error:focus ~ .field-label {
                    color: #ef4444;
                }

                .field-error {
                    font-size: 12px;
                    color: #ef4444;
                    margin-top: 6px;
                    font-weight: 500;
                }

                .password-wrap { position: relative; }

                .password-toggle {
                    position: absolute;
                    right: 12px; top: 50%;
                    transform: translateY(-50%);
                    background: none; border: none; cursor: pointer;
                    color: #a8a29e;
                    display: flex; align-items: center; justify-content: center;
                    padding: 4px;
                    border-radius: 6px;
                    transition: color 0.15s, background 0.15s;
                }

                .password-toggle:hover { color: #78716c; background: #f5f5f4; }

                .remember-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 28px;
                }

                .remember-checkbox {
                    width: 16px; height: 16px;
                    accent-color: #4f46e5;
                    cursor: pointer;
                    border-radius: 4px;
                }

                .remember-label {
                    font-size: 13px;
                    color: #78716c;
                    cursor: pointer;
                }

                .error-banner {
                    padding: 12px 16px;
                    background: #fff1f2;
                    border: 1px solid #fecdd3;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }

                .error-banner p {
                    font-size: 13px;
                    color: #e11d48;
                    font-weight: 500;
                }

                .submit-btn {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
                    box-shadow: 0 4px 14px rgba(79,70,229,0.35);
                    letter-spacing: 0.01em;
                }

                .submit-btn:hover:not(:disabled) {
                    opacity: 0.92;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(79,70,229,0.40);
                }

                .submit-btn:active:not(:disabled) { transform: translateY(0); }
                .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

                @media (max-width: 680px) {
                    .login-panel { display: none; }
                    .login-layout { max-width: 440px; border-radius: 20px; }
                    .login-form-wrap { padding: 40px 32px; }
                }
            `}</style>

            <div className="login-root">
                <div className="login-layout">
                    {/* Decorative left panel */}
                    <div className="login-panel">
                        <div className="panel-brand">
                            <div className="panel-icon">
                                <svg width="22" height="22" fill="none" stroke="#fff" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="panel-title">Admin<br />Portal</h2>
                            <p className="panel-subtitle">Manage your platform, settings, and data from one place.</p>
                        </div>
                        <div className="panel-footer">
                            <span className="panel-badge">
                                <span className="panel-badge-dot" />
                                Secure connection
                            </span>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="login-form-wrap">
                        <div className="form-heading">
                            <p className="form-eyebrow">Welcome back</p>
                            <h1 className="form-title">Sign in to your account</h1>
                            <p className="form-desc">Enter your credentials to access the dashboard.</p>
                        </div>

                        <form onSubmit={submit}>
                            <div className="field">
                                <div className="float-wrap">
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={`field-input${errors.email ? ' has-error' : ''}`}
                                        placeholder=" "
                                        autoComplete="email"
                                        required
                                    />
                                    <label htmlFor="email" className="field-label">Email Address</label>
                                </div>
                                {errors.email && <p className="field-error">{errors.email}</p>}
                            </div>

                            <div className="field">
                                <div className="float-wrap password-wrap">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`field-input${errors.password ? ' has-error' : ''}`}
                                        placeholder=" "
                                        autoComplete="current-password"
                                        required
                                    />
                                    <label htmlFor="password" className="field-label">Password</label>
                                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="field-error">{errors.password}</p>}
                            </div>

                            <div className="remember-row">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="remember-checkbox"
                                />
                                <label htmlFor="remember" className="remember-label">Remember me</label>
                            </div>

                            {errors.error && (
                                <div className="error-banner">
                                    <p>{errors.error}</p>
                                </div>
                            )}

                            <button type="submit" disabled={processing} className="submit-btn">
                                {processing ? 'Signing in…' : 'Sign In →'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
