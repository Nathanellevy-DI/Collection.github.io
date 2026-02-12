import ItemCard from './ItemCard';
import { Plus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const CollectionGrid = ({ onEditItem, onAddItem }) => {
    const { items, searchQuery } = useAppContext();

    if (items.length === 0 && !searchQuery) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Plus className="text-gray-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Collection Empty</h3>
                <p className="text-gray-400 max-w-xs mb-6">Start building your collection by adding your first item.</p>
                <button
                    onClick={onAddItem}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                >
                    Add First Item
                </button>
            </div>
        );
    }

    if (items.length === 0 && searchQuery) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-400">No items found matching "{searchQuery}"</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {/* Add Button Card */}
            <button
                onClick={onAddItem}
                className="group aspect-[3/4] rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center hover:bg-white/10 transition-all hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 text-gray-500 hover:text-emerald-400"
            >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform group-hover:bg-emerald-500/10">
                    <Plus size={24} />
                </div>
                <span className="font-medium text-sm">Add Item</span>
            </button>

            {items.map((item) => (
                <ItemCard
                    key={item.id}
                    item={item}
                    onEdit={onEditItem}
                />
            ))}
        </div>
    );
};

export default CollectionGrid;
