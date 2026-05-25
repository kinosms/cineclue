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
  mainBgm: '/mainbgm.mp3',
  resultBgm: '/resultbgm.mp3',
  arrange: '/cardarrange.mp3',
}

const audioPools = {}
const poolIndex = {}

let bgmAudio = null
let currentBgm = null
let soundEnabled = true

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


export function setSoundEnabled(enabled) {

  soundEnabled = enabled

  if (!enabled) {

    stopBgm()

  }

}

export function isSoundEnabled() {

  return soundEnabled

}

export function preloadSounds() {

  Object.keys(SOUND_MAP).forEach(name => {

    if (name === 'bgm' || name === 'mainBgm' || name === 'resultBgm') return

    getPool(name, 4)

  })

}

export function playSound(name, volume = 0.45) {
  if (typeof window === 'undefined') return
  if (!soundEnabled) return

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

export function playBgm(name = 'mainBgm', volume = 0.35) {

  if (typeof window === 'undefined') return
  if (!soundEnabled) return

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