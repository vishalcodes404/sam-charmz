import React, { useState, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';

const EMPTY_FORM = { name: '', price: '', category: '', description: '', images: [], stock: '' };
const MAX_IMAGES = 3;

function ProductModal({ isOpen, onClose, onSave, initial, categoryNames }) {
    const [form, setForm] = useState(initial || EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);
    const [uploadingSlot, setUploadingSlot] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    React.useEffect(() => {
        // Backward compat: migrate old `image` string → `images` array
        const init = initial || EMPTY_FORM;
        const images = init.images && Array.isArray(init.images)
            ? [...init.images]
            : init.image ? [init.image] : [];
        setForm({ ...init, images });
        setErrors({});
    }, [initial, isOpen]);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0) e.price = 'Enter a valid price';
        if (!form.category) e.category = 'Select a category';
        if (!form.images || form.images.length === 0) e.images = 'At least 1 image is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            onSave(form);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({ ...prev, images: 'Please select an image file' }));
            return;
        }

        // Validate file size (max 5MB per image)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, images: 'Image must be under 5MB' }));
            return;
        }

        setUploadingImage(true);

        try {
            // Try uploading to Supabase Storage
            const { supabase } = await import('../../lib/supabaseClient');
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file, { cacheControl: '3600', upsert: false });

            let imageUrl;
            if (uploadError) {
                console.warn('Supabase upload failed, using base64 fallback:', uploadError.message);
                // Fallback to base64
                imageUrl = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (ev) => resolve(ev.target.result);
                    reader.readAsDataURL(file);
                });
            } else {
                const { data: urlData } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);
                imageUrl = urlData.publicUrl;
            }

            setForm(prev => {
                const newImages = [...prev.images];
                if (uploadingSlot !== null && uploadingSlot < newImages.length) {
                    newImages[uploadingSlot] = imageUrl;
                } else {
                    newImages.push(imageUrl);
                }
                return { ...prev, images: newImages.slice(0, MAX_IMAGES) };
            });
            setErrors(prev => { const { images, ...rest } = prev; return rest; });
        } catch (err) {
            console.error('Image upload error:', err);
            setErrors(prev => ({ ...prev, images: 'Failed to upload image. Try again.' }));
        } finally {
            setUploadingSlot(null);
            setUploadingImage(false);
        }

        // Reset input so same file can be re-selected
        e.target.value = '';
    };

    const triggerUpload = (slotIndex) => {
        setUploadingSlot(slotIndex);
        fileInputRef.current?.click();
    };

    const removeImage = (index) => {
        setForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-brand-surface border border-white/15 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-brand-light">{initial?.id ? 'Edit Product' : 'Add Product'}</h3>
                    <button onClick={onClose} className="text-brand-gray hover:text-brand-light transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {[
                        { key: 'name', label: 'Product Name', placeholder: 'e.g. Gold Bangle' },
                        { key: 'price', label: 'Price (₹)', placeholder: 'e.g. 799' },
                    ].map(({ key, label, placeholder }) => (
                        <div key={key}>
                            <label className="block text-sm text-brand-gray mb-1">{label}</label>
                            <input
                                type="text"
                                value={form[key]}
                                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                                placeholder={placeholder}
                                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-brand-light placeholder-brand-gray/40 focus:outline-none focus:border-brand-primary/50 transition-all text-sm"
                            />
                            {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
                        </div>
                    ))}
                    <div>
                        <label className="block text-sm text-brand-gray mb-1">Category</label>
                        <select
                            value={form.category}
                            onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                            className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-brand-light focus:outline-none focus:border-brand-primary/50 transition-all text-sm"
                        >
                            <option value="">-- Select Category --</option>
                            {categoryNames.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
                    </div>
                    <div>
                        <label className="block text-sm text-brand-gray mb-1">Description</label>
                        <textarea
                            value={form.description || ''}
                            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                            placeholder="Describe this product..."
                            rows={3}
                            className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-brand-light placeholder-brand-gray/40 focus:outline-none focus:border-brand-primary/50 transition-all text-sm resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-brand-gray mb-1">Stock Quantity</label>
                        <input
                            type="number"
                            min="0"
                            value={form.stock}
                            onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
                            placeholder="e.g. 25"
                            className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-brand-light placeholder-brand-gray/40 focus:outline-none focus:border-brand-primary/50 transition-all text-sm"
                        />
                    </div>

                    {/* ===== Product Images Uploader ===== */}
                    <div>
                        <label className="block text-sm text-brand-gray mb-2">
                            Product Images
                            <span className="text-brand-gray/50 ml-1">({form.images.length}/{MAX_IMAGES})</span>
                        </label>
                        <div className="flex gap-3">
                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {/* Render 3 slots */}
                            {Array.from({ length: MAX_IMAGES }).map((_, i) => {
                                const img = form.images[i];
                                return (
                                    <div
                                        key={i}
                                        className="relative w-24 h-24 rounded-xl overflow-hidden border transition-all flex-shrink-0"
                                        style={{
                                            borderColor: img ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
                                            borderStyle: img ? 'solid' : 'dashed',
                                        }}
                                    >
                                        {img ? (
                                            <>
                                                <img
                                                    src={img}
                                                    alt={`Product ${i + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={e => e.target.style.display = 'none'}
                                                />
                                                {/* Remove button */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(i)}
                                                    className="absolute top-1 right-1 w-5 h-5 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                                                    title="Remove image"
                                                >
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                {/* Replace button */}
                                                <button
                                                    type="button"
                                                    onClick={() => triggerUpload(i)}
                                                    className="absolute bottom-1 right-1 w-5 h-5 bg-brand-primary/80 hover:bg-brand-primary rounded-full flex items-center justify-center transition-colors"
                                                    title="Replace image"
                                                >
                                                    <svg className="w-3 h-3 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => triggerUpload(i)}
                                                disabled={i > form.images.length}
                                                className="w-full h-full flex flex-col items-center justify-center text-brand-gray/40 hover:text-brand-primary/60 hover:border-brand-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-6 h-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                                </svg>
                                                <span className="text-[10px]">Upload</span>
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {errors.images && <p className="text-red-400 text-xs mt-1.5">{errors.images}</p>}
                        <p className="text-brand-gray/40 text-[11px] mt-1.5">Upload 1–3 product photos • Max 5MB each • JPG, PNG, WebP</p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-brand-gray hover:text-brand-light hover:border-white/20 text-sm transition-all">Cancel</button>
                        <button type="submit" className="flex-1 py-2.5 rounded-xl bg-brand-primary text-brand-dark font-bold text-sm hover:opacity-90 transition-all">
                            {initial?.id ? 'Save Changes' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ConfirmDialog({ isOpen, message, onConfirm, onCancel }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-brand-surface border border-white/15 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <p className="text-brand-light font-medium">{message}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-2 rounded-xl border border-white/10 text-brand-gray text-sm hover:border-white/20 transition-all">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 py-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-sm font-medium transition-all">Delete</button>
                </div>
            </div>
        </div>
    );
}

export default function AdminProducts() {
    const { products, categoryNames, addProduct, editProduct, deleteProduct } = useAdmin();
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCategory === 'All' || p.category === filterCategory;
        return matchSearch && matchCat;
    });

    const [saving, setSaving] = useState(false);

    const handleAdd = () => { setEditTarget(null); setModalOpen(true); };
    const handleEdit = (p) => { setEditTarget(p); setModalOpen(true); };
    const handleSave = async (form) => {
        setSaving(true);
        if (editTarget?.id) await editProduct(editTarget.id, form);
        else await addProduct(form);
        setSaving(false);
        setModalOpen(false);
    };
    const handleDelete = async () => {
        await deleteProduct(deleteTarget.id);
        setDeleteTarget(null);
    };

    // Helper: get display image (backward compat)
    const getThumb = (p) => (p.images?.[0] || p.image_url || p.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iIzFhMWEyZSIvPjx0ZXh0IHg9IjIwMCIgeT0iMjUwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==');

    return (
        <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-brand-light">Products</h1>
                    <p className="text-brand-gray text-sm">{products.length} total products</p>
                </div>
                <button onClick={handleAdd} className="inline-flex items-center gap-2 bg-brand-primary text-brand-dark font-bold px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all text-sm shadow-lg shadow-brand-primary/20">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 bg-brand-surface border border-white/10 rounded-xl px-4 py-2.5 text-brand-light placeholder-brand-gray/40 focus:outline-none focus:border-brand-primary/50 text-sm transition-all"
                />
                <select
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                    className="bg-brand-surface border border-white/10 rounded-xl px-4 py-2.5 text-brand-light text-sm focus:outline-none focus:border-brand-primary/50 transition-all"
                >
                    <option value="All">All Categories</option>
                    {categoryNames.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="bg-brand-surface border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-brand-gray text-xs uppercase tracking-wider">
                                <th className="px-4 py-3 text-left">Product</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-right">Price</th>
                                <th className="px-4 py-3 text-right">Stock</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={5} className="px-4 py-12 text-center text-brand-gray">No products found.</td></tr>
                            ) : filtered.map(p => (
                                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={getThumb(p)} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                                            <span className="text-brand-light font-medium">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-medium border border-brand-primary/20">
                                            {p.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-brand-primary font-semibold">₹{parseFloat(p.price).toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${(parseInt(p.stock) || 0) > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {(parseInt(p.stock) || 0) > 0 ? p.stock : 'Out'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(p)} className="p-2 rounded-lg text-brand-gray hover:text-brand-primary hover:bg-brand-primary/10 transition-all" title="Edit">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button onClick={() => setDeleteTarget(p)} className="p-2 rounded-lg text-brand-gray hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProductModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editTarget} categoryNames={categoryNames} />
            <ConfirmDialog isOpen={!!deleteTarget} message={`Delete "${deleteTarget?.name}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
        </div>
    );
}
