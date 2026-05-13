'use client'

export default function LoginModal(props) {

  const {

    showLogin,

    setShowLogin,

    loginGoogle,

    loginKakao

  } = props

  if (!showLogin) return null

  return (

    <div

      onClick={() => setShowLogin(false)}

    >
      {showLogin && (
        <div
          onClick={() => setShowLogin(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999
          }}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 280,
              padding: 24,
              borderRadius: 20,
              background: '#1a1a1a',
              textAlign: 'center'
            }}>

            <div style={{
              color: '#fff',
              marginBottom: 20,
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.3px',
              opacity: 0.8
            }}>
              로그인
            </div>

            {/* Google */}
            <button
              onClick={loginGoogle}
              style={{
                width: '100%',
                height: 48,
                borderRadius: 12,
                border: 'none',
                background: '#fff',
                color: '#111',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                marginBottom: 12
              }}>
              Google로 계속하기
            </button>
            {/* Kakao */}
            <button
              onClick={loginKakao}
              style={{
                width: '100%',
                height: 48,
                borderRadius: 12,
                border: 'none',
                background: '#FEE500',
                color: '#111',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                marginBottom: 12,
                opacity: 0.8
              }}>
              카카오톡으로 계속하기
            </button>
          </div>
        </div>
      )}

    </div>

  )

}