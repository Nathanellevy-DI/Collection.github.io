import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import clsx from 'clsx';

import { useAppContext } from '../../context/AppContext';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { theme } = useAppContext();

    return (
        <div
            className={clsx(
                "h-[100dvh] flex flex-col overflow-hidden font-sans selection:bg-emerald-500/30 transition-colors duration-500",
                theme === 'dark'
                    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
                    : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900"
            )}
        >
            {/* Mobile Header */}
            <div className={clsx(
                "lg:hidden flex-none flex items-center justify-between p-4 z-50 border-b backdrop-blur-md",
                theme === 'dark' ? "bg-black/20 border-white/10" : "bg-white/50 border-black/5"
            )}>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                    Lumina
                </h1>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={clsx(
                        "p-2 rounded-lg transition-colors",
                        theme === 'dark' ? "hover:bg-white/10" : "hover:bg-black/5 text-gray-700"
                    )}
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Sidebar - Mobile Overlay */}
                <div
                    className={clsx(
                        "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300",
                        isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                    onClick={() => setIsSidebarOpen(false)}
                />

                {/* Sidebar - Component */}
                <div className={clsx(
                    "absolute inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto lg:flex h-full",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <Sidebar onCloseMobile={() => setIsSidebarOpen(false)} />
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto w-full relative">
                    <div className="max-w-7xl mx-auto p-4 lg:p-8 pb-24">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
