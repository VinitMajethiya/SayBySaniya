import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadProductImage, deleteStorageImage } from '@/lib/storage';
import { Doodle } from '@/components/brand/Doodle';
import type { Database, ProductDbStatus } from '@/types/supabase';

type ProductRow = Database['public']['Tables']['products']['Row'];

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [productExtras, setProductExtras] = useState<
    Record<string, { how_to_use?: string; return_policy?: string; allergy_advice?: string }>
  >({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<ProductRow> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [productsRes, extrasRes] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .order('sort_order', { ascending: true }),
        supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'product_extras')
          .maybeSingle(),
      ]);

      if (!productsRes.error && productsRes.data) {
        setProducts(productsRes.data);
      }
      if (extrasRes.data?.value) {
        setProductExtras(extrasRes.data.value as any);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenNew = () => {
    setIsNew(true);
    setSaveStatus(null);
    setEditingProduct({
      name: '',
      slug: '',
      category: 'lip-balm',
      packaging: 'tin',
      subtitle: '',
      description: '',
      flavor_notes: [],
      price: 29900,
      mrp: 0,
      size: '[TBD]',
      status: 'available',
      stock: 25,
      badge: '',
      is_featured: false,
      images: [],
      ingredients: [],
      claims: ['100% Organic & Homemade', 'Nourish. Tint. Love.', 'Pocket-Sized Slider Tin'],
      how_to_use: 'Slide open and smooth over clean lips whenever they need love.',
      return_policy:
        'Due to the hygienic nature of homemade lip care, we cannot accept returns once opened. If your product arrives damaged in transit, please message us on WhatsApp with photos for an immediate replacement. ♥',
      allergy_advice:
        'Even 100% natural and organic botanicals can cause sensitivity in rare cases. We recommend swatching a tiny amount on your inner wrist or jawline before first use. Discontinue if irritation occurs.',
      sort_order: products.length + 1,
    });
  };

  const handleEdit = (prod: ProductRow) => {
    setIsNew(false);
    setSaveStatus(null);
    const extra = productExtras[prod.slug] || (prod.id ? productExtras[prod.id] : undefined);
    setEditingProduct({
      ...prod,
      how_to_use: extra?.how_to_use || prod.how_to_use || 'Slide open and smooth over clean lips whenever they need love.',
      return_policy:
        extra?.return_policy ||
        prod.return_policy ||
        'Due to the hygienic nature of homemade lip care, we cannot accept returns once opened. If your product arrives damaged in transit, please message us on WhatsApp with photos for an immediate replacement. ♥',
      allergy_advice:
        extra?.allergy_advice ||
        prod.allergy_advice ||
        'Even 100% natural and organic botanicals can cause sensitivity in rare cases. We recommend swatching a tiny amount on your inner wrist or jawline before first use. Discontinue if irritation occurs.',
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return;
    }

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter((p) => p.id !== id));
    } else {
      alert(`Error deleting product: ${error.message}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.slug) return;

    setSaveStatus('Saving changes...');

    const basePayload: any = {
      name: editingProduct.name.trim(),
      slug: editingProduct.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      category: editingProduct.category || 'lip-balm',
      packaging: editingProduct.packaging || 'tin',
      subtitle: editingProduct.subtitle || null,
      description: editingProduct.description || '',
      flavor_notes: editingProduct.flavor_notes || [],
      price: Math.max(0, editingProduct.price || 0),
      mrp: editingProduct.mrp ? Math.max(0, editingProduct.mrp) : null,
      size: editingProduct.size || '[TBD]',
      status: editingProduct.status || 'available',
      stock: Math.max(0, editingProduct.stock ?? 0),
      badge: editingProduct.badge || null,
      is_featured: Boolean(editingProduct.is_featured),
      images: editingProduct.images || [],
      ingredients: editingProduct.ingredients || [],
      claims: editingProduct.claims || [],
      how_to_use: editingProduct.how_to_use || null,
      sort_order: editingProduct.sort_order ?? 0,
    };

    const extendedPayload = {
      ...basePayload,
      return_policy: editingProduct.return_policy || null,
      allergy_advice: editingProduct.allergy_advice || null,
    };

    // Helper to persist to site_settings product_extras
    const syncExtras = async (slug: string) => {
      try {
        const updatedExtras = {
          ...productExtras,
          [slug]: {
            how_to_use: editingProduct.how_to_use || '',
            return_policy: editingProduct.return_policy || '',
            allergy_advice: editingProduct.allergy_advice || '',
          },
        };
        await supabase.from('site_settings').upsert({
          key: 'product_extras',
          value: updatedExtras,
          is_public: true,
          updated_at: new Date().toISOString(),
        });
        setProductExtras(updatedExtras);
      } catch (err) {
        console.warn('Notice syncing product extras:', err);
      }
    };

    if (isNew) {
      let insertResult = await supabase.from('products').insert(extendedPayload).select().single();
      if (insertResult.error && insertResult.error.message?.includes('column')) {
        // Fallback without new columns if DB table lacks them
        insertResult = await supabase.from('products').insert(basePayload).select().single();
      }

      if (insertResult.error) {
        setSaveStatus(`Error creating product: ${insertResult.error.message}`);
      } else {
        await syncExtras(basePayload.slug);
        setSaveStatus('Product created successfully! ✨');
        if (insertResult.data) setProducts([...products, insertResult.data]);
        setTimeout(() => setEditingProduct(null), 1000);
      }
    } else if (editingProduct.id) {
      let updateResult = await supabase
        .from('products')
        .update(extendedPayload)
        .eq('id', editingProduct.id)
        .select()
        .single();

      if (updateResult.error && updateResult.error.message?.includes('column')) {
        // Fallback without new columns if DB table lacks them
        updateResult = await supabase
          .from('products')
          .update(basePayload)
          .eq('id', editingProduct.id)
          .select()
          .single();
      }

      if (updateResult.error) {
        setSaveStatus(`Error updating product: ${updateResult.error.message}`);
      } else {
        await syncExtras(basePayload.slug);
        setSaveStatus('Changes saved! Takes effect on site immediately. ✨');
        if (updateResult.data) {
          setProducts(products.map((p) => (p.id === updateResult.data.id ? updateResult.data : p)));
        }
        setTimeout(() => setEditingProduct(null), 1000);
      }
    }
  };

  const handleApplyPriceToCategory = async () => {
    if (!editingProduct) return;
    const currentPrice = editingProduct.price ?? 0;
    const cat = editingProduct.category || 'lip-balm';

    if (currentPrice <= 0) {
      alert('Please enter a valid price in rupees before applying.');
      return;
    }

    const priceRupees = currentPrice / 100;
    const confirmed = window.confirm(
      `Apply ₹${priceRupees} to ALL products in the "${cat}" category?`
    );
    if (!confirmed) return;

    // Update locally
    setProducts((prev) =>
      prev.map((p) => (p.category === cat ? { ...p, price: currentPrice } : p))
    );

    // Sync to Supabase if configured
    try {
      const { error } = await supabase
        .from('products')
        .update({ price: currentPrice })
        .eq('category', cat);
      if (error) {
        console.warn('Batch price update notice:', error.message);
      }
    } catch (err) {
      console.warn(err);
    }

    setSaveStatus(`Applied ₹${priceRupees} to all "${cat}" products! ✨`);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !editingProduct) return;
    const file = e.target.files[0];

    setIsUploading(true);
    try {
      const folder = editingProduct.slug || 'balms';
      const publicUrl = await uploadProductImage(file, folder);

      const existingImages = editingProduct.images || [];
      setEditingProduct({
        ...editingProduct,
        images: [...existingImages, publicUrl],
      });
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSetHeroImage = (index: number) => {
    if (!editingProduct?.images) return;
    const images = [...editingProduct.images];
    const [selected] = images.splice(index, 1);
    images.unshift(selected);
    setEditingProduct({ ...editingProduct, images });
  };

  const handleRemoveImage = async (index: number) => {
    if (!editingProduct?.images) return;
    const targetUrl = editingProduct.images[index];
    const updatedImages = editingProduct.images.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, images: updatedImages });

    // Try deleting from storage in background
    if (targetUrl.includes('supabase.co')) {
      deleteStorageImage(targetUrl).catch(() => {});
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-hairline-b">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">
            Product Catalogue
          </h2>
          <p className="text-xs text-ink-soft">
            Manage lip balms, slider tin tints, real-time pricing and photos
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="px-5 py-2.5 rounded-pill bg-ink text-cream font-sans text-xs uppercase tracking-button font-medium hover:bg-heart transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <span>+ Add Product</span>
          <Doodle name="bow" size={14} className="text-cream" />
        </button>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by product name or slug..."
          className="w-full bg-ivory border border-hairline rounded-pill px-4 py-2 text-xs text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-ink"
        />
      </div>

      {/* Products Table / Cards */}
      {loading ? (
        <div className="p-12 text-center text-ink-soft font-display">
          Loading catalogue...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 bg-ivory/50 rounded-card border border-dashed border-hairline text-center space-y-2">
          <p className="font-display text-lg text-ink">No products found.</p>
          <p className="text-xs text-ink-soft">Tap "+ Add Product" to create your first flavor tin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="p-4 bg-ivory rounded-card border border-hairline flex flex-col justify-between space-y-3 hover:border-ink transition-colors"
            >
              <div className="flex gap-3">
                <div className="w-16 h-16 shrink-0 rounded bg-cream border border-hairline overflow-hidden flex items-center justify-center">
                  {prod.images && prod.images.length > 0 ? (
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-ink-soft font-sans uppercase">Tin</span>
                  )}
                </div>

                <div className="min-w-0 flex-grow">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display text-base font-semibold text-ink truncate">
                      {prod.name}
                    </h3>
                    {prod.badge && (
                      <span className="px-1.5 py-0.5 rounded-full bg-strawberry text-ink text-[9px] font-sans font-medium uppercase">
                        {prod.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink font-sans font-semibold mt-0.5">
                    {prod.price > 0 ? `₹${(prod.price / 100).toLocaleString('en-IN')}` : '₹[TBD]'}
                    {prod.mrp && prod.mrp > 0 && (
                      <span className="text-xs line-through text-ink-soft ml-1.5">
                        ₹{(prod.mrp / 100).toLocaleString('en-IN')}
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      prod.status === 'available' ? 'bg-green-500' :
                      prod.status === 'sold_out' ? 'bg-red-400' : 'bg-honey'
                    }`} />
                    <span className="text-[11px] text-ink-soft capitalize">
                      {prod.status.replace('_', ' ')} · Stock: {prod.stock}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-hairline-t flex items-center justify-between text-xs font-sans">
                <button
                  type="button"
                  onClick={() => handleEdit(prod)}
                  className="px-3 py-1.5 rounded-pill border border-hairline hover:border-ink font-medium text-ink transition-colors"
                >
                  Edit &amp; Photos
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(prod.id, prod.name)}
                  className="text-xs text-ink-soft hover:text-heart underline transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Edit / Create Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-ivory rounded-card border-hairline w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl my-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-hairline-b flex items-center justify-between bg-cream/50">
              <div>
                <h3 className="font-display text-xl font-semibold text-ink">
                  {isNew ? 'Create New Product' : `Editing: ${editingProduct.name}`}
                </h3>
                <p className="text-xs text-ink-soft">
                  Price changes reflect on the website immediately
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-ink hover:text-heart"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs font-sans">
              {saveStatus && (
                <div className="p-3 bg-cream border border-hairline rounded text-xs text-ink font-medium">
                  {saveStatus}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => {
                      const name = e.target.value;
                      setEditingProduct({
                        ...editingProduct,
                        name,
                        slug: isNew ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : editingProduct.slug,
                      });
                    }}
                    placeholder="e.g. Strawberry Jam"
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.slug || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                    placeholder="e.g. strawberry-jam"
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Category & Packaging */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.category || 'lip-balm'}
                    onChange={(e) => {
                      const newCat = e.target.value as any;
                      const autoPkg = newCat === 'lip-mask' ? 'jar' : (newCat === 'lip-tint' || newCat === 'lip-gloss') ? 'bottle' : 'tin';
                      setEditingProduct({
                        ...editingProduct,
                        category: newCat,
                        packaging: autoPkg,
                      });
                    }}
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink font-sans text-xs"
                  >
                    <option value="lip-balm">Lip Balm (lip-balm)</option>
                    <option value="lip-mask">Over Night Lip Mask (lip-mask)</option>
                    <option value="lip-tint">Lip Tint (lip-tint)</option>
                    <option value="lip-gloss">Lip Gloss (lip-gloss)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    Packaging *
                  </label>
                  <select
                    value={editingProduct.packaging || 'tin'}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        packaging: e.target.value as any,
                      })
                    }
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink font-sans text-xs"
                  >
                    <option value="tin">Slider Tin (tin)</option>
                    <option value="jar">Round Jar with Gold Rim (jar)</option>
                    <option value="bottle">Faceted Bottle with Wand (bottle)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    Price in ₹ (Rupees) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={editingProduct.price ? editingProduct.price / 100 : ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Math.round(Number(e.target.value || 0) * 100),
                      })
                    }
                    placeholder="299 (0 for TBD)"
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink font-semibold"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPriceToCategory}
                    className="mt-1.5 text-[10px] font-sans font-medium uppercase tracking-button text-heart hover:underline flex items-center gap-1 text-left"
                  >
                    ⚡ Apply this price to all in category
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    Original MRP ₹ (Strike-through)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={editingProduct.mrp ? editingProduct.mrp / 100 : ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        mrp: e.target.value ? Math.round(Number(e.target.value) * 100) : 0,
                      })
                    }
                    placeholder="349"
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.stock ?? 25}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock: Number(e.target.value),
                      })
                    }
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    Status
                  </label>
                  <select
                    value={editingProduct.status || 'available'}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        status: e.target.value as ProductDbStatus,
                      })
                    }
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                  >
                    <option value="available">Available (In Stock)</option>
                    <option value="sold_out">Sold Out</option>
                    <option value="coming_soon">Coming Soon</option>
                    <option value="limited_drop">Limited Drop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    placeholder="e.g. Bestseller"
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    Size
                  </label>
                  <input
                    type="text"
                    value={editingProduct.size || '15g'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, size: e.target.value })}
                    placeholder="15g"
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={editingProduct.subtitle || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                  placeholder="e.g. Summer berries in sweet organic beeswax"
                  className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Describe texture, organic benefits, and scent..."
                  className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    Flavor Notes (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={(editingProduct.flavor_notes || []).join(', ')}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        flavor_notes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Ripe field strawberries, Warm sugar glaze"
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    Ingredients (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={(editingProduct.ingredients || []).join(', ')}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        ingredients: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Organic Beeswax, Raw Shea Butter, Sweet Almond Oil"
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              {/* Product Usage, Return Policy & Allergy Advice Accordions */}
              <div className="p-4 bg-cream/50 rounded-card border border-hairline space-y-4">
                <div className="flex items-center gap-2 border-hairline-b pb-2">
                  <Doodle name="heart" size={14} className="text-heart" />
                  <span className="text-[11px] font-medium uppercase tracking-eyebrow text-ink font-sans">
                    Product Usage, Return Policy &amp; Allergy Review
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft">
                      How to Use Product *
                    </label>
                    <span className="text-[10px] text-ink-soft">Product page &quot;How to Use&quot; tab</span>
                  </div>
                  <textarea
                    rows={2}
                    value={editingProduct.how_to_use || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, how_to_use: e.target.value })}
                    placeholder="e.g. Slide open and smooth over clean lips whenever they need love. Reapply generously before sleep..."
                    className="w-full bg-ivory border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink text-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft">
                      Return &amp; Replacement Policy *
                    </label>
                    <span className="text-[10px] text-ink-soft">Product page &quot;Shipping &amp; Returns&quot; tab</span>
                  </div>
                  <textarea
                    rows={2}
                    value={editingProduct.return_policy || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, return_policy: e.target.value })}
                    placeholder="e.g. Due to the hygienic nature of homemade lip care, we cannot accept returns once opened. If your product arrives damaged in transit, message us on WhatsApp with photos for an immediate replacement. ♥"
                    className="w-full bg-ivory border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink text-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft">
                      Skin Patch Test &amp; Allergy Review / Advice *
                    </label>
                    <span className="text-[10px] text-ink-soft">Product page &quot;Skin Patch Test &amp; Allergy Advice&quot; box</span>
                  </div>
                  <textarea
                    rows={2}
                    value={editingProduct.allergy_advice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, allergy_advice: e.target.value })}
                    placeholder="e.g. Even 100% natural and organic botanicals can cause sensitivity in rare cases. We recommend swatching a tiny amount on your inner wrist or jawline before first use. Discontinue if irritation occurs."
                    className="w-full bg-ivory border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink text-xs"
                  />
                </div>
              </div>

              {/* Photo Manager (Supabase Storage) */}
              <div className="p-4 bg-cream/50 rounded-card border border-hairline space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-eyebrow text-ink font-sans">
                    Product Photos &amp; Gallery
                  </span>
                  <label className="cursor-pointer px-3 py-1.5 rounded-pill bg-ink text-cream text-[11px] font-medium hover:bg-heart transition-all">
                    <span>{isUploading ? 'Compressing & Uploading...' : '+ Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {editingProduct.images && editingProduct.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {editingProduct.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded border border-hairline bg-ivory overflow-hidden group"
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-ink text-cream text-[9px] px-1.5 py-0.5 rounded font-sans uppercase font-semibold shadow">
                            Hero
                          </span>
                        )}
                        <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetHeroImage(idx)}
                              className="px-2 py-1 rounded bg-cream text-ink text-[10px] font-semibold w-full hover:bg-ivory"
                            >
                              Set Hero
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="px-2 py-1 rounded bg-heart text-cream text-[10px] font-semibold w-full hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-ink-soft py-2">
                    No custom photos uploaded yet. When empty, the app renders our signature custom animated pocket slider tin illustration!
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-hairline-t">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-pill border border-hairline text-xs font-medium text-ink hover:border-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-pill bg-ink text-cream text-xs uppercase tracking-button font-medium hover:bg-heart transition-all"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
