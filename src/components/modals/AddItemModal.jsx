import { useState, useRef, useEffect } from 'react';
import { X, Upload, Scan, Loader2, Calendar } from 'lucide-react';
import { processImage } from '../../utils/imageProcessor';
import { useAppContext } from '../../context/AppContext';
import clsx from 'clsx';

const AddItemModal = ({ isOpen, onClose, collectionName, itemToEdit }) => {
    const { addItem, updateItem } = useAppContext();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        value: '',
        image: null,
        dateOfPurchase: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Pre-fill form if editing
    useEffect(() => {
        if (isOpen && itemToEdit) {
            setFormData({
                name: itemToEdit.name,
                value: itemToEdit.value || '',
                image: itemToEdit.image || null,
                dateOfPurchase: itemToEdit.dateOfPurchase || ''
            });
        } else if (isOpen && !itemToEdit) {
            // Reset if adding new
            setFormData({
                name: '',
                value: '',
                image: null,
                dateOfPurchase: new Date().toISOString().split('T')[0] // Default to today
            });
        }
    }, [isOpen, itemToEdit]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (itemToEdit) {
            updateItem(itemToEdit.id, {
                name: formData.name,
                value: formData.value,
                image: formData.image,
                dateOfPurchase: formData.dateOfPurchase
            });
        } else {
            addItem({
                name: formData.name,
                value: formData.value,
                image: formData.image,
                dateOfPurchase: formData.dateOfPurchase,
                owned: true
            });
        }

        onClose();
    };

    const handleImageUpload = async (file) => {
        if (!file) return;

        setIsProcessing(true);
        try {
            // Process image (resize + compress)
            const processedImage = await processImage(file);
            setFormData(prev => ({ ...prev, image: processedImage }));
        } catch (error) {
            console.error("Image processing failed", error);
            alert("Failed to process image");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <h2 className="text-lg font-semibold text-white">
                        {itemToEdit ? 'Edit Item' : `Add to ${collectionName}`}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Image Upload Area */}
                    <div
                        className={clsx(
                            "relative aspect-video rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group",
                            dragActive ? "border-emerald-500 bg-emerald-500/10" : "border-white/20 hover:border-white/40 hover:bg-white/5",
                            formData.image ? "border-transparent" : ""
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {formData.image ? (
                            <>
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full h-full object-contain bg-black/20"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-white font-medium">Change Image</span>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
                                {isProcessing ? (
                                    <Loader2 className="animate-spin text-emerald-400" size={32} />
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-1">
                                            <Upload size={24} />
                                        </div>
                                        <span className="text-sm font-medium">Click or Drag Image</span>
                                        <span className="text-xs text-gray-500">Auto-compressed & resized</span>
                                    </>
                                )}
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files[0])}
                        />
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                placeholder="e.g. Sweet Summer 1-404"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Value</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.value}
                                        onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-7 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Date of Purchase</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={formData.dateOfPurchase}
                                        onChange={(e) => setFormData(prev => ({ ...prev, dateOfPurchase: e.target.value }))}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simulated Scan Button (Mock) */}
                    {!itemToEdit && (
                        <button
                            type="button"
                            className="w-full py-2 flex items-center justify-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors border border-emerald-500/20 border-dashed"
                            onClick={() => alert("Scan functionality is mocked. In a real app, this would open the camera.")}
                        >
                            <Scan size={16} />
                            Scan Barcode (AI Mock)
                        </button>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Processing...' : (itemToEdit ? 'Save Changes' : 'Add Item')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;
