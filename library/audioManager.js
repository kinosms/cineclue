

const SOUND_MAP = {
  click: '/click.mp3',
  correct: '/correct.mp3',
  wrong: '/false.mp3',
  hint: '/hint.mp3',
  combo: '/combo.mp3',
  result: '/result.mp3',
  bgm: '/introsound.mp3',
}

let bgmAudio = null

export function playSound(name, volume = 0.45) {
  if (typeof window === 'undefined') return

  const src = SOUND_MAP[name]
  if (!src) return

  const audio = new Audio(src)
  audio.volume = volume
  audio.currentTime = 0

  audio.play().catch(() => {})
}

export function playBgm(volume = 0.22) {
  if (typeof window === 'undefined') return

  if (bgmAudio) return

  bgmAudio = new Audio(SOUND_MAP.bgm)
  bgmAudio.loop = true
  bgmAudio.volume = volume

  bgmAudio.play().catch(() => {})
}

export function stopBgm() {
  if (!bgmAudio) return

  bgmAudio.pause()
  bgmAudio.currentTime = 0
  bgmAudio = null
}

export function setBgmVolume(volume = 0.22) {
  if (!bgmAudio) return

  bgmAudio.volume = volume
}