import { useEffect, useState } from 'react'
import AntCanvas from './AntCanvas'

const DEFAULT_ANT_COUNT = 60
const DEFAULT_SPEED = 1.8

export default function App() {
  const [antCount, setAntCount] = useState(DEFAULT_ANT_COUNT)
  const [speed, setSpeed] = useState(DEFAULT_SPEED)
  const [resetKey, setResetKey] = useState(0)
  const [quietMode, setQuietMode] = useState(false)

  // 静観モード切替時に背景色を変える
  useEffect(() => {
    document.body.style.background = quietMode ? '#1e1208' : '#7a5c3a'
    document.body.style.transition = 'background 0.8s'
  }, [quietMode])

  return (
    <div style={rootStyle}>

      {/* ヘッダー：静観モードでは非表示 */}
      {!quietMode && (
        <header style={headerStyle}>
          <h1 style={titleStyle}>
            アリコロニー研究室
            <span style={subtitleStyle}>― ただ、群れを見つめる ―</span>
          </h1>
          <p style={descStyle}>
            操作はありません。<br />
            ただ、アリの群れの流れを見つめるための観察室です。
          </p>
        </header>
      )}

      {/* キャンバスエリア */}
      <div style={{ position: 'relative' }}>
        <AntCanvas key={resetKey} antCount={antCount} speed={speed} />

        {/* 静観モード中の終了ボタン */}
        {quietMode && (
          <button onClick={() => setQuietMode(false)} style={exitQuietStyle}>
            観察を終える
          </button>
        )}
      </div>

      {/* フッター：静観モードでは非表示 */}
      {!quietMode && (
        <footer style={footerStyle}>

          {/* コントロールパネル */}
          <div style={panelStyle}>
            <div style={rowStyle}>
              <span style={labelStyle}>時間の流れ</span>
              <input
                type="range" min={0.5} max={5.0} step={0.1}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                style={sliderStyle}
              />
              <span style={valueStyle}>{speed.toFixed(1)}</span>
            </div>

            <div style={rowStyle}>
              <span style={labelStyle}>コロニー規模</span>
              <input
                type="range" min={10} max={150} step={5}
                value={antCount}
                onChange={(e) => setAntCount(Number(e.target.value))}
                style={sliderStyle}
              />
              <span style={valueStyle}>{antCount}</span>
            </div>

            <div style={btnRowStyle}>
              <button onClick={() => setResetKey((k) => k + 1)} style={btnStyle}>
                リセット
              </button>
              <button onClick={() => setQuietMode(true)} style={quietBtnStyle}>
                静かに観察する
              </button>
            </div>
          </div>

          {/* 制作者クレジット */}
          <p style={creditStyle}>
            明日なんとかなるかも研究所 /{' '}
            <a
              href="https://note.com/shunpedesu"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#c8a878', textDecoration: 'underline' }}
            >
              しゅんぺ
            </a>
          </p>
        </footer>
      )}
    </div>
  )
}

// ── スタイル ──────────────────────────────────────────
const rootStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
}

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: 28,
}

const titleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 300,
  letterSpacing: '0.12em',
  color: '#f5ead8',
  lineHeight: 1.6,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
}

const subtitleStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 300,
  letterSpacing: '0.18em',
  color: '#c8a87a',
  opacity: 0.85,
}

const descStyle: React.CSSProperties = {
  color: '#d4b896',
  fontSize: 13,
  lineHeight: 2.1,
  letterSpacing: '0.06em',
  maxWidth: 360,
  textAlign: 'center',
  marginTop: 14,
  opacity: 0.9,
}

const exitQuietStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 14,
  right: 14,
  background: 'rgba(20, 10, 0, 0.55)',
  color: '#c8b090',
  border: '1px solid rgba(200, 176, 144, 0.3)',
  borderRadius: 3,
  padding: '5px 13px',
  fontSize: 11,
  letterSpacing: '0.08em',
  cursor: 'pointer',
  fontWeight: 300,
}

const footerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 16,
  marginTop: 22,
  width: '100%',
}

const panelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 14,
  padding: '20px 32px',
  background: 'rgba(50, 28, 8, 0.55)',
  borderRadius: 8,
  border: '1px solid rgba(180, 140, 90, 0.25)',
  width: 'min(480px, calc(100vw - 32px))',
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  width: '100%',
  justifyContent: 'center',
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#c8a87a',
  letterSpacing: '0.08em',
  width: 80,
  textAlign: 'right',
  whiteSpace: 'nowrap',
  fontWeight: 300,
}

const sliderStyle: React.CSSProperties = {
  width: 120,
  accentColor: '#8b5e3c',
  cursor: 'pointer',
}

const valueStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#c8a87a',
  width: 28,
  textAlign: 'left',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 300,
}

const btnRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginTop: 4,
}

const btnStyle: React.CSSProperties = {
  padding: '5px 14px',
  background: 'transparent',
  color: '#b8956a',
  border: '1px solid rgba(184, 149, 106, 0.45)',
  borderRadius: 3,
  cursor: 'pointer',
  fontSize: 11,
  letterSpacing: '0.06em',
  fontWeight: 300,
}

const quietBtnStyle: React.CSSProperties = {
  ...btnStyle,
  color: '#a890c8',
  border: '1px solid rgba(168, 144, 200, 0.4)',
}

const creditStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#9a7e5a',
  letterSpacing: '0.05em',
  opacity: 0.8,
}
