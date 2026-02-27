import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { X, Upload, User, Mail, Phone, Lock, Users } from 'lucide-react';

const Field = ({ label, required, error, icon: Icon, children }) => (
    <div>
        {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label} {required && <span className="text-red-500">*</span>}</label>}
        <div className="relative">
            {Icon && <Icon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />}
            {children}
        </div>
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
);

const inputCls = "w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none";

export default function UserCreateModal({ isOpen, onClose }) {
    const [preview, setPreview] = useState(null);
    const form = useForm({ user_image: null, firstname: '', lastname: '', email: '', password: '', password_confirmation: '', contact: '', gender: '', role: 'student' });

    if (!isOpen) return null;

    const handleClose = () => { if (!form.processing) { onClose(); form.reset(); setPreview(null); } };
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        form.setData('user_image', file);
        const r = new FileReader();
        r.onloadend = () => setPreview(r.result);
        r.readAsDataURL(file);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        form.post('/admin/users', {
            onSuccess: () => { toast.success('User created!'); handleClose(); },
            onError: () => toast.error('Failed to create user. Check the form.'),
        });
    };

    const set = (key) => (e) => form.setData(key, e.target.value);

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={handleClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-top-4 duration-300" onClick={e => e.stopPropagation()}>

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Create New User</h2>
                                <p className="text-blue-100 text-sm">Add a new user to the system</p>
                            </div>
                        </div>
                        <button onClick={handleClose} disabled={form.processing} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50">
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="overflow-y-auto flex-1">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">

                            {/* Avatar */}
                            <div className="flex flex-col items-center gap-2 pb-6 border-b">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-lg overflow-hidden">
                                        {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover" /> : <User className="w-12 h-12" />}
                                    </div>
                                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-indigo-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-50 shadow-md">
                                        <Upload className="w-4 h-4 text-indigo-600" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImage} />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">Click to upload profile photo</p>
                                {form.errors.user_image && <p className="text-red-600 text-sm">{form.errors.user_image}</p>}
                            </div>

                            {/* Name */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="First Name" required error={form.errors.firstname} icon={User}>
                                    <input type="text" value={form.data.firstname} onChange={set('firstname')} className={inputCls} placeholder="John" required />
                                </Field>
                                <Field label="Last Name" required error={form.errors.lastname} icon={User}>
                                    <input type="text" value={form.data.lastname} onChange={set('lastname')} className={inputCls} placeholder="Doe" required />
                                </Field>
                            </div>

                            {/* Email */}
                            <Field label="Email Address" required error={form.errors.email} icon={Mail}>
                                <input type="email" value={form.data.email} onChange={set('email')} className={inputCls} placeholder="john.doe@example.com" required />
                            </Field>

                            {/* Password */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Password" required error={form.errors.password} icon={Lock}>
                                    <input type="password" value={form.data.password} onChange={set('password')} className={inputCls} placeholder="••••••••" required />
                                </Field>
                                <Field label="Confirm Password" required icon={Lock}>
                                    <input type="password" value={form.data.password_confirmation} onChange={set('password_confirmation')} className={inputCls} placeholder="••••••••" required />
                                </Field>
                            </div>

                            {/* Contact */}
                            <Field label="Contact Number" error={form.errors.contact} icon={Phone}>
                                <input type="text" value={form.data.contact} onChange={set('contact')} className={inputCls} placeholder="+1234567890" />
                            </Field>

                            {/* Gender & Role */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                    <div className="flex gap-2">
                                        {['male', 'female', 'other'].map(g => (
                                            <label key={g} className={`flex-1 px-3 py-2.5 border-2 rounded-lg cursor-pointer text-center text-sm font-medium transition-all capitalize
                                                ${form.data.gender === g ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 hover:border-indigo-300 text-gray-700'}`}>
                                                <input type="radio" name="gender" value={g} checked={form.data.gender === g} onChange={set('gender')} className="hidden" />
                                                {g}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <Field label="Role" required error={form.errors.role}>
                                    <select value={form.data.role} onChange={set('role')} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required>
                                        {['student', 'teacher', 'admin'].map(r => <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                                    </select>
                                </Field>
                            </div>

                            {/* Note */}
                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                                <p className="text-sm text-indigo-800"><span className="font-semibold">Note:</span> Member ID will be automatically generated based on the selected role.</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t">
                                <button type="button" onClick={handleClose} disabled={form.processing} className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all disabled:opacity-50">Cancel</button>
                                <button type="submit" disabled={form.processing} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 shadow-md">
                                    {form.processing ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}