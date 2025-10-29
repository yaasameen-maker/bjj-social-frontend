import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [backendStatus, setBackendStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(res => res.json())
      .then(data => {
        setBackendStatus(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setBackendStatus({ status: 'error', message: err.message })
        setLoading(false)
      })
  }, [])

  return (
    <div className="App">
      <h1>🥋 BJJ Social</h1>
      <p>AI-Powered Fighter Training Platform</p>
      <div style={{ 
        background: '#1a1a1a', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h2>Backend Status</h2>
        {loading ? (
          <p>Connecting to backend...</p>
        ) : (
          <div>
            <p>Status: <strong style={{ color: backendStatus?.status === 'healthy' ? '#4ade80' : '#f87171' }}>
              {backendStatus?.status || 'Unknown'}
            </strong></p>
            <p>API URL: {API_URL}</p>
          </div>
        )}
      </div>
      <div>
        <h2>Coming Soon</h2>
        <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
          <li>🎥 AI Video Analysis</li>
          <li>🏆 Fighter Rankings</li>
          <li>📅 Tournament Directory</li>
          <li>👥 Social Network</li>
          <li>🤖 AI Coach (MotionLLM)</li>
        </ul>
      </div>
    </div>
  )
}

export default App
