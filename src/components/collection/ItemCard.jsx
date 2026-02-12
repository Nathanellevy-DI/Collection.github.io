import { Check, Edit2, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useAppContext } from '../../context/AppContext';

const ItemCard = ({ item, onEdit }) => {
    const { toggleOwned, deleteItem } = useAppContext();

    return (
        <div className="group relative aspect-[3/4] rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
            {/* Image / Thumbnail */}
            {item.image ? (
                <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
                    <span className="text-gray-600 font-mono text-xs uppercase tracking-widest">No Image</span>
                </div>
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

            {/* Status Badge */}
            <div className="absolute top-3 right-3 flex gap-2">
                {item.owned && (
                    <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Check size={10} strokeWidth={3} />
                        OWNED
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-4">
                {/* Actions (visible on hover) */}
                <div className="flex justify-end gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleOwned(item.id); }}
                        className={clsx(
                            "p-2 rounded-full backdrop-blur-md border transition-colors",
                            item.owned
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                                : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                        )}
                        title={item.owned ? "Mark as not owned" : "Mark as owned"}
                    >
                        <Check size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                        className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); if (confirm('Delete item?')) deleteItem(item.id); }}
                        className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <h3 className="text-white font-medium text-lg leading-tight truncate text-shadow-sm">{item.name}</h3>
                <p className="text-sm text-gray-400 font-mono mt-0.5 opacity-80">{item.value ? `$${Number(item.value).toLocaleString()}` : '-'}</p>
            </div>
        </div>
    );
};

export default ItemCard;
