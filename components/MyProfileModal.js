'use client'

import { playSound } from '../library/audioManager'
import { useState, useRef } from 'react'

export default function MyProfileModal({
  currentUser,
  LEVEL_TITLES,
  CharAvatar,
  CHARS,
  profileStats,
  onClose,
  onChangeCharacter,
  onChangeNickname
}) {

  const [showCharacterPicker, setShowCharacterPicker] = useState(false)
  const [characterIndex, setCharacterIndex] = useState(0)
  const [editingName, setEditingName] = useState(false)
  const [newNickname, setNewNickname] = useState('')
  const [saving, setSaving] = useState(false)

  const touchStartX = useRef(null)

  const moveCharacter = (direction) => {
    setCharacterIndex(prev =>
      (prev + direction + CHARS.length) % CHARS.length
    )
  }

  const saveNickname = async () => {
    const name = newNickname.trim()

    if (!name || saving) return

    setSaving(true)

    try {
      await onChangeNickname(name)
      setEditingName(false)
    } catch (e) {
      console.error(e)
      alert('이름을 변경하지 못했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const selectCharacter = async (charId) => {
    if (saving) return

    setSaving(true)

    try {
      await onChangeCharacter(charId)
      setShowCharacterPicker(false)
    } catch (e) {
      console.error(e)
      alert('캐릭터를 변경하지 못했습니다.')
    } finally {
      setSaving(false)
    }
  }


  if (!currentUser) return null

  const displayScore = currentUser.score ?? 0
  const displayLevel = Math.floor(displayScore / 50000) + 1
  const displayCurrentExp = displayScore % 50000
  const displayLevelPercent = (displayCurrentExp / 50000) * 100

  const cardStyle = {
  background: '#e8e4dc',
  border: 'none',
  borderRadius: 12,
  padding: '14px 8px',
  textAlign: 'center'
}

const labelStyle = {
  fontSize: '0.72rem',
  color: '#746e65',
  fontWeight: 600,
  marginBottom: 7
}

const valueStyle = {
  fontSize: '1.15rem',
  fontWeight: 900,
  color: '#1a1814'
}

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999
    }}>

      <div style={{
        width: '88%',
        maxWidth: 420,
        maxHeight: '88vh',
        overflowY: 'auto',
        boxSizing: 'border-box',
        background: '#faf9f7',
        borderRadius: 20,
        border: '1.5px solid #e8e4dd',
        padding: '24px 16px',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>

        {/* 닫기 */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: '#f5f3ef',
            border: '1px solid #e8e4dd',
            color: '#1a1814',
            fontSize: 18,
            cursor: 'pointer'
          }}>
          ×
        </button>

        <style>{`

  @keyframes profileRingSpin {

    from {

      transform: rotate(0deg);

    }

    to {

      transform: rotate(360deg);

    }

  }

  @media (prefers-reduced-motion: reduce) {

    div[style*="profileRingSpin"] {

      animation: none !important;

    }

  }

`}</style>

        {/* 프로필 상단 */}
<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: 20,
  marginTop: 20,
  marginBottom: 24
}}>

  {/* 캐릭터 이미지 */}
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0
  }}>

    <div style={{

  position: 'relative',

  borderRadius: '50%',

  padding: 3,

  background: '#b8b1a8',

  overflow: 'hidden',

  display: 'flex',

  alignItems: 'center',

  justifyContent: 'center',

  boxShadow: '0 0 8px rgba(210,170,80,0.2)'

}}>

  {/* 회전하는 빛 효과 */}

  <div style={{

    position: 'absolute',

    inset: -4,

    background: `conic-gradient(

      transparent 0deg,

      transparent 230deg,

      #d4b36a 280deg,

      #fff8d6 320deg,

      #e8c36a 340deg,

      transparent 360deg

    )`,

    animation: 'profileRingSpin 3s linear infinite',

    pointerEvents: 'none'

  }} />

  {/* 캐릭터 이미지 */}

  <div style={{

    position: 'relative',

    zIndex: 1,

    borderRadius: '50%',

    background: '#faf9f7',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center'

  }}>

    <CharAvatar

      charId={currentUser.charId}

      size={72}

    />

  </div>

</div>

    <button
      onClick={() => {

        playSound('click')

        setCharacterIndex(

          Math.max(0, CHARS.findIndex(

            c => c.id === currentUser.charId

          ))

        )

        setShowCharacterPicker(prev => !prev)

        setEditingName(false)

      }}
      style={{
        border: 'none',
        background: '#ed4b5e',
        borderRadius: 999,
        padding: '6px 14px',
        fontSize: '0.7rem',
        fontWeight: 700,
        color: '#fff',
        cursor: 'pointer'
      }}>
      변경
    </button>

  </div>

  {/* 타이틀 및 닉네임 */}
  <div style={{
    flex: 1,
    minWidth: 0,
    textAlign: 'left'
  }}>

    <div style={{
      fontSize: '0.62rem',
      letterSpacing: '0.24em',
      color: '#b8b1a8',
      fontWeight: 700,
      marginBottom: 8
    }}>
      CINECLUE TITLE
    </div>

    <div style={{
      fontSize: '1.4rem',
      fontWeight: 900,
      color: '#1a1814',
      letterSpacing: '-0.04em'
    }}>
      {LEVEL_TITLES[Math.min(displayLevel, 100)]}
    </div>

    {/* 닉네임 및 수정 */}
<div style={{
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginTop: 10
}}>

  {editingName ? (

    <form
      onSubmit={e => {
        e.preventDefault()
        saveNickname()
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        minWidth: 0,
        gap: 5
      }}>

      <input
        autoFocus
        type="text"
        value={newNickname}
        maxLength={20}
        onChange={e => setNewNickname(e.target.value)}
        style={{
          flex: 1,
          width: 0,
          minWidth: 0,
          height: 32,
          boxSizing: 'border-box',
          border: '1px solid #d4cec5',
          borderRadius: 6,
          background: '#fff',
          padding: '0 8px',
          fontSize: 16,
          color: '#1a1814',
          outlineColor: '#ed4b5e'
        }}
      />

      <button
        type="submit"
        disabled={!newNickname.trim() || saving}
        style={{
          flexShrink: 0,
          border: 'none',
          borderRadius: 6,
          height: 32,
          padding: '0 10px',
          background: newNickname.trim() && !saving
            ? '#ed4b5e'
            : '#d4d0cc',
          color: '#fff',
          fontSize: '0.7rem',
          fontWeight: 700,
          cursor: 'pointer'
        }}>
        수정
      </button>

    </form>

  ) : (

    <>
      <span style={{
        fontSize: '0.9rem',
        color: '#8d857c',
        fontWeight: 600,
        overflowWrap: 'anywhere'
      }}>
        {currentUser.nickname || currentUser.userId}
      </span>

      <button
        aria-label="닉네임 수정"
        onClick={() => {
          playSound('click')
          setNewNickname('')
          setEditingName(true)
          setShowCharacterPicker(false)
        }}
        style={{
          border: 'none',
          background: 'transparent',
          padding: 2,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer'
        }}>

        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8d857c"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z" />
        </svg>

      </button>
    </>

  )}

</div>

  </div>

</div>

{/* 캐릭터 선택 슬라이더 */}
{showCharacterPicker && (
  <div style={{

    position: 'absolute',

    inset: 0,

    zIndex: 30,

    background: 'rgba(239, 237, 232, 0.1)',

    backdropFilter: 'blur(1px)',

    WebkitBackdropFilter: 'blur(1px)',

    borderRadius: 20,

    display: 'flex',

    flexDirection: 'column',

    alignItems: 'center',

    justifyContent: 'center',

    overflow: 'hidden'

  }}>

    {/* 캐릭터 슬라이더 */}
<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 20,
  width: '100%',
  height: 184
}}>

  {/* 왼쪽 화살표 */}
  <button
    aria-label="이전 캐릭터"
    disabled={saving}
    onClick={() => {
      playSound('click')
      moveCharacter(-1)
    }}
    style={{
      background: 'transparent',
      border: 'none',
      fontSize: 40,
      fontWeight: 300,
      color: '#746e65',
      cursor: 'pointer',
      padding: '8px 12px'
    }}>
    ‹
  </button>

  {/* 중앙 캐릭터 */}
  <button
    disabled={saving}
    onClick={() => {
      playSound('click')
      selectCharacter(CHARS[characterIndex].id)
    }}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      border: 'none',
      padding: 3,
      background: '#ed4b5e',
      cursor: 'pointer',
      flexShrink: 0
    }}>

    <CharAvatar
      charId={CHARS[characterIndex].id}
      size={160}
    />

  </button>

  {/* 오른쪽 화살표 */}
  <button
    aria-label="다음 캐릭터"
    disabled={saving}
    onClick={() => {
      playSound('click')
      moveCharacter(1)
    }}
    style={{
      background: 'transparent',
      border: 'none',
      fontSize: 40,
      fontWeight: 300,
      color: '#746e65',
      cursor: 'pointer',
      padding: '8px 12px'
    }}>
    ›
  </button>

</div>

    {/* 캐릭터 이름 */}
    <div style={{
      textAlign: 'center',
      fontSize: '0.9rem',
      fontWeight: 800,
      color: '#1a1814',
      marginTop: 8
    }}>
      {CHARS[characterIndex].name}
    </div>

  </div>
)}

        {/* 레벨 */}
        <div style={{
          fontSize: '1rem',
          fontWeight: 900,
          color: '#1a1814',
          marginBottom: 12
        }}>
          Lv. {displayLevel}
        </div>

        {/* 경험치 바 */}
        <div style={{
          height: 8,
          background: '#e8e4dd',
          borderRadius: 999,
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${displayLevelPercent}%`,
            height: '100%',
            background: '#ed4b5e',
            borderRadius: 999
          }} />
        </div>

        <div style={{
          textAlign: 'right',
          fontSize: '0.72rem',
          color: '#999',
          marginTop: 6,
          marginBottom: 16
        }}>
          {displayCurrentExp.toLocaleString()} / 50,000 EXP
        </div>

        {/* 기본 통계 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8
        }}>

          <div style={cardStyle}>
            <div style={labelStyle}>총 점수</div>
            <div style={valueStyle}>
              {displayScore.toLocaleString()}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={labelStyle}>플레이 시간</div>
            <div style={valueStyle}>
              {profileStats?.playTime ?? '-'}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={labelStyle}>선호 장르</div>
            <div style={valueStyle}>
              {profileStats?.favoriteGenre ?? '-'}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={labelStyle}>최근 플레이</div>
            <div style={valueStyle}>
              {profileStats?.lastPlayed ?? '-'}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}