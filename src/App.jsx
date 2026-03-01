import './App.css'
import { useState, useEffect } from 'react'
import VideoAnalysisUI from './VideoAnalysisUI'
import PositionsNetwork from './PositionsNetwork'
import UserProfile from './components/UserProfile'
import TournamentsList from './components/TournamentsList'
import AICoach from './components/AICoach'
import HomePage from './components/HomePage'
import SeminarsList from './components/SeminarsList'
import CalendarView from './components/CalendarView'
import GymsMap from './components/GymsMap'
import ResetPassword from './components/ResetPassword'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AuthModal } from './components/AuthModal'

function AppContent() {
  const [activeTab, setActiveTab] = useState('home')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [showResetPassword, setShowResetPassword] = useState(false)
  const { user, logout } = useAuth()

  // Check if user is on password reset page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('token')) {
      setShowResetPassword(true)
    }
  }, [])

  const openAuth = (mode = 'login') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  // Show reset password page if token is present
  if (showResetPassword) {
    return <ResetPassword />
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">🥋</span>
          <h1>BJJ Social</h1>
        </div>
        <nav>
          <button 
            className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
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
          <button 
            className={`nav-btn ${activeTab === 'seminars' ? 'active' : ''}`}
            onClick={() => setActiveTab('seminars')}
          >
            Seminars
          </button>
          <button 
            className={`nav-btn ${activeTab === 'tournaments' ? 'active' : ''}`}
            onClick={() => setActiveTab('tournaments')}
          >
            Tournaments
          </button>
          <button 
            className={`nav-btn ${activeTab === 'gyms' ? 'active' : ''}`}
            onClick={() => setActiveTab('gyms')}
          >
            Gyms
          </button>
          {user && (
            <>
              <button 
                className={`nav-btn ${activeTab === 'calendar' ? 'active' : ''}`}
                onClick={() => setActiveTab('calendar')}
              >
                Calendar
              </button>
              <button 
                className={`nav-btn ${activeTab === 'coach' ? 'active' : ''}`}
                onClick={() => setActiveTab('coach')}
              >
                Coach
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
              onClick={() => openAuth('login')}
            >
              Login
            </button>
          )}
        </nav>
      </header>

      <main className="hero">
        {activeTab === 'home' && (
          <HomePage 
            onNavigate={setActiveTab}
            onOpenAuth={openAuth}
          />
        )}
        {activeTab === 'analysis' && <VideoAnalysisUI />}
        {activeTab === 'positions' && <PositionsNetwork />}
        {activeTab === 'seminars' && <SeminarsList />}
        {activeTab === 'tournaments' && <TournamentsList />}
        {activeTab === 'gyms' && <GymsMap />}
        {activeTab === 'calendar' && user && <CalendarView />}
        {activeTab === 'coach' && user && <AICoach />}
        {activeTab === 'profile' && user && <UserProfile />}
        {!user && (activeTab === 'calendar' || activeTab === 'coach' || activeTab === 'profile') && (
          <div className="auth-required">
            <h2>Sign in to access this feature</h2>
            <p className="auth-required-desc">Create an account or log in to access your personal calendar, AI coach, and profile settings.</p>
            <div className="auth-required-buttons">
              <button 
                className="btn-login-modal"
                onClick={() => openAuth('login')}
              >
                Sign In
              </button>
              <button 
                className="btn-signup-modal"
                onClick={() => openAuth('register')}
              >
                Create Account
              </button>
            </div>
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
