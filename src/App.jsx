import { useState } from 'react'
import './App.css'

function App() {
  const [video, setVideo] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  
  const API_URL = import.meta.env.VITE_API_URL || 'https://bjj-social-backend-production.up.railway.app'

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!video) {
      setError('Please select a video file')
      return
    }

    setUploading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('file', video)
    formData.append('user_id', '1')
    formData.append('title', 'BJJ Training Session')
    formData.append('description', 'Analyzing my technique')

    try {
      const res = await fetch(`${API_URL}/api/videos/upload`, {
        method: 'POST',
        body: formData
      })
      
      if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`)
      }
      
      const data = await res.json()
      
      // Get analysis
      const analysisRes = await fetch(
        `${API_URL}/api/videos/${data.video.id}/analyze`,
        { method: 'POST' }
      )
      const analysisData = await analysisRes.json()
      setAnalysis(analysisData)
      
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🥋</span>
          <h1>BJJ Social</h1>
        </div>
        <nav>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#" className="btn-login">Login</a>
        </nav>
      </header>

      <main className="hero">
        <div className="hero-content">
          <h2 className="hero-title">
            AI-Powered BJJ Training Platform
          </h2>
          <p className="hero-subtitle">
            Upload your training videos and get instant AI analysis with position detection, 
            technique recommendations, and personalized coaching.
          </p>

          <div className="upload-card">
            <h3>Upload Training Video</h3>
            
            {error && (
              <div className="error-banner">
                ⚠️ {error}
              </div>
            )}

            <div className="upload-area">
              <input 
                type="file" 
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
                id="video-upload"
                className="file-input"
              />
              <label htmlFor="video-upload" className="file-label">
                {video ? (
                  <div className="file-selected">
                    <span className="file-icon">📹</span>
                    <span className="file-name">{video.name}</span>
                  </div>
                ) : (
                  <div className="file-placeholder">
                    <span className="upload-icon">⬆️</span>
                    <span>Choose video file or drag & drop</span>
                    <span className="file-hint">MP4, MOV, AVI up to 100MB</span>
                  </div>
                )}
              </label>
            </div>

            <button 
              onClick={handleUpload} 
              disabled={uploading || !video}
              className="btn-upload"
            >
              {uploading ? '🔄 Analyzing...' : '🚀 Upload & Analyze'}
            </button>
          </div>

          {analysis && (
            <div className="results-card">
              <h3>🎯 Analysis Results</h3>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Dominant Position</span>
                  <span className="stat-value">{analysis.analysis?.dominant_position || 'N/A'}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Positions Detected</span>
                  <span className="stat-value">{analysis.positions_detected?.length || 0}</span>
                </div>
              </div>

              <div className="positions-timeline">
                <h4>Position Timeline</h4>
                {analysis.positions_detected?.slice(0, 5).map((p, i) => (
                  <div key={i} className="timeline-item">
                    <span className="timeline-time">{p.timestamp?.toFixed(1)}s</span>
                    <span className="timeline-position">{p.position}</span>
                    <span className="timeline-confidence">{(p.confidence * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>

              <div className="recommendations">
                <h4>💡 Recommendations</h4>
                <ul>
                  {analysis.analysis?.recommendations?.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 BJJ Social - AI Training Platform</p>
      </footer>
    </div>
  )
}

export default App
