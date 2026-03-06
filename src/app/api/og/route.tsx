import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#000',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            backgroundImage:
              'linear-gradient(rgba(39,39,42,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(39,39,42,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glow effect */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
          }}
        />

        {/* Top bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            zIndex: 1,
          }}
        >
          {/* Protocol badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid #27272a',
              padding: '8px 20px',
              fontSize: '14px',
              color: '#71717a',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 12px #22c55e',
                display: 'flex',
              }}
            />
            BSV-21 PoW20
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'baseline',
              gap: '16px',
            }}
          >
            PATH402
          </div>

          <div
            style={{
              fontSize: '20px',
              color: '#52525b',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
              display: 'flex',
            }}
          >
            Network Explorer
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              gap: '2px',
              marginTop: '32px',
            }}
          >
            {[
              { label: 'MAX SUPPLY', value: '21,000,000' },
              { label: 'ALGORITHM', value: 'SHA-256' },
              { label: 'MINING', value: 'Proof of Indexing' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '16px 40px',
                  background: 'rgba(9,9,11,0.8)',
                  border: '1px solid #1c1c1e',
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    color: '#52525b',
                    letterSpacing: '0.15em',
                    marginBottom: '6px',
                    display: 'flex',
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    color: '#a1a1aa',
                    fontFamily: 'monospace',
                    display: 'flex',
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '13px',
            color: '#3f3f46',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
          }}
        >
          402network.online
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
