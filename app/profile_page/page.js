"use client"

import ProfileChart from "./ProfileChart"

// 🔥 타이틀 임시 함수
function getTitle(level) {
  if (level >= 80) return "장인"
  if (level >= 60) return "중수"
  if (level >= 40) return "입문자"
  return "초보"
}

export default function Page() {

  const profile = {
    nickname: "yoda",
    mainTitle: "귀신잡는 해병",
    character: "/char.png"
  }

  const stats = [
    { genre: "공포", level: 70 },
    { genre: "액션", level: 30 },
    { genre: "코미디", level: 50 },
    { genre: "SF", level: 80 },
    { genre: "드라마", level: 20 }
  ]

  return (
    <div style={styles.container}>

      {/* 🔹 상단 */}
      <div style={styles.header}>
        <img src={profile.character} style={styles.character} />
        <div>
          <div style={styles.nickname}>{profile.nickname}</div>
          <div style={styles.mainTitle}>{profile.mainTitle}</div>
        </div>
      </div>

      {/* 🔹 장르 리스트 */}
      <div style={styles.section}>
        {stats.map((g, i) => (
          <div key={i} style={styles.row}>
            <span>{g.genre}</span>
            <span style={styles.level}>
              {getTitle(g.level)} ({g.level}%)
            </span>
          </div>
        ))}
      </div>

      {/* 🔹 그래프 */}
      <ProfileChart stats={stats} />

      {/* 🔹 닫기 */}
      <button style={styles.closeBtn} onClick={() => history.back()}>
        닫기
      </button>

    </div>
  )
}


// 🔥 스타일
const styles = {
  container: {
    padding: 20,
    color: "#fff",
    background: "#0b0b0b",
    minHeight: "100vh"
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 30
  },

  character: {
    width: 140,
    height: 140,
    objectFit: "contain",
    background: "#222",
    borderRadius: 12
  },

  nickname: {
    fontSize: 22,
    fontWeight: "bold"
  },

  mainTitle: {
    fontSize: 18,
    marginTop: 6,
    color: "#00E5FF",
    fontWeight: "bold"
  },

  section: {
    marginTop: 20
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #222"
  },

  level: {
    color: "#aaa"
  },

  closeBtn: {
    marginTop: 40,
    width: "100%",
    padding: 14,
    background: "#333",
    border: "none",
    color: "#fff",
    borderRadius: 12,
    fontSize: 16
  }
}