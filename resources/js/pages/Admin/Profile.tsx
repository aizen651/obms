import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import { User, Lock, Camera, Save, KeyRound, Shield, Mail, Phone, Venus, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const Field = ({ label, type = 'text', value, onChange, error, required, icon: Icon }) => (
    <div style={{ position: 'relative', marginBottom: 0 }}>
        <div style={{ position: 'relative' }}>
            {Icon && (
                <span style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    color: 'rgba(0,0,0,0.25)', display: 'flex', pointerEvents: 'none', zIndex: 1,
                }}>
                    <Icon size={15} strokeWidth={1.75} />
                </span>
            )}
            <input
                type={type}
                placeholder=" "
                value={value}
                onChange={onChange}
                required={required}
                style={{
                    width: '100%',
                    padding: Icon ? '20px 14px 8px 40px' : '20px 14px 8px 14px',
                    border: `1.5px solid ${error ? '#f43f5e' : '#e8e8f0'}`,
                    borderRadius: 12, fontSize: 14,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: '#0f0e17', background: '#fafafa', outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.18s, box-shadow 0.18s, background 0.18s',
                }}
                onFocus={e => { e.target.style.borderColor = '#4f46e5'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = error ? '#f43f5e' : '#e8e8f0'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
            />
            <label style={{
                position: 'absolute', left: Icon ? 40 : 14, top: '50%',
                transform: 'translateY(-50%)', fontSize: 14, color: '#b0adb8',
                pointerEvents: 'none', transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
                transformOrigin: 'left top', padding: '0 2px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
            }} className="float-lbl">{label}</label>
        </div>
        {error && <p style={{ fontSize: 11, color: '#f43f5e', marginTop: 5, fontWeight: 500 }}>{error}</p>}
        <style>{`
            input:focus ~ .float-lbl, input:not(:placeholder-shown) ~ .float-lbl {
                top: -1px !important;
                transform: translateY(-50%) scale(0.74) !important;
                color: #4f46e5 !important;
                font-weight: 600 !important;
                background: #fff !important;
                padding: 0 5px !important;
                left: 12px !important;
            }
        `}</style>
    </div>
);

const InfoTile = ({ label, value, icon: Icon, color }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 18px', background: '#fafafa',
        borderRadius: 12, border: '1px solid #f0f0f8',
    }}>
        <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: `${color}14`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <Icon size={17} style={{ color }} strokeWidth={1.75} />
        </div>
        <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 10.5, fontWeight: 600, color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{label}</p>
            <p style={{ fontSize: 13.5, fontWeight: 500, color: '#0f0e17', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value || '—'}</p>
        </div>
    </div>
);

export default function Profile() {
    const { auth } = usePage().props;
    const u = auth.user;
    const [tab, setTab] = useState('profile');
    const [preview, setPreview] = useState(u.avatar_url || null);

    const pf  = useForm({ user_image: null, firstname: u.firstname || '', lastname: u.lastname || '', email: u.email || '', contact: u.contact || '', gender: u.gender || '' });
    const pwf = useForm({ current_password: '', password: '', password_confirmation: '' });

    const onImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        pf.setData('user_image', file);
        const r = new FileReader();
        r.onloadend = () => setPreview(r.result as string);
        r.readAsDataURL(file);
    };

    const saveProfile = (e) => {
        e.preventDefault();
        pf.post('/admin/profile/update', {
            preserveScroll: true,
            onSuccess: (page: any) => {
                const updatedUser = page.props.auth?.user;
                if (updatedUser?.avatar_url) setPreview(updatedUser.avatar_url);
                toast.success('Profile updated!');
            },
            onError: () => toast.error('Failed to update profile.'),
        });
    };

    const savePassword = (e) => {
        e.preventDefault();
        pwf.put('/admin/profile/password', {
            preserveScroll: true,
            onSuccess: () => { pwf.reset(); toast.success('Password changed!'); },
            onError: () => toast.error('Failed to change password.'),
        });
    };

    const SubmitBtn = ({ processing, label, loadLabel, Icon }) => (
        <button
            type="submit"
            disabled={processing}
            style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 24px',
                background: processing ? '#c7c4f0' : 'linear-gradient(135deg,#4f46e5,#2563eb)',
                color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 13.5, fontWeight: 600, border: 'none', borderRadius: 11,
                cursor: processing ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(79,70,229,0.28)',
                transition: 'opacity 0.15s, transform 0.15s', marginTop: 4,
            }}
            onMouseEnter={e => { if (!processing) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
        >
            {processing
                ? <><span style={{ width:14,height:14,border:'2px solid rgba(255,255,255,0.4)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite',display:'inline-block' }} />{loadLabel}</>
                : <><Icon size={14} strokeWidth={2} />{label}</>
            }
        </button>
    );

    return (
        <AdminAuthLayout header="Profile Settings">
            <Head title="Profile" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeup { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
                .prof-page * { box-sizing: border-box; }
                .prof-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .prof-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
                @media (max-width: 680px) {
                    .prof-grid   { grid-template-columns: 1fr; }
                    .prof-grid-3 { grid-template-columns: 1fr 1fr; }
                    .prof-header-inner { flex-direction: column !important; align-items: flex-start !important; }
                    .prof-tabs-row { overflow-x: auto; }
                }
                @media (max-width: 420px) {
                    .prof-grid-3 { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="prof-page" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: 860, margin: '0 auto' }}>

                {/* Header card */}
                <div style={{
                    background: '#fff', borderRadius: 20,
                    border: '1px solid rgba(0,0,0,0.07)',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                    overflow: 'hidden', marginBottom: 18, animation: 'fadeup .3s ease',
                }}>
                    {/* Banner */}
                    <div style={{
                        height: 96,
                        background: 'linear-gradient(120deg, #eef2ff 0%, #e0e7ff 40%, #dbeafe 100%)',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, borderRadius:'50%', background:'rgba(79,70,229,0.06)' }} />
                        <div style={{ position:'absolute', bottom:-20, left:'30%', width:100, height:100, borderRadius:'50%', background:'rgba(37,99,235,0.05)' }} />
                        <div style={{ position:'absolute', top:10, left:10, width:60, height:60, borderRadius:'50%', background:'rgba(79,70,229,0.04)' }} />
                    </div>

                    {/* Profile info row */}
                    <div className="prof-header-inner" style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:'0 28px 24px', gap:16 }}>
                        <div style={{ display:'flex', alignItems:'flex-end', gap:18 }}>
                            {/* Avatar */}
                            <div style={{ position:'relative', marginTop:-44, flexShrink:0 }}>
                                <div style={{
                                    width:88, height:88, borderRadius:'50%', overflow:'hidden',
                                    background:'linear-gradient(135deg,#4f46e5,#2563eb)',
                                    display:'flex', alignItems:'center', justifyContent:'center',
                                    fontSize:28, fontWeight:700, color:'#fff',
                                    border:'4px solid #fff',
                                    boxShadow:'0 4px 16px rgba(79,70,229,0.2)',
                                }}>
                                    {preview
                                        ? <img src={preview} alt="avatar" style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                                        : <span>{u.firstname?.charAt(0)}{u.lastname?.charAt(0)}</span>
                                    }
                                </div>
                                <label style={{
                                    position:'absolute', bottom:2, right:2,
                                    width:28, height:28, borderRadius:'50%',
                                    background:'#4f46e5',
                                    display:'flex', alignItems:'center', justifyContent:'center',
                                    cursor:'pointer', border:'2px solid #fff',
                                    boxShadow:'0 2px 8px rgba(79,70,229,0.3)',
                                    transition:'transform 0.15s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'}
                                    onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                                >
                                    <Camera size={12} color="#fff" strokeWidth={2.5} />
                                    <input type="file" style={{ display:'none' }} accept="image/*" onChange={onImage} />
                                </label>
                            </div>

                            {/* Name + meta */}
                            <div style={{ paddingBottom:4 }}>
                                <h1 style={{ fontSize:20, fontWeight:700, color:'#0f0e17', marginBottom:6, lineHeight:1.2 }}>
                                    {u.firstname} {u.lastname}
                                </h1>
                                <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                                    <span style={{
                                        display:'inline-flex', alignItems:'center', gap:4,
                                        background:'#eef2ff', color:'#4f46e5',
                                        fontSize:10.5, fontWeight:600, letterSpacing:'.07em', textTransform:'uppercase',
                                        borderRadius:100, padding:'3px 10px',
                                        border:'1px solid rgba(79,70,229,0.15)',
                                    }}>
                                        <Shield size={9} strokeWidth={2.5} />{u.role}
                                    </span>
                                    <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:12, color:'rgba(0,0,0,0.35)' }}>
                                        <CheckCircle2 size={12} color="#22c55e" strokeWidth={2} /> Active account
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info tiles */}
                    <div style={{ padding:'0 28px 24px' }}>
                        <div className="prof-grid-3" style={{ gap:12 }}>
                            <InfoTile label="Email"  value={u.email}   icon={Mail}  color="#4f46e5" />
                            <InfoTile label="Phone"  value={u.contact} icon={Phone} color="#2563eb" />
                            <InfoTile label="Gender" value={u.gender}  icon={Venus} color="#0891b2" />
                        </div>
                    </div>
                </div>

                {/* Tab nav */}
                <div className="prof-tabs-row" style={{ display:'flex', gap:4, marginBottom:16, background:'#f1f2f8', borderRadius:13, padding:4 }}>
                    {[
                        { id:'profile',  label:'Edit Profile',    icon:<User size={13} strokeWidth={2} /> },
                        { id:'password', label:'Change Password', icon:<Lock size={13} strokeWidth={2} /> },
                    ].map(({ id, label, icon }) => (
                        <button key={id} onClick={() => setTab(id)} style={{
                            flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                            padding:'9px 18px', borderRadius:10, fontSize:13,
                            fontFamily:"'Plus Jakarta Sans',sans-serif",
                            cursor:'pointer', border:'none', transition:'all 0.18s',
                            color: tab===id ? '#4f46e5' : 'rgba(0,0,0,0.42)',
                            background: tab===id ? '#fff' : 'transparent',
                            boxShadow: tab===id ? '0 1px 6px rgba(0,0,0,0.09),0 0 0 1px rgba(79,70,229,0.11)' : 'none',
                            fontWeight: tab===id ? 600 : 500,
                        }}>
                            {icon}{label}
                        </button>
                    ))}
                </div>

                {/* Form card */}
                <div key={tab} style={{
                    background:'#fff', borderRadius:20,
                    border:'1px solid rgba(0,0,0,0.07)',
                    boxShadow:'0 2px 16px rgba(0,0,0,0.05)',
                    overflow:'hidden', animation:'fadeup .22s ease',
                }}>
                    {/* Form header */}
                    <div style={{
                        padding:'22px 28px 18px',
                        borderBottom:'1px solid rgba(0,0,0,0.05)',
                        display:'flex', alignItems:'center', gap:14,
                        background:'linear-gradient(135deg,rgba(79,70,229,0.03) 0%,transparent 100%)',
                    }}>
                        <div style={{
                            width:42, height:42, borderRadius:11,
                            background:'rgba(79,70,229,0.09)',
                            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                        }}>
                            {tab==='profile' ? <User size={19} color="#4f46e5" strokeWidth={1.75} /> : <KeyRound size={19} color="#4f46e5" strokeWidth={1.75} />}
                        </div>
                        <div>
                            <p style={{ fontSize:11, fontWeight:600, letterSpacing:'.09em', textTransform:'uppercase', color:'#4f46e5', marginBottom:3 }}>
                                {tab==='profile' ? 'Account' : 'Security'}
                            </p>
                            <h2 style={{ fontSize:17, fontWeight:700, color:'#0f0e17', lineHeight:1 }}>
                                {tab==='profile' ? 'Personal Information' : 'Change Password'}
                            </h2>
                        </div>
                    </div>

                    {/* Profile form */}
                    {tab === 'profile' && (
                        <form onSubmit={saveProfile} style={{ padding:'24px 28px 28px' }}>
                            <p style={{ fontSize:10.5, fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(0,0,0,0.28)', marginBottom:14 }}>Full name</p>
                            <div className="prof-grid" style={{ marginBottom:18 }}>
                                <Field label="First Name" value={pf.data.firstname} onChange={e=>pf.setData('firstname',e.target.value)} error={pf.errors.firstname} icon={User} required />
                                <Field label="Last Name"  value={pf.data.lastname}  onChange={e=>pf.setData('lastname',e.target.value)}  error={pf.errors.lastname}  icon={User} required />
                            </div>

                            <div style={{ height:1, background:'rgba(0,0,0,0.05)', margin:'4px 0 20px' }} />
                            <p style={{ fontSize:10.5, fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(0,0,0,0.28)', marginBottom:14 }}>Contact details</p>

                            <div style={{ marginBottom:18 }}>
                                <Field label="Email Address" type="email" value={pf.data.email} onChange={e=>pf.setData('email',e.target.value)} error={pf.errors.email} icon={Mail} required />
                            </div>
                            <div className="prof-grid" style={{ marginBottom:4 }}>
                                <Field label="Phone Number" value={pf.data.contact} onChange={e=>pf.setData('contact',e.target.value)} icon={Phone} />
                                <div style={{ position:'relative' }}>
                                    <select
                                        value={pf.data.gender}
                                        onChange={e=>pf.setData('gender',e.target.value)}
                                        style={{
                                            width:'100%', padding:'20px 14px 8px 40px',
                                            border:'1.5px solid #e8e8f0', borderRadius:12,
                                            fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif",
                                            color:'#0f0e17', background:'#fafafa',
                                            outline:'none', appearance:'none', cursor:'pointer',
                                            boxSizing:'border-box',
                                        }}
                                        onFocus={e=>{e.target.style.borderColor='#4f46e5';e.target.style.boxShadow='0 0 0 3px rgba(79,70,229,0.1)';e.target.style.background='#fff';}}
                                        onBlur={e=>{e.target.style.borderColor='#e8e8f0';e.target.style.boxShadow='none';e.target.style.background='#fafafa';}}
       >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer_not_to_say">Prefer not to say</option>
                                    </select>
                                    <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(0,0,0,0.25)', display:'flex', pointerEvents:'none' }}>
                                        <Venus size={15} strokeWidth={1.75} />
                                    </span>
                                    <span style={{ position:'absolute', left:12, top:-1, transform:'translateY(-50%) scale(0.74)', color:'#4f46e5', fontSize:14, fontWeight:600, pointerEvents:'none', background:'#fff', padding:'0 5px', transformOrigin:'left top', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                                        Gender
                                    </span>
                                </div>
                            </div>

                            <div style={{ height:1, background:'rgba(0,0,0,0.05)', margin:'22px 0 18px' }} />
                            <SubmitBtn processing={pf.processing} label="Save Changes" loadLabel="Saving…" Icon={Save} />
                        </form>
                    )}

                    {/* Password form */}
                    {tab === 'password' && (
                        <form onSubmit={savePassword} style={{ padding:'24px 28px 28px' }}>
                            <div style={{
                                background:'#f8f8ff', border:'1px solid #e0e0f8',
                                borderRadius:12, padding:'14px 18px', marginBottom:22,
                                fontSize:13, color:'rgba(0,0,0,0.5)', lineHeight:1.6,
                            }}>
                                <strong style={{ color:'#4f46e5' }}>Tips — </strong>
                                Use 8+ characters with a mix of uppercase, lowercase, numbers, and symbols.
                            </div>

                            <p style={{ fontSize:10.5, fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(0,0,0,0.28)', marginBottom:14 }}>Current password</p>
                            <div style={{ marginBottom:18 }}>
                                <Field label="Current Password" type="password" value={pwf.data.current_password} onChange={e=>pwf.setData('current_password',e.target.value)} error={pwf.errors.current_password} icon={Lock} required />
                            </div>

                            <div style={{ height:1, background:'rgba(0,0,0,0.05)', margin:'4px 0 20px' }} />
                            <p style={{ fontSize:10.5, fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(0,0,0,0.28)', marginBottom:14 }}>New password</p>
                            <div className="prof-grid" style={{ marginBottom:4 }}>
                                <Field label="New Password"     type="password" value={pwf.data.password}              onChange={e=>pwf.setData('password',e.target.value)}              error={pwf.errors.password}              icon={KeyRound} required />
                                <Field label="Confirm Password" type="password" value={pwf.data.password_confirmation} onChange={e=>pwf.setData('password_confirmation',e.target.value)} error={pwf.errors.password_confirmation} icon={KeyRound} required />
                            </div>

                            <div style={{ height:1, background:'rgba(0,0,0,0.05)', margin:'22px 0 18px' }} />
                            <SubmitBtn processing={pwf.processing} label="Change Password" loadLabel="Updating…" Icon={KeyRound} />
                        </form>
                    )}
                </div>
            </div>
        </AdminAuthLayout>
    );
}