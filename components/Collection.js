// Collection.js
'use client'

import { useEffect, useRef, useState } from 'react'
import MovieFlipCard from './MovieFlipCard'

export default function Collection() {

  const scrollRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [posters, setPosters] = useState([])
  const [movieCard, setMovieCard] = useState(null)
  const [showMovieCard, setShowMovieCard] = useState(false)
  const [movieCardFlipped, setMovieCardFlipped] = useState(false)
  const [trailerKey, setTrailerKey] = useState(null)
  const dummyPosters = [

    {

      id: 1,

      title: 'Oldboy',

      poster: 'https://image.tmdb.org/t/p/w500/8Q31DAtmFJjhftJRYmWanmxpzgE.jpg'

    },

    {

      id: 2,

      title: 'Inception',

      poster: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg'

    },

    {

      id: 3,

      title: 'The Dark Knight',

      poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'

    },

    {

      id: 4,

      title: 'Parasite',

      poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'

    },

    {

      id: 5,

      title: 'Whiplash',

      poster: 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg'

    }

  ]

  const preloadImage = (src) => {

    return new Promise((resolve) => {

      const img = new Image()

      img.src = src

      img.onload = resolve

      img.onerror = resolve

    })

  }

  useEffect(() => {

    const load = async () => {

      const firstBatch = Array.from({ length: 10 }).map((_, i) => {

        const base = dummyPosters[i % dummyPosters.length]

        return {

          ...base,

          uid: i

        }

      })

      await Promise.all(

        firstBatch.map(p =>

          preloadImage(p.poster || '/noposter.jpg')

        )

      )

      setPosters(firstBatch)

      setReady(true)

    }

    load()

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

      {/* TOP */}

      <div

        style={{

          padding: '34px 28px 10px',

          zIndex: 10

        }}

      >

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

            marginBottom: 12

          }}

        >

          Collected Posters

        </div>

        <div

          style={{

            fontSize: 15,

            color: 'rgba(255,255,255,0.55)'

          }}

        >

          128 archived movies

        </div>

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

      <div

        ref={scrollRef}

        style={{

          flex: 1,

          display: 'flex',

          alignItems: 'flex-start',

          paddingTop: 60,

          overflowX: 'auto',

          overflowY: 'hidden',

          padding: '0 120px',

          gap: 0,

          scrollBehavior: 'smooth',

          msOverflowStyle: 'none',

          scrollbarWidth: 'none'

        }}

        className="hide-scroll"

      >

        {posters.map((poster, index) => {

          const rotate =

            index % 2 === 0

              ? -4

              : 4

          return (

            <div
              key={index}

              onClick={() => {

                setMovieCard({

                  ...poster,

                  // 임시 mock 데이터

                  poster_path: '',

                  backdrop_path: '',

                  release_date: '2010-07-21',

                  original_title: poster.title,

                  overview: 'Movie overview...',

                  genres: [],

                  production_countries: [],

                  credits: {

                    cast: [],

                    crew: []

                  }

                })

                setMovieCardFlipped(false)

                setShowMovieCard(true)

              }}

              style={{

                width: 240,

                height: 360,

                borderRadius: 22,

                flexShrink: 0,

                background: `

                  linear-gradient(

                    145deg,

                    #2f2f2f,

                    #191919

                  )

                `,

                border: '1px solid rgba(255,255,255,0.08)',

                marginLeft: index === 0 ? 0 : -110,

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

              {/* fake poster image */}

              <img
                src={poster.poster || '/noposter.jpg'}
                alt={poster.title}
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

              {/* placeholder text */}

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

      <MovieFlipCard

        movieCard={movieCard}

        showMovieCard={showMovieCard}

        setShowMovieCard={setShowMovieCard}

        movieCardFlipped={movieCardFlipped}

        setMovieCardFlipped={setMovieCardFlipped}

        setTrailerKey={setTrailerKey}

      />

    </div>

  )

}