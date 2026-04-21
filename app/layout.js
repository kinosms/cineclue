import './globals.css'

export const metadata = {

  metadataBase: new URL('https://cineclue-sable.vercel.app'),

  title: 'CineClue',

  description: '영알못은 들어오지 마세요',

  openGraph: {

    title: 'CineClue',

    description: '영알못은 들어오지 마세요',

    url: '/',

    siteName: 'CineClue',

    images: ['/og2.png'], // 🔥 이게 핵심

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