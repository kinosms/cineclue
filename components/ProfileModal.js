'use client'

import MovieFlipCard from './MovieFlipCard'

export default function ProfileModal(props) {

  const {
    showProfile,
    setShowProfile,
    movieCard,
    showMovieCard,
    setShowMovieCard,
    movieCardFlipped,
    setMovieCardFlipped,
    profileUser,
    profileStats,
    animateStats,
    LEVEL_TITLES,
    recommendStatus,
    loadingDots,
    openMovieRecommend,
    showRecommendModal,
    setShowRecommendModal,
    recommendMovie,
    setTrailerKey,
    CharAvatar,
    setScreen,
    currentUser,
    skipResultAnimation,
    setSkipResultAnimation,
    setCollectionReturnScreen
  } = props



  if (!showProfile) return null

  return (
    <>
      {/* 🔥 프로필 팝업 */}
      {showProfile && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99
        }}>
          <div style={{
            transform: 'scale(0.88)',
            transformOrigin: 'center center'
          }}>
            <div style={{
              width: '92vw',
              maxWidth: 420,
              maxHeight: '88vh',
              overflowY: 'auto',
              background: '#faf9f7',
              borderRadius: 20,
              border: '1.5px solid #e8e4dd',
              padding: '20px 16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              position: 'relative'
            }}>
              {/* 닫기 */}
              <div
                onClick={() => setShowProfile(false)}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: '#f5f3ef',
                  border: '1px solid #e8e4dd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                <span style={{
                  color: '#1a1814',
                  fontSize: 16,
                  fontWeight: 700
                }}>
                  ×
                </span>
              </div>


              {/* 상단텍스트 영역 */}
              <div style={{
                textAlign: 'center',
                marginBottom: 7
              }}>

                {/* 작은 라벨 */}
                <div style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.24em',
                  color: '#b8b1a8',
                  fontWeight: 700,
                  marginBottom: 8
                }}>
                  CINECLUE TITLE
                </div>

                {/* 🔥 점수 기반 계산 */}
                {(() => {

                  const displayScore =
                    profileUser?.score ??
                    currentUser?.score ??
                    user?.score ??
                    0

                  const displayLevel =
                    Math.floor(displayScore / 50000) + 1

                  const displayCurrentExp =
                    displayScore % 50000

                  const displayLevelPercent =
                    Math.round(
                      (displayCurrentExp / 50000) * 100
                    )

                  return (
                    <>

                      {/* 타이틀 */}
                      <div style={{
                        fontSize: '1.6rem',
                        fontWeight: 900,
                        color: '#1a1814',
                        letterSpacing: '-0.04em',
                        lineHeight: 1.08
                      }}>
                        {LEVEL_TITLES[
                          Math.min(displayLevel, 100)
                        ]}
                      </div>

                      {/* 닉네임 */}
                      <div style={{
                        fontSize: '0.9rem',
                        color: '#8d857c',
                        marginTop: 10,
                        fontWeight: 600
                      }}>
                        {profileUser?.nickname || currentUser?.nickname || '-'}
                      </div>

                      {/* 레벨바 영역 */}
                      <div style={{
                        marginBottom: 15,
                        marginTop: 13
                      }}>

                        <div style={{
                          fontSize: '1.0rem',
                          fontWeight: 900,
                          color: '#1a1814',
                          textAlign: 'left',
                          marginBottom: 6
                        }}>

                          Lv. {displayLevel}

                        </div>

                        <div style={{
                          height: 8,
                          background: '#ece9e4',
                          borderRadius: 999,
                          marginTop: 10,
                          overflow: 'hidden'
                        }}>

                          <div style={{
                            width: `${displayLevelPercent}%`,
                            height: '100%',
                            background:
                              'linear-gradient(90deg,#ff8a95,#ff5f73)',
                            borderRadius: 999,
                            boxShadow: '0 0 12px rgba(255,95,115,0.35)'
                          }} />

                        </div>

                        <div style={{
                          fontSize: '0.72rem',
                          color: '#888',
                          textAlign: 'right',
                          marginTop: 6,
                          fontWeight: 600
                        }}>
                          {displayCurrentExp.toLocaleString()}
                          {' '}
                          / 50,000 EXP
                        </div>
                      </div>

                      {/* 그래프 영역 */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 7,
                        marginBottom: 7
                      }}>
                        {[
                          [
                            '총 점수',
                            displayScore.toLocaleString()
                          ],
                          [
                            '플레이 시간',
                            `${Math.floor((profileStats?.totalSeconds || 0) / 3600)}h ${Math.floor(
                              ((profileStats?.totalSeconds || 0) % 3600) / 60
                            )
                            }m`
                          ],
                          [
                            '선호 장르',
                            profileStats?.favoriteGenres?.[0] || '-'
                          ],
                          [
                            '최근 플레이',
                            profileStats?.lastPlayed
                              ? new Date(profileStats.lastPlayed)
                                .toLocaleDateString('ko-KR')
                              : '-'
                          ]
                        ].map(([k, v], i) => (
                          <div
                            key={i}
                            style={{
                              background: '#fff',
                              border: '1px solid #ece7df',
                              borderRadius: 14,
                              padding: '12px 12px'
                            }}>
                            <div style={{
                              fontSize: '0.66rem',
                              color: '#999',
                              marginBottom: 5,
                              fontWeight: 600
                            }}>
                              {k}
                            </div>
                            <div style={{
                              fontSize: '1rem',
                              fontWeight: 800,
                              color: '#1a1814',
                              lineHeight: 1.3
                            }}>
                              {v}
                            </div>
                          </div>
                        ))}
                      </div>

                    </>
                  )

                })()}
              </div>


              {/* 장르숙련도  영역*/}
              <div style={{
                background: '#fff',
                border: '1px solid #ece7df',
                borderRadius: 18,
                padding: '14px 14px'
              }}>

                {/* 헤더 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12
                }}>
                  <div>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: 900,
                      color: '#1a1814'
                    }}>
                      🎬 장르 숙련도
                    </div>
                    <div style={{
                      fontSize: '0.68rem',
                      color: '#999',
                      marginTop: 2
                    }}>
                      정답 기록 기반 영화 성향 분석
                    </div>
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#ff5f73'
                  }}>
                    TOP 3
                  </div>
                </div>

                {/* 리스트 */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}>
                  {[...(profileStats?.genreStats || [])]
                    .sort((a, b) =>
                      b.percent - a.percent
                    )
                    .slice(0, 3)
                    .map((g, i) => {
                      let rankLabel = 'BEGINNER'
                      if (g.percent >= 80) {
                        rankLabel = 'MASTER'
                      } else if (g.percent >= 60) {
                        rankLabel = 'EXPERT'
                      } else if (g.percent >= 40) {
                        rankLabel = 'ADVANCED'
                      } else if (g.percent >= 20) {
                        rankLabel = 'INTERMEDIATE'
                      }
                      return (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10
                          }}>

                          {/* 장르명 */}
                          <div style={{
                            width: 82,
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#1a1814',
                            flexShrink: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {g.genre}
                          </div>

                          {/* 바 */}
                          <div style={{
                            flex: 1,
                            height: 8,
                            background: '#f1efeb',
                            borderRadius: 999,
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: '100%',
                              height: '100%',
                              background:
                                'linear-gradient(90deg,#ff8a95,#ff5f73)',
                              borderRadius: 999,
                              boxShadow:
                                '0 0 10px rgba(255,95,115,0.35)',
                              transformOrigin: 'left center',
                              transform:
                                animateStats
                                  ? `scaleX(${g.percent / 100})`
                                  : 'scaleX(0)',
                              transition:
                                `transform 0.8s cubic-bezier(.22,.61,.36,1) ${i * 0.08}s`
                            }} />
                          </div>

                          {/* 퍼센트 */}
                          <div style={{
                            width: 40,
                            textAlign: 'right',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            color: '#ff5f73',
                            flexShrink: 0
                          }}>
                            {g.percent}%
                          </div>

                          {/* 티어 */}
                          <div style={{
                            width: 86,
                            height: 24,
                            borderRadius: 999,
                            border: '1px solid #ece7df',
                            background: '#faf8f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            color:
                              rankLabel === 'MASTER'
                                ? '#ff8a00'
                                : rankLabel === 'EXPERT'
                                  ? '#ff5f73'
                                  : rankLabel === 'ADVANCED'
                                    ? '#7c63ff'
                                    : '#7f8a99'
                          }}>
                            {rankLabel}
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>




              <div style={{

                display: 'flex',

                gap: 10,

                marginTop: 7

              }}>


              {/* 추천 영화 */}

              <button

                onClick={openMovieRecommend}

                style={{

                  flex: 1,

                  border: '1px solid #ece4dc',

                  background: '#fff',

                  borderRadius: 18,

                  padding: '16px 14px',

                  display: 'flex',

                  flexDirection: 'column',

                  alignItems: 'flex-start',

                  cursor: 'pointer'

                }}>

                <div style={{

                  fontSize: '0.85rem',

                  fontWeight: 800,

                  color: '#1a1814',

                  marginBottom: 5

                }}>

                  🔍 추천 영화

                </div>

                <div style={{

                  fontSize: '0.68rem',

                  color: '#9b9389',

                  fontWeight: 600,

                  lineHeight: 1.4,

                  textAlign: 'left'

                }}>

                  장르 성향 기반 추천

                </div>

              </button>

              {/* 컬렉션 */}

                <button

                  onClick={(e) => {

                    e.stopPropagation()

                    setCollectionReturnScreen('result')

                    setScreen('collection')

                    setTimeout(() => {

                      setShowProfile(false)

                    }, 0)

                  }}

                style={{

                  flex: 1,

                  border: '1px solid #ece4dc',

                  background: '#fff',

                  borderRadius: 18,

                  padding: '16px 14px',

                  display: 'flex',

                  flexDirection: 'column',

                  alignItems: 'flex-start',

                  cursor: 'pointer'

                }}>

                <div style={{

                  fontSize: '0.85rem',

                  fontWeight: 800,

                  color: '#1a1814',

                  marginBottom: 5

                }}>

                  📚 컬렉션

                </div>

                <div style={{

                  fontSize: '0.68rem',

                  color: '#9b9389',

                  fontWeight: 600,

                  lineHeight: 1.4,

                  textAlign: 'left'

                }}>

                  열어본 영화 보관함

                </div>

              </button>
              </div>
            </div>

          </div>

        </div>

      )}

      {showRecommendModal && recommendMovie && (
        <div
          onClick={() =>
            setShowRecommendModal(false)
          }
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.22)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24
          }}>

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 320,
              borderRadius: 24,
              background: '#fff',
              padding: 18,
              boxShadow: '0 18px 48px rgba(0,0,0,0.18)'
            }}>

            {/* 🎬 버튼 */}
            {recommendMovie?.youtubeKey && (
              <div style={{
                position: 'absolute',
                top: 14,
                right: 14,
                zIndex: 5
              }}>

                <div onClick={() => {
                  setTrailerKey(recommendMovie.youtubeKey)
                }}

                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.9)',
                    border: '1px solid #ece7df',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.05rem',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
                  }}>
                  🎬
                </div>
              </div>
            )}



            {/* 포스터 카드 재사용 */}
            <div style={{
              textAlign: 'center'
            }}>

              {/* 포스터 */}
              <img
                src={`https://image.tmdb.org/t/p/w500${recommendMovie.poster_path}`}
                alt=""
                style={{
                  width: '60%',
                  maxWidth: 220,
                  borderRadius: 18,
                  marginBottom: 10,
                  boxShadow: '0 14px 34px rgba(0,0,0,0.18)'
                }} />


              {/* 제목 */}
              <div style={{
                fontSize: '1.18rem',
                fontWeight: 900,
                color: '#1a1814',
                lineHeight: 1.3,
                marginBottom: 8
              }}>

                {recommendMovie.title}
              </div>


              {/* 평점 */}
              <div style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#ff5f73',
                marginBottom: 10
              }}>
                ★ {Number(recommendMovie.vote_average).toFixed(1)} / 10
              </div>


              {/* 감독 */}
              <div style={{
                fontSize: '0.8rem',
                color: '#666',
                marginBottom: 2,
                lineHeight: 1.5
              }}>

                감독 · {
                  recommendMovie.credits?.crew
                    ?.find(p => p.job === 'Director')
                    ?.name || '-'
                }
              </div>


              {/* 배우 */}
              <div style={{
                fontSize: '0.8rem',
                color: '#666',
                marginBottom: 15,
                lineHeight: 1.5
              }}>

                출연 · {
                  recommendMovie.credits?.cast
                    ?.slice(0, 3)
                    ?.map(a => a.name)
                    ?.join(' · ')
                  || '-'
                }
              </div>


              {/* 시놉시스 */}
              <div style={{
                fontSize: '0.7rem',
                color: '#666',
                lineHeight: 1.75,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>

                {recommendMovie.overview}
              </div>
            </div>
          </div>
        </div>
      )}


     
    </>
  )
}