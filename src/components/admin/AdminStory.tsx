import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Doodle } from '@/components/brand/Doodle';

export interface StoryPhoto {
  id: string;
  url: string;
  caption: string;
  tag?: string;
}

export interface StoryContentData {
  eyebrow: string;
  title: string;
  subtitle: string;
  quote: string;
  story_paragraphs: string[];
  hero_image: string;
  hero_caption: string;
  instagram_handle: string;
  gallery: StoryPhoto[];
}

const DEFAULT_STORY: StoryContentData = {
  eyebrow: 'OUR STORY',
  title: 'From the Kitchen to Your Pocket',
  subtitle: 'Homemade, organic lip care for every day.',
  quote: '"It started in a kitchen, with a few ingredients and one very dry pair of lips."',
  story_paragraphs: [
    'Say By Saniya started right in my home kitchen in India. I had struggled for years with chronic dry, chapped lips and could never find a commercial balm that actually healed without leaving a waxy or chemical film.',
    'I started experimenting with pure unrefined beeswax, golden raw honey, cold-pressed sweet almond oil, and natural strawberry essences. After dozens of hand-poured batches and gifting them to family and close friends, everyone kept asking for refills.',
    'Today, every single pocket-sized slider tin, overnight mask jar, and velvety tint is still crafted in small batches with genuine care, clean ingredients, and zero shortcuts. Nourish. Tint. Love.',
  ],
  hero_image: '',
  hero_caption: 'Saniya in her kitchen studio hand-pouring organic balms',
  instagram_handle: 'saylipss.co',
  gallery: [],
};

export const AdminStory: React.FC = () => {
  const [story, setStory] = useState<StoryContentData>(DEFAULT_STORY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New photo modal state
  const [newPhoto, setNewPhoto] = useState({
    url: '',
    caption: '',
    tag: 'Kitchen & Studio',
  });
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    async function loadStory() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'our_story')
          .maybeSingle();

        if (error) throw error;
        if (data && data.value) {
          const val = data.value as unknown as Partial<StoryContentData>;
          setStory({
            ...DEFAULT_STORY,
            ...val,
            story_paragraphs:
              val.story_paragraphs && val.story_paragraphs.length > 0
                ? val.story_paragraphs
                : DEFAULT_STORY.story_paragraphs,
            gallery: val.gallery || [],
          });
        }
      } catch (err) {
        console.warn('Failed to load story content:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStory();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('site_settings').upsert({
        key: 'our_story',
        value: story as any,
        is_public: true,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      showToast('Our Story & Photos saved successfully! ♥');
    } catch (err) {
      console.error('Failed to save story settings:', err);
      showToast('Error saving story settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'hero' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `story_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const filePath = `story/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const uploadedUrl = publicUrlData.publicUrl;

      if (target === 'hero') {
        setStory((prev) => ({ ...prev, hero_image: uploadedUrl }));
        showToast('Hero photo uploaded! Click "Save Changes" to publish.');
      } else {
        setNewPhoto((prev) => ({ ...prev, url: uploadedUrl }));
      }
    } catch (err) {
      console.error('Photo upload error:', err);
      showToast('Upload failed. Please check Supabase Storage permissions or use URL.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddParagraph = () => {
    setStory((prev) => ({
      ...prev,
      story_paragraphs: [...prev.story_paragraphs, ''],
    }));
  };

  const handleRemoveParagraph = (index: number) => {
    setStory((prev) => ({
      ...prev,
      story_paragraphs: prev.story_paragraphs.filter((_, i) => i !== index),
    }));
  };

  const handleParagraphChange = (index: number, val: string) => {
    setStory((prev) => {
      const updated = [...prev.story_paragraphs];
      updated[index] = val;
      return { ...prev, story_paragraphs: updated };
    });
  };

  const handleAddGalleryPhoto = () => {
    if (!newPhoto.url) {
      showToast('Please provide a photo URL or upload an image.');
      return;
    }

    const photoItem: StoryPhoto = {
      id: `photo_${Date.now()}`,
      url: newPhoto.url,
      caption: newPhoto.caption || 'Studio photograph',
      tag: newPhoto.tag || 'Gallery',
    };

    setStory((prev) => ({
      ...prev,
      gallery: [...prev.gallery, photoItem],
    }));

    setNewPhoto({ url: '', caption: '', tag: 'Kitchen & Studio' });
    setShowPhotoModal(false);
    showToast('Photo added to gallery! Remember to click "Save Changes".');
  };

  const handleRemoveGalleryPhoto = (id: string) => {
    setStory((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((p) => p.id !== id),
    }));
  };

  return (
    <div className="space-y-8">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-cream px-4 py-3 rounded-card shadow-lg text-xs font-sans flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Doodle name="heart" size={14} className="text-heart" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-hairline-b">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Our Story &amp; Photos Editor
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cream border border-hairline font-sans text-ink-soft">
              Saniya's Personal Space
            </span>
          </div>
          <p className="text-xs text-ink-soft mt-1">
            Control the text, founder story, and upload personal behind-the-scenes photos for the public Our Story page
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/our-story"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-pill border border-hairline bg-ivory text-xs font-sans font-medium text-ink hover:border-ink transition-colors flex items-center gap-1.5"
          >
            <span>View Live Page</span>
            <span>↗</span>
          </a>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave()}
            className="px-5 py-2 rounded-pill bg-ink text-cream hover:bg-heart transition-all text-xs font-sans font-medium uppercase tracking-button disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <Doodle name="bow" size={24} className="text-ink animate-bounce mx-auto" />
          <p className="text-xs font-sans text-ink-soft">Loading story content...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          {/* SECTION 1: PAGE HEADINGS & QUOTE */}
          <div className="p-6 bg-ivory rounded-card border border-hairline space-y-4">
            <h3 className="font-display text-lg font-semibold text-ink pb-2 border-hairline-b flex items-center gap-2">
              <Doodle name="sparkle" size={16} className="text-honey" />
              <span>Page Header &amp; Highlights</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-sans font-medium text-ink block mb-1">
                  Section Eyebrow
                </label>
                <input
                  type="text"
                  value={story.eyebrow}
                  onChange={(e) => setStory({ ...story, eyebrow: e.target.value })}
                  placeholder="OUR STORY"
                  className="w-full px-3 py-1.5 rounded border border-hairline bg-cream text-xs font-sans text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-xs font-sans font-medium text-ink block mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={story.instagram_handle}
                  onChange={(e) => setStory({ ...story, instagram_handle: e.target.value })}
                  placeholder="saylipss.co"
                  className="w-full px-3 py-1.5 rounded border border-hairline bg-cream text-xs font-mono text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-sans font-medium text-ink block mb-1">
                  Main Headline / Title
                </label>
                <input
                  type="text"
                  value={story.title}
                  onChange={(e) => setStory({ ...story, title: e.target.value })}
                  placeholder="From the Kitchen to Your Pocket"
                  className="w-full px-3 py-1.5 rounded border border-hairline bg-cream text-xs font-sans text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-sans font-medium text-ink block mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={story.subtitle}
                  onChange={(e) => setStory({ ...story, subtitle: e.target.value })}
                  placeholder="Homemade, organic lip care for every day."
                  className="w-full px-3 py-1.5 rounded border border-hairline bg-cream text-xs font-sans text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-sans font-medium text-ink block mb-1">
                  Founder Quote / Hook
                </label>
                <textarea
                  rows={2}
                  value={story.quote}
                  onChange={(e) => setStory({ ...story, quote: e.target.value })}
                  placeholder='"It started in a kitchen, with a few ingredients and one very dry pair of lips."'
                  className="w-full px-3 py-1.5 rounded border border-hairline bg-cream text-xs font-sans text-ink focus:outline-none focus:border-ink"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: SANIYA'S HERO PORTRAIT / WORKSHOP PHOTO */}
          <div className="p-6 bg-ivory rounded-card border border-hairline space-y-4">
            <h3 className="font-display text-lg font-semibold text-ink pb-2 border-hairline-b flex items-center gap-2">
              <Doodle name="bow" size={16} className="text-ink" />
              <span>Saniya's Featured Portrait / Workshop Hero</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Preview */}
              <div className="md:col-span-4 aspect-[4/3] rounded border border-hairline bg-cream flex items-center justify-center overflow-hidden relative">
                {story.hero_image ? (
                  <img
                    src={story.hero_image}
                    alt="Saniya Featured"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4 space-y-1">
                    <Doodle name="bow" size={32} className="text-ink/40 mx-auto" />
                    <p className="text-[11px] text-ink-soft">No hero photo set</p>
                    <p className="text-[9px] text-ink-soft/70">Placeholder bow renders on page</p>
                  </div>
                )}
              </div>

              {/* Upload & URL Controls */}
              <div className="md:col-span-8 space-y-3">
                <div>
                  <label className="text-xs font-sans font-medium text-ink block mb-1">
                    Upload Photo from Computer:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => handleFileUpload(e, 'hero')}
                    className="text-xs font-sans file:mr-3 file:py-1.5 file:px-3 file:rounded-pill file:border file:border-hairline file:bg-cream file:text-ink hover:file:bg-ivory cursor-pointer"
                  />
                  {uploading && (
                    <span className="text-[11px] text-ink-soft ml-2 animate-pulse">Uploading...</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-sans font-medium text-ink block mb-1">
                    Or Enter Image URL:
                  </label>
                  <input
                    type="url"
                    value={story.hero_image}
                    onChange={(e) => setStory({ ...story, hero_image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 rounded border border-hairline bg-cream text-xs font-mono text-ink focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="text-xs font-sans font-medium text-ink block mb-1">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={story.hero_caption}
                    onChange={(e) => setStory({ ...story, hero_caption: e.target.value })}
                    placeholder="Saniya in her kitchen studio hand-pouring organic balms"
                    className="w-full px-3 py-1.5 rounded border border-hairline bg-cream text-xs font-sans text-ink focus:outline-none focus:border-ink"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: SANIYA'S FOUNDER STORY (PARAGRAPHS) */}
          <div className="p-6 bg-ivory rounded-card border border-hairline space-y-4">
            <div className="flex items-center justify-between pb-2 border-hairline-b">
              <h3 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
                <Doodle name="heart" size={16} className="text-heart" />
                <span>The Authentic Founder Story Text</span>
              </h3>
              <button
                type="button"
                onClick={handleAddParagraph}
                className="px-3 py-1 rounded-pill bg-cream border border-hairline text-ink hover:border-ink text-xs font-sans font-medium"
              >
                + Add Paragraph
              </button>
            </div>

            <p className="text-xs text-ink-soft">
              Write Saniya's authentic story. Each block below forms a distinct paragraph on the Our Story page.
            </p>

            <div className="space-y-3">
              {story.story_paragraphs.map((p, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="font-mono text-xs text-ink-soft pt-2 w-6 shrink-0">
                    #{idx + 1}
                  </span>
                  <textarea
                    rows={3}
                    value={p}
                    onChange={(e) => handleParagraphChange(idx, e.target.value)}
                    placeholder={`Paragraph ${idx + 1}...`}
                    className="flex-grow px-3 py-2 rounded border border-hairline bg-cream text-xs font-sans text-ink leading-relaxed focus:outline-none focus:border-ink"
                  />
                  {story.story_paragraphs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveParagraph(idx)}
                      className="p-1.5 text-ink-soft hover:text-heart text-xs"
                      title="Remove paragraph"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: FREE SPACE FOR SANIYA'S PHOTO GALLERY */}
          <div className="p-6 bg-ivory rounded-card border border-hairline space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-hairline-b">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
                  <Doodle name="sparkle" size={16} className="text-honey" />
                  <span>Saniya's Behind-the-Scenes Photo Gallery</span>
                </h3>
                <p className="text-xs text-ink-soft">
                  Upload photos of raw ingredients, pots on the stove, packaging station, handwritten notes, or events.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="px-4 py-2 rounded-pill bg-ink text-cream hover:bg-heart transition-all text-xs font-sans font-medium uppercase tracking-button self-start sm:self-auto"
              >
                + Add Photo to Gallery
              </button>
            </div>

            {story.gallery.length === 0 ? (
              <div className="p-8 text-center bg-cream/50 rounded border border-hairline space-y-2">
                <Doodle name="heart" size={24} className="text-heart mx-auto opacity-60" />
                <p className="text-xs font-medium text-ink">No gallery photos added yet</p>
                <p className="text-[11px] text-ink-soft max-w-sm mx-auto">
                  Click "+ Add Photo to Gallery" above to upload photos showcasing Saniya's craft and homemade process.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {story.gallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-cream rounded border border-hairline overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-subtle transition-all"
                  >
                    <div className="aspect-[4/3] w-full bg-ivory overflow-hidden relative">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {photo.tag && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-ivory/90 backdrop-blur-sm border border-hairline text-[9px] font-sans uppercase font-semibold text-ink">
                          {photo.tag}
                        </span>
                      )}
                    </div>

                    <div className="p-3 flex items-start justify-between gap-2">
                      <p className="text-xs font-sans text-ink line-clamp-2">
                        {photo.caption}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryPhoto(photo.id)}
                        className="text-ink-soft hover:text-heart text-xs p-1"
                        title="Remove photo"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Save Bar */}
          <div className="sticky bottom-4 z-20 bg-ivory/95 backdrop-blur-md p-4 rounded-card border border-hairline shadow-lg flex items-center justify-between">
            <span className="text-xs text-ink-soft">
              Changes will immediately reflect on the public Our Story page
            </span>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-pill bg-ink text-cream hover:bg-heart transition-all text-xs font-sans font-medium uppercase tracking-button shadow-sm disabled:opacity-50"
            >
              {saving ? 'Publishing...' : 'Save & Publish Story ♥'}
            </button>
          </div>
        </form>
      )}

      {/* Modal: Add Gallery Photo */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ivory border-hairline rounded-card max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-hairline-b">
              <h3 className="font-display text-lg font-semibold text-ink">
                Add Photo to Saniya's Gallery
              </h3>
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="text-ink-soft hover:text-ink text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-sans font-medium text-ink block mb-1">
                  Upload Image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => handleFileUpload(e, 'gallery')}
                  className="text-xs font-sans file:mr-3 file:py-1.5 file:px-3 file:rounded-pill file:border file:border-hairline file:bg-cream file:text-ink hover:file:bg-ivory cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-sans font-medium text-ink block mb-1">
                  Or Image URL:
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newPhoto.url}
                  onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-hairline bg-cream text-xs font-mono text-ink focus:outline-none focus:border-ink"
                />
              </div>

              {newPhoto.url && (
                <div className="aspect-[4/3] rounded border border-hairline overflow-hidden bg-cream">
                  <img src={newPhoto.url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="text-xs font-sans font-medium text-ink block mb-1">
                  Caption / Description:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hand-pouring honey butter balm into silver slider tins"
                  value={newPhoto.caption}
                  onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-hairline bg-cream text-xs font-sans text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-xs font-sans font-medium text-ink block mb-1">
                  Photo Tag / Category:
                </label>
                <select
                  value={newPhoto.tag}
                  onChange={(e) => setNewPhoto({ ...newPhoto, tag: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-hairline bg-cream text-xs font-sans text-ink focus:outline-none focus:border-ink"
                >
                  <option value="Kitchen & Studio">Kitchen & Studio</option>
                  <option value="Making Balms">Making Balms</option>
                  <option value="Raw Ingredients">Raw Ingredients</option>
                  <option value="Packaging Station">Packaging Station</option>
                  <option value="Saniya">Founder / Saniya</option>
                  <option value="Pop-up & Events">Pop-up & Events</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(false)}
                  className="px-4 py-2 rounded-pill border border-hairline text-xs font-sans text-ink-soft hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddGalleryPhoto}
                  className="px-5 py-2 rounded-pill bg-ink text-cream hover:bg-heart text-xs font-sans font-medium uppercase tracking-button"
                >
                  Add Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
