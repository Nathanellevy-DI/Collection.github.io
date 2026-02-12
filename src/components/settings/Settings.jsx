import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Trash2, Info, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

const Settings = () => {
    const { items, collections, theme } = useAppContext();
    const [confirmReset, setConfirmReset] = useState(false);

    const handleResetData = () => {
        if (confirmReset) {
            localStorage.removeItem('lumina_collections');
            localStorage.removeItem('lumina_items');
            window.location.reload();
        } else {
            setConfirmReset(true);
            setTimeout(() => setConfirmReset(false), 3000);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Settings</h2>
                <p className="text-gray-400">Manage your application data and preferences.</p>
            </div>

            {/* Data Management Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <RefreshCw size={20} className="text-emerald-400" />
                        Data Management
                    </h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h4 className="text-white font-medium mb-1">Clear All Data</h4>
                            <p className="text-sm text-gray-400 max-w-md">
                                Permanently delete all collections and items. This action cannot be undone.
                                This will reset the application to its initial state.
                            </p>
                            <div className="mt-2 text-xs text-gray-500 flex gap-4">
                                <span>Collections: {collections.length}</span>
                                <span>Items: {items.length}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleResetData}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 border",
                                confirmReset
                                    ? "bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20"
                                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            {confirmReset ? (
                                <>
                                    <AlertTriangle size={16} />
                                    Confirm Reset
                                </>
                            ) : (
                                <>
                                    <Trash2 size={16} />
                                    Reset Data
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Info size={20} className="text-teal-400" />
                        About Lumina
                    </h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                            <span className="text-2xl font-bold text-white">L</span>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-white">Lumina Collection Tracker</h4>
                            <p className="text-gray-400 text-sm mt-1">Version 1.0.0</p>
                            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                                A modern, aesthetic way to track and analyze your physical collections.
                                Built with React, Tailwind CSS, and local-first architecture.
                                Data is stored securely in your browser's local storage.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                            <h5 className="text-sm font-medium text-emerald-400 mb-1">Local Storage</h5>
                            <p className="text-xs text-gray-500">Your data never leaves your device.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                            <h5 className="text-sm font-medium text-teal-400 mb-1">Image Compression</h5>
                            <p className="text-xs text-gray-500">Smart compression to maximize storage space.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
