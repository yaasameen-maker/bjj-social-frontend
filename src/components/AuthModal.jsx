import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [beltRank, setBeltRank] = useState('white')
  const [academy, setAcademy] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const { login, signup, forgotPassword, error, loading } = useAuth()

  if (!isOpen) return null

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await login(email, password, rememberMe)
      onClose()
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      await signup(username, email, password, beltRank, academy)
      onClose()
    } catch (err) {
      console.error('Signup failed:', err)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    try {
      await forgotPassword(forgotEmail)
      setForgotSent(true)
    } catch (err) {
      console.error('Forgot password failed:', err)
    }
  }

  const inputCls = "w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:border-secondary/60 disabled:opacity-50 transition-all"
  const labelCls = "text-[10px] font-black uppercase tracking-widest text-white/50 block mb-2"
  const btnPrimary = "w-full bg-secondary hover:brightness-110 text-white py-4 rounded-sm font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-primary rounded-sm w-full max-w-md relative overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary font-black text-[10px] uppercase tracking-[0.2em] mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Meta Jiu-Jitsu</p>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
              </h2>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="relative px-8 py-8">
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} className={inputCls} placeholder="your@email.com" />
              </div>
              <div>
                <label className={labelCls}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} className={inputCls} placeholder="••••••••" />
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="accent-secondary" />
                  <span className="text-[11px] text-white/50 font-bold uppercase tracking-wide">Remember me</span>
                </label>
                <button type="button" className="text-[11px] text-secondary font-bold uppercase tracking-wide hover:text-white transition-colors"
                  onClick={() => { setMode('forgot'); setForgotEmail(email); setForgotSent(false) }}>
                  Forgot password?
                </button>
              </div>
              {error && <div className="bg-secondary/10 border border-secondary/30 text-[#ff6b6b] text-xs font-bold px-4 py-3 rounded-sm">{error}</div>}
              <button type="submit" className={btnPrimary} disabled={loading} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <span className="material-symbols-outlined text-sm">{loading ? 'hourglass_empty' : 'login'}</span>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <p className="text-center text-[11px] text-white/40 pt-2">
                No account?{' '}
                <button type="button" className="text-secondary font-bold hover:text-white transition-colors"
                  onClick={() => { setMode('signup'); setEmail(''); setPassword(''); setUsername('') }}>
                  Sign up free
                </button>
              </p>
            </form>
          )}

          {mode === 'forgot' && (
            <div>
              {forgotSent ? (
                <div className="text-center space-y-5">
                  <span className="material-symbols-outlined text-5xl text-secondary block">mark_email_read</span>
                  <p className="text-white/80 text-sm">If an account exists for <strong className="text-white">{forgotEmail}</strong>, you will receive a password reset link.</p>
                  <p className="text-white/40 text-xs">Check your inbox and spam folder.</p>
                  <button type="button" className={btnPrimary} onClick={() => setMode('login')} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-white/50 text-xs mb-4">Enter your email and we will send you a link to reset your password.</p>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required disabled={loading} className={inputCls} placeholder="your@email.com" />
                  </div>
                  {error && <div className="bg-secondary/10 border border-secondary/30 text-[#ff6b6b] text-xs font-bold px-4 py-3 rounded-sm">{error}</div>}
                  <button type="submit" className={btnPrimary} disabled={loading} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <span className="material-symbols-outlined text-sm">send</span>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                  <p className="text-center">
                    <button type="button" className="text-[11px] text-white/40 hover:text-white transition-colors font-bold uppercase tracking-widest"
                      onClick={() => setMode('login')}>
                      Back to Sign In
                    </button>
                  </p>
                </form>
              )}
            </div>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={labelCls}>Username</label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={loading} className={inputCls} placeholder="gordanryan" />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} className={inputCls} placeholder="your@email.com" />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} className={inputCls} placeholder="••••••••" />
                </div>
                <div>
                  <label className={labelCls}>Belt Rank</label>
                  <select value={beltRank} onChange={(e) => setBeltRank(e.target.value)} disabled={loading} className={inputCls}>
                    {['white', 'blue', 'purple', 'brown', 'black'].map(b => (
                      <option key={b} value={b} className="bg-primary">{b.charAt(0).toUpperCase() + b.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Academy</label>
                  <input type="text" value={academy} onChange={(e) => setAcademy(e.target.value)} disabled={loading} className={inputCls} placeholder="Optional" />
                </div>
              </div>
              {error && <div className="bg-secondary/10 border border-secondary/30 text-[#ff6b6b] text-xs font-bold px-4 py-3 rounded-sm">{error}</div>}
              <button type="submit" className={btnPrimary} disabled={loading} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <span className="material-symbols-outlined text-sm">{loading ? 'hourglass_empty' : 'person_add'}</span>
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
              <p className="text-center text-[11px] text-white/40 pt-2">
                Have an account?{' '}
                <button type="button" className="text-secondary font-bold hover:text-white transition-colors"
                  onClick={() => { setMode('login'); setEmail(''); setPassword('') }}>
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthModal
