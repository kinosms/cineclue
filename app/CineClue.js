'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import FlashLetterHint from './FlashLetterHint'
import IntroScreen from '../components/IntroScreen'
import CharacterScreen from '../components/CharacterScreen'
import ModeScreen from '../components/ModeScreen'
import LoginModal from '../components/LoginModal'
import QuizScreen from '../components/QuizScreen'
import ResultScreen from '../components/ResultScreen'
import Collection from '../components/Collection'
import MovieFlipCard from '../components/MovieFlipCard'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
)


const LEVEL_TITLES = {
  1: '스크린 입문자',
  2: '팝콘 감시자',
  3: '엔딩크레딧 관찰자',
  4: '예고편 수집가',
  5: '비디오 가게 단골',
  6: '리모컨 방랑자',
  7: '심야 영화 탐험가',
  8: '장면 수집가',
  9: '대사 따라하는 사람',
  10: '필름 탐정',
  11: '포스터 감별사',
  12: '극장 의자 감정사',
  13: '시네마 헌터',
  14: 'VHS 보관자',
  15: '기억의 큐레이터',
  16: '필름 냄새 감식자',
  17: '오프닝 시퀀스 중독자',
  18: '필름 아카이비스트',
  19: '숨은 명작 발굴자',
  20: '장르 횡단자',
  21: 'B급 영화 생존자',
  22: '자막 완독자',
  23: '흑백영화 체류자',
  24: 'OST 추적자',
  25: '감독 이름 외우는 사람',
  26: '영화관 골목 주민',
  27: '스포일러 회피 전문가',
  28: '필름 릴 수호자',
  29: '엔딩 여운 체류자',
  30: '장면 기억 증후군',
  31: '새벽 2시 관람객',
  32: '대사 암기자',
  33: '프레임 분석가',
  34: '크레딧 끝까지 보는 사람',
  35: '폐관 극장 탐험가',
  36: '시네마 노마드',
  37: '장르 왜곡자',
  38: '극장 좌석 철학자',
  39: '영화 대화 중독자',
  40: '필름 룸 거주자',
  41: 'VHS 복원가',
  42: '오래된 극장의 유령',
  43: '리메이크 감별사',
  44: '편집 리듬 분석가',
  45: '영화제 방랑자',
  46: '필름 더스트 수집가',
  47: '장면 해석자',
  48: '시네마 심문관',
  49: '기억 속 스크린 관리자',
  50: '장르 초월자',
  51: '대사 반응 감지자',
  52: '카메라 워킹 추적자',
  53: '영화 포스터 사냥꾼',
  54: '심야 상영관 관리자',
  55: '극장 폐인',
  56: '필름 심연 관측자',
  57: '사운드트랙 순례자',
  58: '고전영화 보존회 회원',
  59: '스틸컷 기억자',
  60: '장면 복원술사',
  61: '엔딩 후 체류자',
  62: '필름 미로 탐험가',
  63: '장르 해체자',
  64: '무삭제판 추적자',
  65: '대사 구조 분석가',
  66: '필름 시간여행자',
  67: '시네마 중독자',
  68: '장면 연결자',
  69: '영화관 야행성 주민',
  70: '스크린 심문관',
  71: '장르 포식자',
  72: '필름 유물 감정사',
  73: '크레딧 이후 생존자',
  74: '시네마 잠복자',
  75: '장면 예언자',
  76: '필름 감정 채굴자',
  77: '영화 기억 변환자',
  78: '시네마 코드 해독자',
  79: '숨겨진 명장면 목격자',
  80: '스크린 내부인',
  81: '필름 미학 연구자',
  82: '극장 잔광 수집가',
  83: '장면 지배자',
  84: '영화 시간 관리자',
  85: '시네마 환영 목격자',
  86: '프레임 사냥꾼',
  87: '필름 차원 이동자',
  88: '장르 파괴자',
  89: '영화 기억 아카이브',
  90: '극장 심층 거주자',
  91: '엔딩 이후의 사람',
  92: '스크린 환영체',
  93: '필름 세계 관찰자',
  94: '시네마 괴인',
  95: '기억 속 상영기사',
  96: '필름 차원 관리자',
  97: '장면의 지배자',
  98: '영화의 잔상',
  99: '스크린 너머의 존재',
  100: 'CineClue Grand Master'
}


const CHARS = [
  {
    id: 'yoda', name: '포스의 스승', movie: '스타워즈', color: '#5a9660',
    svg: <svg viewBox="0 0 80 80" fill="none"><ellipse cx="40" cy="52" rx="14" ry="11" fill="#4a7c4e" /><ellipse cx="40" cy="36" rx="16" ry="15" fill="#6aaa6e" /><ellipse cx="8" cy="34" rx="10" ry="5" fill="#5a9660" transform="rotate(-20 8 34)" /><ellipse cx="72" cy="34" rx="10" ry="5" fill="#5a9660" transform="rotate(20 72 34)" /><ellipse cx="34" cy="34" rx="4" ry="4.5" fill="#1a2a1a" /><ellipse cx="46" cy="34" rx="4" ry="4.5" fill="#1a2a1a" /><circle cx="33" cy="33" r="1.5" fill="#fff" opacity=".8" /><circle cx="45" cy="33" r="1.5" fill="#fff" opacity=".8" /><path d="M32 42 Q40 45 48 42" stroke="#3a6040" strokeWidth="1.5" fill="none" /><path d="M28 30 Q30 27 34 29" stroke="#3a6040" strokeWidth="1" fill="none" /><path d="M46 29 Q50 27 52 30" stroke="#3a6040" strokeWidth="1" fill="none" /></svg>
  },
  {
    id: 'immortan', name: '사막 독재자', movie: '매드맥스', color: '#4a90e8',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="20" y="50" width="40" height="22" rx="4" fill="#c8c0b0" /><ellipse cx="40" cy="36" rx="18" ry="17" fill="#d4cabb" /><rect x="24" y="38" width="32" height="18" rx="8" fill="#e8e8e8" stroke="#bbb" strokeWidth="1" /><rect x="27" y="41" width="26" height="12" rx="5" fill="#d0d0d0" />{[30, 34, 38, 42, 46].map(x => <line key={x} x1={x} y1="41" x2={x} y2="53" stroke="#bbb" strokeWidth="1" />)}<ellipse cx="32" cy="31" rx="5" ry="3.5" fill="#5588dd" opacity=".9" /><ellipse cx="48" cy="31" rx="5" ry="3.5" fill="#5588dd" opacity=".9" /><ellipse cx="32" cy="31" rx="3" ry="2.5" fill="#2255aa" /><ellipse cx="48" cy="31" rx="3" ry="2.5" fill="#2255aa" /><ellipse cx="40" cy="20" rx="16" ry="10" fill="#e8e4dc" /></svg>
  },
  {
    id: 'leon', name: '고독한 킬러', movie: '레옹', color: '#888',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="18" y="52" width="44" height="22" rx="4" fill="#2a2a2a" /><ellipse cx="40" cy="36" rx="17" ry="18" fill="#c8956a" /><rect x="22" y="24" width="36" height="7" rx="3" fill="#111" /><circle cx="31" cy="27" r="6" fill="#0a0a0a" stroke="#444" strokeWidth="1.5" /><circle cx="49" cy="27" r="6" fill="#0a0a0a" stroke="#444" strokeWidth="1.5" /><line x1="37" y1="27" x2="43" y2="27" stroke="#444" strokeWidth="1.5" /><path d="M33 44 Q40 47 47 44" stroke="#8a6040" strokeWidth="1.5" fill="none" /><ellipse cx="40" cy="20" rx="17" ry="8" fill="#1a1a1a" /></svg>
  },
  {
    id: 'morpheus', name: '각성의 안내자', movie: '매트릭스', color: '#8866cc',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="15" y="52" width="50" height="22" rx="4" fill="#111" /><ellipse cx="40" cy="36" rx="16" ry="17" fill="#7a5a3a" /><ellipse cx="31" cy="33" rx="7" ry="4.5" fill="#0a0a0a" stroke="#888" strokeWidth="1.5" /><ellipse cx="49" cy="33" rx="7" ry="4.5" fill="#0a0a0a" stroke="#888" strokeWidth="1.5" /><line x1="38" y1="33" x2="42" y2="33" stroke="#888" strokeWidth="1.5" /><path d="M33 45 Q40 49 47 45" stroke="#4a3020" strokeWidth="2" fill="none" /><ellipse cx="40" cy="21" rx="16" ry="9" fill="#5a3a1a" /><ellipse cx="28" cy="64" rx="4" ry="2.5" fill="#dd2222" /><ellipse cx="52" cy="64" rx="4" ry="2.5" fill="#2244cc" /></svg>
  },
  {
    id: 'pennywise', name: '공포먹는 삐에로', movie: '그것', color: '#e07020',
    svg: <svg viewBox="0 0 80 80" fill="none"><ellipse cx="40" cy="68" rx="22" ry="10" fill="#f0f0f0" /><circle cx="28" cy="64" r="4" fill="#dd4444" /><circle cx="40" cy="66" r="4" fill="#dd4444" /><circle cx="52" cy="64" r="4" fill="#dd4444" /><ellipse cx="40" cy="36" rx="18" ry="19" fill="#f5f0e8" /><ellipse cx="12" cy="26" rx="7" ry="10" fill="#dd6600" transform="rotate(-20 12 26)" /><ellipse cx="68" cy="26" rx="7" ry="10" fill="#dd6600" transform="rotate(20 68 26)" /><ellipse cx="31" cy="31" rx="5.5" ry="5.5" fill="#f5dd44" /><ellipse cx="49" cy="31" rx="5.5" ry="5.5" fill="#f5dd44" /><ellipse cx="31" cy="31" rx="3" ry="3.5" fill="#1a1a1a" /><ellipse cx="49" cy="31" rx="3" ry="3.5" fill="#1a1a1a" /><ellipse cx="40" cy="39" rx="4.5" ry="3.5" fill="#dd2222" /><path d="M24 46 Q28 51 40 53 Q52 51 56 46" stroke="#cc1111" strokeWidth="2.5" fill="none" /></svg>
  },
  {
    id: 'predator', name: '외계 포식자', movie: '프레데터', color: '#6a9a3a',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="16" y="52" width="48" height="22" rx="4" fill="#5a7a3a" /><ellipse cx="40" cy="36" rx="17" ry="18" fill="#6a8a4a" />{[-16, -8, 0, 8, 16].map((dx, i) => (<line key={i} x1={40 + dx} y1="20" x2={40 + dx * 1.5} y2="8" stroke="#4a6a2a" strokeWidth="3" strokeLinecap="round" />))}<ellipse cx="32" cy="32" rx="4" ry="3" fill="#aadd00" /><ellipse cx="48" cy="32" rx="4" ry="3" fill="#aadd00" /><ellipse cx="32" cy="32" rx="2" ry="2" fill="#88bb00" /><ellipse cx="48" cy="32" rx="2" ry="2" fill="#88bb00" /><path d="M30 43 L33 50 L36 43 L40 50 L44 43 L47 50 L50 43" stroke="#3a5a1a" strokeWidth="1.5" fill="none" /></svg>
  },
  {
    id: 'sparrow', name: '불멸의 해적', movie: '캐리비안의 해적', color: '#8a5a2a',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="18" y="52" width="44" height="22" rx="4" fill="#3a2a1a" /><ellipse cx="40" cy="37" rx="16" ry="17" fill="#c8906a" /><path d="M16 26 L40 8 L64 26 Z" fill="#1a1a1a" /><rect x="14" y="24" width="52" height="5" rx="2" fill="#2a2a2a" /><ellipse cx="32" cy="34" rx="4.5" ry="3.5" fill="#1a1a1a" /><ellipse cx="48" cy="34" rx="4.5" ry="3.5" fill="#1a1a1a" /><path d="M27 32 Q32 29 37 32" stroke="#1a1a1a" strokeWidth="1.5" fill="none" /><path d="M43 32 Q48 29 53 32" stroke="#1a1a1a" strokeWidth="1.5" fill="none" /><path d="M34 42 Q40 44 46 42" stroke="#5a3a1a" strokeWidth="2" fill="none" /><line x1="38" y1="43" x2="38" y2="48" stroke="#5a3a1a" strokeWidth="1.5" /><line x1="42" y1="43" x2="42" y2="48" stroke="#5a3a1a" strokeWidth="1.5" /><path d="M24 26 Q40 22 56 26 Q56 30 40 32 Q24 30 24 26" fill="#cc3322" /></svg>
  },
  {
    id: 'joker', name: '혼돈의 광대', movie: '다크나이트', color: '#5533aa',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="16" y="52" width="48" height="22" rx="4" fill="#5533aa" /><ellipse cx="40" cy="36" rx="17" ry="18" fill="#f0eeea" /><ellipse cx="31" cy="32" rx="5" ry="4" fill="#1a1a1a" opacity=".8" /><ellipse cx="49" cy="32" rx="5" ry="4" fill="#1a1a1a" opacity=".8" /><path d="M28 35 Q30 40 29 43" stroke="#1a1a1a" strokeWidth="1.5" fill="none" opacity=".6" /><path d="M52 35 Q50 40 51 43" stroke="#1a1a1a" strokeWidth="1.5" fill="none" opacity=".6" /><path d="M22 44 Q27 40 31 44 Q35 48 40 46 Q45 48 49 44 Q53 40 58 44" stroke="#dd2222" strokeWidth="2.5" fill="none" /><ellipse cx="40" cy="20" rx="17" ry="10" fill="#446622" />{[28, 33, 38, 43, 48, 53].map((x, i) => (<line key={i} x1={x} y1="20" x2={x + (i % 2 === 0 ? -2 : 2)} y2="10" stroke="#335511" strokeWidth="2.5" strokeLinecap="round" />))}</svg>
  },
  {
    id: 'sadako', name: '우물 귀신', movie: '링', color: '#444',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="18" y="48" width="44" height="28" rx="4" fill="#f0f0f0" /><ellipse cx="40" cy="36" rx="16" ry="17" fill="#f5f0e8" /><path d="M24 20 Q20 36 18 56" stroke="#1a1a1a" strokeWidth="8" fill="none" strokeLinecap="round" /><path d="M28 18 Q24 34 22 52" stroke="#1a1a1a" strokeWidth="7" fill="none" strokeLinecap="round" /><path d="M34 17 Q30 32 28 50" stroke="#1a1a1a" strokeWidth="6" fill="none" strokeLinecap="round" /><path d="M40 16 Q38 30 36 50" stroke="#1a1a1a" strokeWidth="5" fill="none" strokeLinecap="round" /><path d="M56 20 Q60 36 62 56" stroke="#1a1a1a" strokeWidth="8" fill="none" strokeLinecap="round" /><path d="M52 18 Q56 34 58 52" stroke="#1a1a1a" strokeWidth="7" fill="none" strokeLinecap="round" /><path d="M46 17 Q50 32 52 50" stroke="#1a1a1a" strokeWidth="6" fill="none" strokeLinecap="round" /><ellipse cx="40" cy="20" rx="17" ry="11" fill="#1a1a1a" /><ellipse cx="47" cy="35" rx="3" ry="3.5" fill="#0a0a0a" /><circle cx="48" cy="34" r="1" fill="#fff" opacity=".6" /></svg>
  },
]

const GRADE_CHARS = {
  // 2020년대: 퓨리오사 (매드맥스)
  "2020s": <svg viewBox="0 0 60 60" fill="none"><rect x="8" y="44" width="44" height="12" rx="2" fill="#2e1f14" /><ellipse cx="30" cy="30" rx="15" ry="16" fill="#c89a7a" /><path d="M15 20 Q30 14 45 20 L45 25 Q30 23 15 25 Z" fill="#5a3820" opacity="0.6" /><path d="M17 18 Q30 14 43 18 L43 24 Q30 28 17 24 Z" fill="#0a0a0a" /><path d="M22 26 L20 36" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" /><path d="M30 27 L30 38" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" /><path d="M38 26 L40 36" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" /><ellipse cx="22" cy="29" rx="2.5" ry="1.8" fill="#fff" /><ellipse cx="38" cy="29" rx="2.5" ry="1.8" fill="#fff" /><circle cx="22" cy="29" r="1.2" fill="#4a3020" /><circle cx="38" cy="29" r="1.2" fill="#4a3020" /><path d="M26 39 L34 39" stroke="#6a2818" strokeWidth="1.8" strokeLinecap="round" /><rect x="4" y="44" width="6" height="12" rx="1" fill="#8a9098" /><circle cx="7" cy="48" r="0.8" fill="#333" /><circle cx="7" cy="52" r="0.8" fill="#333" /></svg>,

  // 2010년대: 아이언맨
  "2010s": <svg viewBox="0 0 60 60" fill="none"><rect x="18" y="48" width="24" height="8" fill="#a00018" /><ellipse cx="30" cy="26" rx="17" ry="18" fill="#c8181a" /><path d="M14 24 Q20 12 30 10 Q40 12 46 24" fill="none" stroke="#e8302a" strokeWidth="2" /><path d="M14 30 Q30 28 46 30 Q46 44 30 46 Q14 44 14 30 Z" fill="#e8c440" /><path d="M18 32 Q30 30 42 32 L42 34 Q30 32 18 34 Z" fill="#c8a030" /><path d="M30 30 L30 46" stroke="#a88020" strokeWidth="0.8" /><path d="M18 32 L26 30 L24 36 Z" fill="#b8e8ff" /><path d="M42 32 L34 30 L36 36 Z" fill="#b8e8ff" /><path d="M19 32.5 L24 31 L23 34.5 Z" fill="#ffffff" /><path d="M41 32.5 L36 31 L37 34.5 Z" fill="#ffffff" /><rect x="27" y="41" width="6" height="1.5" fill="#a08020" /><path d="M14 30 L18 38 L14 42 Z" fill="#c8181a" /><path d="M46 30 L42 38 L46 42 Z" fill="#c8181a" /></svg>,

  // 2000년대: 네오 (매트릭스)
  "2000s": <svg viewBox="0 0 60 60" fill="none"><path d="M6 56 L14 42 L30 50 L46 42 L54 56 Z" fill="#0a0a0a" /><path d="M20 44 L30 54 L40 44 L40 56 L20 56 Z" fill="#1a1a1a" /><ellipse cx="30" cy="28" rx="15" ry="16" fill="#e0b896" /><path d="M14 20 Q30 10 46 20 Q44 24 30 22 Q16 24 14 20 Z" fill="#1a1a1a" /><path d="M14 18 Q20 14 30 14 Q40 14 46 18 L46 16 Q30 8 14 16 Z" fill="#0a0a0a" /><circle cx="22" cy="28" r="5" fill="#0a0a0a" /><circle cx="38" cy="28" r="5" fill="#0a0a0a" /><circle cx="22" cy="28" r="4" fill="#151520" /><circle cx="38" cy="28" r="4" fill="#151520" /><ellipse cx="20" cy="26" rx="1.2" ry="0.8" fill="#4a8aa8" opacity="0.7" /><ellipse cx="36" cy="26" rx="1.2" ry="0.8" fill="#4a8aa8" opacity="0.7" /><rect x="27" y="27.5" width="6" height="1.5" fill="#0a0a0a" /><path d="M26 40 L34 40" stroke="#7a4030" strokeWidth="1.5" strokeLinecap="round" /></svg>,

  // 1990년대: 우마 서먼 (킬빌의 신부)
  "1990s": <svg viewBox="0 0 60 60" fill="none"><rect x="10" y="42" width="40" height="14" rx="2" fill="#f5dc1a" /><rect x="10" y="42" width="4" height="14" fill="#0a0a0a" /><rect x="46" y="42" width="4" height="14" fill="#0a0a0a" /><path d="M30 42 L30 56" stroke="#0a0a0a" strokeWidth="1" /><ellipse cx="30" cy="28" rx="15" ry="16" fill="#f0d4b2" /><path d="M8 20 Q10 12 20 12 L22 28 Q16 36 12 42 L8 40 Z" fill="#f0d880" /><path d="M52 20 Q50 12 40 12 L38 28 Q44 36 48 42 L52 40 Z" fill="#f0d880" /><path d="M14 16 Q20 10 30 10 Q40 10 46 16 Q44 22 30 20 Q16 22 14 16 Z" fill="#f0d880" /><path d="M30 10 L30 18" stroke="#c8b050" strokeWidth="0.8" /><ellipse cx="22" cy="28" rx="2.5" ry="1.8" fill="#fff" /><ellipse cx="38" cy="28" rx="2.5" ry="1.8" fill="#fff" /><circle cx="22" cy="28" r="1.3" fill="#4a78a0" /><circle cx="38" cy="28" r="1.3" fill="#4a78a0" /><path d="M26 38 Q30 36 34 38" stroke="#a02020" strokeWidth="1.8" fill="none" strokeLinecap="round" /><path d="M15 26 L18 34" stroke="#a00018" strokeWidth="1.2" strokeLinecap="round" /></svg>,

  // 오래전 영화: 찰리 채플린
  "old": <svg viewBox="0 0 60 60" fill="none"><rect x="12" y="44" width="36" height="12" fill="#1a1a1a" /><path d="M24 44 L30 52 L36 44 L36 50 L24 50 Z" fill="#fafafa" /><path d="M28 48 L32 48 L34 52 L26 52 Z" fill="#0a0a0a" /><ellipse cx="30" cy="28" rx="14" ry="15" fill="#f2d8b8" /><ellipse cx="30" cy="18" rx="16" ry="2.5" fill="#0a0a0a" /><ellipse cx="30" cy="14" rx="12" ry="7" fill="#0a0a0a" /><ellipse cx="30" cy="13" rx="10" ry="5" fill="#1f1f1f" /><rect x="20" y="17" width="20" height="1" fill="#2a2a2a" /><ellipse cx="24" cy="28" rx="2" ry="2.5" fill="#fff" /><ellipse cx="36" cy="28" rx="2" ry="2.5" fill="#fff" /><circle cx="24" cy="29" r="1.3" fill="#1a1a1a" /><circle cx="36" cy="29" r="1.3" fill="#1a1a1a" /><rect x="27" y="34" width="6" height="2.5" rx="0.5" fill="#0a0a0a" /><path d="M25 40 Q30 43 35 40" stroke="#8a4020" strokeWidth="1.3" fill="none" strokeLinecap="round" /><circle cx="30" cy="49" r="0.8" fill="#2a2a2a" /><circle cx="30" cy="53" r="0.8" fill="#2a2a2a" /></svg>,
}

const GRADES = [
  { id: '2020s', name: '2020년대', desc: '매드맥스·기생충·범죄도시… 요즘 거 맞춰보자' },
  { id: '2010s', name: '2010년대', desc: '인터스텔라·어벤져스·곡성… 기억나지?' },
  { id: '2000s', name: '2000년대', desc: '올드보이·괴물·매트릭스… 추억 소환' },
  { id: '1990s', name: '1990년대', desc: '쥬라기공원·더록·킬빌… 이젠 클래식' },
  { id: 'old', name: '오래전 영화', desc: '스타워즈·대부·칠수와 만수… 진짜 영화 덕후 영역' }
]

function shuffle(arr) {

  const a = [...arr]

  for (let i = a.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1))

      ;[a[i], a[j]] = [a[j], a[i]]

  }

  return a

}

const BP = 1000
const FBW = {
  1: ['힌트가 좀 어려웠지?', '아직 힌트 4개나 남았어', '처음부터 맞추면 재미없잖아'],
  2: ['아깝다. 좀 더 생각해봐', '거의 다 왔는데!', '느낌이 왔을 것 같은데...'],
  3: ['이걸 모른다고?', '이 영화 분명 본 적 있을걸?', '이거 모르면 영화 레벨 의심'],
  4: ['배우 이름까지 나왔는데?', '이건 맞추는 사람 많던데', '자존심 안 상해?'],
  5: ['포기 포기 😮‍💨', '오늘은 여기까지', '오늘은 이 영화가 이겼어'],
}
const rFB = h => { const a = FBW[h] || FBW[5]; return a[Math.floor(Math.random() * a.length)] }

function normalize(s) {

  return String(s || '')

    .toLowerCase()

    .replace(/[\s:!"',.·~…()\[\]/\\-_]/g, '')

}
function lev(a, b) {
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0))
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
  return dp[m][n]
}
function isCorrect(inp, title, answers = []) {
  const a = normalize(inp)
  for (const c of [title, ...answers]) {
    const b = normalize(c)
    // 🔥 1️⃣ 숫자 4자리면 완전 일치만 허용
    if (/^\d{4}$/.test(b)) {
      if (a === b) return true
      continue
    }
    // 1️⃣ 완전 일치
    if (a === b) return true
    // 2️⃣ 짧은 단어 보호
    if (b.length < 4) continue
    // 3️⃣ 오타 1개 허용
    if (a.length === b.length && lev(a, b) <= 1) {
      return true
    }
  }
  return false
}
//스피너//
function CharacterSpinner({ fadeOut }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => {
      setIdx(prev => (prev + 1) % CHARS.length)
    }, 180)
    return () => clearInterval(t)
  }, [])
  const char = CHARS[idx]
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(255,255,255,0.6)',
      backdropFilter: 'blur(1.5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.5s ease'
    }}>

      <div style={{
        width: 110,
        height: 110,
        borderRadius: '50%',
        background: '#fff',
        border: '2px solid #e8e4dd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
      }}>

        <svg viewBox="0 0 80 80" style={{ width: 90, height: 90 }}>

          {char.svg.props.children}

        </svg>

      </div>

    </div>

  )

}




async function saveLog({
  supabase,
  userId,
  charId,
  movie,
  grade,
  hintUsed,
  score,
  comboMode,
  isCorrect,
  isSkip,
  userInput,
  nickname,
  genre,
  log_type = 'play',
  quizMode
}) {

  if (!supabase) {
    alert('❌ supabase 없음')
    return
  }

  const movieId = movie?.id ?? null

  // 1️⃣ 게임 로그 저장
  await safeQuery(

    supabase

      .from('game_logs')

      .insert({

        user_id: userId,

        character_id: charId,

        movie_id: movieId,

        hint_used: hintUsed,

        score_earned: score,

        combo_mode: comboMode,

        is_correct: isCorrect,

        is_skip: isSkip || false,

        nickname: nickname,

        user_input: userInput,

        genre: genre,

        log_type: log_type,

        mode: quizMode

      }),

    'insert game log'

  )

}





async function getProfileStats(supabase, charId) {
  console.log('🔥 getProfileStats charId', charId)

  const { data: logs = [] } =

    await safeQuery(

      supabase

        .from('game_logs')

        .select('*')

        .eq('character_id', charId),

      'load profile stats'

    )
  const playLogs = logs.filter(

    l =>

      String(l.log_type || '')

        .trim()

        .toLowerCase() === 'play'

  )

  const totalSeconds = playLogs.reduce((sum, l) => {
    return sum + (l.mode === 'objective' ? 15 : 30)
  }, 0)

  const lastPlayed =
    playLogs
      .filter(l => l.created_at)
      .sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      )[0]?.created_at

  const genreMap = {}


  playLogs.forEach(l => {

    if (!l.genre) return

    if (!genreMap[l.genre]) {

      genreMap[l.genre] = {

        genre: l.genre,

        attemptedMovieIds: new Set(),

        correctMovieIds: new Set(),

        total_score: 0

      }

    }

    genreMap[l.genre].attemptedMovieIds.add(l.movie_id)

    if (l.is_correct) {

      genreMap[l.genre].correctMovieIds.add(l.movie_id)

    }

    genreMap[l.genre].total_score +=

      l.score_earned || 0

  })

  const genreStats = await Promise.all(

    Object.values(genreMap).map(async g => {

      const attempt_count =
        g.attemptedMovieIds.size

      const correct_count =
        g.correctMovieIds.size

      const { count: total_movies = 0 } =
        await safeQuery(

          supabase

            .from('movies')

            .select('*', {
              count: 'exact',
              head: true
            })

            .eq('genre', g.genre),

          `count movies ${g.genre}`

        )

      return {

        genre: g.genre,

        attempt_count,

        correct_count,

        total_movies,

        total_score: g.total_score,

        percent:
          total_movies > 0

            ? Math.round(
              (correct_count / total_movies) * 100
            )

            : 0

      }

    })

  )

  const favoriteGenres =
    [...genreStats]
      .sort((a, b) =>
        b.percent - a.percent
      )
      .slice(0, 2)
      .map(g => g.genre)

  return {
    totalSeconds,
    lastPlayed,
    favoriteGenres,
    genreStats
  }
}






async function loadRanking({ supabase }) {
  const {

    data = []

  } = await safeQuery(

    supabase

      .from('game_logs')

      .select('id, user_id, character_id, score_earned, nickname')

      .eq('log_type', 'result')

      .not('score_earned', 'is', null),

    'load ranking'

  )

  const map = {}

  data.forEach(d => {
    const key = `${d.user_id}_${d.character_id}`
    if (!map[key]) {
      map[key] = {
        user_id: d.user_id,
        character_id: d.character_id,
        score: d.score_earned,
        nickname: d.nickname || null,
        id: d.id
      }
    }
    else {
      if (d.id > map[key].id) {
        map[key] = {
          user_id: d.user_id,
          character_id: d.character_id,
          score: d.score_earned,
          nickname: d.nickname || map[key].nickname,
          id: d.id
        }
      }
    }
  })

  return Object.values(map)
    .map(d => ({
      user_id: d.user_id,
      character_id: d.character_id,
      score: d.score,
      nickname: d.nickname
    }))
    .sort((a, b) => b.score - a.score)
}






function CharAvatar({ charId, size = 40 }) {
  const c = CHARS.find(x => x.id === charId)
  if (!c) return <div style={{ width: size, height: size, borderRadius: '50%', background: '#f0eeea', border: '1.5px solid #e0dcd4' }} />
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#f5f3ef', border: '1.5px solid #e8e4dd', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
      <svg viewBox="0 0 80 80" fill="none" style={{ width: size, height: size }}>{c.svg.props.children}</svg>
    </div>
  )
}



function AppLayout({ children }) {
  return (
    <div style={{
      minHeight: '100dvh',
      background: '#f5f3ef',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        background: '#fff',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </div>
    </div>
  )
}






//=====================================================================================================================================

//공통함수 만들기
//1️⃣ timeout wrapper
async function withTimeout(
  promise,
  label = 'request',
  ms = 5000
) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(
          new Error(`${label} timeout`)
        ),
        ms
      )
    )
  ])
}


//2️⃣ safe query wrapper
async function safeQuery(promise, label = 'query') {
  try {
    const result = await withTimeout(
      promise,
      5000
    )
    if (result.error) {
      console.error(
        `${label} error`,
        result.error
      )
      return {
        data: null,
        error: result.error
      }
    }
    return result
  } catch (e) {
    console.error(
      `${label} failed`,
      e
    )
    return {
      data: null,
      error: e
    }
  }
}


//3️⃣ reconnect helper
async function recoverConnection() {
  try {
    const {
      data: { session }
    } = await supabase.auth.getSession()
    return !!session
  } catch (e) {
    console.error(
      'recoverConnection failed',
      e
    )
    return false
  }
}

//=====================================================================================================================================



export default function CineClue() {

  const infoBox = {
    background: '#fff',
    border: '1px solid #e8e4dd',
    borderRadius: 12,
    padding: '10px 12px'
  }

  const label = {
    fontSize: '0.65rem',
    color: '#aaa',
    marginBottom: 4
  }

  const value = {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#fff'
  }

  async function fetchAllMovies() {
    const all = []
    const pageSize = 1000
    let from = 0

    while (true) {
      const { data = [] } =

        await safeQuery(

          supabase
            .from('movies')
            .select('id, title')
            .range(
              from,
              from + pageSize - 1
            ),

          `fetch all movies ${from}`

        )

      if (data.length === 0) break

      all.push(...data)
      if (data.length < pageSize) break
      from += pageSize
    }
    return all
  }


  const MODES = [
    { key: '2020s', label: '2020년대', type: 'era', image: '/mode/20s.webp' },
    { key: '2010s', label: '2010년대', type: 'era', image: '/mode/10s.webp' },
    { key: '2000s', label: '2000년대', type: 'era', image: '/mode/00s.webp' },
    { key: '1990s', label: '1990년대', type: 'era', image: '/mode/90s.webp' },
    { key: 'old', label: 'CLASSIC MOVIES', type: 'era', image: '/mode/old.webp' },
    { key: 'all', label: 'ALL MOVIES', type: 'era', image: '/mode/all.webp' },
    { key: 'horror', label: '호러파티', type: 'theme', image: '/mode/horror.webp' },
    { key: 'hk', label: '아시아영화 매니아', type: 'theme', image: '/mode/hk.webp' },
    { key: 'sf', label: 'SF환상특급', type: 'theme', image: '/mode/sf.webp' },
    { key: 'kr', label: '한국영화 따라잡기', type: 'theme', image: '/mode/kr.webp' },
    { key: 'anime', label: '오로지 애니', type: 'theme', image: '/mode/anime.webp' },
    { key: 'thriller', label: '미스테리&스릴러', type: 'theme', image: '/mode/thriller.webp' }
  ]

  const MODE_IMAGES = [
    '/mode/20s.webp',
    '/mode/10s.webp',
    '/mode/00s.webp',
    '/mode/90s.webp',
    '/mode/old.webp',
    '/mode/all.webp',
    '/mode/horror.webp',
    '/mode/hk.webp',
    '/mode/sf.webp',
    '/mode/kr.webp',
    '/mode/anime.webp',
    '/mode/thriller.webp'
  ]


  const TMDB_GENRE_MAP = {
    '애니메이션': [16],
    'SF': [878],
    'SF공포': [878, 27],
    'SF액션': [878, 28],
    '판타지': [14],
    '판타지액션': [14, 28],
    '공포': [27],
    '미스터리/스릴러': [9648, 53],
    '액션': [28],
    '코미디': [35],
    '로맨스': [10749],
    '드라마': [18]
  }



  const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_KEY
  const KMDB_KEY = process.env.NEXT_PUBLIC_KMDB_KEY

  const [showRecommendCard, setShowRecommendCard]
    = useState(false)
  const [recommendCard, setRecommendCard]
    = useState(null)
  const [showMovieCard, setShowMovieCard]
    = useState(false)
  const [movieCard, setMovieCard]
    = useState(null)
  const [movieCardFlipped, setMovieCardFlipped]
    = useState(false)



  const [showLogin, setShowLogin] = useState(false)
  const [authUser, setAuthUser] = useState(null)

  const loginGoogle = async () => {

    localStorage.setItem(

      'cineclue_oauth_start',

      'true'

    )

    saveCurrentSession({

      screen,

      selChar

    })

    await safeQuery(

      supabase.auth.signInWithOAuth({

        provider: 'google'

      }),

      'google oauth login'

    )

  }

  const loginKakao = async () => {


    localStorage.setItem(

      'cineclue_oauth_start',

      'true'

    )

    saveCurrentSession({

      screen,

      selChar

    })

    await safeQuery(

      supabase.auth.signInWithOAuth({

        provider: 'kakao'

      }),

      'kakao oauth login'

    )

  }












  const isGuestLocked = (mode) => {
    if (authUser) return false
    const allowed = ['2020s', '2010s', '2000s']
    return !allowed.includes(mode.key)
  }

  const isGuestLockedChar = (char) => {
    if (authUser) return false
    const allowed = ['yoda', 'immortan', 'leon']
    return !allowed.includes(char.id)
  }

  const menuItems = [
    '소개',
    '게임 규칙',
    '이메일',
    '개인정보 처리방침',
    '영화데이터 사용안내',
    '신고하기',
    authUser ? '로그아웃' : '로그인'
  ]

  const logout = async () => {

    try {

      await safeQuery(

        supabase.auth.signOut(),

        'logout'

      )

    } catch (e) {

      console.error(

        'logout failed',

        e

      )

    }

    localStorage.clear()

    sessionStorage.clear()

    window.location.reload()

  }


  const [authChecked, setAuthChecked] = useState(false)
  const [showMergeModal, setShowMergeModal] = useState(false)

  function saveCurrentSession({
    screen,
    selChar
  }) {
    localStorage.setItem(
      'cineclue_session',
      JSON.stringify({
        screen,
        selChar
      })
    )
  }



  const [isFlashing, setIsFlashing] = useState(false)
  const inputRef = useRef(null)
  const [showReportToast, setShowReportToast] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settingsPage, setSettingsPage] = useState(null)
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const [profileStats, setProfileStats] = useState(null)
  const ERA_MODES = MODES.filter(m => m.type === 'era')
  const THEME_MODES = MODES.filter(m => m.type === 'theme')
  const [screen, setScreen] = useState('intro')

  const [selChar, setSelChar] = useState(null)
  const [users, setUsers] = useState([])
  const [resumeTick, setResumeTick] = useState(0)

  const [skipResultAnimation, setSkipResultAnimation] = useState(false)
  const [collectionReturnScreen, setCollectionReturnScreen] = useState('result')



  const [selGrade, setSelGrade] = useState(null)
  const [pool, setPool] = useState([])
  const [qi, setQi] = useState(0)
  const [sh, setSh] = useState(1)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [fb, setFb] = useState('')
  const [fbt, setFbt] = useState('')
  const [input, setInput] = useState('')
  const [mode, setMode] = useState(null)
  const [comboStreak, setComboStreak] = useState(0)
  const [crazyStreak, setCrazyStreak] = useState(0)
  const [roundStartScore, setRoundStartScore] = useState(0)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [visibleResults, setVisibleResults] = useState(0)
  const [displayScore, setDisplayScore] = useState(0)
  const [ready, setReady] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)
  const safeUsers = Array.isArray(users) ? users : []
  const currentUser = safeUsers.find(u => u.charId === selChar) || null
  const currentUserId = currentUser?.userId
  const lives = currentUser?.lives ?? 30
  const isDead = currentUser?.isDead ?? false
  const [showNameModal, setShowNameModal] = useState(false)
  const [resultView, setResultView] = useState('score')
  const [forceFill, setForceFill] = useState(false)
  const [tempChar, setTempChar] = useState(null)
  const [nickname, setNickname] = useState('')
  const [ranking, setRanking] = useState([])
  const resultSavedRef = useRef(false)
  const [hitEffect, setHitEffect] = useState(null)
  const scrollRef = useRef(null)
  const [wrongCount, setWrongCount] = useState(0)
  const [lockChoice, setLockChoice] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [quizMode, setQuizMode] = useState('subjective') // 객관식 주관식 바꾸기
  const [choices, setChoices] = useState([])
  const [genreStats, setGenreStats] = useState([])
  const [showProfile, setShowProfile] = useState(false)
  const skipLockRef = useRef(false)
  const [isLoadingRecommend, setIsLoadingRecommend] = useState(false)
  const [loadingDots, setLoadingDots] = useState('.')
  const [profileTarget, setProfileTarget]
    = useState(null)
  const [profileUser, setProfileUser]
    = useState(null)
  const profileCharId =
    profileTarget || selChar
  const profileChar =
    CHARS.find(
      c => c.id === profileCharId
    )
  const [rankingRevealDone, setRankingRevealDone] = useState(false)
  const primaryGrade = selGrade || null
  const [progress, setProgress] = useState(0); // 0 ~ 100
  const duration = quizMode === 'objective' ? 15 : 30; // 총 30초
  const skipTime = 30; // 30초에 자동 실행
  const [buttonActive, setButtonActive] = useState(false)
  const [recommendStatus, setRecommendStatus] = useState('idle')
  const [scoreFlash, setScoreFlash] = useState(false)
  const timerRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [allMovies, setAllMovies] = useState([])
  const [showAnswers, setShowAnswers] = useState(false)
  const [lifeDelta, setLifeDelta] = useState(null)
  const [deathMessage, setDeathMessage] = useState(false)
  const [pendingLifeDelta, setPendingLifeDelta] = useState(null)
  const [showSynopsis, setShowSynopsis] = useState(false)
  const [showReportMenu, setShowReportMenu] = useState(false)
  const [showRecommendModal, setShowRecommendModal] = useState(false)
  const [recommendMovie, setRecommendMovie] = useState(null)
  const [timerStartedAt, setTimerStartedAt] = useState(null)
  const [questionReady, setQuestionReady] = useState(false)
  const [trailerKey, setTrailerKey] = useState(null)
  const [animateStats, setAnimateStats]
    = useState(false)
  const UI = {
    surface: '#ffffff',
    border: '#e8e4dd',
    textMain: '#1a1814',
    textSub: '#888',
    textWeak: '#b0aaa3',
    accent: '#ff6b7a'
  }


  const level =
    Math.floor(score / 50000) + 1
  const title =
    LEVEL_TITLES[Math.min(level, 100)]




  async function openMovieRecommend() {
    setShowMovieCard(false)
    setMovieCard(null)
    setIsLoadingRecommend(true)
    setRecommendStatus('loading')
    const TMDB_KEY =
      process.env.NEXT_PUBLIC_TMDB_KEY
    try {

      // Top3 장르
      const topGenres =
        [...(profileStats?.genreStats || [])]
          .sort((a, b) => b.percent - a.percent)
          .slice(0, 3)
      // 랜덤 장르 하나 선택

      const pickedGenre =
        topGenres[
          Math.floor(Math.random() * topGenres.length)
        ]?.genre

      // TMDB 장르 id 변환

      const genreIds =
        TMDB_GENRE_MAP[pickedGenre]
      if (!genreIds) {
        setRecommendStatus('fail')
        setTimeout(() => {
          setRecommendStatus('idle')
        }, 1500)
        return
      }

      // discover 호출

      const randomPage = Math.floor(Math.random() * 20) + 1

      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}` +
        `&language=ko-KR` +
        `&sort_by=vote_average.desc` +
        `&vote_average.gte=7.0` +
        `&vote_count.gte=100` +
        `&with_genres=${genreIds.join(',')}` +
        `&page=${randomPage}`
      )


      const data = await res.json()
      if (!data.results?.length) {
        setRecommendStatus('fail')
        setTimeout(() => {
          setRecommendStatus('idle')
        }, 2200)
        return
      }

      // 랜덤 영화

      const randomMovie =
        data.results[
        Math.floor(Math.random() * data.results.length)
        ]


      // detail + credits

      const detailRes = await fetch(
        `https://api.themoviedb.org/3/movie/${randomMovie.id}?api_key=${TMDB_KEY}&language=ko-KR&append_to_response=credits,videos`
      )

      const detail =
        await detailRes.json()

      const trailer =
        detail.videos?.results?.find(v =>
          v.site === 'YouTube' &&
          v.type === 'Trailer'
        ) ||
        detail.videos?.results?.find(v =>
          v.site === 'YouTube'
        )
      const youtubeKey =
        trailer?.key || null

      const movieData = {
        ...detail,
        youtubeKey
      }
      const posterUrl =
        movieData.poster_path
          ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
          : null
      if (posterUrl) {
        const img = new Image()
        img.src = posterUrl
        img.onload = () => {
          setRecommendMovie(movieData)
          setShowRecommendModal(true)
          setRecommendStatus('idle')
        }
        img.onerror = () => {
          setRecommendMovie(movieData)
          setShowRecommendModal(true)
          setRecommendStatus('idle')
        }
      } else {
        setRecommendMovie(movieData)
        setShowRecommendModal(true)
        setRecommendStatus('idle')
      }
    } catch (e) {
      console.error(e)
    }
    finally {
      setIsLoadingRecommend(false)
    }
  }


  function loadUsers(authUser) {

    if (authUser) {

      return []

    } else {

      const saved =

        sessionStorage.getItem(

          'cineclue_guest_users'

        )

      return saved

        ? JSON.parse(saved)

        : []

    }

  }


  // 로그인 //
  useEffect(() => {
    if (!supabase) return

    safeQuery(
      supabase.auth.getSession(),
      'get auth user'
    ).then(({ data }) => {
      setAuthUser(

        data?.session?.user ?? null

      )
      setAuthChecked(true)
    })

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange(
        async (_event, session) => {
          const user = session?.user ?? null

          setAuthUser(user)

          if (user) {
            const oauthStart =
              localStorage.getItem(
                'cineclue_oauth_start'
              )

            if (
              _event === 'SIGNED_IN' &&
              oauthStart === 'true'
            ) {
              localStorage.removeItem(
                'cineclue_oauth_start'
              )
            }

            const result =

              await safeQuery(

                supabase

                  .from('characters')

                  .select('*')

                  .eq('auth_user_id', user.id),

                'load auth characters'

              )

            const data = result?.data || []

            if (data.length === 0) {

              setUsers([])

              return

            }

            const loadedUsers = await Promise.all(

              data.map(async c => {

                const resultLogs = await safeQuery(

                  supabase

                    .from('game_logs')

                    .select('score_earned')

                    .eq('user_id', user.id)

                    .eq('character_id', c.char_id)

                    .eq('log_type', 'result'),

                  `load score ${c.char_id}`

                )

                const logs = resultLogs?.data || []

                const totalScore = logs.reduce(

                  (sum, l) =>

                    sum + (l.score_earned || 0),

                  0

                )

                return {

                  charId: c.char_id,

                  nickname: c.nickname,

                  score: totalScore,

                  lives: c.lives,

                  userId: c.auth_user_id,

                  isGuest: false

                }

              })

            )

            setUsers(loadedUsers)

            return
          }

          if (!user) {

            const sessionResult = await supabase.auth.getSession()

            const sessionUser =

              sessionResult?.data?.session?.user

            if (sessionUser) return

            const loadedUsers = loadUsers(null)

            setUsers(loadedUsers)

          }
        }
      )

    return () =>
      subscription.unsubscribe()

  }, [supabase])



  useEffect(() => {

    if (!authChecked) return

    const saved =
      localStorage.getItem(
        'cineclue_current_session'
      )

    if (!saved) return

    try {

      const parsed = JSON.parse(saved)

      // 🔥 users 준비 안됐으면 복원 금지
      if (
        parsed.selChar &&
        users.some(
          u => u.charId === parsed.selChar
        )
      ) {
        setSelChar(parsed.selChar)
      }

      if (parsed.screen) {
        setScreen(parsed.screen)

      }

    } catch (e) {

      console.error(e)

    }

  }, [authChecked, users])






  function saveUsers(users) {

    sessionStorage.setItem(

      'cineclue_guest_users',

      JSON.stringify(users)

    )

  }







  // 퀴즈 시작 종료시 현재 세션에 저장
  useEffect(() => {
    if (screen !== 'intro') {
      saveCurrentSession({
        screen,
        selChar
      })
    }
    if (screen === 'result') {
      saveCurrentSession({
        screen: 'result',
        selChar
      })
    }
  }, [screen, selChar])



  useEffect(() => {
    if (!isLoadingRecommend) return
    const seq = ['.', '..', '...']
    let idx = 0
    const t = setInterval(() => {
      idx = (idx + 1) % seq.length
      setLoadingDots(seq[idx])
    }, 320)
    return () => clearInterval(t)
  }, [isLoadingRecommend])





  useEffect(() => {
    if (lifeDelta === null) return
    const t = setTimeout(() => {
      setLifeDelta(null)
    }, 1000)   // 👉 시간 늘려도 됨
    return () => clearTimeout(t)
  }, [lifeDelta])


  useEffect(() => {
    if (showProfile) {
      setAnimateStats(false)
      setTimeout(() => {
        setAnimateStats(true)
      }, 60)
    }
  }, [showProfile, profileTarget])


  useEffect(() => {
    setSelectedSuggestion(-1)
  }, [suggestions])




  useEffect(() => {
    MODE_IMAGES.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])


  useEffect(() => {

    if (!showProfile) return

    if (!supabase || !selChar) return

    const targetCharId = profileTarget || selChar

    let cancelled = false

    setProfileStats(null)

    const run = async () => {

      const profile = await getProfileStats(

        supabase,

        targetCharId

      )

      if (!cancelled) {

        setProfileStats(profile)

      }

    }

    run()

    return () => {

      cancelled = true

    }

  }, [showProfile, supabase, selChar, profileTarget])



  useEffect(() => {
    if (pendingLifeDelta !== null) {
      setLifeDelta(pendingLifeDelta)
      setPendingLifeDelta(null)
    }
  }, [qi])



  // 자동입력시 전체영화 로딩
  useEffect(() => {
    if (!supabase) return
    fetchAllMovies().then(data => {
      setAllMovies(data)
    })
  }, [supabase])




  useEffect(() => {
    setSuggestions([])
    setInput('')
  }, [qi])


  useEffect(() => {
    if (screen !== 'quiz') return
    if (quizMode !== 'objective') return
    if (!pool[qi]) return
    setChoices(pool[qi].choices || [])
  }, [screen, qi, quizMode, pool])


  useEffect(() => {
    const t = setTimeout(() => {
      setReady(true)
    }, 1200) // 🔥 여기 숫자로 타이밍 조절
    return () => clearTimeout(t)
  }, [])


  useEffect(() => {
    if (screen !== 'result') return
    if (!currentUserId || !selChar) return
    fetchGenreStats(currentUserId, selChar)
      .then(setGenreStats)
  }, [screen, currentUserId, selChar])


  useEffect(() => {
    if (screen === 'result' && resultView === 'ranking') {
      setRankingRevealDone(false)
      const t = setTimeout(() => {
        setRankingRevealDone(true)
      }, 650)
      return () => clearTimeout(t)
    }
  }, [screen, resultView])


  useEffect(() => {
    if (screen === 'result') {
      setShowProfile(false)   // 🔥 무조건 초기화
    }
  }, [screen])


  useEffect(() => {
    setWrongCount(0)
    setLockChoice(false)
    setSelectedChoice(null)
    setProgress(0)
    setButtonActive(false)
  }, [qi])




  useEffect(() => {

    const onVisible = async () => {

      if (screen !== 'quiz') return

      if (document.hidden) {

        clearInterval(timerRef.current)

        return

      }

      setShowSpinner(true)


      try {

        await supabase.auth.getSession()

        await new Promise(r =>
          requestAnimationFrame(r)
        )

        await new Promise(r =>
          setTimeout(r, 300)
        )

      } catch (e) {

        console.error(e)

      } finally {
        setResumeTick(v => v + 1)
        setShowSpinner(false)

      }

    }

    document.addEventListener(
      'visibilitychange',
      onVisible
    )

    return () => {

      document.removeEventListener(
        'visibilitychange',
        onVisible
      )

    }

  }, [screen])



  useEffect(() => {

    if (screen !== 'quiz') return

    if (!questionReady) return

    if (answered) return

    clearInterval(timerRef.current)

    const start =

      timerStartedAt || Date.now()

    if (!timerStartedAt) {

      setTimerStartedAt(start)

    }

    timerRef.current = setInterval(() => {

      const elapsed =
        (Date.now() - start) / 1000

      const percent = Math.min(
        (elapsed / duration) * 100,
        100
      )

      setProgress(percent)

      // 🔥 넘기기 버튼 활성화
      if (percent >= 100) {
        setButtonActive(true)
      } else {
        setButtonActive(false)
      }

      if (elapsed >= duration) {

        if (!answered) {
          doSkip()
        }

        clearInterval(timerRef.current)
      }

    }, 100)

    return () => {
      clearInterval(timerRef.current)
    }

  }, [

    qi,

    screen,

    quizMode,

    answered,

    questionReady,

    resumeTick,
    timerStartedAt

  ])


  async function saveCollection(movie) {

    if (!authUser) return

    try {

      const { data, error } = await supabase

        .from('collections')

        .upsert(

          {

            user_id: authUser.id,

            character_id: selChar,

            movie_id: movie.id || movie.tmdb_id,

            movie_data: movie,

            viewed_at: new Date()

          },

          {

            onConflict:'user_id,character_id,movie_id'

          }

        )

      console.log(

        'collection save data',

        data

      )

      console.log(

        'collection save error',

        error

      )

    } catch (err) {

      console.error(
        'collection save error',
        err
      )

    }

  }




  async function fetchGenreStats(user_id, character_id) {
    const { data = [] } =
      await safeQuery(
        supabase
          .from('user_genre_stats')
          .select('genre, attempt_count, correct_count, total_score')
          .eq('user_id', user_id)
          .eq('character_id', character_id),
        'fetch genre stats'
      )
    return data
  }

  //객관식 선택지 생성 함수
  function buildChoices(correctMovie, allMovies) {
    const pool = allMovies.filter(m => m.id !== correctMovie.id)
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    const wrong = shuffled.slice(0, Math.min(3, pool.length))
    // 👉 여기까지 먼저 만들고
    const options = [...wrong, correctMovie].map(m => m.title)
    // 👉 그 다음 셔플
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[options[i], options[j]] = [options[j], options[i]]
    }
    return options
  }




  async function loadMovieDetail(movie) {

    setShowRecommendModal(false)
    setMovieCard(movie)
    setMovieCardFlipped(false)
    setShowMovieCard(true)
  }

  async function loadTMDB(movie) {

    const TMDB_KEY =
      process.env.NEXT_PUBLIC_TMDB_KEY
    try {

      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(movie.title)}&language=ko-KR`
      )

      if (!res.ok) {

        return {}

      }

      const data = await res.json()

      const found = data.results?.find(tmdb => {

        const tmdbYear =
          tmdb.release_date?.slice(0, 4)

        const sameYear =
          String(tmdbYear) === String(movie.year)

        const sameOriginal =
          (tmdb.original_title || '')
            .toLowerCase()
            .trim()

          ===

          (movie.title_en || '')
            .toLowerCase()
            .trim()

        const sameTitle =
          (tmdb.title || '')
            .trim()

          ===

          (movie.title || '')
            .trim()

        return sameYear && (
          sameOriginal || sameTitle
        )

      })

      if (!found) {
        return {}
      }
      const detailRes = await fetch(
        `https://api.themoviedb.org/3/movie/${found.id}?api_key=${TMDB_KEY}&language=ko-KR&append_to_response=credits,videos`
      )
      if (!detailRes.ok) {
        return found || {}
      }
      const detail = await detailRes.json()

      const trailer =

        detail.videos?.results?.find(v =>

          v.site === 'YouTube' &&

          v.type === 'Trailer'

        ) ||

        detail.videos?.results?.find(v =>

          v.site === 'YouTube'

        )

      const youtubeKey =

        trailer?.key || null


      return {

        ...detail,

        youtubeKey

      }

    } catch (e) {

      console.error(
        'TMDB preload 실패',
        e
      )

      return {}

    }

  }



  function formatPlayTime(sec) {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    if (h > 0) return `${h}시간 ${m}분`
    return `${m}분`
  }


  function triggerDeath() {
    setDeathMessage(true)   // 👉 화면 띄우기
    setTimeout(() => {
      setDeathMessage(false)
      setSelChar(null)
      setScreen('char')     // 👉 캐릭터 선택으로 이동
    }, 3500)
  }


  function toggleGrade(id) {
    setSelGrade(id)
  }


  function handleShowAnswers() {
    setShowAnswers(true)
  }


  useEffect(() => {
    if (screen !== 'result') {
      resultSavedRef.current = false
      return
    }
    if (!supabase || !results?.length) return
    if (resultSavedRef.current) return
    if (!currentUser?.userId) return

    resultSavedRef.current = true

    const safeNickname = currentUser?.nickname || nickname || 'USER'
    const userId = String(currentUser?.userId)
    const run = async () => {
      await saveLog({
        supabase,
        userId,
        charId: selChar,
        movie: { id: null },
        hintUsed: 0,
        score: score - roundStartScore,
        comboMode: null,
        isCorrect: true,
        nickname: currentUser.nickname,
        log_type: 'result',
        quizMode
      })

      const data = await loadRanking({ supabase })
      setRanking(data)
    }
    run()
  }, [screen, supabase, users, selChar, selGrade, nickname, roundStartScore, results])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLevelCompleted, setIsLevelCompleted] = useState(false)
  const char = CHARS.find(c => c.id === selChar)
  const g = GRADES.find(x => x.id === selGrade)




  // 결과 화면 순차 노출 + 점수 카운트
useEffect(() => {

  if (screen !== 'result') return

  if (results.length === 0) return

  if (!users || users.length === 0) return

  // 🔥 컬렉션 복귀 시 상태 유지
  if (skipResultAnimation) return

  setResultView('score')

  setVisibleResults(1)

  const roundScore = score - roundStartScore

  const startScore = roundStartScore

  const tot = startScore + roundScore

  setDisplayScore(startScore)

  let i = 0

  const interval = setInterval(() => {

    i++

    setVisibleResults(i)

    if (i >= results.length) {

      clearInterval(interval)

      setTimeout(() => {

        setVisibleResults(v => v + 1)

        setTimeout(() => {

          let cur = startScore

          const step = Math.ceil(
            (tot - startScore) / 60
          )

          const iv = setInterval(() => {

            cur = Math.min(cur + step, tot)

            setDisplayScore(cur)

            if (cur >= tot) clearInterval(iv)

          }, 20)

        }, 400)

      }, 400)

    }

  }, 400)

  return () => clearInterval(interval)

}, [screen, results, users, skipResultAnimation])


  useEffect(() => {
    if (screen !== 'result' || resultView !== 'ranking') return
    if (!supabase) return
    const run = async () => {
      const data = await loadRanking({ supabase })
      setRanking(data)
    }
    run()
  }, [screen, resultView, supabase])



  function handleCharClick(charId) {
    console.log('캐릭터 클릭')

    console.log('charId', charId)

    console.log('selChar before', selChar)

    console.log('screen before', screen)

    const target = users.find(u => u.charId === charId)
    console.log('users', users)

    console.log('target', target)
    // 🔥 1. 기존 캐릭터 있음
    if (target) {
      // 👉 죽은 캐릭터 → 부활 팝업
      if (target?.isDead) {
        return
      }
      // 👉 살아있는 캐릭터 → 선택
      setSelChar(charId)
      return
    }
    // 🔥 2. 신규 캐릭터 (기존 로직 유지)
    setSelChar(charId)
    setTempChar(charId)
    setShowNameModal(true)
  }


  async function loadMovies() {
    if (!currentUser?.userId) {

      console.warn('NO CURRENT USER', {

        authUser,

        currentUser,

        selChar,

        users

      })

      setScreen('char')

      setLoading(false)

      setShowSpinner(false)

      return

    }
    setLoading(true)
    setShowSpinner(true)
    setProgress(0)
    setQuestionReady(false)
    setScreen('quiz')
    setPool([])
    setQi(0)
    setSh(1)
    setFb('')
    setFbt('')
    setAnswered(false)
    setInput('')
    setScreen('quiz')
    try {
      if (!supabase) {
        alert('DB 연결 안됨')
        return
      }
      // 1️⃣ 현재 유저
      const userId = String(currentUser?.userId)
      // 2️⃣ 로그 가져오기

      const { data: logs = [] } =

        await safeQuery(

          supabase

            .from('game_logs')

            .select('movie_id')

            .eq('user_id', userId)

            .not('movie_id', 'is', null)

            .order('id', { ascending: false }),

          'load game logs'

        )


      const HISTORY_LIMIT = {
        '2020s': 900,
        '2010s': 900,
        '2000s': 900,
        '1990s': 900,
        'old': 700,
        'kr': 900,
        'thriller': 700,
        'horror': 250,
        'hk': 250,
        'sf': 250,
        'anime': 200
      }
      const playedIds = (logs || [])
        .map(l => l.movie_id)
        .slice(0, HISTORY_LIMIT[selGrade] || 300)

      // 3️⃣ 영화 가져오기 (🔥 필터 제거)
      async function fetchMoviesByYears() {
        let query = supabase
          .from('movies')
          .select(`
            *,
            hints(*)
          `)
        const g = selGrade

        if (g === '2020s') query = query.gte('year', 2020)
        if (g === '2010s') query = query.gte('year', 2010).lt('year', 2020)
        if (g === '2000s') query = query.gte('year', 2000).lt('year', 2010)
        if (g === '1990s') query = query.gte('year', 1990).lt('year', 2000)
        if (g === 'old') query = query.lt('year', 1990)
        if (g === 'horror') query = query.ilike('genre', '%공포%')
        if (g === 'hk') query = query.or('country.ilike.%홍콩%,country.ilike.%중국%,country.ilike.%대만%,country.ilike.%일본%')
        if (g === 'sf') query = query.ilike('genre', '%SF%')
        if (g === 'kr') query = query.ilike('country', '%한국%')
        if (g === 'anime') query = query.ilike('genre', '%애니%')
        if (g === 'thriller') query = query.ilike('genre', '%스릴러%')
        if (g === 'all') {// 필터 없음 (전체)
        }
        const all = []
        const pageSize = 1000
        let from = 0

        while (true) {
          const { data = [] } =

            await safeQuery(

              query.range(

                from,

                from + pageSize - 1

              ),

              `load movies page ${from}`

            )

          if (data.length === 0) break
          all.push(...data)
          if (data.length < pageSize) break
          from += pageSize
        }
        return all
      }
      const delayPromise = new Promise(r => setTimeout(r, 500))

      const [movies] = await Promise.all([
        fetchMoviesByYears(),
        delayPromise
      ])


      if (!movies || movies.length === 0) {
        alert('영화 없음')
        setLoading(false)
        return
      }
      // 4️⃣ JS에서 필터
      const playedSet = new Set(playedIds)
      const filtered = movies.filter(m => !playedSet.has(m.id))
      let finalPool = filtered

      // 🔥 1️⃣ 풀 부족 시 자동 리셋
      if (filtered.length < 10) {
        alert('해당 시대 영화가 부족합니다')
        setLoading(false)
        return
      }
      // 🔥 1차 샘플링 (전체에서 100개)
      const sampled = shuffle(finalPool).slice(0, 50)

      // 🔥 2차 랜덤 (그 안에서 5개)
      const baseSel = shuffle(sampled).slice(0, 5)

      const sel = baseSel.map(m => ({

        ...m,

        hintsArr: m.hints

          ? m.hints

            .sort((a, b) => a.hint_level - b.hint_level)

            .map(h => h.hint_text)

          : [],

        choices:

          buildChoices(m, movies)

      }))

      Promise.all(
        sel.map(async movie => {
          const tmdb = await loadTMDB(movie)
          const posterUrl = tmdb?.poster_path
            ? `https://image.tmdb.org/t/p/w300${tmdb.poster_path}`
            : null
          if (posterUrl) {
            await new Promise(resolve => {
              const img = new Image()
              img.src = posterUrl
              img.onload = resolve
              img.onerror = resolve
            })

          }
          return {
            ...movie,
            tmdbLoaded: true,
            poster_path:
              tmdb?.poster_path || null,
            backdrop_path:
              tmdb?.backdrop_path || null,
            overview:
              tmdb?.overview || '',
            tmdb_id:
              tmdb?.id || null,
            release_date:
              tmdb?.release_date || '',
            vote_average:
              tmdb?.vote_average || null,
            credits:
              tmdb?.credits || null,
            youtubeKey:
              tmdb?.youtubeKey || null
          }
        })

      ).then(updated => {
        setPool(updated)
        setQuestionReady(true)
      })
      setQi(0)
      setSh(1)
      setResults([])
      setAnswered(false)
      setFb('')
      setFbt('')
      setInput('')
      setCrazyStreak(0)
      setRoundStartScore(score)
      setTimerStartedAt(null)


    }

    catch (e) {

      console.error(e)

      alert('연결 상태를 다시 복구합니다')

      window.location.reload()

    }


    finally {
      setLoading(false)
      // 🔥 페이드 시간 확보
      setTimeout(() => {
        setShowSpinner(false)
      }, 150)
    }
  }


  function getPts(modeParam) {
    const ratioMap = {
      1: 1.0,
      2: 0.8,
      3: 0.6,
      4: 0.4,
      5: 0.2
    }
    let base = BP * (ratioMap[sh] || 0)
    // 🔥 1. 콤보 먼저 적용
    if (modeParam === 'good') base *= 3
    if (modeParam === 'wow') base *= 4
    if (modeParam === 'crazy') base *= 5
    // 🔥 2. 그 다음 객관식 페널티
    if (quizMode === 'objective') {
      base *= 0.1
    }
    return Math.round(base)
  }

  // 콤보는 3문제 연속 맞춘 후 다음 퀴즈에 발동
  function updateCombo(correct) {
    if (!correct) {
      return
    }
    setComboStreak(prev => {
      const ns = prev + 1
      if (ns >= 5) {
        setMode('crazy')
      } else if (ns === 4) {
        setMode('wow')
      } else if (ns === 3) {
        setMode('good')
      } else {
        setMode(null)
      }
      return ns
    })
  }


  // ── 정답 버튼 로직 ──
  async function submit(answerValue) {
    if (answered || isSubmitting) return
    if (!currentUser?.userId) return
    if (quizMode === 'subjective' && !input.trim()) return

    setIsSubmitting(true)
    const m = pool[qi]

    if (!m) {
      setIsSubmitting(false)
      return
    }
    const inputValue = quizMode === 'objective' ? answerValue : input
    const correct = quizMode === 'objective'
      ? normalize(inputValue) === normalize(m.title)
      : isCorrect(inputValue, m.title, Array.isArray(m.answers) ? m.answers : [])

    try {
      let appliedMode = null
      let gained = 0

      if (correct) {
        const isFirstTry = wrongCount === 0
        const comboAllowed = quizMode === 'subjective' || isFirstTry

        if (comboAllowed) {
          const ns = comboStreak + 1
          if (ns >= 5) appliedMode = 'crazy'
          else if (ns === 4) appliedMode = 'wow'
          else if (ns === 3) appliedMode = 'good'
          setComboStreak(ns)
          setMode(appliedMode)
        } else {
          // 객관식에서 두 번째 클릭으로 맞춘 경우: 콤보 인정 안 함
          setComboStreak(0)
          setMode(null)
          appliedMode = null
        }

        gained = getPts(appliedMode)
        setScore(v => v + gained)
        setUsers(prev => {
          const updated = prev.map(u => {

            if (u.charId === selChar) {
              const prevLives = u.lives ?? 30
              const nextLives = Math.min(prevLives + 1, 30)

              if (nextLives > prevLives && prevLives < 30) {
                setLifeDelta(1)
              }
              return {
                ...u,
                score: (u.score || 0) + gained,
                lives: nextLives
              }
            }
            return u
          })
          if (!authUser) {

            saveUsers(updated)

          }
          return updated
        })

        await saveLog({
          supabase,
          userId: String(currentUser.userId),
          charId: selChar,
          movie: m,
          hintUsed: sh,
          score: gained,
          comboMode: appliedMode,
          isCorrect: true,
          nickname: currentUser.nickname,
          userInput: inputValue?.trim() || null,
          genre: m.final_genre || null,
          log_type: 'play',
          quizMode
        })
        await safeQuery(

          supabase.rpc('update_genre_stats', {

            p_user_id: String(currentUser.userId),

            p_character_id: selChar,

            p_genre: m.final_genre || '기타',

            p_is_correct: true,

            p_score: gained

          }),

          'update genre stats success'

        )
        setResults(r => [...r, {
          ...m,
          correct: true,
          hintUsed: sh,
          score: gained,
          combo: appliedMode,
          country: m.country,
          genre: m.final_genre || '',
          grade: primaryGrade
        }])
        setTimeout(() => {
          scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
          })
        }, 120)
        setFbt('ok')
        setAnswered(true)
        setScoreFlash(true)
        setTimeout(() => {
          setScoreFlash(false)
        }, 300)

      } else {
        const wrongSound = new Audio('/false.mp3')
        wrongSound.volume = 0.5
        wrongSound.play().catch(() => { })

        // 객관식: 첫 오답 클릭이면 콤보 해제
        if (quizMode === 'objective' && wrongCount === 0) {
          setComboStreak(0)
          setMode(null)
        }
        // 주관식 오답은 여기서 콤보 해제 안 함
        if (quizMode === 'objective') {
          if (wrongCount === 0) {
            setWrongCount(1)
            if (sh < 5) {
              nextH()
            }
            setFb('다시 생각해봐')
            setFbt('ng')
            return
          }
          if (wrongCount === 1) {
            setWrongCount(2)
            setLockChoice(true)
            setFb('기회를 더 줄 수가 없어요')
            setFbt('ng')
            setTimeout(() => {
              doSkip()
            }, 700)
            return
          }
        }
        if (quizMode === 'subjective') {
          setFb('다시 생각해봐')
          setFbt('ng')
          return
        }
        await saveLog({
          supabase,
          userId: String(currentUser.userId),
          charId: selChar,
          movie: m,
          hintUsed: sh,
          score: 0,
          comboMode: null,
          isCorrect: false,
          isSkip: false,
          nickname: currentUser.nickname,
          userInput: inputValue?.trim() || null,
          genre: m.final_genre || null,
          log_type: 'play',
          quizMode
        })

        await safeQuery(

          supabase.rpc('update_genre_stats', {

            p_user_id: String(currentUser.userId),

            p_character_id: selChar,

            p_genre: m.final_genre || '기타',

            p_is_correct: false,

            p_score: 0

          }),

          'update genre stats fail'

        )



        setResults(r => [...r, {
          ...m,
          correct: false,
          hintUsed: sh,
          score: 0,
          country: m.country,
          genre: m.final_genre || '',
          grade: primaryGrade
        }])

        setFb(rFB(sh))
        setFbt('ng')
        setAnswered(true)
      }
    } finally {

      setIsSubmitting(false)
      setLoading(false)

      setTimeout(() => {
        setShowSpinner(false)
      }, 180)

    }
  }


  async function doSkip() {
    if (screen !== 'quiz') return
    if (answered || isSubmitting) return
    if (!currentUser?.userId) return
    if (skipLockRef.current) return

    skipLockRef.current = true
    setIsSubmitting(true)
    setComboStreak(0)
    setMode(null)

    const m = pool[qi]

    if (!m) {
      setIsSubmitting(false)
      skipLockRef.current = false
      return
    }

    const willDie = (currentUser?.lives ?? 30) <= 1

    setUsers(prev => {
      const updated = prev.map(u => {
        if (u.charId === selChar) {
          const prevLives = u.lives ?? 30
          const nextLives = prevLives - 1

          if (nextLives < prevLives) {
            setLifeDelta(-1)   // 🔥 핵심
          }
          if (nextLives <= 0) {
            triggerDeath()
          }
          return {
            ...u,
            lives: Math.max(nextLives, 0),
            isDead: nextLives <= 0
          }
        }
        return u
      })

      if (!authUser) {

        saveUsers(updated)

      }
      return updated
    })

    await saveLog({
      supabase,
      userId: String(currentUser.userId),
      charId: selChar,
      movie: m,
      hintUsed: sh,
      score: 0,
      comboMode: null,
      isCorrect: false,
      isSkip: true,
      nickname: currentUser.nickname,
      genre: m?.final_genre || null,
      log_type: 'play',
      quizMode
    })

    const genreValue = m?.final_genre || '기타'

    await safeQuery(

      supabase.rpc('update_genre_stats', {

        p_user_id: String(currentUser.userId),

        p_character_id: selChar,

        p_genre: genreValue,

        p_is_correct: false,

        p_score: 0

      }),

      'update genre stats skip'

    )

    const roundScore = score - roundStartScore

    setResults(r => [...r, {
      ...m,
      correct: false,
      hintUsed: 0,
      score: 0,
      country: m.country,
      genre: m.final_genre || '',
      grade: primaryGrade
    }])

    if (willDie) {
      await saveLog({
        supabase,
        userId: String(currentUser.userId),
        charId: selChar,
        movie: { id: null },
        hintUsed: 0,
        score: roundScore,
        comboMode: null,
        isCorrect: true,
        nickname: currentUser.nickname,
        log_type: 'result',
        quizMode
      })

      setAnswered(true)
      setIsSubmitting(false)
      skipLockRef.current = false
      triggerDeath()
      return
    }

    setFb('다음번엔 꼭 맞추길...')
    setFbt('sk')
    setAnswered(true)
    setIsSubmitting(false)
    skipLockRef.current = false
  }


  function nextH() {
    const hintSound = new Audio('/hint.mp3')
    hintSound.volume = 0.5
    hintSound.play().catch(() => { })

    if (sh < 5) {
      setSh(v => v + 1)
      setFb('')
      setFbt('')
    } else {
      if (
        quizMode === 'choice'
        && wrongCount < 2
      ) {
        return
      }
      doSkip()
    }
  }


  function nextQ() {

    inputRef.current?.blur()
    skipLockRef.current = false
    setProgress(0)
    setButtonActive(false)
    setShowAnswers(false)
    setShowSynopsis(false)
    setShowReportMenu(false)

    if (currentUser?.isDead) {
      return
    }
    if (qi + 1 >= pool.length) {
      const currentRound = results.slice(-5)
      const isPerfect =
        currentRound.length === 5 &&
        currentRound.every(r => r.correct)
      if (isPerfect) {
        const user = users.find(u => u.charId === selChar)
        const prevLives = user?.lives ?? 30
        // 🔥 30 미만일 때만 예약
        if (prevLives < 30) {
          setPendingLifeDelta(5)
        }
        setUsers(prev => {
          const updated = prev.map(u => {
            if (u.charId === selChar) {
              return {
                ...u,
                lives: Math.min((u.lives ?? 30) + 5, 30)
              }
            }
            return u
          })
          if (!authUser) {

            saveUsers(updated)

          }
          return updated
        })
      }
      setScreen('result')
      return
    }

    const nqi = qi + 1

    setQi(nqi)
    setSh(1)
    setAnswered(false)
    setFb('')
    setFbt('')
    setInput('')
    setWrongCount(0)
    setLockChoice(false)
    setSelectedChoice(null)
    setTimerStartedAt(null)

  }


  function playClick() { }


  useEffect(() => {
    if (!pool?.length) return
    async function preloadCurrentMovie() {
      const movie = pool[qi]
      if (!movie) return
      // 이미 불러왔으면 패스
      if (movie.tmdbLoaded) return
      try {
        const tmdb = await loadTMDB(movie)
        setPool(prev =>
          prev.map((m, idx) => {
            if (idx !== qi) return m
            return {
              ...m,
              tmdbLoaded: true,
              poster_path:
                tmdb?.poster_path || null,
              backdrop_path:
                tmdb?.backdrop_path || null,
              overview:
                tmdb?.overview || '',
              tmdb_id:
                tmdb?.id || null,
              release_date:
                tmdb?.release_date || '',
              vote_average:
                tmdb?.vote_average || null
            }
          })
        )
      } catch (e) {
        console.error(
          'TMDB preload 실패',
          e
        )
      }
    }
    preloadCurrentMovie()
  }, [pool, qi])



  function enterGame() {
    if (!selChar) return

    const u = users.find(x => x.charId === selChar)

    if (!u) {
      alert('대화명을 먼저 입력하세요')
      return
    }

    const baseScore = u.score || 0

    // ✅ 기존 점수로 시작
    setScore(baseScore)
    setRoundStartScore(baseScore)

    // 👉 난이도 선택 화면으로 이동
    setScreen('grade')
  }

  async function saveNickname() {

    if (!nickname.trim()) return

    const existingUser = users.find(

      u =>

        u.charId === tempChar &&

        u.userId === authUser?.id

    )

    if (existingUser) {

      setSelChar(existingUser.charId)

      setShowNameModal(false)

      return

    }

    if (existingUser) {

      setSelChar(existingUser.charId)

      setScreen('game')

      return

    }

    const newUser = {

      charId: tempChar,

      nickname,

      score: 0,

      lives: 30,

      userId: authUser?.id || Date.now().toString(),

      isGuest: !authUser

    }

    const updated = [...users, newUser]

    setUsers(updated)

    if (authUser) {

      await safeQuery(

        supabase

          .from('characters')

          .delete()

          .eq('auth_user_id', authUser.id)

          .eq('char_id', tempChar),

        'delete existing character'

      )

      await safeQuery(

        supabase

          .from('characters')

          .insert({

            auth_user_id: authUser.id,

            char_id: tempChar,

            nickname,

            score: 0,

            lives: 30

          }),

        'insert character'

      )

    } else {

      saveUsers(updated)

    }

    setShowNameModal(false)

    setNickname('')

  }

  // 👉캐릭터 대화명 지우기
  async function deleteUser(charId) {

    const ok = confirm('대화명과 점수가 초기화됩니다. 계속할까요?')

    if (!ok) return   // ❌ 취소하면 종료

    const updated = users.filter(u => u.charId !== charId)

    setUsers(updated)

    if (authUser) {

      await safeQuery(

        supabase

          .from('characters')

          .delete()

          .eq('auth_user_id', authUser.id)

          .eq('char_id', charId),

        'delete character'

      )



    } else {

      saveUsers(updated)

    }

    if (selChar === charId) {

      setSelChar(null)

    }
  }


  return (
    <>
      {/* 인트로화면 */}
      {screen === 'intro' && (
        <IntroScreen

          onEnter={() => {

            setScreen('char')

          }}

          onLogin={() => setShowLogin(true)}

          authUser={authUser}

        />
      )}

      <LoginModal

        showLogin={showLogin}

        setShowLogin={setShowLogin}

        loginGoogle={loginGoogle}

        loginKakao={loginKakao}

      />


      {/* 🔥 Death Overlay (항상 최상단) */}
      {deathMessage && (screen === 'quiz' || screen === 'result') && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="typingText">
            Hasta la Vista Baby...
          </div>
          <style jsx>{`
            .typingText {
              font-size: 2rem;
              font-weight: 900;
              color: #fff;
              opacity: 0;
              transform: translateY(20px);
              animation: textFade 1.8s ease forwards;
            }
            @keyframes fadeIn {
              from { opacity: 0 }
              to { opacity: 1 }
            }
            @keyframes textFade {
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
         `}
          </style>
        </div>
      )}


      {screen === 'char' && (

        <CharacterScreen

          showSettings={showSettings}

          setShowSettings={setShowSettings}

          menuItems={menuItems}

          users={users}

          CHARS={CHARS}

          authUser={authUser}

          settingsPage={settingsPage}

          setSettingsPage={setSettingsPage}

          showMergeModal={showMergeModal}

          setShowMergeModal={setShowMergeModal}

          showNameModal={showNameModal}

          nickname={nickname}

          setNickname={setNickname}

          setShowNameModal={setShowNameModal}

          handleCharClick={handleCharClick}

          setShowLogin={setShowLogin}

          logout={logout}

          saveUsers={saveUsers}

          deleteUser={deleteUser}

          playClick={playClick}

          enterGame={enterGame}

          saveNickname={saveNickname}

          setUsers={setUsers}

          setSelChar={setSelChar}

          selChar={selChar}

          isGuestLockedChar={isGuestLockedChar}

        />

      )}


      {screen === 'grade' && (

        <ModeScreen

          playClick={playClick}

          setQuizMode={setQuizMode}

          quizMode={quizMode}

          ERA_MODES={ERA_MODES}

          selGrade={selGrade}

          isGuestLocked={isGuestLocked}

          toggleGrade={toggleGrade}

          THEME_MODES={THEME_MODES}

          setShowLogin={setShowLogin}

          loading={loading}

          loadMovies={loadMovies}

          setScreen={setScreen}

          authUser={authUser}

          setCollectionReturnScreen={setCollectionReturnScreen}

        />

      )}








      {/* 화면 3: 퀴즈 화면 */}
      {screen === 'quiz' && (

        <QuizScreen

          loading={loading}
          pool={pool}
          qi={qi}

          MODES={MODES}
          selGrade={selGrade}

          getPts={getPts}

          mode={mode}
          comboStreak={comboStreak}

          isFlashing={isFlashing}
          setIsFlashing={setIsFlashing}

          CharacterSpinner={CharacterSpinner}
          AppLayout={AppLayout}
          FlashLetterHint={FlashLetterHint}
          CharAvatar={CharAvatar}

          selChar={selChar}
          users={users}

          lives={lives}
          lifeDelta={lifeDelta}

          quizMode={quizMode}

          sh={sh}
          g={g}

          fb={fb}
          fbt={fbt}

          scrollRef={scrollRef}
          inputRef={inputRef}

          showReportMenu={showReportMenu}
          setShowReportMenu={setShowReportMenu}

          currentUser={currentUser}

          showReportToast={showReportToast}
          setShowReportToast={setShowReportToast}

          answered={answered}

          input={input}
          setInput={setInput}

          suggestions={suggestions}
          setSuggestions={setSuggestions}

          selectedSuggestion={selectedSuggestion}
          setSelectedSuggestion={setSelectedSuggestion}

          allMovies={allMovies}

          submit={submit}

          playClick={playClick}

          nextH={nextH}
          nextQ={nextQ}

          doSkip={doSkip}

          choices={choices}

          selectedChoice={selectedChoice}
          setSelectedChoice={setSelectedChoice}

          lockChoice={lockChoice}

          progress={progress}
          buttonActive={buttonActive}

          CharAvatar={CharAvatar}

          showSynopsis={showSynopsis}
          setShowSynopsis={setShowSynopsis}

          trailerKey={trailerKey}
          setTrailerKey={setTrailerKey}

          showSpinner={showSpinner}

          normalize={normalize}

          supabase={supabase}
          safeQuery={safeQuery}
          AppLayout={AppLayout}

        />

      )}


      {screen === 'result' && (

        <ResultScreen
          users={users}
          selChar={selChar}
          results={results}
          ranking={ranking}
          currentUser={currentUser}
          selGrade={selGrade}
          authUser={authUser}
          comboStreak={comboStreak}

          resultView={resultView}
          setResultView={setResultView}

          visibleResults={visibleResults}

          showAnswers={showAnswers}
          handleShowAnswers={handleShowAnswers}

          GRADES={GRADES}
          CHARS={CHARS}

          displayScore={displayScore}
          CharAvatar={CharAvatar}

          isLevelCompleted={isLevelCompleted}
          saveCollection={saveCollection}

          playClick={playClick}
          loadMovies={loadMovies}
          setScreen={setScreen}

          loadMovieDetail={loadMovieDetail}

          setProfileStats={setProfileStats}
          setProfileTarget={setProfileTarget}
          setProfileUser={setProfileUser}

          setAnimateStats={setAnimateStats}

          profileStats={profileStats}
          profileUser={profileUser}

          LEVEL_TITLES={LEVEL_TITLES}

          animateStats={animateStats}

          openMovieRecommend={openMovieRecommend}

          recommendStatus={recommendStatus}
          loadingDots={loadingDots}

          showRecommendModal={showRecommendModal}
          setShowRecommendModal={setShowRecommendModal}

          recommendMovie={recommendMovie}

          supabase={supabase}

          movieCard={movieCard}
          movieCardFlipped={movieCardFlipped}
          setMovieCard={setMovieCard}
          setMovieCardFlipped={setMovieCardFlipped}
          setShowMovieCard={setShowMovieCard}

          trailerKey={trailerKey}
          setTrailerKey={setTrailerKey}
          AppLayout={AppLayout}

          rankingRevealDone={rankingRevealDone}
          skipResultAnimation={skipResultAnimation}
          setSkipResultAnimation={setSkipResultAnimation}
          setCollectionReturnScreen={setCollectionReturnScreen}
        />

      )}


      {screen === 'collection' && (

        <Collection

          authUser={authUser}
          supabase={supabase}
          setScreen={setScreen}
          selChar={selChar}
          collectionReturnScreen={collectionReturnScreen}
          trailerKey={trailerKey}
          setTrailerKey={setTrailerKey}
          setMovieCard={setMovieCard}
          setMovieCardFlipped={setMovieCardFlipped}
          setShowMovieCard={setShowMovieCard}

        />

      )}






      {/* 유튜브 플레이어 모달 */}
      {trailerKey && (
        console.log('TRAILER MODAL', trailerKey),
        <div
          onClick={() => setTrailerKey(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '5px'
          }}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '100%',
              aspectRatio: '16 / 9',
              background: '#000',
              borderRadius: '10px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 10px 40px rgba(0,0,0,0.45)'
            }}>

            <button
              onClick={() => setTrailerKey(null)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 10,
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                fontSize: '1rem',
                cursor: 'pointer'
              }}>
              ✕
            </button>

            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title="YouTube player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      )}


      <ProfileModal

        showProfile={showProfile}
        setShowProfile={setShowProfile}

        movieCard={movieCard}
        showMovieCard={showMovieCard}
        setShowMovieCard={setShowMovieCard}

        movieCardFlipped={movieCardFlipped}
        setMovieCardFlipped={setMovieCardFlipped}

        profileUser={profileUser}
        profileStats={profileStats}

        animateStats={animateStats}

        LEVEL_TITLES={LEVEL_TITLES}

        recommendStatus={recommendStatus}
        loadingDots={loadingDots}

        openMovieRecommend={openMovieRecommend}

        showRecommendModal={showRecommendModal}
        setShowRecommendModal={setShowRecommendModal}

        recommendMovie={recommendMovie}

        setTrailerKey={setTrailerKey}

        CharAvatar={CharAvatar}

        setScreen={setScreen}

        setCollectionReturnScreen={setCollectionReturnScreen}

        currentUser={currentUser}

        skipResultAnimation={skipResultAnimation}
        setSkipResultAnimation={setSkipResultAnimation}

      />    

      <MovieFlipCard

          movieCard={movieCard}

          showMovieCard={showMovieCard}

          setShowMovieCard={setShowMovieCard}

          movieCardFlipped={movieCardFlipped}

          setMovieCardFlipped={setMovieCardFlipped}

          setTrailerKey={setTrailerKey}

        />
    </>

    
  )
}