'use client'

import { playSound } from '../library/audioManager'
import { useState } from 'react'

export default function ReviveOverlay({
  show,
  selChar,
  CharAvatar,
  isNativeApp,
  isReviving,
  isRevived,
  onRevive, 
  onRestart
}) {
  
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)
  if (!show) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="캐릭터 부활"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'reviveOverlayIn 0.4s ease forwards',
        touchAction: 'none'
      }}
    >

      <style>{`
        @keyframes reviveOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes graveAppear {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.85);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes reviveHeartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }

        @keyframes reviveCharacterAppear {
          from {
            opacity: 0;
            transform: scale(0.75);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes reviveLifeFloat {

          0% {

            opacity: 0;

            transform: translateY(8px) scale(0.85);

          }

          20% {

            opacity: 1;

            transform: translateY(0) scale(1);

          }

          50% {

            opacity: 1;

          }

          100% {

            opacity: 0;

            transform: translateY(-40px) scale(1);

          }

        }

        @media (prefers-reduced-motion: reduce) {
          .revive-motion {
            animation: none !important;
          }
        }
      `}</style>

      {/* 무덤 및 캐릭터 영역 */}
      <div style={{
        width: 220,
        height: 220,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>

        {/* 사망한 캐릭터 */}
          <div
            className="revive-motion"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isRevived ? 0 : 1,
              transform: isRevived ? 'scale(0.8)' : 'scale(1)',
              filter: 'grayscale(100%) contrast(1.5) brightness(0.8) drop-shadow(0 8px 12px rgba(0,0,0,0.3))',
              transition: 'opacity 0.5s ease, transform 0.5s ease'
            }}
          >
            <CharAvatar
              charId={selChar}
              size={150}
              innerScale={0.8}
            />
          </div>

        {/* 부활한 캐릭터 */}
        {isRevived && (
          <div
            className="revive-motion"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'reviveCharacterAppear 0.6s ease forwards',
              filter: 'drop-shadow(0 0 20px rgba(255,220,130,0.7))'
            }}
          >
            <CharAvatar
              charId={selChar}
              size={180}
            />
          </div>
        )}

      </div>

      {/* 부활 및 새로하기 버튼 */}
        <div style={{
          height: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36
        }}>

  {!isRevived ? (
    <>

      {/* 부활하기 */}
      <div style={{
        width: 120,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12
      }}>
        <button
          className="revive-motion"
          aria-label="부활하기"
          disabled={isReviving}
          onClick={() => {
            playSound('click')
            onRevive()
          }}
          style={{
            width: 76,
            height: 76,
            padding: 0,
            border: 'none',
            background: 'transparent',
            color: '#ff4768',
            fontSize: 64,
            lineHeight: 1,
            cursor: isReviving ? 'default' : 'pointer',
            opacity: isReviving ? 0.45 : 1,
            filter: 'drop-shadow(0 0 12px rgba(255,71,104,0.6))',
            animation: isReviving
              ? 'none'
              : 'reviveHeartPulse 1.4s ease-in-out infinite'
          }}
        >
          ♥
        </button>

        <div style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#fff',
          textShadow: '0 2px 5px rgba(0,0,0,0.8)'
        }}>
          {isReviving
            ? '처리 중...'
            : isNativeApp
              ? '광고 보고 부활하기'
              : '부활하기'}
        </div>
      </div>

      {/* 새로하기 */}
      <div style={{
        width: 120,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12
      }}>
        <button
          aria-label="새로하기"
          disabled={isReviving}
          onClick={() => {
            playSound('click')
            setShowRestartConfirm(true)
          }}
          style={{
            width: 76,
            height: 76,
            padding: 0,
            border: 'none',
            background: 'transparent',
            color: '#ffffff',
            fontSize: 64,
            lineHeight: 1,
            cursor: isReviving ? 'default' : 'pointer',
            opacity: isReviving ? 0.45 : 1,
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))'
          }}
        >
          ↻
        </button>

        <div style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#fff',
          textShadow: '0 2px 5px rgba(0,0,0,0.8)'
        }}>
          새로하기
        </div>
      </div>

    </>
  ) : (
    <div style={{
      fontSize: '1.2rem',
      fontWeight: 900,
      color: '#ffffff',
      textShadow: '0 0 12px rgba(255,220,130,0.8)'
    }}>
      ♥ +10
    </div>
  )}

</div>

{/* 새로하기 확인 팝업 */}
{showRestartConfirm && (
  <div style={{
    position: 'absolute',
    inset: 0,
    zIndex: 10,
    background: 'rgba(0,0,0,0.55)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  }}>
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label="새로하기 확인"
      style={{
        width: '100%',
        maxWidth: 320,
        boxSizing: 'border-box',
        background: '#f5f3ef',
        borderRadius: 20,
        padding: '28px 24px 24px',
        textAlign: 'center',
        boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
      }}
    >
      <div style={{
        fontSize: '2.8rem',
        color: '#625b50',
        lineHeight: 1,
        marginBottom: 16
      }}>
        ↻
      </div>

      <div style={{
        fontSize: '1.2rem',
        fontWeight: 900,
        color: '#302c26',
        marginBottom: 16
      }}>
        새로 시작하시겠습니까?
      </div>

      <div style={{
        fontSize: '0.9rem',
        color: '#625b50',
        lineHeight: 1.8
      }}>
        누적 점수와 레벨이 초기화됩니다.
        <br />
        생명 20개가 지급됩니다.
        <br />
        <br />
        수집한 영화 포스터와
        <br />
        플레이 기록은 유지됩니다.
      </div>

      <div style={{
        display: 'flex',
        gap: 10,
        marginTop: 26
      }}>
        <button
          onClick={() => {
            playSound('click')
            setShowRestartConfirm(false)
          }}
          style={{
            flex: 1,
            padding: '14px 0',
            border: 'none',
            borderRadius: 12,
            background: '#e5e1da',
            color: '#625b50',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          취소
        </button>

        <button
          onClick={() => {
            playSound('click')
            setShowRestartConfirm(false)
            onRestart()
          }}
          style={{
            flex: 1,
            padding: '14px 0',
            border: 'none',
            borderRadius: 12,
            background: '#403a32',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          새로하기
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  )
}