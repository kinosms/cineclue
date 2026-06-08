import './globals.css'
import Script from 'next/script'


export const metadata = {

  metadataBase: new URL('https://cine-clue.com'),

  title: 'CineClue',

  description: '영화 좀 안다는 사림이면 도전! 영화 장면 힌트로 영화를 맞히는 영화 퀴즈 게임 CineClue',

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  verification: {

    google: 'N3XQxCylHXzYW5jko5Y820-IeNsoV5fmVmce4zDPfIc'
     },

  openGraph: {

    title: 'CineClue - 영화 퀴즈, 영화 맞추기 게임',

    description: '영화 좀 안다는 사림이면 도전! 영화 장면 힌트로 영화를 맞히는 영화 퀴즈 게임 CineClue',

    url: "https://cineclue.app",

    siteName: 'CineClue',

    images: [      
      {

        url: "/og-image.png",

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
      <head>
        <meta
          name="naver-site-verification"
          content="005987edffa23f6c64fef9066b57a5f9e5da3ded"
        />
      </head>
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