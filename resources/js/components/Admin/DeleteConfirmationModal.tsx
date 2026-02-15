import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, userName, isDeleting }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div 
                    className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Confirm Delete</h2>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                        </div>

                        <div className="text-center space-y-2">
                            <p className="text-gray-700 font-medium">
                                Are you sure you want to delete this user?
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                                {userName}
                            </p>
                            <p className="text-sm text-gray-500">
                                This action cannot be undone. All user data will be permanently deleted.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isDeleting}
                                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={onConfirm}
                                disabled={isDeleting}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 shadow-md"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
