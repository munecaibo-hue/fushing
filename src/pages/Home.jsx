import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Scoreboard from '../components/Scoreboard.jsx'

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-overlay" />

      {/* Header */}
      <header className="header-banner">
        <div className="header-inner">
          <img
            src="/復興logo--去背.png"
            alt="私立復興高中校徽"
            className="school-logo"
          />
          <h1 className="header-title">復興實中新加坡交流</h1>
        </div>
      </header>

      {/* Main */}
      <main className="main-content">
        {/* Quiz Title */}
        <div className="quiz-title-panel">
          <span className="action-star">★</span>
          <h2 className="quiz-title">SDGs 機智問答計分</h2>
          <span className="action-star">★</span>
        </div>

        {/* Scoreboard */}
        <Scoreboard />
      </main>

      {/* GM Entry (fixed bottom-right) */}
      <div className="gm-link-wrapper">
        <Link to="/gm" className="gm-link">GM 入口</Link>
      </div>
    </div>
  )
}
