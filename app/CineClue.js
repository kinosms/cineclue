'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import FlashLetterHint from './FlashLetterHint'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''


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
  { id:'yoda', name:'포스의 스승', movie:'스타워즈', color:'#5a9660',
    svg: <svg viewBox="0 0 80 80" fill="none"><ellipse cx="40" cy="52" rx="14" ry="11" fill="#4a7c4e"/><ellipse cx="40" cy="36" rx="16" ry="15" fill="#6aaa6e"/><ellipse cx="8" cy="34" rx="10" ry="5" fill="#5a9660" transform="rotate(-20 8 34)"/><ellipse cx="72" cy="34" rx="10" ry="5" fill="#5a9660" transform="rotate(20 72 34)"/><ellipse cx="34" cy="34" rx="4" ry="4.5" fill="#1a2a1a"/><ellipse cx="46" cy="34" rx="4" ry="4.5" fill="#1a2a1a"/><circle cx="33" cy="33" r="1.5" fill="#fff" opacity=".8"/><circle cx="45" cy="33" r="1.5" fill="#fff" opacity=".8"/><path d="M32 42 Q40 45 48 42" stroke="#3a6040" strokeWidth="1.5" fill="none"/><path d="M28 30 Q30 27 34 29" stroke="#3a6040" strokeWidth="1" fill="none"/><path d="M46 29 Q50 27 52 30" stroke="#3a6040" strokeWidth="1" fill="none"/></svg>},
  { id:'immortan', name:'사막 독재자', movie:'매드맥스', color:'#4a90e8',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="20" y="50" width="40" height="22" rx="4" fill="#c8c0b0"/><ellipse cx="40" cy="36" rx="18" ry="17" fill="#d4cabb"/><rect x="24" y="38" width="32" height="18" rx="8" fill="#e8e8e8" stroke="#bbb" strokeWidth="1"/><rect x="27" y="41" width="26" height="12" rx="5" fill="#d0d0d0"/>{[30,34,38,42,46].map(x=><line key={x} x1={x} y1="41" x2={x} y2="53" stroke="#bbb" strokeWidth="1"/>)}<ellipse cx="32" cy="31" rx="5" ry="3.5" fill="#5588dd" opacity=".9"/><ellipse cx="48" cy="31" rx="5" ry="3.5" fill="#5588dd" opacity=".9"/><ellipse cx="32" cy="31" rx="3" ry="2.5" fill="#2255aa"/><ellipse cx="48" cy="31" rx="3" ry="2.5" fill="#2255aa"/><ellipse cx="40" cy="20" rx="16" ry="10" fill="#e8e4dc"/></svg>},
  { id:'leon', name:'고독한 킬러', movie:'레옹', color:'#888',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="18" y="52" width="44" height="22" rx="4" fill="#2a2a2a"/><ellipse cx="40" cy="36" rx="17" ry="18" fill="#c8956a"/><rect x="22" y="24" width="36" height="7" rx="3" fill="#111"/><circle cx="31" cy="27" r="6" fill="#0a0a0a" stroke="#444" strokeWidth="1.5"/><circle cx="49" cy="27" r="6" fill="#0a0a0a" stroke="#444" strokeWidth="1.5"/><line x1="37" y1="27" x2="43" y2="27" stroke="#444" strokeWidth="1.5"/><path d="M33 44 Q40 47 47 44" stroke="#8a6040" strokeWidth="1.5" fill="none"/><ellipse cx="40" cy="20" rx="17" ry="8" fill="#1a1a1a"/></svg>},
  { id:'morpheus', name:'각성의 안내자', movie:'매트릭스', color:'#8866cc',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="15" y="52" width="50" height="22" rx="4" fill="#111"/><ellipse cx="40" cy="36" rx="16" ry="17" fill="#7a5a3a"/><ellipse cx="31" cy="33" rx="7" ry="4.5" fill="#0a0a0a" stroke="#888" strokeWidth="1.5"/><ellipse cx="49" cy="33" rx="7" ry="4.5" fill="#0a0a0a" stroke="#888" strokeWidth="1.5"/><line x1="38" y1="33" x2="42" y2="33" stroke="#888" strokeWidth="1.5"/><path d="M33 45 Q40 49 47 45" stroke="#4a3020" strokeWidth="2" fill="none"/><ellipse cx="40" cy="21" rx="16" ry="9" fill="#5a3a1a"/><ellipse cx="28" cy="64" rx="4" ry="2.5" fill="#dd2222"/><ellipse cx="52" cy="64" rx="4" ry="2.5" fill="#2244cc"/></svg>},
  { id:'pennywise', name:'공포먹는 삐에로', movie:'그것', color:'#e07020',
    svg: <svg viewBox="0 0 80 80" fill="none"><ellipse cx="40" cy="68" rx="22" ry="10" fill="#f0f0f0"/><circle cx="28" cy="64" r="4" fill="#dd4444"/><circle cx="40" cy="66" r="4" fill="#dd4444"/><circle cx="52" cy="64" r="4" fill="#dd4444"/><ellipse cx="40" cy="36" rx="18" ry="19" fill="#f5f0e8"/><ellipse cx="12" cy="26" rx="7" ry="10" fill="#dd6600" transform="rotate(-20 12 26)"/><ellipse cx="68" cy="26" rx="7" ry="10" fill="#dd6600" transform="rotate(20 68 26)"/><ellipse cx="31" cy="31" rx="5.5" ry="5.5" fill="#f5dd44"/><ellipse cx="49" cy="31" rx="5.5" ry="5.5" fill="#f5dd44"/><ellipse cx="31" cy="31" rx="3" ry="3.5" fill="#1a1a1a"/><ellipse cx="49" cy="31" rx="3" ry="3.5" fill="#1a1a1a"/><ellipse cx="40" cy="39" rx="4.5" ry="3.5" fill="#dd2222"/><path d="M24 46 Q28 51 40 53 Q52 51 56 46" stroke="#cc1111" strokeWidth="2.5" fill="none"/></svg>},
  { id:'predator', name:'외계 포식자', movie:'프레데터', color:'#6a9a3a',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="16" y="52" width="48" height="22" rx="4" fill="#5a7a3a"/><ellipse cx="40" cy="36" rx="17" ry="18" fill="#6a8a4a"/>{[-16,-8,0,8,16].map((dx,i)=>(<line key={i} x1={40+dx} y1="20" x2={40+dx*1.5} y2="8" stroke="#4a6a2a" strokeWidth="3" strokeLinecap="round"/>))}<ellipse cx="32" cy="32" rx="4" ry="3" fill="#aadd00"/><ellipse cx="48" cy="32" rx="4" ry="3" fill="#aadd00"/><ellipse cx="32" cy="32" rx="2" ry="2" fill="#88bb00"/><ellipse cx="48" cy="32" rx="2" ry="2" fill="#88bb00"/><path d="M30 43 L33 50 L36 43 L40 50 L44 43 L47 50 L50 43" stroke="#3a5a1a" strokeWidth="1.5" fill="none"/></svg>},
  { id:'sparrow', name:'불멸의 해적', movie:'캐리비안의 해적', color:'#8a5a2a',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="18" y="52" width="44" height="22" rx="4" fill="#3a2a1a"/><ellipse cx="40" cy="37" rx="16" ry="17" fill="#c8906a"/><path d="M16 26 L40 8 L64 26 Z" fill="#1a1a1a"/><rect x="14" y="24" width="52" height="5" rx="2" fill="#2a2a2a"/><ellipse cx="32" cy="34" rx="4.5" ry="3.5" fill="#1a1a1a"/><ellipse cx="48" cy="34" rx="4.5" ry="3.5" fill="#1a1a1a"/><path d="M27 32 Q32 29 37 32" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/><path d="M43 32 Q48 29 53 32" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/><path d="M34 42 Q40 44 46 42" stroke="#5a3a1a" strokeWidth="2" fill="none"/><line x1="38" y1="43" x2="38" y2="48" stroke="#5a3a1a" strokeWidth="1.5"/><line x1="42" y1="43" x2="42" y2="48" stroke="#5a3a1a" strokeWidth="1.5"/><path d="M24 26 Q40 22 56 26 Q56 30 40 32 Q24 30 24 26" fill="#cc3322"/></svg>},
  { id:'joker', name:'혼돈의 광대', movie:'다크나이트', color:'#5533aa',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="16" y="52" width="48" height="22" rx="4" fill="#5533aa"/><ellipse cx="40" cy="36" rx="17" ry="18" fill="#f0eeea"/><ellipse cx="31" cy="32" rx="5" ry="4" fill="#1a1a1a" opacity=".8"/><ellipse cx="49" cy="32" rx="5" ry="4" fill="#1a1a1a" opacity=".8"/><path d="M28 35 Q30 40 29 43" stroke="#1a1a1a" strokeWidth="1.5" fill="none" opacity=".6"/><path d="M52 35 Q50 40 51 43" stroke="#1a1a1a" strokeWidth="1.5" fill="none" opacity=".6"/><path d="M22 44 Q27 40 31 44 Q35 48 40 46 Q45 48 49 44 Q53 40 58 44" stroke="#dd2222" strokeWidth="2.5" fill="none"/><ellipse cx="40" cy="20" rx="17" ry="10" fill="#446622"/>{[28,33,38,43,48,53].map((x,i)=>(<line key={i} x1={x} y1="20" x2={x+(i%2===0?-2:2)} y2="10" stroke="#335511" strokeWidth="2.5" strokeLinecap="round"/>))}</svg>},
  { id:'sadako', name:'우물 귀신', movie:'링', color:'#444',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="18" y="48" width="44" height="28" rx="4" fill="#f0f0f0"/><ellipse cx="40" cy="36" rx="16" ry="17" fill="#f5f0e8"/><path d="M24 20 Q20 36 18 56" stroke="#1a1a1a" strokeWidth="8" fill="none" strokeLinecap="round"/><path d="M28 18 Q24 34 22 52" stroke="#1a1a1a" strokeWidth="7" fill="none" strokeLinecap="round"/><path d="M34 17 Q30 32 28 50" stroke="#1a1a1a" strokeWidth="6" fill="none" strokeLinecap="round"/><path d="M40 16 Q38 30 36 50" stroke="#1a1a1a" strokeWidth="5" fill="none" strokeLinecap="round"/><path d="M56 20 Q60 36 62 56" stroke="#1a1a1a" strokeWidth="8" fill="none" strokeLinecap="round"/><path d="M52 18 Q56 34 58 52" stroke="#1a1a1a" strokeWidth="7" fill="none" strokeLinecap="round"/><path d="M46 17 Q50 32 52 50" stroke="#1a1a1a" strokeWidth="6" fill="none" strokeLinecap="round"/><ellipse cx="40" cy="20" rx="17" ry="11" fill="#1a1a1a"/><ellipse cx="47" cy="35" rx="3" ry="3.5" fill="#0a0a0a"/><circle cx="48" cy="34" r="1" fill="#fff" opacity=".6"/></svg>},
]

const GRADE_CHARS = {
  // 2020년대: 퓨리오사 (매드맥스)
  "2020s": <svg viewBox="0 0 60 60" fill="none"><rect x="8" y="44" width="44" height="12" rx="2" fill="#2e1f14"/><ellipse cx="30" cy="30" rx="15" ry="16" fill="#c89a7a"/><path d="M15 20 Q30 14 45 20 L45 25 Q30 23 15 25 Z" fill="#5a3820" opacity="0.6"/><path d="M17 18 Q30 14 43 18 L43 24 Q30 28 17 24 Z" fill="#0a0a0a"/><path d="M22 26 L20 36" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round"/><path d="M30 27 L30 38" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round"/><path d="M38 26 L40 36" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round"/><ellipse cx="22" cy="29" rx="2.5" ry="1.8" fill="#fff"/><ellipse cx="38" cy="29" rx="2.5" ry="1.8" fill="#fff"/><circle cx="22" cy="29" r="1.2" fill="#4a3020"/><circle cx="38" cy="29" r="1.2" fill="#4a3020"/><path d="M26 39 L34 39" stroke="#6a2818" strokeWidth="1.8" strokeLinecap="round"/><rect x="4" y="44" width="6" height="12" rx="1" fill="#8a9098"/><circle cx="7" cy="48" r="0.8" fill="#333"/><circle cx="7" cy="52" r="0.8" fill="#333"/></svg>,

  // 2010년대: 아이언맨
  "2010s": <svg viewBox="0 0 60 60" fill="none"><rect x="18" y="48" width="24" height="8" fill="#a00018"/><ellipse cx="30" cy="26" rx="17" ry="18" fill="#c8181a"/><path d="M14 24 Q20 12 30 10 Q40 12 46 24" fill="none" stroke="#e8302a" strokeWidth="2"/><path d="M14 30 Q30 28 46 30 Q46 44 30 46 Q14 44 14 30 Z" fill="#e8c440"/><path d="M18 32 Q30 30 42 32 L42 34 Q30 32 18 34 Z" fill="#c8a030"/><path d="M30 30 L30 46" stroke="#a88020" strokeWidth="0.8"/><path d="M18 32 L26 30 L24 36 Z" fill="#b8e8ff"/><path d="M42 32 L34 30 L36 36 Z" fill="#b8e8ff"/><path d="M19 32.5 L24 31 L23 34.5 Z" fill="#ffffff"/><path d="M41 32.5 L36 31 L37 34.5 Z" fill="#ffffff"/><rect x="27" y="41" width="6" height="1.5" fill="#a08020"/><path d="M14 30 L18 38 L14 42 Z" fill="#c8181a"/><path d="M46 30 L42 38 L46 42 Z" fill="#c8181a"/></svg>,

  // 2000년대: 네오 (매트릭스)
  "2000s": <svg viewBox="0 0 60 60" fill="none"><path d="M6 56 L14 42 L30 50 L46 42 L54 56 Z" fill="#0a0a0a"/><path d="M20 44 L30 54 L40 44 L40 56 L20 56 Z" fill="#1a1a1a"/><ellipse cx="30" cy="28" rx="15" ry="16" fill="#e0b896"/><path d="M14 20 Q30 10 46 20 Q44 24 30 22 Q16 24 14 20 Z" fill="#1a1a1a"/><path d="M14 18 Q20 14 30 14 Q40 14 46 18 L46 16 Q30 8 14 16 Z" fill="#0a0a0a"/><circle cx="22" cy="28" r="5" fill="#0a0a0a"/><circle cx="38" cy="28" r="5" fill="#0a0a0a"/><circle cx="22" cy="28" r="4" fill="#151520"/><circle cx="38" cy="28" r="4" fill="#151520"/><ellipse cx="20" cy="26" rx="1.2" ry="0.8" fill="#4a8aa8" opacity="0.7"/><ellipse cx="36" cy="26" rx="1.2" ry="0.8" fill="#4a8aa8" opacity="0.7"/><rect x="27" y="27.5" width="6" height="1.5" fill="#0a0a0a"/><path d="M26 40 L34 40" stroke="#7a4030" strokeWidth="1.5" strokeLinecap="round"/></svg>,

  // 1990년대: 우마 서먼 (킬빌의 신부)
  "1990s": <svg viewBox="0 0 60 60" fill="none"><rect x="10" y="42" width="40" height="14" rx="2" fill="#f5dc1a"/><rect x="10" y="42" width="4" height="14" fill="#0a0a0a"/><rect x="46" y="42" width="4" height="14" fill="#0a0a0a"/><path d="M30 42 L30 56" stroke="#0a0a0a" strokeWidth="1"/><ellipse cx="30" cy="28" rx="15" ry="16" fill="#f0d4b2"/><path d="M8 20 Q10 12 20 12 L22 28 Q16 36 12 42 L8 40 Z" fill="#f0d880"/><path d="M52 20 Q50 12 40 12 L38 28 Q44 36 48 42 L52 40 Z" fill="#f0d880"/><path d="M14 16 Q20 10 30 10 Q40 10 46 16 Q44 22 30 20 Q16 22 14 16 Z" fill="#f0d880"/><path d="M30 10 L30 18" stroke="#c8b050" strokeWidth="0.8"/><ellipse cx="22" cy="28" rx="2.5" ry="1.8" fill="#fff"/><ellipse cx="38" cy="28" rx="2.5" ry="1.8" fill="#fff"/><circle cx="22" cy="28" r="1.3" fill="#4a78a0"/><circle cx="38" cy="28" r="1.3" fill="#4a78a0"/><path d="M26 38 Q30 36 34 38" stroke="#a02020" strokeWidth="1.8" fill="none" strokeLinecap="round"/><path d="M15 26 L18 34" stroke="#a00018" strokeWidth="1.2" strokeLinecap="round"/></svg>,

  // 오래전 영화: 찰리 채플린
  "old": <svg viewBox="0 0 60 60" fill="none"><rect x="12" y="44" width="36" height="12" fill="#1a1a1a"/><path d="M24 44 L30 52 L36 44 L36 50 L24 50 Z" fill="#fafafa"/><path d="M28 48 L32 48 L34 52 L26 52 Z" fill="#0a0a0a"/><ellipse cx="30" cy="28" rx="14" ry="15" fill="#f2d8b8"/><ellipse cx="30" cy="18" rx="16" ry="2.5" fill="#0a0a0a"/><ellipse cx="30" cy="14" rx="12" ry="7" fill="#0a0a0a"/><ellipse cx="30" cy="13" rx="10" ry="5" fill="#1f1f1f"/><rect x="20" y="17" width="20" height="1" fill="#2a2a2a"/><ellipse cx="24" cy="28" rx="2" ry="2.5" fill="#fff"/><ellipse cx="36" cy="28" rx="2" ry="2.5" fill="#fff"/><circle cx="24" cy="29" r="1.3" fill="#1a1a1a"/><circle cx="36" cy="29" r="1.3" fill="#1a1a1a"/><rect x="27" y="34" width="6" height="2.5" rx="0.5" fill="#0a0a0a"/><path d="M25 40 Q30 43 35 40" stroke="#8a4020" strokeWidth="1.3" fill="none" strokeLinecap="round"/><circle cx="30" cy="49" r="0.8" fill="#2a2a2a"/><circle cx="30" cy="53" r="0.8" fill="#2a2a2a"/></svg>,
}

const GRADES = [
  { id:'2020s', name:'2020년대', desc:'매드맥스·기생충·범죄도시… 요즘 거 맞춰보자' },
  { id:'2010s', name:'2010년대', desc:'인터스텔라·어벤져스·곡성… 기억나지?' },
  { id:'2000s', name:'2000년대', desc:'올드보이·괴물·매트릭스… 추억 소환' },
  { id:'1990s', name:'1990년대', desc:'쥬라기공원·더록·킬빌… 이젠 클래식' },
  { id:'old',  name:'오래전 영화', desc:'스타워즈·대부·칠수와 만수… 진짜 영화 덕후 영역' }
]

function shuffle(arr){

  const a = [...arr]

  for(let i = a.length - 1; i > 0; i--){

    const j = Math.floor(Math.random() * (i + 1))

    ;[a[i], a[j]] = [a[j], a[i]]

  }

  return a

}

const BP = 1000
const FBW = {
  1:['힌트가 좀 어려웠지?','아직 힌트 4개나 남았어','처음부터 맞추면 재미없잖아'],
  2:['아깝다. 좀 더 생각해봐','거의 다 왔는데!','느낌이 왔을 것 같은데...'],
  3:['이걸 모른다고?','이 영화 분명 본 적 있을걸?','이거 모르면 영화 레벨 의심'],
  4:['배우 이름까지 나왔는데?','이건 맞추는 사람 많던데','자존심 안 상해?'],
  5:['포기 포기 😮‍💨','오늘은 여기까지','오늘은 이 영화가 이겼어'],
}
const rFB = h => { const a=FBW[h]||FBW[5]; return a[Math.floor(Math.random()*a.length)] }

function normalize(s){ return s.toLowerCase().replace(/[\s:!"',.·~…()\[\]/\\-_]/g,'') }
function lev(a,b){
  const m=a.length,n=b.length
  const dp=Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i===0?j:j===0?i:0))
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++) dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1])
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
function CharacterSpinner({ fadeOut }){
  const [idx, setIdx] = useState(0)
  useEffect(() => {
  const t = setInterval(() => {
    setIdx(prev => (prev + 1) % CHARS.length)
  }, 180)
  return () => clearInterval(t)
}, [])
  const char = CHARS[idx]
  return(
    <div style={{
      position:'fixed',
      inset:0,
      background:'rgba(255,255,255,0.6)',
      backdropFilter:'blur(1.5px)',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      zIndex:999,
      opacity: fadeOut ? 0 : 1,
      transition:'opacity 0.5s ease'
}}>

      <div style={{
        width:110,
        height:110,
        borderRadius:'50%',
        background:'#fff',
        border:'2px solid #e8e4dd',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        boxShadow:'0 10px 30px rgba(0,0,0,0.08)'
      }}>

        <svg viewBox="0 0 80 80" style={{width:90,height:90}}>

          {char.svg.props.children}

        </svg>

      </div>

    </div>

  )

}

//인트로//

function IntroScreen({ onEnter }) {
  
  const [mounted, setMounted] = useState(false)

useEffect(() => {

  setMounted(true)

}, [])

  return (

    <div style={{

      position:'fixed',

      inset:0,

      background:'#0a0a0a',

      overflow:'hidden',

      display:'flex',

      alignItems:'center',

      justifyContent:'center',

      flexDirection:'column'

    }}>

      {/* 🔥 실루엣 레이어 */}

      <div style={{

        position:'absolute',

        inset:0,

        pointerEvents:'none'

      }}>

        {/* 레이어 1 */}

        <div style={{

          position:'absolute',

          top:'20%',

          left:'10%',

          width:120,

          opacity:0.08,

          filter:'blur(6px)',

          animation:'float1 12s linear infinite'

        }}>

          <svg viewBox="0 0 80 80" fill="#fff">

            <circle cx="40" cy="40" r="30"/>

          </svg>

        </div>

        {/* 레이어 2 */}

        <div style={{

          position:'absolute',

          bottom:'15%',

          right:'15%',

          width:140,

          opacity:0.06,

          filter:'blur(8px)',

          animation:'float2 16s linear infinite'

        }}>

          <svg viewBox="0 0 80 80" fill="#fff">

            <rect x="10" y="10" width="60" height="60"/>

          </svg>

        </div>

        {/* 레이어 3 */}

        <div style={{

          position:'absolute',

          top:'50%',

          left:'70%',

          width:100,

          opacity:0.07,

          filter:'blur(5px)',

          animation:'fadeFloat 10s ease-in-out infinite'

        }}>

          <svg viewBox="0 0 80 80" fill="#fff">

            <ellipse cx="40" cy="40" rx="28" ry="20"/>

          </svg>

        </div>

      </div>

      {/* 🔥 텍스트 */}

      <div style={{

        color:'#fff',
        textAlign:'center',
        zIndex:10,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'column'
      }}>

        <div style={{
          width:'320px',
          textAlign:'center',
          fontFamily:"'Courier New', monospace",
          letterSpacing:'0.5px',
          fontSize:'1rem',
          color:'#9ef7c0',
          opacity:0.9,
          marginBottom:70,
          whiteSpace: 'nowrap'
}}>
  

  <div

  className="typing"

  style={{

    visibility: mounted ? 'visible' : 'hidden'

  }}

>

  Houston... we have a problem.

</div>

</div>

<div style={{

  fontSize:'2.2rem',

  fontWeight:900,

  letterSpacing:'-1px',

  marginBottom:30,

  opacity: 0,

animation: 'fadeIn 1s ease forwards',

animationDelay: '5s'

}}>

  Cine <span style={{color:'#e8808c'}}>CLUE</span>

</div>

<button

  onClick={onEnter}

  style={{

    height:48,

    padding:'0 28px',

    borderRadius:12,

    background:'#fff',

    color:'#000',

    fontWeight:700,

    border:'none',

    cursor:'pointer',

    opacity: 0,

animation: 'fadeIn 1s ease forwards',

animationDelay: '5s'

  }}

>

  들어가기

</button>

      </div>

      {/* 🔥 애니메이션 */}

      <style jsx>{`

@keyframes float1 {
  0% { transform:translateX(0); }
  100% { transform:translateX(40px); }
}

@keyframes float2 {
  0% { transform:translateY(0); }
  100% { transform:translateY(-40px); }
}

@keyframes fadeFloat {
  0% { opacity:0.05; }
  50% { opacity:0.12; }
  100% { opacity:0.05; }
}

/* 🔥 여기 추가 */
.typing {
  width: 30ch;
  white-space: nowrap;
  overflow: hidden;

  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
  font-size: 1rem;
  color: #9ef7c0;

  border-right: 2px solid #9ef7c0;

  animation:
    typing 4s steps(30) forwards,
    blink 1s step-end infinite;
}

@keyframes typing {
  from { width: 0 }
  to { width: 30ch }
}

@keyframes blink {
  50% { border-color: transparent }
}

`}</style>
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
}){

  if(!supabase) {
    alert('❌ supabase 없음')
    return
  }

  const movieId = movie?.id ?? null

  const { error } = await supabase.from('game_logs').insert({
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
  })

  if(error){
  console.error('DB 에러:', error.message)
}
}



async function getProfileStats(supabase, charId){
  const { data: logs } = await supabase
    .from('game_logs')
    .select('*')
    .eq('character_id', charId)
  const totalScore = logs.reduce(
    (sum, l) => sum + (l.score_earned || 0),
    0
  )
  const level =
    Math.floor(totalScore / 50000) + 1
  const currentLevelScore =
    totalScore % 50000
  const levelPercent =
    Math.round(
    (currentLevelScore / 50000) * 100
  )
  const totalSeconds = logs.reduce((sum, l) => {
    return sum + (l.mode === 'objective' ? 15 : 30)
  }, 0)

  const lastPlayed =
    logs
      .filter(l => l.created_at)
      .sort((a,b)=>
        new Date(b.created_at) - new Date(a.created_at)
      )[0]?.created_at

  const genreMap = {}

  logs.forEach(l=>{

    if(!l.genre) return

    if(!genreMap[l.genre]){

      genreMap[l.genre] = {

        genre: l.genre,

        attempt_count: 0,

        correct_count: 0,

        total_score: 0

      }

    }

    genreMap[l.genre].attempt_count += 1

    if(l.is_correct){

      genreMap[l.genre].correct_count += 1

    }

    genreMap[l.genre].total_score +=

      l.score_earned || 0

  })

  const genreStats = Object.values(genreMap).map(g => ({

  ...g,

  percent: g.attempt_count > 0

    ? Math.round((g.correct_count / g.attempt_count) * 100)

    : 0

}))

  const favoriteGenres =
  [...genreStats]
    .sort((a,b)=>
      b.percent - a.percent
    )
    .slice(0,2)
    .map(g => g.genre)

  return {
    nickname:
    logs?.[0]?.nickname || '-',
    totalScore,
    totalSeconds,
    lastPlayed,
    level,
    currentLevelScore,
    levelPercent,
    favoriteGenres,
    genreStats
  }
}






async function loadRanking({ supabase }){
  const { data, error } = await supabase
    .from('game_logs')
    .select('id, user_id, character_id, score_earned, nickname')
    .eq('log_type', 'result')  
    .not('score_earned', 'is', null)

  if(error){
    console.error('랭킹 에러:', error.message)
    return []
  }

  const map = {}

  data.forEach(d => {
    const key = `${d.user_id}_${d.character_id}`
    if(!map[key]){
      map[key] = {
        user_id: d.user_id,  
        character_id: d.character_id,
        score: d.score_earned,
        nickname: d.nickname || null,
        id: d.id
      }
    } 
    else {
      if(d.id > map[key].id){
        map[key] = {
          user_id: d.user_id,  
          character_id: d.character_id,
          score: d.score_earned,
          nickname: d.nickname || map[d.character_id].nickname,
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
  .sort((a,b)=>b.score - a.score)
}






function CharAvatar({charId,size=40}){
  const c=CHARS.find(x=>x.id===charId)
  if(!c) return <div style={{width:size,height:size,borderRadius:'50%',background:'#f0eeea',border:'1.5px solid #e0dcd4'}}/>
  return(
    <div style={{width:size,height:size,borderRadius:'50%',background:'#f5f3ef',border:'1.5px solid #e8e4dd',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',flexShrink:0}}>
      <svg viewBox="0 0 80 80" fill="none" style={{width:size,height:size}}>{c.svg.props.children}</svg>
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


export default function CineClue()  {
  const infoBox = {
    background:'#fff',
    border:'1px solid #e8e4dd',
    borderRadius:12,
    padding:'10px 12px'
  }

  const label = {
    fontSize:'0.65rem',
    color:'#aaa',
    marginBottom:4
    }

  const value = {
    fontSize:'0.9rem',
    fontWeight:700,
    color:'#fff'
    }

  async function fetchAllMovies(){
    const all = []
    const pageSize = 1000
    let from = 0

    while(true){
      const { data, error } = await supabase
        .from('movies')
        .select('id, title')
        .range(from, from + pageSize - 1)
      if(error) throw error
      if(!data || data.length === 0) break
      all.push(...data)
      if(data.length < pageSize) break
      from += pageSize
    }
    return all
  }   

  const MODES = [
    { key:'2020s', label:'2020년대', type:'era', image:'/mode/20s.webp' },
    { key:'2010s', label:'2010년대', type:'era', image:'/mode/10s.webp' },
    { key:'2000s', label:'2000년대', type:'era', image:'/mode/00s.webp' },
    { key:'1990s', label:'1990년대', type:'era', image:'/mode/90s.webp' },
    { key:'old', label:'CLASSIC MOVIES', type:'era', image:'/mode/old.webp' },
    { key:'all', label:'ALL MOVIES', type:'era', image:'/mode/all.webp' },
    { key:'horror', label:'호러파티', type:'theme', image:'/mode/horror.webp' },
    { key:'hk', label:'아시아영화 매니아', type:'theme', image:'/mode/hk.webp' },
    { key:'sf', label:'SF환상특급', type:'theme', image:'/mode/sf.webp' },
    { key:'kr', label:'한국영화 따라잡기', type:'theme', image:'/mode/kr.webp' },
    { key:'anime', label:'오로지 애니', type:'theme', image:'/mode/anime.webp' },
    { key:'thriller', label:'미스테리&스릴러', type:'theme', image:'/mode/thriller.webp' }
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
    'SF공포': [878,27],
    'SF액션': [878,28],
    '판타지': [14],
    '판타지액션': [14,28],
    '공포': [27],
    '미스터리/스릴러': [9648,53],
    '액션': [28],
    '코미디': [35],
    '로맨스': [10749],
    '드라마': [18]
  }



  const TMDB_KEY =process.env.NEXT_PUBLIC_TMDB_KEY
  const KMDB_KEY =process.env.NEXT_PUBLIC_KMDB_KEY

  const [showRecommendCard, setShowRecommendCard]
  = useState(false)
  const [recommendCard, setRecommendCard]
  = useState(null)
  const [showMovieCard,setShowMovieCard]
  = useState(false)
  const [movieCard,setMovieCard]
  = useState(null)
  const [movieCardFlipped,setMovieCardFlipped]
  = useState(false)



  const [isFlashing, setIsFlashing] = useState(false)
  const inputRef = useRef(null)
  const [showReportToast, setShowReportToast] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settingsPage, setSettingsPage] = useState(null)
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const [profileStats, setProfileStats] = useState(null)
  const ERA_MODES = MODES.filter(m => m.type === 'era')
  const THEME_MODES = MODES.filter(m => m.type === 'theme')
  const [screen,   setScreen]   = useState('intro')
  const [selChar,  setSelChar]  = useState(null)
  const [selGrade, setSelGrade] = useState(null)
  const [pool,     setPool]     = useState([])
  const [qi,       setQi]       = useState(0)
  const [sh,       setSh]       = useState(1)
  const [score,    setScore]    = useState(0)
  const [answered, setAnswered] = useState(false)
  const [fb,       setFb]       = useState('')
  const [fbt,      setFbt]      = useState('')
  const [input,    setInput]    = useState('')
  const [mode,     setMode]     = useState(null)
  const [comboStreak,  setComboStreak]  = useState(0)
  const [crazyStreak,  setCrazyStreak]  = useState(0)
  const [roundStartScore, setRoundStartScore] = useState(0)
  const [results,  setResults]  = useState([])
  const [loading,  setLoading]  = useState(false)
  const [visibleResults, setVisibleResults] = useState(0)
  const [displayScore,   setDisplayScore]   = useState(0)
  const [ready, setReady] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)
  const [users, setUsers] = useState([]) 
  const [authUser, setAuthUser] = useState(null)
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
  const [supabase, setSupabase] = useState(null)
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
  LEVEL_TITLES[Math.min(level,100)]




  async function openMovieRecommend(){
    setShowMovieCard(false)
    setMovieCard(null)
    setIsLoadingRecommend(true)
    setRecommendStatus('loading')
    const TMDB_KEY =
      process.env.NEXT_PUBLIC_TMDB_KEY
    try{

      // Top3 장르
      const topGenres =
        [...(profileStats?.genreStats || [])]
          .sort((a,b)=>b.percent - a.percent)
          .slice(0,3)
      // 랜덤 장르 하나 선택

      const pickedGenre =
        topGenres[
          Math.floor(Math.random() * topGenres.length)
        ]?.genre

      // TMDB 장르 id 변환

      const genreIds =
        TMDB_GENRE_MAP[pickedGenre]
      if(!genreIds){
        setRecommendStatus('fail')
        setTimeout(()=>{
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
      if(!data.results?.length){
        setRecommendStatus('fail')
        setTimeout(()=>{
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
        if(posterUrl){
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
        }else{
          setRecommendMovie(movieData)
          setShowRecommendModal(true)
          setRecommendStatus('idle')
        }
      }catch(e){
        console.error(e)
      }
        finally{
        setIsLoadingRecommend(false)
      }
    }


  useEffect(()=>{
  if(!isLoadingRecommend) return
  const seq = ['.', '..', '...']
  let idx = 0
  const t = setInterval(()=>{
    idx = (idx + 1) % seq.length
    setLoadingDots(seq[idx])
  }, 320)
  return ()=>clearInterval(t)
  },[isLoadingRecommend])





  useEffect(() => {
    if (lifeDelta === null) return
    const t = setTimeout(() => {
      setLifeDelta(null)
    }, 1000)   // 👉 시간 늘려도 됨
    return () => clearTimeout(t)
  }, [lifeDelta])


  useEffect(()=>{
    if(showProfile){
      setAnimateStats(false)
      setTimeout(()=>{
        setAnimateStats(true)
      }, 60)
    }
  }, [showProfile, profileTarget])


  useEffect(()=>{
    setSelectedSuggestion(-1)
  }, [suggestions])




  useEffect(()=>{
    MODE_IMAGES.forEach(src => {
      const img = new Image()
      img.src = src
    })
  },[])


  useEffect(()=>{
    if(!supabase || !selChar) return
    const run = async()=>{
      const profile =
        await getProfileStats(
          supabase,
          profileTarget || selChar
        )
      setProfileStats(profile)
    }
    run()
  }, [supabase, selChar, profileTarget])



  useEffect(()=>{
    if(pendingLifeDelta !== null){
      setLifeDelta(pendingLifeDelta)
      setPendingLifeDelta(null)
    }
  }, [qi])



  // 자동입력시 전체영화 로딩
  useEffect(()=>{
    if(!supabase) return
    fetchAllMovies().then(data=>{
      setAllMovies(data)
    })
  }, [supabase])




  useEffect(()=>{
    setSuggestions([])
    setInput('')
  }, [qi])


  useEffect(()=>{
    if(screen !== 'quiz') return
    if(quizMode !== 'objective') return
    if(!pool[qi]) return
    setChoices(pool[qi].choices || [])
  }, [screen, qi, quizMode, pool])


  useEffect(()=>{
    const t = setTimeout(()=>{
      setReady(true)
    }, 1200) // 🔥 여기 숫자로 타이밍 조절
    return ()=>clearTimeout(t)
  },[])


  useEffect(()=>{
    if(screen !== 'result') return
    if(!currentUserId || !selChar) return
    fetchGenreStats(currentUserId, selChar)
      .then(setGenreStats)
  }, [screen, currentUserId, selChar])


  useEffect(()=>{
  if(screen === 'result' && resultView === 'ranking'){
    setRankingRevealDone(false)
    const t = setTimeout(()=>{
      setRankingRevealDone(true)
    }, 650)
    return () => clearTimeout(t)
  }
  }, [screen, resultView])


  useEffect(()=>{
    if(screen === 'result'){
      setShowProfile(false)   // 🔥 무조건 초기화
    }
  },[screen])


  useEffect(()=>{
    setWrongCount(0)
    setLockChoice(false)
    setSelectedChoice(null)
    setProgress(0)        
    setButtonActive(false)
  }, [qi])




  useEffect(() => {
    if(screen !== 'quiz') return
    if(!questionReady) return
    if(answered) return   // 🔥 추가 (핵심)
    const start = Date.now()
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000
      const percent = Math.min((elapsed / duration) * 100, 100)
      setProgress(percent)
      if (elapsed >= duration) {
        if(!answered){     // 🔥 추가 (이중 안전장치)
          doSkip()
        }
        clearInterval(timerRef.current)
      }
    }, 100)
    return () => clearInterval(timerRef.current)
  }, [qi, screen, quizMode, answered,questionReady])  


  async function fetchGenreStats(user_id, character_id){
    const { data, error } = await supabase
      .from('user_genre_stats')
      .select('genre, attempt_count, correct_count, total_score')
      .eq('user_id', user_id)
      .eq('character_id', character_id)
    if(error){
      console.error('genreStats error 👉', error)
      return []
    }
    return data
  }

  //객관식 선택지 생성 함수
  function buildChoices(correctMovie, allMovies){
    const pool = allMovies.filter(m => m.id !== correctMovie.id)
    const shuffled = [...pool].sort(()=>Math.random()-0.5)
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




async function loadMovieDetail(movie){

  setShowRecommendModal(false)

  const TMDB_KEY =
    process.env.NEXT_PUBLIC_TMDB_KEY

  try{

    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(movie.title)}&language=ko-KR`
    )
    if(!res.ok){
      console.error(
        'TMDB SEARCH ERROR',
        res.status
      )
      return
    }
    const data = await res.json()
    const found = data.results.find(m => {
      const tmdbYear =
        m.release_date?.slice(0,4)
      const sameYear =
        String(tmdbYear) === String(movie.year)
      const sameOriginal =
        (m.original_title || '')
          .toLowerCase()
          .trim()
        ===
        (movie.title_en || '')
          .toLowerCase()
          .trim()
      const sameTitle =
        (m.title || '').trim()
        ===
        (movie.title || '').trim()
      return sameYear && (
        sameOriginal || sameTitle
      )
    })

    if(!found){
      alert('영화 정보를 찾을 수 없어요')
      return
    }

    const detailRes = await fetch(
      `https://api.themoviedb.org/3/movie/${found.id}?api_key=${TMDB_KEY}&language=ko-KR&append_to_response=credits,videos`
    )
    if(!detailRes.ok){
      console.error(
        'TMDB DETAIL ERROR',
        detailRes.status
      )
      alert('영화 정보를 불러오지 못했어요')
      return
    }
    const detail = await detailRes.json()

    console.log('🎬 TMDB VIDEOS CHECK', {

  title: detail.title,

  tmdbId: detail.id,

  videos: detail.videos?.results || []

})

    const trailer =
      detail.videos?.results?.find(v =>

    v.site === 'YouTube' &&

    v.type === 'Trailer'

  ) ||

  detail.videos?.results?.find(v =>

    v.site === 'YouTube' &&

    v.official

  )

  ||

  detail.videos?.results?.find(v =>

  v.site === 'YouTube'

)

    const youtubeKey = trailer?.key || null
    console.log('🎬 YOUTUBE KEY', {

  title: detail.title,

  youtubeKey,

  pickedVideo: trailer || null

})

    const movieData = {
      ...detail,
      youtubeKey
    }
    setMovieCard(movieData)
    setMovieCardFlipped(false)
    setShowMovieCard(true)
    }
    catch(err){
      console.error(err)
    }
  }

async function loadTMDB(movie){

  const TMDB_KEY =
    process.env.NEXT_PUBLIC_TMDB_KEY
  try{

    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(movie.title)}&language=ko-KR`
    )

    if(!res.ok){

      return {}

    }

    const data = await res.json()

    const found = data.results?.find(tmdb => {

      const tmdbYear =
        tmdb.release_date?.slice(0,4)

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

    if(!found){
      return {}
        }
        const detailRes = await fetch(
          `https://api.themoviedb.org/3/movie/${found.id}?api_key=${TMDB_KEY}&language=ko-KR&append_to_response=credits,videos`
        )
        if(!detailRes.ok){
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

        console.log('🎬 YOUTUBE KEY', {

          title: detail.title,

          youtubeKey,

          pickedVideo: trailer || null

        })

        return {

          ...detail,

          youtubeKey

        }

  }catch(e){

    console.error(
      'TMDB preload 실패',
      e
    )

    return {}

  }

}



  function formatPlayTime(sec){
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    if(h > 0) return `${h}시간 ${m}분`
    return `${m}분`
  }


  function triggerDeath(){
  setDeathMessage(true)   // 👉 화면 띄우기
  setTimeout(()=>{
    setDeathMessage(false)
    setSelChar(null)
    setScreen('char')     // 👉 캐릭터 선택으로 이동
  }, 3500)
  }


  function toggleGrade(id){
  setSelGrade(id)
  }


  function handleShowAnswers(){
    setShowAnswers(true)
  }


  useEffect(()=>{
    if(screen !== 'result'){
      resultSavedRef.current = false
      return
    }
    if(!supabase || !results?.length) return
    if(resultSavedRef.current) return
    if(!currentUser?.userId) return

    resultSavedRef.current = true

    const safeNickname = currentUser?.nickname || nickname || 'USER'
    const userId = String(currentUser?.userId)
    const totalScore = score
    const run = async () => {
      await saveLog({
        supabase,
        userId,
        charId: selChar,
        movie: { id: null },
        hintUsed: 0,
        score: totalScore,
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
  const char = CHARS.find(c=>c.id===selChar)
  const g    = GRADES.find(x=>x.id===selGrade)

  // ✅ supabase 생성
  useEffect(()=>{
    if(SUPABASE_URL){
      const client = createClient(SUPABASE_URL, SUPABASE_KEY)
      setSupabase(client)
    }
  },[])


  useEffect(()=>{
    if(!supabase) return;
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setAuthUser(data.user) 
    }
    getUser()
  }, [supabase])



  // 결과 화면 순차 노출 + 점수 카운트
  useEffect(()=>{
    if(screen !== 'result') return
    if(results.length === 0) return
    if(!users || users.length === 0) return
    setResultView('score') 
    setVisibleResults(1)

    const roundScore = score - roundStartScore
    const startScore = roundStartScore  
    const tot = startScore + roundScore

    setDisplayScore(startScore)

    let i = 0

    const interval = setInterval(()=>{
      i++
      setVisibleResults(i)

      if(i >= results.length){
        clearInterval(interval)
        setTimeout(()=>{
          setVisibleResults(v => v + 1) // 버튼 등장
          // 👇 버튼 이후 카운트 시작
          setTimeout(()=>{
            let cur = startScore
            const step = Math.ceil((tot - startScore)/60)
            const iv = setInterval(()=>{
              cur = Math.min(cur + step, tot)
              setDisplayScore(cur)
              if(cur >= tot) clearInterval(iv)
            },20)
          }, 400)
        }, 400)
      }
    }, 400)
    return () => clearInterval(interval)
  }, [screen, results, users])


  useEffect(()=>{
    if(screen !== 'result' || resultView !== 'ranking') return
    if(!supabase) return
    const run = async () => {
      const data = await loadRanking({ supabase })
      setRanking(data)
    }
    run()
  }, [screen, resultView, supabase])


  useEffect(()=>{
    const saved = localStorage.getItem('cineclue_users')
    if(saved){
      setUsers(JSON.parse(saved))
    }
  },[])


  function handleCharClick(charId){
    const target = users.find(u => u.charId === charId)
    // 🔥 1. 기존 캐릭터 있음
    if(target){
      // 👉 죽은 캐릭터 → 부활 팝업
      if(target?.isDead){
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


  async function loadMovies(){
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
    try{
      if(!supabase){
        alert('DB 연결 안됨')
        return
      }
      // 1️⃣ 현재 유저
      const userId = String(currentUser?.userId)
      // 2️⃣ 로그 가져오기
      const { data: logs } = await supabase
      .from('game_logs')
      .select('movie_id')
      .eq('user_id', userId)
      .not('movie_id', 'is', null)
      .order('id', { ascending: false })

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
      async function fetchMoviesByYears(){
        let query = supabase
          .from('movies')
          .select(`
            *,
            hints(*)
          `)
        const g = selGrade

        if(g === '2020s') query = query.gte('year', 2020)
        if(g === '2010s') query = query.gte('year', 2010).lt('year', 2020)
        if(g === '2000s') query = query.gte('year', 2000).lt('year', 2010)
        if(g === '1990s') query = query.gte('year', 1990).lt('year', 2000)
        if(g === 'old')   query = query.lt('year', 1990)
        if(g === 'horror') query = query.ilike('genre', '%공포%')
        if(g === 'hk')     query = query.or('country.ilike.%홍콩%,country.ilike.%중국%,country.ilike.%대만%,country.ilike.%일본%')
        if(g === 'sf')     query = query.ilike('genre', '%SF%')
        if(g === 'kr')     query = query.ilike('country', '%한국%')
        if(g === 'anime')  query = query.ilike('genre', '%애니%')
        if(g === 'thriller') query = query.ilike('genre', '%스릴러%')
        if(g === 'all') {// 필터 없음 (전체)
          }
        const all = []
        const pageSize = 1000
        let from = 0

        while(true){
          const { data, error } = await query.range(from, from + pageSize - 1)
          if(error) throw error
          if(!data || data.length === 0) break
          all.push(...data)
          if(data.length < pageSize) break
          from += pageSize
        }
        return all
      }
      const delayPromise = new Promise(r => setTimeout(r, 500))
      const [movies] = await Promise.all([
        fetchMoviesByYears(),
        delayPromise
      ])
      const error = null
      if(error){
        console.error(error)
        alert('데이터 오류')
        setLoading(false)
        return
      }
      if(!movies || movies.length===0){
        alert('영화 없음')
        setLoading(false)
        return
      }
      // 4️⃣ JS에서 필터
      const playedSet = new Set(playedIds)
      const filtered = movies.filter(m => !playedSet.has(m.id))
      let finalPool = filtered

      // 🔥 1️⃣ 풀 부족 시 자동 리셋
      if(filtered.length < 10){
        alert('해당 시대 영화가 부족합니다')
        setLoading(false)
        return
      }
      // 🔥 1차 샘플링 (전체에서 100개)
      const sampled = shuffle(finalPool).slice(0, 50)

      // 🔥 2차 랜덤 (그 안에서 5개)
      const baseSel = shuffle(sampled).slice(0,5)

      const sel = baseSel.map(m => ({

        ...m,

        hintsArr: m.hints

          ? m.hints

            .sort((a,b)=>a.hint_level - b.hint_level)

            .map(h=>h.hint_text)

          : [],

        choices:

          buildChoices(m, movies)

      }))

      Promise.all(
        sel.map(async movie => {
          const tmdb = await loadTMDB(movie)
          return {
            ...movie,
            tmdbLoaded:true,
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
    
    }
  
    catch(e){
      console.error(e)
      alert('오류 발생')
    }
      
  
    finally{
      setLoading(false)
      // 🔥 페이드 시간 확보
      setTimeout(()=>{
        setShowSpinner(false)
      }, 150)
    }
  }


  function getPts(modeParam){
    const ratioMap = {
      1: 1.0,
      2: 0.8,
      3: 0.6,
      4: 0.4,
      5: 0.2
    }
    let base = BP * (ratioMap[sh] || 0)
    // 🔥 1. 콤보 먼저 적용
    if(modeParam === 'good') base *= 3
    if(modeParam === 'wow') base *= 4
    if(modeParam === 'crazy') base *= 5
    // 🔥 2. 그 다음 객관식 페널티
    if(quizMode === 'objective'){
      base *= 0.1
    }
    return Math.round(base)
  }

  // 콤보는 3문제 연속 맞춘 후 다음 퀴즈에 발동
  function updateCombo(correct){
    if(!correct){
      return
    }
    setComboStreak(prev => {
      const ns = prev + 1
      if(ns >= 5){
        setMode('crazy')
      } else if(ns === 4){
        setMode('wow')
      } else if(ns === 3){
        setMode('good')
      } else {
        setMode(null)
      }
      return ns
    })
  }


  // ── 정답 버튼 로직 ──
  async function submit(answerValue){
    if(answered || isSubmitting) return
    if(!currentUser?.userId) return
    if(quizMode === 'subjective' && !input.trim()) return

    setIsSubmitting(true)
    const m = pool[qi]

    if(!m){
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

      if(correct){
        const isFirstTry = wrongCount === 0
        const comboAllowed = quizMode === 'subjective' || isFirstTry

        if(comboAllowed){
          const ns = comboStreak + 1
          if(ns >= 5) appliedMode = 'crazy'
          else if(ns === 4) appliedMode = 'wow'
          else if(ns === 3) appliedMode = 'good'
          setComboStreak(ns)
          setMode(appliedMode)
        } else{
          // 객관식에서 두 번째 클릭으로 맞춘 경우: 콤보 인정 안 함
          setComboStreak(0)
          setMode(null)
          appliedMode = null
        }

        gained = getPts(appliedMode)
        setScore(v => v + gained)
        setUsers(prev => {
          const updated = prev.map(u => {

            if(u.charId === selChar){
              const prevLives = u.lives ?? 30
              const nextLives = Math.min(prevLives + 1, 30)
              // 🔥 이거 하나만 남겨
              if(nextLives > prevLives && prevLives < 30){
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
          localStorage.setItem('cineclue_users', JSON.stringify(updated))
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
        await supabase.rpc('update_genre_stats', {
          p_user_id: String(currentUser.userId),
          p_character_id: selChar,
          p_genre: m.final_genre || '기타',
          p_is_correct: true,
          p_score: gained
        })
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
        setTimeout(()=>{
          scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior:'smooth'
          })
        }, 120)
        setFbt('ok')
        setAnswered(true)
        setScoreFlash(true)
        setTimeout(() => {
          setScoreFlash(false)
        }, 300)

      } else {
        // 객관식: 첫 오답 클릭이면 콤보 해제
        if(quizMode === 'objective' && wrongCount === 0){
          setComboStreak(0)
          setMode(null)
        }
        // 주관식 오답은 여기서 콤보 해제 안 함
        if(quizMode === 'objective'){
          if(wrongCount === 0){
            setWrongCount(1)
            if(sh < 5){
              nextH()
            }
            setFb('다시 생각해봐')
            setFbt('ng')
            return
          }
          if(wrongCount === 1){
            setWrongCount(2)
            setLockChoice(true)
            setFb('기회를 더 줄 수가 없어요')
            setFbt('ng')
            setTimeout(()=>{
              doSkip()
            }, 700)
            return
          }
        }
        if(quizMode === 'subjective'){
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

          await supabase.rpc('update_genre_stats', {
            p_user_id: String(currentUser.userId),
            p_character_id: selChar,
            p_genre: m.final_genre || '기타',
            p_is_correct: false,
            p_score: 0
          })

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


  async function doSkip(){
    if(screen !== 'quiz') return
    if(answered || isSubmitting) return
    if(!currentUser?.userId) return
    if(skipLockRef.current) return
    
    skipLockRef.current = true
    setIsSubmitting(true)
    setComboStreak(0)
    setMode(null)

    const m = pool[qi]

    if(!m){
      setIsSubmitting(false)
      skipLockRef.current = false
      return
    }

    const willDie = (currentUser?.lives ?? 30) <= 1

    setUsers(prev => {
      const updated = prev.map(u => {
        if(u.charId === selChar){
          const prevLives = u.lives ?? 30
          const nextLives = prevLives - 1

          if(nextLives < prevLives){
            setLifeDelta(-1)   // 🔥 핵심
          }
          if(nextLives <= 0){
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

      localStorage.setItem('cineclue_users', JSON.stringify(updated))
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

    await supabase.rpc('update_genre_stats', {
      p_user_id: String(currentUser.userId),
      p_character_id: selChar,
      p_genre: genreValue,
      p_is_correct: false,
      p_score: 0
    })

    setResults(r => [...r, {
      ...m,
      correct: false,
      hintUsed: 0,
      score: 0,
      country: m.country,
      genre: m.final_genre || '',
      grade: primaryGrade
    }])

    if(willDie){
      await saveLog({
        supabase,
        userId: String(currentUser.userId),
        charId: selChar,
        movie: { id: null },
        hintUsed: 0,
        score: score,
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


  function nextH(){
    if(sh < 5){
      setSh(v => v + 1)
      setFb('')
      setFbt('')
    } else {
      if(
        quizMode === 'choice'
        && wrongCount < 2
      ){
        return
      }
      doSkip()
    }
  }


  function nextQ(){

    inputRef.current?.blur()
    skipLockRef.current = false
    setProgress(0)
    setButtonActive(false)
    setShowAnswers(false) 
    setShowSynopsis(false)
    setShowReportMenu(false)

    if(currentUser?.isDead){
    return
    }
    if(qi + 1 >= pool.length){
      const currentRound = results.slice(-5)
      const isPerfect =
      currentRound.length === 5 &&
      currentRound.every(r => r.correct)
      if(isPerfect){
        const user = users.find(u => u.charId === selChar)
        const prevLives = user?.lives ?? 30
        // 🔥 30 미만일 때만 예약
        if(prevLives < 30){
          setPendingLifeDelta(5)
        }
        setUsers(prev => {
          const updated = prev.map(u => {
            if(u.charId === selChar){
              return {
                ...u,
                lives: Math.min((u.lives ?? 30) + 5, 30)
              }
            }
            return u
          })
          localStorage.setItem('cineclue_users', JSON.stringify(updated))
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

  }

  useEffect(()=>{
    if(!pool?.length) return

    async function preloadCurrentMovie(){

      const movie = pool[qi]

      if(!movie) return

      // 이미 불러왔으면 패스

      if(movie.tmdbLoaded) return

      try{

        const tmdb = await loadTMDB(movie)

        setPool(prev =>

          prev.map((m, idx) => {

            if(idx !== qi) return m

            return {

              ...m,

              tmdbLoaded:true,

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

      }catch(e){

        console.error(

          'TMDB preload 실패',

          e

        )

      }

    }

    preloadCurrentMovie()

  }, [pool, qi])


  function enterGame(){
    if(!selChar) return

    const u = users.find(x=>x.charId===selChar)

    if(!u){
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

  function saveNickname(){
    if(!nickname.trim()) return

    const newUser = {
      charId: tempChar,
      nickname,
      score: 0,
      lives: 15,
      userId: Date.now().toString()
    }

    const updated = [...users, newUser]
    setUsers(updated)
    localStorage.setItem('cineclue_users', JSON.stringify(updated))

    setShowNameModal(false)
    setNickname('')
  }

  // 👉캐릭터 대화명 지우기
  function deleteUser(charId){

    const ok = confirm('대화명과 점수가 초기화됩니다. 계속할까요?')

    if(!ok) return   // ❌ 취소하면 종료

    const updated = users.filter(u => u.charId !== charId)

    setUsers(updated)
    localStorage.setItem('cineclue_users', JSON.stringify(updated))

    if(selChar === charId){
      setSelChar(null)
    }
  }





  return (
    <>
      {/* 인트로화면 */}
      {screen === 'intro' && (
       <IntroScreen onEnter={()=>setScreen('char')} />
      )}






      {/* 🔥 Death Overlay (항상 최상단) */}
      {deathMessage && (screen === 'quiz' || screen === 'result') && (
        <div style={{
          position:'fixed',
          top:0,
          left:0,
          width:'100%',
          height:'100%',
          background:'rgba(0,0,0,0.85)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          zIndex:9999
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

      {/* 화면 1: 캐릭터 선택 화면 */}

      {screen === 'char' && (
        <AppLayout>
          <div style={{

            width:'100%',

            background:'#fff',

            position:'relative',

            display:'flex',

            height:'100dvh',

            flexDirection:'column',

            padding:'48px 0 40px',

            overflowY:'auto'

          }}>
                      <div style={{
              position:'absolute',
              top:20,
              right:24,
              zIndex:20
            }}>
              <button
                onClick={()=>setShowSettings(true)}
                style={{
                  width:32,
                  height:32,
                  border:'none',
                  background:'transparent',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  cursor:'pointer',
                  padding:0
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#b0aaa3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0A1.65 1.65 0 0 0 20.91 10H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </button>
              {showSettings && (
              <>
                {/* 배경 클릭 닫기 */}
                <div
                  onClick={()=>setShowSettings(false)}
                  style={{
                    position:'fixed',
                    inset:0,
                    background:'rgba(0,0,0,0.18)',
                    zIndex:90
                  }}
                />
                  {/* 메뉴 */}
                  <div style={{
                    position:'absolute',
                    top:34,
                    right:0,
                    width:220,
                    background:'#fff',
                    border:'1px solid #ece8e2',
                    borderRadius:18,
                    overflow:'hidden',
                    boxShadow:'0 10px 30px rgba(0,0,0,0.08)',
                    zIndex:100,
                    animation:'menuFade .18s ease'
                  }}>
                    {[
                      '소개',
                      '게임 규칙',
                      '이메일',
                      '개인정보 처리방침',
                      '신고하기'
                    ].map((item,i)=>(
                      <div
                        key={i}
                        onClick={()=>{
                          setSettingsPage(item)
                        }}
                        style={{
                          padding:'14px 16px',
                          fontSize:'0.82rem',
                          fontWeight:600,
                          color:'#1a1814',
                          borderBottom:
                            i !== 3
                              ? '1px solid #f3f0eb'
                              : 'none',
                          cursor:'pointer',
                          background:'#fff'
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {settingsPage && (
                <div style={{
                  position:'fixed',
                  inset:0,
                  background:'rgba(0,0,0,0.28)',
                  zIndex:120,
                  display:'flex',
                  justifyContent:'center',
                  alignItems:'center'
                }}>

                  <div style={{
                    width:'88%',
                    maxWidth:420,
                    background:'#fff',
                    borderRadius:22,
                    padding:'24px 20px',
                    boxShadow:'0 20px 40px rgba(0,0,0,0.12)',
                    position:'relative'
                  }}>

                    {/* 닫기 */}
                    <button
                      onClick={()=>setSettingsPage(null)}
                      style={{
                        position:'absolute',
                        top:14,
                        right:14,
                        border:'none',
                        background:'transparent',
                        fontSize:'1.2rem',
                        color:'#999',
                        cursor:'pointer'
                      }}
                    >
                      ×
                    </button>

                    {/* 제목 */}
                    <div style={{
                      fontSize:'1rem',
                      fontWeight:800,
                      marginBottom:18,
                      color:'#1a1814'
                    }}>
                      {settingsPage}
                    </div>

                    {/* 내용 */}
                    {settingsPage === '소개' && (
                      <div style={{
                        fontSize:'0.82rem',
                        lineHeight:1.8,
                        color:'#5f5a55'
                      }}>
                        <div style={{
                          fontSize:'1.2rem',
                          fontWeight:900,
                          marginBottom:14,
                          color:'#1a1814'
                        }}>
                          CineCLUE
                        </div>

                        영화를 기억하는 방식은
                        제목보다 장면에 가깝습니다.

                        <br/><br/>

                        CineCLUE는
                        장면의 단서를 통해 영화를 맞히는
                        영화 퀴즈 게임입니다.
                      </div>
                    )}

                    {settingsPage === '게임 규칙' && (
                      <div style={{
                        fontSize:'0.82rem',
                        lineHeight:1.9,
                        color:'#5f5a55'
                      }}>
                        • 힌트를 보고 영화 제목을 맞혀보세요.
                        <br/>
                        • 주관식과 객관식 모드를 선택할 수 있습니다.
                        <br/>
                        • 주관식모드는 한글자 또는 초성을 힌트로 제공합니다.
                        <br/>
                        • 연속 정답 시 콤보 보너스가 적용됩니다.
                        <br/>
                        • 목숨이 모두 소진되면 캐릭터가 사망합니다.
                        <br/>
                        • 캐릭터를 삭제하여도 랭킹에는 기록이 남습니다.
                      </div>
                    )}

                    {settingsPage === '이메일' && (
                      <div style={{
                        fontSize:'0.82rem',
                        lineHeight:1.8,
                        color:'#5f5a55'
                      }}>
                        Contact Us
                        <br/>
                        cinecluegame@gmail.com
                      </div>
                    )}

                    {settingsPage === '개인정보 처리방침' && (
                      <div style={{
                        fontSize:'0.82rem',
                        lineHeight:1.9,
                        color:'#5f5a55'
                      }}>
                        CineCLUE는 게임 진행 및 랭킹 제공을 위해
                        일부 데이터를 저장할 수 있습니다.

                        <br/><br/>

                        저장될 수 있는 정보:
                        <br/>
                        • 닉네임
                        <br/>
                        • 게임 기록 및 점수
                        <br/>
                        • 랭킹 정보
                        <br/>
                        • 로그인 정보(추후 지원 시)

                        <br/>

                        게스트 플레이의 경우 일부 데이터는
                        브라우저 저장소에 저장될 수 있습니다.
                        <br/>
                        CineCLUE는 서비스 개선 및 광고 제공을 위해
                        외부 서비스를 사용할 수 있습니다.

                        <br/><br/>

                        사용될 수 있는 서비스:
                        <br/>
                        • Supabase
                        <br/>
                        • Vercel
                        <br/>
                        • Google AdMob
                        <br/>
                        • TMDB API
                      </div>
                    )}

                    {settingsPage === '신고하기' && (
                      <div style={{
                        fontSize:'0.82rem',
                        lineHeight:1.8,
                        color:'#5f5a55'
                      }}>
                        힌트오류 / 제목오류는 퀴즈화면 내 신고버튼을 이용해주세요. <br/>
                        기타 신고사항은 이메일을 이용해주시기 바랍니다. 
                      </div>
                    )}

                  </div>
                </div>
              )}
             
            
            </div>
            <div style={{textAlign:'center',marginBottom:40}}>
              <div style={{fontSize:'2.6rem',fontWeight:900,letterSpacing:'-1px',lineHeight:1,color:'#1a1814'}}>
                Cine <span style={{color:'#e8808c'}}>CLUE</span>
              </div>
              <div style={{fontSize:'0.75rem',color:'#b0aaa3',letterSpacing:'0.25em',marginTop:8,textTransform:'uppercase',fontWeight:500}}>
                Follow the clues
              </div>
            </div>

            <div style={{padding:'0 20px'}}>
              <div style={{fontSize:'0.7rem',fontWeight:700,color:'#b0aaa3',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:14}}>
                캐릭터를 선택하세요
              </div>

              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20}}>
                {CHARS.map((c) => {
                  const sel = selChar===c.id
                  const u = users.find(x=>x.charId===c.id)

                  return (
                    <div
                      key={c.id}
                      onClick={()=>handleCharClick(c.id)}
                      style={{
                        borderRadius:18,
                        border:sel?`3px solid ${c.color}`:'1.5px solid #e8e4dd',
                        background:sel?`${c.color}18`:'#faf9f7',
                        padding:'16px 6px 12px',
                        display:'flex',
                        flexDirection:'column',
                        alignItems:'center',
                        gap:8,
                        cursor: u?.isDead ? 'pointer' : 'pointer',
                        transition:'all .18s cubic-bezier(.34,1.56,.64,1)',
                        boxShadow:sel?`0 6px 22px ${c.color}50`:'0 1px 4px rgba(0,0,0,0.06)',
                        transform: sel && !u?.isDead ? 'scale(1.06)' : 'scale(1)',
                        position:'relative'
                    }}>
                      <div style={{
                        width:'100%',
                        display:'flex',
                        flexDirection:'column',
                        alignItems:'center',
                        gap:8,
                        opacity: u?.isDead ? 0.45 : 1,
                        filter: u?.isDead ? 'grayscale(100%)' : 'none',
                      }}>
                        {sel && !u?.isDead && (
                          <div style={{
                            position:'absolute',
                            top:8,
                            right:8,
                            width:18,
                            height:18,
                            borderRadius:'50%',
                            background:c.color,
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center'
                          }}>
                            <span style={{color:'#fff',fontSize:'0.95rem',fontWeight:900}}>✓</span>
                          </div>
                        )}
                        {u?.isDead && (
                          <div style={{
                            position:'absolute',
                            top:6,
                            right:6,
                            zIndex:5,
                            filter:'drop-shadow(0 1px 2px rgba(0,0,0,0.4))'
                          }}>
                            <svg width="28" height="65" viewBox="0 0 24 24">
                              {/* 무덤 */}
                              <path
                                d="M6 20V10C6 7 8 5 12 5C16 5 18 7 18 10V20H6Z"
                                fill="#aa9e9e"
                              />
                              {/* 십자가 세로 */}
                              <rect x="11" y="8" width="2" height="14" fill="#000000"/>
                              {/* 십자가 가로 */}
                              <rect x="9" y="10" width="6" height="2" fill="#000000"/>
                              {/* 바닥 */}
                              <rect x="5" y="20" width="14" height="2" fill="#717171"/>
                            </svg>
                          </div>
                        )}
                        <svg viewBox="0 0 80 80" fill="none" style={{width:56,height:56}}>
                          {c.svg.props.children}
                        </svg>
                        <div style={{
                          fontSize:'0.7rem',
                          fontWeight:700,
                          color:sel?c.color:'#6f6e6e',
                          textAlign:'center',
                          lineHeight:1.3,
                        }}>
                          {u ? u.nickname : c.name}
                          <div style={{
                            fontSize:'0.6rem',
                            fontWeight:500,
                            marginTop:2,
                            color:'#72685e'
                          }}>
                            {u ? (u.score || 0) : ''}
                          </div>
                        </div>
                      </div>
                        {u && (
                          <div
                            onClick={(e)=>{
                              e.stopPropagation()
                              if(u.isDead){
                                // 🔥 부활 처리 (여기!)
                                setUsers(prev => {
                                  const updated = prev.map(x => {
                                    if(x.charId === c.id){
                                      return {
                                        ...x,
                                        lives: 15,       // 🔥 부활 시 10
                                        isDead: false
                                      }
                                    }
                                    return x
                                  })
                                  localStorage.setItem('cineclue_users', JSON.stringify(updated))
                                  return updated
                                })
                              } else{
                                deleteUser(c.id)
                              }
                            }}
                            style={{
                              position:'absolute',
                              top:8,
                              left:8,
                              fontSize:11,
                              background: u.isDead ? '#e8808c' : '#b8b4ae',
                              color:'#ffffff',
                              borderRadius:6,
                              padding:'2px 6px',
                              cursor:'pointer',
                              zIndex:10
                          }}>
                          {u.isDead ? '♥' : '✕'}
                        </div>
                      )}
                    </div>
                  ) 
                })}
              </div>

              {/* 입장하기 버튼 */}
              <button
                onClick={enterGame}
                disabled={!users.find(u=>u.charId===selChar)}
                style={{
                  width:'100%',
                  height:54,
                  borderRadius:14,
                  background:users.find(u=>u.charId===selChar)?'#ed4b5e':'#bbbbbb',
                  color:'#ffffff',
                  fontSize:'0.8rem',
                  fontWeight:700,
                  border:'none',
                  cursor:users.find(u=>u.charId===selChar)?'pointer':'default'
                }}>
                입장하기
              </button>
            </div>

            {/* 닉네임 입력 모달 */}
            {showNameModal && (
              <div style={{
                position:'fixed',
                inset:0,
                background:'rgba(0,0,0,0.5)',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                zIndex:9999
              }}>
                <div style={{
                  width:300,
                  background:'#fff',
                  borderRadius:16,
                  padding:20
                }}>
                  <div style={{fontSize:'0.9rem',fontWeight:700,marginBottom:10}}>
                    대화명 입력
                  </div>

                  <input
                    value={nickname}
                    onChange={(e)=>{
                      if(e.target.value.length<=10){
                        setNickname(e.target.value)
                      }
                    }}
                    placeholder="최대 10자"
                    style={{
                      width:'100%',
                      height:44,
                      borderRadius:10,
                      border:'1.5px solid #e8e4dd',
                      padding:'0 12px',
                      marginBottom:12
                    }}/>

                  <div style={{display:'flex',gap:8}}>
                    <button
                      onClick={()=>setShowNameModal(false)}
                      style={{
                        flex:1,
                        height:40,
                        borderRadius:10,
                        background:'#eee',
                        border:'none'
                      }}>
                      취소
                    </button>

                    <button
                      onClick={saveNickname}
                      style={{
                        flex:1,
                        height:40,
                        borderRadius:10,
                        background:'#1a1814',
                        color:'#fff',
                        border:'none'
                      }}>
                      완료
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </AppLayout>
      )}





    
      {/* 화면 2: 게임 모드 선택 화면 */}
      {screen==='grade' && (
        <AppLayout>
          <div style={{
            width:'100%',
            background:'#fff',
            position:'relative',
            display:'flex',
            height:'100dvh',
            flexDirection:'column',
            padding:'48px 0 40px',
            overflowY:'auto'

          }}>
            <div style={{
              position:'absolute',
              top:20,
              right:24,
              zIndex:20
            }}>
              <button
                onClick={()=>setShowSettings(true)}
                style={{
                  width:32,
                  height:32,
                  border:'none',
                  background:'transparent',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  cursor:'pointer',
                  padding:0
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#b0aaa3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0A1.65 1.65 0 0 0 20.91 10H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </button>
              {showSettings && (
              <>
                {/* 배경 클릭 닫기 */}
                <div
                  onClick={()=>setShowSettings(false)}
                  style={{
                    position:'fixed',
                    inset:0,
                    background:'rgba(0,0,0,0.18)',
                    zIndex:80
                  }}
                />
                {/* 메뉴 */}
                <div style={{
                  position:'absolute',
                  top:34,
                  right:0,
                  width:220,
                  background:'#fff',
                  border:'1px solid #ece8e2',
                  borderRadius:18,
                  overflow:'hidden',
                  boxShadow:'0 10px 30px rgba(0,0,0,0.08)',
                  zIndex:200,
                  animation:'menuFade .18s ease'
                }}>
                  {[
                    '소개',
                    '게임 규칙',
                    '이메일',
                    '개인정보 처리방침',
                    '신고하기'
                  ].map((item,i)=>(
                    <div
                      key={i}
                      onClick={()=>{
                        setSettingsPage(item)
                        setShowSettings(false)
                      }}
                      style={{
                        padding:'14px 16px',
                        fontSize:'0.82rem',
                        fontWeight:600,
                        color:'#1a1814',
                        borderBottom:
                          i !== 3
                            ? '1px solid #f3f0eb'
                            : 'none',
                        cursor:'pointer',
                        background:'#fff'
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </>
              )}
              {settingsPage && (
                <div style={{
                  position:'fixed',
                  inset:0,
                  background:'rgba(0,0,0,0.28)',
                  zIndex:120,
                  display:'flex',
                  justifyContent:'center',
                  alignItems:'center'
                }}>

                  <div style={{
                    width:'88%',
                    maxWidth:420,
                    background:'#fff',
                    borderRadius:22,
                    padding:'24px 20px',
                    boxShadow:'0 20px 40px rgba(0,0,0,0.12)',
                    position:'relative'
                  }}>

                    {/* 닫기 */}
                    <button
                      onClick={()=>setSettingsPage(null)}
                      style={{
                        position:'absolute',
                        top:14,
                        right:14,
                        border:'none',
                        background:'transparent',
                        fontSize:'1.2rem',
                        color:'#999',
                        cursor:'pointer'
                      }}
                    >
                      ×
                    </button>

                    {/* 제목 */}
                    <div style={{
                      fontSize:'1rem',
                      fontWeight:800,
                      marginBottom:18,
                      color:'#1a1814'
                    }}>
                      {settingsPage}
                    </div>

                    {/* 내용 */}
                    {settingsPage === '소개' && (
                      <div style={{
                        fontSize:'0.82rem',
                        lineHeight:1.8,
                        color:'#5f5a55'
                      }}>
                        <div style={{
                          fontSize:'1.2rem',
                          fontWeight:900,
                          marginBottom:14,
                          color:'#1a1814'
                        }}>
                          CineCLUE
                        </div>

                        영화를 기억하는 방식은
                        제목보다 장면에 가깝습니다.

                        <br/><br/>

                        CineCLUE는
                        장면의 단서를 통해 영화를 맞히는
                        영화 퀴즈 게임입니다.

                      </div>
                    )}

                    {settingsPage === '게임 규칙' && (
                      <div style={{
                        fontSize:'0.82rem',
                        lineHeight:1.9,
                        color:'#5f5a55'
                      }}>
                        • 힌트를 보고 영화 제목을 맞혀보세요.
                        <br/>
                        • 주관식과 객관식 모드를 선택할 수 있습니다.
                        <br/>
                        • 주관식모드는 한글자 또는 초성을 힌트로 제공합니다.
                        <br/>
                        • 연속 정답 시 콤보 보너스가 적용됩니다.
                        <br/>
                        • 목숨이 모두 소진되면 캐릭터가 사망합니다.
                        <br/>
                        • 캐릭터를 삭제하여도 랭킹에는 기록이 남습니다.
                      </div>
                    )}

                    {settingsPage === '이메일' && (
                      <div style={{
                        fontSize:'0.82rem',
                        lineHeight:1.8,
                        color:'#5f5a55'
                      }}>
                        Contact Us
                        <br/>
                        cinecluegame@gmail.com
                      </div>
                    )}

                    {settingsPage === '개인정보 처리방침' && (
                      <div style={{
                        fontSize:'0.82rem',
                        lineHeight:1.9,
                        color:'#5f5a55'
                      }}>
                        CineCLUE는 게임 진행 및 랭킹 제공을 위해
                        일부 데이터를 저장할 수 있습니다.

                        <br/><br/>

                        저장될 수 있는 정보:
                        <br/>
                        • 닉네임
                        <br/>
                        • 게임 기록 및 점수
                        <br/>
                        • 랭킹 정보
                        <br/>
                        • 로그인 정보(추후 지원 시)

                        <br/>

                        게스트 플레이의 경우 일부 데이터는
                        브라우저 저장소에 저장될 수 있습니다.
                        <br/>
                        CineCLUE는 서비스 개선 및 광고 제공을 위해
                        외부 서비스를 사용할 수 있습니다.

                        <br/><br/>

                        사용될 수 있는 서비스:
                        <br/>
                        • Supabase
                        <br/>
                        • Vercel
                        <br/>
                        • Google AdMob
                        <br/>
                        • TMDB API

                      </div>
                    )}

                    {settingsPage === '신고하기' && (
                      <div style={{
                        fontSize:'0.82rem',
                        lineHeight:1.8,
                        color:'#5f5a55'
                      }}>
                        힌트오류 / 제목오류는 퀴즈화면 내 신고버튼을 이용해주세요. <br/>
                        기타 신고사항은 이메일을 이용해주시기 바랍니다. 
                        
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
            <div style={{padding:'0 20px',flexShrink:0}}>
              <div style={{
                fontSize:'0.7rem',
                fontWeight:700,
                color:'#6f6e6e',
                letterSpacing:'0.15em',
                textTransform:'uppercase',
                marginBottom:14
              }}>
                도전할 모드를 선택하세요.
              </div>
              <div style={{display:'flex', gap:8, marginBottom:16}}>
                <button
                  onClick={()=>setQuizMode('subjective')}
                  style={{
                    flex:1,
                    height:40,
                    borderRadius:10,
                    background:quizMode==='subjective'?'#414141':'#eee',
                    color:quizMode==='subjective'?'#fff':'#6f6e6e',
                    fontWeight:700
                  }}>
                  주관식
                </button>
                <button
                  onClick={()=>setQuizMode('objective')}
                  style={{
                    flex:1,
                    height:40,
                    borderRadius:10,
                    background:quizMode==='objective'?'#414141':'#eee',
                    color:quizMode==='objective'?'#fff':'#6f6e6e',
                    fontWeight:700
                  }}>
                  객관식
                </button>
              </div>


              {/* 스크롤 영역 */}

              <div style={{
                flex:1,
                overflowY:'auto',
                padding:'10px 5px 5px'
              }}>

                <div style={{
                  display:'grid',
                  gridTemplateColumns:'repeat(3,1fr)',
                  gap:10,
                  marginBottom:16
                }}>
                  {ERA_MODES.map(m => {
                    const sel = selGrade === m.key
                    return (
                      <div
                        key={m.key}
                        onClick={()=>toggleGrade(m.key)}
                        style={{
                          height:80,
                          borderRadius:16,
                          overflow:'hidden',
                          position:'relative',
                          cursor:'pointer',
                          transform: sel ? 'scale(1.05)' : 'scale(1)',
                          boxShadow: sel
                            ? '0 6px 18px rgba(0,0,0,0.2)'
                            : '0 2px 6px rgba(0,0,0,0.08)'
                        }}
                      >
                        <img
                          src={m.image}
                          style={{
                            width:'100%',
                            height:'100%',
                            objectFit:'cover'
                          }}
                        />
                        {sel && (
                          <div style={{
                            position:'absolute',
                            inset:0,
                            border:'3px solid rgba(255, 0, 0, 0.9)',
                            borderRadius:16,
                            pointerEvents:'none'
                          }}/>
                        )}
                      </div>
                    )
                  })}
                </div>
                {/* 🔥 테마 */}
                <div style={{
                  display:'grid',
                  gridTemplateColumns:'repeat(3,1fr)',
                  gap:10,
                }}>
                  {THEME_MODES.map(m => {
                    const sel = selGrade === m.key
                    return (
                      <div
                        key={m.key}
                        onClick={()=>toggleGrade(m.key)}
                        style={{
                          height:80,
                          borderRadius:16,
                          overflow:'hidden',
                          position:'relative',
                          cursor:'pointer',
                          transform: sel ? 'scale(1.05)' : 'scale(1)',
                          boxShadow: sel
                            ? '0 6px 18px rgba(0,0,0,0.2)'
                            : '0 2px 6px rgba(0,0,0,0.08)'
                        }}
                      >
                        <img
                          src={m.image}
                          style={{
                            width:'100%',
                            height:'100%',
                            objectFit:'cover'
                          }}
                        />
                        {sel && (
                          <div style={{
                            position:'absolute',
                            inset:0,
                            border:'3px solid rgba(255, 0, 0, 0.9)', 
                            borderRadius:16,
                            pointerEvents:'none'
                          }}/>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 버튼 영역 */}
              <div style={{
                padding:'20px 0 0',
                display:'flex',
                flexDirection:'row',
                gap:10,
                flexShrink:0,
                background:'#fff'
              }}>

                {/* 퀴즈시작 버튼 */}
                <button
                  style={{
                    flex:1,
                    height:54,
                    borderRadius:14,
                    background: selGrade !== null && !loading ? '#ed4b5e' : '#d4d0cc',
                    color:'#fff',
                    fontSize:'0.8rem',
                    fontWeight:700,
                    border:'none',
                    cursor: selGrade !== null && !loading ? 'pointer' : 'default'
                  }}
                  disabled={selGrade === null || loading}
                  onClick={()=>loadMovies()}>

                  {loading ? '로딩 중...' : '퀴즈시작'}
                </button> 

                {/* 뒤로가기 버튼 */}
                <button
                  style={{
                    flex:1,
                    height:54,
                    borderRadius:12,
                    background:'transparent',
                    color:'#6e6e6e',
                    fontSize:'0.8rem',
                    fontWeight:500,
                    border:'1.5px solid #e8e4dd',
                    cursor:'pointer'
                  }}
                  onClick={()=>setScreen('char')}>
                  캐릭터 선택
                </button>
              </div>
            </div>
          </div>
        </AppLayout>
      )}





  
      {/* 화면 3: 퀴즈 화면 */}
      {screen === 'quiz' && (
        // 퀴즈화면 로딩시 스피너 노출
        (loading || !pool || pool.length === 0 || !pool[qi]) ? (
          <div style={{
            height:'100vh',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            background:'#fff'
          }}>
            <CharacterSpinner />
          </div>
        ): (() => {
          // 퀴즈화면 pool 선언 후 시작
          const m = pool[qi]
          const currentMode = MODES.find(mode => mode.key === selGrade)
          const basePoint = getPts(mode)

          return (
            <AppLayout>
              <div style={{
                width:'100%',
                background:'#fff',
                display:'flex',
                flexDirection:'column',
                flex:1,
                height:'100dvh',
                overflow:'hidden'
              }}>

                {/*퀴즈화면 시작시 스피너 사라짐*/}
                {showSpinner && (
                  <CharacterSpinner fadeOut={!showSpinner}/>
                )}

                {/* 헤더 영역 */}
                <div style={{
                  background:'#fff',
                  borderBottom:'1px solid #f0ece6',
                  padding:'14px 20px 10px',
                  flexShrink:0,
                  position:'relative',
                  zIndex:20 
                }}>

                  {/* 1️⃣ 상단 영역 */}
                  <div style={{
                    display:'flex',
                    alignItems:'center',
                    width:'100%',
                    marginBottom:6
                  }}>

                    {/* 캐릭터 / 포인트 영역 */}
                    <div style={{position:'relative', width:42, height:42}}>

                      {/* 🔥 life 변화 표시 (추가) */}
                      {lifeDelta !== null && (
                        <div style={{
                          position:'absolute',
                          top:-6,
                          right:-6,
                          fontSize:'0.7rem',
                          fontWeight:900,
                          padding:'2px 6px',
                          borderRadius:10,
                          color:
                            lifeDelta === -1 ? '#ff3b3b' :
                            lifeDelta === 5 ? '#4caf50' :
                            '#434343',
                          animation:'popLife 0.8s ease forwards',
                          pointerEvents:'none',
                          zIndex:10,
                          textShadow:'0 1px 2px rgba(0,0,0,0.35)'
                        }}>
                          {lifeDelta > 0 ? `+${lifeDelta}` : lifeDelta}
                        </div>
                      )}

                      {/* 목숨 링 */}
                      <svg width="42" height="42" style={{
                        position:'absolute',
                        top:0,
                        left:0
                      }}>

                        {/* 배경 */}
                        <circle
                          cx="21"
                          cy="21"
                          r="18"
                          stroke="#eee"
                          strokeWidth="5"
                          fill="none"
                        />
                      
                        {/* 🔥 실제 게이지 + 깜빡임 (하나로 합침) */}
                        <circle
                          cx="21"
                          cy="21"
                          r="18"
                          stroke={lives <= 3 ? '#ff3b3b' : '#4caf50'}
                          strokeWidth="5"
                          fill="none"
                          strokeDasharray={113}
                          strokeDashoffset={113 * (1 - lives / 30)}
                          strokeLinecap="round"
                          style={{
                            transition:'all 0.3s ease',
                            animation: lives <= 3 ? 'blinkRed 0.8s infinite' : 'none'
                          }}
                        />
                      </svg>

                      {/* 🔥 캐릭터 (중앙 정렬 핵심) */}
                      <div style={{
                        position:'absolute',
                        top:'50%',
                        left:'50%',
                        transform:'translate(-50%, -50%)'
                      }}>
                        <CharAvatar charId={selChar} size={34}/>
                      </div>
                    </div>

                    {/* 닉네임과 게임모드 */}
                    <div style={{
                      flex:1,
                      marginLeft:8,
                      display:'flex',
                      flexDirection:'column',
                      justifyContent:'center',
                      gap:2
                    }}>
                      <div style={{
                        fontSize:'0.62rem',
                        fontWeight:700,
                        color:'#5c5b5a',
                        letterSpacing:'0.04em'
                      }}>
                        [{currentMode?.label}]
                      </div>
                      <div style={{
                        fontSize:'0.78rem',
                        fontWeight:800,
                        color:'#1a1814',
                        lineHeight:1.1
                      }}>
                        {users.find(u=>u.charId===selChar)?.nickname || 'USER'}
                      </div>
                    </div>

                    {/* 퀴즈점수 */}
                    <div style={{
                      fontSize:'0.9rem',
                      fontWeight:900,
                      color:'#ff6b7a',
                      whiteSpace:'nowrap'
                    }}>
                      {basePoint}pt
                    </div>
                  </div>


                  {/* 2️⃣ 버블영역 */}
                  <div style={{
                    display:'flex',
                    alignItems:'center',
                    gap:6,            
                    whiteSpace:'nowrap',
                    width:'100%'
                  }}>

                    {/* 문제 번호 */}
                    <span style={{
                      fontSize:'0.7rem',
                      fontWeight:700,
                      padding:'3px 9px',
                      borderRadius:20,
                      background:'#f5f3ef',
                      color:'#6b6560',
                      border:'1px solid #e8e4dd',
                      width:42,
                      textAlign:'center',
                      flexShrink:0
                    }}>
                      {qi+1}/5
                    </span>

                    {/* 연도 */}
                    {m.year && (
                      <span style={{
                        fontSize:'0.7rem',
                        fontWeight:700,
                        padding:'3px 0',
                        borderRadius:20,
                        background:'#f5a3a3',
                        color:'#fff',
                        width:48,
                        textAlign:'center',
                        flexShrink:0
                      }}>
                        {m.year}
                      </span>
                    )}

                    {/* 국가 */}
                    {m.country && (
                      <span style={{
                        fontSize:'0.7rem',
                        fontWeight:700,
                        padding:'3px 10px',
                        borderRadius:20,
                        background:'#e8f0fc',
                        color:'#3a6abf',
                        border:'1px solid #c0d4f8',
                        flexShrink:0   // 🔥 추가
                      }}>
                        {m.country}
                      </span>
                    )}

                    {/* 장르 */}
                    {m.final_genre && (
                      <span style={{
                        fontSize:'0.7rem',
                        fontWeight:700,
                        padding:'3px 10px',
                        borderRadius:20,
                        background:'#e8f5ee',
                        color:'#2e8a52',
                        border:'1px solid #a8dfc0',
                        flexShrink:0
                      }}>
                        {m.final_genre}
                      </span>
                    )}

                    {/* 수상내역 */}
                    {m.awards && (() => {
                      try {
                        const arr = JSON.parse(m.awards)
                        if (!arr.length) return null
                        return (
                          <span style={{
                            fontSize:'0.7rem',
                            fontWeight:700,
                            padding:'3px 10px',
                            borderRadius:20,
                            background:'#fff3e0',
                            color:'#cc7a00',
                            border:'1px solid #ffd8a8',  
                            whiteSpace:'nowrap',          
                            overflow:'hidden',            
                            textOverflow:'ellipsis',
                            flexShrink:1,
                            maxWidth:120
                          }}>
                            {arr[0]}
                          </span>
                        )   
                      } catch {
                      return null
                      }
                    })()}
                  </div>
                </div> 

                {/* 콤보배너 영역*/}
                {mode && (
                  <div style={{
                    margin:'8px 16px 0',
                    borderRadius:10,
                    position:'relative',
                    overflow:'hidden',
                    padding:'7px 14px',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'space-between',
                    background:
                      mode==='good'  ? '#fff7e6' :
                      mode==='wow'   ? '#fff0f0' :
                      mode==='crazy' ? '#f3e8ff' : '#fff',

                    border: `1px solid ${
                      mode==='good'  ? '#f0c36d' :
                      mode==='wow'   ? '#f0b4b4' :
                      mode==='crazy' ? '#c8a8ff' : '#eee'
                      }`,
                    flexShrink:0
                  }}>

                    <div style={{
                      position:'absolute',  
                      inset:0,  
                      borderRadius:10,  
                      zIndex:0, 
                      opacity:0.6,  
                      filter:'blur(10px)',  
                      background: 
                        mode==='good'  ? '#ffe08a' :  
                        mode==='wow'   ? '#ff9e9e' :  
                        mode==='crazy' ? '#b388ff' : 'transparent', 
                      animation:  
                        mode==='good'  ? 'glowPulse 1.2s ease-in-out infinite' :  
                        mode==='wow'   ? 'glowPulse 0.8s ease-in-out infinite' :  
                        mode==='crazy' ? 'glowPulse 0.4s ease-in-out infinite' :  
                        'none'  
                    }}/>
                    <span style={{
                      position:'relative',
                      zIndex:1,
                      fontSize:'0.72rem',
                      fontWeight:800,
                      color:
                        mode==='good' ? '#c8a84a' :
                        mode==='wow' ? '#d45c5c' :
                        mode==='crazy' ? '#9b5cff' :
                        '#aaa'
                    }}>
                      {
                        mode==='good' ? '👍 어? 좀 치는데? 이제 시작이다 그대로 달리자 !!':
                        mode==='wow' ? '💀 뇌야 돌아라!! 손아 날아라!! 이건 끝까지 간다!! 💀':
                        mode==='crazy' ? '🔥 미친 상승감!!! 제니퍼 로페즈 아나콘다!! 스스메!! 🔥':
                        ''
                      }
                    </span>

                    <span style={{
                      fontSize:'0.68rem',
                      color:
                        mode==='good' ? '#342907' :
                        mode==='wow' ? '#630c0c' :
                        mode==='crazy' ? '#3b1678' :
                        '#aaa'
                    }}>
                      {comboStreak}연속 ×{
                        mode==='good' ? 3 :
                        mode==='wow' ? 4 :
                        mode==='crazy' ? 5 : 1
                      }
                    </span>
                  </div>
                )}

                {/* 주관식모드에서 한글자 힌트 효과 */}
                {quizMode === 'subjective' && (
                  <FlashLetterHint
                    title={m.title}
                    hintLevel={sh}
                    onFlash={setIsFlashing}
                  />
                )}

                {/* ── 스크롤 영역 ── */}
                <div
                ref={scrollRef}     
                style={{
                  flex:1,
                  minHeight:0,
                  overflowY:'auto',
                  pointerEvents:'auto',
                  WebkitOverflowScrolling:'touch',
                  padding:'12px 16px 24px',
                  overflowAnchor:'none',
                  scrollBehavior:'auto',
                  touchAction:'pan-y'
                }}>

                  {/* 힌트 리스트 영역 */}
                  {Array.from({ length: 5 }).map((_, i) => {
                    if (i >= sh) return null

                    const isCurrent = i === sh - 1

                    return (
                      <div
                        key={i}
                        style={{
                          animation:'hintSlideDown 0.9s ease'
                      }}>
                        <div style={{
                          borderRadius:13,
                          border:`1.5px solid ${isCurrent ? (g?.color || '#e8808c') : '#ece8e2'}`,
                          background:isCurrent ? (g?.bg || '#fff5f6') : '#fff',
                          padding:'13px 15px',
                          marginBottom:8
                        }}>
                          <div style={{display:'flex', alignItems:'center', gap:8}}>
                            <span style={{
                              width:28,
                              height:28,
                              borderRadius:'50%',
                              background:g?.color || '#e8808c',
                              color:'#fff',
                              fontSize:'0.65rem',
                              fontWeight:800,
                              display:'flex',
                              alignItems:'center',
                              justifyContent:'center',
                              flexShrink:0
                            }}>
                              {i + 1}
                            </span>

                            <div style={{
                              fontSize:'0.82rem',
                              lineHeight:1.7
                            }}>
                              {m.hintsArr?.[i] || '힌트 로딩중...'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* 하단 입력 & 버튼 영역 */}
                  <div style={{   
                    background:'#fff',
                    marginTop:16,
                    paddingBottom: '20px',
                    flexShrink:0
                  }}>
                    {fb && fbt!=='ok' && (
                      <div style={{
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'space-between',
                        marginBottom:8
                      }}>

                        {/* 메시지 */}
                        <div style={{
                          fontSize:'0.78rem',
                          fontWeight:700,
                          color:fbt==='ok'
                            ? '#4a9c6d'
                            : '#d45c5c'
                        }}>
                          {fb}
                        </div>

                        {/* 오답일 때만 신고 */}
                        {fbt==='sk' && (
                          <div style={{
                            position:'relative'
                          }}>
                            <button
                              onClick={() =>
                                setShowReportMenu(v => !v)
                              }
                              style={{
                                border:'none',
                                background:'transparent',
                                color:'rgba(226,7,7,0.72)',
                                fontSize:'1.2rem',
                                cursor:'pointer',
                                padding:2
                            }}>
                              ⚠
                            </button>

                            {showReportMenu && (
                              <div style={{
                                position:'absolute',
                                right:0,
                                bottom:'100%',
                                marginBottom:6,
                                background:'#fff',
                                border:'1px solid #ece8e2',
                                borderRadius:12,
                                overflow:'hidden',
                                boxShadow:'0 8px 24px rgba(0,0,0,0.08)',
                                zIndex:100,
                                minWidth:96
                              }}>
                                <button
                                  onClick={async()=>{
                                    setShowReportMenu(false)
                                    await supabase
                                      .from('hint_reports')
                                      .insert({
                                        movie_id:m.id,
                                        title:m.title,
                                        report_type:'title',
                                        user_id:String(currentUser.userId),
                                        nickname:currentUser.nickname
                                      })
                                    setShowReportToast(true)
                                      setTimeout(()=>{
                                        setShowReportToast(false)
                                      }, 1600)
                                  }}
                                  style={{
                                    width:'100%',
                                    border:'none',
                                    background:'#fff',
                                    padding:'10px 12px',
                                    fontSize:'0.74rem',
                                    textAlign:'left'
                                }}>
                                  제목 오류
                                </button>

                                <button
                                  onClick={async()=>{
                                    setShowReportMenu(false)
                                    await supabase
                                      .from('hint_reports')
                                      .insert({
                                        movie_id:m.id,
                                        title:m.title,
                                        report_type:'hint',
                                        user_id:String(currentUser.userId),
                                        nickname:currentUser.nickname
                                      })
                                      setShowReportToast(true)
                                      setTimeout(()=>{
                                        setShowReportToast(false)
                                      }, 1600)
                                  }}
                                  style={{
                                    width:'100%',
                                    border:'none',
                                    background:'#fff',
                                    padding:'10px 12px',
                                    fontSize:'0.74rem',
                                    textAlign:'left',
                                    borderTop:'1px solid #f2efea'
                                  }}>
                                    힌트 오류
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 정답영화 영역 */}
                    {!answered ? (
                      <>
                        {/* 힌트보기 & 넘기기 버튼 영역*/}
                        <div style={{display:'flex', gap:8, marginBottom:16}}>
                          <button
                            onClick={()=>{
                              const el = scrollRef.current
                              const prev = el.scrollHeight
                              nextH()
                              requestAnimationFrame(()=>{
                                el.scrollTop += el.scrollHeight - prev
                              })
                            }}
                            disabled={sh>=5 || lockChoice || isFlashing}
                            style={{
                              flex:1,
                              height:40,
                              borderRadius:10,
                              fontSize:'0.8rem',
                              background:'#f5f3ef',
                              opacity: (sh>=5 || lockChoice || isFlashing) ? 0.4 : 1,
                              pointerEvents: (sh>=5 || lockChoice || isFlashing) ? 'none' : 'auto'
                          }}>
                          다음 힌트
                          </button>

                          <button
                            onClick={doSkip}
                            style={{
                              flex:1,
                              height:40,
                              position: 'relative',
                              overflow: 'hidden',
                              padding: '12px 20px',
                              background: '#f5f3ef',
                              border: 'none',
                              borderRadius: '8px',
                              padding:0, 
                              transform: buttonActive ? 'scale(0.95)' : 'scale(1)',
                              transition: 'transform 0.1s ease'
                          }}>
                            <div
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                width: `${progress}%`,
                                background: 'rgb(153, 153, 153)',
                                transition: 'width 0.5s linear',
                                fontSize:'0.8rem',
                                zIndex: 0
                              }}/>
                            <span style={{ 
                              position: 'relative', zIndex: 1 
                            }}>
                              넘기기
                            </span>
                          </button>
                        </div>


                        {/*객관식 모드 답 선택영역 */}
                        {quizMode === 'objective' ? (
                          <div style={{
                            display:'grid',
                            gridTemplateColumns:'1fr 1fr',
                            gap:8,
                            marginBottom:8
                          }}>
                            {choices.map((c,i)=>(
                              <button
                                key={i}
                                onClick={()=>{
                                  if(selectedChoice === c) return
                                  setSelectedChoice(c)
                                  submit(c)
                                }}
                                disabled={lockChoice}
                                style={{
                                  height:52,
                                  borderRadius:10,
                                  border:'1px solid #ddd',
                                  background: selectedChoice === c ? '#1a1814' : '#fff',
                                  color: selectedChoice === c ? '#fff' : '#000',
                                  fontWeight:600,
                                  opacity: lockChoice ? 0.4 : 1,
                                  pointerEvents: lockChoice ? 'none' : 'auto',
                                  transition:'opacity 0.2s ease'
                                }}>
                                  <div style={{
                                    padding:'2px 6px',
                                    textAlign:'center',
                                    lineHeight:1.25,
                                    wordBreak:'keep-all'
                                  }}>
                                    {c}
                                  </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <>
                            {/* 주관식 모드 답 입력영역 */}
                            <div style={{
                              position:'relative',
                              marginBottom:8
                            }}>
                              <div style={{
                                display:'flex',
                                gap:8,
                                marginBottom:8
                              }}>
                                <input
                                  ref={inputRef}
                                  value={input}
                                  onChange={e=>{
                                    const v = e.target.value
                                    setInput(v)

                                    // 입력 없으면 초기화
                                    if(!v.trim()){
                                      setSuggestions([])
                                    return
                                    }

                                    // 전체 영화 아직 로딩 안됐으면 중단
                                    if(!allMovies.length) return
                                    const keyword = normalize(v)
                                    const starts = []
                                    const includes = []

                                    allMovies.forEach(m => {
                                      const title = normalize(m.title)

                                      if(title.startsWith(keyword)){
                                        starts.push(m)
                                      } else if(title.includes(keyword)){
                                        includes.push(m)
                                      }
                                    })

                                    const filtered = [
                                      ...starts.sort((a,b)=>a.title.localeCompare(b.title)),
                                      ...includes.sort((a,b)=>a.title.localeCompare(b.title))
                                    ].slice(0,5)
                                    setSuggestions(filtered)
                                  }}
                                  onKeyDown={e=>{
                                    // ↓ 아래 이동
                                    if(e.key === 'ArrowDown'){
                                      e.preventDefault()
                                      setSelectedSuggestion(prev =>
                                        Math.min(prev + 1, suggestions.length - 1)
                                      )
                                      return
                                    }
                                    // ↑ 위 이동
                                    if(e.key === 'ArrowUp'){
                                      e.preventDefault()
                                      setSelectedSuggestion(prev =>
                                        Math.max(prev - 1, 0)
                                      )
                                      return
                                    }
                                    // 엔터 선택
                                    if(e.key === 'Enter'){
                                      e.preventDefault()
                                      // 자동완성 선택
                                      if(
                                        selectedSuggestion >= 0 &&
                                        suggestions[selectedSuggestion]
                                      ){
                                        setInput(suggestions[selectedSuggestion].title)
                                        setSuggestions([])
                                        setSelectedSuggestion(-1)
                                        return
                                      }
                                      // 일반 제출
                                      submit()
                                    }
                                  }}
                                  placeholder="영화 제목 입력"
                                  style={{
                                    flex:1,
                                    height:46,
                                    borderRadius:11,
                                    border:'1.5px solid #e8e4dd',
                                    background:'#faf9f7',
                                    padding:'0 14px'
                                  }}
                                />
                                 <button
                                  onClick={()=>submit()}
                                  style={{
                                    width:72,
                                    height:46,
                                    borderRadius:11,
                                    background:'#e8808c',
                                    color:'#fff',
                                    fontWeight:700,
                                    fontSize:'0.8rem',
                                    border:'none'
                                  }}>
                                    정답
                                </button>
                              </div>

                              {/* 입력 자동완성 */}
                              {suggestions.length > 0 && (
                                <div style={{
                                    position:'absolute',
                                    left:0,
                                    right:0,
                                    top:52,
                                    background:'#fff',
                                    border:'1px solid #ddd',
                                    borderRadius:10,
                                    overflow:'hidden',
                                    zIndex:50
                                }}>
                                  {suggestions.map((s, i)=>(
                                    <div
                                      key={i}
                                      onClick={()=>{
                                        setInput(s.title)
                                        setSuggestions([])
                                        inputRef.current?.focus()
                                        }}
                                        style={{
                                          padding:'10px 12px',
                                          fontSize:'0.8rem',
                                          borderBottom:'1px solid #eee',
                                          cursor:'pointer',
                                          background:
                                            selectedSuggestion === i
                                              ? '#f3f0eb'
                                              : '#fff',
                                          color:
                                            selectedSuggestion === i
                                              ? '#1a1814'
                                              : '#555',
                                          fontWeight:
                                            selectedSuggestion === i
                                              ? 700
                                              : 500,
                                          transition:'all .12s ease'
                                    }}>
                                      {s.title}
                                    </div>
                                  ))}
                                </div>
                              )}

                               
                            </div>
                          </>
                        )}
                      </>
                      ) : (
                      <>
                        {/* 정답영화정보 영역 */}
                        {fbt==='ok' && (
                          <div style={{
                            marginTop:22,
                            marginBottom:14
                          }}>
                            <div style={{
                              position:'relative',
                              marginBottom:10
                            }}>

                              {/* 정답 제목 */}
                              <div style={{
                                fontSize:'1.3rem',
                                fontWeight:900,
                                color:'#c8a84a',
                                marginBottom:4,
                                textAlign:'center',
                                lineHeight:1.3
                              }}>
                                {m.title}
                              </div>

                              {/* 신고 버튼 */}
                              <div style={{
                                position:'absolute',
                                right:0,
                                top:'50%',
                                transform:'translateY(-50%)'
                              }}>
                                <button
                                  onClick={() =>
                                    setShowReportMenu(v => !v)
                                  }
                                  style={{
                                    border:'none',
                                    background:'transparent',
                                    color:'rgba(226, 7, 7, 0.7)',
                                    fontSize:'1.2rem',
                                    cursor:'pointer',
                                    padding:4,
                                    display:'flex',
                                    alignItems:'center',
                                    justifyContent:'center'
                                  }}
                                >
                                  ⚠
                                </button>

                                {/* 신고 메뉴 */}
                                {showReportMenu && (
                                  <div style={{
                                    position:'absolute',
                                    top:'100%',
                                    right:0,
                                    marginTop:0.2,
                                    background:'#fff',
                                    border:'1px solid #ece8e2',
                                    borderRadius:12,
                                    overflow:'hidden',
                                    boxShadow:'0 8px 24px rgba(0,0,0,0.08)',
                                    zIndex:50,
                                    minWidth:95
                                  }}>
                                    {/* 제목 오류 */}
                                    <button
                                      onClick={async()=>{
                                        setShowReportMenu(false)
                                        await supabase
                                          .from('hint_reports')
                                          .insert({
                                            movie_id:m.id,
                                            title:m.title,
                                            report_type:'title',
                                            user_id:String(currentUser.userId),
                                            nickname:currentUser.nickname
                                          })
                                        setShowReportToast(true)
                                        setTimeout(()=>{
                                          setShowReportToast(false)
                                        }, 1600)
                                      }}
                                      style={{
                                        width:'100%',
                                        border:'none',
                                        background:'#fff',
                                        padding:'11px 14px',
                                        fontSize:'0.78rem',
                                        textAlign:'center',
                                        cursor:'pointer',
                                        borderBottom:'1px solid #f1efeb'
                                    }}>
                                      제목 오류
                                    </button>

                                    {/* 힌트 오류 */}
                                    <button
                                      onClick={async()=>{
                                        setShowReportMenu(false)
                                        await supabase
                                          .from('hint_reports')
                                          .insert({
                                            movie_id:m.id,
                                            title:m.title,
                                            report_type:'hint',
                                            user_id:String(currentUser.userId),
                                            nickname:currentUser.nickname
                                          })
                                          setShowReportToast(true)
                                          setTimeout(()=>{
                                            setShowReportToast(false)
                                          }, 1600)
                                      }}
                                      style={{
                                        width:'100%',
                                        border:'none',
                                        background:'#fff',
                                        padding:'11px 14px',
                                        fontSize:'0.78rem',
                                        textAlign:'center',
                                        cursor:'pointer'
                                    }}>
                                      힌트 오류
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* 영화 카드 */}
                            <div style={{
                              borderRadius:22,
                              overflow:'hidden',
                              border:'1.5px solid #ece8e2',
                              background:'#fff',
                              padding:16,
                              marginBottom:14
                            }}>

                              <div style={{
                                display:'flex',
                                gap:15,
                                alignItems:'stretch'
                              }}>

                                {/* 포스터 */}
                                <div style={{
                                  width:100,
                                  height:150,
                                  borderRadius:16,
                                  overflow:'hidden',
                                  flexShrink:0,
                                  background:'#f5f3ef'
                                }}>

                                  {m.poster_path ? (
                                    <img
                                      src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                                      alt=""
                                      style={{
                                        width:'100%',
                                        height:'100%',
                                        objectFit:'cover'
                                      }}
                                    />
                                  ) : (
                                    <img
                                      src="/no_poster.webp"
                                      alt="No Poster"
                                      style={{
                                        width:'100%',
                                        height:'100%',
                                        objectFit:'cover'
                                      }}
                                    />
                                  )}
                                </div>

                                {/* 정보 */}
                                <div style={{
                                  flex:1,
                                  display:'flex',
                                  flexDirection:'column',
                                  justifyContent:'space-between',
                                  minWidth:0
                                }}>

                                  <div style={{
                                    display:'flex',
                                    flexDirection:'column',
                                    gap:5
                                  }}>

                                    {/* 연도 */}
                                    <div style={{
                                      display:'flex',
                                      alignItems:'center',
                                      gap:10,
                                      fontSize:'0.75rem',
                                      color:'#555'
                                    }}>
                                      <span style={{
                                        width:38,
                                        flexShrink:0,
                                        whiteSpace:'nowrap',
                                        fontSize:'0.75rem'
                                      }}>개봉</span>
                                      <span>{m.year || '-'}</span>
                                    </div>

                                    {/* 국가 */}
                                    <div style={{
                                      display:'flex',
                                      alignItems:'center',
                                      gap:10,
                                      fontSize:'0.75rem',
                                      color:'#555'
                                    }}>
                                      <span style={{
                                        width:38,
                                        flexShrink:0,
                                        whiteSpace:'nowrap',
                                        fontSize:'0.75rem'
                                      }}>국가</span>
                                      <span>{m.country || '-'}</span>
                                    </div>


                                    {/* 장르 */}
                                    <div style={{
                                      display:'flex',
                                      alignItems:'center',
                                      gap:10,
                                      fontSize:'0.75rem',
                                      color:'#555'
                                    }}>
                                      <span style={{
                                        width:38,
                                        flexShrink:0,
                                        whiteSpace:'nowrap',
                                        fontSize:'0.75rem'
                                      }}>장르</span>
                                      <span>{m.genre || '-'}</span>
                                    </div>


                                    {/* 감독 */}
                                    <div style={{
                                      display:'flex',
                                      alignItems:'center',
                                      gap:10,
                                      fontSize:'0.75rem',
                                      color:'#555'
                                    }}>
                                      <span style={{
                                        width:38,
                                        flexShrink:0,
                                        whiteSpace:'nowrap',
                                        fontSize:'0.75rem'
                                      }}>
                                        감독
                                      </span>
                                      <span>
                                      {
                                        m.credits?.crew
                                          ?.find(p => p.job === 'Director')
                                          ?.name || '-'
                                      }
                                      </span>
                                    </div>

                                    {/* 배우 */}
                                    <div style={{
                                      display:'flex',
                                      alignItems:'flex-start',
                                      gap:10,
                                      fontSize:'0.75rem',
                                      color:'#555',
                                      lineHeight:1.5
                                    }}>
                                      <span style={{width:38, flexShrink:0, whiteSpace:'nowrap', fontSize:'0.75rem'}}>출연
                                      </span>
                                      <span>
                                        {
                                          m.credits?.cast
                                            ?.slice(0,3)
                                            ?.map(a => a.name)
                                            ?.join(' · ')
                                          || '-'
                                        }
                                      </span>
                                    </div>

                                    {/* 영상 */}
                                    <div style={{
                                      display:'flex',
                                      alignItems:'center',
                                      gap:10,
                                      fontSize:'0.75rem',
                                      color:'#555'
                                    }}>
                                      <span style={{
                                        width:38,
                                        flexShrink:0,
                                        whiteSpace:'nowrap',
                                        fontSize:'0.75rem'
                                      }}>
                                        영상
                                      </span>
                                      {m.youtubeKey ? (
                                        <span
                                          onClick={()=>setTrailerKey(m.youtubeKey)
                                          }
                                          style={{
                                            cursor:'pointer',
                                            color:'#c84f4f',
                                            fontWeight:700
                                          }}
                                        >
                                          🎬 영상 보기
                                        </span>
                                      ) : (
                                        <span>-</span>
                                      )}
                                    </div>
                                  </div>

                                  {/* 시놉시스 버튼 */}
                                  {m.overview && (
                                    <button
                                      onClick={() => {
                                        setShowSynopsis(v => !v)
                                        setTimeout(()=>{
                                          scrollRef.current?.scrollTo({
                                            top: scrollRef.current.scrollHeight,
                                            behavior:'smooth'
                                          })
                                        }, 120)
                                      }}
                                      style={{
                                        marginTop:10,
                                        border:'none',
                                        background:'none',
                                        padding:0,
                                        textAlign:'left',
                                        fontSize:'0.8rem',
                                        fontWeight:800,
                                        color:'#666',
                                        cursor:'pointer'
                                      }}>
                                      {showSynopsis
                                        ? '줄거리 ▲'
                                        : '줄거리 ▼'}
                                    </button>
                                  )}
                                </div>
                                
                              </div>

                              {/* 시놉시스 */}
                              {showSynopsis && m.overview && (
                                <div style={{
                                  marginTop:18,
                                  paddingTop:16,
                                  borderTop:'1px solid #efebe5',
                                  fontSize:'0.82rem',
                                  lineHeight:1.7,
                                  color:'#555'
                                }}>
                                  {m.overview}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* 하단 버튼 */}
                        <button
                          onClick={nextQ}
                          style={{
                            width:'100%',
                            height:46,
                            borderRadius:12,
                            background:'#4a4a4a',
                            color:'#fff',
                            fontWeight:800,
                            fontSize:'0.8rem',
                            border:'none'
                          }}>
                          {qi+1<pool.length ? '다음 문제' : '결과 보기'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>


              {/* 신고 toast */}
              {showReportToast && (
                <div style={{
                  position:'fixed',
                  left:'50%',
                  bottom:90,
                  transform:'translateX(-50%)',
                  background:'rgba(30,30,30,0.92)',
                  color:'#fff',
                  padding:'12px 18px',
                  borderRadius:999,
                  fontSize:'0.78rem',
                  fontWeight:700,
                  zIndex:9999,
                  boxShadow:'0 8px 24px rgba(0,0,0,0.18)',
                  backdropFilter:'blur(8px)'
                }}>
                  신고가 접수되었어요
                </div>
              )}
              
              <style jsx>{`
                @keyframes comboPulse {
                  0%   { transform: scale(1) }
                  50%  { transform: scale(1.06) }
                  100% { transform: scale(1) }
                }
              `}</style>

              <style jsx>{`
                @keyframes hintSlideDown {
                  from {
                    opacity: 0;
                    transform: translateY(-10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>

              <style jsx>{`
                @keyframes popLife {
                  0% {
                    opacity: 0;
                    transform: translateY(6px) scale(0.8);
                  }
                  40% {
                    opacity: 1;
                    transform: translateY(-4px) scale(1.1);
                  }
                  100% {
                    opacity: 0;
                    transform: translateY(-10px) scale(1);
                  }
                }
              `}</style>

              <style jsx>{`
                @keyframes menuFade{
                  from{
                    opacity:0;
                    transform:translateY(-6px);
                  }

                  to{
                    opacity:1;
                    transform:translateY(0);
                  }
                }
              `}</style>

            </AppLayout>
          )
        })()
      )}



      {/* 화면 4: 결과 화면 */}
      {screen === 'result' && (() => {
        const safeUsers = Array.isArray(users) ? users : []
        const user = safeUsers.find(u => u.charId === selChar)
        const baseScore = user?.score ?? 0
        const roundScore = (results ?? []).reduce((s,r)=>s+r.score,0)
        const tot = baseScore + roundScore
        const nickname = user?.nickname || 'USER'
        const currentGrade = selGrade
        const hasFail = results.some(r => !r.correct)

        let lastRank = 1
        const ranked = ranking.map((r, i) => {
          if(i === 0){
            return { ...r, rank: 1 }
          }
          const prev = ranking[i-1]
          if(r.score === prev.score){
            return { ...r, rank: lastRank }
          }
          lastRank = i + 1
          return { ...r, rank: lastRank }
        })

        return(
          <>
            <AppLayout>
              <div style={{
                height:'100dvh',
                overflow:'hidden',
                background:'#fff',
                display:'flex',
                flexDirection:'column',
                padding:'12px 0 8px',
              }}>

                {/* 상단 영역 */}
                <div style={{
                flexShrink:0,
                paddingTop:12,
                display:'flex',           
                flexDirection:'column',    
                alignItems:'center' 
                }}>

                  <div style={{
                    position:'relative',
                    width:75,
                    height:75,
                    borderRadius:'50%',
                    background:'#faf9f7',
                    border:'2.5px solid #f2d7dc',
                    boxShadow:`
                      0 0 0 3px rgba(255,107,122,0.10),
                      0 8px 20px rgba(255,107,122,0.12)`,
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    marginBottom:10
                  }}>
                    <div onClick={()=>setShowProfile(true)} style={{cursor:'pointer'}}>
                      <svg viewBox="0 0 80 80" style={{width:68,height:68}}>
                        {char?.svg?.props?.children}
                      </svg>
                    </div>

                    {/* 🔥 프로필 배지 */}
                    <div style={{
                      position:'absolute',
                      right:-2,
                      bottom:6,
                      width:22,
                      height:22,
                      borderRadius:'50%',
                      background:'#fff8f9',
                      border:'1.5px solid #e8e4dd',
                      boxShadow:`
                        0 0 0 3px rgba(255,107,122,0.10),
                        0 4px 12px rgba(255,107,122,0.12)`,
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center',
                      fontSize:'0.72rem',
                      boxShadow:'0 2px 6px rgba(0,0,0,0.08)'
                    }}>
                      📊
                    </div>
                  </div>

                  <div style={{
                    fontSize:'0.8rem',
                    fontWeight:700,
                    color:'#1a1814',
                    marginBottom:6
                  }}>
                    {nickname}
                  </div>

                  <div style={{
                    fontSize:'2.5rem',
                    fontWeight:900,
                    color:'#1a1814'
                  }}>
                    {(displayScore || 0).toLocaleString()}점
                  </div>

                  <div style={{
                    marginTop:10,
                    marginBottom:18,
                    display:'flex',
                    justifyContent:'center'
                  }}>
                    <button
                      onClick={()=>{
                        setResultView(prev => prev === 'score' ? 'ranking' : 'score')
                      }}
                      style={{
                        padding:'6px 12px',
                        borderRadius:20,
                        border:'1px solid #ddd',
                        background:'#fff',
                        fontSize:'0.8rem',
                        cursor:'pointer'
                      }}>
                      {resultView === 'score' ? '랭킹 보기' : '점수 보기'}
                    </button>
                  </div>

                  {isLevelCompleted && (
                    <div style={{
                      fontSize:'0.8rem',
                      color:'#888',
                      marginTop:6
                    }}>
                      {currentGrade === '2020s' && '2020년대 레벨을 완료하였습니다'}
                      {currentGrade === '2010s' && '2010년대 레벨을 완료하였습니다'}
                      {currentGrade === '2000s' && '2000년대 레벨을 완료하였습니다'}
                      {currentGrade === '1990s' && '1990년대 레벨을 완료하였습니다'}
                      {currentGrade === 'old' && '오래전 영화 레벨을 완료하였습니다'}
                    </div>
                  )}
                </div>
            
                {/* 리스트 영역  */}
                <div style={{ position:'relative' }}>
                  {/* 정답보기-AD 버튼 */}
                  {resultView === 'score' && hasFail && !showAnswers && (
                    <button
                      onClick={handleShowAnswers}
                      disabled={showAnswers}
                      style={{
                        position:'absolute',
                        top:-30,
                        left:20,
                        zIndex:20,
                        display:'flex',
                        alignItems:'center',
                        gap:6,
                        fontSize:'0.7rem',
                        padding:'6px 10px',
                        borderRadius:8,
                        border:'none',
                        background: '#e8808c',
                        color:'#ffffff' ,
                        fontWeight:700
                      }}
                    >
                      정답보기
                      <span style={{
                        fontSize:'0.35rem',
                        padding:'2px 5px',
                        borderRadius:6,
                        background:'#ffffff',
                        color:'#252525'
                      }}>
                        AD
                      </span>
                    </button>
                  )}

                  {/* 점수_랭킹 리스트 */}
                  <div style={{
                    padding:'7px 20px 0',
                    // 🔥 핵심 1: score 기준 높이 고정
                    height: `${Math.min(results.length, 5) * 65+3}px`,
                    // 🔥 핵심 2: ranking은 스크롤만
                    overflowY: 'auto',
                    WebkitOverflowScrolling:'touch',
                    overscrollBehavior:'contain'
                  }}>

                    {resultView === 'score' ? (
                      results.slice(0, visibleResults).map((r,i)=>{
                        const rg = GRADES.find(x=>x.id===r.grade)
                        const isCorrect = r.correct === true
                        const hasMovieInfo =
                          r.tmdb_id ||
                          r.poster_path ||
                          r.overview
                        return(
                          <div key={i}
                            onClick={()=>{
                              if(
                                (r.correct || showAnswers)
                                &&
                                hasMovieInfo
                              ){
                                loadMovieDetail(r)
                              }
                            }}
                            style={{
                              position:'relative',
                              overflow:'hidden',
                              borderRadius:13,
                              border:'1.5px solid #ece8e2',
                              background:'#fff',
                              padding:'12px 16px',
                              marginBottom:8,
                              display:'flex',
                              alignItems:'center',
                              gap:12,
                              cursor:
                                ((r.correct || showAnswers) && hasMovieInfo)
                                  ? 'pointer'
                                  : 'default'
                            }}
                          >
                            {/* 🎬 포스터 배경 */}
                            {(r.correct || showAnswers) && r.poster_path && (
                              <>
                                {/* 포스터 */}
                                <img
                                  src={`https://image.tmdb.org/t/p/w500${r.poster_path}`}
                                  alt=""
                                  style={{
                                    position:'absolute',
                                    top:0,
                                    right:0,
                                    width:'100%',
                                    height:'100%',
                                    objectFit:'cover',
                                    objectPosition:'center center',
                                    opacity:0.7,
                                    zIndex:0,
                                    pointerEvents:'none'
                                  }}
                                />
                                {/* 가독성용 화이트 그라데이션 */}
                                <div style={{
                                  position:'absolute',
                                  inset:0,
                                  background:
                                    'linear-gradient(to right, rgba(255,255,255,0.88) 0%, rgba(255, 255, 255, 0.43) 35%, rgba(255,255,255,0.00) 50%, rgba(255, 255, 255, 0.34) 65%, rgba(255,255,255,0.88) 100%)',
                                  zIndex:1,
                                  pointerEvents:'none'
                                }}/>
                              </>
                            )}    

                            {/* Q번호 */}
                            <div style={{
                              position:'relative',
                              zIndex:2,
                              width:28,
                              height:28,
                              borderRadius:'50%',
                              background: isCorrect ? `${rg?.color || '#ccc'}15` : '#f5f3ef',
                              display:'flex',
                              alignItems:'center',
                              justifyContent:'center',
                              border:`1.5px solid ${isCorrect ? (rg?.color || '#ccc') : '#e8e4dd'}`
                            }}>
                              <span style={{
                                fontSize:'0.7rem',
                                fontWeight:800,
                                color:r.correct ? rg?.color : '#b0aaa3'
                              }}>
                                Q{i+1}
                              </span>
                            </div>

                            {/* 제목 */}
                            <div style={{
                              flex:1,
                              position:'relative',
                              zIndex:2
                            }}>
                              <div style={{
                                  fontSize:
                                    r.correct && (r.title || '').length > 20 ? '0.7rem' :
                                    r.correct && (r.title || '').length > 14 ? '0.75rem' :
                                    '0.8rem',
                                  fontWeight:700,
                                  transition:'opacity 0.15s ease',
                                  color:
                                    (r.correct || showAnswers)
                                      ? '#1a1814'
                                      : '#c0bbb4',
                                  lineHeight:1.25,
                                  wordBreak:'keep-all',
                                }}>
                                  {r.correct 
                                  ? r.title 
                                  : showAnswers 
                                    ? r.title
                                    : '실패'
                                  }
                              </div>
                            </div>

                            {/* 점수 */}
                            <div style={{
                              position:'relative',
                              zIndex:2,
                              minWidth:50,
                              display:'flex',
                              justifyContent:'flex-end',
                              paddingRight:18
                            }}>
                              <div style={{
                                fontSize:'0.85rem',
                                fontWeight:800,
                                textShadow:'0 1px 3px rgba(255,255,255,0.85)',
                                color:r.correct ? '#d42c3f' : '#c7b9b9'
                              }}>
                                {r.correct ? `+${r.score}` : '-'}
                              </div>

                              {/* 콤보도장 */}
                              {r.combo && (
                                <div style={{
                                  position:'absolute',
                                  zIndex:3,
                                  top:-15,
                                  right:38,
                                  fontSize:'0.55rem',
                                  fontWeight:900,
                                  padding:'2px 6px',
                                  borderRadius:6,
                                  transform:'rotate(-10deg)',
                                  zIndex:2,

                                  background:
                                    r.combo === 'good'  ? '#fff3cd' :
                                    r.combo === 'wow'   ? '#ffe0e0' :
                                    r.combo === 'crazy' ? '#e6d6ff' : '#eee',

                                  color:
                                    r.combo === 'good'  ? '#c8a84a' :
                                    r.combo === 'wow'   ? '#d45c5c' :
                                    r.combo === 'crazy' ? '#7a4cff' : '#888',

                                  border:`1px solid ${
                                    r.combo === 'good'  ? '#f0c36d' :
                                    r.combo === 'wow'   ? '#f0b4b4' :
                                    r.combo === 'crazy' ? '#c8a8ff' : '#ddd'
                                  }`,

                                  boxShadow:'0 2px 6px rgba(0,0,0,0.15)',
                                  pointerEvents:'none'
                                }}>
                                  {
                                    r.combo === 'good'  ? 'GOOD' :
                                    r.combo === 'wow'   ? 'WOW' :
                                    r.combo === 'crazy' ? 'CRAZY' : ''
                                  }
                                </div>
                              )}
                            </div>

                            {((r.correct || showAnswers) && hasMovieInfo) && (
                            <div style={{
                              position:'absolute',
                              right:8,
                              top:'50%',
                              transform:'translateY(-50%)',
                              zIndex:2,
                              display:'flex',
                              flexDirection:'column',
                              alignItems:'center',
                              lineHeight:1.0,
                              fontSize:'0.53rem',
                              fontWeight:900,
                              color:'rgba(0, 0, 0, 0.92)',
                              textShadow:'0 1px 4px rgba(236, 236, 236, 0.45)',
                              letterSpacing:'0.5px',
                              pointerEvents:'none'
                            }}>
                              <span>O</span>
                              <span>P</span>
                              <span>E</span>
                              <span>N</span>

                            </div>
                          )}
                          </div>
                        )
                      })
                    ) : (
                      <>
                        {(() => {
                          const safeRanking = Array.isArray(ranked) ? ranked : []
                          const safeUsers = Array.isArray(users) ? users : []
                          const TOP_LIMIT = 10
                          const myRankIndex = safeRanking.findIndex(
                            r =>
                              String(r.user_id) === String(currentUser.userId) &&
                              String(r.character_id) === String(selChar)
                          )
                          const myRank =
                            myRankIndex >= 0
                              ? myRankIndex + 1
                              : null
                          const myRankData =
                            myRankIndex >= 0
                              ? safeRanking[myRankIndex]
                              : null
                          return (
                            <>
                              {Array.from({ length: rankingRevealDone ? TOP_LIMIT : 5 }).map((_, i) => {
                                const r = safeRanking[i] || null
                                const char = r ? CHARS.find(c => c.id === r.character_id) : null
                                const isDead = r && !safeUsers.find(u => u.charId === r.character_id)
                                const isMe =
                                  r &&
                                  String(r.user_id) === String(currentUser.userId) &&
                                  String(r.character_id) === String(selChar)
                                const isAnimated = i < 5

                                return (
                                  <div
                                    key={i}
                                    style={{
                                      borderRadius:13,
                                      border: isMe
                                        ? '2px solid #e8808c'
                                        : '1.5px solid #ece8e2',
                                      background: isMe
                                        ? '#fff5f6'
                                        : '#fff',
                                      color: isMe ? '#e8808c' : '#1a1814',
                                      padding:'12px 16px',
                                      marginBottom:8,
                                      display:'flex',
                                      alignItems:'center',
                                      gap:12,
                                      animation: isAnimated
                                        ? 'fadeUp 0.3s ease forwards'
                                        : 'none',
                                      opacity: isAnimated ? 0 : 1,
                                      animationDelay: `${i * 0.08}s`
                                    }}
                                  >

                                    {/* 순위 */}
                                    <div style={{
                                      width:28,
                                      height:28,
                                      borderRadius:'50%',
                                      background:'#f5f3ef',
                                      display:'flex',
                                      alignItems:'center',
                                      justifyContent:'center',
                                      border:'1.5px solid #e8e4dd',
                                      flexShrink:0
                                    }}>
                                      <span style={{
                                        fontSize:'0.65rem',
                                        fontWeight:800
                                      }}>
                                        {r.rank}위
                                      </span>
                                    </div>

                                    {/* 캐릭터 + 📊 */}
                                    {r ? (
                                      <div style={{
                                        position:'relative',
                                        width:28,
                                        height:28,
                                        flexShrink:0
                                      }}>

                                        {/* 캐릭터 */}
                                        <div
                                          onClick={()=>{
                                            setAnimateStats(false)
                                            requestAnimationFrame(()=>{
                                              setAnimateStats(true)
                                            })
                                            setProfileTarget(r.character_id)
                                            setProfileUser(r)
                                            setShowProfile(true)
                                          }}
                                          style={{
                                            cursor:'pointer'
                                          }}
                                        >
                                          <CharAvatar
                                            charId={r.character_id}
                                            size={28}
                                          />
                                        </div>

                                        {/* 📊 배지 */}
                                        <div
                                          onClick={()=>{
                                            setAnimateStats(false)
                                            requestAnimationFrame(()=>{
                                              setAnimateStats(true)
                                            })
                                            setProfileTarget(r.character_id)
                                            setProfileUser(r)
                                            setShowProfile(true)
                                          }}
                                          style={{
                                            position:'absolute',
                                            right:-5,
                                            bottom:-5,
                                            width:16,
                                            height:16,
                                            borderRadius:'50%',
                                            background:'#fff8f9',
                                            border:'1px solid #e8e4dd',
                                            display:'flex',
                                            alignItems:'center',
                                            justifyContent:'center',
                                            fontSize:'0.45rem',
                                            boxShadow:'0 2px 5px rgba(0,0,0,0.08)',
                                            cursor:'pointer'
                                          }}
                                        >
                                          📊
                                        </div>

                                      </div>

                                    ) : (

                                      <div style={{
                                        width:28,
                                        height:28,
                                        borderRadius:'50%',
                                        background:'#f0eeea',
                                        flexShrink:0
                                      }}/>

                                    )}

                                    {/* 이름 */}
                                    <div style={{
                                      flex:1,
                                      minWidth:0
                                    }}>
                                      <div style={{
                                        fontSize:'0.8rem',
                                        fontWeight:700,
                                        color: r
                                          ? isDead
                                            ? '#b0aaa3'
                                            : '#1a1814'
                                          : '#c0bbb4',
                                        overflow:'hidden',
                                        textOverflow:'ellipsis',
                                        whiteSpace:'nowrap'
                                      }}>
                                        {r
                                          ? isDead
                                            ? `${r.nickname || char?.name || 'UNKNOWN'} 💀`
                                            : (r.nickname || char?.name || 'USER')
                                          : '-'
                                        }
                                      </div>
                                    </div>

                                    {/* 점수 */}
                                    <div style={{
                                      fontSize:'0.85rem',
                                      fontWeight:800,
                                      color: r ? '#1a1814' : '#c0bbb4',
                                      whiteSpace:'nowrap'
                                    }}>
                                      {r ? r.score : 0}
                                    </div>

                                  </div>
                                )
                              })}

                              {myRank && myRank > TOP_LIMIT && (
                                <div style={{
                                  marginTop:8,
                                  padding:'12px 14px',
                                  borderRadius:14,
                                  background:'#fff5f6',
                                  border:'2px solid #e8808c',
                                  display:'flex',
                                  alignItems:'center',
                                  gap:10
                                }}>
                                  <div style={{
                                    fontSize:'0.75rem',
                                    fontWeight:800,
                                    color:'#e8808c'
                                  }}>
                                    내 순위
                                  </div>

                                  <div style={{
                                    fontSize:'1rem',
                                    fontWeight:900,
                                    color:'#e8808c'
                                  }}>
                                    {myRank}위
                                  </div>
                                  <CharAvatar charId={selChar} size={28}/>
                                  <div style={{
                                    fontSize:'0.85rem',
                                    fontWeight:700,
                                    flex:1,
                                    minWidth:0,
                                    overflow:'hidden',
                                    textOverflow:'ellipsis',
                                    whiteSpace:'nowrap'
                                  }}>
                                    {myRankData?.nickname || 'USER'}
                                  </div>

                                  <div style={{
                                    fontSize:'0.9rem',
                                    fontWeight:900,
                                    whiteSpace:'nowrap'
                                  }}>
                                    {myRankData?.score || 0}
                                  </div>
                                </div>
                              )}

                            </>
                          )
                        })()}
                      </>
                    )}
                  </div>
                </div>

                {/* 하단 영역 */}
                {visibleResults > results.length && (
                  <div style={{
                    flexShrink:0,
                    padding:'8px 20px calc(10px + env(safe-area-inset-bottom))',
                    display:'flex',
                    gap:10,
                    background:'#fff',
                    borderTop:'1px solid #f0ece6'
                  }}>

                    {/* 🔥 조건 버튼 */}
                    {!isLevelCompleted && (
                      <button
                        style={{
                          flex:1,
                          height:54,
                          borderRadius:14,
                          background:'#4a4a4a',
                          color:'#fff',
                          fontSize:'0.8rem',
                          fontWeight:700,
                          border:'none'
                        }}
                        onClick={()=>loadMovies()}
                      >
                        계속하기
                      </button>
                    )}
                    
                    {/* 🔥 공통 버튼 (홈은 무조건 하나만) */}
                    <button
                      style={{
                        flex:1,
                        height:54,
                        borderRadius:12,
                        background:'transparent',
                        color:'#9a9490',
                        fontSize:'0.8rem',
                        fontWeight:500,
                        border:'1.5px solid #e8e4dd'
                      }}
                      onClick={()=>setScreen('char')}
                    >
                      홈으로
                    </button>
                  </div>
                )}




                {/* 🔥 프로필 팝업 */}
                {showProfile && (
                  <div style={{
                    position:'fixed',
                    inset:0,
                    background:'rgba(0,0,0,0.3)',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    zIndex:99
                  }}>
                    <div style={{
                      transform:'scale(0.88)',
                      transformOrigin:'center center'
                    }}>
                      <div style={{
                        width:'92vw',
                        maxWidth:420,
                        maxHeight:'88vh',
                        overflowY:'auto',
                        background:'#faf9f7',
                        borderRadius:20,
                        border:'1.5px solid #e8e4dd',
                        padding:'20px 16px',
                        boxShadow:'0 10px 30px rgba(0,0,0,0.1)',
                        position:'relative'
                      }}>
                        {/* 닫기 */}
                        <div
                          onClick={()=>setShowProfile(false)}
                          style={{
                            position:'absolute',
                            top:12,
                            right:12,
                            width:30,
                            height:30,
                            borderRadius:'50%',
                            background:'#f5f3ef',
                            border:'1px solid #e8e4dd',
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center',
                            cursor:'pointer'
                          }}>
                          <span style={{
                            color:'#1a1814',
                            fontSize:16,
                            fontWeight:700
                          }}>
                            ×
                          </span>
                        </div>


                        {/* 상단텍스트 영역 */}
                        <div style={{
                          textAlign:'center',
                          marginBottom:7
                        }}>

                          {/* 작은 라벨 */}
                          <div style={{
                            fontSize:'0.62rem',
                            letterSpacing:'0.24em',
                            color:'#b8b1a8',
                            fontWeight:700,
                            marginBottom:8
                          }}>
                            CINECLUE TITLE
                          </div>

                          {/* 타이틀 */}
                          <div style={{
                            fontSize:'1.6rem',
                            fontWeight:900,
                            color:'#1a1814',
                            letterSpacing:'-0.04em',
                            lineHeight:1.08
                          }}>
                            {LEVEL_TITLES[
                              Math.min(
                                Math.floor((user.score || 0) / 50000) + 1,
                                100
                              )
                            ]}
                          </div>

                          {/* 닉네임 */}
                          <div style={{
                            fontSize:'0.9rem',
                            color:'#8d857c',
                            marginTop:10,
                            fontWeight:600
                          }}>
                            {profileUser?.nickname || currentUser?.nickname || '-'}
                          </div>
                        </div>


                        {/* 레벨바 영역 */}
                        <div style={{
                          marginBottom:15
                        }}>

                          <div style={{
                            fontSize:'1.0rem',
                            fontWeight:900,
                            color:'#1a1814'
                          }}>
                            Lv. {profileStats?.level || 1}
                          </div>

                          <div style={{
                            height:10,
                            background:'#ece9e4',
                            borderRadius:999,
                            marginTop:10,
                            overflow:'hidden'
                          }}>

                            <div style={{
                              width:`${profileStats?.levelPercent || 0}%`,
                              height:'100%',
                              background:
                                'linear-gradient(90deg,#ff8a95,#ff5f73)',
                              borderRadius:999,
                              boxShadow:'0 0 12px rgba(255,95,115,0.35)'
                            }}/>

                          </div>

                          <div style={{
                            fontSize:'0.72rem',
                            color:'#888',
                            textAlign:'right',
                            marginTop:6,
                            fontWeight:600
                          }}>
                            {(profileStats?.currentLevelScore || 0)
                              .toLocaleString()}
                            {' '}
                            / 50,000 EXP
                          </div>
                        </div>


                        {/* 그래프 영역 */}
                        <div style={{
                          display:'grid',
                          gridTemplateColumns:'1fr 1fr',
                          gap:7,
                          marginBottom:7
                        }}>
                          {[
                            [
                              '총 점수',
                              profileStats?.totalScore?.toLocaleString() || '0'
                            ],
                            [
                              '플레이 시간',
                              `${Math.floor((profileStats?.totalSeconds || 0)/3600)}h ${
                                Math.floor(
                                  ((profileStats?.totalSeconds || 0)%3600)/60
                                )
                              }m`
                            ],
                            [
                              '선호 장르',
                              profileStats?.favoriteGenres?.[0] || '-'
                            ],
                            [
                              '최근 플레이',
                              profileStats?.lastPlayed
                                ? new Date(profileStats.lastPlayed)
                                    .toLocaleDateString('ko-KR')
                                : '-'
                            ]
                          ].map(([k,v],i)=>(
                            <div
                              key={i}
                              style={{
                                background:'#fff',
                                border:'1px solid #ece7df',
                                borderRadius:14,
                                padding:'12px 12px'
                              }}>
                              <div style={{
                                fontSize:'0.66rem',
                                color:'#999',
                                marginBottom:5,
                                fontWeight:600
                              }}>
                                {k}
                              </div>
                              <div style={{
                                fontSize:'1rem',
                                fontWeight:800,
                                color:'#1a1814',
                                lineHeight:1.3
                              }}>
                                {v}
                              </div>
                            </div>
                          ))}
                        </div>


                        {/* 장르숙련도  영역*/}
                        <div style={{
                          background:'#fff',
                          border:'1px solid #ece7df',
                          borderRadius:18,
                          padding:'14px 14px'
                        }}>

                          {/* 헤더 */}
                          <div style={{
                            display:'flex',
                            justifyContent:'space-between',
                            alignItems:'center',
                            marginBottom:12
                          }}>
                            <div>
                              <div style={{
                                fontSize:'0.9rem',
                                fontWeight:900,
                                color:'#1a1814'
                              }}>
                                🎬 장르 숙련도
                              </div>
                              <div style={{
                                fontSize:'0.68rem',
                                color:'#999',
                                marginTop:2
                              }}>
                                정답 기록 기반 영화 성향 분석
                              </div>
                            </div>
                            <div style={{
                              fontSize:'0.72rem',
                              fontWeight:800,
                              color:'#ff5f73'
                            }}>
                              TOP 3
                            </div>
                          </div>

                          {/* 리스트 */}
                          <div style={{
                            display:'flex',
                            flexDirection:'column',
                            gap:10
                          }}>
                            {[...(profileStats?.genreStats || [])]
                              .sort((a,b)=>
                                b.percent - a.percent
                              )
                              .slice(0,3)
                              .map((g,i)=>{
                                let rankLabel = 'BEGINNER'
                                if(g.percent >= 80){
                                  rankLabel = 'MASTER'
                                }else if(g.percent >= 60){
                                  rankLabel = 'EXPERT'
                                }else if(g.percent >= 40){
                                  rankLabel = 'ADVANCED'
                                }else if(g.percent >= 20){
                                  rankLabel = 'INTERMEDIATE'
                                }
                                return(
                                  <div
                                    key={i}
                                    style={{
                                      display:'flex',
                                      alignItems:'center',
                                      gap:10
                                    }}>

                                    {/* 장르명 */}
                                    <div style={{
                                      width:82,
                                      fontSize:'0.78rem',
                                      fontWeight:700,
                                      color:'#1a1814',
                                      flexShrink:0,
                                      overflow:'hidden',
                                      textOverflow:'ellipsis',
                                      whiteSpace:'nowrap'
                                    }}>
                                      {g.genre}
                                    </div>

                                    {/* 바 */}
                                    <div style={{
                                      flex:1,
                                      height:8,
                                      background:'#f1efeb',
                                      borderRadius:999,
                                      overflow:'hidden'
                                    }}>
                                      <div style={{
                                        width:'100%',
                                        height:'100%',
                                        background:
                                          'linear-gradient(90deg,#ff8a95,#ff5f73)',
                                        borderRadius:999,
                                        boxShadow:
                                          '0 0 10px rgba(255,95,115,0.35)',
                                        transformOrigin:'left center',
                                        transform:
                                          animateStats
                                            ? `scaleX(${g.percent / 100})`
                                            : 'scaleX(0)',
                                        transition:
                                          `transform 0.8s cubic-bezier(.22,.61,.36,1) ${i * 0.08}s`
                                      }}/>
                                    </div>

                                    {/* 퍼센트 */}
                                    <div style={{
                                      width:40,
                                      textAlign:'right',
                                      fontSize:'0.78rem',
                                      fontWeight:800,
                                      color:'#ff5f73',
                                      flexShrink:0
                                    }}>
                                      {g.percent}%
                                    </div>

                                    {/* 티어 */}
                                    <div style={{
                                      width:86,
                                      height:24,
                                      borderRadius:999,
                                      border:'1px solid #ece7df',
                                      background:'#faf8f5',
                                      display:'flex',
                                      alignItems:'center',
                                      justifyContent:'center',
                                      fontSize:'0.62rem',
                                      fontWeight:800,
                                      color:
                                        rankLabel === 'MASTER'
                                          ? '#ff8a00'
                                          : rankLabel === 'EXPERT'
                                          ? '#ff5f73'
                                          : rankLabel === 'ADVANCED'
                                          ? '#7c63ff'
                                          : '#7f8a99'
                                    }}>
                                      {rankLabel}
                                    </div>
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>


                        {/* 추천 영화 영역 */}
                        <div style={{
                          marginTop:7,
                          paddingTop:0
                        }}>

                          <button
                            onClick={openMovieRecommend}
                            style={{
                              width:'100%',
                              border:'1px solid #ece4dc',
                              background:'#fff',
                              borderRadius:18,
                              padding:'16px 18px',
                              display:'flex',
                              alignItems:'center',
                              justifyContent:'space-between',
                              cursor:'pointer'
                          }}>

                            <div style={{
                              textAlign:'left'
                            }}>

                              <div style={{
                                fontSize:'0.9rem',
                                fontWeight:800,
                                color:'#1a1814',
                                marginBottom:4
                              }}>
                                🔍 딱 맞는 추천 영화
                              </div>

                              <div style={{
                                fontSize:'0.72rem',
                                color:'#9b9389',
                                fontWeight:600
                              }}>
                                장르 숙련도 기반 랜덤 추천
                              </div>
                            </div>

                            <div style={{
                              fontSize:'1rem',
                              color:'#c7b8a8',
                              fontWeight:700,
                              minWidth:120,
                              textAlign:'right'
                            }}>
                              {recommendStatus === 'loading'
                                ? `Loading${loadingDots}`
                                : recommendStatus === 'fail'
                                ? 'no movie'
                                : 'click ›'}
                            </div>
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {showRecommendModal && recommendMovie && (
                <div
                  onClick={() =>
                    setShowRecommendModal(false)
                  }
                  style={{
                    position:'fixed',
                    inset:0,
                    background:'rgba(0,0,0,0.22)',
                    zIndex:3000,
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    padding:24
                  }}>

                  <div
                    onClick={(e)=>
                      e.stopPropagation()
                    }
                    style={{
                      position:'relative',
                      width:'100%',
                      maxWidth:320,
                      borderRadius:24,
                      background:'#fff',
                      padding:18,
                      boxShadow:'0 18px 48px rgba(0,0,0,0.18)'
                    }}>

                    {/* 🎬 버튼 */}
                    {recommendMovie?.youtubeKey && (
                      <div style={{
                        position:'absolute',
                        top:14,
                        right:14,
                        zIndex:5
                      }}>

                        <div onClick={()=>{
                            setTrailerKey(recommendMovie.youtubeKey)
                          }}
                          
                          style={{
                            width:38,
                            height:38,
                            borderRadius:'50%',
                            background:'rgba(255,255,255,0.9)',
                            border:'1px solid #ece7df',
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center',
                            cursor:'pointer',
                            fontSize:'1.05rem',
                            boxShadow:'0 4px 14px rgba(0,0,0,0.12)'
                        }}>
                        🎬
                        </div>
                      </div>
                    )}



                    {/* 포스터 카드 재사용 */}
                    <div style={{
                      textAlign:'center'
                    }}>

                      {/* 포스터 */}
                      <img
                        src={`https://image.tmdb.org/t/p/w500${recommendMovie.poster_path}`}
                        alt=""
                        style={{
                          width:'60%',
                          maxWidth:220,
                          borderRadius:18,
                          marginBottom:10,
                          boxShadow:'0 14px 34px rgba(0,0,0,0.18)'
                        }}/>


                      {/* 제목 */}
                      <div style={{
                        fontSize:'1.18rem',
                        fontWeight:900,
                        color:'#1a1814',
                        lineHeight:1.3,
                        marginBottom:8
                      }}>

                        {recommendMovie.title}
                      </div>


                      {/* 평점 */}
                      <div style={{
                        fontSize:'0.82rem',
                        fontWeight:700,
                        color:'#ff5f73',
                        marginBottom:10
                      }}>
                        ★ {Number(recommendMovie.vote_average).toFixed(1)} / 10
                      </div>


                      {/* 감독 */}
                      <div style={{
                        fontSize:'0.8rem',
                        color:'#666',
                        marginBottom:2,
                        lineHeight:1.5
                      }}>

                        감독 · {
                          recommendMovie.credits?.crew
                            ?.find(p => p.job === 'Director')
                            ?.name || '-'
                        }
                      </div>


                      {/* 배우 */}
                      <div style={{
                        fontSize:'0.8rem',
                        color:'#666',
                        marginBottom:15,
                        lineHeight:1.5
                      }}>

                        출연 · {
                          recommendMovie.credits?.cast
                            ?.slice(0,3)
                            ?.map(a => a.name)
                            ?.join(' · ')
                          || '-'
                        }
                      </div>


                      {/* 시놉시스 */}
                      <div style={{
                        fontSize:'0.7rem',
                        color:'#666',
                        lineHeight:1.75,
                        display:'-webkit-box',
                        WebkitLineClamp:3,
                        WebkitBoxOrient:'vertical',
                        overflow:'hidden'
                      }}>

                        {recommendMovie.overview}
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {/* 🎬 영화 카드 팝업 */}
                {showMovieCard && movieCard && (

                  <div style={{
                    position:'fixed',
                    inset:0,
                    background:'rgba(0,0,0,0.72)',
                    zIndex:300,
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    padding:'20px'
                  }}>

                    {/* 바깥 터치 닫기 */}
                    <div
                      onClick={()=>setShowMovieCard(false)}
                      style={{
                        position:'absolute',
                        inset:0
                      }}
                    />

                    {/* 카드 */}
                    <div
                      style={{
                        width:'92vw',
                        maxWidth:340,
                        height:'78vh',
                        maxHeight:620,
                        perspective:'1200px',
                        position:'relative',
                        zIndex:2,
                        animation:'fadeUp 0.22s ease'
                      }}
                    >

                      <div
                        onClick={()=>setMovieCardFlipped(v=>!v)}
                        style={{
                          width:'100%',
                          height:'100%',
                          position:'relative',
                          transformStyle:'preserve-3d',
                          transition:'transform 0.7s cubic-bezier(.22,.61,.36,1)',
                          transform: movieCardFlipped
                            ? 'rotateY(180deg)'
                            : 'rotateY(0deg)',
                          cursor:'pointer'
                        }}
                      >

                        {/* 앞면 */}
                        <div style={{
                          position:'absolute',
                          inset:0,
                          borderRadius:28,
                          overflow:'hidden',
                          background:'#111',
                          backfaceVisibility:'hidden',
                          boxShadow:'0 25px 60px rgba(0,0,0,0.45)'
                        }}>

                          {/* 포스터 */}
                          <img
                            src={
                              movieCard.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movieCard.poster_path}`
                                : '/no_poster.webp'
                            }
                            alt="poster"
                            style={{
                              width:'100%',
                              height:'100%',
                              objectFit:'cover'
                            }}
                          />

                          {/* 상단 그라데이션 */}
                          <div style={{
                            position:'absolute',
                            inset:0,
                            background:
                              'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.35) 100%)'
                          }}/>

                          {/* 회전 버튼 */}
                          <div style={{
                            position:'absolute',
                            top:14,
                            right:14,
                            width:38,
                            height:38,
                            borderRadius:'50%',
                            background:'rgba(255,255,255,0.14)',
                            backdropFilter:'blur(10px)',
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center',
                            color:'#fff',
                            fontSize:'1rem',
                            fontWeight:700,
                            border:'1px solid rgba(255,255,255,0.22)'
                          }}>
                            ↻
                          </div>

                          {/* 하단 정보 */}
                          <div style={{
                            position:'absolute',
                            left:22,
                            right:22,
                            bottom:24
                          }}>

                            <div style={{
                              fontSize:'1.6rem',
                              fontWeight:900,
                              color:'#fff',
                              lineHeight:1.12,
                              marginBottom:8,
                              textShadow:'0 4px 16px rgba(0,0,0,0.45)'
                            }}>
                              {movieCard.title}
                            </div>

                            <div style={{
                              fontSize:'0.92rem',
                              color:'rgba(255,255,255,0.78)',
                              fontWeight:500
                            }}>
                              {movieCard.release_date?.slice(0,4)}
                            </div>
                          </div>
                        </div>


                        {/* 뒷면 */}
                        <div style={{
                          position:'absolute',
                          inset:0,
                          borderRadius:28,
                          overflow:'hidden',
                          background:'#141414',
                          backfaceVisibility:'hidden',
                          transform:'rotateY(180deg)',
                          boxShadow:'0 25px 60px rgba(0,0,0,0.45)'
                        }}>

                          {/* 배경 blur */}
                          {movieCard.backdrop_path && (
                            <img
                              src={`https://image.tmdb.org/t/p/w780${movieCard.backdrop_path}`}
                              alt=""
                              style={{
                                position:'absolute',
                                inset:0,
                                width:'100%',
                                height:'100%',
                                objectFit:'cover',
                                filter:'blur(24px)',
                                opacity:0.22,
                                transform:'scale(1.15)'
                              }}
                            />
                          )}

                          <div style={{
                            position:'absolute',
                            inset:0,
                            background:'rgba(10,10,10,0.82)'
                          }}/>

                          {/* 회전 버튼 */}
                          <div style={{
                            position:'absolute',
                            top:14,
                            right:14,
                            width:38,
                            height:38,
                            borderRadius:'50%',
                            background:'rgba(255,255,255,0.14)',
                            backdropFilter:'blur(10px)',
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center',
                            color:'#fff',
                            fontSize:'1rem',
                            fontWeight:700,
                            border:'1px solid rgba(255,255,255,0.22)'
                          }}>
                            ↻
                          </div>

                          {/* 내용 */}
                          <div style={{
                            position:'relative',
                            zIndex:2,
                            height:'100%',
                            overflowY:'auto',
                            padding:'24px 22px 28px'
                          }}>

                            <div style={{
                              fontSize:'1.35rem',
                              fontWeight:900,
                              color:'#fff',
                              lineHeight:1.2,
                              marginBottom:6
                            }}>
                              {movieCard.title}
                            </div>

                            <div style={{
                              fontSize:'0.82rem',
                              color:'rgba(255,255,255,0.62)',
                              marginBottom:20
                            }}>
                              {movieCard.original_title}
                            </div>

                            {[
                              ['개봉', movieCard.release_date
                              ],

                              ['국가', movieCard.production_countries
                                ?.map(c => c.name)
                                ?.join(', ')
                              ],

                              ['평점',
                                movieCard.vote_average?.toFixed(1)
                              ],

                              ['장르', movieCard.genres
                                ?.map(g => g.name)
                                ?.join(', ')
                              ],

                              ['감독', movieCard.credits?.crew
                                ?.find(p => p.job === 'Director')
                                ?.name
                              ],

                              ['출연',
                                movieCard.credits?.cast
                                  ?.slice(0,5)
                                  ?.map(a => a.name)
                                  ?.join(' · ')
                              ],

                              ['영상', movieCard.youtubeKey]

                            ].map(([k,v],i)=>(
                              <div
                                key={i}
                                style={{
                                  display:'flex',
                                  marginBottom:10
                                }}
                              >
                                <div style={{
                                  width:54,
                                  color:'rgba(255,255,255,0.45)',
                                  fontSize:'0.76rem',
                                  fontWeight:700
                                }}>
                                  {k}
                                </div>

                                <div style={{
                                  flex:1,
                                  color:'#fff',
                                  fontSize:'0.82rem',
                                  lineHeight:1.5
                                }}>

                                  {k === '영상' ? (
                                    v ? (
                                      <span
                                        onClick={()=>
                                          setTrailerKey(movieCard.youtubeKey)
                                        }
                                        style={{
                                          color:'#ff7b8d',
                                          fontWeight:800,
                                          cursor:'pointer'
                                        }}
                                      >
                                        🎬 영상 보기
                                      </span>
                                    ) : '-'
                                  ) : (
                                    v || '-'
                                  )}
                                </div>
                              </div>
                            ))}

                            {/* 시놉시스 */}
                            <div style={{
                              marginTop:24
                            }}>

                              <div style={{
                                fontSize:'0.8rem',
                                fontWeight:800,
                                color:'rgba(255,255,255,0.55)',
                                marginBottom:10
                              }}>
                                SYNOPSIS
                              </div>

                              <div style={{
                                fontSize:'0.86rem',
                                lineHeight:1.72,
                                color:'rgba(255,255,255,0.9)',
                                wordBreak:'keep-all'
                              }}>
                                {movieCard.overview || '시놉시스 정보 없음'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <style jsx>{`
                  @keyframes fadeUp {
                    from {
                      transform: translateY(10px);
                      opacity: 0;
                    }
                    to {
                      transform: translateY(0);
                      opacity: 1;
                    }
                  }
                `}</style>

              </div>
            </AppLayout>
          </>
        )
      })()}



      {/* 유튜브 플레이어 모달 */}
        {trailerKey && (
          console.log('TRAILER MODAL', trailerKey),
          <div
            onClick={()=>setTrailerKey(null)}
            style={{
              position:'fixed',
              inset:0,
              background:'rgba(0,0,0,0.5)',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              zIndex:99999,
              padding:'20px'
          }}>
            <div
              onClick={(e)=>e.stopPropagation()}
              style={{
                width:'100%',
                maxWidth:'960px',
                aspectRatio:'16 / 9',
                background:'#000',
                borderRadius:'10px',
                overflow:'hidden',
                position:'relative',
                boxShadow:'0 10px 40px rgba(0,0,0,0.45)'
            }}>

              {/* 닫기 버튼 */}
              <button
                onClick={()=>setTrailerKey(null)}
                style={{
                  position:'absolute',
                  top:10,
                  right:10,
                  zIndex:10,
                  width:36,
                  height:36,
                  border:'none',
                  borderRadius:'50%',
                  background:'rgba(0,0,0,0.55)',
                  color:'#fff',
                  fontSize:'18px',
                  cursor:'pointer'
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
                allowFullScreen
              />
          </div>
        </div>
      )}
    </>
  )
}