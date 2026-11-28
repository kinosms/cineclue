'use client'

import { playSound} from '../library/audioManager'
import { isAndroidApp } from '../utils/platform'
import { getModeSkin } from './ModeSkins'
import { useRef, useEffect, useState } from 'react'
import DefaultAnimatedBackground from './DefaultAnimatedBackground'

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
    setDisplayScore,
    resultView,
    setResultView,
    isLevelCompleted,
    visibleResults,
    loadMovieDetail,
    rankingRevealDone,
    CHARS,
    showProfile,
    setShowProfile,
    setProfileStats,
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
    setMovieCard,
    setMovieCardFlipped,
    loadMovies,
    skipResultAnimation,
    setSkipResultAnimation,
    loadRanking,
    collectionTargetUserId,
    setCollectionTargetUserId, 
    setCollectionReturnScreen,
    showAppToast,
    showAnswers,
    handleShowAnswers,
    getProfileStats,
    fetchWatchProviders,
    setWatchProviders
  } = props


  const HORROR_SKIN = {

  background: "/skins/horror/background.webp",

  buttons: {

    nextQuiz: "/skins/horror/btn_next_quiz.webp",
    nextHint: "/skins/horror/btn_next_hint.webp",

  }

}


  const isHorrorParty = selGrade === 'horror'
  const isSciFi = selGrade === 'sf'
  const isKorea = selGrade === 'kr'
  const skin = getModeSkin(selGrade)
  const isDefaultSkin = ![
    'sf', 'kr', 'anime', 'thriller', 'hk', 'horror'
  ].includes(selGrade)
  const rankingSkin = {

  panelBg: isSciFi

    ? 'linear-gradient(135deg, #102630, #07131c)'

    : isHorrorParty

      ? 'linear-gradient(135deg, #302020, #181313)'

      : 'linear-gradient(135deg, #f7efdf, #e5d5b8)',

  panelBorder: isSciFi

    ? '#367b91'

    : isHorrorParty

      ? '#783c3c'

      : '#a58a60',

  divider: isSciFi

    ? 'rgba(0,217,245,.2)'

    : isHorrorParty

      ? 'rgba(180,70,70,.25)'

      : 'rgba(120,90,50,.25)',

  myBg: isSciFi

    ? 'linear-gradient(90deg, #12485c, #10303e)'

    : isHorrorParty

      ? 'linear-gradient(90deg, #632626, #382020)'

      : 'linear-gradient(90deg, #e8c77f, #fff0c8)',

  myBorder: isSciFi

    ? '#00E5FF'

    : isHorrorParty

      ? '#b54b4b'

      : '#c69a48',

  text: isSciFi || isHorrorParty

    ? '#f5f5f5'

    : '#3d3021'

}

const totalScoreRef = useRef(null)
const posterScoreRefs = useRef([])
const flightAnimations = useRef([])
const flightLayerRef = useRef(null)
const [loadedPosters, setLoadedPosters] = useState({})

useEffect(() => {
  if (skipResultAnimation) return

  const timers = []
  const animations = flightAnimations.current

  results.forEach((r, i) => {
    if (!r.correct || Number(r.score) <= 0) return

    const timer = setTimeout(() => {
      const source = posterScoreRefs.current[i]
      const target = totalScoreRef.current
      const layer = flightLayerRef.current

      if (!source || !target || !layer) return

      const from = source.getBoundingClientRect()
      const to = target.getBoundingClientRect()

      const startX = from.left + from.width / 2
      const startY = from.top + from.height / 2

      const endX = to.left + to.width / 2
      const endY = to.top + to.height / 2

      const dx = endX - startX
      const dy = endY - startY

      const el = document.createElement('div')

      el.textContent = `+${r.score}`

      Object.assign(el.style, {
        position: 'fixed',
        left: `${startX}px`,
        top: `${startY}px`,
        fontSize: '1.4rem',
        fontWeight: '900',
        color: '#FFD58A',
        textShadow: '0 2px 5px rgba(0,0,0,.9)',
        pointerEvents: 'none',
        zIndex: '9999',
        whiteSpace: 'nowrap'
      })

      layer.appendChild(el)

      const animation = el.animate([
        {
          transform: 'translate(-50%, -50%) scale(0.8)',
          opacity: 0
        },
        {
          transform: 'translate(-50%, -50%) scale(1.25)',
          opacity: 1,
          offset: 0.5
        },
        {
          transform: `translate(calc(-50% + ${dx * 0.3}px), calc(-50% + ${dy * 0.3}px)) scale(1.1)`,
          opacity: 1,
          offset: 0.5
        },
        {
          transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.3)`,
          opacity: 0
        }
      ], {
        duration: 1200,
        easing: 'ease-in',
        fill: 'forwards'
      })

      animations.push(animation)

      animation.onfinish = () => {
        el.remove()

        const earnedScore = Number(r.score)

const countDuration = 450

const startTime = performance.now()

let addedScore = 0

const countUp = (now) => {

  const progress = Math.min(

    (now - startTime) / countDuration,

    1

  )

  const nextAdded = Math.floor(earnedScore * progress)

  const diff = nextAdded - addedScore

  if (diff > 0) {

    setDisplayScore(prev => prev + diff)

    addedScore = nextAdded

  }

  if (progress < 1) {

    requestAnimationFrame(countUp)

  }

}

requestAnimationFrame(countUp)

        const pulse = target.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.12)' },
          { transform: 'scale(1)' }
        ], {
          duration: 220,
          easing: 'ease-out'
        })

        animations.push(pulse)
      }

      animation.oncancel = () => el.remove()

    }, 650 + i * 220)

    timers.push(timer)
  })

  return () => {
    timers.forEach(clearTimeout)
    animations.forEach(a => a.cancel())
    animations.length = 0
  }
}, [results, skipResultAnimation, setDisplayScore])
  

  const safeUsers = Array.isArray(users) ? users : []
  const user = currentUser
  const baseScore = user?.score ?? 0
  const roundScore = (results ?? []).reduce((s, r) => s + r.score, 0)
  const tot = baseScore + roundScore
  const nickname = user?.nickname || 'USER'
  const currentGrade = selGrade
  const hasFail = results.some(r => !r.correct)
  const char = CHARS.find(c => c.id === selChar)
  const safeRankingSource = Array.isArray(ranking) ? ranking : []
  const patchedRanking = safeRankingSource.map(r => {
  const isMe =
    String(r.user_id) === String(currentUser?.userId)

    if (isMe) {
      return {
        ...r,
        score: displayScore || r.score
      }
    }
    return r
  })

const sortedRanking = [...patchedRanking].sort(

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
      <div

        className={isHorrorParty ? 'skin-horror' : ''}

        style={{

          height: '100dvh',

          overflow: 'hidden',

          background: isHorrorParty

            ? `linear-gradient(rgba(0,0,0,.30), rgba(0,0,0,.55)), url(${skin.background}) center / cover no-repeat`

            : isDefaultSkin

              ? '#F7EBDD'

              : `url(${skin.background}) center / cover no-repeat`,

          display: 'flex',

          flexDirection: 'column',

          padding: '12px 0 8px',

          position: 'relative',

          isolation: 'isolate'

        }}

      >

        {/* 디폴트 스킨 애니메이션 배경 */}
        {isDefaultSkin && <DefaultAnimatedBackground />}

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
            width: 66,
            height: 66,
            borderRadius: '50%',
            background: isHorrorParty
              ? 'rgba(25,25,25,.55)'
              : '#faf9f7',
            backdropFilter: isHorrorParty ? 'blur(8px)' : 'none',
            border: isHorrorParty
              ? '2px solid rgba(255,255,255,.18)'
              : '2.5px solid #f2d7dc',
            boxShadow: isHorrorParty
              ? '0 8px 20px rgba(0,0,0,.35)'
              : `
                  0 0 0 3px rgba(255,107,122,0.10),
                  0 8px 20px rgba(255,107,122,0.12)
                `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10
          }}>
            <div
              onClick={async () => {
                playSound('click')
                if (!authUser) {
                  showAppToast('로그인 후 이용 가능합니다')
                  return
                }
                setProfileStats(null)
                setProfileUser(currentUser)
                setAnimateStats(false)
                const profile = await getProfileStats(
                  supabase,
                  currentUser.userId
                )
                setProfileStats(profile)
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
            color: skin.colors.resultName,
            marginBottom: 6,
            textShadow: (isKorea || selGrade === 'anime' || selGrade === 'thriller')
              ? skin.colors.resultNameShadow
              : isSciFi
                ? '0 2px 6px rgba(0,0,0,.95), 0 0 12px rgba(0,0,0,.8)'
                : 'none',
          }}>
            {nickname}
          </div>

          <div ref={totalScoreRef} style={{
            fontSize: '2.2rem',
            fontWeight: 900,
            color: skin.colors.resultTotalScore,
            textShadow: (isKorea || ['anime', 'thriller'].includes(selGrade))
              ? skin.colors.resultTotalScoreShadow
              : 'none',
          }}>
            {(displayScore || 0).toLocaleString()}점
          </div>

          <div style={{
            marginTop: 8,
            marginBottom: 8,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <button
              onClick={async () => {
                playSound('click')
                if (resultView === 'score') {
                  await loadRanking()
                  setResultView('ranking')
                  return
                }
                setResultView('score')
              }}

              style={{
                padding: '7px 16px',
                borderRadius: 20,

                border: isSciFi

                ? '1.5px solid #00D9F5'

                : isHorrorParty

                  ? '1.5px solid #AA0202'

                  : isKorea

                    ? `1.5px solid ${skin.colors.resultButtonText}`

                    : ['anime', 'hk', 'thriller'].includes(selGrade)

                      ? `1.5px solid ${skin.colors.rankingButtonText}`

                      : '1.5px solid #B8A58C',

              boxShadow: isSciFi

                ? '0 0 8px rgba(0,217,245,.35)'

                : 'inset 0 -3px 5px rgba(0,0,0,.08), 0 3px 6px rgba(0,0,0,.3)',

                background: isSciFi
                  ? 'rgba(5,15,25,.92)'
                  : '#fff',

                color: isSciFi
                  ? '#00E5FF'
                  : isHorrorParty
                    ? '#aa0202'
                    : isKorea
                      ? skin.colors.resultButtonText
                      : ['anime', 'hk', 'thriller'].includes(selGrade)
                        ? skin.colors.rankingButtonText
                        : '#222',

                fontSize: '0.8rem',
                fontWeight: 700,
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
        <div style={{

          position: 'relative',

          flex: '0 1 auto',

          minHeight: 0,

          display: 'flex',

          flexDirection: 'column'

        }}>
          

          {/* 점수_랭킹 리스트 */}
          <div style={{

            padding: '2px 20px 0',

            height: resultView === 'score'

            ? 'auto'

            : 'calc(min(46dvh, 420px)',

            overflowY: resultView === 'score' ? 'auto' : 'hidden',

            overflowX: 'hidden',

            scrollbarWidth: 'none',

            WebkitOverflowScrolling: 'touch',

            overscrollBehavior: 'contain'

          }}>

            {resultView === 'score' ? (
              <div style={{

  display: 'flex',

  flexWrap: 'wrap',

  justifyContent: 'center',

  gap: 10,

  padding: '4px 0 10px'

}}>
                {Array.from({ length: 5 }).map((_, i) => {

                  const r = results[i]

                  if (!r) {

                    return (

                      <div

                        key={i}

                        style={{

                          width: 'calc((100% - 20px) / 3)',

                          flexShrink: 0,

                          minWidth: 0,

                          aspectRatio: '2 / 3',

                          boxSizing: 'border-box',

                          visibility: 'hidden'

                        }}

                      />

                    )

                  }
                  const isCorrect = r.correct === true
                  const isRevealed = isCorrect || showAnswers
                  const isPosterReady =

                  !isRevealed ||

                  !r.poster_path ||

                  loadedPosters[r.poster_path]

                  const hasMovieInfo =
                    r.tmdb_id ||
                    r.poster_path ||
                    r.overview

                  return (
                    <div
                      key={i}
                      onClick={async () => {
                        if (!isRevealed || !hasMovieInfo) return

                        playSound('click')

                        const providers = r.tmdb_id
                          ? await fetchWatchProviders(
                              r.tmdb_id,
                              r.tmdb_media_type || 'movie'
                            )
                          : []

                        setWatchProviders(providers)
                        setMovieCard(r)
                        setMovieCardFlipped(false)
                        setShowMovieCard(true)
                      }}
                      style={{
                        position: 'relative',
                        width: 'calc((100% - 20px) / 3)',
                        flexShrink: 0,
                        minWidth: 0,
                        aspectRatio: '2 / 3',

                        // 포스터 순차 등장 효과
                        visibility: isPosterReady ? 'visible' : 'hidden',
                        opacity: skipResultAnimation ? 1 : 0,

                        animation: skipResultAnimation
                          ? 'none'
                          : 'posterSlam 0.22s ease-out both, posterImpact 1.8s ease-in-out forwards',
                          

                        animationDelay: skipResultAnimation
                          ? '0s'
                          : `${0.3 + i * 0.22}s, ${0.52 + i * 0.22}s`,

                        transformOrigin: 'center center',

                        boxSizing: 'border-box',
                        borderRadius: 10,
                        overflow: 'hidden',
                        border: skin.colors.resultCardBorder,
                        background: isRevealed
                          ? skin.colors.resultCardBg
                          : '#202020',
                        boxShadow: skin.colors.resultCardGlow,
                        cursor: isRevealed && hasMovieInfo
                          ? 'pointer'
                          : 'default'
                      }}
                    >

                      {/* 영화 포스터 */}
                      {isRevealed && r.poster_path && (
                        <img
                        onLoad={async (e) => {

                          const img = e.currentTarget

                          try {

                            await img.decode()

                          } catch {}

                          setLoadedPosters(prev => ({

                            ...prev,

                            [r.poster_path]: true

                          }))

                        }}

                        onError={() => {

                          setLoadedPosters(prev => ({

                            ...prev,

                            [r.poster_path]: true

                          }))

                        }}
                          src={`https://image.tmdb.org/t/p/w500${r.poster_path}`}
                          alt={r.title || ''}
                          loading="eager"
                          decoding="sync"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      )}

                      {/* 하단 그라데이션 */}
                      {isRevealed && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to bottom, transparent 45%, rgba(0,0,0,.95) 100%)',
                          pointerEvents: 'none'
                        }} />
                      )}

                      {/* 문제 번호 */}
                      <div style={{
                        position: 'absolute',
                        top: 6,
                        left: 6,
                        padding: '4px 7px',
                        borderRadius: 6,
                        background: 'rgba(0,0,0,.75)',
                        color: '#fff',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        zIndex: 2
                      }}>
                        Q{i + 1}
                      </div>

                      {/* 콤보 도장 */}
                      {r.combo && (

                      <img

                        src={

                          r.combo === 'good' ? '/combo/great.webp' :

                          r.combo === 'wow' ? '/combo/unstoppable.webp' :

                          '/combo/absolute.webp'

                        }

                        alt={r.combo}

                        style={{

                          position: 'absolute',

                          top: 8,

                          right: 5,

                          width: '45%',

                          height: 'auto',

                          transform: 'rotate(-10deg)',

                          filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.8))',

                          zIndex: 3,

                          pointerEvents: 'none'

                        }}

                      />

                    )}

                      {/* 오답 - 정답보기 버튼 */}
                      {!isRevealed && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>

                          <div style={{
                            fontSize: '2rem',
                            fontWeight: 900,
                            color: 'rgba(255,255,255,.18)'
                          }}>
                            ?
                          </div>

                          <button
                            onClick={async (e) => {
                              e.stopPropagation()
                              playSound('click')

                              try {
                                await handleShowAnswers()
                              } catch (e) {
                                console.error('RESULT_BUTTON_ERROR=', e)
                                showAppToast?.('광고를 불러오지 못했습니다')
                              }
                            }}
                            style={{
                              position: 'absolute',
                              whiteSpace: 'nowrap',
                              width: 'max-content',
                              bottom: 12,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 4,
                              padding: '7px 12px',
                              borderRadius: 7,
                              border: 'none',
                              background: '#9d3642',
                              color: '#fff',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            정답보기

                            <span style={{
                              padding: '2px 4px',
                              borderRadius: 4,
                              background: '#fff',
                              color: '#252525',
                              fontSize: '0.4rem'
                            }}>
                              AD
                            </span>
                          </button>
                        </div>
                      )}

                      {/* 영화 제목 및 점수 */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '8px 6px',
                        textAlign: 'center',
                        zIndex: 2
                      }}>

                        <div style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#fff',
                          lineHeight: 1.3,
                          wordBreak: 'keep-all',
                          textShadow: '0 1px 3px rgba(0,0,0,.9)'
                        }}>
                          {isRevealed ? r.title : ''}
                        </div>

                        <div

                          ref={el => {

                            posterScoreRefs.current[i] = el

                          }}

                          style={{
                          marginTop: 4,
                          fontSize: '0.9rem',
                          fontWeight: 900,
                          color: isCorrect ? '#FFD58A' : '#999',
                          textShadow: '0 1px 3px rgba(0,0,0,.9)'
                        }}>
                          {isCorrect ? `+${r.score}` : ''}
                        </div>

                      </div>

                    </div>
                  )
                })}
              </div>
            ) : (
              <>
                {(() => {
                  const safeRanking = Array.isArray(ranked) ? ranked : []
                  const safeUsers = Array.isArray(users) ? users : []
                  const TOP_LIMIT = 10
                  const myRankIndex = safeRanking.findIndex(
                    r =>
                      String(r.user_id) === String(currentUser?.userId)
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

                    <div style={{

                        background: rankingSkin.panelBg,

                        border: `2px solid ${rankingSkin.panelBorder}`,

                        borderRadius: 12,

                        padding: 6,

                        boxShadow: `

                          0 5px 15px rgba(0,0,0,.35),

                          inset 0 0 0 2px rgba(255,255,255,.12)

                        `,

                        height: '100%',

                        boxSizing: 'border-box',

                        overflowY: 'auto',

                        overflowX: 'hidden',

                        WebkitOverflowScrolling: 'touch',

                        overscrollBehavior: 'contain',

                        scrollbarWidth: 'none'

                    }}>

                      {Array.from({ length: TOP_LIMIT }).map((_, i) => {
                        const r = safeRanking[i] || null
                        const char = r ? CHARS.find(c => c.id === r.character_id) : null
                        const isMe =
                          r &&
                            String(r.user_id) === String(currentUser?.userId)
                        const isAnimated = !skipResultAnimation

                        return (
                          <div
                            key={i}
                            style={{

                            position: 'relative',

                            borderRadius: isMe ? 6 : 0,

                            border: isMe

                              ? `1px solid ${rankingSkin.myBorder}`

                              : '1px solid transparent',

                            borderBottom: isMe

                              ? `1px solid ${rankingSkin.myBorder}`

                              : `1px solid ${rankingSkin.divider}`,

                            background: isMe

                              ? rankingSkin.myBg

                              : 'transparent',

                            color: rankingSkin.text,

                            boxShadow: isMe

                              ? 'inset 0 0 8px rgba(255,255,255,.15)'

                              : 'none',

                            padding: '10px 8px',

                            marginBottom: 0,

                            minHeight: 36,

                            display: 'flex',

                            alignItems: 'center',

                            gap: 8,

                            animation: isAnimated

                              ? 'fadeUp 0.3s ease forwards'

                              : 'none',

                            opacity: isAnimated ? 0 : 1,

                            animationDelay: `${i * 0.08}s`

                          }}
                          >

                            {/* 순위 */}
<div style={{
  width: 58,
  height: 32,
  flexShrink: 0,

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  background:
    r?.rank === 1
      ? 'linear-gradient(135deg, #a52b20, #68140e)'
      : r?.rank === 2
        ? 'linear-gradient(135deg, #345c76, #193447)'
        : r?.rank === 3
          ? 'linear-gradient(135deg, #48603a, #263b20)'
          : 'transparent',

  border:
    r?.rank === 1
      ? '1.5px solid #d5aa54'
      : r?.rank === 2
        ? '1.5px solid #849eae'
        : r?.rank === 3
          ? '1.5px solid #9ca77a'
          : 'none',

  borderRadius: 4,

  boxShadow: r?.rank <= 3
    ? 'inset 0 0 0 2px rgba(255,255,255,.12)'
    : 'none',

  clipPath: r?.rank <= 3
    ? 'polygon(8% 0, 92% 0, 100% 20%, 100% 80%, 92% 100%, 8% 100%, 0 80%, 0 20%)'
    : 'none'
}}>
  <span style={{
    fontSize: '0.8rem',
    fontWeight: 900,

    color: r?.rank === 1
      ? '#ffdc80'
      : r?.rank <= 3
        ? '#f4e9d3'
        : rankingSkin.text,

    textShadow: r?.rank <= 3
      ? '0 1px 3px rgba(0,0,0,.6)'
      : 'none'
  }}>
    {r ? `${r.rank}위` : '-'}
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
                                  onClick={async() => {
                                    if (!authUser) {
                                      showAppToast('로그인 후 이용 가능합니다')
                                      return
                                    }
                                    playSound('click')
                                    // 🔥 이전 프로필 초기화
                                    setProfileStats(null)
                                    // 🔥 랭킹 row 자체 저장
                                    setProfileUser(r)
                                    setAnimateStats(false)
                                      const profile = await getProfileStats(
                                        supabase,
                                        r.user_id
                                      )
                                    setProfileStats(profile)
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
                                    size={40}
                                  />
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
                              minWidth: 0,
                              marginLeft: 15,
                            }}>
                              <div style={{
                                fontSize:
                                (r?.nickname || '').length >= 13 ? '0.65rem' :
                                (r?.nickname || '').length >= 10 ? '0.7rem' :
                                (r?.nickname || '').length >= 7 ? '0.8rem' :
                                (r?.nickname || '').length >= 5 ? '0.85rem' :
                                '0.95rem',
                                fontWeight: 700,
                                color: r
                                  ? isSciFi
                                    ? '#FFFFFF'
                                    : isHorrorParty
                                      ? '#f2f2f2'
                                      : '#1a1814'
                                  : isSciFi
                                    ? 'rgba(255,255,255,.35)'
                                    : isHorrorParty
                                      ? 'rgba(255,255,255,.35)'
                                      : '#c0bbb4',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {r
                                  ? (r.nickname || char?.name || 'USER')
                                  : '-'
                                }
                              </div>
                            </div>
                            {/* 점수 및 최고 연속 정답 기록 */}

<div style={{

  display: 'flex',

  flexDirection: 'column',

  alignItems: 'flex-end',

  justifyContent: 'center',

  gap: 3,

  flexShrink: 0,

  whiteSpace: 'nowrap'

}}>

  {/* 점수 */}

  <div style={{

    fontSize:

  Number(r?.score || 0) >= 1000000000 ? '0.75rem' :

  Number(r?.score || 0) >= 100000000 ? '0.8rem' :

  Number(r?.score || 0) >= 10000000 ? '0.85rem' :

  Number(r?.score || 0) >= 1000000 ? '0.9rem' :

  '1rem',

    fontWeight: 800,

    color: r

      ? isSciFi

        ? '#00E5FF'

        : isHorrorParty

          ? '#f2f2f2'

          : '#1a1814'

          : isSciFi

            ? 'rgba(255,255,255,.35)'

            : isHorrorParty

              ? 'rgba(255,255,255,.35)'

              : '#c0bbb4',

                lineHeight: 1.1

              }}>

                {r ? Number(r.score || 0).toLocaleString() : '0'}

              </div>

              {/* 최고 연속 정답 기록 */}
              {Number(r?.max_streak || 0) > 0 && (
                <div style={{
                  width: 55,

                  height: 24,

                  boxSizing: 'border-box',

                  display: 'flex',

                  alignItems: 'center',

                  justifyContent: 'center',

                  gap: 3,

                  fontSize: '0.6rem',

                  fontWeight: 800,

                  padding: 0,

                  borderRadius: 4,

                  whiteSpace: 'nowrap',

                  lineHeight: 1.2,

                  flexShrink: 0,

                  background:

                  r.max_streak >= 20

                    ? (isHorrorParty ? '#39263F' : '#38145C')

                    : r.max_streak >= 10

                      ? (isHorrorParty ? '#632923' : '#A82C18')

                      : r.max_streak >= 5

                        ? (isHorrorParty ? '#493824' : '#FFD580')

                        : (isHorrorParty ? '#38302D' : '#E5E0D5'),

                      color:

                        r.max_streak >= 20 ? '#F0C2FF' :

                        r.max_streak >= 10 ? '#FFE6C0' :

                        r.max_streak >= 5

                          ? (isHorrorParty ? '#D9B879' : '#805000')

                          : (isHorrorParty ? '#BDB0A5' : '#655B4C'),

                                      border: 'none',

                                      boxShadow: 'none',
                                      }}>
                                        {r.max_streak >= 10 ? '🔥' : (

                                        <span style={{

                                          color: r.max_streak >= 5

                                            ? (isHorrorParty ? '#D9B879' : '#805000')

                                            : (isHorrorParty ? '#BDB0A5' : '#655B4C'),

                                          fontSize: r.max_streak >= 5 ? '0.8rem' : '0.65rem',

                                          fontWeight: 900,

                                        }}>

                                          {r.max_streak >= 5 ? '⚡︎' : '◆'}

                                        </span>

                                      )}

                                      {Number(r.max_streak)}연속
                                      </div>
                                    )}

                                  </div>
                          </div>
                        )
                      })}

                      {myRank && myRank > TOP_LIMIT && (
                        <div style={{
                          marginTop: 8,
                          padding: '12px 14px',
                          borderRadius: 14,
                          background: isSciFi
                            ? 'rgba(7,45,60,.95)'
                            : '#fff5f6',

                          border: isSciFi
                            ? '2px solid rgba(0,229,255,.9)'
                            : '2px solid #e8808c',
                          boxShadow: isSciFi
                            ? '0 0 12px rgba(0,217,245,.20)'
                            : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10
                        }}>
                          <div style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            color: isSciFi ? '#FFFFFF' : '#e8808c'
                          }}>
                            내 순위
                          </div>

                          <div style={{
                            fontSize: '1rem',
                            fontWeight: 900,
                            color: isSciFi ? '#00E5FF' : '#e8808c'
                          }}>
                            {myRank}위
                          </div>
                          <CharAvatar charId={selChar} size={28} />
                          <div style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: isSciFi ? '#FFFFFF' : undefined,
                            flex: 1,
                            minWidth: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {myRankData?.nickname || 'USER'}
                          </div>
                          {/* 내 점수 및 최고 연속 정답 기록 */}

                          <div style={{

                            display: 'flex',

                            flexDirection: 'column',

                            alignItems: 'flex-end',

                            justifyContent: 'center',

                            gap: 4,

                            flexShrink: 0,

                            whiteSpace: 'nowrap'

                          }}>

                            {/* 내 점수 */}

                            <div style={{

                              fontSize: '0.9rem',

                              fontWeight: 900,

                              color: isSciFi ? '#00E5FF' : undefined,

                              lineHeight: 1.1

                            }}>

                              {(displayScore || 0).toLocaleString()}

                            </div>

                            {/* 내 최고 연속 정답 기록 */}

                            <div style={{

                              fontSize: '0.6rem',

                              fontWeight: 700,

                              color: isSciFi ? '#FFD58A' : '#96703A',

                              lineHeight: 1.1

                            }}>

                              최고 {Number(myRankData?.max_streak || 0)}연속

                            </div>

                          </div>
                        </div>
                      )}

                        </div>

                  )

                })()}
              </>
            )}
          </div>
        </div>

        {/* 하단 영역 */}
        {visibleResults >= results.length && (
          <div style={{
            flexShrink: 0,
            padding: '12px 20px calc(10px + env(safe-area-inset-bottom))',
            marginTop: resultView === 'score' ? 8 : 0,
            display: 'flex',
            gap: 10,
            background: 'transparent',

          }}>

            {/* 🔥 조건 버튼 */}
            {!isLevelCompleted && (
              <button

                style={{
                  flex: 1,
                  height: 54,
                  borderRadius: 14,
                  background: (isSciFi || isKorea || selGrade === 'anime' || selGrade === 'thriller' || selGrade === 'hk')
                    ? `url(${skin.buttons.nextQuiz}) center / 100% 100% no-repeat`
                    : isHorrorParty
                      ? `url(${skin.buttons.nextHint}) center / 100% 100% no-repeat`
                      : '#e3d5bc',

                  color: (isSciFi || isKorea || selGrade === 'anime' || selGrade === 'thriller' || selGrade === 'hk')
                    ? skin.colors.resultButtonText
                    : isHorrorParty
                      ? '#7a0d0d'
                      : '#2b2218',
                  textShadow: selGrade === 'thriller'
                    ? skin.colors.buttonShadow
                    : 'none',
                  fontSize: '0.8rem',

                  fontWeight: isDefaultSkin ? 800 : 700,

                  border: 'none',

                  boxShadow: isDefaultSkin

                    ? `

                      inset 0 3px 5px rgba(255,255,255,0.4),

                      inset 0 -5px 10px rgba(0,0,0,0.2),

                      0 4px 8px rgba(0,0,0,0.3)

                    `

                    : 'none',

                  cursor: 'pointer'
                }}
                onClick={() => {
                  playSound('click')
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
                borderRadius: isDefaultSkin ? 14 : 12,
                background: (isSciFi || isKorea || selGrade === 'anime' || selGrade === 'thriller' || selGrade === 'hk')
                  ? `url(${skin.buttons.nextQuiz}) center / 100% 100% no-repeat`
                  : isHorrorParty
                    ? `url(${skin.buttons.nextHint}) center / 100% 100% no-repeat`
                    : '#fff',

                color: (isSciFi || isKorea || selGrade === 'anime' || selGrade === 'thriller' || selGrade === 'hk')
                  ? skin.colors.resultButtonText
                  : isHorrorParty
                    ? '#7a0d0d'
                    : '#6d5842',
                textShadow: selGrade === 'thriller'
                  ? skin.colors.buttonShadow
                  : 'none',
                fontSize: '0.8rem',
                fontWeight: isDefaultSkin ? 800 : 700,

                boxShadow: isDefaultSkin

                  ? `

                    inset 0 3px 5px rgba(255,255,255,0.8),

                    inset 0 -5px 10px rgba(0,0,0,0.12),

                    0 4px 8px rgba(0,0,0,0.25)

                  `

                  : 'none',

                cursor: 'pointer',
                border: (isSciFi || isKorea || selGrade === 'anime' || selGrade === 'thriller' || selGrade === 'hk')
                  ? 'none'
                  : '1.5px solid #e8e4dd',
              }}
              onClick={() => {
                playSound('click')
                setScreen('grade')
              }}
            >
              홈으로
            </button>
          </div>
        )}

        {/* 점수 이동 애니메이션 레이어 */}

        <div

          ref={flightLayerRef}

          style={{

            position: 'fixed',

            inset: 0,

            pointerEvents: 'none',

            zIndex: 9999

          }}

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

                        @keyframes posterSlam {

  0% {

    opacity: 0;

    transform: scale(2.2);

  }

  10% {

    opacity: 1;

    transform: scale(1.9);

  }

  45% {

    opacity: 1;

    transform: scale(0.94);

  }

  65% {

    transform: scale(1.035);

  }

  100% {

    opacity: 1;

    transform: scale(1);

  }

}

@keyframes posterImpact {

  0% {

    transform: perspective(600px) rotateY(0deg);

  }

  18% {

    transform: perspective(600px) rotateY(-22deg);

  }

  40% {

    transform: perspective(600px) rotateY(17deg);

  }

  62% {

    transform: perspective(600px) rotateY(-10deg);

  }

  82% {

    transform: perspective(600px) rotateY(5deg);

  }

  100% {

    transform: perspective(600px) rotateY(0deg);

  }

}
                      `}</style>
      </div>
    </AppLayout>
  )
}