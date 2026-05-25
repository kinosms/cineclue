const SOUND_MAP = {
  click: '/click.mp3',
  modeclick: '/modeclick.mp3',
  correct: '/correct.mp3',
  wrong: '/wrong.mp3',
  hint: '/hint.mp3',
  combo: '/combo.mp3',
  result: '/result.mp3',
  bgm: '/intro.mp3',
  flip: '/flip.mp3',
}

const audioPool = {}

let bgmAudio = null

function getAudio(name) {
  if (typeof window === 'undefined') return null

  if (!audioPool[name]) {
    const audio = new Audio(SOUND_MAP[name])
    audio.preload = 'auto'
    audio.load()
    audioPool[name] = audio
  }

  return audioPool[name]
}

export function preloadSounds() {
  Object.keys(SOUND_MAP).forEach(name => {
    if (name !== 'bgm') getAudio(name)
  })
}

export function playSound(name, volume = 0.45) {
  const audio = getAudio(name)
  if (!audio) return

  audio.pause()
  audio.currentTime = 0
  audio.volume = volume
  audio.play().catch(() => {})
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