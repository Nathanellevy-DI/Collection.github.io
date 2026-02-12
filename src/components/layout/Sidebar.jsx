import { useState } from 'react';
import { Package, Plus, Grid, Settings, TrendingUp, Sun, Moon } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import clsx from 'clsx';

const Sidebar = ({ onCloseMobile }) => {
    const { collections, activeCollectionId, setActiveCollectionId, addCollection, theme, toggleTheme, currentView, setCurrentView } = useAppContext();
    const [isAdding, setIsAdding] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');

    const handleCreateCollection = (e) => {
        e.preventDefault();
        if (newCollectionName.trim()) {
            addCollection(newCollectionName.trim());
            setNewCollectionName('');
            setIsAdding(false);
        }
    };

    return (
        <aside className="w-full h-full flex flex-col backdrop-blur-3xl bg-white/5 border-r border-white/10 shadow-2xl">
            {/* Brand */}
            <div className="p-6 hidden lg:block">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                    Lumina
                </h1>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Collection Tracker</p>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">

                {/* Categories */}
                <div>
                    <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Collections
                    </h3>
                    <div className="space-y-1">
                        {collections.map((col) => (
                            <button
                                key={col.id}
                                onClick={() => {
                                    setActiveCollectionId(col.id);
                                    setCurrentView('collection');
                                    onCloseMobile?.();
                                }}
                                className={clsx(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                                    (activeCollectionId === col.id && currentView === 'collection')
                                        ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-white shadow-lg shadow-emerald-500/5 border border-white/10"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                )}>
                                <Package size={18} className={clsx(
                                    "transition-colors",
                                    (activeCollectionId === col.id && currentView === 'collection') ? "text-emerald-400" : "text-gray-500 group-hover:text-gray-300"
                                )} />
                                {col.name}
                            </button>
                        ))}

                        {/* Add New Collection Input */}
                        {isAdding ? (
                            <form onSubmit={handleCreateCollection} className="mt-2 px-2">
                                <input
                                    autoFocus
                                    type="text"
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    onBlur={() => setIsAdding(false)}
                                    placeholder="Collection Name..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-gray-600"
                                />
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all text-sm font-medium border border-transparent hover:border-white/5 border-dashed"
                            >
                                <div className="w-[18px] flex justify-center">
                                    <Plus size={16} />
                                </div>
                                Add Collection
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Dashboard
                    </h3>
                    <div className="space-y-1">
                        <button
                            onClick={() => { setCurrentView('overview'); onCloseMobile?.(); }}
                            className={clsx(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                                currentView === 'overview'
                                    ? "bg-white/10 text-white shadow-lg border border-white/5"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Grid size={18} className={currentView === 'overview' ? "text-emerald-400" : ""} />
                            Overview
                        </button>
                        <button
                            onClick={() => { setCurrentView('analysis'); onCloseMobile?.(); }}
                            className={clsx(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                                currentView === 'analysis'
                                    ? "bg-white/10 text-white shadow-lg border border-white/5"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <TrendingUp size={18} className={currentView === 'analysis' ? "text-teal-400" : ""} />
                            Value Analysis
                        </button>
                    </div>
                </div>
            </div>

            {/* User / Settings Footer */}
            <div className={clsx(
                "p-4 border-t backdrop-blur-md",
                theme === 'dark' ? "border-white/10 bg-black/10" : "border-black/5 bg-white/50"
            )}>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={toggleTheme}
                        className={clsx(
                            "flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                            theme === 'dark'
                                ? "text-gray-400 hover:bg-white/5 hover:text-white"
                                : "text-gray-600 hover:bg-black/5 hover:text-black"
                        )}
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        <span className="hidden xl:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                    </button>
                    <button
                        onClick={() => setCurrentView('settings')}
                        className={clsx(
                            "flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                            theme === 'dark'
                                ? (currentView === 'settings' ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white")
                                : "text-gray-600 hover:bg-black/5 hover:text-black"
                        )}>
                        <Settings size={18} className={currentView === 'settings' ? "text-emerald-400" : ""} />
                        <span className="hidden xl:inline">Settings</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
