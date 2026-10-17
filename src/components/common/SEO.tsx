import React, { useEffect } from 'react';
import { Product } from '@/types/product';
import { getSiteUrl, toAbsoluteUrl } from '@/lib/site';

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: 'website' | 'product';
  canonical?: string;
  product?: Product;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Say By Saniya | Homemade Organic Lip Balm',
  description = 'Handmade, 100% organic lip balms and tints in pocket-sized tins. Strawberry Jam, Honey Butter, Vanilla Silk. Nourish. Tint. Love.',
  ogImage = '/og-image.png',
  ogType = 'website',
  canonical,
  product,
}) => {
  useEffect(() => {
    // 1. Page Title
    document.title = title;

    const siteUrl = getSiteUrl();
    const absoluteOgImage = toAbsoluteUrl(ogImage);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const absoluteCanonical = canonical ? toAbsoluteUrl(canonical) : `${siteUrl}${currentPath}`;

    // 2. Meta Tags Helper
    const setMetaTag = (attrName: string, attrVal: string, contentVal: string) => {
      let meta = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrVal);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', contentVal);
    };

    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', absoluteOgImage);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', absoluteCanonical);
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', absoluteOgImage);

    // 3. Canonical Link
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', absoluteCanonical);

    // 4. JSON-LD Structured Data
    const scriptId = 'sbs-json-ld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Say By Saniya',
      url: siteUrl,
      logo: toAbsoluteUrl('/favicon.svg'),
      sameAs: ['https://instagram.com/saylipss.co'],
      description: 'Homemade, 100% organic lip care for every day.',
    };

    if (product) {
      const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.shortDescription,
        sku: product.id,
        image: absoluteOgImage,
        brand: {
          '@type': 'Brand',
          name: 'Say By Saniya',
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: product.price > 0 ? (product.price / 100).toFixed(0) : '0',
          availability:
            product.status === 'available'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/PreOrder',
          url: `${siteUrl}/product/${product.slug}`,
        },
      };
      script.textContent = JSON.stringify([orgSchema, productSchema]);
    } else {
      script.textContent = JSON.stringify(orgSchema);
    }
  }, [title, description, ogImage, ogType, canonical, product]);

  return null;
};
