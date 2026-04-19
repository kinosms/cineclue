import './globals.css'

export const metadata = {
  title: 'CineClue',
  description: '영알못은 들어오지마세요',
  openGraph: {
    title: 'CineClue',
    description: '영알못은 들어오지마세요',
    url: 'https://cineclue-sable.vercel.app/',
    siteName: 'CineClue',
    images: [
      {
        url: 'https://cineclue-sable.vercel.app/og.png',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
}

// 🔥 이거 추가
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <div className="app-wrap">
          <div className="app-inner">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}