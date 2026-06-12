export default function DeleteAccountPage() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        background: '#fff',
        color: '#222',
        padding: '32px 20px',
        fontSize: 15,
        lineHeight: 1.7
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, marginBottom: 20 }}>
          계정 삭제 안내
        </h1>

        <p>
          CineClue 계정 및 관련 데이터 삭제를 원하시는 경우 아래 이메일로
          삭제 요청을 보내주세요.
        </p>

        <h2 style={{ fontSize: 20 }}>삭제 요청 방법</h2>

        <p>
          이메일: <strong>kinosms07@gmail.com</strong>
        </p>

        <p>
          요청 시 Google 로그인에 사용한 이메일 주소를 함께 보내주세요.
        </p>

        <h2 style={{ fontSize: 20 }}>삭제되는 데이터</h2>

        <ul>
          <li>사용자 계정 정보</li>
          <li>게임 진행 데이터</li>
          <li>캐릭터 정보</li>
          <li>랭킹 정보</li>
          <li>컬렉션 데이터</li>
        </ul>

        <p>
          삭제 요청은 확인 후 7일 이내 처리됩니다.
        </p>

        <p style={{ marginTop: 32, color: '#777' }}>
          최종 수정일: 2026-06-12
        </p>
      </div>
    </main>
  )
}