const makeSkin = (key, options = {}) => {
  const assetKey = options.assetKey || key;
  return {
    key,
    className: options.className || `skin-${key}`,
    background: `/skins/${assetKey}/background.webp`,
    bgm: options.bgm || null,
    hints: Array.from(
      { length: 5 },
      (_, i) => `/skins/${assetKey}/hint${i + 1}.webp`
    ),
    answers: Array.from(
      { length: 4 },
      (_, i) => `/skins/${assetKey}/answer${i + 1}.webp`
    ),
    // 기존 호러파티 공통 선택 이미지 유지
    answerSelected: `/skins/${assetKey}/answer_selected.webp`,
    // SF액션 전용 개별 선택 이미지
    answerSelectedList: options.individualAnswerSelected
      ? Array.from(
          { length: 4 },
          (_, i) => `/skins/${assetKey}/answer${i + 1}_selected.webp`
        )
      : null,
    buttons: {
      nextHint: `/skins/${assetKey}/btn_next_hint.webp`,
      skip: `/skins/${assetKey}/btn_skip.webp`,
      skipFill: `/skins/${assetKey}/btn_skip_fill.webp`,
      nextQuiz: `/skins/${assetKey}/btn_next_quiz.webp`,
    },
    colors: {
      headerBg: '#64584a',
      headerBorder: 'none',
      headerBlur: 'none',
      resultTitle: '#8b6b29',
      text: '#222',
      point: '#e8808c',
      buttonText: '#7a0d0d',
      // 힌트 박스
      hintText: '#2b2218',
      hintShadow: 'none',
      hintNumberBg: '#4d2b2f',
      // 정답 버튼
      answerText: '#2b2218',
      answerShadow: 'none',
      movieInfoBg: 'rgba(8, 20, 30, 0.96)',
      movieInfoBorder: '1px solid rgba(0, 217, 245, 0.65)',
      movieInfoGlow: '0 0 10px rgba(0, 217, 245, 0.18)',
      movieInfoText: '#E8F3F7',
      // 다음 힌트 버튼
      nextHintText: '#1a1814',
      nextHintShadow: 'none',
      // 결과 화면 기본 색상
      resultName: '#1a1814',
      resultTotalScore: '#ff6b7a',
      resultCardBg: '#f8f3e7',
      resultCardBorder: '1.5px solid #d9c7a5',
      resultCardGlow: '0 4px 12px rgba(80,60,30,.10)',
      resultCardText: '#2b2218',
      resultMovieTitle: '#1a1814',
      resultFailText: '#c0bbb4',
      resultScoreText: '#d42c3f',
      resultScoreFail: '#c7b9b9',
      resultButtonText: '#2b2218',
      ...options.colors,
    },
  };
};

export const MODE_SKINS = {
  default: makeSkin('default', {
    className: 'skin-default',
  }),

  horror: makeSkin('horror', {
    className: 'skin-horror',
    bgm: 'horror_mode_bgm',
    colors: {
      headerBg: 'rgba(0,0,0,.58)',
      headerBorder: '1px solid rgba(255,0,0,.28)',
      headerBlur: 'blur(8px)',
      text: '#fff',
      point: '#ff3232',
      buttonText: '#7a0d0d',
      hintText: '#fff',
      hintShadow: '0 2px 4px rgba(0,0,0,.8)',
      hintNumberBg: '#7b0000',
      answerText: '#fff',
      answerShadow: '0 2px 4px rgba(0,0,0,.85)',
      nextHintText: '#7a0d0d',
      nextHintShadow: '0 1px 0 rgba(255,255,255,.45)',
      // 결과 화면 - 호러
      resultName: '#ffffff',
      resultTotalScore: '#bd2121',
      resultCardBg: 'rgba(0, 0, 0, 0.88)',
      resultCardBorder: '1px solid rgba(150,20,20,.35)',
      resultCardGlow: '0 8px 24px rgba(0,0,0,.35)',
      resultCardText: '#f2f2f2',
      resultMovieTitle: '#FFFFFF',
      resultFailText: '#c0bbb4',
      resultScoreText: '#d42c3f',
      resultScoreFail: '#c7b9b9',
      resultButtonText: '#7a0d0d',
    },
  }),


  // SF
  sf: makeSkin('sf', {
  assetKey: 'SFaction',
  className: 'skin-scifi',
  individualAnswerSelected: true,
  colors: {
    headerBg: 'rgba(5,15,25,.92)',
    headerBorder: '1px solid rgba(0,217,245,.35)',
    headerBlur: 'blur(8px)',
    resultTitle: '#00E5FF',
    text: '#FFFFFF',
    point: '#00D9F5',
    buttonText: '#111111',
    hintText: '#FFFFFF',
    hintShadow: '0 2px 6px rgba(0,0,0,.95)',
    hintNumberBg: '#073c45',
    answerText: '#FFFFFF',
    answerShadow: '0 2px 4px rgba(0,0,0,.85)',
    nextHintText: '#FFFFFF',
    nextHintShadow: '0 2px 4px rgba(0,0,0,.8)',
    // 결과 화면 - SF
    resultName: '#FFFFFF',
    resultTotalScore: '#00E5FF',
    resultCardBg: 'rgba(5,15,25,.92)',
    resultCardBorder: '1px solid rgba(0,217,245,.65)',
    resultCardGlow: '0 0 12px rgba(0,217,245,.20)',
    resultCardText: '#F2FAFF',
    resultMovieTitle: '#FFFFFF',
    resultFailText: '#94A3B8',
    resultScoreText: '#00E5FF',
    resultScoreFail: '#94A3B8',
    resultButtonText: '#111111',
    reportText: '#00D9F5',
    reportShadow: '0 2px 5px rgba(0,0,0,.95)',

      },

}),
    // 한국영화
    kr: makeSkin('kr', {
      assetKey: 'korea',
      className: 'skin-korea',
      individualAnswerSelected: true,
      colors: {
        headerBg: 'rgba(65, 43, 26, 0.92)',
        headerBorder: '1px solid rgba(190,145,85,.45)',
        headerBlur: 'blur(8px)',
        resultTitle: '#5C351D',
        text: '#2b2218',
        point: '#9E3528',
        buttonText: '#2b2218',
        hintText: '#2b2218',
        hintShadow: 'none',
        hintNumberBg: '#75452D',
        answerText: '#2b2218',
        answerShadow: 'none',
        nextHintText: '#2b2218',
        nextHintShadow: 'none',
        reportText: '#FFFFFF',
        reportShadow: '0 2px 5px rgba(0,0,0,.95)',
        resultName: '#000000',
        resultNameShadow: '0 1px 1px rgba(93, 88, 88, 0.85)',
        resultTitle: '#FFF3D6',
        resultTitleShadow: '0 2px 4px rgba(0,0,0,.95), 0 0 8px rgba(0,0,0,.65)',
        resultTotalScore: '#031602',
        resultTotalScoreShadow: '0 1px 1px rgba(131, 126, 126, 0.75)',
        resultCardBg: '#f3e2c4',
        resultCardBorder: '1.5px solid #a98253',
        resultCardGlow: '0 4px 12px rgba(60,35,15,.18)',
        resultCardText: '#2b2218',
        resultMovieTitle: '#2b2218',
        resultFailText: '#8a7867',
        resultScoreText: '#9E3528',
        resultScoreFail: '#a89785',
        resultRankingButtonText: '#2b2218',
        resultButtonText: '#2b2218',
        movieInfoBg: 'rgba(243, 226, 196, 0.97)',
        movieInfoBorder: '1.5px solid #a98253',
        movieInfoGlow: '0 4px 12px rgba(60,35,15,.18)',
        movieInfoText: '#2b2218',
      },
    }),

    // 애니메이션

    anime: makeSkin('anime', {

      assetKey: 'animation',

      className: 'skin-animation',

      individualAnswerSelected: true,

      colors: {

        headerBg: 'rgba(35, 43, 53, 0.88)',

        headerBorder: '1px solid rgba(185,205,225,.25)',

        headerBlur: 'blur(8px)',

        resultTitle: '#A8D8FF',

        text: '#F5F5F5',

        point: '#A8D8FF',

        buttonText: '#343B48',

        failMessageText: '#F5F5F5',

        failMessageShadow: '0 2px 5px rgba(0,0,0,.95)',

        hintText: '#414655',

        hintShadow: 'none',

        hintNumberBg: '#607D98',

        answerText: '#343B48',

        answerShadow: 'none',

        nextHintText: '#343B48',

        nextHintShadow: 'none',

        rankingButtonText: '#343B48',

        resultTitle: '#343B48',

        resultName: '#FFFFFF',

        resultTotalScore: '#243447',

        resultTotalScoreShadow: '0 1px 3px rgba(255,255,255,.75)',

        resultCardBg: 'rgba(245,248,252,.94)',

        resultCardBorder: '1px solid rgba(185,205,225,.65)',

        resultCardGlow: '0 4px 12px rgba(0,0,0,.18)',

        resultCardText: '#343B48',

        resultMovieTitle: '#343B48',

        resultNameShadow: '0 2px 4px rgba(0,0,0,.9)',

        resultFailText: '#8995A5',

        resultScoreText: '#527EA8',

        resultScoreFail: '#A1AAB5',

        resultButtonText: '#343B48',

        reportText: '#F5F5F5',

        reportShadow: '0 2px 5px rgba(0,0,0,.95)',

        movieInfoBg: 'rgba(239, 237, 230, 0.96)',

        movieInfoBorder: '1.5px solid #C5C5BE',

        movieInfoGlow: '0 4px 12px rgba(0,0,0,.18)',

        movieInfoText: '#414655',

      },

    }),

    // 아시아 영화

    hk: makeSkin('hk', {

      assetKey: 'asia',

      className: 'skin-asia',

      individualAnswerSelected: true,

      colors: {

        headerBg: 'rgba(30, 43, 28, 0.90)',

        headerBorder: '1px solid rgba(178,160,105,.35)',

        headerBlur: 'blur(8px)',

        resultTitle: '#F2D58A',

        text: '#F4E8CD',

        failMessageText: '#F4E8CD',

        failMessageShadow: '0 2px 5px rgba(0,0,0,.85)',

        reportText: '#F4E8CD',
        reportShadow: '0 2px 5px rgba(0,0,0,.95)',

        point: '#F2D58A',

        buttonText: '#493622',

        hintText: '#423923',

        hintShadow: 'none',

        hintNumberBg: '#526B37',

        answerText: '#28351E',

        answerShadow: 'none',

        movieInfoBg: 'rgba(248, 235, 207, 0.95)',

        nextHintText: '#463825',

        nextHintShadow: 'none',

        rankingButtonText: '#725230',

        resultMovieTitle: '#FFFFFF',

        resultScoreText: '#FFE2A0',

        resultScoreFail: '#B8B0A0',

        resultName: '#F4E8CD',

        resultTotalScore: '#F2D58A',

        resultCardBg: 'rgba(244,232,205,.95)',

        resultCardBorder: '1px solid #9A8253',

        resultCardGlow: '0 4px 12px rgba(0,0,0,.20)',

        resultCardText: '#423923',

        resultFailText: '#97896E',

        resultButtonText: '#463825',

        movieInfoBg: 'rgba(244,232,205,.97)',

        movieInfoBorder: '1px solid #9A8253',

        movieInfoGlow: '0 4px 12px rgba(0,0,0,.20)',

        movieInfoText: '#423923',

      },

    }),

    // 미스터리 스릴러

    thriller: makeSkin('thriller', {

      assetKey: 'mystery',

      className: 'skin-mystery',

      individualAnswerSelected: true,

      colors: {

        buttonShadow: '0 2px 3px rgba(0,0,0,.85)',

        headerBg: 'rgba(24, 21, 19, 0.90)',

        headerBorder: '1px solid rgba(160,140,115,.30)',

        headerBlur: 'blur(8px)',

        resultTitle: '#E9B66C',

        text: '#F2E8D8',

        failMessageText: '#F2E8D8',
        failMessageShadow: '0 2px 5px rgba(0,0,0,.95)',

        reportText: '#F4E8CD',
        reportShadow: '0 2px 5px rgba(0,0,0,.95)',

        point: '#E9B66C',

        buttonText: '#F5F1E8',

        hintText: '#3A2B20',

        hintShadow: 'none',

        hintNumberBg: '#66503A',

        answerText: '#F5F1E8',

        answerShadow: '0 1px 2px rgba(0,0,0,.65)',

        nextHintText: '#FFFFFF',

        nextQuizText: '#FFFFFF',

        nextHintShadow: '0 1px 2px rgba(0,0,0,.65)',

        nextQuizShadow: '0 2px 3px rgba(0,0,0,.85)',

        rankingButtonText: '#3A2B20',

        resultName: '#F2E8D8',

        resultNameShadow: '0 2px 5px rgba(0,0,0,.95)',

        resultTotalScore: '#E9B66C',

        resultTotalScoreShadow: '0 2px 5px rgba(0,0,0,.85)',

        resultCardBg: 'rgba(37,32,28,.94)',

        resultCardBorder: '1px solid rgba(180,155,120,.45)',

        resultCardGlow: '0 6px 16px rgba(0,0,0,.30)',

        resultCardText: '#F2E8D8',

        resultMovieTitle: '#F5F1E8',

        resultFailText: '#A89A89',

        resultScoreText: '#E9B66C',

        resultScoreFail: '#8F8478',

        resultButtonText: '#FFFFFF',

        movieInfoBg: 'rgba(37,32,28,.97)',

        movieInfoBorder: '1px solid rgba(180,155,120,.45)',

        movieInfoGlow: '0 6px 16px rgba(0,0,0,.30)',

        movieInfoText: '#F2E8D8',

      },

    }),
  }


export function getModeSkin(modeKey) {
  return MODE_SKINS[modeKey] || MODE_SKINS.default
}