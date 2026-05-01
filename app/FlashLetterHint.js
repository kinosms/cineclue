import { useEffect, useState, useRef } from 'react'

// 🔥 초성 추출
function getChosung(char) {
  const code = char.charCodeAt(0)

  if (code < 44032 || code > 55203) return char

  const CHO = [
    'ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ',
    'ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'
  ]

  return CHO[Math.floor((code - 44032) / 588)]
}

export default function FlashLetterHint({ title, hintLevel, onFlash }) {

  const [letters, setLetters] = useState([])
  const [order, setOrder] = useState([])
  const [cleanTitle, setCleanTitle] = useState('')
  const [flash, setFlash] = useState(null)

  const timerRef = useRef(null)

  // =========================
  // 🔥 1️⃣ 제목 정리 + letters
  // =========================
  useEffect(() => {

    if (!title) return

    const mainTitle = title.split(':')[0]
    const clean = mainTitle.replace(/[^가-힣a-zA-Z0-9]/g, '')

    if (!clean) return

    setCleanTitle(clean)

    const chars = clean.split('')
    const base = chars.slice(0, 4)

    // 🔥 셔플
    const shuffled = [...base]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    setLetters(shuffled)

  }, [title])

  // =========================
  // 🔥 2️⃣ index 랜덤 (겹침 방지 핵심)
  // =========================
  useEffect(() => {

  if (!letters.length) return

  const pool = [...Array(letters.length).keys()]  // [0,1,2,3]

  const shuffled = []

  while (pool.length) {

    const rand = Math.floor(Math.random() * pool.length)

    shuffled.push(pool.splice(rand, 1)[0])

  }

  setOrder(shuffled)

}, [letters])

  // =========================
  // 🔥 3️⃣ 힌트 출력
  // =========================
  useEffect(() => {

    if (timerRef.current) clearTimeout(timerRef.current)

    setFlash(null)
    onFlash?.(false)

    if (!cleanTitle) return
    if (hintLevel < 2 || hintLevel > 5) return
    if (!letters.length || !order.length) return

    const len = cleanTitle.length
    let value = null

    // 🔥 4글자 이상
    if (len >= 4) {

      if (hintLevel >= 2 && hintLevel <= 4) {
        const index = order[hintLevel - 2]
        value = letters[index]
      }

      if (hintLevel === 5) {
        value = cleanTitle.slice(0, 2)
      }

    }

    // 🔥 3글자
    else if (len === 3) {

      if (hintLevel >= 2 && hintLevel <= 4) {
        const index = order[(hintLevel - 2) % order.length]
        value = letters[index]
      }

      if (hintLevel === 5) {
        value = cleanTitle.slice(0, 2)
      }

    }

    // 🔥 2글자
    else if (len === 2) {

      if (hintLevel === 3 || hintLevel === 4) {
        const index = hintLevel - 3
        value = getChosung(cleanTitle[index])
      }

      if (hintLevel === 5) {
        value = cleanTitle[0]
      }

    }

    // 🔥 1글자
    else if (len === 1) {

      if (hintLevel === 5) {
        value = getChosung(cleanTitle[0])
      }

    }

    if (!value) return

    // 🔥 겹침 방지 핵심
    timerRef.current = setTimeout(() => {

      setFlash(value)
      onFlash?.(true)

      timerRef.current = setTimeout(() => {
        setFlash(null)
        onFlash?.(false)
      }, 900)

    }, 60)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }

  }, [hintLevel, letters, order, cleanTitle])

  if (!flash) return null

  return (
    <div className="flash-letter">
      {flash}
    </div>
  )
}