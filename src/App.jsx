import './App.css'
import { useState } from 'react'
import VideoAnalysisUI from './VideoAnalysisUI'
import PositionsNetwork from './PositionsNetwork'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AuthModal } from './components/AuthModal'

function AppContent() {
  const [activeTab, setActiveTab] = useState('analysis')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const { user, logout } = useAuth()

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
          {user ? (
            <>
              <span className="user-info">{user.username}</span>
              <button 
                className="btn-login"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              className="btn-login"
              onClick={() => {
                setAuthMode('login')
                setAuthModalOpen(true)
              }}
            >
              Login
            </button>
          )}
        </nav>
      </header>

      <main className="hero">
        {activeTab === 'analysis' && <VideoAnalysisUI />}
        {activeTab === 'positions' && <PositionsNetwork />}
      </main>

      <footer className="footer">
        <p>© 2025 BJJ Social - AI Training Platform</p>
      </footer>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
