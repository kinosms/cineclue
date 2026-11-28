'use client'

import MovieFlipCard from './MovieFlipCard'
import { playSound, pauseBgmForVideo } from '../library/audioManager'

export default function ProfileModal(props) {

  const {
    showProfile,
    setShowProfile,
    setToastMessage,
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
    setCollectionReturnScreen,
    authUser,
    setCollectionTargetUserId,
    showAppToast
  } = props

const genreColors = {

  '드라마': ['#8BA8FF', '#536EDB'],

  '액션': ['#FFBD70', '#F07828'],

  '미스터리/스릴러': ['#8795BA', '#495777'],

  '코미디': ['#FFD96A', '#E6A321'],

  '공포': ['#FF7896', '#E92D50'],

  '로맨스': ['#FF94D5', '#EC3C98'],

  '애니메이션': ['#BCA0FF', '#8653E8'],

  'SF액션': ['#48DFFF', '#F07828'],

  '판타지': ['#B58AFF', '#7141D8'],

  'SF': ['#48E4FF', '#009DCB'],

  '액션코미디': ['#FFD96A', '#F07828'],

  'SF공포': ['#32C5A2', '#B91C46'],

  '판타지액션': ['#B58AFF', '#F07828'],

  'SF판타지': ['#48C6FF', '#8653E8'],

  '판타지공포': ['#B58AFF', '#B91C46']

}

const genreImages = {

  '드라마': '/profile/genres/drama.webp',

  '액션': '/profile/genres/action.webp',

  '미스터리/스릴러': '/profile/genres/thriller.webp',

  '코미디': '/profile/genres/comedy.webp',

  '공포': '/profile/genres/horror.webp',

  '로맨스': '/profile/genres/romance.webp',

  '애니메이션': '/profile/genres/animation.webp',

  'SF액션': '/profile/genres/sf_action.webp',

  '판타지': '/profile/genres/fantasy.webp',

  'SF': '/profile/genres/sf.webp',

  '액션코미디': '/profile/genres/action_comedy.webp',

  'SF공포': '/profile/genres/sf_horror.webp',

  '판타지액션': '/profile/genres/fantasy_action.webp',

  'SF판타지': '/profile/genres/sf_fantasy.webp',

  '판타지공포': '/profile/genres/fantasy_horror.webp'

}

  if (!showProfile) return null

  return (
    <>
     <style>{`
        @keyframes profileBgFlow {
        0%, 100% {
          background-position: 0% 0%, 100% 100%, 0% 0%;
        }
        50% {
          background-position: 100% 100%, 0% 0%, 100% 100%;
        }
      }
        @media (prefers-reduced-motion: reduce) {
          @keyframes profileBgFlow {
            0%, 100% {
              background-position: 0% 0%, 100% 100%, center;
            }
          }
        }
      `}</style>

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
              maxWidth: 460,
              maxHeight: '88vh',
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollbarWidth: 'none',
              boxSizing: 'border-box',
              backgroundColor: '#F7F5FC',
              backgroundImage: `
                radial-gradient(ellipse at 20% 20%, rgba(190,120,255,.16), transparent 55%),
                radial-gradient(ellipse at 80% 80%, rgba(70,190,255,.15), transparent 55%),
                url('/profile/background.webp')
              `,
              backgroundSize: '160% 160%, 160% 160%, 115% 115%',
              backgroundPosition: '0% 0%, 100% 100%, center',
              backgroundRepeat: 'no-repeat',
              animation: 'profileBgFlow 18s ease-in-out infinite',
              borderRadius: 24,
              border: '1.5px solid #FFFFFF',
              padding: '22px 16px',
              boxShadow: '0 12px 40px rgba(30,25,65,.22)',
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
                  fontSize: '0.65rem',

                  letterSpacing: '0.28em',

                  color: '#858097',

                  fontWeight: 700,

                  marginBottom: 10
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
                        fontSize: '1.8rem',
                        fontWeight: 900,
                        color: '#191925',
                        letterSpacing: '-0.05em',
                        lineHeight: 1.15
                      }}>
                        {LEVEL_TITLES[
                          Math.min(displayLevel, 100)
                        ]}
                      </div>

                      {/* 닉네임 */}
                      <div style={{
                        fontSize: '0.95rem',
                        color: '#555574',
                        marginTop: 8,
                        fontWeight: 600
                      }}>
                        {profileUser?.nickname || currentUser?.nickname || '-'}
                      </div>

                      {/* 레벨바 영역 */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          marginTop: 18,
                          marginBottom: 12,
                          padding: '12px 14px',
                          borderRadius: 16,
                          border: '1px solid #C9B9ED',
                          background: 'rgba(255,255,255,.48)'
                        }}>

                          {/* 레벨 */}
                          <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 900,
                            fontStyle: 'italic',
                            letterSpacing: '-0.06em',
                            background: 'linear-gradient(135deg,#C83CEB,#5143C8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            whiteSpace: 'nowrap',
                            flexShrink: 0, 
                            paddingRight: 8,
                            paddingLeft: 2,
                            lineHeight: 1.3,
                          }}>
                            Lv. {displayLevel}
                          </div>

                          {/* EXP 영역 */}
                          <div style={{
                            flex: 1,
                            minWidth: 0
                          }}>

                            <div style={{
                              fontSize: '0.68rem',
                              fontWeight: 600,
                              color: '#555574',
                              textAlign: 'right',
                              marginBottom: 6,
                              whiteSpace: 'nowrap'
                            }}>
                              {displayCurrentExp.toLocaleString()} / 50,000 EXP
                            </div>

                            {/* 게이지 배경 */}
                            <div style={{
                              height: 10,
                              background: '#DFDDE9',
                              borderRadius: 999,
                              overflow: 'hidden'
                            }}>

                              {/* 게이지 컬러 */}
                              <div style={{
                                width: `${displayLevelPercent}%`,
                                height: '100%',
                                borderRadius: 999,
                                background: `
                                  linear-gradient(
                                    90deg,
                                    #C34AF5 0%,
                                    #8555FF 28%,
                                    #408CFF 58%,
                                    #00D9EF 100%
                                  )
                                `,
                                transition: 'width 0.8s ease'
                              }} />

                            </div>
                          </div>
                        </div>

                      {/* 그래프 영역 */}
                      <div style={{
                        display: 'grid',

                        gridTemplateColumns: '1fr 1fr 1fr 1.3fr',

                        gap: 0,

                        marginBottom: 14,

                        padding: '14px 4px',

                        border: '1px solid #D1C7E9',

                        borderRadius: 16,

                        background: 'rgba(255,255,255,.55)'
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

                            ? new Date(

                                /(?:Z|[+-]\d{2}:\d{2})$/i.test(profileStats.lastPlayed)

                                  ? profileStats.lastPlayed

                                  : `${profileStats.lastPlayed}Z`

                              ).toLocaleDateString('ko-KR', {

                                timeZone: 'Asia/Seoul'

                              })

                            : '-'

                        ]
                        ].map(([k, v], i) => (

                        <div

                          key={i}

                          style={{

                            minWidth: 0,

                            padding: '2px 3px',

                            textAlign: 'center',

                            borderRight: i < 3

                              ? '1px solid #DAD6E7'

                              : 'none'

                          }}

                        >

                          <div style={{

                            fontSize: '0.62rem',

                            color: '#77758A',

                            marginBottom: 8,

                            fontWeight: 600,

                            whiteSpace: 'nowrap'

                          }}>

                            {k}

                          </div>

                          <div style={{

                            fontSize: i === 3 ? '0.68rem' : '0.9rem',

                            fontWeight: 800,

                            color: '#292940',

                            lineHeight: 1.3,

                            overflowWrap: 'anywhere'

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


              {/* 장르숙련도 영역 */}
              <div style={{
                border: '1px solid #C9B9ED',
                borderRadius: 18,
                background: 'rgba(255,255,255,.65)',
                overflow: 'hidden'
              }}>

                {/* 헤더 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 12px',
                  background: 'linear-gradient(110deg,#F1E5FC,#E9EDFC)',
                  borderBottom: '1px solid #E2D9F0',
                  gap: 8
                }}>

                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7
                    }}>

                      {/* 그래프 아이콘 */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: 2,
                        height: 16
                      }}>
                        {[6, 11, 16].map((h, i) => (
                          <span key={i} style={{
                            width: 4,
                            height: h,
                            borderRadius: 1,
                            background: [
                              '#D44CF5',
                              '#A16AFF',
                              '#5978FF'
                            ][i]
                          }} />
                        ))}
                      </div>

                      <span style={{
                        fontSize: '0.95rem',
                        fontWeight: 900,
                        color: '#25243B'
                      }}>
                        장르 숙련도
                      </span>
                    </div>

                    <div style={{
                      fontSize: '0.65rem',
                      color: '#858098',
                      marginTop: 4,
                      fontWeight: 500
                    }}>
                      정답 기록 기반 영화 성향 분석
                    </div>
                  </div>

                  {/* TOP 3 */}
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: 900,
                    color: '#963CF0',
                    whiteSpace: 'nowrap'
                  }}>
                    TOP 3
                  </div>
                </div>

                {/* 장르 리스트 */}
                <div style={{
                  padding: '4px 12px'
                }}>

                  {[...(profileStats?.genreStats || [])]
                    .sort((a, b) => b.percent - a.percent)
                    .slice(0, 3)
                    .map((g, i) => {

                      const [lightColor, darkColor] =
                        genreColors[g.genre] ||
                        ['#BCA0FF', '#805BD8']

                      const genreImage = genreImages[g.genre]

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

                      const rankColors = {
                        BEGINNER: ['#F0EDF7', '#C9C1DE', '#62577F'],
                        INTERMEDIATE: ['#E5F2FF', '#A5C7F5', '#3765A3'],
                        ADVANCED: ['#EEE5FF', '#BCA1F2', '#7950C4'],
                        EXPERT: ['#FFE9EF', '#F3A3BA', '#C54070'],
                        MASTER: ['#FFF1CF', '#E7C471', '#A47720']
                      }

                      const [rankBg, rankBorder, rankText] =
                        rankColors[rankLabel]

                      return (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 7,
                            padding: '10px 0',
                            borderBottom: i < Math.min(
                              profileStats?.genreStats?.length || 0,
                              3
                            ) - 1
                              ? '1px solid #E5E0EE'
                              : 'none'
                          }}
                        >

                          {/* 장르 대표 이미지 */}

                          <div style={{

                            width: 42,

                            height: 42,

                            flexShrink: 0,

                            overflow: 'hidden',

                            background: 'transparent',

                            display: 'flex',

                            alignItems: 'center',

                            justifyContent: 'center'

                          }}>

                            {genreImage && (

                              <img

                                src={genreImage}

                                alt={g.genre}

                                style={{

                                  width: '100%',

                                  height: '100%',

                                  objectFit: 'contain',

                                  filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.15))'

                                }}

                              />

                            )}

                          </div>

                          {/* 장르명 */}
                          <div style={{
                            width: 60,
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            color: '#25243B',
                            flexShrink: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {g.genre}
                          </div>

                          {/* 게이지 */}
                          <div style={{
                            flex: 1,
                            minWidth: 0,
                            height: 9,
                            background: '#E1DFEA',
                            borderRadius: 999,
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: animateStats
                                ? `${Math.max(0, Math.min(100, g.percent))}%`
                                : '0%',
                              height: '100%',
                              background: `linear-gradient(
                                90deg,
                                ${lightColor},
                                ${darkColor}
                              )`,
                              borderRadius: 999,
                              transition: `width 0.8s
                                cubic-bezier(.22,.61,.36,1)
                                ${i * 0.08}s`
                            }} />
                          </div>

                          {/* 퍼센트 */}
                          <div style={{
                            width: 34,
                            textAlign: 'right',
                            fontSize: '0.8rem',
                            fontWeight: 900,
                            color: darkColor,
                            flexShrink: 0
                          }}>
                            {g.percent}%
                          </div>

                          {/* 숙련도 등급 */}
                          <div style={{
                            width: 84,
                            height: 24,
                            borderRadius: 999,
                            border: `1px solid ${rankBorder}`,
                            background: rankBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.58rem',
                            fontWeight: 800,
                            color: rankText,
                            flexShrink: 0
                          }}>
                            {rankLabel}
                          </div>

                        </div>
                      )
                    })}
                </div>
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
                  pauseBgmForVideo()
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