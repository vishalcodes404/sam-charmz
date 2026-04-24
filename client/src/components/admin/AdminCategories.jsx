import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

function CategoryModal({ isOpen, onClose, onSave, initial }) {
    const [name, setName] = useState(initial?.name || '');
    const [image, setImage] = useState(initial?.image || '');
    const [error, setError] = useState('');
    const fileInputRef = React.useRef(null);

    React.useEffect(() => {
        setName(initial?.name || '');
        setImage(initial?.image || '');
        setError('');
    }, [initial, isOpen]);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError('Image must be under 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            setImage(ev.target.result);
            setError('');
        };
        reader.readAsDataURL(file);

        if (e.target) e.target.value = '';
    };

    const handleSave = () => {
        if (!name.trim()) { setError('Category name is required'); return; }
        onSave({ name: name.trim(), image: image.trim() });
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-brand-surface border border-white/15 rounded-2xl w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-brand-light">{initial?.id ? 'Edit Category' : 'Add Category'}</h3>
                    <button onClick={onClose} className="text-brand-gray hover:text-brand-light transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm text-brand-gray mb-1">Category Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => { setName(e.target.value); setError(''); }}
                            onKeyDown={e => e.key === 'Enter' && handleSave()}
                            placeholder="e.g. Anklets"
                            className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-brand-light placeholder-brand-gray/40 focus:outline-none focus:border-brand-primary/50 text-sm transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-brand-gray mb-1">Category Image</label>
                        <div className="flex flex-col gap-3">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-2.5 rounded-xl border border-white/10 bg-brand-surface text-brand-light text-sm hover:border-brand-primary/50 transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Upload from Device (Max 2MB)
                            </button>

                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-px bg-white/10"></div>
                                <span className="text-brand-gray/50 text-[10px] uppercase tracking-wider">or paste URL</span>
                                <div className="flex-1 h-px bg-white/10"></div>
                            </div>

                            <input
                                type="text"
                                value={image}
                                onChange={e => { setImage(e.target.value); setError(''); }}
                                placeholder="https://images.unsplash.com/..."
                                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-brand-light placeholder-brand-gray/40 focus:outline-none focus:border-brand-primary/50 text-sm transition-all"
                            />
                        </div>
                    </div>
                    {image && (
                        <div className="relative rounded-xl overflow-hidden border border-white/10 h-32">
                            <img src={image} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                            <button
                                type="button"
                                onClick={() => setImage('')}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                                title="Remove image"
                            >
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                    {error && <p className="text-red-400 text-xs">{error}</p>}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-brand-gray hover:text-brand-light hover:border-white/20 text-sm transition-all">Cancel</button>
                        <button type="button" onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-brand-primary text-brand-dark font-bold text-sm hover:opacity-90 transition-all">
                            {initial?.id ? 'Save Changes' : 'Add Category'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminCategories() {
    const { categories, products, addCategory, editCategory, deleteCategory } = useAdmin();
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteError, setDeleteError] = useState({});
    const [success, setSuccess] = useState('');

    const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

    const handleAdd = () => { setEditTarget(null); setModalOpen(true); };
    const handleEdit = (cat) => { setEditTarget(cat); setModalOpen(true); };

    const handleSave = async ({ name, image }) => {
        if (editTarget?.id) {
            const result = await editCategory(editTarget.id, { name, image });
            if (result.success) showSuccess(`Category "${name}" updated!`);
        } else {
            const result = await addCategory(name, image);
            if (result.success) {
                showSuccess(`Category "${name}" added!`);
            } else {
                return;
            }
        }
        setModalOpen(false);
    };

    const handleDelete = async (cat) => {
        const result = await deleteCategory(cat.id);
        if (!result.success) {
            setDeleteError(prev => ({ ...prev, [cat.id]: result.error }));
            setTimeout(() => setDeleteError(prev => { const n = { ...prev }; delete n[cat.id]; return n; }), 4000);
        }
    };

    const productCountForCategory = (catName) => products.filter(p => p.category === catName).length;

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-brand-light">Categories</h1>
                    <p className="text-brand-gray text-sm">{categories.length} categories · {products.length} total products</p>
                </div>
                <button onClick={handleAdd} className="inline-flex items-center gap-2 bg-brand-primary text-brand-dark font-bold px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all text-sm shadow-lg shadow-brand-primary/20">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Category
                </button>
            </div>

            {success && (
                <div className="px-4 py-3 rounded-xl bg-green-500/15 text-green-400 border border-green-500/20 text-sm font-medium">
                    ✓ {success}
                </div>
            )}

            {/* Categories List */}
            <div className="space-y-3">
                {categories.length === 0 ? (
                    <div className="text-center py-12 text-brand-gray text-sm">No categories yet. Add one above.</div>
                ) : categories.map(cat => {
                    const count = productCountForCategory(cat.name);
                    return (
                        <div key={cat.id} className="bg-brand-surface border border-white/10 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 hover:border-white/20 transition-all">
                            <div className="flex items-center gap-4">
                                {cat.image ? (
                                    <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                                ) : (
                                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </div>
                                )}
                                <div>
                                    <p className="text-brand-light font-medium">{cat.name}</p>
                                    <p className="text-brand-gray text-xs">{count} product{count !== 1 ? 's' : ''}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEdit(cat)}
                                    className="p-2 rounded-lg text-brand-gray hover:text-brand-primary hover:bg-brand-primary/10 transition-all"
                                    title="Edit category"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                                <div className="flex flex-col items-end gap-1">
                                    <button
                                        onClick={() => handleDelete(cat)}
                                        className={`p-2 rounded-lg transition-all ${count > 0 ? 'text-brand-gray/40 cursor-not-allowed' : 'text-brand-gray hover:text-red-400 hover:bg-red-500/10'}`}
                                        title={count > 0 ? 'Remove all products first' : 'Delete category'}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    {deleteError[cat.id] && (
                                        <p className="text-red-400 text-xs max-w-[200px] text-right">{deleteError[cat.id]}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <CategoryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editTarget} />
        </div>
    );
}
