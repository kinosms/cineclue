// components/CastingQuiz.js

import React, { useEffect, useMemo, useRef, useState } from 'react'
import './CastingQuiz.css'
import MovieFlipCard from './MovieFlipCard'
import { playSound, stopSound } from '../library/audioManager'

export default function CastingQuiz({
  quiz,
  selectedAnswer,
  onSelectAnswer,
  onNextQuiz,
  onRevealCountChange,
}) {
  const [autoRevealCount, setAutoRevealCount] = useState(0)
  const [countdown, setCountdown] = useState(null)
  const [result, setResult] = useState(null)
  const [showMovieCard, setShowMovieCard] = useState(false)
  const [spinningActors, setSpinningActors] = useState({})
  const advancingRef = useRef(false)
  const [isMovingNext, setIsMovingNext] = useState(false)
  const [posterLoaded, setPosterLoaded] = useState(false)
  const [flippedActors, setFlippedActors] = React.useState({})
  const timersRef = useRef([])

  const actors = useMemo(() => {
    if (!quiz) return []

    return [
      ...(quiz.hintActors || []),
      ...(quiz.decoyActors || []),
    ]
      .filter(Boolean)
      .sort(() => Math.random() - 0.5)
      .slice(0, 9)
  }, [quiz])

  


  useEffect(() => {
    timersRef.current.forEach(t => clearTimeout(t))
    timersRef.current = []
    if (!quiz?.hintActors?.length) return
    setFlippedActors({})
    onRevealCountChange?.(0)
    quiz.hintActors.slice(0, 3).forEach((actor, index) => {
      const start = 450 + index * 1700
      timersRef.current.push(setTimeout(() => {
        onRevealCountChange?.(index + 1)
        setFlippedActors(prev => ({
          ...prev,
          [actor.id]: true
        }))
      }, start))
      timersRef.current.push(setTimeout(() => {
        setFlippedActors(prev => ({
          ...prev,
          [actor.id]: false
        }))
      }, start + 850))
      timersRef.current.push(setTimeout(() => {
        setFlippedActors(prev => ({
          ...prev,
          [actor.id]: true
        }))
      }, start + 1150))
      timersRef.current.push(setTimeout(() => {
        setFlippedActors(prev => ({
          ...prev,
          [actor.id]: false
        }))
      }, start + 1500))
    })
    return () => {
      timersRef.current.forEach(t => clearTimeout(t))
      timersRef.current = []
    }
  }, [quiz?.answerMovie?.id])

  const goNextQuiz = () => {
    if (advancingRef.current) return
    advancingRef.current = true
    setShowMovieCard(false)
    setIsMovingNext(true)
    onNextQuiz?.()
  }

  useEffect(() => {
    if (!quiz) return

    advancingRef.current = false
    setAutoRevealCount(0)
    setCountdown(null)
    setResult(null)
    setShowMovieCard(false)
    setSpinningActors({})
    setIsMovingNext(false)
  }, [quiz])




  // 정답 배우 3명 자동 공개 + 자동 회전
  useEffect(() => {
    if (!quiz || result) return

    const hintActors = quiz.hintActors || []
    const revealMax = Math.min(3, hintActors.length)

    if (autoRevealCount >= revealMax) return

    const timer = setTimeout(() => {
      const actor = hintActors[autoRevealCount]

      if (actor) {
        // 첫 번째 회전

        setSpinningActors(prev => ({

          ...prev,

          [actor.id]: true,

        }))
        // 1.1초 후 한 번 더 회전
        setTimeout(() => {
          setSpinningActors(prev => ({
            ...prev,
            [actor.id]: false,
          }))
          requestAnimationFrame(() => {
            setSpinningActors(prev => ({
              ...prev,
              [actor.id]: true,
            }))
          })
        }, 1100)
        // 두 번째 회전 끝
        setTimeout(() => {
          setSpinningActors(prev => ({
            ...prev,
            [actor.id]: false,
          }))
          setAutoRevealCount(v => v + 1)
        }, 2200)
      }
    }, autoRevealCount === 0 ? 800 : 3000)

    return () => clearTimeout(timer)
  }, [quiz, autoRevealCount, result])

  // 3명 공개 후 10초 타이머
  useEffect(() => {
    if (!quiz || result) return

    const revealMax = Math.min(3, quiz.hintActors?.length || 0)
    if (autoRevealCount !== revealMax) return

    setCountdown(7)
    playSound('castingClock', 0.45)

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null) return null

        if (prev <= 1) {
          clearInterval(interval)
          stopSound('castingClock')
          setResult('fail')

          setTimeout(() => {
            goNextQuiz()
          }, 800)

          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [quiz, autoRevealCount, result])

  if (!quiz) return null

  const handleSelectAnswer = option => {
    if (result || showMovieCard) return

    onSelectAnswer?.(option)

    const isCorrect = option.id === quiz.answerMovie?.id

    if (isCorrect) {
      stopSound('castingClock')
      playSound('correct', 0.25)
      setPosterLoaded(false) 
      setResult('success')
      setCountdown(null)
      setShowMovieCard(true)
    } else {
      stopSound('castingClock')
      playSound('wrong', 0.25)
      setResult('fail')
      setCountdown(null)

      setTimeout(() => {
        goNextQuiz()
      }, 1200)
    }
  }

  return (
    <div className="casting-quiz-screen">
      <div className="casting-header">
        <h1>Casting Quiz</h1>
      </div>

      <div className="casting-main-card">
        {countdown !== null && !result && (
          <div
            className={`casting-round-timer timer-${countdown}`}
          >
            <div className="timer-hand" />
            <span>{countdown}</span>
          </div>
        )}

        <div className="casting-actor-grid">
          {actors.map(actor => {
            const hintIndex = quiz.hintActors?.findIndex(a => a.id === actor.id)
            const revealed = hintIndex !== -1 && hintIndex < autoRevealCount
            const spinning = !!spinningActors[actor.id]

            return (
              <div
                key={actor.id}
                className={[
                  'casting-actor',
                  revealed ? 'revealed' : '',
                  spinning ? 'spinning' : '',
                ].join(' ')}
              >
                <div className="casting-actor-inner">
                  <div className="casting-actor-front">
                    <img
                      className="actor-img-gray"
                      src={actor.profile || actor.image}
                      alt={actor.name || 'actor'}
                    />
                    <img
                      className="actor-img-color"
                      src={actor.profile || actor.image}
                      alt=""
                    />
                  </div>

                  <div className="casting-actor-back">
                    {actor.name}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="casting-bottom-area">
          <div className="casting-answer-grid">
            {quiz.options?.map(option => (
              <button
                key={option.id}
                className={[
                  'casting-answer-btn',
                  selectedAnswer?.id === option.id ? 'selected' : '',
                ].join(' ')}
                onClick={() => handleSelectAnswer(option)}
                disabled={!!result || showMovieCard}
              >
                {option.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {result === 'fail' && !isMovingNext && (
        <div className="casting-result fail">
          실패
        </div>
      )}

      {showMovieCard && (
        <div
          className="casting-poster-answer-overlay"
          onClick={goNextQuiz}
        >
          <div
            className={[
              'casting-poster-answer-card',
              posterLoaded ? 'loaded' : '',
            ].join(' ')}
          >
            <img
              key={quiz.answerMovie.id}
              className="casting-answer-poster"
              src={`https://image.tmdb.org/t/p/w500${quiz.answerMovie.poster_path}`}
              alt={quiz.answerMovie.title}
              onLoad={() => setPosterLoaded(true)}
            />
            {posterLoaded && (
              <div className="casting-answer-next-text">
                다음 문제 » 
              </div>
            )}
          </div>
        </div>
      )}

      {isMovingNext && (
        <div className="casting-next-loading">
          다음 퀴즈를 준비 중이예요
        </div>
      )}
    </div>
  )
}