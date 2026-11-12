/**
 * Generates rich synthetic image files client-side for immediate demo & testing.
 * Styled using the 3-color palette: Charcoal (#25282B), Sand (#E8DFC9), and Electric Blue (#2563FF).
 */

export interface SampleImageMeta {
  title: string;
  category: string;
  width: number;
  height: number;
  mime: string;
  filename: string;
}

export const SAMPLE_PRESETS: SampleImageMeta[] = [
  {
    title: 'Applicant Portrait Photo',
    category: 'Job / Portal Upload',
    width: 1200,
    height: 1600,
    mime: 'image/jpeg',
    filename: 'applicant_portrait_photo.jpg',
  },
  {
    title: 'High-Res Hero Landscape',
    category: 'Website Banner',
    width: 2560,
    height: 1440,
    mime: 'image/jpeg',
    filename: 'web_hero_landscape.jpg',
  },
  {
    title: 'Product Graphic (Transparent)',
    category: 'E-commerce Asset',
    width: 1200,
    height: 1200,
    mime: 'image/png',
    filename: 'product_badge_transparent.png',
  },
];

export async function createSampleFile(sample: SampleImageMeta): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = sample.width;
  canvas.height = sample.height;
  const ctx = canvas.getContext('2d')!;

  const isPng = sample.mime === 'image/png';

  if (!isPng) {
    // Charcoal to Electric Blue background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, sample.width, sample.height);
    bgGradient.addColorStop(0, '#25282B');
    bgGradient.addColorStop(0.5, '#25282B');
    bgGradient.addColorStop(1, '#2563FF');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, sample.width, sample.height);
  } else {
    // Transparent PNG background with an Electric Blue to Charcoal central badge
    ctx.clearRect(0, 0, sample.width, sample.height);
    const centerGrad = ctx.createRadialGradient(
      sample.width / 2,
      sample.height / 2,
      50,
      sample.width / 2,
      sample.height / 2,
      sample.width * 0.45
    );
    centerGrad.addColorStop(0, '#2563FF');
    centerGrad.addColorStop(1, '#25282B');

    ctx.fillStyle = centerGrad;
    ctx.beginPath();
    ctx.arc(sample.width / 2, sample.height / 2, sample.width * 0.42, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw texture circles in Sand and Electric Blue with opacities
  ctx.save();
  for (let i = 0; i < 45; i++) {
    const x = (i * 137) % sample.width;
    const y = (i * 219) % sample.height;
    const r = 40 + ((i * 31) % 180);

    ctx.fillStyle = i % 2 === 0 ? 'rgba(232, 223, 201, 0.12)' : 'rgba(37, 99, 255, 0.18)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Draw high contrast typographic elements in Sand (#E8DFC9)
  ctx.fillStyle = '#E8DFC9';
  ctx.font = `bold ${Math.round(sample.width * 0.045)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(sample.title, sample.width / 2, sample.height * 0.45);

  ctx.fillStyle = 'rgba(232, 223, 201, 0.85)';
  ctx.font = `500 ${Math.round(sample.width * 0.024)}px sans-serif`;
  ctx.fillText(
    `${sample.category} · ${sample.width} × ${sample.height} px · Webistic Engine`,
    sample.width / 2,
    sample.height * 0.54
  );

  // Decorative border in Sand with opacity
  ctx.strokeStyle = 'rgba(232, 223, 201, 0.35)';
  ctx.lineWidth = Math.round(sample.width * 0.008);
  ctx.strokeRect(
    sample.width * 0.05,
    sample.height * 0.05,
    sample.width * 0.9,
    sample.height * 0.9
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        const file = new File([blob!], sample.filename, {
          type: sample.mime,
          lastModified: Date.now(),
        });
        resolve(file);
      },
      sample.mime,
      0.96
    );
  });
}
