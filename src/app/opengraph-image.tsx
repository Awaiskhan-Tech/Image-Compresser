import { ImageResponse } from 'next/og';

export const alt =
  'Webistic Image Compressor — compress JPG, PNG and WebP images to exact KB and MB targets';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '66px 76px',
          background: 'linear-gradient(135deg, #0b1220 0%, #14243d 58%, #101827 100%)',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -100,
            top: -210,
            width: 570,
            height: 570,
            borderRadius: 285,
            border: '2px solid rgba(96,165,250,0.16)',
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 15,
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 35,
              fontWeight: 800,
            }}
          >
            W
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 23, fontWeight: 700, letterSpacing: 1.2 }}>
              WEBISTIC
            </div>
            <div style={{ fontSize: 14, color: '#a9bdd8', letterSpacing: 2.4 }}>
              IMAGE COMPRESSOR
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: 690, gap: 22 }}>
            <div
              style={{
                display: 'flex',
                color: '#93c5fd',
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: 3,
              }}
            >
              FREE ONLINE IMAGE COMPRESSION
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: 61,
                lineHeight: 1.12,
                fontWeight: 800,
                letterSpacing: -2,
              }}
            >
              <span>Compress images.</span>
              <span style={{ color: '#60a5fa' }}>Hit your exact size.</span>
            </div>
            <div style={{ fontSize: 23, color: '#c4d2e5', lineHeight: 1.5 }}>
              JPG, PNG and WebP · Exact KB and MB targets
            </div>
          </div>

          <div
            style={{
              width: 265,
              height: 235,
              borderRadius: 24,
              border: '1px solid rgba(147,197,253,0.25)',
              background: 'rgba(255,255,255,0.07)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 25,
              gap: 17,
            }}
          >
            <div style={{ fontSize: 15, color: '#93c5fd', letterSpacing: 2, fontWeight: 700 }}>
              SET YOUR TARGET
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 38, fontWeight: 800 }}>KB</div>
              <div style={{ fontSize: 20, color: '#93a9c5' }}>or</div>
              <div style={{ fontSize: 38, fontWeight: 800 }}>MB</div>
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.18)', display: 'flex' }} />
            <div style={{ fontSize: 17, color: '#c4d2e5' }}>
              Process images in your browser
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.16)',
            paddingTop: 22,
            color: '#b6c7dc',
            fontSize: 18,
          }}
        >
          <span>Fast. Private. Easy.</span>
          <span>webisticimagecompressor.online</span>
        </div>
      </div>
    ),
    { ...size },
  );
}