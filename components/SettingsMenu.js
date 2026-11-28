'use client'

import { useEffect, useState } from 'react'
import { App } from '@capacitor/app'
import {
  playSound,
  playBgm,
  setBgmEnabled,
  setSfxEnabled
} from '../library/audioManager'

export default function SettingsMenu(props) {

  const {
    showSettings,
    setShowSettings,
    menuItems,
    settingsPage,
    setSettingsPage,
    setShowLogin,
    logout,
    bgmOn,
    setBgmOn,
    sfxOn,
    setSfxOn,
    screen
  } = props

  const [appVersion, setAppVersion] = useState('1.0.3')
  const [buildNumber, setBuildNumber] = useState('4')

  useEffect(() => {
    async function loadVersionInfo() {
      try {
        if (window.Capacitor?.isNativePlatform?.()) {
          const info = await App.getInfo()
          setAppVersion(info.version)
          setBuildNumber(info.build)
        }
      } catch (e) {
        console.error('version info error', e)
      }
    }

    loadVersionInfo()
  }, [])

    return (
      <div style={{

        position: 'relative',

        flexShrink: 0,

        display: 'flex',

        alignItems: 'center',

        zIndex: 20

      }}>
        <button
          onClick={() => {
            playSound('click')
            setShowSettings(true)}}
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

                    fontWeight: item === '프로필' ? 800 : 600,

                    color: item === '프로필' ? '#ff3fa9' : '#1a1814',

                    borderTop: 'none',

                    borderRadius: 0,

                    borderBottom: '1px solid #f3f0eb',

                    cursor: 'pointer',

                    margin: 0,

                    width: '100%',

                    background: '#fff',

                    boxSizing: 'border-box'

                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </>
        )}

        {settingsPage && settingsPage !== '프로필' && (
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
                onClick={() => {
                  setSettingsPage(null)}}
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
                    획득 점수는 1000pt 부터 시작합니다.
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
                    콤보모드시 점수X3, 최대 점수X5 까지 점수를 얻습니다.
                  </div>
                  <div style={{
                    borderTop: '1px solid #ece8e2',
                    margin: 15
                  }} />
                  • 목숨은 20개로 시작하고, 부활시 10개로 시작합니다.
                  <br />
                  • 앱 로그인 유저는
                  <br />
                  <div style={{ paddingLeft: 16 }}>
                    1. 전체 캐릭터, 전체 게임 모드 이용이 가능합니다.
                    <br />
                    2. 캐릭터가 죽을 경우 부활이 가능합니다.
                    <br />
                    3. 프로필 정보와 기록 관리를 할 수 있습니다.
                    <br />
                    4. 영화 포스터 컬렉션을 이용할 수 있습니다.
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
                  문제 오류는 퀴즈화면 내 신고버튼을 이용해주세요. <br />
                  기타 신고사항은 이메일을 이용해주시기 바랍니다.
                </div>
              )}


              {settingsPage === '설정' && (
                <div style={{
                  fontSize: '0.82rem',
                  color: '#5f5a55'
                }}>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 20
                  }}>

                    {/* 사운드 */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 800,
                        marginBottom: 14,
                        color: '#1a1814'
                      }}>
                        사운드
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 22
                      }}>
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <input
                            type="radio"
                            name="bgm"
                            checked={bgmOn}
                            onChange={() => {
                              setBgmOn(true)
                              setBgmEnabled(true)

                              if (screen === 'result') {
                                playBgm('resultBgm', 0.25)
                              } else if (screen !== 'intro') {
                                playBgm('mainBgm', 0.25)
                              }
                            }}
                          />
                          ON
                        </label>

                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <input
                            type="radio"
                            name="bgm"
                            checked={!bgmOn}
                            onChange={() => {
                              setBgmOn(false)
                              setBgmEnabled(false)
                            }}
                          />
                          OFF
                        </label>
                      </div>
                    </div>

                    {/* 효과음 */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 800,
                        marginBottom: 14,
                        color: '#1a1814'
                      }}>
                        효과음
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 22
                      }}>
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <input
                            type="radio"
                            name="sfx"
                            checked={sfxOn}
                            onChange={() => {
                              setSfxOn(true)
                              setSfxEnabled(true)
                            }}
                          />
                          ON
                        </label>

                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <input
                            type="radio"
                            name="sfx"
                            checked={!sfxOn}
                            onChange={() => {
                              setSfxOn(false)
                              setSfxEnabled(false)
                            }}
                          />
                          OFF
                        </label>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {settingsPage === '버전정보' && (
                <div style={{
                  fontSize: '0.82rem',
                  lineHeight: 1.8,
                  color: '#5f5a55'
                }}>

                  버전 : v{appVersion}
                  <br /><br />
                    • 신고하기 팝업 오류 개선
                    <br />
                    • 일반모드 스킨 추가
                    <br />
                    • 호러모드 스킨 추가
                    <br />
                    • 호러모드 BGM 추가
                        <br /><br />

                    <div style={{

                      fontSize: '0.72rem',

                      color: '#999'

                    }}>

                      Build : {buildNumber}

                    </div>
                </div>
              )}

            </div>

          </div>

        )}

      </div>

    )

}
