import { useState } from 'react'
import AntCanvas from './AntCanvas'

// デフォルト値
const DEFAULT_ANT_COUNT = 60
const DEFAULT_SPEED = 1.8

export default function App() {
  const [antCount, setAntCount] = useState(DEFAULT_ANT_COUNT)
  const [speed, setSpeed] = useState(DEFAULT_SPEED)
  const [resetKey, setResetKey] = useState(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8, color: '#fff3e0' }}>
        🐜 アリコロニー観察室
      </h1>
      <p style={{ color: '#f5deb3', marginBottom: 20, fontSize: 14, lineHeight: 1.8, maxWidth: 480, textAlign: 'center' }}>
        アリの群れの動きを、ただ眺めるための小さなウェブアプリを公開しました。<br />
        操作はありません。意味のないようで、なぜか見てしまう時間をどうぞ。
      </p>

      {/* キャンバス：key が変わると完全リセット */}
      <AntCanvas key={resetKey} antCount={antCount} speed={speed} />

      {/* 制作者クレジット */}
      <p style={{ marginTop: 16, fontSize: 12, color: '#e8d5b8' }}>
        明日なんとかなるかも研究所 /{' '}
        <a
          href="https://note.com/shunpedesu"
          target="_blank"
          rel="noreferrer"
          style={{ color: '#ffe0b2', textDecoration: 'underline' }}
        >
          しゅんぺ
        </a>
      </p>

      {/* コントロールパネル */}
      <div style={panelStyle}>
        {/* 速度スライダー */}
        <div style={rowStyle}>
          <span style={labelStyle}>🐾 速度</span>
          <input
            type="range"
            min={0.5} max={5.0} step={0.1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={sliderStyle}
          />
          <span style={valueStyle}>{speed.toFixed(1)}</span>
        </div>

        {/* アリ数スライダー */}
        <div style={rowStyle}>
          <span style={labelStyle}>🐜 アリ数</span>
          <input
            type="range"
            min={10} max={150} step={5}
            value={antCount}
            onChange={(e) => setAntCount(Number(e.target.value))}
            style={sliderStyle}
          />
          <span style={valueStyle}>{antCount}</span>
        </div>

        {/* リセットボタン */}
        <button
          onClick={() => setResetKey((k) => k + 1)}
          style={resetButtonStyle}
        >
          ↺ リセット
        </button>
      </div>
    </div>
  )
}

// ── スタイル定数 ──────────────────────────────────────
const panelStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 24,
  marginTop: 20,
  padding: '14px 28px',
  background: '#a07848',
  borderRadius: 10,
  border: '1px solid #7a5530',
  flexWrap: 'wrap',
  justifyContent: 'center',
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#2a1400',
  width: 60,
  textAlign: 'right',
  whiteSpace: 'nowrap',
}

const sliderStyle: React.CSSProperties = {
  width: 130,
  accentColor: '#2a1400',
  cursor: 'pointer',
}

const valueStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#2a1400',
  width: 32,
  textAlign: 'left',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 'bold',
}

const resetButtonStyle: React.CSSProperties = {
  padding: '7px 20px',
  background: '#7a5530',
  color: '#f5e6c8',
  border: '1px solid #5a3a18',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 'bold',
  letterSpacing: 1,
}
