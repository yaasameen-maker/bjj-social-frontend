import './App.css'
import { useState, useEffect } from 'react'
import VideoAnalysisUI from './VideoAnalysisUI'
import Rankings from './components/Rankings'
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

const NAV_ITEMS = [
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'home', label: 'Dashboard', icon: 'dashboard' },
  { id: 'training', label: 'Training', icon: 'calendar_today' },
  { id: 'porrada', label: 'Porrada', icon: 'sports_martial_arts' },
  { id: 'coach', label: 'AI Coach', icon: 'psychology' },
  { id: 'news', label: 'News', icon: 'newspaper' },
]

const TOP_NAV = [
  { id: 'home', label: 'Academy' },
  { id: 'coach', label: 'Analysis' },
  { id: 'rankings', label: 'Rankings' },
]

function Sidebar({ activeTab, setActiveTab, user, logout, openAuth }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-navy-dark hidden lg:flex flex-col pt-20 z-40 border-r border-white/5 shadow-2xl">
      <div className="px-8 mb-8">
        <h2 className="text-lg font-black text-slate-100 uppercase tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          MetaJitsu Board
        </h2>
        <p className="text-[10px] font-bold tracking-[0.2em] text-secondary uppercase mt-0.5">
          Elite Performance
        </p>
      </div>
      <nav className="flex-1 space-y-1 px-4">
        {NAV_ITEMS.map(({ id, label, icon }) => {
          const isActive = activeTab === id
          const needsAuth = ['profile', 'training', 'coach'].includes(id)
          return (
            <button
              key={id}
              onClick={() => {
                if (needsAuth && !user) { openAuth('login'); return }
                setActiveTab(id)
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-sm font-black uppercase text-xs tracking-widest transition-all ${
                isActive
                  ? 'bg-secondary text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              <span className="material-symbols-outlined text-xl">{icon}</span>
              {label}
            </button>
          )
        })}
      </nav>
      <div className="px-6 mb-6">
        <button className="w-full bg-primary hover:bg-primary-container text-white font-black text-[11px] uppercase tracking-widest py-3 px-4 rounded-sm transition-all border border-white/10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Go Pro
        </button>
      </div>
      <div className="px-6 pb-6 border-t border-white/5 pt-4 space-y-1">
        <button className="w-full flex items-center gap-4 text-slate-400 p-2 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
          <span className="material-symbols-outlined text-lg">help</span>
          Support
        </button>
        {user ? (
          <button onClick={logout} className="w-full flex items-center gap-4 text-slate-400 p-2 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-lg">logout</span>
            Logout
          </button>
        ) : (
          <button onClick={() => openAuth('login')} className="w-full flex items-center gap-4 text-slate-400 p-2 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-lg">login</span>
            Sign In
          </button>
        )}
      </div>
    </aside>
  )
}

function TopNav({ activeTab, setActiveTab, user, openAuth }) {
  return (
    <nav className="fixed top-0 w-full h-16 flex justify-between items-center px-8 bg-primary/95 backdrop-blur-md z-50 shadow-xl border-b border-white/5">
      <div className="flex items-center gap-10">
        <button onClick={() => setActiveTab('home')} className="text-2xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          METJITSU
        </button>
        <div className="hidden md:flex gap-8">
          {TOP_NAV.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`font-black tracking-tight uppercase text-sm transition-colors pb-0.5 ${activeTab === id ? 'text-white border-b-2 border-secondary' : 'text-slate-300 hover:text-white'}`}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input className="bg-white/10 border border-white/10 rounded-sm py-2 pl-10 pr-4 w-56 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-white/30 transition-all" placeholder="Search fighters..." type="text" />
        </div>
        <button className="text-white hover:bg-white/10 rounded-sm p-2 transition-all">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-white hover:bg-white/10 rounded-sm p-2 transition-all">
          <span className="material-symbols-outlined">chat</span>
        </button>
        {user ? (
          <div className="w-9 h-9 rounded-full bg-primary-container border-2 border-white/20 hover:border-white/40 transition-colors overflow-hidden flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-white text-lg">person</span>
          </div>
        ) : (
          <button onClick={() => openAuth('login')} className="bg-secondary hover:bg-secondary-container text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-sm transition-all" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Sign In
          </button>
        )}
      </div>
    </nav>
  )
}

function AuthGate({ openAuth }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-8">
      <span className="material-symbols-outlined text-6xl text-slate-600">lock</span>
      <h2 className="text-2xl font-black text-white uppercase tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Sign In Required</h2>
      <p className="text-slate-400 text-sm max-w-sm">Create an account or log in to access your personal training data, AI coach, and profile.</p>
      <div className="flex gap-3">
        <button onClick={() => openAuth('login')} className="bg-secondary hover:bg-secondary-container text-white font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-sm transition-all" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Sign In</button>
        <button onClick={() => openAuth('register')} className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-sm transition-all border border-white/10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Create Account</button>
      </div>
    </div>
  )
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('home')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [showResetPassword, setShowResetPassword] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('token')) setShowResetPassword(true)
  }, [])

  const openAuth = (mode = 'login') => { setAuthMode(mode); setAuthModalOpen(true) }

  if (showResetPassword) return <ResetPassword />

  const requiresAuth = ['profile', 'training', 'coach'].includes(activeTab)

  return (
    <div className="bg-navy-dark h-screen overflow-hidden">
      <TopNav activeTab={activeTab} setActiveTab={setActiveTab} user={user} openAuth={openAuth} />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} logout={logout} openAuth={openAuth} />
      <main className="lg:ml-72 pt-16 h-screen overflow-hidden">
        {requiresAuth && !user ? (
          <AuthGate openAuth={openAuth} />
        ) : (
          <>
            {activeTab === 'home' && <HomePage onNavigate={setActiveTab} onOpenAuth={openAuth} />}
            {activeTab === 'profile' && user && <UserProfile />}
            {activeTab === 'training' && user && <CalendarView />}
            {activeTab === 'coach' && user && <AICoach />}
            {activeTab === 'porrada' && <TournamentsList />}
            {activeTab === 'news' && <div className="h-full overflow-y-auto custom-scrollbar"><SeminarsList /></div>}
            {activeTab === 'rankings' && <Rankings />}
          </>
        )}
      </main>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode} />
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
