import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Package, TrendingUp, DollarSign, Calendar, Filter } from 'lucide-react';
import clsx from 'clsx';

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start justify-between hover:bg-white/10 transition-colors">
        <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
            {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
        </div>
        <div className={clsx("p-3 rounded-xl bg-white/5", colorClass)}>
            <Icon size={24} />
        </div>
    </div>
);

const Overview = () => {
    const { allItems, collections } = useAppContext();
    const [filterCollectionId, setFilterCollectionId] = useState('all');

    // Filter items based on selection
    const displayItems = filterCollectionId === 'all'
        ? allItems
        : allItems.filter(item => item.collectionId === filterCollectionId);

    // Calculate Stats
    const totalItems = displayItems.length;
    const totalValue = displayItems
        .filter(item => item.owned)
        .reduce((acc, item) => acc + (Number(item.value) || 0), 0);
    const ownedItems = displayItems.filter(i => i.owned).length;
    const collectionCount = filterCollectionId === 'all' ? collections.length : 1;

    // Buying Frequency (Items purchased this month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const itemsThisMonth = displayItems.filter(item => {
        const date = new Date(item.dateOfPurchase || item.dateAdded);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear && item.owned;
    }).length;

    // Most recent items (sorted by purchase date or date added)
    const recentItems = [...displayItems]
        .filter(item => item.owned)
        .sort((a, b) => new Date(b.dateOfPurchase || b.dateAdded) - new Date(a.dateOfPurchase || a.dateAdded))
        .slice(0, 5);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Dashboard Overview</h2>
                    <p className="text-gray-400">At a glance statistics for your entire collection.</p>
                </div>

                {/* Collection Filter */}
                <div className="relative">
                    <select
                        value={filterCollectionId}
                        onChange={(e) => setFilterCollectionId(e.target.value)}
                        className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all cursor-pointer hover:bg-white/10"
                    >
                        <option value="all" className="bg-[#1a1a1a]">All Collections</option>
                        {collections.map(col => (
                            <option key={col.id} value={col.id} className="bg-[#1a1a1a]">{col.name}</option>
                        ))}
                    </select>
                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Value"
                    value={`$${totalValue.toLocaleString()}`}
                    subtitle="Estimated market value"
                    icon={DollarSign}
                    colorClass="text-emerald-400"
                />
                <StatCard
                    title="Total Items"
                    value={totalItems}
                    subtitle={filterCollectionId === 'all' ? `Across ${collectionCount} collections` : 'In this collection'}
                    icon={Package}
                    colorClass="text-teal-400"
                />
                <StatCard
                    title="Collection Progress"
                    value={`${totalItems > 0 ? Math.round((ownedItems / totalItems) * 100) : 0}%`}
                    subtitle={`${ownedItems} / ${totalItems} items owned`}
                    icon={TrendingUp}
                    colorClass="text-cyan-400"
                />
                <StatCard
                    title="Monthly Purchases"
                    value={itemsThisMonth}
                    subtitle="Items bought this month"
                    icon={Calendar}
                    colorClass="text-emerald-200"
                />
            </div>

            {/* Recent Items List */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white">Recent Purchases</h3>
                </div>
                <div>
                    {recentItems.length > 0 ? (
                        recentItems.map((item, index) => {
                            const collectionName = collections.find(c => c.id === item.collectionId)?.name;
                            const date = new Date(item.dateOfPurchase || item.dateAdded).toLocaleDateString();
                            return (
                                <div key={item.id} className={clsx(
                                    "flex items-center gap-4 p-4 hover:bg-white/5 transition-colors",
                                    index !== recentItems.length - 1 && "border-b border-white/5"
                                )}>
                                    <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden flex-shrink-0">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                <Package size={16} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-medium truncate">{item.name}</h4>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>{collectionName}</span>
                                            <span>•</span>
                                            <span>{date}</span>
                                        </div>
                                    </div>
                                    <div className="text-white font-mono font-medium">
                                        {item.value ? `$${Number(item.value).toLocaleString()}` : '-'}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-8 text-center text-gray-500">No items added yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Overview;
