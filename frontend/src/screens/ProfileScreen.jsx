import React from 'react';
import { User, LogOut, AlertTriangle } from 'lucide-react';

const ProfileScreen = ({ username, onLogout }) => {
    return (
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-500 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 text-center flex items-center justify-center gap-3"><User size={28} /> User Profile</h2>
            <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-500 mb-1">Username</p>
                <p className="text-xl font-semibold text-gray-800">{username || 'Guest'}</p>
            </div>
            
            <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-lg"
            >
                <LogOut size={20} /> Logout
            </button>
            
            <button
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors pt-2"
            >
                <AlertTriangle size={16} /> Delete Account (Dummy Function)
            </button>
        </div>
    );
};

export default ProfileScreen;