'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

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
  easy: <svg viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="24" fill="#ffe8a0"/><circle cx="22" cy="26" r="4" fill="#1a1a1a"/><circle cx="38" cy="26" r="4" fill="#1a1a1a"/><circle cx="21" cy="25" r="1.5" fill="#fff"/><circle cx="37" cy="25" r="1.5" fill="#fff"/><path d="M20 36 Q30 44 40 36" stroke="#c07020" strokeWidth="2.5" fill="none" strokeLinecap="round"/><ellipse cx="18" cy="32" rx="4" ry="3" fill="#ffaa80" opacity=".6"/><ellipse cx="42" cy="32" rx="4" ry="3" fill="#ffaa80" opacity=".6"/></svg>,
  normal: <svg viewBox="0 0 60 60" fill="none"><rect x="10" y="36" width="40" height="20" rx="4" fill="#2a2a4a"/><ellipse cx="30" cy="28" rx="16" ry="17" fill="#c8906a"/><ellipse cx="30" cy="18" rx="16" ry="8" fill="#1a1a1a"/><rect x="12" y="16" width="36" height="5" rx="2" fill="#111"/><ellipse cx="22" cy="26" rx="4" ry="3.5" fill="#1a1a1a" opacity=".7"/><ellipse cx="38" cy="26" rx="4" ry="3.5" fill="#1a1a1a" opacity=".7"/><path d="M23 36 Q30 39 37 36" stroke="#8a6040" strokeWidth="1.5" fill="none"/></svg>,
  hard: <svg viewBox="0 0 60 60" fill="none"><rect x="12" y="38" width="36" height="18" rx="4" fill="#3a1a2a"/><ellipse cx="30" cy="28" rx="16" ry="17" fill="#b08060"/><ellipse cx="30" cy="18" rx="16" ry="8" fill="#1a0a0a"/><path d="M14 18 Q30 10 46 18" fill="#1a0a0a"/><ellipse cx="22" cy="27" rx="5" ry="4" fill="#cc2222" opacity=".8"/><ellipse cx="38" cy="27" rx="5" ry="4" fill="#cc2222" opacity=".8"/><ellipse cx="22" cy="27" rx="2.5" ry="2.5" fill="#1a1a1a"/><ellipse cx="38" cy="27" rx="2.5" ry="2.5" fill="#1a1a1a"/><path d="M20 38 Q25 34 30 36 Q35 34 40 38" stroke="#220000" strokeWidth="2" fill="none"/></svg>,
  expert: <svg viewBox="0 0 60 60" fill="none"><rect x="10" y="38" width="40" height="18" rx="4" fill="#0a0a1a"/><ellipse cx="30" cy="28" rx="17" ry="18" fill="#f0eeea"/><ellipse cx="30" cy="18" rx="17" ry="9" fill="#0a0a1a"/><path d="M13 28 Q30 22 47 28 Q47 38 30 42 Q13 38 13 28" fill="#111" opacity=".85"/><ellipse cx="22" cy="30" rx="5" ry="3.5" fill="#cc4400"/><ellipse cx="38" cy="30" rx="5" ry="3.5" fill="#cc4400"/><ellipse cx="22" cy="30" rx="3" ry="2" fill="#ff6600"/><ellipse cx="38" cy="30" rx="3" ry="2" fill="#ff6600"/></svg>,
}

const GRADES = [
  {id:'easy',  name:'Easy',   color:'#e8808c', bg:'#fff5f6', border:'#fad0d4', desc:'1990년대 이후 헐리우드·한국 블록버스터', subDesc:'누구나 아는 인기작'},
  {id:'normal',name:'Normal', color:'#c8a84a', bg:'#fffbf0', border:'#f0dfa0', desc:'1980년대 이후 헐리우드·한국 흥행작',     subDesc:'영화 좀 본 사람들'},
  {id:'hard',  name:'Hard',   color:'#e07040', bg:'#fff8f5', border:'#f0c4a8', desc:'1970년대 이후 헐리우드·한국·일본·유럽',  subDesc:'영화 마니아 도전'},
  {id:'expert',name:'Expert', color:'#c05060', bg:'#fff5f5', border:'#f0b4b8', desc:'영화제 수상작·독립·예술영화',             subDesc:'진짜 고수만'},
]

const BP = {easy:100,normal:200,hard:300,expert:500}
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
function isCorrect(inp,title,answers=[]){
  const a=normalize(inp)
  for(const c of [title,...answers]){
    const b=normalize(c)
    if(a===b) return true
    if(b.length>=4&&a.length===b.length&&lev(a,b)<=1) return true
  }
  return false
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
  isCorrect
}){
  if(!supabase) {
    alert('❌ supabase 없음')
    return
  }

  const { error } = await supabase.from('game_logs').insert({
    user_id: userId,
    character_id: charId,
    movie_id: movie?.id,
    grade: grade,
    hint_used: hintUsed,
    score_earned: score,
    combo_mode: comboMode,
    is_correct: isCorrect
  })

  if(error){
  console.error('DB 에러:', error.message)
}
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

export default function CineClue() {
  const [screen,   setScreen]   = useState('char')
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
  const [td,       setTd]       = useState(false)
  const [tc,       setTc]       = useState(10)
  const [sidePool, setSidePool] = useState([])
  const [results,  setResults]  = useState([])
  const [loading,  setLoading]  = useState(false)
  const [visibleResults, setVisibleResults] = useState(0)
  const [displayScore,   setDisplayScore]   = useState(0)
  const inputRef = useRef(null)
  const supabase = SUPABASE_URL ? createClient(SUPABASE_URL,SUPABASE_KEY) : null

  const char = CHARS.find(c=>c.id===selChar)
  const g    = GRADES.find(x=>x.id===selGrade)

  // 타이머
  useEffect(()=>{
    if(screen!=='quiz'||answered||td) return
    if(tc<=0){setTd(true);return}
    const t=setTimeout(()=>setTc(v=>v-1),1000)
    return ()=>clearTimeout(t)
  },[screen,answered,td,tc])



  // 결과 화면 순차 노출 + 점수 카운트
  useEffect(()=>{
  if(screen!=='result') return

  setVisibleResults(0)

  const roundScore = results.reduce((s,r)=>s+r.score,0)
  const startScore = score - roundScore
  const tot = score

  setDisplayScore(startScore)

  results.forEach((_,i)=>{
    setTimeout(()=>setVisibleResults(v=>v+1),(i+1)*500)
  })

  setTimeout(()=>{
    let cur = startScore
    const step = Math.ceil((tot - startScore)/60)

    const iv = setInterval(()=>{
      cur = Math.min(cur + step, tot)
      setDisplayScore(cur)
      if(cur >= tot) clearInterval(iv)
    },20)
  }, results.length*500+300)

},[screen])

  async function loadMovies(grade, keepProgress=false){
    setLoading(true)
    try{
      let movies=[]
      if(supabase){
        const{data}=await supabase.from('movies').select('*,hints(*)').eq('grade',grade)
        if(data&&data.length>0) movies=data
      }
      if(!movies.length){alert('DB에 영화 데이터가 없습니다.');setLoading(false);return}
      movies.sort(()=>Math.random()-.5)
      const sel=movies.slice(0,5).map(m=>({
        ...m,
        hintsArr:m.hints?m.hints.sort((a,b)=>a.hint_level-b.hint_level).map(h=>h.hint_text):[],
      }))
      setPool(sel)
setQi(0)
setSh(1)
setResults([]) // ← 이건 유지 (매판 리셋)
setAnswered(false)
setFb('')
setFbt('')
setInput('')
setMode(null)
setComboStreak(0)
setCrazyStreak(0)
setTd(false)
setTc(10)
setSidePool(buildSidePool(sel[0]?.side))
setScreen('quiz')
    }catch(e){console.error(e);alert('오류가 발생했습니다.')}
    setLoading(false)
  }

  function getPts(){ return Math.round((td?BP[selGrade]/2:BP[selGrade]||100)*(mode==='crazy'?5:mode==='combo'?2:1)) }

  function updateCombo(correct,hu){
    if(!correct){setComboStreak(0);setCrazyStreak(0);setMode(null);return}
    if(hu===1){
      const ncs=crazyStreak+1,ns=comboStreak+1
      setCrazyStreak(ncs);setComboStreak(ns)
      if(ncs>=2)setMode('crazy');else if(ns>=2)setMode('combo')
    }else{
      setCrazyStreak(0);if(mode==='crazy')setMode(null)
      const ns=comboStreak+1;setComboStreak(ns)
      if(ns>=2&&!mode)setMode('combo')
    }
  }

  // ── 원본 버튼 로직 ──
 function submit(){
  if(answered||!input.trim()) return

  const m = pool[qi]

  if(isCorrect(input, m.title, Array.isArray(m.answers)?m.answers:[])){
    const gained = getPts()

    updateCombo(true, sh)
    setScore(v=>v+gained)

    // ✅ 정답로그
    saveLog({
      supabase,
      userId:'guest',
      charId: selChar,
      movie: m,
      grade: selGrade,
      hintUsed: sh,
      score: gained,
      comboMode: mode,
      isCorrect: true,
    })

    // ✅ 결과
    setResults(r=>[...r,{
      title:m.title,
      correct:true,
      hintUsed:sh,
      score:gained,
      grade:selGrade,
      country:m.country,
      genre:m.side?.genre||''
    }])

    setFb(`정답! +${gained}점`)
    setFbt('ok')
    setAnswered(true)
    setInput('')

  }else{

    updateCombo(false, sh)

    // ✅ 결과

    setFb(rFB(sh))
    setFbt('ng')
    setInput('')
  }
}

function doSkip(){
  updateCombo(false,0)

  const m = pool[qi]

  // ✅ 스킵로그
  saveLog({
    supabase,
    userId:'guest',
    charId: selChar,
    movie: m,
    grade: selGrade,
    hintUsed: sh,
    score: 0,
    comboMode: mode,
    isCorrect: false,
  })

  // ✅ 결과
  setResults(r=>[...r,{
    title:m.title,
    correct:false,
    hintUsed:0,
    score:0,
    grade:selGrade,
    country:m.country,
    genre:m.side?.genre||''
  }])

  setFb('다음번엔 꼭 맞추길...')
  setFbt('sk')
  setAnswered(true)
}

  function nextH(){
    if(sh<5){setSh(v=>v+1);setFb('');setFbt('');setTimeout(()=>inputRef.current?.focus(),50)}
    else doSkip()
  }

  function nextQ(){
    inputRef.current?.blur()
    if(qi+1>=pool.length){setScreen('result');return}
    const nqi=qi+1
    setQi(nqi);setSh(1);setAnswered(false);setFb('');setFbt('');setInput('')
    setTd(false);setTc(10);setSidePool(buildSidePool(pool[nqi]?.side))
    setTimeout(()=>inputRef.current?.focus(),100)
  }

  // ══════════════════════════════════════════
  // 화면 1: 캐릭터 선택
  // ══════════════════════════════════════════
  if(screen==='char') return(
    <div style={{minHeight:'100vh',background:'#fff',display:'flex',flexDirection:'column',padding:'48px 0 40px'}}>
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

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:36}}>
          {CHARS.map(c=>{
            const sel=selChar===c.id
            return(
              <div key={c.id} onClick={()=>setSelChar(c.id)} style={{
                borderRadius:18,
                border:sel?`3px solid ${c.color}`:'1.5px solid #e8e4dd',
                background:sel?`${c.color}18`:'#faf9f7',
                padding:'16px 6px 12px',display:'flex',flexDirection:'column',
                alignItems:'center',gap:8,cursor:'pointer',
                transition:'all .18s cubic-bezier(.34,1.56,.64,1)',
                boxShadow:sel?`0 6px 22px ${c.color}50`:'0 1px 4px rgba(0,0,0,0.06)',
                transform:sel?'scale(1.06)':'scale(1)',
                position:'relative',
              }}>
                {sel&&(
                  <div style={{position:'absolute',top:8,right:8,width:18,height:18,borderRadius:'50%',background:c.color,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <span style={{color:'#fff',fontSize:'0.6rem',fontWeight:900,lineHeight:1}}>✓</span>
                  </div>
                )}
                <svg viewBox="0 0 80 80" fill="none" style={{width:56,height:56,filter:sel?'none':'grayscale(20%)',transition:'filter .18s'}}>{c.svg.props.children}</svg>
                <div style={{fontSize:'0.6rem',fontWeight:700,color:sel?c.color:'#9a9490',textAlign:'center',lineHeight:1.3,transition:'color .18s'}}>
                  {c.name}
                  <div style={{fontSize:'0.55rem',fontWeight:400,color:sel?`${c.color}aa`:'#b8b4b0',marginTop:2}}>{c.movie}</div>
                </div>
              </div>
            )
          })}
        </div>

        <button
          style={{width:'100%',height:54,borderRadius:14,background:selChar?'#1a1814':'#d4d0cc',color:'#fff',fontSize:'0.9rem',fontWeight:700,border:'none',cursor:selChar?'pointer':'default',transition:'background .2s'}}
          disabled={!selChar}
          onClick={()=>{if(selChar)setScreen('grade')}}>
          입장하기
        </button>
      </div>
    </div>
  )

  // ══════════════════════════════════════════
  // 화면 2: 난이도 선택
  // ══════════════════════════════════════════
  if(screen==='grade') return(
    <div style={{background:'#fff',display:'flex',flexDirection:'column',padding:'28px 0 40px'}}>
      <div style={{padding:'0 20px',display:'flex',alignItems:'center',gap:12,marginBottom:32}}>
        <CharAvatar charId={selChar} size={44}/>
        <div>
          <div style={{fontSize:'0.65rem',color:'#b0aaa3',fontWeight:500}}>플레이어</div>
          <div style={{fontSize:'0.85rem',fontWeight:700,color:'#1a1814'}}>USER ID</div>
        </div>
      </div>

      <div style={{padding:'0 20px'}}>
        <div style={{fontSize:'0.7rem',fontWeight:700,color:'#b0aaa3',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:14}}>
          난이도를 선택하세요
        </div>

        {GRADES.map(gr=>{
          const sel=selGrade===gr.id
          return(
            <div key={gr.id} onClick={()=>setSelGrade(gr.id)} style={{
              borderRadius:16,border:`2px solid ${sel?gr.color:gr.border}`,
              background:sel?gr.bg:'#fff',
              padding:'14px 16px',marginBottom:10,cursor:'pointer',
              display:'flex',alignItems:'center',gap:14,
              transition:'all .2s',
              boxShadow:sel?`0 3px 16px ${gr.color}20`:'0 1px 4px rgba(0,0,0,0.05)',
            }}>
              <div style={{width:52,height:52,borderRadius:12,background:sel?`${gr.color}18`:'#f5f3ef',border:`1.5px solid ${sel?gr.color:gr.border}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden'}}>
                <svg viewBox="0 0 60 60" fill="none" style={{width:52,height:52}}>{GRADE_CHARS[gr.id].props.children}</svg>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:'0.9rem',fontWeight:800,color:sel?gr.color:'#1a1814',marginBottom:3}}>{gr.name}</div>
                <div style={{fontSize:'0.65rem',color:'#a09a93',lineHeight:1.4}}>{gr.desc}</div>
                <div style={{fontSize:'0.6rem',color:sel?gr.color:'#c0bab3',fontWeight:600,marginTop:3}}>{gr.subDesc}</div>
              </div>
              <div style={{width:22,height:22,borderRadius:'50%',border:`2px solid ${sel?gr.color:'#ddd'}`,background:sel?gr.color:'transparent',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                {sel&&<div style={{width:8,height:8,borderRadius:'50%',background:'#fff'}}/>}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{padding:'20px 20px 0',display:'flex',flexDirection:'column',gap:10}}>
        <button
          style={{height:54,borderRadius:14,background:selGrade&&!loading?'#1a1814':'#d4d0cc',color:'#fff',fontSize:'0.9rem',fontWeight:700,border:'none',cursor:selGrade&&!loading?'pointer':'default',transition:'background .2s'}}
          disabled={!selGrade||loading}
          onClick={()=>loadMovies(selGrade, true)}>
          {loading?'로딩 중...':'퀴즈시작'}
        </button>
        <button
          style={{height:44,borderRadius:12,background:'transparent',color:'#9a9490',fontSize:'0.8rem',fontWeight:500,border:'1.5px solid #e8e4dd',cursor:'pointer'}}
          onClick={()=>setScreen('char')}>
          캐릭터 다시 선택
        </button>
      </div>
    </div>
  )

  // ══════════════════════════════════════════
  // 화면 3: 퀴즈
  // ══════════════════════════════════════════
  if(screen==='quiz'&&pool[qi]){
    const m=pool[qi]
    const timerCol=tc>6?'#4a9c6d':tc>3?'#c8a84a':'#d45c5c'

    return(
      <div style={{minHeight:'100dvh',background:'#fff',display:'flex',flexDirection:'column'}}>

        {/* ── 고정 헤더 ── */}
        <div style={{background:'#fff',borderBottom:'1px solid #f0ece6',padding:'14px 20px 0',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
            <CharAvatar charId={selChar} size={34}/>
            <span style={{fontSize:'0.75rem',fontWeight:700,color:'#1a1814',flex:1}}>USER ID</span>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'0.65rem',color:'#b0aaa3'}}>점수</div>
                <div style={{fontSize:'0.9rem',fontWeight:800,color:'#1a1814'}}>{score.toLocaleString()}</div>
              </div>
              {!answered&&(
                <div style={{width:36,height:36,borderRadius:'50%',background:`${timerCol}15`,border:`2.5px solid ${timerCol}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <span style={{fontSize:'0.8rem',fontWeight:800,color:timerCol}}>{tc}</span>
                </div>
              )}
            </div>
          </div>

          {/* 메타 정보 바 */}
          <div style={{display:'flex',alignItems:'center',gap:6,paddingBottom:12,flexWrap:'wrap'}}>
            <span style={{fontSize:'0.62rem',fontWeight:700,padding:'3px 9px',borderRadius:20,background:'#f5f3ef',color:'#6b6560',border:'1px solid #e8e4dd'}}>{qi+1}/5</span>
            <span style={{fontSize:'0.62rem',fontWeight:700,padding:'3px 10px',borderRadius:20,background:g?.color||'#e8808c',color:'#fff'}}>{g?.name}</span>
            {m.country&&<span style={{fontSize:'0.62rem',fontWeight:700,padding:'3px 10px',borderRadius:20,background:'#e8f0fc',color:'#3a6abf',border:'1px solid #c0d4f8'}}>{m.country}</span>}
            {m.side?.genre&&<span style={{fontSize:'0.62rem',fontWeight:700,padding:'3px 10px',borderRadius:20,background:'#e8f5ee',color:'#2e8a52',border:'1px solid #a8dfc0'}}>{m.side.genre}</span>}
            <span style={{fontSize:'0.62rem',fontWeight:700,padding:'3px 9px',borderRadius:20,background:`${g?.color||'#e8808c'}15`,color:g?.color||'#e8808c',border:`1px solid ${g?.color||'#e8808c'}30`,marginLeft:'auto'}}>{getPts()}pt</span>
          </div>
        </div>

        {/* ── 콤보 배너 ── */}
        {mode&&(
          <div style={{margin:'8px 16px 0',borderRadius:10,padding:'7px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',background:mode==='crazy'?'#fff0f0':'#fffbf0',border:`1px solid ${mode==='crazy'?'#f0b4b4':'#f0dfa0'}`}}>
            <span style={{fontSize:'0.72rem',fontWeight:800,color:mode==='crazy'?'#d45c5c':'#c8a84a'}}>{mode==='crazy'?'🔥 CRAZY COMBO':'⚡ COMBO'}</span>
            <span style={{fontSize:'0.68rem',color:mode==='crazy'?'#d45c5c':'#c8a84a'}}>{mode==='crazy'?crazyStreak:comboStreak}연속 ×{mode==='crazy'?5:2}</span>
          </div>
        )}

        {/* ── 스크롤 힌트 영역 ── */}
        <div style={{padding:'12px 16px'}}>
          {Array.from({length:5}).map((_,i)=>{
            if(i>=sh) return null
            const isCurrent=i===sh-1
            const sideItem=i>=1?sidePool[i-1]:null
            return(
              <div key={i}>
                {/* 사이드힌트: 힌트2부터, 해당 힌트 위에 유지 */}
                {sideItem&&(
                  <div style={{borderRadius:10,background:'#faf9f7',border:'1px dashed #e0dcd4',padding:'8px 12px',marginBottom:6,display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:6,height:6,borderRadius:'50%',background:g?.color||'#e8808c',flexShrink:0}}/>
                    <div style={{fontSize:'0.68rem',color:'#9a9490'}}>
                      {sideItem.t==='year'?`📅 ${sideItem.v}`:sideItem.v}
                    </div>
                  </div>
                )}
                {/* 힌트 카드 */}
                <div style={{borderRadius:13,border:`1.5px solid ${isCurrent?g?.color||'#e8808c':'#ece8e2'}`,background:isCurrent?g?.bg||'#fff5f6':'#fff',padding:'13px 15px',marginBottom:8,boxShadow:isCurrent?`0 2px 12px ${g?.color||'#e8808c'}18`:'none'}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:8}}>
                    <span style={{fontSize:'0.58rem',fontWeight:800,padding:'2px 8px',borderRadius:20,whiteSpace:'nowrap',marginTop:2,flexShrink:0,background:g?.color||'#e8808c',color:'#fff'}}>힌트 {i+1}</span>
                    <div style={{flex:1,fontSize:'0.78rem',color:'#1a1814',lineHeight:1.7}}>{m.hintsArr?.[i]||'힌트를 불러오는 중...'}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── 고정 하단 입력/버튼 영역 ── */}
        <div style={{

  background:'#fff',
  borderTop:'1px solid #f0ece6',
  padding:'12px 16px 20px',
  paddingBottom:'env(safe-area-inset-bottom)'
}}>
          {/* 피드백 */}
          {fb&&(
            <div style={{fontSize:'0.78rem',fontWeight:700,marginBottom:8,color:fbt==='ok'?'#4a9c6d':'#d45c5c'}}>
              {fb}
            </div>
          )}

          {/* 원본 버튼 로직 */}
          {!answered ? (
            <>
              <div style={{display:'flex',gap:8,marginBottom:8}}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();e.stopPropagation();submit()}}}
                  placeholder="영화 제목 입력"
                  style={{flex:1,height:46,borderRadius:11,border:`1.5px solid ${input?'#1a1814':'#e8e4dd'}`,background:'#faf9f7',color:'#1a1814',padding:'0 14px',fontSize:'16px',fontFamily:'inherit',outline:'none',transition:'border-color .15s'}}
                  
                />
                <button onClick={submit} style={{height:46,padding:'0 18px',borderRadius:11,background:'#1a1814',color:'#fff',fontSize:'0.8rem',fontWeight:700,border:'none',cursor:'pointer',whiteSpace:'nowrap'}}>
                  정답
                </button>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button
                  onClick={nextH}
                  disabled={sh>=5}
                  style={{flex:1,height:40,borderRadius:10,fontSize:'0.72rem',fontWeight:700,cursor:'pointer',background:'#f5f3ef',color:sh>=5?'#c0bbb4':'#6b6560',border:'1.5px solid #e8e4dd',opacity:sh>=5?0.5:1,transition:'all .15s'}}>
                  다음 힌트 ({sh}/5)
                </button>
                <button
                  onClick={doSkip}
                  style={{flex:1,height:40,borderRadius:10,fontSize:'0.72rem',fontWeight:700,cursor:'pointer',background:'#fff5f6',color:'#d45c5c',border:'1.5px solid #fad0d4'}}>
                  넘기기
                </button>
              </div>
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
        fontSize:'0.85rem',
        fontWeight:800,
        cursor:'pointer',
        background:'#1a1814',
        color:'#fff',
        border:'none'
      }}
    >
      {qi+1<pool.length ? '다음 문제 →' : '결과 보기 →'}
    </button>

    <div style={{
      fontSize:'0.65rem',
      color:'#b0aaa3',
      textAlign:'center',
      marginTop:6
    }}>
      Enter 키로도 넘어갈 수 있어요
    </div>
  </>
)}
        </div>
      </div>
    )
  }

 // ══════════════════════════════════════════
// 화면 4: 결과
// ══════════════════════════════════════════
if(screen==='result'){
  const tot=results.reduce((s,r)=>s+r.score,0)
  const co=results.filter(r=>r.correct)

  return(
    <div style={{
      minHeight:'100vh',
      background:'#fff',
      display:'flex',
      flexDirection:'column',
      padding:'24px 0 20px'
    }}>
      
      {/* 상단 점수 */}
      <div style={{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        marginBottom:20
      }}>
        <div style={{
          width:80,
          height:80,
          borderRadius:'50%',
          background:'#faf9f7',
          border:'2.5px solid #e8e4dd',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          overflow:'hidden',
          marginBottom:14,
          boxShadow:'0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <svg viewBox="0 0 80 80" fill="none" style={{width:80,height:80}}>
            {char?.svg.props.children}
          </svg>
        </div>

        <div style={{
          fontSize:'0.7rem',
          color:'#b0aaa3',
          fontWeight:600,
          letterSpacing:'0.1em',
          marginBottom:6
        }}>
          USER ID
        </div>

        <div style={{
          fontSize:displayScore>0?'3.5rem':'3rem',
          fontWeight:900,
          color:'#1a1814',
          lineHeight:1,
          letterSpacing:'-2px'
        }}>
          {displayScore.toLocaleString()}
        </div>

        <div style={{
          fontSize:'0.7rem',
          color:'#b0aaa3',
          marginTop:4
        }}>
          점
        </div>
      </div>

      {/* 결과 리스트 + 버튼 */}
      <div style={{padding:'0 20px', paddingBottom:40}}>

        {results.map((r,i)=>{
          if(i>=visibleResults) return null
          const rg=GRADES.find(x=>x.id===r.grade)

          return(
            <div key={i} style={{
              borderRadius:13,
              border:'1.5px solid #ece8e2',
              background:'#fff',
              padding:'12px 16px',
              marginBottom:8,
              display:'flex',
              alignItems:'center',
              gap:12,
              boxShadow:'0 1px 6px rgba(0,0,0,0.05)'
            }}>
              <div style={{
                width:28,
                height:28,
                borderRadius:'50%',
                flexShrink:0,
                background:r.correct?`${rg?.color||'#e8808c'}15`:'#f5f3ef',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                border:`1.5px solid ${r.correct?rg?.color||'#e8808c':'#e8e4dd'}`
              }}>
                <span style={{
                  fontSize:'0.6rem',
                  fontWeight:800,
                  color:r.correct?rg?.color||'#e8808c':'#b0aaa3'
                }}>
                  Q{i+1}
                </span>
              </div>

              <div style={{flex:1,minWidth:0}}>
                <div style={{
                  fontSize:'0.78rem',
                  fontWeight:700,
                  color:r.correct?'#1a1814':'#c0bbb4'
                }}>
                  {r.correct?r.title:'실패'}
                </div>
              </div>

              <div style={{
                fontSize:'0.82rem',
                fontWeight:800,
                color:r.correct?'#4a9c6d':'#d45c5c'
              }}>
                {r.correct?`+${r.score}`:'-'}
              </div>
            </div>
          )
        })}

        {/* 버튼 (리스트 안에 위치) */}
        {visibleResults>=results.length && (
          <div style={{
            marginTop:20,
            display:'flex',
            flexDirection:'column',
            gap:10
          }}>
            <button
              style={{
                height:54,
                borderRadius:14,
                background:'#1a1814',
                color:'#fff',
                fontSize:'0.9rem',
                fontWeight:700,
                border:'none'
              }}
              onClick={()=>loadMovies(selGrade,true)}
            >
              계속하기
            </button>

            <button
              style={{
                height:44,
                borderRadius:12,
                background:'transparent',
                color:'#9a9490',
                fontSize:'0.8rem',
                fontWeight:500,
                border:'1.5px solid #e8e4dd'
              }}
              onClick={()=>{setSelGrade(null);setScreen('grade')}}
            >
              레벨 바꾸기
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

  return null
}
