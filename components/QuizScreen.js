'use client'

export default function QuizScreen(props) {

  const {

    loading,

    pool,

    qi,

    MODES,

    selGrade,

    getPts,

    mode,

    isFlashing,

    CharacterSpinner,

    normalize,
    AppLayout,

    selChar,

    users,

    lives,

    lifeDelta,

    quizMode,

    setIsFlashing,

    sh,

    g,

    fb,

    fbt,

    scrollRef,

    showReportMenu,

    setShowReportMenu,

    currentUser,

    showReportToast,

    setShowReportToast,

    answered,

    input,

    setInput,

    suggestions,

    setSuggestions,

    selectedSuggestion,

    setSelectedSuggestion,

    allMovies,

    inputRef,

    submit,

    playClick,

    nextH,

    nextQ,

    doSkip,

    choices,

    selectedChoice,

    setSelectedChoice,

    lockChoice,

    progress,

    currnet,

    buttonActive,

    showSynopsis,

    setShowSynopsis,

    trailerKey,

    setTrailerKey,

    showSpinner,

    FlashLetterHint,

    CharAvatar,

  } = props



  if (loading || !pool || pool.length === 0 || !pool[qi]) {

    return (

      <div style={{

        height: '100vh',

        display: 'flex',

        alignItems: 'center',

        justifyContent: 'center',

        background: '#fff'

      }}>

        <CharacterSpinner />

      </div>

    )

  }

  const m = pool[qi]
  const currentMode = MODES.find(mode => mode.key === selGrade)
  const basePoint = getPts(mode)
  const safeSuggestions = suggestions || []

  const safeAllMovies = allMovies || []


  return (
    <AppLayout>
      <div style={{
        width: '100%',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100dvh',
        overflow: 'hidden'
      }}>

        {/*퀴즈화면 시작시 스피너 사라짐*/}
        {showSpinner && (
          <CharacterSpinner fadeOut={!showSpinner} />
        )}

        {/* 헤더 영역 */}
        <div style={{
          background: '#fff',
          borderBottom: '1px solid #f0ece6',
          padding: '14px 20px 10px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 20
        }}>

          {/* 1️⃣ 상단 영역 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            marginBottom: 6
          }}>

            {/* 캐릭터 / 포인트 영역 */}
            <div style={{ position: 'relative', width: 42, height: 42 }}>

              {/* 🔥 life 변화 표시 (추가) */}
              {lifeDelta !== null && (
                <div style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  padding: '2px 6px',
                  borderRadius: 10,
                  color:
                    lifeDelta === -1 ? '#ff3b3b' :
                      lifeDelta === 5 ? '#4caf50' :
                        '#434343',
                  animation: 'popLife 0.8s ease forwards',
                  pointerEvents: 'none',
                  zIndex: 10,
                  textShadow: '0 1px 2px rgba(0,0,0,0.35)'
                }}>
                  {lifeDelta > 0 ? `+${lifeDelta}` : lifeDelta}
                </div>
              )}

              {/* 목숨 링 */}
              <svg width="42" height="42" style={{
                position: 'absolute',
                top: 0,
                left: 0
              }}>

                {/* 배경 */}
                <circle
                  cx="21"
                  cy="21"
                  r="18"
                  stroke="#eee"
                  strokeWidth="5"
                  fill="none"
                />

                {/* 🔥 실제 게이지 + 깜빡임 (하나로 합침) */}
                <circle
                  cx="21"
                  cy="21"
                  r="18"
                  stroke={lives <= 3 ? '#ff3b3b' : '#4caf50'}
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray={113}
                  strokeDashoffset={113 * (1 - lives / 30)}
                  strokeLinecap="round"
                  style={{
                    transition: 'all 0.3s ease',
                    animation: lives <= 3 ? 'blinkRed 0.8s infinite' : 'none'
                  }}
                />
              </svg>

              {/* 🔥 캐릭터 (중앙 정렬 핵심) */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}>
                <CharAvatar charId={selChar} size={34} />
              </div>
            </div>

            {/* 닉네임과 게임모드 */}
            <div style={{
              flex: 1,
              marginLeft: 8,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 2
            }}>
              <div style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                color: '#5c5b5a',
                letterSpacing: '0.04em'
              }}>
                [{currentMode?.label}]
              </div>
              <div style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#1a1814',
                lineHeight: 1.1
              }}>
                {users.find(u => u.charId === selChar)?.nickname || 'USER'}
              </div>
            </div>

            {/* 퀴즈점수 */}
            <div style={{
              fontSize: '0.9rem',
              fontWeight: 900,
              color: '#ff6b7a',
              whiteSpace: 'nowrap'
            }}>
              {basePoint}pt
            </div>
          </div>


          {/* 2️⃣ 버블영역 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
            width: '100%'
          }}>

            {/* 문제 번호 */}
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: 20,
              background: '#f5f3ef',
              color: '#6b6560',
              border: '1px solid #e8e4dd',
              width: 42,
              textAlign: 'center',
              flexShrink: 0
            }}>
              {qi + 1}/5
            </span>

            {/* 연도 */}
            {m.year && (
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '3px 0',
                borderRadius: 20,
                background: '#f5a3a3',
                color: '#fff',
                width: 48,
                textAlign: 'center',
                flexShrink: 0
              }}>
                {m.year}
              </span>
            )}

            {/* 국가 */}
            {m.country && (
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 20,
                background: '#e8f0fc',
                color: '#3a6abf',
                border: '1px solid #c0d4f8',
                flexShrink: 0   // 🔥 추가
              }}>
                {m.country}
              </span>
            )}

            {/* 장르 */}
            {m.final_genre && (
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 20,
                background: '#e8f5ee',
                color: '#2e8a52',
                border: '1px solid #a8dfc0',
                flexShrink: 0
              }}>
                {m.final_genre}
              </span>
            )}

            {/* 수상내역 */}
            {m.awards && (() => {
              try {
                const arr = JSON.parse(m.awards)
                if (!arr.length) return null
                return (
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 20,
                    background: '#fff3e0',
                    color: '#cc7a00',
                    border: '1px solid #ffd8a8',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flexShrink: 1,
                    maxWidth: 120
                  }}>
                    {arr[0]}
                  </span>
                )
              } catch {
                return null
              }
            })()}
          </div>
        </div>

        {/* 콤보배너 영역*/}
        {mode && (
          <div style={{
            margin: '8px 16px 0',
            borderRadius: 10,
            position: 'relative',
            overflow: 'hidden',
            padding: '7px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background:
              mode === 'good' ? '#fff7e6' :
                mode === 'wow' ? '#fff0f0' :
                  mode === 'crazy' ? '#f3e8ff' : '#fff',

            border: `1px solid ${mode === 'good' ? '#f0c36d' :
              mode === 'wow' ? '#f0b4b4' :
                mode === 'crazy' ? '#c8a8ff' : '#eee'
              }`,
            flexShrink: 0
          }}>

            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 10,
              zIndex: 0,
              opacity: 0.6,
              filter: 'blur(10px)',
              background:
                mode === 'good' ? '#ffe08a' :
                  mode === 'wow' ? '#ff9e9e' :
                    mode === 'crazy' ? '#b388ff' : 'transparent',
              animation:
                mode === 'good' ? 'glowPulse 1.2s ease-in-out infinite' :
                  mode === 'wow' ? 'glowPulse 0.8s ease-in-out infinite' :
                    mode === 'crazy' ? 'glowPulse 0.4s ease-in-out infinite' :
                      'none'
            }} />
            <span style={{
              position: 'relative',
              zIndex: 1,
              fontSize: '0.72rem',
              fontWeight: 800,
              color:
                mode === 'good' ? '#c8a84a' :
                  mode === 'wow' ? '#d45c5c' :
                    mode === 'crazy' ? '#9b5cff' :
                      '#aaa'
            }}>
              {
                mode === 'good' ? '👍 어? 좀 치는데? 이제 시작이다 그대로 달리자 !!' :
                  mode === 'wow' ? '💀 뇌야 돌아라!! 손아 날아라!! 이건 끝까지 간다!! 💀' :
                    mode === 'crazy' ? '🔥 미친 상승감!!! 제니퍼 로페즈 아나콘다!! 스스메!! 🔥' :
                      ''
              }
            </span>

            <span style={{
              fontSize: '0.68rem',
              color:
                mode === 'good' ? '#342907' :
                  mode === 'wow' ? '#630c0c' :
                    mode === 'crazy' ? '#3b1678' :
                      '#aaa'
            }}>
              {comboStreak}연속 ×{
                mode === 'good' ? 3 :
                  mode === 'wow' ? 4 :
                    mode === 'crazy' ? 5 : 1
              }
            </span>
          </div>
        )}

        {/* 주관식모드에서 한글자 힌트 효과 */}
        {quizMode === 'subjective' && (
          <FlashLetterHint
            title={m.title}
            hintLevel={sh}
            onFlash={setIsFlashing}
          />
        )}

        {/* ── 스크롤 영역 ── */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            pointerEvents: 'auto',
            WebkitOverflowScrolling: 'touch',
            padding: '12px 16px 24px',
            overflowAnchor: 'none',
            scrollBehavior: 'auto',
            touchAction: 'pan-y'
          }}>

          {/* 힌트 리스트 영역 */}
          {Array.from({ length: 5 }).map((_, i) => {
            if (i >= sh) return null

            const isCurrent = i === sh - 1

            return (
              <div
                key={i}
                style={{
                  animation: 'hintSlideDown 0.9s ease'
                }}>
                <div style={{
                  borderRadius: 13,
                  border: `1.5px solid ${isCurrent ? (g?.color || '#e8808c') : '#ece8e2'}`,
                  background: isCurrent ? (g?.bg || '#fff5f6') : '#fff',
                  padding: '13px 15px',
                  marginBottom: 8
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: g?.color || '#e8808c',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {i + 1}
                    </span>

                    <div style={{
                      fontSize: '0.82rem',
                      lineHeight: 1.7
                    }}>
                      {m.hintsArr?.[i] || '힌트 로딩중...'}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* 하단 입력 & 버튼 영역 */}
          <div style={{
            background: '#fff',
            marginTop: 16,
            paddingBottom: '20px',
            flexShrink: 0
          }}>
            {fb && fbt !== 'ok' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8
              }}>

                {/* 메시지 */}
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: fbt === 'ok'
                    ? '#4a9c6d'
                    : '#d45c5c'
                }}>
                  {fb}
                </div>

                {/* 오답일 때만 신고 */}
                {fbt === 'sk' && (
                  <div style={{
                    position: 'relative'
                  }}>
                    <button
                      onClick={() =>
                        setShowReportMenu(v => !v)
                      }
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: 'rgba(92, 91, 91, 0.72)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        padding: 2
                      }}>
                      신고
                    </button>

                    {showReportMenu && (
                      <div style={{
                        position: 'absolute',
                        right: 0,
                        bottom: '100%',
                        marginBottom: 6,
                        background: '#fff',
                        border: '1px solid #ece8e2',
                        borderRadius: 12,
                        overflow: 'hidden',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        zIndex: 100,
                        minWidth: 96
                      }}>
                        <button
                          onClick={async () => {
                            setShowReportMenu(false)
                            await safeQuery(

                              supabase

                                .from('hint_reports')

                                .insert({

                                  movie_id: m.id,

                                  title: m.title,

                                  report_type: 'title',

                                  user_id: String(currentUser.userId),

                                  nickname: currentUser.nickname

                                }),

                              'report title error'

                            )
                            setShowReportToast(true)
                            setTimeout(() => {
                              setShowReportToast(false)
                            }, 1600)
                          }}
                          style={{
                            width: '100%',
                            border: 'none',
                            background: '#fff',
                            padding: '10px 12px',
                            fontSize: '0.74rem',
                            textAlign: 'left'
                          }}>
                          제목 오류
                        </button>

                        <button
                          onClick={async () => {
                            setShowReportMenu(false)
                            await safeQuery(

                              supabase

                                .from('hint_reports')

                                .insert({

                                  movie_id: m.id,

                                  title: m.title,

                                  report_type: 'hint',

                                  user_id: String(currentUser.userId),

                                  nickname: currentUser.nickname

                                }),

                              'report hint error'

                            )
                            setShowReportToast(true)
                            setTimeout(() => {
                              setShowReportToast(false)
                            }, 1600)
                          }}
                          style={{
                            width: '100%',
                            border: 'none',
                            background: '#fff',
                            padding: '10px 12px',
                            fontSize: '0.74rem',
                            textAlign: 'left',
                            borderTop: '1px solid #f2efea'
                          }}>
                          힌트 오류
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 정답영화 영역 */}
            {!answered ? (
              <>
                {/* 힌트보기 & 넘기기 버튼 영역*/}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  <button
                    onClick={() => {
                      const el = scrollRef.current
                      const prev = el.scrollHeight
                      nextH()
                      requestAnimationFrame(() => {
                        el.scrollTop += el.scrollHeight - prev
                      })
                    }}
                    disabled={sh >= 5 || lockChoice || isFlashing}
                    style={{
                      flex: 1,
                      height: 40,
                      borderRadius: 10,
                      fontSize: '0.8rem',
                      background: '#f5f3ef',
                      opacity: (sh >= 5 || lockChoice || isFlashing) ? 0.4 : 1,
                      pointerEvents: (sh >= 5 || lockChoice || isFlashing) ? 'none' : 'auto'
                    }}>
                    다음 힌트
                  </button>

                  <button
                    onClick={() => {
                      playClick()
                      doSkip()
                    }}
                    style={{
                      flex: 1,
                      height: 40,
                      position: 'relative',
                      overflow: 'hidden',
                      padding: '12px 20px',
                      background: '#f5f3ef',
                      border: 'none',
                      borderRadius: '8px',
                      padding: 0,
                      transform: buttonActive ? 'scale(0.95)' : 'scale(1)',
                      transition: 'transform 0.1s ease'
                    }}>
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: `${progress}%`,
                        background: 'rgb(153, 153, 153)',
                        transition: 'width 0.5s linear',
                        fontSize: '0.8rem',
                        zIndex: 0
                      }} />
                    <span style={{
                      position: 'relative', zIndex: 1
                    }}>
                      넘기기
                    </span>
                  </button>
                </div>


                {/*객관식 모드 답 선택영역 */}
                {quizMode === 'objective' ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8,
                    marginBottom: 8
                  }}>
                    {choices.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (selectedChoice === c) return
                          setSelectedChoice(c)
                          submit(c)
                        }}
                        disabled={lockChoice}
                        style={{
                          height: 52,
                          borderRadius: 10,
                          border: '1px solid #ddd',
                          background: selectedChoice === c ? '#1a1814' : '#fff',
                          color: selectedChoice === c ? '#fff' : '#000',
                          fontWeight: 600,
                          opacity: lockChoice ? 0.4 : 1,
                          pointerEvents: lockChoice ? 'none' : 'auto',
                          transition: 'opacity 0.2s ease'
                        }}>
                        <div style={{
                          padding: '2px 6px',
                          textAlign: 'center',
                          lineHeight: 1.25,
                          wordBreak: 'keep-all'
                        }}>
                          {c}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* 주관식 모드 답 입력영역 */}
                    <div style={{
                      position: 'relative',
                      marginBottom: 8
                    }}>
                      <div style={{
                        display: 'flex',
                        gap: 8,
                        marginBottom: 8
                      }}>
                        <input
                          ref={inputRef}
                          value={input}
                          onChange={e => {
                            const v = e.target.value
                            setInput(v)

                            // 입력 없으면 초기화
                            if (!v.trim()) {
                              setSuggestions([])
                              return
                            }

                            // 전체 영화 아직 로딩 안됐으면 중단
                            if (!allMovies.length) return
                            const keyword = normalize(v)
                            const starts = []
                            const includes = []

                            allMovies.forEach(m => {
                              const title = normalize(m.title)

                              if (title.startsWith(keyword)) {
                                starts.push(m)
                              } else if (title.includes(keyword)) {
                                includes.push(m)
                              }
                            })

                            const filtered = [
                              ...starts.sort((a, b) => a.title.localeCompare(b.title)),
                              ...includes.sort((a, b) => a.title.localeCompare(b.title))
                            ].slice(0, 5)
                            setSuggestions(filtered)
                          }}
                          onKeyDown={e => {
                            // ↓ 아래 이동
                            if (e.key === 'ArrowDown') {
                              e.preventDefault()
                              setSelectedSuggestion(prev =>
                                Math.min(prev + 1, suggestions.length - 1)
                              )
                              return
                            }
                            // ↑ 위 이동
                            if (e.key === 'ArrowUp') {
                              e.preventDefault()
                              setSelectedSuggestion(prev =>
                                Math.max(prev - 1, 0)
                              )
                              return
                            }
                            // 엔터 선택
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              // 자동완성 선택
                              if (
                                selectedSuggestion >= 0 &&
                                suggestions[selectedSuggestion]
                              ) {
                                setInput(suggestions[selectedSuggestion].title)
                                setSuggestions([])
                                setSelectedSuggestion(-1)
                                return
                              }
                              // 일반 제출
                              submit()
                            }
                          }}
                          placeholder="영화 제목 입력"
                          style={{
                            flex: 1,
                            height: 46,
                            borderRadius: 11,
                            border: '1.5px solid #e8e4dd',
                            background: '#faf9f7',
                            padding: '0 14px'
                          }}
                        />
                        <button
                          onClick={() => {
                            playClick()
                            submit()
                          }}
                          style={{
                            width: 72,
                            height: 46,
                            borderRadius: 11,
                            background: '#e8808c',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            border: 'none'
                          }}>
                          정답
                        </button>
                      </div>

                      {/* 입력 자동완성 */}
                      {suggestions.length > 0 && (
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          top: 52,
                          background: '#fff',
                          border: '1px solid #ddd',
                          borderRadius: 10,
                          overflow: 'hidden',
                          zIndex: 50
                        }}>
                          {suggestions.map((s, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                setInput(s.title)
                                setSuggestions([])
                                inputRef.current?.focus()
                              }}
                              style={{
                                padding: '10px 12px',
                                fontSize: '0.8rem',
                                borderBottom: '1px solid #eee',
                                cursor: 'pointer',
                                background:
                                  selectedSuggestion === i
                                    ? '#f3f0eb'
                                    : '#fff',
                                color:
                                  selectedSuggestion === i
                                    ? '#1a1814'
                                    : '#555',
                                fontWeight:
                                  selectedSuggestion === i
                                    ? 700
                                    : 500,
                                transition: 'all .12s ease'
                              }}>
                              {s.title}
                            </div>
                          ))}
                        </div>
                      )}


                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                {/* 정답영화정보 영역 */}
                {fbt === 'ok' && (
                  <div style={{
                    marginTop: 22,
                    marginBottom: 14
                  }}>
                    <div style={{
                      position: 'relative',
                      marginBottom: 10
                    }}>

                      {/* 정답 제목 */}
                      <div style={{
                        fontSize: '1.3rem',
                        fontWeight: 900,
                        color: '#c8a84a',
                        marginBottom: 4,
                        textAlign: 'center',
                        lineHeight: 1.3
                      }}>
                        {m.title}
                      </div>

                      {/* 신고 버튼 */}
                      <div style={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}>
                        <button
                          onClick={() =>
                            setShowReportMenu(v => !v)
                          }
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: 'rgba(103, 103, 103, 0.7)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            padding: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          신고
                        </button>

                        {/* 신고 메뉴 */}
                        {showReportMenu && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: 0.2,
                            background: '#fff',
                            border: '1px solid #ece8e2',
                            borderRadius: 12,
                            overflow: 'hidden',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                            zIndex: 50,
                            minWidth: 95
                          }}>
                            {/* 제목 오류 */}
                            <button
                              onClick={async () => {
                                setShowReportMenu(false)
                                await safeQuery(

                                  supabase
                                    .from('hint_reports')
                                    .insert({

                                      movie_id: m.id,

                                      title: m.title,

                                      report_type: 'title',

                                      user_id: String(currentUser.userId),

                                      nickname: currentUser.nickname

                                    }),

                                  'report title error'

                                )
                                setShowReportToast(true)
                                setTimeout(() => {
                                  setShowReportToast(false)
                                }, 1600)
                              }}
                              style={{
                                width: '100%',
                                border: 'none',
                                background: '#fff',
                                padding: '11px 14px',
                                fontSize: '0.78rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f1efeb'
                              }}>
                              제목 오류
                            </button>

                            {/* 힌트 오류 */}
                            <button
                              onClick={async () => {
                                setShowReportMenu(false)
                                await safeQuery(

                                  supabase

                                    .from('hint_reports')

                                    .insert({

                                      movie_id: m.id,

                                      title: m.title,

                                      report_type: 'hint',

                                      user_id: String(currentUser.userId),

                                      nickname: currentUser.nickname

                                    }),

                                  'report hint error'

                                )
                                setShowReportToast(true)
                                setTimeout(() => {
                                  setShowReportToast(false)
                                }, 1600)
                              }}
                              style={{
                                width: '100%',
                                border: 'none',
                                background: '#fff',
                                padding: '11px 14px',
                                fontSize: '0.78rem',
                                textAlign: 'center',
                                cursor: 'pointer'
                              }}>
                              힌트 오류
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 영화 카드 */}
                    <div style={{
                      borderRadius: 22,
                      overflow: 'hidden',
                      border: '1.5px solid #ece8e2',
                      background: '#fff',
                      padding: 16,
                      marginBottom: 14
                    }}>

                      <div style={{
                        display: 'flex',
                        gap: 15,
                        alignItems: 'stretch'
                      }}>

                        {/* 포스터 */}
                        <div style={{
                          width: 100,
                          height: 150,
                          borderRadius: 16,
                          overflow: 'hidden',
                          flexShrink: 0,
                          background: '#f5f3ef'
                        }}>

                          {m.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                              alt=""
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <img
                              src="/no_poster.webp"
                              alt="No Poster"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          )}
                        </div>

                        {/* 정보 */}
                        <div style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          minWidth: 0
                        }}>

                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 5
                          }}>

                            {/* 연도 */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              fontSize: '0.75rem',
                              color: '#555'
                            }}>
                              <span style={{
                                width: 38,
                                flexShrink: 0,
                                whiteSpace: 'nowrap',
                                fontSize: '0.75rem'
                              }}>개봉</span>
                              <span>{m.year || '-'}</span>
                            </div>

                            {/* 국가 */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              fontSize: '0.75rem',
                              color: '#555'
                            }}>
                              <span style={{
                                width: 38,
                                flexShrink: 0,
                                whiteSpace: 'nowrap',
                                fontSize: '0.75rem'
                              }}>국가</span>
                              <span>{m.country || '-'}</span>
                            </div>


                            {/* 장르 */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              fontSize: '0.75rem',
                              color: '#555'
                            }}>
                              <span style={{
                                width: 38,
                                flexShrink: 0,
                                whiteSpace: 'nowrap',
                                fontSize: '0.75rem'
                              }}>장르</span>
                              <span>{m.genre || '-'}</span>
                            </div>


                            {/* 감독 */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              fontSize: '0.75rem',
                              color: '#555'
                            }}>
                              <span style={{
                                width: 38,
                                flexShrink: 0,
                                whiteSpace: 'nowrap',
                                fontSize: '0.75rem'
                              }}>
                                감독
                              </span>
                              <span>
                                {
                                  m.credits?.crew
                                    ?.find(p => p.job === 'Director')
                                    ?.name || '-'
                                }
                              </span>
                            </div>

                            {/* 배우 */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 10,
                              fontSize: '0.75rem',
                              color: '#555',
                              lineHeight: 1.5
                            }}>
                              <span style={{ width: 38, flexShrink: 0, whiteSpace: 'nowrap', fontSize: '0.75rem' }}>출연
                              </span>
                              <span>
                                {
                                  m.credits?.cast
                                    ?.slice(0, 3)
                                    ?.map(a => a.name)
                                    ?.join(' · ')
                                  || '-'
                                }
                              </span>
                            </div>

                            {/* 영상 */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              fontSize: '0.75rem',
                              color: '#555'
                            }}>
                              <span style={{
                                width: 38,
                                flexShrink: 0,
                                whiteSpace: 'nowrap',
                                fontSize: '0.75rem'
                              }}>
                                영상
                              </span>
                              {m.youtubeKey ? (
                                <span
                                  onClick={() => setTrailerKey(m.youtubeKey)
                                  }
                                  style={{
                                    cursor: 'pointer',
                                    color: '#c84f4f',
                                    fontWeight: 700
                                  }}
                                >
                                  🎬 영상 보기
                                </span>
                              ) : (
                                <span>-</span>
                              )}
                            </div>
                          </div>

                          {/* 시놉시스 버튼 */}
                          {m.overview && (
                            <button
                              onClick={() => {
                                setShowSynopsis(v => !v)
                                setTimeout(() => {
                                  scrollRef.current?.scrollTo({
                                    top: scrollRef.current.scrollHeight,
                                    behavior: 'smooth'
                                  })
                                }, 120)
                              }}
                              style={{
                                marginTop: 10,
                                border: 'none',
                                background: 'none',
                                padding: 0,
                                textAlign: 'left',
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                color: '#666',
                                cursor: 'pointer'
                              }}>
                              {showSynopsis
                                ? '줄거리 ▲'
                                : '줄거리 ▼'}
                            </button>
                          )}
                        </div>

                      </div>

                      {/* 시놉시스 */}
                      {showSynopsis && m.overview && (
                        <div style={{
                          marginTop: 18,
                          paddingTop: 16,
                          borderTop: '1px solid #efebe5',
                          fontSize: '0.82rem',
                          lineHeight: 1.7,
                          color: '#555'
                        }}>
                          {m.overview}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 하단 버튼 */}
                <button
                  onClick={() => {
                    playClick()
                    nextQ()
                  }}
                  style={{
                    width: '100%',
                    height: 46,
                    borderRadius: 12,
                    background: '#4a4a4a',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    border: 'none'
                  }}>
                  {qi + 1 < pool.length ? '다음 문제' : '결과 보기'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>


      {/* 신고 toast */}
      {showReportToast && (
        <div style={{
          position: 'fixed',
          left: '50%',
          bottom: 90,
          transform: 'translateX(-50%)',
          background: 'rgba(30,30,30,0.92)',
          color: '#fff',
          padding: '12px 18px',
          borderRadius: 999,
          fontSize: '0.78rem',
          fontWeight: 700,
          zIndex: 9999,
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          backdropFilter: 'blur(8px)'
        }}>
          신고가 접수되었어요
        </div>
      )}

      <style jsx>{`
                @keyframes comboPulse {
                  0%   { transform: scale(1) }
                  50%  { transform: scale(1.06) }
                  100% { transform: scale(1) }
                }
              `}</style>

      <style jsx>{`
                @keyframes hintSlideDown {
                  from {
                    opacity: 0;
                    transform: translateY(-10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>

      <style jsx>{`
                @keyframes popLife {
                  0% {
                    opacity: 0;
                    transform: translateY(6px) scale(0.8);
                  }
                  40% {
                    opacity: 1;
                    transform: translateY(-4px) scale(1.1);
                  }
                  100% {
                    opacity: 0;
                    transform: translateY(-10px) scale(1);
                  }
                }
              `}</style>

      <style jsx>{`
                @keyframes menuFade{
                  from{
                    opacity:0;
                    transform:translateY(-6px);
                  }

                  to{
                    opacity:1;
                    transform:translateY(0);
                  }
                }
              `}</style>

    </AppLayout>
  )
}