import './globals.css'
import Script from 'next/script'

export const metadata = {

  metadataBase: new URL('https://cineclue-gilt.vercel.app'),

  title: 'CineClue',

  description: '영화 좀 안다는 사림이면 도전!',

  openGraph: {

    title: 'CineClue',

    description: '영화 좀 안다는 사림이면 도전!',

    url: '/',

    siteName: 'CineClue',

    images: ['/og.png'], // 🔥 이게 핵심

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
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9833499589161859"
     crossorigin="anonymous"></script>
        <div className="app-wrap">
          <div className="app-inner">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}