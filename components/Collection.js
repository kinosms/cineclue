// Collection.js
'use client'

import { useEffect, useRef, useState } from 'react'
import MovieFlipCard from './MovieFlipCard'

export default function Collection(props) {

  const {

    authUser,

    supabase,

    setScreen,

    selChar,

    collectionReturnScreen,

    trailerKey,

    setTrailerKey,

    movieCard,

    setMovieCard,

    showMovieCard,

    setShowMovieCard,

    movieCardFlipped,

    setMovieCardFlipped

  } = props

  const scrollRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [posters, setPosters] = useState([])
  const [collectionLayout, setCollectionLayout] = useState('stack')
  const [sortType, setSortType] = useState('recent')
  const [showShuffleFx, setShowShuffleFx] = useState(false)
  const SHUFFLE_DURATION = 1200
  const [shuffleCards, setShuffleCards] = useState([])
  const triggerShuffleFx = (callback) => {

    const cards = fxPosters.map(src => ({

      src,

      fromLeft: Math.random() > 0.5,

      top: -10 + Math.random() * 110,

      rotate: -25 + Math.random() * 50,

      duration: 0.75 + Math.random() * 0.35

    }))

    setShuffleCards(cards)

    setShowShuffleFx(true)

    setTimeout(() => {

      callback?.()

    }, SHUFFLE_DURATION - 120)

    setTimeout(() => {

      setShowShuffleFx(false)

    }, SHUFFLE_DURATION)

  }

  useEffect(() => {

    const loadCollections = async () => {

      if (!authUser) return

      async function preloadImages(urls = []) {

        await Promise.all(

          urls.map(src => {

            return new Promise(resolve => {

              const img = new Image()

              img.src = src

              img.onload = resolve

              img.onerror = resolve

            })

          })

        )

      }

      const { data, error } = await supabase

        .from('collections')

        .select('*')

        .eq('user_id', authUser.id)

        .eq('character_id', selChar)

        .order('viewed_at', { ascending: false })

      if (error) {

        console.error(error)

        return

      }

      const postersData = data || []

      const preloadTargets =

        postersData

          .slice(0, 30)

          .map(p =>

            p.movie_data?.poster_path

              ? `https://image.tmdb.org/t/p/w500${p.movie_data.poster_path}`

              : '/no_poster.webp'

          )

      await preloadImages(preloadTargets)

      setPosters(postersData)

      setReady(true)

    }

    loadCollections()

  }, [])


  if (!ready) {

    return (

      <div

        style={{

          width: '100%',

          height: '100dvh',

          background: '#111',

          display: 'flex',

          alignItems: 'center',

          justifyContent: 'center',

          color: 'rgba(255,255,255,0.5)',

          fontSize: 14,

          letterSpacing: '0.08em'

        }}

      >

        LOADING COLLECTION...

      </div>

    )

  }



  const sortedPosters =

    [...posters].sort((a, b) => {

      if (sortType === 'name') {

        return (a.movie_data?.title || '')

          .localeCompare(

            b.movie_data?.title || '',

            'ko'

          )

      }

      return new Date(b.viewed_at)

        - new Date(a.viewed_at)

    })

    const fxPosters =

  [...posters]

    .slice(0, 20)

    .map(p =>

      p.movie_data?.poster_path

        ? `https://image.tmdb.org/t/p/w500${p.movie_data.poster_path}`

        : '/no_poster.webp'

    )



  return (
    <div

      style={{

        width: '100%',

        height: '100dvh',

        background: `

          radial-gradient(circle at top, #2d241d 0%, #141414 45%),

          #111

        `,

        overflow: 'hidden',

        position: 'relative',

        color: '#fff',

        display: 'flex',

        flexDirection: 'column'

      }}

    >

      {showShuffleFx && (

        <div style={{

          position: 'fixed',

          inset: 0,

          overflow: 'hidden',

          pointerEvents: 'none',

          zIndex: 999

        }}>

          {shuffleCards.map((p, i) => (

            <img

              key={i}

              src={p.src}

              style={{

                position: 'absolute',

                width: 240,

                borderRadius: 12,

                top: `${p.top}%`,

                left: p.fromLeft ? '-260px' : 'auto',

                right: !p.fromLeft ? '-260px' : 'auto',

                rotate: `${p.rotate}deg`,

                animation: p.fromLeft

                  ? `flyRight ${p.duration}s ease-out forwards`

                  : `flyLeft ${p.duration}s ease-out forwards`

              }}

            />

          ))}

        </div>

      )}

      {/* TOP */}

      <div

        style={{

          padding: '34px 28px 10px',

          zIndex: 10

        }}

      >
        {/* CLOSE */}

        <div

          onClick={() => {

            setScreen(collectionReturnScreen)

          }}

          style={{

            position: 'absolute',

            top: 24,

            right: 24,

            width: 42,

            height: 42,

            borderRadius: '50%',

            background: 'rgba(255,255,255,0.08)',

            border: '1px solid rgba(255,255,255,0.12)',

            backdropFilter: 'blur(10px)',

            display: 'flex',

            alignItems: 'center',

            justifyContent: 'center',

            cursor: 'pointer',

            zIndex: 20

          }}

        >

          <span style={{

            fontSize: 20,

            color: '#fff',

            fontWeight: 700,

            lineHeight: 1

          }}>

            ×

          </span>

        </div>

        <div

          style={{

            fontSize: 12,

            letterSpacing: '0.24em',

            color: '#d1bfa3',

            marginBottom: 10,

            fontWeight: 700

          }}

        >

          MY COLLECTION

        </div>

        <div

          style={{

            fontSize: 34,

            fontWeight: 900,

            lineHeight: 1.05,

            marginBottom: 7

          }}

        >

          Collected Posters

        </div>

        <div style={{

          display: 'flex',

          alignItems: 'center',

          justifyContent: 'space-between'

        }}>

          {/* LEFT */}
          <div

            style={{

              fontSize: 15,

              color: 'rgba(255,255,255,0.55)'

            }}

          >

            {posters.length} archived movies

          </div>

          {/* RIGHT CONTROLS */}
          <div

            style={{

              display: 'flex',

              alignItems: 'center',

              gap: 10

            }}

          >

            {/* SORT */}
            <button

              onClick={() => {

                triggerShuffleFx(() => {

                  setSortType(v =>

                    v === 'recent'

                      ? 'name'

                      : 'recent'

                  )

                })

              }}

              style={{

                appearance: 'none',

                WebkitAppearance: 'none',

                border: 'none',

                background: 'transparent',

                color: 'rgba(255,255,255,0.58)',

                fontSize: '0.82rem',

                fontWeight: 500,

                letterSpacing: '-0.01em',

                cursor: 'pointer',

                padding: 0

              }}

            >

              {sortType === 'recent'

                ? '등록순'

                : '이름순'}

            </button>

            {/* LAYOUT */}
            <button

              onClick={() => {

                setCollectionLayout(v =>

                  v === 'stack'

                    ? 'grid'

                    : 'stack'

                )

              }}

              style={{

                appearance: 'none',

                WebkitAppearance: 'none',

                width: 28,

                height: 28,

                border: 'none',

                background: 'transparent',

                padding: 0,

                color: 'rgba(255,255,255,0.65)',

                display: 'flex',

                alignItems: 'center',

                justifyContent: 'center',

                fontSize: '0.95rem',

                cursor: 'pointer'

              }}

            >

              {collectionLayout === 'stack'

                ? '☷'

                : '⧉'}

            </button>

          </div>

        </div>

        {/* divider */}
        <div style={{
          marginTop: 10,
          height: 1,
          width: '100%',
          background: 'rgba(255,255,255,0.08)'
        }} />

      </div>

      {/* GLOW */}

      <div

        style={{

          position: 'absolute',

          top: 120,

          left: '50%',

          transform: 'translateX(-50%)',

          width: 500,

          height: 500,

          borderRadius: '50%',

          background: 'rgba(255,180,90,0.12)',

          filter: 'blur(120px)',

          pointerEvents: 'none'

        }}

      />



      {/* SCROLL AREA */}
      {sortedPosters.length === 0 ? (

  <div

    style={{

      flex:1,

      display:'flex',

      flexDirection:'column',

      alignItems:'center',

      justifyContent:'flex-start',

      paddingTop:'22vh',

      textAlign:'center',

      color:'rgba(255,255,255,0.62)',

      position:'relative',

      zIndex:5

    }}

  >

    <div

      style={{

        fontSize:'1.08rem',

        fontWeight:600,

        marginBottom:14,

        letterSpacing:'-0.02em'

      }}

    >

      아직 수집된 포스터가 없습니다

    </div>

    <div

      style={{

        fontSize:'0.92rem',

        lineHeight:1.75,

        color:'rgba(255,255,255,0.38)'

      }}

    >

      퀴즈를 플레이하고 정답 화면을 눌러 <br />

      영화 포스터를 모아보세요

    </div>

  </div>

) : collectionLayout === 'stack' ? (

        /* STACK VIEW */

        <div

          ref={scrollRef}

          style={{

            flex: 1,

            display: 'flex',

            alignItems: 'flex-start',

            paddingTop: 50,

            overflowX: 'auto',

            overflowY: 'hidden',

            gap: 0,

            scrollBehavior: 'smooth',

            msOverflowStyle: 'none',

            scrollbarWidth: 'none'

          }}

          className="hide-scroll"

        >

          {sortedPosters.map((poster, index) => {

            const rotate =

              index % 2 === 0

                ? -4

                : 4

            return (

              <div
                key={index}

                onClick={() => {

                  setMovieCard(poster.movie_data)

                  setMovieCardFlipped(false)

                  setShowMovieCard(true)

                }}

                style={{

                  width: 255,

                  height: 382,

                  borderRadius: 22,

                  flexShrink: 0,

                  background: `

              linear-gradient(

                145deg,

                #2f2f2f,

                #191919

              )

            `,

                  marginLeft: index === 0 ? 0 : -125,

                  transform: `rotate(${rotate}deg)`,

                  transformOrigin: 'bottom center',

                  boxShadow: `

              0 30px 60px rgba(0,0,0,0.45),

              inset 0 1px 0 rgba(255,255,255,0.05)

            `,

                  position: 'relative',

                  transition: '0.28s ease',

                  cursor: 'pointer',

                  overflow: 'hidden'

                }}

              >

                <img
                  src={

                    poster.movie_data?.poster_path

                      ? `https://image.tmdb.org/t/p/w500${poster.movie_data.poster_path}`

                      : '/no_poster.webp'

                  }
                  alt={poster.movie_data?.title}
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    userSelect: 'none',
                    pointerEvents: 'none'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = '/noposter.jpg'
                  }}
                />

                <div

                  style={{

                    position: 'absolute',

                    bottom: 24,

                    left: 20

                  }}

                >

                  <div

                    style={{

                      width: 110,

                      height: 10,

                      borderRadius: 999,

                      background: 'rgba(255,255,255,0.14)',

                      marginBottom: 10

                    }}

                  />

                  <div

                    style={{

                      width: 70,

                      height: 8,

                      borderRadius: 999,

                      background: 'rgba(255,255,255,0.08)'

                    }}

                  />

                </div>

              </div>

            )

          })}

        </div>

      ) : (

        /* GRID VIEW */

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '26px 14px 40px'
          }}
        >

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 3
            }}
          >

            {sortedPosters.map((poster, index) => (

              <div
                key={index}

                onClick={() => {

                  setMovieCard(poster.movie_data)

                  setMovieCardFlipped(false)

                  setShowMovieCard(true)

                }}

                style={{
                  aspectRatio: '2 / 3',
                  borderRadius: 6,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >

                <img
                  src={
                    poster.movie_data?.poster_path
                      ? `https://image.tmdb.org/t/p/w500${poster.movie_data.poster_path}`
                      : '/no_poster.webp'
                  }

                  alt={poster.movie_data?.title}

                  draggable={false}

                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    userSelect: 'none',
                    pointerEvents: 'none'
                  }}

                  onError={(e) => {
                    e.currentTarget.src = '/noposter.jpg'
                  }}
                />

              </div>

            ))}

          </div>

        </div>

      )}

      <style jsx>{`

@keyframes flyRight {

  0% {

    transform: translateX(0);

    opacity:0;

  }

  15% {

    opacity:1;

  }

  85% {

    opacity:1;

  }

  100% {

    transform: translateX(140vw);

    opacity:0;

  }

}

@keyframes flyLeft {

  0% {

    transform: translateX(0);

    opacity:0;

  }

  15% {

    opacity:1;

  }

  85% {

    opacity:1;

  }

  100% {

    transform: translateX(-140vw);

    opacity:0;

  }

}

`}</style>

    </div>

  )

}