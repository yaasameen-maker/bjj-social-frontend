import './App.css'
import { useState } from 'react'
import VideoAnalysisUI from './VideoAnalysisUI'
import PositionsNetwork from './PositionsNetwork'

function App() {
  const [activeTab, setActiveTab] = useState('analysis')

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🥋</span>
          <h1>BJJ Social</h1>
        </div>
        <nav>
          <button 
            className={`nav-btn ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            Analysis
          </button>
          <button 
            className={`nav-btn ${activeTab === 'positions' ? 'active' : ''}`}
            onClick={() => setActiveTab('positions')}
          >
            Positions Map
          </button>
          <a href="#" className="btn-login">Login</a>
        </nav>
      </header>

      <main className="hero">
        {activeTab === 'analysis' && <VideoAnalysisUI />}
        {activeTab === 'positions' && <PositionsNetwork />}
      </main>

      <footer className="footer">
        <p>© 2025 BJJ Social - AI Training Platform</p>
      </footer>
    </div>
  )
}

export default App
