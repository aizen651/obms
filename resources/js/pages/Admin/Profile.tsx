import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import { User, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('profile');
    const [previewImage, setPreviewImage] = useState(
        auth.user.user_image ? `/storage/${auth.user.user_image}` : null
    );

    const profileForm = useForm({
        user_image: null,
        firstname: auth.user.firstname || '',
        lastname: auth.user.lastname || '',
        email: auth.user.email || '',
        contact: auth.user.contact || '',
        gender: auth.user.gender || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            profileForm.setData('user_image', file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.post('/admin/profile/update', {
            preserveScroll: true,
            onSuccess: () => toast.success('Profile updated successfully!'),
            onError: () => toast.error('Failed to update profile. Please check your inputs.'),
        });
    };

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.put('/admin/profile/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                toast.success('Password changed successfully!');
            },
            onError: () =>
                toast.error('Failed to change password. Please check your current password.'),
        });
    };

    const tabs = [
        {
            id: 'profile',
            name: 'Update Profile',
            icon: <User className="w-5 h-5" />,
        },
        {
            id: 'password',
            name: 'Change Password',
            icon: <Lock className="w-5 h-5" />,
        },
    ];

    return (
        <AdminAuthLayout header="Profile Settings">
            <Head title="Profile" />

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                    {/* Tab Navigation */}
                    <div className="border-b border-amber-100">
                        <div className="flex">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex-1 px-6 py-4 font-medium transition-all
                                        flex items-center justify-center gap-2
                                        ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                                            : 'text-gray-600 hover:bg-amber-50'
                                        }
                                    `}
                                >
                                    <span className="flex items-center">
                                        {tab.icon}
                                    </span>
                                    <span>{tab.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* PROFILE FORM */}
                    {activeTab === 'profile' && (
                        <form onSubmit={submitProfile} className="p-8 space-y-6">

                            {/* Profile Image */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center border-4 border-amber-200 shadow-lg">
                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-4xl font-bold text-white">
                                                {auth.user.firstname?.charAt(0)}
                                                {auth.user.lastname?.charAt(0)}
                                            </span>
                                        )}
                                    </div>

                                    <label className="absolute bottom-0 right-0 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white p-3 rounded-full cursor-pointer shadow-lg transition-all">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>

                                <div className="text-center">
                                    <p className="font-semibold text-gray-800">
                                        {auth.user.firstname} {auth.user.lastname}
                                    </p>
                                    <p className="text-sm text-amber-600">
                                        {auth.user.role}
                                    </p>
                                </div>
                            </div>

                            {/* Name Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profileForm.data.firstname}
                                        onChange={(e) =>
                                            profileForm.setData('firstname', e.target.value)
                                        }
                                        className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                                        required
                                    />
                                    {profileForm.errors.firstname && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {profileForm.errors.firstname}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profileForm.data.lastname}
                                        onChange={(e) =>
                                            profileForm.setData('lastname', e.target.value)
                                        }
                                        className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                                        required
                                    />
                                    {profileForm.errors.lastname && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {profileForm.errors.lastname}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={profileForm.data.email}
                                    onChange={(e) =>
                                        profileForm.setData('email', e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            {/* Contact */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.data.contact}
                                    onChange={(e) =>
                                        profileForm.setData('contact', e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                                    placeholder="+1234567890"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                            >
                                {profileForm.processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    )}

                    {/* PASSWORD FORM */}
                    {activeTab === 'password' && (
                        <form onSubmit={submitPassword} className="p-8 space-y-6">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) =>
                                        passwordForm.setData(
                                            'current_password',
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={(e) =>
                                        passwordForm.setData('password', e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) =>
                                        passwordForm.setData(
                                            'password_confirmation',
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                            >
                                {passwordForm.processing
                                    ? 'Updating...'
                                    : 'Change Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </AdminAuthLayout>
    );
}