"use client"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"

export default function ProfileChart({ stats }) {

  const data = stats.map(g => ({
    genre: g.genre,
    value: g.level || 0
  }))

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
      <RadarChart width={300} height={300} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="genre" />
        <PolarRadiusAxis domain={[0, 100]} />
        <Radar
          dataKey="value"
          stroke="#6C63FF"
          fill="#6C63FF"
          fillOpacity={0.6}
        />
      </RadarChart>
    </div>
  )
}