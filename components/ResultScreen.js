'use client'

import MovieFlipCard from './MovieFlipCard'
import ProfileModal from './ProfileModal'

export default function ResultScreen(props) {

  const {
    users,
    supabase,
    setScreen,
    selChar,
    results,
    ranking,
    currentUser,
    selGrade,
    authUser,
    AppLayout,
    displayScore,
    resultView,
    setResultView,
    isLevelCompleted,
    visibleResults,
    showAnswers,
    handleShowAnswers,
    loadMovieDetail,
    GRADES,
    rankingRevealDone,
    CHARS,
    showProfile,
    setShowProfile,
    setProfileStats,
    setProfileTarget,
    setProfileUser,
    setAnimateStats,
    profileUser,
    animateStats,
    profileStats,
    LEVEL_TITLES,
    recommendStatus,
    loadingDots,
    CharAvatar,
    openMovieRecommend,
    showRecommendModal,
    setShowRecommendModal,
    recommendMovie,
    trailerKey,
    setTrailerKey,
    showMovieCard,
    setShowMovieCard,
    movieCard,
    movieCardFlipped,
    setMovieCardFlipped,
    playClick,
    loadMovies,
    saveCollection,
    skipResultAnimation,
    setSkipResultAnimation
  } = props

  const safeUsers = Array.isArray(users) ? users : []
  const user = safeUsers.find(u => u.charId === selChar)
  const baseScore = user?.score ?? 0
  const roundScore = (results ?? []).reduce((s, r) => s + r.score, 0)
  const tot = baseScore + roundScore
  const nickname = user?.nickname || 'USER'
  const currentGrade = selGrade
  const hasFail = results.some(r => !r.correct)
  const char = CHARS.find(c => c.id === selChar)
  const sortedRanking = [...ranking].sort(

    (a, b) => b.score - a.score

  )


  let lastRank = 1
  const ranked = sortedRanking.map((r, i) => {
    if (i === 0) {
      return { ...r, rank: 1 }
    }
    const prev = sortedRanking[i - 1]
    if (r.score === prev.score) {
      return { ...r, rank: lastRank }
    }
    lastRank = i + 1
    return { ...r, rank: lastRank }
  })

  return (

    <AppLayout>
      <div style={{
        height: '100dvh',
        overflow: 'hidden',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 0 8px',
      }}>

        {/* 상단 영역 */}
        <div style={{
          flexShrink: 0,
          paddingTop: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>

          <div style={{
            position: 'relative',
            width: 75,
            height: 75,
            borderRadius: '50%',
            background: '#faf9f7',
            border: '2.5px solid #f2d7dc',
            boxShadow: `
                      0 0 0 3px rgba(255,107,122,0.10),
                      0 8px 20px rgba(255,107,122,0.12)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10
          }}>
            <div


              onClick={() => {

                if (!authUser) {

                  alert('로그인 후 이용 가능합니다.')

                  return

                }

                setProfileStats(null)

                // 🔥 랭킹 프로필 target 제거

                setProfileTarget(null)

                setProfileUser(currentUser)

                setAnimateStats(false)

                requestAnimationFrame(() => {

                  setAnimateStats(true)

                })

                setShowProfile(true)

              }}

              style={{ cursor: 'pointer' }}

            >

              <svg viewBox="0 0 80 80" style={{ width: 68, height: 68 }}>

                {char?.svg?.props?.children}

              </svg>

            </div>

            {/* 🔥 프로필 배지 */}
            <div style={{
              position: 'absolute',
              right: -2,
              bottom: 6,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: '#fff8f9',
              border: '1.5px solid #e8e4dd',
              boxShadow: `
                        0 0 0 3px rgba(255,107,122,0.10),
                        0 4px 12px rgba(255,107,122,0.12)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.72rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}>
              📊
            </div>
          </div>

          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#1a1814',
            marginBottom: 6
          }}>
            {nickname}
          </div>

          <div style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            color: '#1a1814'
          }}>
            {(displayScore || 0).toLocaleString()}점
          </div>

          <div style={{
            marginTop: 10,
            marginBottom: 18,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => {
                setResultView(prev => prev === 'score' ? 'ranking' : 'score')
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 20,
                border: '1px solid #ddd',
                background: '#fff',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}>
              {resultView === 'score' ? '랭킹 보기' : '점수 보기'}
            </button>
          </div>

          {isLevelCompleted && (
            <div style={{
              fontSize: '0.8rem',
              color: '#888',
              marginTop: 6
            }}>
              {currentGrade === '2020s' && '2020년대 레벨을 완료하였습니다'}
              {currentGrade === '2010s' && '2010년대 레벨을 완료하였습니다'}
              {currentGrade === '2000s' && '2000년대 레벨을 완료하였습니다'}
              {currentGrade === '1990s' && '1990년대 레벨을 완료하였습니다'}
              {currentGrade === 'old' && '오래전 영화 레벨을 완료하였습니다'}
            </div>
          )}
        </div>

        {/* 리스트 영역  */}
        <div style={{ position: 'relative' }}>
          {/* 정답보기-AD 버튼 */}
          {resultView === 'score' && hasFail && !showAnswers && (
            <button
              onClick={handleShowAnswers}
              disabled={showAnswers}
              style={{
                position: 'absolute',
                top: -30,
                left: 20,
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.7rem',
                padding: '6px 10px',
                borderRadius: 8,
                border: 'none',
                background: '#e8808c',
                color: '#ffffff',
                fontWeight: 700
              }}
            >
              정답보기
              <span style={{
                fontSize: '0.35rem',
                padding: '2px 5px',
                borderRadius: 6,
                background: '#ffffff',
                color: '#252525'
              }}>
                AD
              </span>
            </button>
          )}

          {/* 점수_랭킹 리스트 */}
          <div style={{
            padding: '7px 20px 0',
            // 🔥 핵심 1: score 기준 높이 고정
            height: `${Math.min(results.length, 5) * 65 + 3}px`,
            // 🔥 핵심 2: ranking은 스크롤만
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}>

            {resultView === 'score' ? (
              results.slice(0, visibleResults).map((r, i) => {
                const rg = GRADES.find(x => x.id === r.grade)
                const isCorrect = r.correct === true
                const hasMovieInfo =
                  r.tmdb_id ||
                  r.poster_path ||
                  r.overview
                return (
                  <div

                    key={i}
                    onClick={() => {
                      if (
                        (r.correct || showAnswers)
                        &&
                        hasMovieInfo
                      ) {
                        console.log(

                          'save collection click',

                          r)
                        setCollectionReturnScreen('result')
                        saveCollection(r)
                        loadMovieDetail(r)
                      }
                    }}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 13,
                      border: '1.5px solid #ece8e2',
                      background: '#fff',
                      padding: '12px 16px',
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      cursor:
                        ((r.correct || showAnswers) && hasMovieInfo)
                          ? 'pointer'
                          : 'default'
                    }}
                  >
                    {/* 🎬 포스터 배경 */}
                    {(r.correct || showAnswers) && r.poster_path && (
                      <>
                        {/* 포스터 */}
                        <img
                          src={`https://image.tmdb.org/t/p/w500${r.poster_path}`}
                          alt=""
                          style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center center',
                            opacity: 0.7,
                            zIndex: 0,
                            pointerEvents: 'none'
                          }}
                        />
                        {/* 가독성용 화이트 그라데이션 */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(to right, rgba(255,255,255,0.88) 0%, rgba(255, 255, 255, 0.43) 35%, rgba(255,255,255,0.00) 50%, rgba(255, 255, 255, 0.34) 65%, rgba(255,255,255,0.88) 100%)',
                          zIndex: 1,
                          pointerEvents: 'none'
                        }} />
                      </>
                    )}

                    {/* Q번호 */}
                    <div style={{
                      position: 'relative',
                      zIndex: 2,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: isCorrect ? `${rg?.color || '#ccc'}15` : '#f5f3ef',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1.5px solid ${isCorrect ? (rg?.color || '#ccc') : '#e8e4dd'}`
                    }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: r.correct ? rg?.color : '#b0aaa3'
                      }}>
                        Q{i + 1}
                      </span>
                    </div>

                    {/* 제목 */}
                    <div style={{
                      flex: 1,
                      position: 'relative',
                      zIndex: 2
                    }}>
                      <div style={{
                        fontSize:
                          r.correct && (r.title || '').length > 20 ? '0.7rem' :
                            r.correct && (r.title || '').length > 14 ? '0.75rem' :
                              '0.8rem',
                        fontWeight: 700,
                        transition: 'opacity 0.15s ease',
                        color:
                          (r.correct || showAnswers)
                            ? '#1a1814'
                            : '#c0bbb4',
                        lineHeight: 1.25,
                        wordBreak: 'keep-all',
                      }}>
                        {r.correct
                          ? r.title
                          : showAnswers
                            ? r.title
                            : '실패'
                        }
                      </div>
                    </div>

                    {/* 점수 */}
                    <div style={{
                      position: 'relative',
                      zIndex: 2,
                      minWidth: 50,
                      display: 'flex',
                      justifyContent: 'flex-end',
                      paddingRight: 18
                    }}>
                      <div style={{
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        textShadow: '0 1px 3px rgba(255,255,255,0.85)',
                        color: r.correct ? '#d42c3f' : '#c7b9b9'
                      }}>
                        {r.correct ? `+${r.score}` : '-'}
                      </div>

                      {/* 콤보도장 */}
                      {r.combo && (
                        <div style={{
                          position: 'absolute',
                          zIndex: 3,
                          top: -15,
                          right: 38,
                          fontSize: '0.55rem',
                          fontWeight: 900,
                          padding: '2px 6px',
                          borderRadius: 6,
                          transform: 'rotate(-10deg)',
                          zIndex: 2,

                          background:
                            r.combo === 'good' ? '#fff3cd' :
                              r.combo === 'wow' ? '#ffe0e0' :
                                r.combo === 'crazy' ? '#e6d6ff' : '#eee',

                          color:
                            r.combo === 'good' ? '#c8a84a' :
                              r.combo === 'wow' ? '#d45c5c' :
                                r.combo === 'crazy' ? '#7a4cff' : '#888',

                          border: `1px solid ${r.combo === 'good' ? '#f0c36d' :
                            r.combo === 'wow' ? '#f0b4b4' :
                              r.combo === 'crazy' ? '#c8a8ff' : '#ddd'
                            }`,

                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                          pointerEvents: 'none'
                        }}>
                          {
                            r.combo === 'good' ? 'GOOD' :
                              r.combo === 'wow' ? 'WOW' :
                                r.combo === 'crazy' ? 'CRAZY' : ''
                          }
                        </div>
                      )}
                    </div>

                    {((r.correct || showAnswers) && hasMovieInfo) && (
                      <div style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        lineHeight: 1.0,
                        fontSize: '0.53rem',
                        fontWeight: 900,
                        color: 'rgba(0, 0, 0, 0.92)',
                        textShadow: '0 1px 4px rgba(236, 236, 236, 0.45)',
                        letterSpacing: '0.5px',
                        pointerEvents: 'none'
                      }}>
                        <span>O</span>
                        <span>P</span>
                        <span>E</span>
                        <span>N</span>

                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <>
                {(() => {
                  const safeRanking = Array.isArray(ranked) ? ranked : []
                  const safeUsers = Array.isArray(users) ? users : []
                  const TOP_LIMIT = 10
                  const myRankIndex = safeRanking.findIndex(
                    r =>
                      String(r.character_id) === String(selChar)
                  )
                  const myRank =
                    myRankIndex >= 0
                      ? safeRanking[myRankIndex]?.rank
                      : null
                  const myRankData =
                    myRankIndex >= 0
                      ? safeRanking[myRankIndex]
                      : null
                  return (
                    <>
                      {Array.from({ length: rankingRevealDone ? TOP_LIMIT : 5 }).map((_, i) => {
                        const r = safeRanking[i] || null
                        const char = r ? CHARS.find(c => c.id === r.character_id) : null
                        const isDead = r && !safeUsers.find(u => u.charId === r.character_id)
                        const isMe =
                          r &&
                          String(r.character_id) === String(selChar)
                        const isAnimated = !skipResultAnimation && i < 5

                        return (
                          <div
                            key={i}
                            style={{
                              borderRadius: 13,
                              border: isMe
                                ? '2px solid #e8808c'
                                : '1.5px solid #ece8e2',
                              background: isMe
                                ? '#fff5f6'
                                : '#fff',
                              color: isMe ? '#e8808c' : '#1a1814',
                              padding: '12px 16px',
                              marginBottom: 8,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              animation: isAnimated
                                ? 'fadeUp 0.3s ease forwards'
                                : 'none',
                              opacity: isAnimated ? 0 : 1,
                              animationDelay: `${i * 0.08}s`
                            }}
                          >

                            {/* 순위 */}
                            <div style={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              background: '#f5f3ef',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1.5px solid #e8e4dd',
                              flexShrink: 0
                            }}>
                              <span style={{
                                fontSize: '0.65rem',
                                fontWeight: 800
                              }}>
                                {r.rank}위
                              </span>
                            </div>

                            {/* 캐릭터 + 📊 */}
                            {r ? (
                              <div style={{
                                position: 'relative',
                                width: 28,
                                height: 28,
                                flexShrink: 0
                              }}>

                                {/* 캐릭터 */}

                                <div

                                  onClick={() => {

                                    if (!authUser) {

                                      alert('로그인 후 이용 가능합니다.')

                                      return

                                    }

                                    // 🔥 이전 프로필 초기화

                                    setProfileStats(null)

                                    // 🔥 랭킹 프로필 대상 지정

                                    setProfileTarget(r.character_id)

                                    // 🔥 랭킹 row 자체 저장

                                    setProfileUser(r)

                                    setAnimateStats(false)

                                    requestAnimationFrame(() => {

                                      setAnimateStats(true)

                                    })

                                    setShowProfile(true)

                                  }}

                                  style={{

                                    cursor: 'pointer'

                                  }}

                                >
                                  <CharAvatar
                                    charId={r.character_id}
                                    size={28}
                                  />
                                </div>

                                {/* 📊 배지 */}
                                <div
                                  onClick={() => {
                                    setAnimateStats(false)
                                    requestAnimationFrame(() => {
                                      setAnimateStats(true)
                                    })
                                    setProfileTarget(r.character_id)
                                    setProfileUser(r)
                                    setShowProfile(true)
                                  }}
                                  style={{
                                    position: 'absolute',
                                    right: -5,
                                    bottom: -5,
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    background: '#fff8f9',
                                    border: '1px solid #e8e4dd',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.45rem',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                                    cursor: 'pointer'
                                  }}
                                >
                                  📊
                                </div>

                              </div>

                            ) : (

                              <div style={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                background: '#f0eeea',
                                flexShrink: 0
                              }} />

                            )}

                            {/* 이름 */}
                            <div style={{
                              flex: 1,
                              minWidth: 0
                            }}>
                              <div style={{
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: r
                                  ? isDead
                                    ? '#b0aaa3'
                                    : '#1a1814'
                                  : '#c0bbb4',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {r
                                  ? isDead
                                    ? `${r.nickname || char?.name || 'UNKNOWN'} 💀`
                                    : (r.nickname || char?.name || 'USER')
                                  : '-'
                                }
                              </div>
                            </div>

                            {/* 점수 */}
                            <div style={{
                              fontSize: '0.85rem',
                              fontWeight: 800,
                              color: r ? '#1a1814' : '#c0bbb4',
                              whiteSpace: 'nowrap'
                            }}>
                              {r ? r.score : 0}
                            </div>

                          </div>
                        )
                      })}

                      {myRank && myRank > TOP_LIMIT && (
                        <div style={{
                          marginTop: 8,
                          padding: '12px 14px',
                          borderRadius: 14,
                          background: '#fff5f6',
                          border: '2px solid #e8808c',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10
                        }}>
                          <div style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            color: '#e8808c'
                          }}>
                            내 순위
                          </div>

                          <div style={{
                            fontSize: '1rem',
                            fontWeight: 900,
                            color: '#e8808c'
                          }}>
                            {myRank}위
                          </div>
                          <CharAvatar charId={selChar} size={28} />
                          <div style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            flex: 1,
                            minWidth: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {myRankData?.nickname || 'USER'}
                          </div>

                          <div style={{
                            fontSize: '0.9rem',
                            fontWeight: 900,
                            whiteSpace: 'nowrap'
                          }}>
                            {(displayScore || 0).toLocaleString()}
                          </div>
                        </div>
                      )}

                    </>
                  )
                })()}
              </>
            )}
          </div>
        </div>

        {/* 하단 영역 */}
        {visibleResults > results.length && (
          <div style={{
            flexShrink: 0,
            padding: '8px 20px calc(10px + env(safe-area-inset-bottom))',
            display: 'flex',
            gap: 10,
            background: '#fff',
            borderTop: '1px solid #f0ece6'
          }}>

            {/* 🔥 조건 버튼 */}
            {!isLevelCompleted && (
              <button

                style={{
                  flex: 1,
                  height: 54,
                  borderRadius: 14,
                  background: '#4a4a4a',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: 'none'
                }}
                onClick={() => {
                  playClick()
                  loadMovies()
                }}
              >
                계속하기
              </button>
            )}

            {/* 🔥 공통 버튼 (홈은 무조건 하나만) */}
            <button

              style={{
                flex: 1,
                height: 54,
                borderRadius: 12,
                background: 'transparent',
                color: '#9a9490',
                fontSize: '0.8rem',
                fontWeight: 500,
                border: '1.5px solid #e8e4dd'
              }}
              onClick={() => {
                playClick()
                setScreen('char')
              }}
            >
              홈으로
            </button>
          </div>
        )}

        <ProfileModal

          showProfile={showProfile}

          setScreen={setScreen}

          setShowProfile={setShowProfile}

          profileUser={profileUser}

          currentUser={currentUser}

          user={user}

          profileStats={profileStats}

          animateStats={animateStats}

          LEVEL_TITLES={LEVEL_TITLES}

          recommendStatus={recommendStatus}

          loadingDots={loadingDots}

          openMovieRecommend={openMovieRecommend}

          showRecommendModal={showRecommendModal}

          setShowRecommendModal={setShowRecommendModal}

          recommendMovie={recommendMovie}

          setTrailerKey={setTrailerKey}

          movieCard={movieCard}

          showMovieCard={showMovieCard}

          setShowMovieCard={setShowMovieCard}

          movieCardFlipped={movieCardFlipped}

          setMovieCardFlipped={setMovieCardFlipped}

          supabase={supabase}

          skipResultAnimation={skipResultAnimation}

          setSkipResultAnimation={setSkipResultAnimation}     

        />


      <MovieFlipCard

        movieCard={movieCard}

        showMovieCard={showMovieCard}

        setShowMovieCard={setShowMovieCard}

        movieCardFlipped={movieCardFlipped}

        setMovieCardFlipped={setMovieCardFlipped}

        setTrailerKey={setTrailerKey}

      />


      <style jsx>{`
                        @keyframes fadeUp {
                          from {
                            transform: translateY(10px);
                            opacity: 0;
                          }
                          to {
                            transform: translateY(0);
                            opacity: 1;
                          }
                        }
                      `}</style>

      </div>

      
    </AppLayout>

    
  )

}