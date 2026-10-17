import { supabase } from './supabase';

/**
 * Resizes and compresses an image file before upload
 */
export async function compressImage(file: File, maxDimension = 1600, quality = 0.88): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    reader.onerror = (err) => reject(err);

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(file);
          }
        },
        'image/webp',
        quality
      );
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a product image to Supabase Storage ('product-images' bucket)
 */
export async function uploadProductImage(file: File, folder = 'products'): Promise<string> {
  // Enforce 5MB limit
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image size exceeds 5MB limit. Please choose a smaller photo.');
  }

  // Compress to WebP
  const compressedBlob = await compressImage(file);

  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
  const filePath = `${folder}/${Date.now()}-${cleanName}.webp`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, compressedBlob, {
      contentType: 'image/webp',
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Removes an image from Supabase Storage given its public URL
 */
export async function deleteStorageImage(publicUrl: string): Promise<boolean> {
  try {
    const url = new URL(publicUrl);
    const pathParts = url.pathname.split('product-images/');
    if (pathParts.length < 2) return false;
    const filePath = decodeURIComponent(pathParts[1]);

    const { error } = await supabase.storage.from('product-images').remove([filePath]);
    return !error;
  } catch {
    return false;
  }
}
