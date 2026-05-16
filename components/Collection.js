// Collection.js
'use client'

import { useEffect, useRef, useState } from 'react'
import MovieFlipCard from './MovieFlipCard'

export default function Collection(props) {

  const {

    authUser,
    supabase,
    setScreen,
    selChar

  } = props

  const scrollRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [posters, setPosters] = useState([])
  const [movieCard, setMovieCard] = useState(null)
  const [showMovieCard, setShowMovieCard] = useState(false)
  const [movieCardFlipped, setMovieCardFlipped] = useState(false)
  const [trailerKey, setTrailerKey] = useState(null)
  

  useEffect(() => {

  const loadCollections = async () => {

    if(!authUser) return

    const { data, error } = await supabase

      .from('collections')

      .select('*')

      .eq('user_id', authUser.id)

      .eq('character_id', selChar)

      .order('viewed_at', { ascending:false })

    if(error){

      console.error(error)

      return

    }

    setPosters(data || [])

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
        {/* CLOSE */}

          <div

            onClick={() => {

              setScreen('result')

            }}

            style={{

              position:'absolute',

              top:24,

              right:24,

              width:42,

              height:42,

              borderRadius:'50%',

              background:'rgba(255,255,255,0.08)',

              border:'1px solid rgba(255,255,255,0.12)',

              backdropFilter:'blur(10px)',

              display:'flex',

              alignItems:'center',

              justifyContent:'center',

              cursor:'pointer',

              zIndex:20

            }}

          >

            <span style={{

              fontSize:20,

              color:'#fff',

              fontWeight:700,

              lineHeight:1

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

          {posters.length} archived movies

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

          paddingTop: 95,

          overflowX: 'auto',

          overflowY: 'hidden',

          padding: '0 80px',

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

                setMovieCard(poster.movie_data)

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

              {/* poster image */}

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