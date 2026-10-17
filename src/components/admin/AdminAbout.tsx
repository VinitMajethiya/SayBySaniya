import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Doodle } from '@/components/brand/Doodle';
import { DEFAULT_ABOUT_BRAND, type AboutBrandData, type AboutValueCard } from '@/types/brand';

export const AdminAbout: React.FC = () => {
  const [data, setData] = useState<AboutBrandData>(DEFAULT_ABOUT_BRAND);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    async function loadAboutSettings() {
      setLoading(true);
      try {
        const { data: dbData, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'about_brand')
          .maybeSingle();

        if (error) throw error;
        if (dbData && dbData.value) {
          const val = dbData.value as unknown as Partial<AboutBrandData>;
          setData({
            ...DEFAULT_ABOUT_BRAND,
            ...val,
            cards: val.cards && val.cards.length > 0 ? val.cards : DEFAULT_ABOUT_BRAND.cards,
            storyParagraphs:
              val.storyParagraphs && val.storyParagraphs.length > 0
                ? val.storyParagraphs
                : DEFAULT_ABOUT_BRAND.storyParagraphs,
          });
        }
      } catch (err) {
        console.warn('[AdminAbout] Using default content:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAboutSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('site_settings').upsert({
        key: 'about_brand',
        value: data as any,
        is_public: true,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      showToast('About the Brand updated successfully! Live on site immediately. ✨');
    } catch (err) {
      alert(`Error saving changes: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all About the Brand content back to original brand defaults?')) {
      setData(DEFAULT_ABOUT_BRAND);
      showToast('Reset to brand defaults. Remember to click "Save Changes".');
    }
  };

  // Card management helpers
  const handleAddCard = () => {
    const newCard: AboutValueCard = {
      id: `val-${Date.now()}`,
      doodle: 'heart',
      title: 'New Value',
      description: 'Describe what makes Say By Saniya special.',
    };
    setData({ ...data, cards: [...data.cards, newCard] });
  };

  const handleUpdateCard = (index: number, updates: Partial<AboutValueCard>) => {
    const newCards = [...data.cards];
    newCards[index] = { ...newCards[index], ...updates };
    setData({ ...data, cards: newCards });
  };

  const handleDeleteCard = (index: number) => {
    if (data.cards.length <= 1) {
      alert('You must have at least one value card.');
      return;
    }
    const newCards = data.cards.filter((_, i) => i !== index);
    setData({ ...data, cards: newCards });
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.cards.length) return;
    const newCards = [...data.cards];
    const [moved] = newCards.splice(index, 1);
    newCards.splice(targetIndex, 0, moved);
    setData({ ...data, cards: newCards });
  };

  // Story paragraph helpers
  const handleAddParagraph = () => {
    setData({
      ...data,
      storyParagraphs: [
        ...data.storyParagraphs,
        'Write another paragraph about your brand philosophy, ingredients, or craft here.',
      ],
    });
  };

  const handleUpdateParagraph = (index: number, text: string) => {
    const newParas = [...data.storyParagraphs];
    newParas[index] = text;
    setData({ ...data, storyParagraphs: newParas });
  };

  const handleDeleteParagraph = (index: number) => {
    if (data.storyParagraphs.length <= 1) {
      alert('You must have at least one story paragraph.');
      return;
    }
    const newParas = data.storyParagraphs.filter((_, i) => i !== index);
    setData({ ...data, storyParagraphs: newParas });
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-ink-soft font-display flex flex-col items-center justify-center space-y-2">
        <Doodle name="bow" size={24} className="text-ink animate-bounce" />
        <p>Loading About the Brand content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-16 right-4 z-50 bg-ink text-cream px-4 py-2.5 rounded-pill shadow-xl text-xs font-sans font-medium flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <Doodle name="heart" size={14} className="text-strawberry" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-hairline-b">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-semibold text-ink">
              About the Brand
            </h2>
            <span className="text-[10px] uppercase font-sans font-semibold tracking-wider px-2 py-0.5 rounded-full bg-cream border border-hairline text-ink-soft">
              Live on /about
            </span>
          </div>
          <p className="text-xs text-ink-soft mt-0.5">
            Edit page title, value cards, and the main about brand philosophy section
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Tab View Switcher */}
          <div className="flex items-center bg-ivory border border-hairline rounded-pill p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-pill transition-colors ${
                activeTab === 'editor' ? 'bg-ink text-cream' : 'text-ink-soft hover:text-ink'
              }`}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-pill transition-colors flex items-center gap-1 ${
                activeTab === 'preview' ? 'bg-ink text-cream' : 'text-ink-soft hover:text-ink'
              }`}
            >
              <span>Live Preview</span>
              <Doodle name="sparkle" size={12} className={activeTab === 'preview' ? 'text-cream' : 'text-heart'} />
            </button>
          </div>

          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-pill border border-hairline hover:border-ink text-xs font-medium text-ink transition-colors hidden md:inline-flex items-center gap-1"
          >
            <span>View Live Page</span>
            <span className="text-[10px]">↗</span>
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-pill bg-ink text-cream text-xs uppercase tracking-button font-medium hover:bg-heart transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
          >
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            <Doodle name="heart" size={12} className="text-cream" />
          </button>
        </div>
      </div>

      {/* Editor Mode */}
      {activeTab === 'editor' && (
        <form onSubmit={handleSave} className="space-y-8">
          {/* Section 1: Page Header */}
          <div className="p-5 bg-ivory rounded-card border border-hairline shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-hairline-b pb-3">
              <div className="flex items-center gap-2">
                <Doodle name="bow" size={16} className="text-ink" />
                <h3 className="font-display text-base font-semibold text-ink">
                  1. Page Header (Eyebrow, Title &amp; Subtitle)
                </h3>
              </div>
              <span className="text-[10px] text-ink-soft font-mono">Header Section</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                  Eyebrow Label
                </label>
                <input
                  type="text"
                  value={data.eyebrow}
                  onChange={(e) => setData({ ...data, eyebrow: e.target.value })}
                  placeholder="OUR VALUES"
                  className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                  Main Page Heading (H1)
                </label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Homemade, Organic Lip Care for Every Day"
                  className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink font-display text-sm font-semibold"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                  Subtitle / Sub-headline
                </label>
                <input
                  type="text"
                  value={data.subtitle}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  placeholder="Crafted by hand in small batches. Nourish. Tint. Love."
                  className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Value Cards */}
          <div className="p-5 bg-ivory rounded-card border border-hairline shadow-subtle space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-hairline-b pb-3">
              <div className="flex items-center gap-2">
                <Doodle name="sparkle" size={16} className="text-heart" />
                <div>
                  <h3 className="font-display text-base font-semibold text-ink">
                    2. Brand Value Cards
                  </h3>
                  <p className="text-[11px] text-ink-soft">
                    Displayed on both the Homepage (&quot;Why Choose Say By Saniya&quot;) and the About Us page
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddCard}
                className="px-3.5 py-1.5 rounded-pill border border-hairline hover:border-ink text-xs font-medium text-ink transition-colors flex items-center gap-1 self-start sm:self-auto"
              >
                <span>+ Add Value Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.cards.map((card, idx) => (
                <div
                  key={card.id || idx}
                  className="p-4 bg-cream/50 rounded-card border border-hairline flex flex-col justify-between space-y-3 relative group"
                >
                  <div className="space-y-3">
                    {/* Card Top: Doodle & Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Doodle name={card.doodle} size={18} className="text-heart" />
                        <select
                          value={card.doodle}
                          onChange={(e) =>
                            handleUpdateCard(idx, { doodle: e.target.value as any })
                          }
                          className="bg-ivory border border-hairline rounded px-2 py-1 text-[11px] text-ink focus:outline-none focus:border-ink"
                        >
                          <option value="heart">Heart ♥</option>
                          <option value="bow">Bow 🎀</option>
                          <option value="sparkle">Sparkle ✨</option>
                          <option value="star">Star ✦</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1 text-[11px]">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveCard(idx, 'up')}
                          className="p-1 rounded text-ink-soft hover:text-ink disabled:opacity-20"
                          title="Move left/up"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          disabled={idx === data.cards.length - 1}
                          onClick={() => handleMoveCard(idx, 'down')}
                          className="p-1 rounded text-ink-soft hover:text-ink disabled:opacity-20"
                          title="Move right/down"
                        >
                          →
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCard(idx)}
                          className="p-1 rounded text-ink-soft hover:text-heart"
                          title="Delete card"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Card Title */}
                    <div>
                      <label className="block text-[10px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                        Card Title
                      </label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => handleUpdateCard(idx, { title: e.target.value })}
                        placeholder="e.g. 100% Organic"
                        className="w-full bg-ivory border border-hairline rounded p-2 text-ink text-xs font-semibold focus:outline-none focus:border-ink font-display"
                      />
                    </div>

                    {/* Card Description */}
                    <div>
                      <label className="block text-[10px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={card.description}
                        onChange={(e) => handleUpdateCard(idx, { description: e.target.value })}
                        placeholder="Ingredients you can actually pronounce."
                        className="w-full bg-ivory border border-hairline rounded p-2 text-ink text-xs focus:outline-none focus:border-ink leading-relaxed"
                      />
                    </div>
                  </div>

                  <span className="text-[9px] font-mono text-ink-soft/60">
                    Card #{idx + 1}
                  </span>
                </div>
              ))}
            </div>

            {/* Homepage Section Headings Customization */}
            <div className="pt-4 border-hairline-t space-y-2">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-ink-soft block">
                Homepage &quot;Why Choose Us&quot; Headings (Optional Customization):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    Homepage Eyebrow
                  </label>
                  <input
                    type="text"
                    value={data.whyChooseEyebrow || ''}
                    onChange={(e) => setData({ ...data, whyChooseEyebrow: e.target.value })}
                    placeholder="WHY CHOOSE US"
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink text-xs focus:outline-none focus:border-ink uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    Homepage Title
                  </label>
                  <input
                    type="text"
                    value={data.whyChooseTitle || ''}
                    onChange={(e) => setData({ ...data, whyChooseTitle: e.target.value })}
                    placeholder="Why Choose Say By Saniya"
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink text-xs focus:outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                    Homepage Subtitle
                  </label>
                  <input
                    type="text"
                    value={data.whyChooseSubtitle || ''}
                    onChange={(e) => setData({ ...data, whyChooseSubtitle: e.target.value })}
                    placeholder="Homemade, organic lip care for every day. Nourish. Tint. Love."
                    className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink text-xs focus:outline-none focus:border-ink"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: The Main About the Brand Section */}
          <div className="p-5 bg-ivory rounded-card border border-hairline shadow-subtle space-y-5">
            <div className="flex items-center justify-between border-hairline-b pb-3">
              <div className="flex items-center gap-2">
                <Doodle name="heart" size={16} className="text-heart" />
                <div>
                  <h3 className="font-display text-base font-semibold text-ink">
                    3. Main "About the Brand" Part
                  </h3>
                  <p className="text-[11px] text-ink-soft">
                    The signature framed editorial narrative and brand philosophy
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-ink-soft font-mono">Core Brand Story</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                  Section Badge Label
                </label>
                <input
                  type="text"
                  value={data.mainBadge}
                  onChange={(e) => setData({ ...data, mainBadge: e.target.value })}
                  placeholder="ABOUT THE BRAND"
                  className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink uppercase"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                  Footer Slogan / Tagline
                </label>
                <input
                  type="text"
                  value={data.footerTagline}
                  onChange={(e) => setData({ ...data, footerTagline: e.target.value })}
                  placeholder="Nourish. Tint. Love. ♥"
                  className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink font-script text-base"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={data.mainHeading}
                  onChange={(e) => setData({ ...data, mainHeading: e.target.value })}
                  placeholder="Lip care, made by hand. Made for you."
                  className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink font-display text-base font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                  Sub-headline / Intro Line
                </label>
                <input
                  type="text"
                  value={data.mainSubheading}
                  onChange={(e) => setData({ ...data, mainSubheading: e.target.value })}
                  placeholder="Nourish. Tint. Love. Slim little tins of balm that live in your pocket and steal your heart."
                  className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                />
              </div>
            </div>

            {/* Brand Philosophy Paragraphs */}
            <div className="space-y-3 pt-2 border-hairline-t">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-ink font-sans uppercase tracking-eyebrow">
                    Brand Philosophy &amp; Story Paragraphs
                  </h4>
                  <p className="text-[11px] text-ink-soft">
                    Share your organic ingredients, small-batch process, and authentic mission
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddParagraph}
                  className="px-3 py-1.5 rounded-pill bg-cream border border-hairline hover:border-ink text-xs font-medium text-ink transition-colors flex items-center gap-1"
                >
                  <span>+ Add Paragraph</span>
                </button>
              </div>

              <div className="space-y-3">
                {data.storyParagraphs.map((para, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3 bg-cream/40 rounded border border-hairline flex items-start gap-3 group"
                  >
                    <span className="font-mono text-[10px] text-ink-soft mt-2 shrink-0">
                      #{pIdx + 1}
                    </span>
                    <textarea
                      rows={3}
                      value={para}
                      onChange={(e) => handleUpdateParagraph(pIdx, e.target.value)}
                      placeholder="Write your paragraph..."
                      className="w-full bg-ivory border border-hairline rounded p-2 text-xs text-ink focus:outline-none focus:border-ink leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteParagraph(pIdx)}
                      className="p-1 text-ink-soft hover:text-heart shrink-0 mt-2"
                      title="Remove paragraph"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button Settings */}
            <div className="pt-3 border-hairline-t grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={data.ctaText}
                  onChange={(e) => setData({ ...data, ctaText: e.target.value })}
                  placeholder="Shop the Collection"
                  className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-eyebrow text-ink-soft mb-1">
                  CTA Button Link
                </label>
                <input
                  type="text"
                  value={data.ctaLink}
                  onChange={(e) => setData({ ...data, ctaLink: e.target.value })}
                  placeholder="/shop"
                  className="w-full bg-cream/40 border border-hairline rounded p-2 text-ink focus:outline-none focus:border-ink font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Bottom Save & Reset Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-hairline-t">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-ink-soft hover:text-heart underline transition-colors"
            >
              Reset to Brand Defaults
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="px-4 py-2 rounded-pill border border-hairline hover:border-ink text-xs font-medium text-ink transition-colors"
              >
                Preview Live Layout
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-pill bg-ink text-cream text-xs uppercase tracking-button font-medium hover:bg-heart transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <span>{saving ? 'Saving Changes...' : 'Save All Changes'}</span>
                <Doodle name="heart" size={14} className="text-cream" />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Live Preview Mode */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="p-4 bg-ivory rounded-card border border-hairline flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-ink">
                Live Storefront Preview (Exact view customers see on <code className="font-mono text-[11px]">/about</code>)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className="px-3 py-1.5 rounded-pill border border-hairline text-xs font-medium text-ink hover:border-ink"
            >
              ← Back to Editor
            </button>
          </div>

          {/* Render Actual Storefront Design */}
          <div className="p-6 sm:p-10 bg-cream rounded-card border border-hairline shadow-subtle space-y-12 max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <p className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft">
                {data.eyebrow}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink leading-tight">
                {data.title}
              </h2>
              <p className="text-sm sm:text-base text-ink-soft font-sans">
                {data.subtitle}
              </p>
            </div>

            {/* Cards Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-${Math.min(data.cards.length, 3)} gap-6`}>
              {data.cards.map((card) => (
                <div
                  key={card.id}
                  className="p-6 bg-ivory rounded-card border-hairline text-center space-y-3 shadow-sm"
                >
                  <Doodle name={card.doodle} size={28} className="text-heart mx-auto" />
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Main About Part */}
            <div className="p-8 sm:p-12 bg-ivory rounded-card border-hairline shadow-subtle space-y-6">
              <div className="flex items-center justify-between border-hairline-b pb-4">
                <span className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft">
                  {data.mainBadge}
                </span>
                <Doodle name="heart" size={14} className="text-heart" />
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink leading-snug">
                {data.mainHeading}
              </h3>

              <p className="text-sm sm:text-base text-ink-soft font-sans leading-relaxed">
                {data.mainSubheading}
              </p>

              <div className="p-6 bg-cream/70 rounded-card border border-hairline space-y-3 text-xs sm:text-sm text-ink leading-relaxed">
                {data.storyParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="pt-4 border-hairline-t flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="font-script text-2xl text-ink">
                  {data.footerTagline}
                </span>
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-pill bg-ink text-cream text-xs uppercase tracking-button font-medium hover:bg-heart transition-all"
                >
                  {data.ctaText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
