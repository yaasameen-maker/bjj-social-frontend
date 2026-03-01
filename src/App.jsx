import './App.css'
import { useState } from 'react'
import VideoAnalysisUI from './VideoAnalysisUI'
import PositionsNetwork from './PositionsNetwork'
import UserProfile from './components/UserProfile'
import TournamentsList from './components/TournamentsList'
import AICoach from './components/AICoach'
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
            Positions
          </button>
          {user && (
            <>
              <button 
                className={`nav-btn ${activeTab === 'coach' ? 'active' : ''}`}
                onClick={() => setActiveTab('coach')}
              >
                Coach
              </button>
              <button 
                className={`nav-btn ${activeTab === 'tournaments' ? 'active' : ''}`}
                onClick={() => setActiveTab('tournaments')}
              >
                Tournaments
              </button>
              <button 
                className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
            </>
          )}
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
        {activeTab === 'coach' && user && <AICoach />}
        {activeTab === 'tournaments' && user && <TournamentsList />}
        {activeTab === 'profile' && user && <UserProfile />}
        {!user && (activeTab === 'coach' || activeTab === 'tournaments' || activeTab === 'profile') && (
          <div className="auth-required">
            <h2>Sign in to access this feature</h2>
            <button 
              className="btn-login-modal"
              onClick={() => {
                setAuthMode('login')
                setAuthModalOpen(true)
              }}
            >
              Sign In
            </button>
          </div>
        )}
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
