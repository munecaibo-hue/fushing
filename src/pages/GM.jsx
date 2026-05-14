import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL

const CLASS_CONFIG = {
  和班: { count: 9, colorClass: 'class-btn--he', password: '0001' },
  平班: { count: 8, colorClass: 'class-btn--ping', password: '0002' },
}

export default function GM() {
  const [step, setStep] = useState('select') // 'select' | 'password' | 'scoring'
  const [selectedClass, setSelectedClass] = useState(null)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null) // { text, type }

  /* ---- Numpad ---- */
  const handleNumPad = (digit) => {
    if (password.length < 4) {
      setPassword((p) => p + digit)
      setPwError('')
    }
  }

  const handleBackspace = () => {
    setPassword((p) => p.slice(0, -1))
    setPwError('')
  }

  const handlePasswordSubmit = () => {
    if (password === CLASS_CONFIG[selectedClass].password) {
      setStep('scoring')
      setPwError('')
    } else {
      setPwError('密碼錯誤！請再試一次 💥')
      setPassword('')
    }
  }

  /* ---- Add Score ---- */
  const showToast = (text, type = 'success') => {
    setToast({ text, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAddScore = useCallback(async (team) => {
    setLoading(true)
    if (!GAS_URL) {
      showToast(`✅ ${selectedClass} 第${team}小隊 +2分！（Demo 模式）`)
      setLoading(false)
      return
    }
    try {
      const url = `${GAS_URL}?action=addScore&班級=${encodeURIComponent(selectedClass)}&小隊=${team}&分數=2`
      await fetch(url)
      showToast(`✅ ${selectedClass} 第${team}小隊 +2分！`)
    } catch {
      showToast('❌ 連線失敗，請確認網路', 'error')
    } finally {
      setLoading(false)
    }
  }, [selectedClass])

  /* ---- Render helpers ---- */
  const renderSelectStep = () => (
    <>
      <p className="step-title">選擇班級</p>
      <div className="class-buttons">
        {Object.keys(CLASS_CONFIG).map((cls) => (
          <button
            key={cls}
            id={`class-btn-${cls}`}
            className={`class-btn ${CLASS_CONFIG[cls].colorClass}`}
            onClick={() => {
              setSelectedClass(cls)
              setPassword('')
              setPwError('')
              setStep('password')
            }}
          >
            {cls}
          </button>
        ))}
      </div>
    </>
  )

  const renderPasswordStep = () => (
    <>
      <p className="step-title">輸入密碼 — {selectedClass}</p>

      {/* 4 dots */}
      <div className="password-display">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`pw-dot ${i < password.length ? 'filled' : ''}`}>
            {i < password.length ? '●' : ''}
          </div>
        ))}
      </div>

      {/* Numpad */}
      <div className="numpad">
        {['1','2','3','4','5','6','7','8','9'].map((d) => (
          <button key={d} id={`numpad-${d}`} className="numpad-btn" onClick={() => handleNumPad(d)}>{d}</button>
        ))}
        <button id="numpad-del" className="numpad-btn numpad-btn--del" onClick={handleBackspace}>⌫</button>
        <button id="numpad-0" className="numpad-btn" onClick={() => handleNumPad('0')}>0</button>
        <button
          id="numpad-ok"
          className="numpad-btn numpad-btn--ok"
          onClick={handlePasswordSubmit}
          disabled={password.length < 4}
        >
          確認
        </button>
      </div>

      <p className="error-msg">{pwError}</p>
      <button className="back-btn" onClick={() => setStep('select')}>← 返回選班</button>
    </>
  )

  const renderScoringStep = () => {
    const count = CLASS_CONFIG[selectedClass].count
    const teams = Array.from({ length: count }, (_, i) => i + 1)

    return (
      <>
        <div className="scoring-header">
          <span className="scoring-class-badge">{selectedClass}</span>
          <span className="scoring-rule">答對 1 次 ＋ 2 分</span>
        </div>

        <div className="team-grid">
          {teams.map((t) => (
            <button
              key={t}
              id={`score-btn-${selectedClass}-${t}`}
              className="team-score-btn"
              disabled={loading}
              onClick={() => handleAddScore(t)}
            >
              <span className="btn-team-name">第 {t} 小隊</span>
              <span className="btn-plus">＋ 2 分</span>
            </button>
          ))}
        </div>

        <button className="back-btn" onClick={() => setStep('select')}>← 切換班級</button>
      </>
    )
  }

  return (
    <div className="gm-page">
      <div className="gm-header">
        <h1>GM 控制台</h1>
        <p>GAME MASTER PANEL</p>
      </div>

      <div className="gm-panel comic-panel">
        {step === 'select'   && renderSelectStep()}
        {step === 'password' && renderPasswordStep()}
        {step === 'scoring'  && renderScoringStep()}
      </div>

      <Link to="/" className="home-link">← 回到記分板</Link>

      {toast && (
        <div className={`toast toast--${toast.type}`}>{toast.text}</div>
      )}
    </div>
  )
}
