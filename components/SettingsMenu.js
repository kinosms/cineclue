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
            width: 35,
            height: 35,
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0
          }}>
          <img

            src="/icons/settings.webp"

            alt="설정"

            style={{

              width: 30,

              height: 30,

              objectFit: 'contain'

            }}

          />
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
                  <strong>• 기본 규칙</strong>

    <div style={{ paddingLeft: 16, marginBottom: 12 }}>

      한 라운드는 5문제로 구성됩니다.

      <br />

      힌트를 적게 사용할수록 높은 점수를 획득합니다.

      <br />

      정답 선택은 최대 2회까지 가능합니다.

      <br />

      오답 또는 문제를 넘기면 목숨이 차감됩니다.

    </div>

    <strong>• 콤보 모드</strong>

    <div style={{ paddingLeft: 16, marginBottom: 12 }}>

      3문제 연속 정답 시 콤보 모드가 발동됩니다.

      <br />

      연속 정답에 따라 최대 5배의 점수를 획득합니다.

    </div>

    <strong>• 목숨과 부활</strong>

    <div style={{ paddingLeft: 16, marginBottom: 12 }}>

      목숨을 모두 소진하면 게임이 종료됩니다.

      <br />

      부활을 통해 게임을 계속할 수 있습니다.

    </div>

    <div style={{

      borderTop: '1px solid #ece8e2',

      margin: 15

    }} />

    <strong>• 포스터 컬렉션</strong>

    <div style={{ paddingLeft: 16, marginBottom: 12 }}>

      정답을 맞히면 영화 포스터를 획득합니다.

      <br />

      다양한 게임 모드를 통해 컬렉션을 채워보세요.

    </div>

    <strong>• 랭킹 및 프로필</strong>

    <div style={{ paddingLeft: 16 }}>

      누적 점수와 최고 연속 정답 기록에 도전하세요.

      <br />

      프로필에서 레벨, 칭호, 장르별 숙련도를 확인할 수 있습니다.
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
