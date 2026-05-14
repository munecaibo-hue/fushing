import { useState, useEffect, useCallback } from 'react'
import TeamCard from './TeamCard.jsx'

const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL

// Demo data shown when GAS URL not configured
const DEMO_DATA = [
  { 班級: '和班', 小隊: '3', 總分: 24 },
  { 班級: '平班', 小隊: '1', 總分: 20 },
  { 班級: '和班', 小隊: '7', 總分: 18 },
  { 班級: '平班', 小隊: '5', 總分: 16 },
]

export default function Scoreboard() {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)
  const prevScoresRef = useRef({})

  const fetchScores = useCallback(async () => {
    if (!GAS_URL) {
      setScores(DEMO_DATA)
      setLoading(false)
      return
    }
    try {
      const res = await fetch(`${GAS_URL}?action=getScores`)
      const data = await res.json()
      setScores(Array.isArray(data) ? data.slice(0, 4) : [])
      setLastUpdate(new Date())
    } catch (err) {
      console.error('fetchScores failed:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchScores()
    const id = setInterval(fetchScores, 5000)
    return () => clearInterval(id)
  }, [fetchScores])

  return (
    <div className="scoreboard">
      <div className="scoreboard-panel halftone">
        {loading ? (
          <p className="loading-text">載入中…</p>
        ) : scores.length === 0 ? (
          <p className="no-data">尚無記分資料</p>
        ) : (
          <div className="team-cards-grid">
            {scores.map((team, idx) => (
              <TeamCard
                key={`${team.班級}-${team.小隊}`}
                rank={idx + 1}
                班級={team.班級}
                小隊={team.小隊}
                總分={team.總分}
              />
            ))}
          </div>
        )}
      </div>
      {lastUpdate && (
        <p className="update-time">
          每 5 秒自動更新 · 最後更新：{lastUpdate.toLocaleTimeString('zh-TW')}
        </p>
      )}
    </div>
  )
}
