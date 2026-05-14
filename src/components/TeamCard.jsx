const RANK_CONFIG = [
  { label: '🥇', colorClass: 'gold',   badge: '第一名' },
  { label: '🥈', colorClass: 'silver', badge: '第二名' },
  { label: '🥉', colorClass: 'bronze', badge: '第三名' },
  { label: '④',  colorClass: 'red',    badge: '第四名' },
]

export default function TeamCard({ rank, 班級, 小隊, 總分 }) {
  const cfg = RANK_CONFIG[rank - 1] || RANK_CONFIG[3]

  return (
    <div className={`team-card team-card--${cfg.colorClass}`}>
      <span className="rank-badge">{cfg.badge}</span>
      <div className="team-card__rank">{cfg.label}</div>
      <div className="team-card__info">
        <div className="team-card__name">{班級}</div>
        <div className="team-card__team">第 {小隊} 小隊</div>
      </div>
      <div className="team-card__score">
        <span className="score-number">{總分}</span>
        <span className="score-label">分</span>
      </div>
    </div>
  )
}
