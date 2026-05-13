'use client'
import { useEffect, useState } from 'react'

export default function IntroScreen({
    onEnter,
    onLogin,
    authUser,
  }) {

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
                visibility:'visible'
            }}>

              Houston... we have a problem.

            </div>
          </div>
          <div
            style={{
              opacity:0,
              animation: 'fadeIn 1s ease forwards',
              animationDelay: '5s'
          }}>

            <div style={{
              fontSize:'2.2rem',
              fontWeight:900,
              letterSpacing:'-1px',
              marginBottom:30,
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
            }}>
              들어가기
            </button>

            {/* 로그인 */}
            <div style={{ 
              marginTop: 18, 
              textAlign: 'center',
            }}>

              {!authUser ? (
                  <button
                    onClick={onLogin}
                    style={{
                      border:'none',
                      background:'transparent',
                      fontSize:'0.9rem',
                      color:'#8f8f8f',
                      textDecoration:'underline',
                      cursor:'pointer'
                  }}>
                    로그인
                  </button>
                ) : (
                  <div
                    style={{
                      fontSize:'0.9rem',
                      color:'#8f8f8f'
                  }}>
                    🎬 {authUser.user_metadata?.name}님 반가워요
                  </div>
                )
              }
            </div>  
          </div>
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

          `}
        </style>
      </div>
    )
  }