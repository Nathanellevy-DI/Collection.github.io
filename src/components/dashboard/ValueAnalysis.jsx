import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { DollarSign, Filter } from 'lucide-react';

const ValueAnalysis = () => {
    const { allItems, collections } = useAppContext();
    const [filterCollectionId, setFilterCollectionId] = useState('all');

    // Filter items based on selection
    const displayItems = filterCollectionId === 'all'
        ? allItems
        : allItems.filter(item => item.collectionId === filterCollectionId);

    // Group items by collection for the bar chart/progress
    // If 'all' is selected, we group by collection.
    // If a specific collection is selected, we could group by item (top items) or just show the single bar? 
    // Let's stick to showing the breakdown of the current view.

    // 1. Calculate value per collection (or single collection if filtered)
    const collectionValues = collections
        .filter(c => filterCollectionId === 'all' || c.id === filterCollectionId)
        .map(col => {
            const colItems = allItems.filter(i => i.collectionId === col.id && i.owned);
            const value = colItems.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
            return {
                id: col.id,
                name: col.name,
                value
            };
        })
        .sort((a, b) => b.value - a.value);

    // 2. Total Value
    const totalValue = displayItems
        .filter(item => item.owned)
        .reduce((acc, item) => acc + (Number(item.value) || 0), 0);

    // 3. Top Valuable Items (Owned only)
    const topItems = [...displayItems]
        .filter(item => Number(item.value) > 0 && item.owned)
        .sort((a, b) => Number(b.value) - Number(a.value))
        .slice(0, 5);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Value Analysis</h2>
                    <p className="text-gray-400">Deep dive into the financial value of your collection.</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Value Distribution */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Value by Collection</h3>
                    <div className="space-y-4">
                        {collectionValues.map(col => {
                            // Percentage relative to the TOTAL of displayed items
                            const percentage = totalValue > 0 ? (col.value / totalValue) * 100 : 0;
                            return (
                                <div key={col.id}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-white font-medium">{col.name}</span>
                                        <span className="text-gray-400">${col.value.toLocaleString()} ({Math.round(percentage)}%)</span>
                                    </div>
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {collectionValues.length === 0 && <p className="text-gray-500">No data available.</p>}
                    </div>
                </div>

                {/* Summary Box */}
                <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/20 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 ring-1 ring-emerald-500/50">
                        <DollarSign className="text-emerald-400" size={32} />
                    </div>
                    <h3 className="text-gray-300 font-medium uppercase tracking-widest text-xs mb-2">Total Estimated Asset Value</h3>
                    <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        ${totalValue.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Top Valuable Items */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Most Valuable Items</h3>
                <div className="space-y-3">
                    {topItems.map((item, i) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 font-bold text-xs ring-1 ring-yellow-500/50">
                                    #{i + 1}
                                </div>
                                <div className="truncate max-w-[150px] sm:max-w-xs">
                                    <div className="text-white font-medium truncate">{item.name}</div>
                                    <div className="text-xs text-gray-500">
                                        {collections.find(c => c.id === item.collectionId)?.name}
                                    </div>
                                </div>
                            </div>
                            <div className="text-emerald-400 font-mono font-bold">
                                ${Number(item.value).toLocaleString()}
                            </div>
                        </div>
                    ))}
                    {topItems.length === 0 && <p className="text-gray-500">No items with value found.</p>}
                </div>
            </div>
        </div>
    );
};

export default ValueAnalysis;
