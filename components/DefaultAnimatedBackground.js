'use client'

export default function DefaultAnimatedBackground() {
  return (
    <>
      <style>{`
        @keyframes defaultBgFlow {
          0%, 100% {
            background-position: 0% 0%, 100% 30%, 0% 0%;
          }
          50% {
            background-position: 100% 40%, 0% 0%, 100% 100%;
          }
        }

        @keyframes defaultBgColor {
          0% {
            filter: hue-rotate(0deg) saturate(1);
          }
          25% {
            filter: hue-rotate(-35deg) saturate(.85);
          }
          50% {
            filter: hue-rotate(-125deg) saturate(.65);
          }
          75% {
            filter: hue-rotate(-185deg) saturate(.75);
          }
          100% {
            filter: hue-rotate(-360deg) saturate(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .default-bg-flow {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="default-bg-flow"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          backgroundColor: '#F7EBDD',
          backgroundImage: `
            radial-gradient(
              ellipse at 25% 30%,
              rgba(211,158,91,.38),
              transparent 50%
            ),
            radial-gradient(
              ellipse at 70% 45%,
              rgba(255,255,255,.85),
              transparent 45%
            ),
            url('/skins/default/background.webp')
          `,
          backgroundSize: '140% 140%, 140% 140%, 125% 125%',
          backgroundPosition: '0% 0%, 100% 100%, center',
          backgroundRepeat: 'no-repeat',
          animation: 'defaultBgFlow 14s ease-in-out infinite, defaultBgColor 24s ease-in-out infinite'
        }}
      />
    </>
  )
}