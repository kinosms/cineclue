'use client'

export default function CharacterScreen(props) {

  const {

    showSettings,

    setShowSettings,

    menuItems,

    users,

    CHARS,

    authUser,

    settingsPage,

    setSettingsPage,

    showMergeModal,

    setShowMergeModal,

    showNameModal,

    nickname,

    setNickname,

    setShowNameModal,

    handleCharClick,

    setShowLogin,

    logout,

    saveUsers,

    deleteUser,

    playClick,

    enterGame,

    saveNickname,

    setUsers,

    setSelChar,

    selChar,

    isGuestLockedChar

  } = props

  return (
    <div style={{
      width: '100%',
      background: '#fff',
      position: 'relative',
      display: 'flex',
      height: '100dvh',
      flexDirection: 'column',
      padding: '48px 0 40px',
      overflowY: 'auto'
    }}>
      <div style={{
        position: 'absolute',
        top: 20,
        right: 24,
        zIndex: 20
      }}>
        <button
          onClick={() => setShowSettings(true)}
          style={{
            width: 32,
            height: 32,
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0
          }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#b0aaa3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0A1.65 1.65 0 0 0 20.91 10H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
        {showSettings && (
          <>
            {/* 배경 클릭 닫기 */}
            <div
              onClick={() => setShowSettings(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.18)',
                zIndex: 90
              }}
            />
            {/* 메뉴 */}
            <div style={{
              position: 'absolute',
              top: 34,
              right: 0,
              width: 220,
              background: '#fff',
              border: '1px solid #ece8e2',
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              zIndex: 100,
              animation: 'menuFade .18s ease'
            }}>
              {menuItems.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (item === '로그인') {
                      setShowSettings(false)
                      const guestUser =
                        users.find(u => u.isGuest)
                      // 🔥 guest 진행중이면 승계 팝업
                      if (guestUser) {
                        setShowMergeModal(true)
                        return
                      }
                      // 🔥 그냥 로그인
                      setShowLogin(true)
                      return
                    }
                    if (item === '로그아웃') {
                      setShowSettings(false)
                      setTimeout(() => {

                        logout()

                      }, 0)
                      return
                    }
                    setSettingsPage(item)
                    setShowSettings(false)
                  }}
                  style={{
                    padding: '14px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#1a1814',
                    borderBottom: '1px solid #f3f0eb',
                    cursor: 'pointer',
                    background: '#fff'
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </>
        )}

        {settingsPage && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.28)',
            zIndex: 120,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>

            <div style={{
              width: '88%',
              maxWidth: 420,
              background: '#fff',
              borderRadius: 22,
              padding: '24px 20px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
              position: 'relative'
            }}>

              {/* 닫기 */}
              <button
                onClick={() => setSettingsPage(null)}
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  border: 'none',
                  background: 'transparent',
                  fontSize: '1.2rem',
                  color: '#999',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>

              {/* 제목 */}
              <div style={{
                fontSize: '1rem',
                fontWeight: 800,
                marginBottom: 18,
                color: '#1a1814'
              }}>
                {settingsPage}
              </div>

              {/* 내용 */}
              {settingsPage === '소개' && (
                <div style={{
                  fontSize: '0.82rem',
                  lineHeight: 1.8,
                  color: '#5f5a55'
                }}>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    marginBottom: 14,
                    color: '#1a1814'
                  }}>
                    CineCLUE
                  </div>

                  영화를 기억하는 방식은
                  제목보다 장면에 가깝습니다.

                  <br /><br />

                  CineCLUE는
                  장면의 단서를 통해 영화를 맞히는
                  영화 퀴즈 게임입니다.
                </div>
              )}

              {settingsPage === '게임 규칙' && (
                <div style={{
                  fontSize: '0.82rem',
                  lineHeight: 1.9,
                  color: '#5f5a55'
                }}>
                  <div style={{
                    borderTop: '1px solid #ece8e2',
                    margin: 15
                  }} />
                  • 주관식 모드 :
                  <br />
                  <div style={{ paddingLeft: 16 }}>
                    힌트 보기 중간에 한글자 또는 초성을 힌트로 제공합니다.
                    <br />
                    정답 입력시 영화제목 자동완성을 이용할 수 있습니다.
                    <br />
                    획득 점수는 100pt 부터 시작합니다.
                  </div>
                  • 객관식 모드 :
                  <br />
                  <div style={{ paddingLeft: 16 }}>
                    정답 선택은 2회까지 가능합니다.
                    <br />
                    획득 점수는 100pt 부터 시작합니다.
                  </div>
                  • 콤보 모드 :
                  <br />
                  <div style={{ paddingLeft: 16 }}>
                    연속3회 퀴즈를 맞출 경우 다음 문제부터 콤보모드가 발동됩니다.
                    <br />
                    첫 콤보모드시 점수X3, 최대 점수X3 까지 점수를 얻습니다.
                  </div>
                  <div style={{
                    borderTop: '1px solid #ece8e2',
                    margin: 15
                  }} />
                  • 목숨은 30개로 시작하고, 부활시 15개로 시작합니다.
                  <br />
                  • 캐릭터가 죽어도 랭킹에는 기록이 남습니다.
                  <br />
                  • 로그인 유저는
                  <br />
                  <div style={{ paddingLeft: 16 }}>
                    1. 전체 캐릭터, 전체 게임 모드 이용이 가능합니다.
                    <br />
                    2. 캐릭터가 죽을 경우 부활이 가능합니다.
                    <br />
                    3. 랭킹 화면에서 캐릭터를 누르면 프로필을 볼 수 있습니다.
                  </div>
                </div>
              )}

              {settingsPage === '이메일' && (
                <div style={{
                  fontSize: '0.82rem',
                  lineHeight: 1.8,
                  color: '#5f5a55'
                }}>
                  Contact Us
                  <br />
                  cinecluegame@gmail.com
                </div>
              )}

              {settingsPage === '개인정보 처리방침' && (
                <div style={{
                  fontSize: '0.82rem',
                  lineHeight: 1.9,
                  color: '#5f5a55'
                }}>
                  CineCLUE는 게임 진행을 위해 일부 데이터를 저장할 수 있습니다.
                  <br />
                  게스트 플레이의 경우 데이터는 브라우저 저장소에 저장될 수 있습니다.
                  <br /><br />
                  저장될 수 있는 정보 :
                  <br />
                  • 닉네임
                  <br />
                  • 게임 기록 및 점수
                  <br />
                  • 로그인 정보
                  <br />
                  <div style={{
                    borderTop: '1px solid #ece8e2',
                    margin: '18px 0'
                  }} />
                  CineCLUE는 서비스 및 광고를 위해 외부 서비스를 사용할 수 있습니다.
                  <br /><br />
                  사용될 수 있는 서비스:
                  <br />
                  • Supabase
                  <br />
                  • Vercel
                  <br />
                  • Google AdMob
                  <br />
                  • TMDB API
                </div>
              )}

              {settingsPage === '영화데이터 사용안내' && (
                <div style={{
                  fontSize: '0.82rem',
                  lineHeight: 1.9,
                  color: '#5f5a55'
                }}>
                  CineClue는 영화 정보 제공을 위해 TMDB(The Movie Database) API를 사용하고 있습니다.
                  <br />
                  일부 영화 포스터, 줄거리, 배우 및 영상 정보는 TMDB 데이터를 기반으로 제공됩니다.

                  <br />
                  <br />
                  This product uses the TMDB API but is not endorsed or certified by TMDB.
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}>
                    <img
                      src="/tmdb.webp"
                      alt="TMDB"
                      style={{
                        width: 80
                      }}
                    />
                  </div>
                </div>
              )}

              {settingsPage === '신고하기' && (
                <div style={{
                  fontSize: '0.82rem',
                  lineHeight: 1.8,
                  color: '#5f5a55'
                }}>
                  힌트오류 / 제목오류는 퀴즈화면 내 신고버튼을 이용해주세요. <br />
                  기타 신고사항은 이메일을 이용해주시기 바랍니다.
                </div>
              )}

            </div>
          </div>
        )}


      </div>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: '2.6rem', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1, color: '#1a1814' }}>
          Cine <span style={{ color: '#e8808c' }}>CLUE</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#b0aaa3', letterSpacing: '0.25em', marginTop: 8, textTransform: 'uppercase', fontWeight: 500 }}>
          Follow the clues
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#b0aaa3', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>
          캐릭터를 선택하세요
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
          {CHARS.map((c) => {
            const sel = selChar === c.id
            const u = users.find(x => x.charId === c.id)
            const locked = isGuestLockedChar(c)

            return (
              <div
                key={c.id}
                onClick={() => {
                  if (locked) {
                    setShowLogin(true)
                    return
                  }
                  handleCharClick(c.id)
                }}
                style={{
                  borderRadius: 18,
                  border: sel ? `3px solid ${c.color}` : '1.5px solid #e8e4dd',
                  background: sel ? `${c.color}18` : '#faf9f7',
                  padding: '16px 6px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  cursor: u?.isDead ? 'pointer' : 'pointer',
                  transition: 'all .18s cubic-bezier(.34,1.56,.64,1)',
                  boxShadow: sel ? `0 6px 22px ${c.color}50` : '0 1px 4px rgba(0,0,0,0.06)',
                  transform: sel && !u?.isDead ? 'scale(1.06)' : 'scale(1)',
                  position: 'relative',
                  opacity: locked ? 0.35 : 1,
                  filter: locked ? 'grayscale(1)' : 'none'
                }}>
                <div style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  opacity: u?.isDead ? 0.45 : 1,
                  filter: u?.isDead ? 'grayscale(100%)' : 'none',
                }}>
                  {sel && !locked && !u?.isDead && (
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: c.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 900 }}>✓</span>
                    </div>
                  )}
                  {locked && (
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      fontSize: '0.9rem'
                    }}>
                      🔒
                    </div>
                  )}
                  {!locked && u?.isDead && (
                    <div style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      zIndex: 5,
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))'
                    }}>
                      <svg width="28" height="65" viewBox="0 0 24 24">
                        {/* 무덤 */}
                        <path
                          d="M6 20V10C6 7 8 5 12 5C16 5 18 7 18 10V20H6Z"
                          fill="#aa9e9e"
                        />
                        {/* 십자가 세로 */}
                        <rect x="11" y="8" width="2" height="14" fill="#000000" />
                        {/* 십자가 가로 */}
                        <rect x="9" y="10" width="6" height="2" fill="#000000" />
                        {/* 바닥 */}
                        <rect x="5" y="20" width="14" height="2" fill="#717171" />
                      </svg>
                    </div>
                  )}
                  <svg viewBox="0 0 80 80" fill="none" style={{ width: 56, height: 56 }}>
                    {c.svg.props.children}
                  </svg>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: sel ? c.color : '#6f6e6e',
                    textAlign: 'center',
                    lineHeight: 1.3,
                  }}>
                    {!locked && u ? u.nickname : c.name}
                    <div style={{
                      fontSize: '0.6rem',
                      fontWeight: 500,
                      marginTop: 2,
                      color: '#72685e',
                      height: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {!locked && u ? (u.score || 0) : ' '}
                    </div>
                  </div>
                </div>
                {!locked && u && (authUser || !u.isDead) && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      if (u.isDead) {
                        // 🔥 부활 처리 (여기!)
                        setUsers(prev => {
                          const updated = prev.map(x => {
                            if (x.charId === c.id) {
                              return {
                                ...x,
                                lives: 15,       // 🔥 부활 시 10
                                isDead: false
                              }
                            }
                            return x
                          })
                          if (!authUser) {

                            saveUsers(updated)

                          }
                          return updated
                        })
                      } else {
                        deleteUser(c.id)
                      }
                    }}
                    style={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      fontSize: 11,
                      background: u.isDead ? '#e8808c' : '#b8b4ae',
                      color: '#ffffff',
                      borderRadius: 6,
                      padding: '2px 6px',
                      cursor: 'pointer',
                      zIndex: 10
                    }}>
                    {u.isDead ? '♥' : '✕'}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 입장하기 버튼 */}
        <button
          className="pressable"
          onClick={() => {
            playClick()
            enterGame()
          }}
          disabled={!users.find(u => u.charId === selChar)}
          style={{
            width: '100%',
            height: 54,
            borderRadius: 14,
            background: users.find(u => u.charId === selChar) ? '#ed4b5e' : '#bbbbbb',
            color: '#ffffff',
            fontSize: '0.8rem',
            fontWeight: 700,
            border: 'none',
            cursor: users.find(u => u.charId === selChar) ? 'pointer' : 'default'
          }}>
          입장하기
        </button>
      </div>

      {/* 로그인시 승계 모달 */}
      {showMergeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>

          <div style={{
            width: '86%',
            maxWidth: 360,
            background: '#fff',
            borderRadius: 22,
            padding: '24px 20px'
          }}>

            <div style={{
              fontSize: '1rem',
              fontWeight: 800,
              marginBottom: 16,
              color: '#1a1814'
            }}>
              로그인 후 시작하기
            </div>

            <div style={{
              fontSize: '0.82rem',
              lineHeight: 1.8,
              color: '#5f5a55',
              whiteSpace: 'pre-line'
            }}>
              현재 게스트 플레이 기록은
              로그인 시 삭제됩니다.
              <br />
              계속 이용하시겠습니까?
            </div>

            <div style={{
              display: 'flex',
              gap: 10,
              marginTop: 22
            }}>

              <button
                onClick={() => {
                  setShowMergeModal(false)
                }}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 12,
                  border: '1px solid #e7e1d8',
                  background: '#fff',
                  color: '#6f6e6e',
                  fontWeight: 700
                }}>
                취소
              </button>

              <button
                onClick={() => {
                  sessionStorage.removeItem(
                    'cineclue_guest_users'
                  )
                  setUsers([])
                  setSelChar(null)
                  setShowMergeModal(false)
                  setShowLogin(true)
                }}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 12,
                  border: 'none',
                  background: '#ed4b5e',
                  color: '#fff',
                  fontWeight: 700
                }}>
                로그인 하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 닉네임 입력 모달 */}
      {showNameModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            width: 300,
            background: '#fff',
            borderRadius: 16,
            padding: 20
          }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 10 }}>
              대화명 입력
            </div>

            <input
              value={nickname}
              onChange={(e) => {
                if (e.target.value.length <= 10) {
                  setNickname(e.target.value)
                }
              }}
              placeholder="최대 10자"
              style={{
                width: '100%',
                height: 44,
                borderRadius: 10,
                border: '1.5px solid #e8e4dd',
                padding: '0 12px',
                marginBottom: 12
              }} />

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => {
                  playClick()
                  setShowNameModal(false)
                }}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 10,
                  background: '#eee',
                  border: 'none'
                }}>
                취소
              </button>

              <button
                onClick={() => {
                  playClick()
                  saveNickname()
                }}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 10,
                  background: '#1a1814',
                  color: '#fff',
                  border: 'none'
                }}>
                완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
