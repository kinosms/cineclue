'use client'

import { playSound} from '../library/audioManager'
import { isAndroidApp } from '../utils/platform'
import { getModeSkin } from './ModeSkins'

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
    saveCollection,
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
            : `url(${skin.background}) center / cover no-repeat`,

          display: 'flex',

          flexDirection: 'column',

          padding: '12px 0 8px',

        }}

      >

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

          <div style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            color: skin.colors.resultTotalScore,
            textShadow: (isKorea || ['anime', 'thriller'].includes(selGrade))
              ? skin.colors.resultTotalScoreShadow
              : 'none',
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
                padding: '6px 12px',
                borderRadius: 20,

                border: isSciFi
                  ? '1px solid rgba(0,217,245,.65)'
                  : '0.6px solid #ddd',

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
        <div style={{ position: 'relative' }}>
          {/* 정답보기-AD 버튼 */}
          {resultView === 'score' && hasFail && !showAnswers && (
            <button

              onClick={async () => {
                playSound('click')
                try {
                  await handleShowAnswers()
                } catch (e) {
                  console.error('RESULT_BUTTON_ERROR=', e)
                  showAppToast?.('광고를 불러오지 못했습니다')
                }
              }}
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
                background: '#9d3642',
                color: '#ffffff',
                fontWeight: 600
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
              results.slice(0, Math.min(visibleResults, 5)).map((r, i) => {
                const isCorrect = r.correct === true
                const hasMovieInfo =
                  r.tmdb_id ||
                  r.poster_path ||
                  r.overview
                return (
                  <div

                    key={i}
                    onClick={async () => {

                      if (

                        (r.correct || showAnswers) &&

                        hasMovieInfo

                      ) {

                        saveCollection(r)

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

                      }

                    }}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 13,
                      border: skin.colors.resultCardBorder,
                      background: skin.colors.resultCardBg,
                      padding: '12px 16px',
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      color: skin.colors.resultCardText,
                      boxShadow: skin.colors.resultCardGlow,
                      backdropFilter: isHorrorParty
                        ? 'blur(8px)'
                        : 'none',
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
                            opacity: 0.85,
                            zIndex: 0,
                            pointerEvents: 'none'
                          }}
                        />
                        {/* 가독성용 화이트 그라데이션 */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: isSciFi
                            ? 'linear-gradient(to right, rgba(5,15,25,.92) 0%, rgba(5,15,25,.55) 35%, rgba(5,15,25,.08) 55%, rgba(5,15,25,.55) 80%, rgba(5,15,25,.85) 100%)'
                            : 'linear-gradient(to right, rgba(0,0,0,.68) 0%, rgba(0,0,0,.42) 35%, rgba(0,0,0,.05) 55%, rgba(0,0,0,.35) 80%, rgba(0,0,0,.65) 100%)',
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
                      background: isSciFi
                        ? 'rgba(5,25,35,.95)'
                        : isHorrorParty
                          ? isCorrect
                            ? '#7b0000'
                            : 'rgba(255,255,255,.10)'
                          : ['thriller', 'hk', 'anime'].includes(selGrade)
                            ? '#f3ead8'
                            : isCorrect
                              ? '#f3ead8'
                              : '#f5f3ef',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: isSciFi
                        ? '1.5px solid #00E5FF'
                        : isHorrorParty
                          ? isCorrect
                            ? '1.5px solid rgba(255,120,120,.65)'
                            : '1.5px solid rgba(255,255,255,.18)'
                          : ['thriller', 'hk', 'anime'].includes(selGrade)
                            ? '1.5px solid #d6bd8c'
                            : `1.5px solid ${isCorrect ? '#d6bd8c' : '#e8e4dd'}`,
                      boxShadow: isSciFi
                        ? '0 0 6px rgba(0,229,255,.45), inset 0 0 5px rgba(0,229,255,.15)'
                        : 'none'
                        }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: isSciFi
                          ? '#00E5FF'
                          : isHorrorParty
                            ? isCorrect
                              ? '#fff'
                              : 'rgba(255,255,255,.45)'
                            : ['thriller', 'hk', 'anime'].includes(selGrade)
                              ? '#7a5a28'
                              : isCorrect
                                ? '#7a5a28'
                                : '#b0aaa3',
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
                        color: (r.correct || showAnswers)

                          ? selGrade === 'anime' && r.poster_path

                            ? '#FFFFFF'

                            : isKorea

                              ? r.poster_path ? '#FFF3DC' : '#42301F'

                              : selGrade === 'hk' && !r.poster_path

                                ? '#423923'

                                : skin.colors.resultMovieTitle

                          : skin.colors.resultFailText,
                        lineHeight: 1.25,
                        textShadow: '0 1px 3px rgba(0,0,0,.95), 0 0 6px rgba(0,0,0,.65)',
                        wordBreak: 'keep-all',
                        textShadow: isHorrorParty

                          ? '0 2px 5px rgba(0,0,0,.95)'

                          : selGrade === 'anime'

                            ? r.poster_path && (r.correct || showAnswers)

                              ? '0 2px 4px rgba(0,0,0,.85)'

                              : 'none'

                            : selGrade === 'hk'

                              ? !r.correct && !showAnswers

                                ? 'none'

                                : r.poster_path

                                  ? '0 1px 3px rgba(0,0,0,.85)'

                                  : 'none'

                              : 'none',
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
                        color: r.correct

                          ? selGrade === 'anime' && r.poster_path

                            ? '#A8DCFF'

                            : isKorea

                              ? r.poster_path ? '#FFD58A' : '#A83228'

                              : skin.colors.resultScoreText

                          : skin.colors.resultScoreFail,
                        textShadow: selGrade === 'anime'
                          ? r.poster_path && r.correct
                            ? '0 2px 4px rgba(0,0,0,.85)'
                            : 'none'
                          : isKorea
                            ? r.poster_path
                              ? '0 2px 4px rgba(0,0,0,.85)'
                              : 'none'
                            : (selGrade === 'hk' || selGrade === 'thriller' || isSciFi)
                              ? '0 1px 3px rgba(0,0,0,.95), 0 0 6px rgba(0,0,0,.65)'
                              : '0 1px 3px rgba(255,255,255,.85)',
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
                        color: selGrade === 'anime' && r.poster_path

                          ? '#FFFFFF'

                          : skin.colors.resultMovieTitle,
                        textShadow: selGrade === 'anime'

                          ? r.poster_path

                            ? '0 2px 4px rgba(0,0,0,.85)'

                            : 'none'

                          : (selGrade === 'hk' || selGrade === 'thriller' || isSciFi)

                            ? '0 1px 3px rgba(0,0,0,.95), 0 0 6px rgba(0,0,0,.65)'

                            : '0 1px 3px rgba(255,255,255,.85)',
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
                    <>
                      {Array.from({ length: rankingRevealDone ? TOP_LIMIT : 5 }).map((_, i) => {
                        const r = safeRanking[i] || null
                        const char = r ? CHARS.find(c => c.id === r.character_id) : null
                        const isMe =
                          r &&
                            String(r.user_id) === String(currentUser?.userId)
                        const isAnimated = !skipResultAnimation && i < 5

                        return (
                          <div
                            key={i}
                            style={{
                              borderRadius: 13,
                              border: isSciFi
                                ? isMe
                                  ? '1.5px solid rgba(0,229,255,.9)'
                                  : '1px solid rgba(0,217,245,.45)'
                                : isHorrorParty
                                  ? isMe
                                    ? '1.5px solid rgba(190,30,30,.65)'
                                    : '1px solid rgba(130,20,20,.35)'
                                  : isMe
                                    ? '2px solid #d6b16a'
                                    : '1.5px solid #d9c7a5',
                              background: isSciFi
                                ? isMe
                                  ? 'rgba(7,45,60,.95)'
                                  : 'rgba(5,15,25,.90)'
                                : isHorrorParty
                                  ? isMe
                                    ? 'rgba(55,18,18,.92)'
                                    : 'rgba(24,24,24,.88)'
                                  : isMe
                                    ? '#fff1d2'
                                    : '#f8f3e7',
                              color: isSciFi
                                ? '#F2FAFF'
                                : isHorrorParty
                                  ? '#f2f2f2'
                                  : '#2b2218',
                              boxShadow: isSciFi
                                ? '0 0 10px rgba(0,217,245,.15)'
                                : isHorrorParty
                                  ? '0 8px 22px rgba(0,0,0,.35)'
                                  : '0 4px 12px rgba(80,60,30,.10)',
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
                              background:
                              r?.rank === 1
                                ? 'linear-gradient(135deg,#ffe89a,#ffd54f)'
                                : r?.rank === 2
                                  ? 'linear-gradient(135deg,#f7f7f7,#cfd8dc)'
                                  : r?.rank === 3
                                    ? 'linear-gradient(135deg,#f6d0a8,#d89b63)'
                                  : isHorrorParty
                                    ? 'rgba(255,255,255,.10)'
                                    : '#f5f3ef',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border:
                                r?.rank === 1
                                  ? '1.5px solid #f4c542'
                                  : r?.rank === 2
                                    ? '1.5px solid #b0bec5'
                                    : r?.rank === 3
                                      ? '1.5px solid #c7864e'
                                      : isHorrorParty
                                        ? '1.5px solid rgba(255,255,255,.18)'
                                        : '1.5px solid #e8e4dd',
                              flexShrink: 0
                            }}>
                              <span style={{
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                color:
                                r?.rank === 1
                                  ? '#6a4300'     // 금
                                  : r?.rank === 2
                                    ? '#4d5560'   // 은
                                    : r?.rank === 3
                                      ? '#6b3d16' // 동
                                      : isHorrorParty
                                        ? 'rgba(255,255,255,.75)'
                                        : '#666'
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
                                    size={28}
                                  />
                                </div>
                                {/* 📊 배지 */}
                                <div
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
                            {/* 점수 */}
                            <div style={{
                              fontSize: '0.85rem',
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

                          <div style={{
                            fontSize: '0.9rem',
                            fontWeight: 900,
                            color: isSciFi ? '#00E5FF' : undefined,
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
            padding: '10px 20px calc(10px + env(safe-area-inset-bottom))',
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
                  fontWeight: 700,
                  border: 'none'
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
                borderRadius: 12,
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
                fontWeight: 700,
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