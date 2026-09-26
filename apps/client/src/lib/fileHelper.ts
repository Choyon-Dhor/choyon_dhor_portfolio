export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const render = (dim: number, q: number): string => {
          let { width, height } = img;
          if (width > dim || height > dim) {
            if (width > height) {
              height = Math.round((height * dim) / width);
              width = dim;
            } else {
              width = Math.round((width * dim) / height);
              height = dim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');
          if (!ctx) return src;

          // If JPEG, fill white background to avoid black background on transparent pixels
          const isPng = file.type === 'image/png';
          if (!isPng) {
            ctx.fillStyle = '#0a0a0c';
            ctx.fillRect(0, 0, width, height);
          }
          ctx.drawImage(img, 0, 0, width, height);

          // WebP supports both transparency and lossy compression (tiny size ~80-150KB)
          let out = '';
          try {
            out = canvas.toDataURL('image/webp', q);
            if (!out.startsWith('data:image/webp')) {
              out = canvas.toDataURL('image/jpeg', q);
            }
          } catch {
            out = canvas.toDataURL('image/jpeg', q);
          }
          return out || src;
        };

        // Standard optimization: 1200px max, 0.82 quality (~80-200 KB)
        let result = render(1200, 0.82);
        // Safeguard for Vercel 4.5MB payload limit: if Base64 > 1MB, scale to 800px 0.75
        if (result.length > 1024 * 1024) {
          result = render(800, 0.75);
        }
        resolve(result);
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
