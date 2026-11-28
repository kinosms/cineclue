'use client'
import { playSound } from '../library/audioManager'
import SettingsMenu from './SettingsMenu'
import { useRef } from 'react'

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
    showAppToast, 
    showSettings,
    setShowSettings,
    menuItems,
    settingsPage,
    setSettingsPage,
    logout,
    bgmOn,
    setBgmOn,
    sfxOn,
    setSfxOn,
    screen
  } = props

  const startingRef = useRef(false)

async function handleModeStart(m) {

  if (loading || startingRef.current) return

  if (isGuestLocked(m)) {

    showAppToast('로그인 후 이용 가능합니다')

    return

  }

  startingRef.current = true

  try {

    playSound('modeclick')

    setQuizMode('objective')

    toggleGrade(m.key)

    await loadMovies(m.key)

  } finally {

    startingRef.current = false

  }

}

  return (
    <div>
      <div style={{

        width: '100%',

        background: '#242628',

        position: 'relative',

        display: 'flex',

        height: '100dvh',

        flexDirection: 'column',

        padding: '40px 0 0',

        boxSizing: 'border-box',

        overflow: 'hidden'

      }}>

        <div style={{

          padding: '0 20px',

          flex: 1,

          minHeight: 0,

          display: 'flex',

          flexDirection: 'column'

        }}>

          {/* 컬렉션 */}
          <div style={{

            display:'flex',

            alignItems:'center',

            justifyContent:'space-between',

            marginBottom:30,

            flexShrink: 0,

            paddingLeft:4,

            gap:10

          }}>

            <div style={{

              fontSize:'0.72rem',

              fontWeight:700,

              color:'#b8b8b8',

              letterSpacing:'0.12em'

            }}>
              도전할 모드를 선택하세요.
            </div>

            {/* RIGHT */}

              <div style={{

                display:'flex',

                alignItems:'center',

                gap:20

              }}>

                {/* 트로피 */}
<button
  aria-label="트로피"
  onClick={() => {
    showAppToast('준비중입니다')
  }}
  style={{
    position: 'relative',
    width: 46,
    height: 46,
    padding: 0,
    border: 'none',
    background: 'transparent',
    flexShrink: 0,
    cursor: 'pointer'
  }}
>
  <img
    src="/icons/trophy.webp"
    alt=""
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    }}
  />

  {/* 트로피 획득 개수 */}
  <span style={{
    position: 'absolute',
    right: -2,
    bottom: 0,
    minWidth: 18,
    height: 18,
    padding: '0 3px',
    boxSizing: 'border-box',
    borderRadius: 999,
    background: '#C62828',
    border: '1px solid #FFD36A',
    color: '#FFFFFF',
    fontSize: '0.65rem',
    fontWeight: 900,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    0
  </span>
</button>

                {/* 컬렉션 */}
<button
  aria-label="컬렉션"
  onClick={() => {
    playSound('click')

    if (!authUser) {
      showAppToast('로그인 후 이용 가능합니다')
      return
    }

    setCollectionReturnScreen('grade')
    setScreen('collection')
  }}
  style={{
    width: 58,
    height: 46,
    padding: 0,
    border: 'none',
    background: 'transparent',
    flexShrink: 0,
    cursor: 'pointer'
  }}
>
  <img
    src="/icons/collection.webp"
    alt=""
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    }}
  />
</button>

                  <SettingsMenu

                    showSettings={showSettings}

                    setShowSettings={setShowSettings}

                    menuItems={menuItems}

                    settingsPage={settingsPage}

                    setSettingsPage={setSettingsPage}

                    setShowLogin={setShowLogin}

                    logout={logout}

                    bgmOn={bgmOn}

                    setBgmOn={setBgmOn}

                    sfxOn={sfxOn}

                    setSfxOn={setSfxOn}

                    screen={screen}

                  />

              </div>

            </div>

          {/* 게임모드 스크롤 영역 */}
          <div style={{
            flex: '1 1 0px',
            minHeight: 0,
            height: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            padding: '5px 0 calc(24px + env(safe-area-inset-bottom))'
          }}>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 12
            }}>

              {[...THEME_MODES, ...ERA_MODES].map(m => {
                const locked = isGuestLocked(m)

                return (
                  <button
                    key={m.key}
                    aria-label={m.label || m.key}
                    disabled={loading}
                    onClick={() => handleModeStart(m)}
                    style={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      borderRadius: 10,
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: loading ? 'default' : 'pointer',
                      opacity: locked ? 0.35 : 1,
                      filter: locked ? 'grayscale(1)' : 'none',
                      padding: 0,
                      border: 'none',
                      background: 'transparent',
                      boxShadow: '0 3px 8px rgba(0,0,0,0.25)'
                    }}
                  >
                    <img
                      src={m.image}
                      alt={m.label || m.key}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block'
                      }}
                    />
                  </button>
                )
              })}

            </div>
          </div>


          
        </div>
      </div>
    </div>
  )
}