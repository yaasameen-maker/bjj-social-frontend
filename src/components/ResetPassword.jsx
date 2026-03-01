import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './ResetPassword.css'

export default function ResetPassword() {
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [validating, setValidating] = useState(true)
  const { resetPassword, error, loading } = useAuth()

  useEffect(() => {
    // Get token from URL search params
    const params = new URLSearchParams(window.location.search)
    const tokenFromUrl = params.get('token')
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    }
    setValidating(false)
  }, [])

  const handleReset = async (e) => {
    e.preventDefault()
    
    if (!token) {
      alert('Invalid or missing reset token')
      return
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters')
      return
    }

    try {
      await resetPassword(token, newPassword)
      setSuccess(true)
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      console.error('Reset failed:', err)
    }
  }

  if (validating) {
    return <div className="reset-password"><p>Loading...</p></div>
  }

  if (!token) {
    return (
      <div className="reset-password">
        <div className="reset-form">
          <h2>Invalid Reset Link</h2>
          <p>The password reset link is missing or invalid.</p>
          <p>Please request a new password reset from the login page.</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="reset-password">
        <div className="reset-form">
          <div className="success-message">
            <h2>✓ Password Reset Successfully</h2>
            <p>Your password has been changed.</p>
            <p>You can now <a href="/">return to login</a> with your new password.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="reset-password">
      <div className="reset-form">
        <h2>Reset Your Password</h2>
        <form onSubmit={handleReset}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
              disabled={loading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-reset" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
