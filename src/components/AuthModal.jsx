import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './AuthModal.css'

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

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>✕</button>

        {mode === 'login' ? (
          <div className="auth-form">
            <h2>Login to BJJ Social</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="btn-forgot"
                  onClick={() => {
                    setMode('forgot')
                    setForgotEmail(email)
                    setForgotSent(false)
                  }}
                >
                  Forgot password?
                </button>
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="btn-auth" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p className="auth-switch">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup')
                  setEmail('')
                  setPassword('')
                  setUsername('')
                }}
              >
                Sign up
              </button>
            </p>
          </div>
        ) : mode === 'forgot' ? (
          <div className="auth-form">
            <h2>Reset Password</h2>
            {forgotSent ? (
              <div className="forgot-success">
                <p>If an account exists for <strong>{forgotEmail}</strong>, you will receive a password reset link.</p>
                <p className="forgot-note">Check your inbox and spam folder.</p>
                <button
                  type="button"
                  className="btn-auth"
                  onClick={() => setMode('login')}
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <p className="forgot-desc">Enter your email and we'll send you a link to reset your password.</p>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="btn-auth" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}
            <p className="auth-switch">
              <button type="button" onClick={() => setMode('login')}>
                Back to Login
              </button>
            </p>
          </div>
        ) : (
          <div className="auth-form">
            <h2>Create BJJ Social Account</h2>
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Belt Rank</label>
                <select
                  value={beltRank}
                  onChange={(e) => setBeltRank(e.target.value)}
                  disabled={loading}
                >
                  <option value="white">White</option>
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                  <option value="brown">Brown</option>
                  <option value="black">Black</option>
                </select>
              </div>
              <div className="form-group">
                <label>Academy (Optional)</label>
                <input
                  type="text"
                  value={academy}
                  onChange={(e) => setAcademy(e.target.value)}
                  disabled={loading}
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="btn-auth" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </form>
            <p className="auth-switch">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setEmail('')
                  setPassword('')
                }}
              >
                Login
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
