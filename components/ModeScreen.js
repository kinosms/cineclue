'use client'
import { playSound } from '../library/audioManager'


export default function ModeScreen(props) {

  const {

    setQuizMode,

    quizMode,

    ERA_MODES,

    selGrade,

    isGuestLocked,

    toggleGrade,

    THEME_MODES,

    setShowLogin,

    loading,

    loadMovies,

    setScreen,

    authUser,

    posterCount,

    setCollectionReturnScreen,

    setToastMessage,

    showAppToast

  } = props

  return (
    <div>
      <div style={{
        width: '100%',
        background: '#fff',
        position: 'relative',
        display: 'flex',
        height: '100dvh',
        flexDirection: 'column',
        padding: '40px 0 40px',
        overflowY: 'auto'

      }}>

        <div style={{ padding: '0 20px', flexShrink: 0 }}>


          {/* 컬렉션 */}
          <div style={{

            display:'flex',

            alignItems:'center',

            justifyContent:'space-between',

            marginBottom:18,

            paddingLeft:4,

            gap:10

          }}>

            <div style={{

              fontSize:'0.72rem',

              fontWeight:700,

              color:'#6f6e6e',

              letterSpacing:'0.12em'

            }}>
              도전할 모드를 선택하세요.
            </div>

            {/* RIGHT */}

              <div style={{

                display:'flex',

                alignItems:'center',

                gap:8

              }}>

                {/* 트로피 */}

                <button
                  onClick={() => {

                  showAppToast('준비중입니다')

                }}

                  style={{

                    height:34,

                    padding:'0 14px',

                    borderRadius:999,

                    border:'1px solid #e5ddd5',

                    background:'#fff',

                    fontSize:'0.72rem',

                    fontWeight:800,

                    color:'#5f5a55',

                    display:'flex',

                    alignItems:'center',

                    gap:7,

                    boxShadow:'0 1px 2px rgba(0,0,0,0.03)'

                  }}

                >

                  🏆 0

                </button>

                {/* 컬렉션 */}

                <button

                  onClick={() => {

                    playSound('click')

                    if (!authUser) {

                      showAppToast('로그인 후 이용이 가능합니다')

                      return

                    }

                    setCollectionReturnScreen('grade')

                    setScreen('collection')

                  }}

                  style={{

                    height:34,

                    padding:'0 14px',

                    borderRadius:999,

                    border:'1px solid #e5ddd5',

                    background:'#fff',

                    fontSize:'0.72rem',

                    fontWeight:800,

                    color:'#5f5a55',

                    display:'flex',

                    alignItems:'center',

                    gap:7,

                    boxShadow:'0 1px 2px rgba(0,0,0,0.03)'

                  }}

                >

                  🎬 컬렉션

                </button>

              </div>

            </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button
              onClick={() => {
                playSound('click')
                setQuizMode('subjective')
              }}
              style={{
                flex: 1,
                height: 40,
                borderRadius: 10,
                background: quizMode === 'subjective' ? '#414141' : '#eee',
                color: quizMode === 'subjective' ? '#fff' : '#6f6e6e',
                fontWeight: 700
              }}>
              주관식
            </button>
            <button
              onClick={() => {
                playSound('click')
                setQuizMode('objective')
              }}
              style={{
                flex: 1,
                height: 40,
                borderRadius: 10,
                background: quizMode === 'objective' ? '#414141' : '#eee',
                color: quizMode === 'objective' ? '#fff' : '#6f6e6e',
                fontWeight: 700
              }}>
              객관식
            </button>
          </div>


          {/* 스크롤 영역 */}

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px 5px 5px'
          }}>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap: 10,
              marginBottom: 16
            }}>
              {ERA_MODES.map(m => {
                const sel = selGrade === m.key
                const locked = isGuestLocked(m)
                return (
                  <div
                    key={m.key}
                    onClick={() => {
                      if (locked) {
                        showAppToast('로그인 후 이용이 가능합니다')
                        return
                      }
                      playSound('modeclick')
                      toggleGrade(m.key)
                    }}
                    style={{
                      aspectRatio: '1.5 / 1',
                      borderRadius: 16,
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: 'pointer',
                      opacity: locked ? 0.35 : 1,
                      filter: locked ? 'grayscale(1)' : 'none',
                      transform: sel ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: sel
                        ? '0 6px 18px rgba(0,0,0,0.2)'
                        : '0 2px 6px rgba(0,0,0,0.08)'
                    }}>
                    <img
                      src={m.image}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }} />
                    {sel && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        border: '3px solid rgba(255, 0, 0, 0.9)',
                        borderRadius: 16,
                        pointerEvents: 'none'
                      }} />
                    )}
                  </div>
                )
              })}
            </div>
            {/* 🔥 테마 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap: 10,
            }}>
              {THEME_MODES.map(m => {
                const sel = selGrade === m.key
                const locked = isGuestLocked(m)
                return (
                  <div
                    key={m.key}
                    onClick={() => {
                      if (locked) {
                        setShowLogin(true)
                        return
                      }
                      playSound('modeclick')
                      toggleGrade(m.key)
                    }}
                    style={{
                      aspectRatio: '1.5 / 1',
                      borderRadius: 16,
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: 'pointer',
                      opacity: locked ? 0.35 : 1,
                      filter: locked ? 'grayscale(1)' : 'none',
                      transform: sel ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: sel
                        ? '0 6px 18px rgba(0,0,0,0.2)'
                        : '0 2px 6px rgba(0,0,0,0.08)'
                    }}>
                    <img
                      src={m.image}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }} />
                    {sel && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        border: '3px solid rgba(255, 0, 0, 0.9)',
                        borderRadius: 16,
                        pointerEvents: 'none'
                      }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* 버튼 영역 */}
          <div style={{
            padding: '20px 0 0',
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            flexShrink: 0,
            background: '#fff'
          }}>

            {/* 퀴즈시작 버튼 */}
            <button
              
              style={{
                flex: 1,
                height: 54,
                borderRadius: 14,
                background: selGrade !== null && !loading ? '#ed4b5e' : '#d4d0cc',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                cursor: selGrade !== null && !loading ? 'pointer' : 'default'
              }}
              disabled={selGrade === null || loading}
              onClick={() => {
                if (selGrade === null || loading) return
                playSound('click')
                loadMovies()
              }}>

              {loading ? '로딩 중...' : '퀴즈시작'}
            </button>

            {/* 뒤로가기 버튼 */}
            <button
              
              style={{
                flex: 1,
                height: 54,
                borderRadius: 12,
                background: 'transparent',
                color: '#6e6e6e',
                fontSize: '0.8rem',
                fontWeight: 500,
                border: '1.5px solid #e8e4dd',
                cursor: 'pointer'
              }}
              onClick={() => {
                playSound('click')
                setScreen('char')
              }}>
              캐릭터 선택 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}