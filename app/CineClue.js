'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import FlashLetterHint from './FlashLetterHint'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''


const CHARS = [
  { id:'yoda', name:'요다', movie:'스타워즈', color:'#5a9660',
    svg: <svg viewBox="0 0 80 80" fill="none"><ellipse cx="40" cy="52" rx="14" ry="11" fill="#4a7c4e"/><ellipse cx="40" cy="36" rx="16" ry="15" fill="#6aaa6e"/><ellipse cx="8" cy="34" rx="10" ry="5" fill="#5a9660" transform="rotate(-20 8 34)"/><ellipse cx="72" cy="34" rx="10" ry="5" fill="#5a9660" transform="rotate(20 72 34)"/><ellipse cx="34" cy="34" rx="4" ry="4.5" fill="#1a2a1a"/><ellipse cx="46" cy="34" rx="4" ry="4.5" fill="#1a2a1a"/><circle cx="33" cy="33" r="1.5" fill="#fff" opacity=".8"/><circle cx="45" cy="33" r="1.5" fill="#fff" opacity=".8"/><path d="M32 42 Q40 45 48 42" stroke="#3a6040" strokeWidth="1.5" fill="none"/><path d="M28 30 Q30 27 34 29" stroke="#3a6040" strokeWidth="1" fill="none"/><path d="M46 29 Q50 27 52 30" stroke="#3a6040" strokeWidth="1" fill="none"/></svg>},
  { id:'immortan', name:'임모탄', movie:'매드맥스', color:'#4a90e8',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="20" y="50" width="40" height="22" rx="4" fill="#c8c0b0"/><ellipse cx="40" cy="36" rx="18" ry="17" fill="#d4cabb"/><rect x="24" y="38" width="32" height="18" rx="8" fill="#e8e8e8" stroke="#bbb" strokeWidth="1"/><rect x="27" y="41" width="26" height="12" rx="5" fill="#d0d0d0"/>{[30,34,38,42,46].map(x=><line key={x} x1={x} y1="41" x2={x} y2="53" stroke="#bbb" strokeWidth="1"/>)}<ellipse cx="32" cy="31" rx="5" ry="3.5" fill="#5588dd" opacity=".9"/><ellipse cx="48" cy="31" rx="5" ry="3.5" fill="#5588dd" opacity=".9"/><ellipse cx="32" cy="31" rx="3" ry="2.5" fill="#2255aa"/><ellipse cx="48" cy="31" rx="3" ry="2.5" fill="#2255aa"/><ellipse cx="40" cy="20" rx="16" ry="10" fill="#e8e4dc"/></svg>},
  { id:'leon', name:'레옹', movie:'레옹', color:'#888',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="18" y="52" width="44" height="22" rx="4" fill="#2a2a2a"/><ellipse cx="40" cy="36" rx="17" ry="18" fill="#c8956a"/><rect x="22" y="24" width="36" height="7" rx="3" fill="#111"/><circle cx="31" cy="27" r="6" fill="#0a0a0a" stroke="#444" strokeWidth="1.5"/><circle cx="49" cy="27" r="6" fill="#0a0a0a" stroke="#444" strokeWidth="1.5"/><line x1="37" y1="27" x2="43" y2="27" stroke="#444" strokeWidth="1.5"/><path d="M33 44 Q40 47 47 44" stroke="#8a6040" strokeWidth="1.5" fill="none"/><ellipse cx="40" cy="20" rx="17" ry="8" fill="#1a1a1a"/></svg>},
  { id:'morpheus', name:'모피어스', movie:'매트릭스', color:'#8866cc',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="15" y="52" width="50" height="22" rx="4" fill="#111"/><ellipse cx="40" cy="36" rx="16" ry="17" fill="#7a5a3a"/><ellipse cx="31" cy="33" rx="7" ry="4.5" fill="#0a0a0a" stroke="#888" strokeWidth="1.5"/><ellipse cx="49" cy="33" rx="7" ry="4.5" fill="#0a0a0a" stroke="#888" strokeWidth="1.5"/><line x1="38" y1="33" x2="42" y2="33" stroke="#888" strokeWidth="1.5"/><path d="M33 45 Q40 49 47 45" stroke="#4a3020" strokeWidth="2" fill="none"/><ellipse cx="40" cy="21" rx="16" ry="9" fill="#5a3a1a"/><ellipse cx="28" cy="64" rx="4" ry="2.5" fill="#dd2222"/><ellipse cx="52" cy="64" rx="4" ry="2.5" fill="#2244cc"/></svg>},
  { id:'pennywise', name:'페니와이즈', movie:'그것', color:'#e07020',
    svg: <svg viewBox="0 0 80 80" fill="none"><ellipse cx="40" cy="68" rx="22" ry="10" fill="#f0f0f0"/><circle cx="28" cy="64" r="4" fill="#dd4444"/><circle cx="40" cy="66" r="4" fill="#dd4444"/><circle cx="52" cy="64" r="4" fill="#dd4444"/><ellipse cx="40" cy="36" rx="18" ry="19" fill="#f5f0e8"/><ellipse cx="12" cy="26" rx="7" ry="10" fill="#dd6600" transform="rotate(-20 12 26)"/><ellipse cx="68" cy="26" rx="7" ry="10" fill="#dd6600" transform="rotate(20 68 26)"/><ellipse cx="31" cy="31" rx="5.5" ry="5.5" fill="#f5dd44"/><ellipse cx="49" cy="31" rx="5.5" ry="5.5" fill="#f5dd44"/><ellipse cx="31" cy="31" rx="3" ry="3.5" fill="#1a1a1a"/><ellipse cx="49" cy="31" rx="3" ry="3.5" fill="#1a1a1a"/><ellipse cx="40" cy="39" rx="4.5" ry="3.5" fill="#dd2222"/><path d="M24 46 Q28 51 40 53 Q52 51 56 46" stroke="#cc1111" strokeWidth="2.5" fill="none"/></svg>},
  { id:'predator', name:'프레데터', movie:'프레데터', color:'#6a9a3a',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="16" y="52" width="48" height="22" rx="4" fill="#5a7a3a"/><ellipse cx="40" cy="36" rx="17" ry="18" fill="#6a8a4a"/>{[-16,-8,0,8,16].map((dx,i)=>(<line key={i} x1={40+dx} y1="20" x2={40+dx*1.5} y2="8" stroke="#4a6a2a" strokeWidth="3" strokeLinecap="round"/>))}<ellipse cx="32" cy="32" rx="4" ry="3" fill="#aadd00"/><ellipse cx="48" cy="32" rx="4" ry="3" fill="#aadd00"/><ellipse cx="32" cy="32" rx="2" ry="2" fill="#88bb00"/><ellipse cx="48" cy="32" rx="2" ry="2" fill="#88bb00"/><path d="M30 43 L33 50 L36 43 L40 50 L44 43 L47 50 L50 43" stroke="#3a5a1a" strokeWidth="1.5" fill="none"/></svg>},
  { id:'sparrow', name:'잭 스패로우', movie:'캐리비안의 해적', color:'#8a5a2a',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="18" y="52" width="44" height="22" rx="4" fill="#3a2a1a"/><ellipse cx="40" cy="37" rx="16" ry="17" fill="#c8906a"/><path d="M16 26 L40 8 L64 26 Z" fill="#1a1a1a"/><rect x="14" y="24" width="52" height="5" rx="2" fill="#2a2a2a"/><ellipse cx="32" cy="34" rx="4.5" ry="3.5" fill="#1a1a1a"/><ellipse cx="48" cy="34" rx="4.5" ry="3.5" fill="#1a1a1a"/><path d="M27 32 Q32 29 37 32" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/><path d="M43 32 Q48 29 53 32" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/><path d="M34 42 Q40 44 46 42" stroke="#5a3a1a" strokeWidth="2" fill="none"/><line x1="38" y1="43" x2="38" y2="48" stroke="#5a3a1a" strokeWidth="1.5"/><line x1="42" y1="43" x2="42" y2="48" stroke="#5a3a1a" strokeWidth="1.5"/><path d="M24 26 Q40 22 56 26 Q56 30 40 32 Q24 30 24 26" fill="#cc3322"/></svg>},
  { id:'joker', name:'조커', movie:'다크나이트', color:'#5533aa',
    svg: <svg viewBox="0 0 80 80" fill="none"><rect x="16" y="52" width="48" height="22" rx="4" fill="#5533aa"/><ellipse cx="40" cy="36" rx="17" ry="18" fill="#f0eeea"/><ellipse cx="31" cy="32" rx="5" ry="4" fill="#1a1a1a" opacity=".8"/><ellipse cx="49" cy="32" rx="5" ry="4" fill="#1a1a1a" opacity=".8"/><path d="M28 35 Q30 40 29 43" stroke="#1a1a1a" strokeWidth="1.5" fill="none" opacity=".6"/><path d="M52 35 Q50 40 51 43" stroke="#1a1a1a" strokeWidth="1.5" fill="none" opacity=".6"/><path d="M22 44 Q27 40 31 44 Q35 48 40 46 Q45 48 49 44 Q53 40 58 44" stroke="#dd2222" strokeWidth="2.5" fill="none"/><ellipse cx="40" cy="20" rx="17" ry="10" fill="#446622"/>{[28,33,38,43,48,53].map((x,i)=>(<line key={i} x1={x} y1="20" x2={x+(i%2===0?-2:2)} y2="10" stroke="#335511" strokeWidth="2.5" strokeLinecap="round"/>))}</svg>},
  { id:'sadako', name:'사다코', movie:'링', color:'#444',
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
  { id:'1990s', name:'1990년대', desc:'타이타닉·더록·킬빌… 이젠 클래식' },
  { id:'old',  name:'오래전 영화', desc:'대부·시민 케인,채플린… 진짜 영화 덕후 영역' }
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





function buildSidePool(side){
  if(!side) return []
  const p=[]
  if(side.year) p.push({t:'year',v:side.year})
  if(side.actors) side.actors.forEach(a=>p.push({t:'a',v:a}))
  if(side.genre) p.push({t:'g',v:side.genre})
  if(side.awards) side.awards.forEach(a=>p.push({t:'aw',v:a}))
  if(side.runtime) p.push({t:'rt',v:side.runtime})
  for(let i=p.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[p[i],p[j]]=[p[j],p[i]]}
  return p
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
  log_type = 'play'
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
    log_type: log_type
  })

  if(error){
  console.error('DB 에러:', error.message)
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

  const [isFlashing, setIsFlashing] = useState(false)
  const [screen,   setScreen]   = useState('intro')
  const [selChar,  setSelChar]  = useState(null)
  const [selGrades, setSelGrades] = useState([])
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
  const [rankingRevealDone, setRankingRevealDone] = useState(false)
  const primaryGrade = selGrades[0] || null
  const [progress, setProgress] = useState(0); // 0 ~ 100
  const duration = quizMode === 'objective' ? 15 : 30; // 총 30초
  const skipTime = 30; // 30초에 자동 실행
  const [buttonActive, setButtonActive] = useState(false);
  const [scoreFlash, setScoreFlash] = useState(false)
  const [scorePop, setScorePop] = useState(false)
  const timerRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [allMovies, setAllMovies] = useState([])
  const UI = {
  surface: '#ffffff',
  border: '#e8e4dd',
  textMain: '#1a1814',
  textSub: '#888',
  textWeak: '#b0aaa3',
  accent: '#ff6b7a'
  }



  // 자동입력시 전체영화 로딩
  useEffect(()=>{
    if(!supabase) return
    fetchAllMovies().then(data=>{
      setAllMovies(data)
    })
  }, [supabase])


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

  useEffect(()=>{
    console.log('genreStats:', genreStats)
  }, [genreStats])


  useEffect(() => {
    if(screen !== 'quiz') return
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
  }, [qi, screen, quizMode, answered])  


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


  function toggleGrade(id){
    setSelGrades(prev=>{
      if(prev.includes(id)){
        return prev.filter(g=>g !== id)
      }
      return [...prev, id]
    })
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
        log_type: 'result'
      })
      const data = await loadRanking({ supabase })
      setRanking(data)
    }
    run()
  }, [screen, supabase, users, selChar, selGrades, nickname, roundStartScore, results])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLevelCompleted, setIsLevelCompleted] = useState(false)
  const inputRef = useRef(null)
  const char = CHARS.find(c=>c.id===selChar)
  const g    = GRADES.find(x=>x.id===selGrades[0])

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
    setSelChar(charId)
    const exists = users.find(u=>u.charId===charId)
    if(!exists){
      setTempChar(charId)
      setShowNameModal(true)
    }
  }


  async function loadMovies(){
    setLoading(true)
    setShowSpinner(true)
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
      const playedIds = (logs || [])
      .map(l => l.movie_id)
      .slice(-300)
      // 3️⃣ 영화 가져오기 (🔥 필터 제거)
      async function fetchMoviesByYears(){
        let query = supabase
          .from('movies')
          .select(`
            *,
            hints(*)
          `)
        const g = selGrades[0]
        if(g === '2020s') query = query.gte('year', 2020)
        if(g === '2010s') query = query.gte('year', 2010).lt('year', 2020)
        if(g === '2000s') query = query.gte('year', 2000).lt('year', 2010)
        if(g === '1990s') query = query.gte('year', 1990).lt('year', 2000)
        if(g === 'old')   query = query.lt('year', 1990)
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
      const filtered = movies.filter(m => {
        if(playedIds.includes(m.id)) return false
        return true
      })
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
      const sel = shuffle(sampled).slice(0,5).map(m=>({
        ...m,
        hintsArr: m.hints
          ? m.hints
            .sort((a,b)=>a.hint_level - b.hint_level)
            .map(h=>h.hint_text)
          : [],
        choices: buildChoices(m, movies)
      }))

      setPool(sel)
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
              return { ...u, score: (u.score || 0) + gained }
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
          log_type: 'play'
        })
        await supabase.rpc('update_genre_stats', {
          p_user_id: String(currentUser.userId),
          p_character_id: selChar,
          p_genre: m.final_genre || '기타',
          p_is_correct: true,
          p_score: gained
        })
        setResults(r => [...r, {
          title: m.title,
          correct: true,
          hintUsed: sh,
          score: gained,
          combo: appliedMode,
          country: m.country,
          genre: m.final_genre || '',
          grade: primaryGrade
        }])
        setFb(`정답! +${gained}점`)
        setFbt('ok')
        setAnswered(true)
        setScoreFlash(true)
        setTimeout(() => {
          setScoreFlash(false)
        }, 300)
        setScorePop(true)
        setTimeout(() => {
          setScorePop(false)
        }, 500)
      } else {
        // 객관식: 첫 오답 클릭이면 콤보 해제
        if(quizMode === 'objective' && wrongCount === 0){
          setComboStreak(0)
          setMode(null)
        }
        // 주관식 오답은 여기서 콤보 해제 안 함
        if(quizMode === 'objective'){
          if(sh >= 5){
            await doSkip()
            return
          }
          if(wrongCount === 0){
            setWrongCount(1)
            nextH()
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
            log_type: 'play'
          })

          await supabase.rpc('update_genre_stats', {
            p_user_id: String(currentUser.userId),
            p_character_id: selChar,
            p_genre: m.final_genre || '기타',
            p_is_correct: false,
            p_score: 0
          })

          setFb(rFB(sh))
          setFbt('ng')
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

  setIsSubmitting(true)
  setComboStreak(0)
  setMode(null)

  const m = pool[qi]

  if(!m){
    setIsSubmitting(false)
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
    isSkip: true,
    nickname: currentUser.nickname,
    genre: m?.final_genre || null,
    log_type: 'play'
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
    title: m.title,
    correct: false,
    hintUsed: 0,
    score: 0,
    country: m.country,
    genre: m.final_genre || '',
    grade: primaryGrade
  }])

  setFb('다음번엔 꼭 맞추길...')
  setFbt('sk')
  setAnswered(true)
  setIsSubmitting(false)
}


function nextH(){
  if(sh < 5){
    setSh(v => v + 1)
    setFb('')
    setFbt('')
  } else {
    doSkip()
  }
}


function nextQ(){

  inputRef.current?.blur()

  setProgress(0)
  setButtonActive(false)

  if(qi + 1 >= pool.length){
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







// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 화면 1: 캐릭터 선택 화면
// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

if(screen === 'intro'){
    return <IntroScreen onEnter={()=>setScreen('char')} />
  }

if(screen==='char') return(
  <AppLayout>
    <div style={{width:'100%',background:'#fff',display:'flex',height:'100dvh',flexDirection:'column',padding:'48px 0 40px',overflowY:'auto'}}>
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
                  cursor:'pointer',
                  transition:'all .18s cubic-bezier(.34,1.56,.64,1)',
                  boxShadow:sel?`0 6px 22px ${c.color}50`:'0 1px 4px rgba(0,0,0,0.06)',
                  transform:sel?'scale(1.06)':'scale(1)',
                  position:'relative',
                }}>

                {sel && (
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
                    <span style={{color:'#fff',fontSize:'0.6rem',fontWeight:900}}>✓</span>
                  </div>
                )}

                {u && (
                  <div
                    onClick={(e)=>{
                      e.stopPropagation()
                      deleteUser(c.id)
                    }}
                    style={{
                      position:'absolute',
                      top:8,
                      left:8,
                      fontSize:11,
                      background:'#000',
                      color:'#fff',
                      borderRadius:6,
                      padding:'2px 6px',
                      cursor:'pointer'
                    }}>
                    ✕
                  </div>
                )}

                <svg viewBox="0 0 80 80" fill="none" style={{width:56,height:56}}>
                  {c.svg.props.children}
                </svg>

                <div style={{
                  fontSize:'0.6rem',
                  fontWeight:700,
                  color:sel?c.color:'#9a9490',
                  textAlign:'center',
                  lineHeight:1.3,
                }}>
                  {u ? u.nickname : c.name}

                  <div style={{
                    fontSize:'0.55rem',
                    fontWeight:500,
                    marginTop:2,
                    color:'#b8b4b0'
                  }}>
                    {u ? (u.score || 0) : ''}
                  </div>
                </div>
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
            background:users.find(u=>u.charId===selChar)?'#1a1814':'#d4d0cc',
            color:'#fff',
            fontSize:'0.9rem',
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
                if(e.target.value.length<=11){
                  setNickname(e.target.value)
                }
              }}
              placeholder="최대 11자"
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
)





// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 화면 2: 기간(grade) 선택 화면
// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

if(screen==='grade') return(
  <AppLayout>
    <div style={{background:'#fff',display:'flex',flexDirection:'column',padding:'40px 0 40px',height:'100vh',overflowY:'auto'}}>

      <div style={{padding:'0 20px'}}>

        <div style={{
          fontSize:'0.7rem',
          fontWeight:700,
          color:'#b0aaa3',
          letterSpacing:'0.15em',
          textTransform:'uppercase',
          marginBottom:14
        }}>
          도전할 시대를 골라보세요 *여러 개 선택 OK
        </div>

        <div style={{display:'flex', gap:8, marginBottom:16}}>
          <button
            onClick={()=>setQuizMode('subjective')}
            style={{
              flex:1,
              height:40,
              borderRadius:10,
              background:quizMode==='subjective'?'#1a1814':'#eee',
              color:quizMode==='subjective'?'#fff':'#000',
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
              background:quizMode==='objective'?'#1a1814':'#eee',
              color:quizMode==='objective'?'#fff':'#000',
              fontWeight:700
            }}>
            객관식
          </button>
        </div>

        {GRADES.map(gr=>{
          const sel = selGrades.includes(gr.id)
          const color = gr.color || '#e8808c'
          const border = gr.border || '#e8e4dd'
          const bg = gr.bg || '#fff5f6'

          return(
            <div
              key={gr.id}
              onClick={()=>toggleGrade(gr.id)}
              style={{
                borderRadius:16,
                border:`2px solid ${sel ? color : border}`,
                background: sel ? bg : '#fff',
                padding:'12px 16px',
                marginBottom:10,
                cursor:'pointer',
                display:'flex',
                alignItems:'center',
                gap:14,
                transition:'all .2s',
                boxShadow: sel
                  ? `0 3px 16px ${color}20`
                  : '0 1px 4px rgba(0,0,0,0.05)',
              }}>

              {/* 아이콘 */}
              <div style={{
                width:52,
                height:52,
                borderRadius:12,
                background: sel ? `${color}18` : '#f5f3ef',
                border:`1.5px solid ${sel ? color : border}`,
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                flexShrink:0,
                overflow:'hidden'
              }}>
                <svg viewBox="0 0 60 60" fill="none" style={{width:52,height:52}}>
                  {GRADE_CHARS?.[gr.id]?.props?.children}
                </svg>
              </div>

              {/* 텍스트 */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{
                  fontSize:'0.9rem',
                  fontWeight:800,
                  color: sel ? color : '#1a1814',
                  marginBottom:3
                }}>
                  {gr.name}
                </div>

                <div style={{
                  fontSize:'0.65rem',
                  color:'#a09a93',
                  lineHeight:1.4
                }}>
                  {gr.desc}
                </div>

                <div style={{
                  fontSize:'0.6rem',
                  color: sel ? color : '#c0bab3',
                  fontWeight:600,
                  marginTop:3
                }}>
                  {gr.subDesc}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 버튼 영역 */}
      <div style={{
        padding:'12px 20px 0',
        display:'flex',
        flexDirection:'row',
        gap:10
      }}>

        {/* 퀴즈시작 버튼 */}
        <button
          style={{
            flex:1,
            height:54,
            borderRadius:14,
            background: selGrades.length > 0 && !loading ? '#1a1814' : '#d4d0cc',
            color:'#fff',
            fontSize:'0.9rem',
            fontWeight:700,
            border:'none',
            cursor: selGrades.length > 0 && !loading ? 'pointer' : 'default'
          }}
          disabled={selGrades.length === 0 || loading}
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
            color:'#9a9490',
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
  </AppLayout>
)







// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 화면 3: 퀴즈 화면
// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

if(screen === 'quiz'){
   // 퀴즈화면 로딩시 스피너 노출
  if(loading || !pool || pool.length === 0 || !pool[qi]){
    return (
      <div style={{
        height:'100vh',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        background:'#fff'
      }}>
        <CharacterSpinner />
      </div>
    )
  }

  // 퀴즈화면 pool 선언 후 시작
  const m = pool[qi]

  return (
    <AppLayout>
      <div style={{
        width:'100%',
        background:'#fff',
        display:'flex',
        flexDirection:'column',
        flex:1,
        overflow:auto
      }}>
        {/*퀴즈화면 시작시 스피너 사라짐*/}
        {showSpinner && (
          <CharacterSpinner fadeOut={!showSpinner}/>
        )}
          
        {/* ── 고정 헤더 ── */}
        <div style={{
          background:'#fff',
          borderBottom:'1px solid #f0ece6',
          padding:'14px 20px 0',
          flexShrink:0,
          position:'relative',
          zIndex:20 
        }}>

          {/* 1️⃣ 캐릭터 / 포인트 영역 */}
          <div style={{
            display:'flex',
            alignItems:'center',
            gap:10,
            marginBottom:10
          }}> 
            <CharAvatar charId={selChar} size={34}/>
            <span style={{
              fontSize:'0.75rem',
              fontWeight:700,
              color:'#1a1814',
              flex:1
            }}>
              {users.find(u=>u.charId===selChar)?.nickname || 'USER'}
            </span>

            <span style={{
              fontSize:'0.7rem',
              fontWeight:800,
              padding:'4px 10px',
              borderRadius:20,
              background: `${g?.color||'#e8808c'}15`,
              color: g?.color,
              border:`1px solid ${g?.color||'#e8808c'}30`,
            }}>
              {getPts()}pt
            </span>
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
              fontSize:'0.62rem',
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
                fontSize:'0.62rem',
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
                fontSize:'0.62rem',
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
                fontSize:'0.62rem',
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
                    fontSize:'0.62rem',
                    fontWeight:700,
                    padding:'3px 10px',
                    borderRadius:20,
                    background:'#fff3e0',
                    color:'#cc7a00',
                    border:'1px solid #ffd8a8',
                    flexShrink:0  
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

        {/* ── 콤보 배너 ── */}
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
                  mode==='wow' ? '🔥 미친 상승감!!! 제니퍼 로페즈 아나콘다!! 스스메!! 🔥':
                  mode==='crazy' ? '💀 뇌야 돌아라!! 손아 날아라!! 이건 끝까지 간다!! 💀':
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
          overscrollBehavior:'contain',
          scrollBehavior:'auto',
          touchAction:'pan-y'
        }}>


          {/* 힌트 리스트 */}
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
                      fontSize:'0.6rem',
                      fontWeight:800,
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center',
                      flexShrink:0
                    }}>
                    {i + 1}
                    </span>

                    <div style={{
                      fontSize:'0.78rem',
                      lineHeight:1.7
                    }}>
                    {m.hintsArr?.[i] || '힌트 로딩중...'}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* ── 입력 & 버튼 ── */}
          <div style={{
            position:'sticky',   
            bottom:0,            
            background:'#fff',
            marginTop:16,
            paddingBottom: '20px',
            flexShrink:0
          }}>
            {fb && (
              <div style={{
                fontSize:'0.78rem',
                fontWeight:700,
                marginBottom:8,
                color:fbt==='ok' ? '#4a9c6d' : '#d45c5c'
              }}>
                {fb}
              </div>
            )}

            {!answered ? (
              <>
                {/* 힌트보기 넘기기 버튼 */}
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
                        background: 'rgba(167, 48, 48, 0.61)',
                        transition: 'width 0.5s linear',
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
                      {/* 🔥 주관식 모드 답 입력 영역 */}
                      <div style={{
                        position:'relative',
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
                            if(e.key==='Enter'){
                            e.preventDefault()
                            submit()
                            }
                          }}
                          placeholder="영화 제목 입력"
                          style={{
                            flex:1,
                            height:46,
                            borderRadius:11,
                            border:`1.5px solid ${input?'#1a1814':'#e8e4dd'}`,
                            background:'#faf9f7',
                            padding:'0 14px'
                          }}
                        />

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
                                  cursor:'pointer'
                              }}>
                                {s.title}
                              </div>
                            ))}
                          </div>
                        )}

                          <button
                            onClick={()=>submit()}
                            style={{
                              width:72,
                              height:46,
                              borderRadius:11,
                              background:'#1a1814',
                              color:'#fff',
                              fontWeight:700,
                              border:'none'
                            }}>
                              정답
                          </button>
                      </div>
                    </>
                )}
              </>
            ) : (
              <>
                {fbt==='ok' && (
                  <div style={{
                    fontSize:'1.1rem',
                    fontWeight:900,
                    color:'#c8a84a',
                    marginBottom:12,
                    textAlign:'center'
                  }}>
                    {m.title}
                  </div>
                )}
                <button
                  onClick={nextQ}
                  style={{
                    width:'100%',
                    height:46,
                    borderRadius:12,
                    background:'#1a1814',
                    color:'#fff',
                    fontWeight:800,
                    border:'none'
                  }}>
                  {qi+1<pool.length ? '다음 문제 →' : '결과 보기 →'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
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
    </AppLayout>
  )
}






// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 화면 4: 결과 화면
// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

if(screen==='result'){
  const safeUsers = Array.isArray(users) ? users : []
  const user = safeUsers.find(u => u.charId === selChar)
  const baseScore = user?.score ?? 0
  const roundScore = (results ?? []).reduce((s,r)=>s+r.score,0)
  const tot = baseScore + roundScore
  const nickname = user?.nickname || 'USER'
  const currentGrade = selGrades?.[0]

  return(
    <AppLayout>
    <div style={{
      height:'100dvh',
      overflow:'hidden',
      background:'#fff',
      display:'flex',
      flexDirection:'column',
      padding:'12px 0 8px',
    }}>


      {/* 상단영역*/}
      <div style={{
      flexShrink:0,
      paddingTop:12,
      display:'flex',           
      flexDirection:'column',    
      alignItems:'center' 
      }}>
        <div style={{
          width:75,
          height:75,
          borderRadius:'50%',
          background:'#faf9f7',
          border:'2.5px solid #e8e4dd',
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
              fontSize:'0.7rem',
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


      {/*결과리스트 영역*/}

      <div style={{
        padding:'0 20px',
        // 🔥 핵심 1: score 기준 높이 고정
        height: `${Math.min(results.length, 5) * 65}px`,
        // 🔥 핵심 2: ranking은 스크롤만
        overflowY: 'auto',
        WebkitOverflowScrolling:'touch',
        overscrollBehavior:'contain'
      }}>

  {resultView === 'score' ? (

    results.slice(0, visibleResults).map((r,i)=>{

      const rg = GRADES.find(x=>x.id===r.grade)

      const isCorrect = r.correct === true

      return(

        <div key={i} style={{

          borderRadius:13,

          border:'1.5px solid #ece8e2',

          background:'#fff',

          padding:'12px 16px',

          marginBottom:8,

          display:'flex',

          alignItems:'center',

          gap:12

        }}>

          <div style={{

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

              fontSize:'0.6rem',

              fontWeight:800,

              color:r.correct ? rg?.color : '#b0aaa3'

            }}>

              Q{i+1}

            </span>

          </div>

          <div style={{flex:1}}>

            <div style={{

  fontSize:

    r.correct && r.title.length > 20 ? '0.7rem' :

    r.correct && r.title.length > 14 ? '0.75rem' :

    '0.8rem',

  fontWeight:700,

  color:r.correct ? '#1a1814' : '#c0bbb4',

  lineHeight:1.25,

  wordBreak:'keep-all'

}}>

              {r.correct ? r.title : '실패'}

            </div>

          </div>

          <div style={{
  position:'relative',   // 🔥 핵심
  minWidth:50,
  display:'flex',
  justifyContent:'flex-end'
}}>

  {/* 점수 */}
  <div style={{
    fontSize:'0.85rem',
    fontWeight:800,
    color:r.correct ? '#4a9c6d' : '#d45c5c'
  }}>
    {r.correct ? `+${r.score}` : '-'}
  </div>

  {/* 도장 */}
  {r.combo && (
    <div style={{
      position:'absolute',
      top:-17,
      right:-28,
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
</div>

      )

    })
) : (

  <>

    {(() => {

      const safeRanking = Array.isArray(ranking) ? ranking : []
      const safeUsers = Array.isArray(users) ? users : []
      const TOP_LIMIT = 15

      const myRankIndex = safeRanking.findIndex(
        r => r.character_id === selChar
      )

      const myRank = myRankIndex >= 0 ? myRankIndex + 1 : null
      const myRankData = safeRanking[myRankIndex]

      return (
        <>

          {Array.from({ length: rankingRevealDone ? TOP_LIMIT : 5 }).map((_, i) => {

            const r = safeRanking[i] || null
            const char = r ? CHARS.find(c => c.id === r.character_id) : null
            const isDead = r && !safeUsers.find(u => u.charId === r.character_id)
            const isMe = r && String(r.user_id) === String(currentUser.userId)
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
                  animation: isAnimated ? 'fadeUp 0.3s ease forwards' : 'none',
                  opacity: isAnimated ? 0 : 1,
                  animationDelay: `${i * 0.08}s`
                }}
              >

                <div style={{
                  width:28,
                  height:28,
                  borderRadius:'50%',
                  background:'#f5f3ef',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  border:'1.5px solid #e8e4dd'
                }}>
                  <span style={{
                    fontSize:'0.65rem',
                    fontWeight:800
                  }}>
                    {i+1}위
                  </span>
                </div>

                {r ? (
                  <CharAvatar charId={r.character_id} size={28}/>
                ) : (
                  <div style={{
                    width:28,
                    height:28,
                    borderRadius:'50%',
                    background:'#f0eeea'
                  }}/>
                )}

                <div style={{flex:1}}>
                  <div style={{
                    fontSize:'0.8rem',
                    fontWeight:700,
                    color: r
                      ? isDead ? '#b0aaa3' : '#1a1814'
                      : '#c0bbb4'
                  }}>
                    {r
                      ? isDead
                        ? `${r.nickname || char?.name || 'UNKNOWN'} 💀`
                        : (r.nickname || char?.name || 'USER')
                      : '-'
                    }
                  </div>
                </div>

                <div style={{
                  fontSize:'0.85rem',
                  fontWeight:800,
                  color: r ? '#1a1814' : '#c0bbb4'
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

    flex:1

  }}>

    {myRankData?.nickname || 'USER'}

  </div>

  <div style={{

    fontSize:'0.9rem',

    fontWeight:900

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

      {/* 하단 버튼 */}
      {visibleResults > results.length && (

    <div style={{

  flexShrink:0,

  // 🔥 핵심 3: 위쪽 패딩 줄임 (여기 간격 원인)

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

        background:'#1a1814',

        color:'#fff',

        fontSize:'0.9rem',

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

      {/* 🔥 프로필 팝업: 결과 UI 밖, root 마지막 */}
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
              background:'#faf9f7',
              borderRadius:20,
              border:'1.5px solid #e8e4dd',
              padding:'20px 16px',
              boxShadow:'0 10px 30px rgba(0,0,0,0.1)',
              position:'relative'
            }}>

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
                }}
              >
                <span style={{color:'#1a1814',fontSize:16,fontWeight:700}}>×</span>
              </div>

              <div style={{textAlign:'center', marginBottom:14}}>
                <div style={{fontSize:'0.9rem', color:'#ff6b7a'}}>
                  SF액션
                </div>

                <div style={{
                  fontSize:'1.4rem',
                  fontWeight:900,
                  color:'#1a1814',
                  marginTop:4
                }}>
                  총소리 놀람이
                </div>

                <div style={{
                  fontSize:'0.7rem',
                  color:'#888',
                  marginTop:6
                }}>
                  나나나
                </div>
              </div>

              <div style={{
                width:'100%',
                display:'flex',
                justifyContent:'center',
                marginBottom:14
              }}>
                <div style={{
                  width:'100%',
                  maxWidth:320
                }}>
                  <img
                    src="/sadako_full.png"
                    alt="character"
                    style={{
                      width:'100%',
                      height:140,
                      objectFit:'contain'
                    }}
                  />
                </div>
              </div>

              <div style={{marginBottom:14}}>
                <div style={{
                  fontSize:'1.2rem',
                  fontWeight:800,
                  color:'#1a1814'
                }}>
                  Lv. 20
                </div>

                <div style={{
                  height:6,
                  background:'#eee',
                  borderRadius:10,
                  marginTop:6
                }}>
                  <div style={{
                    width:'80%',
                    height:'100%',
                    background:'#ff6b7a'
                  }}/>
                </div>

                <div style={{
                  fontSize:'0.65rem',
                  color:'#888',
                  textAlign:'right',
                  marginTop:4
                }}>
                  2,450 / 3,000 EXP
                </div>
              </div>

              <div style={{
                display:'flex',
                justifyContent:'center',
                margin:'14px 0'
              }}>

                {(() => {
                  const genres = [
                    {name:'애니', value:50},
                    {name:'SF', value:60},
                    {name:'SF액션', value:85},
                    {name:'SF공포', value:70},
                    {name:'판타지', value:55},
                    {name:'판타지액션', value:65},
                    {name:'공포', value:90},
                    {name:'미스터리', value:65},
                    {name:'액션', value:70},
                    {name:'코미디', value:30},
                    {name:'로맨스', value:40},
                    {name:'드라마', value:45}
                  ]

                  const cx = 100
                  const cy = 100
                  const radius = 70

                  const points = genres.map((g,i)=>{
                    const angle = (Math.PI*2/genres.length)*i - Math.PI/2
                    const cos = Math.cos(angle)
                    const sin = Math.sin(angle)
                    const r = (g.value/100) * radius

                    let labelRadius = radius + 26

                    if(Math.abs(cos) > 0.7){
                      labelRadius = radius + 34
                    }

                    if(Math.abs(cos) > 0.3 && Math.abs(cos) < 0.7){
                      labelRadius = radius + 30
                    }

                    return {
                      x: cx + cos*r,
                      y: cy + sin*r,
                      labelX: cx + cos*labelRadius,
                      labelY: cy + sin*labelRadius,
                      valueX: cx + cos*(radius+10),
                      valueY: cy + sin*(radius+10),
                      name:g.name,
                      value:g.value
                    }
                  })

                  const polygonPoints = points.map(p=>`${p.x},${p.y}`).join(' ')

                  return (
                    <svg width="220" height="220">
                      <defs>
                        <filter id="glow-result">
                          <feGaussianBlur stdDeviation="2"/>
                        </filter>
                      </defs>

                      {[0.25,0.5,0.75,1].map((r,i)=>(
                        <circle
                          key={i}
                          cx={cx}
                          cy={cy}
                          r={radius*r}
                          stroke="rgba(0,0,0,0.08)"
                          fill="none"
                        />
                      ))}

                      {points.map((p,i)=>(
                        <line
                          key={i}
                          x1={cx}
                          y1={cy}
                          x2={p.labelX}
                          y2={p.labelY}
                          stroke="rgba(0,0,0,0.08)"
                        />
                      ))}

                      <polygon
                        points={polygonPoints}
                        fill="rgba(255,107,122,0.35)"
                        stroke="#ff6b7a"
                        strokeWidth="2"
                        filter="url(#glow-result)"
                      />

                      {points.map((p,i)=>(
                        <circle
                          key={i}
                          cx={p.x}
                          cy={p.y}
                          r="3"
                          fill="#ff6b7a"
                        />
                      ))}

                      {points.map((p,i)=>(
                        <text
                          key={i}
                          x={p.labelX}
                          y={p.labelY}
                          fill="#555"
                          fontSize="9"
                          textAnchor="middle"
                          alignmentBaseline="middle"
                        >
                          {p.name}
                        </text>
                      ))}

                      {points.map((p,i)=>(
                        <text
                          key={i}
                          x={p.valueX}
                          y={p.valueY}
                          fill="#ff6b7a"
                          fontSize="10"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {p.value}
                        </text>
                      ))}
                    </svg>
                  )
                })()}

              </div>

              <div style={{
                display:'grid',
                gridTemplateColumns:'1fr 1fr',
                gap:8,
                marginTop:10
              }}>

                {[
                  ['총 점수','12,450'],
                  ['플레이 시간','48h 30m'],
                  ['선호 장르','SF액션, 공포'],
                  ['최근 플레이','2024.05.20']
                ].map(([k,v],i)=>(
                  <div key={i} style={{
                    background:'#fff',
                    border:'1px solid #e8e4dd',
                    borderRadius:10,
                    padding:'8px'
                  }}>
                    <div style={{
                      fontSize:'0.6rem',
                      color:'#888',
                      marginBottom:2
                    }}>
                      {k}
                    </div>
                    <div style={{
                      fontSize:'0.8rem',
                      fontWeight:700,
                      color:'#1a1814'
                    }}>
                      {v}
                    </div>
                  </div>
                ))}

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

    </div></AppLayout>
  )
}

return null
}