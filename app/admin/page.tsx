/// <reference types="node" />
'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_KEY as string
)

type Row = {
  movie_id: number
  title: string
  title_en: string | null
  hint_id: number | null
  hint_level: number
  hint_text: string
}

export default function AdminPage() {

  const [query, setQuery] = useState('')
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)

  async function search() {
    setLoading(true)

    const { data, error } = await supabase
      .from('hints')
      .select(`
        id,
        movie_id,
        hint_level,
        hint_text,
        movies(id, title, title_en)
      `)
      .ilike('hint_text', `%${query}%`)
      .limit(50)

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    const mapped = (data || []).map((h: any) => ({
      movie_id: h.movie_id,
      title: h.movies?.title || '',
      title_en: h.movies?.title_en || '',
      hint_id: h.id,
      hint_level: h.hint_level,
      hint_text: h.hint_text || ''
    }))

    setRows(mapped)
    setLoading(false)
  }

  function updateText(index: number, value: string) {
    const copy = [...rows]
    copy[index].hint_text = value
    setRows(copy)
  }

  async function save(row: Row) {

    const ok = confirm('저장할까?')
    if (!ok) return

    const { error } = await supabase
      .from('hints')
      .update({ hint_text: row.hint_text })
      .eq('id', row.hint_id)

    if (error) {
      alert(error.message)
      return
    }

    alert('저장 완료')
  }

  return (
    <div style={{
      padding: 20,
      height: '100vh',
      width: '100vw',
      margin: 0,
      maxWidth: 'none',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'sans-serif'
    }}>

      {/* 🔍 검색 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="힌트 검색"
          style={{ flex: 1, padding: 8 }}
        />

        <button onClick={search}>
          {loading ? '검색중...' : '검색'}
        </button>
      </div>

      {/* 📋 테이블 */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        border: '1px solid #ddd',
        width: '100%'
      }}>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>

          <thead style={{
            position: 'sticky',
            top: 0,
            background: '#fff'
          }}>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>제목</th>
              <th style={th}>레벨</th>
              <th style={th}>힌트</th>
              <th style={th}></th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={td}>{r.movie_id}</td>
                <td style={td}>{r.title}</td>
                <td style={td}>{r.hint_level}</td>

                <td style={td}>
                  <textarea
                    value={r.hint_text}
                    onChange={e => updateText(i, e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: 60
                    }}
                  />
                </td>

                <td style={td}>
                  <button onClick={() => save(r)}>
                    저장
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  )
}

const th = {
  border: '1px solid #ddd',
  padding: 8,
  background: '#f5f5f5'
}

const td = {
  border: '1px solid #ddd',
  padding: 8
}