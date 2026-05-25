const SOUND_MAP = {
  click: '/click.mp3',
  modeclick: '/modeclick.mp3',
  correct: '/correct.mp3',
  wrong: '/false.mp3',
  hint: '/hint.mp3',
  flip: '/flip.mp3',
  combo: '/combo.mp3',
  result: '/result.mp3',
  bgm: '/intro.mp3',
}

const audioPools = {}
const poolIndex = {}

let bgmAudio = null

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

export function preloadSounds() {
  Object.keys(SOUND_MAP).forEach(name => {
    if (name === 'bgm') return
    getPool(name, 4)
  })
}

export function playSound(name, volume = 0.45) {
  if (typeof window === 'undefined') return

  const pool = getPool(name, 4)
  if (!pool.length) return

  const index = poolIndex[name] || 0
  const audio = pool[index]

  poolIndex[name] = (index + 1) % pool.length

  try {
    audio.pause()
    audio.currentTime = 0
    audio.volume = volume
    audio.play().catch(() => {})
  } catch (e) {}
}

export function playBgm(volume = 0.40) {
  if (typeof window === 'undefined') return

  if (bgmAudio && !bgmAudio.paused) return

  if (!bgmAudio) {
    bgmAudio = new Audio(SOUND_MAP.bgm)
    bgmAudio.loop = true
    bgmAudio.preload = 'auto'
    bgmAudio.load()
  }

  bgmAudio.volume = volume
  bgmAudio.play().catch(() => {})
}

export function stopBgm() {
  if (!bgmAudio) return

  bgmAudio.pause()
  bgmAudio.currentTime = 0
  bgmAudio = null
}

export function setBgmVolume(volume = 0.40) {
  if (!bgmAudio) return
  bgmAudio.volume = volume
}