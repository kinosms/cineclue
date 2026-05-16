'use client'

export default function MovieFlipCard(props) {

  const {
    movieCard,
    showMovieCard,
    setShowMovieCard,
    movieCardFlipped,
    setMovieCardFlipped,
    setTrailerKey
  } = props

  if (!showMovieCard || !movieCard) return null

  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.72)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>

        {/* 바깥 터치 닫기 */}
        <div
          onClick={() => setShowMovieCard(false)}
          style={{
            position: 'absolute',
            inset: 0
          }}
        />

        {/* 카드 */}
        <div
          style={{
            width: '92vw',
            maxWidth: 340,
            height: '78vh',
            maxHeight: 620,
            perspective: '1200px',
            position: 'relative',
            zIndex: 2,
            animation: 'cardIntro 1.4s ease'
          }}
        >

          <div
            onClick={() => setMovieCardFlipped(v => !v)}
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.7s cubic-bezier(.22,.61,.36,1)',
              transform: movieCardFlipped
                ? 'rotateY(180deg)'
                : 'rotateY(0deg)',
              cursor: 'pointer'
            }}
          >

            {/* 앞면 */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 28,
              overflow: 'hidden',
              background: '#111',
              backfaceVisibility: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.45)'
            }}>

              {/* 포스터 */}
              <img
                src={
                  movieCard.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movieCard.poster_path}`
                    : '/no_poster.webp'
                }
                alt="poster"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>


            {/* 뒷면 */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 28,
              overflow: 'hidden',
              background: '#141414',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.45)'
            }}>

              {/* 배경 blur */}
              {movieCard.backdrop_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w780${movieCard.backdrop_path}`}
                  alt=""
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'blur(24px)',
                    opacity: 0.22,
                    transform: 'scale(1.15)'
                  }}
                />
              )}

              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(10,10,10,0.82)'
              }} />

              {/* 내용 */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                height: '100%',
                overflowY: 'auto',
                padding: '24px 22px 28px'
              }}>

                <div style={{
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  color: '#fff',
                  lineHeight: 1.2,
                  marginBottom: 6
                }}>
                  {movieCard.title}
                </div>

                <div style={{
                  fontSize: '0.82rem',
                  color: 'rgba(255,255,255,0.62)',
                  marginBottom: 20
                }}>
                  {movieCard.original_title}
                </div>

                {[
                  ['개봉', movieCard.release_date
                  ],

                  ['국가', movieCard.production_countries
                    ?.map(c => c.name)
                    ?.join(', ')
                  ],

                  ['평점',
                    movieCard.vote_average?.toFixed(1)
                  ],

                  ['장르', movieCard.genres
                    ?.map(g => g.name)
                    ?.join(', ')
                  ],

                  ['감독', movieCard.credits?.crew
                    ?.find(p => p.job === 'Director')
                    ?.name
                  ],

                  ['출연',
                    movieCard.credits?.cast
                      ?.slice(0, 5)
                      ?.map(a => a.name)
                      ?.join(' · ')
                  ],

                  ['영상', movieCard.youtubeKey]

                ].map(([k, v], i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      marginBottom: 10
                    }}
                  >
                    <div style={{
                      width: 54,
                      color: 'rgba(255,255,255,0.45)',
                      fontSize: '0.76rem',
                      fontWeight: 700
                    }}>
                      {k}
                    </div>

                    <div style={{
                      flex: 1,
                      color: '#fff',
                      fontSize: '0.82rem',
                      lineHeight: 1.5
                    }}>

                      {k === '영상' ? (
                        v ? (
                          <span
                            onClick={(e) => {
                              e.stopPropagation()
                              setTrailerKey(movieCard.youtubeKey)
                            }}
                            style={{
                              color: '#ff7b8d',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            🎬 영상 보기
                          </span>
                        ) : '-'
                      ) : (
                        v || '-'
                      )}
                    </div>
                  </div>
                ))}

                {/* 시놉시스 */}
                <div style={{
                  marginTop: 24
                }}>

                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: 'rgba(255,255,255,0.55)',
                    marginBottom: 10
                  }}>
                    SYNOPSIS
                  </div>

                  <div style={{
                    fontSize: '0.86rem',
                    lineHeight: 1.72,
                    color: 'rgba(255,255,255,0.9)',
                    wordBreak: 'keep-all'
                  }}>
                    {movieCard.overview || '시놉시스 정보 없음'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`

@keyframes cardIntro {

  0%{

    opacity:0;

    transform:

      translateY(12px)

      perspective(1200px)

      rotateY(0deg);

  }

  18%{

    opacity:1;

    transform:

      translateY(0)

      perspective(1200px)

      rotateY(-10deg);

  }

  34%{

    transform:

      perspective(1200px)

      rotateY(8deg);

  }

  48%{

    transform:

      perspective(1200px)

      rotateY(0deg);

  }

  100%{

    transform:

      perspective(1200px)

      rotateY(0deg);

  }

}

`}</style>
    </>
  )
}