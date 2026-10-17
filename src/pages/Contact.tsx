import React, { useState } from 'react';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Doodle } from '@/components/brand/Doodle';
import { SEO } from '@/components/common/SEO';
import { getWhatsAppNumber } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.message) {
      trackEvent('contact_submit');
      setSubmitted(true);
    }
  };

  const whatsappNumber = getWhatsAppNumber();

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Contact Us | Say By Saniya"
        description="Get in touch with Saniya for orders, questions about our organic ingredients, or custom batch gifting."
      />

      <Section
        bg="cream"
        eyebrow="REACH OUT"
        title="Say Hello to Saniya"
        subtitle="Questions about your order, ingredients, or custom party favors? We're always happy to chat."
        headerCentered={true}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Links & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-ivory rounded-card border-hairline shadow-subtle space-y-4">
              <span className="text-[10px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft">
                FASTEST RESPONSE
              </span>
              <h3 className="font-display text-xl font-semibold text-ink">
                Chat Directly on WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-ink-soft font-sans leading-relaxed">
                Need quick order status or want to pay via UPI? Message Saniya directly:
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill bg-ink text-cream text-xs uppercase tracking-button font-medium hover:bg-heart transition-all"
              >
                <span>Message on WhatsApp</span>
                <Doodle name="heart" size={12} className="text-cream" />
              </a>
            </div>

            <div className="p-6 bg-ivory rounded-card border-hairline space-y-3">
              <span className="text-[10px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft">
                COMMUNITY &amp; STORIES
              </span>
              <h4 className="font-display text-lg font-semibold text-ink">
                Instagram DMs
              </h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                Follow behind-the-scenes pours and drop teasers:
              </p>
              <a
                href="https://instagram.com/saylipss.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-ink underline hover:text-heart block transition-colors"
              >
                @saylipss.co →
              </a>
            </div>

            <div className="p-4 bg-cream/70 border border-hairline rounded flex items-center gap-2 text-xs text-ink-soft">
              <Doodle name="bow" size={16} className="text-ink" />
              <span>We usually reply within 24 hours ♥</span>
            </div>
          </div>

          {/* Right Column: Contact Form with Underline Inputs per DESIGN.md §7 */}
          <div className="lg:col-span-7 bg-ivory p-6 sm:p-10 rounded-card border-hairline shadow-subtle">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <Doodle name="heart" size={40} className="text-heart mx-auto" />
                <h3 className="font-display text-2xl font-semibold text-ink">
                  Message Sent!
                </h3>
                <p className="text-sm text-ink-soft font-sans max-w-sm mx-auto">
                  Message sent. Saniya will get back to you soon ♥
                </p>
                <div className="pt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', contact: '', message: '' });
                    }}
                  >
                    Send Another Note
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft mb-1"
                  >
                    Your Name:
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="E.g. Priya Sharma"
                    className="w-full bg-transparent border-b border-ink py-2 text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-heart transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact"
                    className="block text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft mb-1"
                  >
                    Email or WhatsApp Number:
                  </label>
                  <input
                    id="contact"
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    placeholder="E.g. priya@example.com or +91 98765 43210"
                    className="w-full bg-transparent border-b border-ink py-2 text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-heart transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-[11px] font-sans font-medium uppercase tracking-eyebrow text-ink-soft mb-1"
                  >
                    How Can We Help?
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us what you're looking for or ask any question about ingredients..."
                    className="w-full bg-transparent border-b border-ink py-2 text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-heart transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <Button variant="primary" size="md" fullWidth type="submit">
                    Send Message to Saniya ♥
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};
