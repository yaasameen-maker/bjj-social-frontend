import { useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function VideoAnalysisUI() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [dominantPosition, setDominantPosition] = useState(null)
  const [positionsDetected, setPositionsDetected] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)
    setError(null)
  }

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a video first.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // 1) Upload video
      const uploadForm = new FormData()
      uploadForm.append('file', selectedFile)      // must match FastAPI
      uploadForm.append('user_id', 'demo-user')    // adjust as needed
      uploadForm.append('title', selectedFile.name)
      uploadForm.append('description', 'Uploaded from frontend')
      uploadForm.append('auto_analyze', 'false')

      const uploadRes = await fetch(
        `${API_BASE_URL}/api/videos/upload`,
        { method: 'POST', body: uploadForm }
      )

      if (!uploadRes.ok) {
        const txt = await uploadRes.text()
        throw new Error(`Upload failed: ${uploadRes.status} ${txt}`)
      }

      const uploadData = await uploadRes.json()
      const videoId = uploadData.id || uploadData.video_id

      // 2) Analyze video
      const analyzeRes = await fetch(
        `${API_BASE_URL}/api/videos/${videoId}/analyze`,
        { method: 'POST' }
      )

      if (!analyzeRes.ok) {
        const txt = await analyzeRes.text()
        throw new Error(`Analyze failed: ${analyzeRes.status} ${txt}`)
      }

      const analyzeData = await analyzeRes.json()

      setDominantPosition(analyzeData.dominant_position || null)
      setPositionsDetected(analyzeData.positions_detected || [])
      setRecommendations(analyzeData.recommendations || [])
    } catch (err) {
      console.error(err)
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="hero-content">
      <h2 className="hero-title">AI-Powered BJJ Training Platform</h2>
      <p className="hero-subtitle">
        Upload your training videos and get instant AI analysis with position
        detection, technique recommendations, and personalized coaching.
      </p>

      <div className="upload-card">
        <h3>Upload Training Video</h3>
        <div className="upload-area">
          <input
            accept="video/*"
            id="video-upload"
            className="file-input"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="video-upload" className="file-label">
            <div className="file-selected">
              <span className="file-icon">📹</span>
              <span className="file-name">
                {selectedFile ? selectedFile.name : 'Choose a video'}
              </span>
            </div>
          </label>
        </div>
        <button
          className="btn-upload"
          onClick={handleUploadAndAnalyze}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : '🚀 Upload & Analyze'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div className="results-card">
        <h3>🎯 Analysis Results</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Dominant Position</span>
            <span className="stat-value">
              {dominantPosition || 'N/A'}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Positions Detected</span>
            <span className="stat-value">
              {positionsDetected.length}
            </span>
          </div>
        </div>

        <div className="positions-timeline">
          <h4>Position Timeline</h4>
          <ul>
            {positionsDetected.map((pos, idx) => (
              <li key={idx}>{pos}</li>
            ))}
          </ul>
        </div>

        <div className="recommendations">
          <h4>💡 Recommendations</h4>
          <ul>
            {recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default VideoAnalysisUI
