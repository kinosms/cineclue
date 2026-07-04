const makeSkin = (key, options = {}) => ({
  key,
  className: options.className || `skin-${key}`,

  background: `/skins/${key}/background.webp`,
  bgm: options.bgm || null,

  hints: Array.from(
    { length: 5 },
    (_, i) => `/skins/${key}/hint${i + 1}.webp`
  ),

  answers: Array.from(
    { length: 4 },
    (_, i) => `/skins/${key}/answer${i + 1}.webp`
  ),

  answerSelected: `/skins/${key}/answer_selected.webp`,

  buttons: {
    nextHint: `/skins/${key}/btn_next_hint.webp`,
    skipFill: `/skins/${key}/btn_skip_fill.webp`,
    nextQuiz: `/skins/${key}/btn_next_quiz.webp`,
  },

  colors: options.colors || {
    text: '#222',
    point: '#e8808c',
    buttonText: '#7a0d0d',
  },
})

export const MODE_SKINS = {
  default: makeSkin('default', {
    className: 'skin-default',
  }),

  horror: makeSkin('horror', {
    className: 'skin-horror',
    bgm: 'horror_mode_bgm',
    colors: {
      text: '#fff',
      point: '#ff3232',
      buttonText: '#7a0d0d',
    },
  }),
}

export function getModeSkin(modeKey) {
  return MODE_SKINS[modeKey] || MODE_SKINS.default
}