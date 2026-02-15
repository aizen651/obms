import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { X, Upload, User, Mail, Phone, Users, Trash2 } from 'lucide-react';

export default function UserEditModal({ isOpen, onClose, user }) {
    const [previewImage, setPreviewImage] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);

    const form = useForm({
        user_image: null,
        remove_image: false,
        firstname: '',
        lastname: '',
        email: '',
        contact: '',
        gender: '',
        role: 'student',
    });

    useEffect(() => {
        if (user) {
            form.setData({
                user_image: null,
                remove_image: false,
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                email: user.email || '',
                contact: user.contact || '',
                gender: user.gender || '',
                role: user.role || 'student',
            });
            setPreviewImage(null);
            setRemoveImage(false);
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            form.setData('user_image', file);
            setRemoveImage(false);
            form.setData('remove_image', false);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setRemoveImage(true);
        setPreviewImage(null);
        form.setData('user_image', null);
        form.setData('remove_image', true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user?.id) return;
        
        // Create FormData manually to include the _method field
        const formData = new FormData();
        formData.append('_method', 'PUT');
        
        // Append all form fields
        if (form.data.user_image) {
            formData.append('user_image', form.data.user_image);
        }
        formData.append('remove_image', form.data.remove_image ? '1' : '0');
        formData.append('firstname', form.data.firstname);
        formData.append('lastname', form.data.lastname);
        formData.append('email', form.data.email);
        formData.append('contact', form.data.contact);
        formData.append('gender', form.data.gender);
        formData.append('role', form.data.role);
        
        // Use router.post with FormData
        router.post(`/admin/users/${user.id}`, formData, {
            onSuccess: () => {
                toast.success('User updated successfully!');
                onClose();
                setPreviewImage(null);
                setRemoveImage(false);
            },
            onError: (errors) => {
                toast.error('Failed to update user. Check the form.');
                console.log('Errors:', errors);
            },
            onFinish: () => {
                form.processing = false;
            }
        });
    };

    const handleClose = () => {
        if (!form.processing) {
            onClose();
            setPreviewImage(null);
            setRemoveImage(false);
        }
    };

    if (!isOpen || !user) return null;

    const getCurrentImage = () => {
        if (removeImage) return null;
        if (previewImage) return previewImage;
        if (user.user_image) return `/storage/${user.user_image}`;
        return null;
    };

    const currentImage = getCurrentImage();

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
                onClick={handleClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div 
                    className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-top-4 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header - Fixed at top */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Edit User</h2>
                                <p className="text-amber-50 text-sm">Update user information</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={form.processing}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Form - Scrollable content */}
                    <div className="overflow-y-auto flex-1">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Profile Image */}
                        <div className="flex flex-col items-center gap-4 pb-6 border-b">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg overflow-hidden">
                                    {currentImage ? (
                                        <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-amber-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-amber-50 transition-colors shadow-md">
                                    <Upload className="w-4 h-4 text-amber-600" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-xs text-gray-500">Click to upload new photo</p>
                                {(user.user_image && !removeImage) && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Remove current image
                                    </button>
                                )}
                                {removeImage && (
                                    <p className="text-xs text-red-600 font-medium">Image will be removed on save</p>
                                )}
                            </div>
                            {form.errors.user_image && (
                                <p className="text-red-600 text-sm">{form.errors.user_image}</p>
                            )}
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={form.data.firstname}
                                        onChange={(e) => form.setData('firstname', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                                {form.errors.firstname && (
                                    <p className="text-red-600 text-sm mt-1">{form.errors.firstname}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={form.data.lastname}
                                        onChange={(e) => form.setData('lastname', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                                {form.errors.lastname && (
                                    <p className="text-red-600 text-sm mt-1">{form.errors.lastname}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                    placeholder="john.doe@example.com"
                                    required
                                />
                            </div>
                            {form.errors.email && (
                                <p className="text-red-600 text-sm mt-1">{form.errors.email}</p>
                            )}
                        </div>

                        {/* Contact */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Number
                            </label>
                            <div className="relative">
                                <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={form.data.contact}
                                    onChange={(e) => form.setData('contact', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                    placeholder="+1234567890"
                                />
                            </div>
                            {form.errors.contact && (
                                <p className="text-red-600 text-sm mt-1">{form.errors.contact}</p>
                            )}
                        </div>

                        {/* Gender & Role */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gender
                                </label>
                                <div className="flex gap-2">
                                    {['male', 'female', 'other'].map((gender) => (
                                        <label
                                            key={gender}
                                            className={`flex-1 px-4 py-2.5 border-2 rounded-lg cursor-pointer text-center font-medium transition-all text-sm
                                                ${form.data.gender === gender
                                                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                                                    : 'border-gray-300 hover:border-amber-300 text-gray-700'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={gender}
                                                checked={form.data.gender === gender}
                                                onChange={(e) => form.setData('gender', e.target.value)}
                                                className="hidden"
                                            />
                                            <span className="capitalize">{gender}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={form.data.role}
                                    onChange={(e) => form.setData('role', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                    required
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {form.errors.role && (
                                    <p className="text-red-600 text-sm mt-1">{form.errors.role}</p>
                                )}
                            </div>
                        </div>

                        {/* Info Message */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <p className="text-sm text-amber-800">
                                <span className="font-semibold">Note:</span> Password is not required for updates. Leave password fields empty to keep the current password.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={form.processing}
                                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 shadow-md"
                            >
                                {form.processing ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
