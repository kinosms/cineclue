'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''

const CHARS = [
  {id:'yoda',name:'요다',svg:<svg viewBox="0 0 60 60" fill="none"><ellipse cx="30" cy="44" rx="10" ry="8" fill="#3d6b42"/><ellipse cx="30" cy="28" rx="12" ry="12" fill="#5a9660"/><ellipse cx="6" cy="27" rx="8" ry="4.5" fill="#4a7c4e" transform="rotate(-25 6 27)"/><ellipse cx="54" cy="27" rx="8" ry="4.5" fill="#4a7c4e" transform="rotate(25 54 27)"/><ellipse cx="25" cy="27" rx="3.2" ry="3.5" fill="#1a2a1a"/><ellipse cx="35" cy="27" rx="3.2" ry="3.5" fill="#1a2a1a"/><ellipse cx="24.5" cy="26.5" rx="1.2" ry="1.2" fill="#fff" opacity=".9"/><ellipse cx="34.5" cy="26.5" rx="1.2" ry="1.2" fill="#fff" opacity=".9"/><path d="M26 33 Q30 35.5 34 33" stroke="#3a6040" strokeWidth="1.3" fill="none" strokeLinecap="round"/></svg>},
  {id:'gizmo',name:'기즈모',svg:<svg viewBox="0 0 60 60" fill="none"><ellipse cx="30" cy="46" rx="11" ry="9" fill="#c8a87a"/><ellipse cx="11" cy="22" rx="7" ry="11" fill="#c8a87a" transform="rotate(-10 11 22)"/><ellipse cx="11" cy="22" rx="4.5" ry="7.5" fill="#8b6340" transform="rotate(-10 11 22)"/><ellipse cx="49" cy="22" rx="7" ry="11" fill="#c8a87a" transform="rotate(10 49 22)"/><ellipse cx="49" cy="22" rx="4.5" ry="7.5" fill="#8b6340" transform="rotate(10 49 22)"/><ellipse cx="30" cy="28" rx="14" ry="13" fill="#d4b888"/><ellipse cx="24" cy="27" rx="5" ry="5.5" fill="#fff"/><ellipse cx="36" cy="27" rx="5" ry="5.5" fill="#fff"/><ellipse cx="24" cy="27.5" rx="3.5" ry="3.8" fill="#6b3a1a"/><ellipse cx="36" cy="27.5" rx="3.5" ry="3.8" fill="#6b3a1a"/><ellipse cx="24" cy="27.5" rx="2" ry="2.2" fill="#1a0a00"/><ellipse cx="36" cy="27.5" rx="2" ry="2.2" fill="#1a0a00"/></svg>},
  {id:'leon',name:'레옹',svg:<svg viewBox="0 0 60 60" fill="none"><rect x="14" y="40" width="32" height="16" rx="4" fill="#2a2a2a"/><ellipse cx="30" cy="28" rx="13" ry="14" fill="#c8956a"/><ellipse cx="30" cy="16" rx="13" ry="7" fill="#1a1a1a"/><rect x="17" y="16" width="26" height="6" fill="#1a1a1a"/><rect x="15" y="20" width="30" height="4" rx="2" fill="#111"/><circle cx="24" cy="27" r="5" fill="#0a0a0a" stroke="#555" strokeWidth="1.2"/><circle cx="36" cy="27" r="5" fill="#0a0a0a" stroke="#555" strokeWidth="1.2"/><line x1="29" y1="27" x2="31" y2="27" stroke="#555" strokeWidth="1"/></svg>},
  {id:'pennywise',name:'페니와이즈',svg:<svg viewBox="0 0 60 60" fill="none"><ellipse cx="30" cy="52" rx="16" ry="8" fill="#f0f0f0"/><circle cx="22" cy="50" r="3.5" fill="#e05050"/><circle cx="30" cy="51" r="3.5" fill="#e05050"/><circle cx="38" cy="50" r="3.5" fill="#e05050"/><ellipse cx="30" cy="28" rx="14" ry="15" fill="#f5f0e8"/><ellipse cx="9" cy="20" rx="5" ry="8" fill="#e07020" transform="rotate(-20 9 20)"/><ellipse cx="51" cy="20" rx="5" ry="8" fill="#e07020" transform="rotate(20 51 20)"/><ellipse cx="23" cy="24" rx="4.5" ry="4.5" fill="#f5e050"/><ellipse cx="37" cy="24" rx="4.5" ry="4.5" fill="#f5e050"/><ellipse cx="23" cy="24" rx="2.5" ry="2.8" fill="#1a1a1a"/><ellipse cx="37" cy="24" rx="2.5" ry="2.8" fill="#1a1a1a"/><ellipse cx="30" cy="30" rx="3.5" ry="3" fill="#e03030"/><path d="M18 35 Q22 38 30 40 Q38 38 42 35" stroke="#cc2020" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>},
  {id:'immortan',name:'임모탄',svg:<svg viewBox="0 0 60 60" fill="none"><rect x="15" y="40" width="30" height="16" rx="3" fill="#e8e4dc"/><ellipse cx="30" cy="28" rx="13" ry="13" fill="#d4c8b0"/><rect x="18" y="30" width="24" height="14" rx="6" fill="#e8e8e8"/><rect x="20" y="32" width="20" height="10" rx="4" fill="#ddd"/><ellipse cx="24" cy="24" rx="3.5" ry="2.5" fill="#4a90e8"/><ellipse cx="36" cy="24" rx="3.5" ry="2.5" fill="#4a90e8"/></svg>},
  {id:'morpheus',name:'모피어스',svg:<svg viewBox="0 0 60 60" fill="none"><rect x="13" y="40" width="34" height="18" rx="3" fill="#111"/><ellipse cx="30" cy="28" rx="12" ry="13" fill="#7a5a3a"/><ellipse cx="30" cy="19" rx="12" ry="7" fill="#6a4a2a"/><ellipse cx="24" cy="26" rx="5.5" ry="3.2" fill="#0a0a0a" stroke="#888" strokeWidth="1"/><ellipse cx="36" cy="26" rx="5.5" ry="3.2" fill="#0a0a0a" stroke="#888" strokeWidth="1"/><path d="M24 34 Q30 37 36 34" stroke="#3a2a1a" strokeWidth="2.5" fill="none" strokeLinecap="round"/><ellipse cx="22" cy="50" rx="3" ry="1.8" fill="#e03030"/><ellipse cx="38" cy="50" rx="3" ry="1.8" fill="#3060e0"/></svg>},
]

const GRADES = [
  {id:'easy',name:'Easy',icon:'🎬',color:'#4fc97a',desc:'1990년대 이후 헐리우드·한국 블록버스터',badge:'정답률 높음'},
  {id:'normal',name:'Normal',icon:'🎥',color:'#c8a84a',desc:'1980년대 이후 헐리우드·한국 흥행작',badge:'적당한 도전'},
  {id:'hard',name:'Hard',icon:'🎞',color:'#e07040',desc:'1970년대 이후 헐리우드·한국·일본·유럽',badge:'까다로움'},
  {id:'expert',name:'Expert',icon:'📽',color:'#e05252',desc:'영화제 수상작·독립·예술영화 포함',badge:'매우 어려움'},
]

const BP = {easy:100, normal:200, hard:300, expert:500}

const FBW = {
  1:['힌트가 좀 어려웠지?','첫 번째 힌트는 많이 넘기더라고','아직 힌트 4개나 남았어','힌트1 맞추면 진짜 고수지'],
  2:['아깝다. 잘 생각해봐','아니야… 그건 아니지','거의 다 왔는데','느낌이 왔을 것 같은데'],
  3:['이걸 모른다고?','이 영화, 분명 본 적은 있을걸?','이거 모르면 영화 레벨 의심','영화 고수라더니'],
  4:['이건 맞추는 사람 많던데','배우 이름까지 나왔는데?','자존심 안 상해?','거의 다 가르쳐줬잖아'],
  5:['포기 포기','오늘은 여기까지','오늘은 이 영화가 이겼어','언젠가 다시 만날 영화야'],
}

const rFB = (h) => { const a = FBW[h]||FBW[5]; return a[Math.floor(Math.random()*a.length)] }

function normalize(s) { return s.replace(/[\s:!"',.·~…()\[\]/\\]/g,'') }
function levenshtein(a,b) {
  const m=a.length,n=b.length
  const dp=Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i===0?j:j===0?i:0))
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++) dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1])
  return dp[m][n]
}
function isCorrect(input,title) {
  const a=normalize(input),b=normalize(title)
  if(a===b) return true
  if(b.length>=4&&a.length===b.length&&levenshtein(a,b)<=1) return true
  return false
}

function buildSidePool(side) {
  if (!side) return []
  const p = []
  if (side.year) p.push({t:'year',v:side.year})
  if (side.actors) side.actors.forEach(a=>p.push({t:'actor',v:a}))
  if (side.genre) p.push({t:'genre',v:side.genre})
  if (side.awards) side.awards.forEach(a=>p.push({t:'award',v:a}))
  if (side.runtime) p.push({t:'rt',v:side.runtime})
  if (side.nc17) p.push({t:'nc17',v:'NC-17 등급'})
  for(let i=p.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1));[p[i],p[j]]=[p[j],p[i]] }
  return p
}

const S = {
  screen: {minHeight:'100vh',background:'#080808',padding:'1.2rem 1rem 3rem'},
  max: {maxWidth:600,margin:'0 auto'},
  btnGold: {height:50,borderRadius:10,border:'none',background:'#c8a84a',color:'#080808',fontSize:15,fontWeight:500,cursor:'pointer',width:'100%',fontFamily:'system-ui,sans-serif'},
  btnGhost: {height:44,borderRadius:8,border:'1px solid rgba(255,255,255,0.25)',background:'rgba(255,255,255,0.06)',color:'#ede8de',fontSize:13,cursor:'pointer',width:'100%',fontFamily:'system-ui,sans-serif'},
  btnAns: {height:46,padding:'0 14px',borderRadius:10,border:'none',background:'#c8a84a',color:'#080808',fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:'system-ui,sans-serif'},
  btnNh: {flex:1,height:38,borderRadius:8,border:'1px solid rgba(255,255,255,0.25)',background:'rgba(255,255,255,0.06)',color:'#ede8de',fontSize:12,cursor:'pointer',fontFamily:'system-ui,sans-serif'},
  btnSk: {flex:1,height:38,borderRadius:8,border:'1px solid rgba(224,82,82,0.5)',background:'rgba(224,82,82,0.07)',color:'#e05252',fontSize:12,cursor:'pointer',fontFamily:'system-ui,sans-serif'},
  btnNxt: {width:'100%',height:46,borderRadius:10,border:'1px solid rgba(255,255,255,0.25)',background:'rgba(255,255,255,0.06)',color:'#ede8de',fontSize:14,cursor:'pointer',marginTop:12,fontFamily:'system-ui,sans-serif'},
}

export default function CineClue() {
  const [screen, setScreen] = useState('char')
  const [selChar, setSelChar] = useState(null)
  const [selGrade, setSelGrade] = useState(null)
  const [pool, setPool] = useState([])
  const [qi, setQi] = useState(0)
  const [sh, setSh] = useState(1)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [fb, setFb] = useState('')
  const [fbt, setFbt] = useState('')
  const [input, setInput] = useState('')
  const [comboStreak, setComboStreak] = useState(0)
  const [crazyStreak, setCrazyStreak] = useState(0)
  const [mode, setMode] = useState(null)
  const [td, setTd] = useState(false)
  const [tc, setTc] = useState(10)
  const [sidePool, setSidePool] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [pendingRep, setPendingRep] = useState({})

  const supabase = SUPABASE_URL ? createClient(SUPABASE_URL, SUPABASE_KEY) : null

  const getMult = useCallback(() => mode==='crazy'?5:mode==='combo'?2:1, [mode])
  const getPts = useCallback(() => Math.round((td ? BP[selGrade]/2 : BP[selGrade]||100) * getMult()), [td, selGrade, getMult])

  // 타이머
  useEffect(() => {
    if (screen !== 'quiz' || answered || td) return
    if (tc <= 0) { setTd(true); return }
    const timer = setTimeout(() => setTc(t => t-1), 1000)
    return () => clearTimeout(timer)
  }, [screen, answered, td, tc])

  // 엔터키로 다음 문제
  useEffect(() => {
    const handler = (e) => {
		if (e.target && (
  e.target.tagName === 'INPUT' ||
  e.target.tagName === 'TEXTAREA' ||
  e.target.isContentEditable
)) return
		if (e.key === 'Enter' && answered && screen === 'quiz') nextQ() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [answered, screen, qi, pool])

  async function loadMovies(grade) {
    setLoading(true)
    try {
      let movies = []
      if (supabase) {
        const { data } = await supabase.from('movies').select('*, hints(*)').eq('grade', grade)
        if (data && data.length > 0) movies = data
      }
      if (movies.length === 0) {
        alert('DB 연결이 필요합니다. .env.local 파일에 Supabase 키를 설정해주세요.')
        setLoading(false)
        return
      }
      movies.sort(() => Math.random() - 0.5)
      const selected = movies.slice(0, 5).map(m => ({
        ...m,
        hintsArr: m.hints ? m.hints.sort((a,b)=>a.hint_level-b.hint_level).map(h=>h.hint_text) : [],
        pts: [500,400,300,200,100],
      }))
      setPool(selected)
      setQi(0); setSh(1); setScore(0); setAnswered(false); setFb(''); setFbt(''); setInput('')
      setComboStreak(0); setCrazyStreak(0); setMode(null); setTd(false); setTc(10)
      setResults([]); setPendingRep({})
      setSidePool(buildSidePool(selected[0]?.side))
      setScreen('quiz')
    } catch(e) {
      console.error(e)
      alert('영화 데이터를 불러오지 못했습니다.')
    }
    setLoading(false)
  }

  function updateCombo(correct, hintUsed) {
    if (!correct) { setComboStreak(0); setCrazyStreak(0); setMode(null); return }
    if (hintUsed === 1) {
      const ncs = crazyStreak + 1, ns = comboStreak + 1
      setCrazyStreak(ncs); setComboStreak(ns)
      if (ncs >= 2) setMode('crazy')
      else if (ns >= 2) setMode('combo')
    } else {
      setCrazyStreak(0)
      if (mode === 'crazy') setMode(null)
      const ns = comboStreak + 1; setComboStreak(ns)
      if (ns >= 2 && mode === null) setMode('combo')
    }
  }
  const [isSubmitting, setIsSubmitting] = useState(false)
  async function submit() {
    if (answered || !input.trim()) return
	setIsSubmitting(true)
    const m = pool[qi]
    if (isCorrect(input, m.title)) {
      const gained = getPts()
      updateCombo(true, sh)
      setScore(s => s + gained)
      setResults(r => [...r, {title:m.title, correct:true, hintUsed:sh, score:gained}])
	  if (supabase) {
		  await supabase.from('hint_logs').insert({
			  movie_id: m.id,
			  hint_level: sh,
			  is_correct: true
		  })
	  }
	  if (supabase) {
		  await supabase.from('game_logs').insert({
			  character_id: selChar || 'guest',
			  movie_id: m.id,
			  grade: m.grade,
			  hint_used: sh,
			  score_earned: gained,
			  combo_mode: mode,
			  timer_expired: false
  })
}
      setFb(`정답! +${gained}점`); setFbt('ok'); setAnswered(true); setInput('')
    } else {
      setFb(rFB(sh)); setFbt('ng')
	  if (supabase) {
		  await supabase.from('hint_logs').insert({
			  movie_id: m.id,
			  hint_level: sh,
			  is_correct: false
		  })
	  }

      if (sh < 5) setSh(s => s+1)
      setInput('')
    }
	setTimeout(() => setIsSubmitting(false), 200)
  }

  function doSkip() {
    updateCombo(false, 0)
    setResults(r => [...r, {title:pool[qi].title, correct:false, hintUsed:0, score:0}])
    setFb('다음번엔 꼭 맞추길...'); setFbt('sk'); setAnswered(true)
  }

  function nextH() {
    if (sh < 5) { setSh(s=>s+1); setFb(''); setFbt('') }
    else doSkip()
  }

  function nextQ() {
    if (qi + 1 >= pool.length) { showResult(); return }
    const nqi = qi + 1
    setQi(nqi); setSh(1); setAnswered(false); setFb(''); setFbt(''); setInput('')
    setTd(false); setTc(10); setPendingRep({})
    setSidePool(buildSidePool(pool[nqi]?.side))
  }

  function showResult() {
    setScreen('result')
  }

  function goHome() {
    setSelGrade(null); setScreen('char')
  }

  const m = pool[qi]
  const g = GRADES.find(x=>x.id===selGrade)
  const char = CHARS.find(c=>c.id===selChar)
  const timerColor = tc > 6 ? '#4fc97a' : tc > 3 ? '#c8a84a' : '#e05252'

  // ── 캐릭터 선택 ──
  if (screen === 'char') return (
    <div style={S.screen}>
      <div style={{...S.max, display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div style={{fontSize:'3.5rem',fontWeight:700,letterSpacing:'-1px',marginBottom:4}}>Cine<span style={{color:'#c8a84a'}}>Clue</span></div>
        <div style={{fontSize:11,letterSpacing:'0.25em',textTransform:'uppercase',color:'rgba(237,232,222,0.4)',marginBottom:32}}>영화 힌트 퀴즈</div>
        <div style={{fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(237,232,222,0.4)',marginBottom:12,width:'100%',maxWidth:460}}>캐릭터를 선택하세요</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,width:'100%',maxWidth:460,marginBottom:28}}>
          {CHARS.map(c => (
            <div key={c.id} onClick={()=>setSelChar(c.id)}
              style={{border:`1px solid ${selChar===c.id?'#c8a84a':'rgba(255,255,255,0.12)'}`,borderRadius:12,background:selChar===c.id?'rgba(200,168,74,0.07)':'#111',cursor:'pointer',padding:'1rem 0.6rem 0.8rem',display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
              <svg viewBox="0 0 60 60" fill="none" style={{width:52,height:52}}>{c.svg.props.children}</svg>
              <div style={{fontSize:11,color:selChar===c.id?'#c8a84a':'rgba(237,232,222,0.5)'}}>{c.name}</div>
            </div>
          ))}
        </div>
        <div style={{width:'100%',maxWidth:460}}>
          <button style={{...S.btnGold,opacity:selChar?1:0.35}} disabled={!selChar} onClick={()=>{if(selChar)setScreen('grade')}}>시작하기 →</button>
        </div>
      </div>
    </div>
  )

  // ── 난이도 선택 ──
  if (screen === 'grade') return (
    <div style={S.screen}>
      <div style={S.max}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:24}}>
          <div style={{width:38,height:38,borderRadius:'50%',background:'#111',border:'1px solid rgba(255,255,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',flexShrink:0}}>
            <svg viewBox="0 0 60 60" fill="none" style={{width:30,height:30}}>{char?.svg.props.children}</svg>
          </div>
          <div><div style={{fontSize:13,fontWeight:500,color:'#ede8de'}}>{char?.name}</div><div style={{fontSize:11,color:'rgba(237,232,222,0.4)'}}>선택됨</div></div>
        </div>
        <div style={{fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(237,232,222,0.4)',marginBottom:10}}>난이도 선택</div>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
          {GRADES.map(gr => (
            <div key={gr.id} onClick={()=>setSelGrade(gr.id)}
              style={{border:`1px solid ${selGrade===gr.id?gr.color:'rgba(255,255,255,0.12)'}`,borderRadius:12,background:'#111',cursor:'pointer',padding:'1rem 1.2rem',display:'flex',alignItems:'center',gap:12}}>
              <div style={{fontSize:'1.2rem',width:28,flexShrink:0}}>{gr.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:500,color:selGrade===gr.id?gr.color:'#ede8de',marginBottom:2}}>{gr.name}</div>
                <div style={{fontSize:11,color:'rgba(237,232,222,0.4)',lineHeight:1.4}}>{gr.desc}</div>
              </div>
              <div style={{fontSize:10,fontWeight:500,padding:'2px 8px',borderRadius:20,color:gr.color,background:`${gr.color}18`,border:`1px solid ${gr.color}30`,flexShrink:0}}>{gr.badge}</div>
            </div>
          ))}
        </div>
        <button style={{...S.btnGold,opacity:selGrade&&!loading?1:0.35}} disabled={!selGrade||loading} onClick={()=>loadMovies(selGrade)}>
          {loading ? '로딩 중...' : '퀴즈 시작 →'}
        </button>
        <div style={{marginTop:8}}><button style={S.btnGhost} onClick={()=>setScreen('char')}>← 캐릭터 다시 선택</button></div>
      </div>
    </div>
  )

  // ── 퀴즈 ──
  if (screen === 'quiz' && m) return (
    <div style={S.screen}>
      <div style={S.max}>
        {/* 상단 */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:32,height:32,borderRadius:'50%',background:'#111',border:'1px solid rgba(255,255,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',flexShrink:0}}>
              <svg viewBox="0 0 60 60" fill="none" style={{width:26,height:26}}>{char?.svg.props.children}</svg>
            </div>
            <span style={{fontSize:13,color:'rgba(237,232,222,0.5)'}}>Q{qi+1}/{pool.length}</span>
          </div>
          <div style={{fontSize:13,fontWeight:500,color:'#c8a84a',background:'rgba(200,168,74,0.1)',padding:'3px 10px',borderRadius:20,border:'1px solid rgba(200,168,74,0.2)'}}>{score}점</div>
        </div>

        {/* 프로그레스 */}
        <div style={{height:2,background:'#191919',borderRadius:2,marginBottom:8}}>
          <div style={{height:2,background:'#c8a84a',borderRadius:2,width:`${(qi/pool.length)*100}%`,transition:'width .4s'}}/>
        </div>

        {/* 타이머 */}
        {!answered && !td && (
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <div style={{fontSize:'1.5rem',fontWeight:500,minWidth:26,textAlign:'center',color:timerColor}}>{tc}</div>
            <div style={{flex:1,height:3,background:'#222',borderRadius:2}}>
              <div style={{height:3,borderRadius:2,background:timerColor,width:`${tc/10*100}%`,transition:'width 1s linear'}}/>
            </div>
            <div style={{fontSize:11,color:'rgba(237,232,222,0.4)',whiteSpace:'nowrap'}}>{BP[selGrade]}점 → {BP[selGrade]/2}점</div>
          </div>
        )}

        {/* 콤보 */}
        {mode && (
          <div style={{borderRadius:10,padding:'9px 14px',marginBottom:8,display:'flex',alignItems:'center',justifyContent:'space-between',
            background:mode==='crazy'?'rgba(224,82,82,0.1)':'rgba(200,168,74,0.1)',
            border:mode==='crazy'?'1px solid rgba(224,82,82,0.4)':'1px solid rgba(200,168,74,0.3)'}}>
            <span style={{fontSize:13,fontWeight:500,color:mode==='crazy'?'#ff6b6b':'#c8a84a'}}>{mode==='crazy'?'CRAZY COMBO':'COMBO'}</span>
            <span style={{fontSize:12,color:mode==='crazy'?'rgba(255,107,107,0.6)':'rgba(200,168,74,0.6)'}}>{mode==='crazy'?crazyStreak:comboStreak}연속</span>
            <span style={{fontSize:11,padding:'2px 8px',borderRadius:20,fontWeight:500,
              background:mode==='crazy'?'rgba(224,82,82,0.15)':'rgba(200,168,74,0.15)',
              color:mode==='crazy'?'#ff6b6b':'#c8a84a',
              border:mode==='crazy'?'1px solid rgba(224,82,82,0.3)':'1px solid rgba(200,168,74,0.25)'}}>{mode==='crazy'?'x5':'x2'}</span>
          </div>
        )}

        {/* 난이도 칩 */}
        <div style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,padding:'3px 9px',borderRadius:20,border:'1px solid rgba(255,255,255,0.12)',color:'rgba(237,232,222,0.6)',marginBottom:12}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:g?.color,display:'inline-block'}}/>
          <span style={{color:g?.color}}>{g?.name}</span>
          <span> · {m.country}</span>
        </div>

        {/* 퀴즈 메인 */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 96px',gap:10,alignItems:'start'}}>
          <div>
            {/* 힌트 카드 */}
            {Array.from({length:5}).map((_,i) => {
              if (i < sh) return (
                <div key={i} style={{borderRadius:10,border:'1px solid rgba(255,255,255,0.1)',padding:'12px 14px',background:'#111',display:'flex',gap:9,alignItems:'flex-start',marginBottom:9}}>
                  <span style={{fontSize:10,fontWeight:500,padding:'2px 6px',borderRadius:20,whiteSpace:'nowrap',marginTop:2,flexShrink:0,color:'#c8a84a',background:'rgba(200,168,74,0.12)',border:'1px solid rgba(200,168,74,0.22)'}}>힌트 {i+1}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,color:'#ede8de',lineHeight:1.6}}>{m.hintsArr?.[i] || '힌트 없음'}</div>
                    <div style={{fontSize:11,color:'rgba(237,232,222,0.25)',marginTop:3}}>정답 시 {getPts()}점</div>
                  </div>
                </div>
              )
              if (i === sh && !answered) return (
                <div key={i} style={{borderRadius:10,border:'1px solid rgba(255,255,255,0.06)',padding:'11px 14px',background:'#111',display:'flex',gap:10,alignItems:'center',opacity:0.3,marginBottom:9}}>
                  <span style={{fontSize:10,padding:'2px 6px',borderRadius:20,color:'rgba(237,232,222,0.3)',border:'1px solid rgba(255,255,255,0.1)'}}>힌트 {i+1}</span>
                  <div style={{fontSize:13,color:'rgba(237,232,222,0.3)'}}>다음 힌트 · {BP[selGrade]}점</div>
                </div>
              )
              return null
            })}

            {/* 컨트롤 */}
            {!answered ? (
              <>
                <div style={{fontSize:14,fontWeight:500,minHeight:19,marginBottom:7,color:fbt==='ok'?'#4fc97a':fbt==='ng'?'#e05252':'rgba(237,232,222,0.5)'}}>{fb}</div>
                <div style={{display:'flex',gap:7,marginBottom:9}}>
                  <input value={input} onChange={e=>setInput(e.target.value)}
                    onKeyDown={e=>{
		       if(e.key==='Enter'){
                       e.preventDefault()
			     	   e.stopPropagation() 
                       submit()
		       }
 		    }}
                    placeholder="영화 제목 입력..."
                    style={{flex:1,height:46,borderRadius:10,border:'1px solid rgba(255,255,255,0.12)',background:'#111',color:'#ede8de',padding:'0 14px',fontSize:15,fontFamily:'system-ui,sans-serif',outline:'none'}}
                    autoFocus
                  />
                  <button style={S.btnAns} onClick={submit}>정답</button>
                </div>
                <div style={{display:'flex',gap:7}}>
                  <button style={{...S.btnNh,opacity:sh>=5?0.3:1}} disabled={sh>=5} onClick={nextH}>다음 힌트 ({sh}/5)</button>
                  <button style={S.btnSk} onClick={doSkip}>포기! 다른문제</button>
                </div>
              </>
            ) : (
              <>
                <div style={{fontSize:15,fontWeight:500,marginBottom:6,color:fbt==='ok'?'#4fc97a':'rgba(237,232,222,0.5)'}}>{fb}</div>
                {fbt==='ok' && <div style={{fontSize:17,fontWeight:500,color:'#c8a84a',marginBottom:9}}>{m.title}</div>}
                <button style={S.btnNxt} onClick={nextQ}>{qi+1<pool.length?'다음 문제 →':'결과 보기 →'}</button>
                <div style={{fontSize:11,color:'rgba(237,232,222,0.3)',marginTop:4,textAlign:'center'}}>Enter 키로도 넘어갈 수 있어요</div>
              </>
            )}
          </div>

          {/* 사이드 힌트 */}
          <div style={{display:'flex',flexDirection:'column',gap:9}}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{height:56,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 6px',
                ...(sh>=i+2&&sidePool[i]?{border:'1px solid rgba(255,255,255,0.1)',background:'#111'}:{})}}>
                {sh>=i+2&&sidePool[i] && (
                  sidePool[i].t==='year'
                    ? <div style={{fontSize:'1.35rem',fontWeight:500,color:'#ede8de',letterSpacing:2}}>{sidePool[i].v}</div>
                    : <div style={{fontSize:11,color:'rgba(237,232,222,0.6)',textAlign:'center',wordBreak:'keep-all',lineHeight:1.4,padding:'0 3px'}}>{sidePool[i].v}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // ── 결과 ──
  if (screen === 'result') {
    const tot = results.reduce((s,r)=>s+r.score,0)
    const co = results.filter(r=>r.correct)
    const avgH = co.length>0?(co.reduce((s,r)=>s+r.hintUsed,0)/co.length).toFixed(1):'—'
    const mx = Math.max(...results.map(r => r.score || 0), 0)
    return (
      <div style={S.screen}>
        <div style={{...S.max,display:'flex',flexDirection:'column',alignItems:'center'}}>
          <div style={{width:68,height:68,borderRadius:'50%',background:'#111',border:'1px solid rgba(255,255,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',marginBottom:12}}>
            <svg viewBox="0 0 60 60" fill="none" style={{width:52,height:52}}>{char?.svg.props.children}</svg>
          </div>
          <div style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,padding:'3px 9px',borderRadius:20,border:'1px solid rgba(255,255,255,0.12)',color:'rgba(237,232,222,0.6)',marginBottom:12}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:g?.color,display:'inline-block'}}/><span style={{color:g?.color}}>{g?.name}</span><span> · {char?.name}</span>
          </div>
          <div style={{fontSize:'4rem',fontWeight:500,color:'#c8a84a',lineHeight:1,marginBottom:4}}>{tot}</div>
          <div style={{fontSize:11,color:'rgba(237,232,222,0.3)',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:24}}>이번 게임 점수</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,width:'100%',marginBottom:16}}>
            {[{v:`${co.length}/${pool.length}`,l:'맞춘 문제'},{v:avgH,l:'평균 힌트'},{v:`${mx}점`,l:'최고점'}].map((s,i)=>(
              <div key={i} style={{background:'#111',borderRadius:10,border:'1px solid rgba(255,255,255,0.1)',padding:'0.8rem',textAlign:'center'}}>
                <div style={{fontSize:'1.4rem',fontWeight:500,color:'#ede8de',marginBottom:3}}>{s.v}</div>
                <div style={{fontSize:11,color:'rgba(237,232,222,0.35)'}}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(237,232,222,0.3)',width:'100%',marginBottom:10}}>문제별 결과</div>
          <div style={{width:'100%',marginBottom:20,display:'flex',flexDirection:'column',gap:7}}>
            {results.map((r,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:9,background:'#111',borderRadius:10,border:'1px solid rgba(255,255,255,0.1)',padding:'11px 12px'}}>
                <div style={{fontSize:12,color:'rgba(237,232,222,0.25)',width:16,flexShrink:0}}>{i+1}</div>
                <div style={{flex:1,fontSize:13,color:r.correct?'#ede8de':'rgba(237,232,222,0.28)'}}>{r.correct?r.title:'???'}</div>
                <div style={{fontSize:11,color:'rgba(237,232,222,0.3)'}}>{r.correct?`힌트${r.hintUsed}`:'—'}</div>
                <div style={{fontSize:12,fontWeight:500,marginLeft:5,color:r.correct?'#4fc97a':'#e05252'}}>{r.correct?`+${r.score}점`:'미정답'}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:8,width:'100%'}}>
            <button style={{...S.btnGold,flex:1}} onClick={()=>loadMovies(selGrade)}>다시 하기</button>
            <button style={{...S.btnGhost,flex:1,height:50}} onClick={goHome}>처음으로</button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
