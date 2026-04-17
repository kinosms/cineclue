export const metadata = { title: 'CineClue', description: '영화 힌트 퀴즈' }
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{margin:0,padding:0,background:'#080808',fontFamily:'system-ui,sans-serif',color:'#ede8de'}}>
        {children}
      </body>
    </html>
  )
}
