const SOUND_MAP = {
  click: '/click.mp3',
  modeclick: '/modeclick.mp3',
  correct: '/correct.mp3',
  wrong: '/wrong.mp3',
  hint: '/hint.mp3',
  flip: '/flip.mp3',
  bgm: '/intro.mp3',
  mainBgm: '/mainbgm.mp3',
  resultBgm: '/resultbgm.mp3',
  arrange: '/cardarrange.mp3',
}

const audioPools = {}
const poolIndex = {}

let bgmAudio = null
let currentBgm = null
let bgmEnabled = true
let sfxEnabled = true

function createAudio(src) {
  const audio = new Audio(src)
  audio.preload = 'auto'
  audio.load()
  return audio
}

function getPool(name, count = 4) {
  if (typeof window === 'undefined') return []

  if (!SOUND_MAP[name]) return []

  if (!audioPools[name]) {
    audioPools[name] = Array.from(
      { length: count },
      () => createAudio(SOUND_MAP[name])
    )
    poolIndex[name] = 0
  }

  return audioPools[name]
}


export function setSfxEnabled(enabled) {

  sfxEnabled = enabled

}

export function isBgmEnabled() {

  return bgmEnabled

}

export function isSfxEnabled() {

  return sfxEnabled

}



export function setBgmSpeed(rate = 1) {

  if (!bgmAudio) return

  bgmAudio.playbackRate = rate

}



export function preloadSounds() {

  Object.keys(SOUND_MAP).forEach(name => {

    if (name === 'bgm' || name === 'mainBgm' || name === 'resultBgm') return

    getPool(name, 4)

  })

}

export function playSound(name, volume = 0.65) {
  if (typeof window === 'undefined') return
  if (!sfxEnabled) return
  

  const pool = getPool(name, 4)
  if (!pool.length) return

  const index = poolIndex[name] || 0
  const audio = pool[index]

  poolIndex[name] = (index + 1) % pool.length

  try {
    audio.currentTime = 0
    audio.volume = volume
    const p = audio.play()
    if (p) p.catch(() => {})
  } catch (e) {}
}

export function playBgm(name = 'mainBgm', volume = 0.25) {

  if (typeof window === 'undefined') return
  if (!bgmEnabled) return

  const src = SOUND_MAP[name]

  if (!src) return

  // 같은 BGM이 이미 재생 중이면 그대로 유지

  if (bgmAudio && currentBgm === name && !bgmAudio.paused) return

  // 다른 BGM이 재생 중이면 정지

  if (bgmAudio) {

    bgmAudio.pause()

    bgmAudio.currentTime = 0

  }

  bgmAudio = new Audio(src)

  bgmAudio.loop = true

  bgmAudio.preload = 'auto'

  bgmAudio.load()

  bgmAudio.volume = volume

  currentBgm = name

  bgmAudio.play().catch(() => {})

}


function fadeVolume(audio, from, to, duration = 500, done) {

  const start = performance.now()

  function tick(now) {

    const progress = Math.min((now - start) / duration, 1)

    audio.volume = from + (to - from) * progress

    if (progress < 1) {

      requestAnimationFrame(tick)

    } else {

      audio.volume = to

      done?.()

    }

  }

  requestAnimationFrame(tick)

}

export function stopBgm() {

  if (!bgmAudio) return

  const oldAudio = bgmAudio

  fadeVolume(oldAudio, oldAudio.volume, 0, 500, () => {

    oldAudio.pause()

    oldAudio.currentTime = 0

    if (bgmAudio === oldAudio) {

      bgmAudio = null

      currentBgm = null

    }

  })

}

export function setBgmVolume(volume = 0.40) {
  if (!bgmAudio) return
  bgmAudio.volume = volume
}


export function setBgmEnabled(enabled) {

  bgmEnabled = enabled

  if (!enabled) {

    stopBgm()

  }

}


