import { useState } from 'react'
import { useAuth } from './contexts/AuthContext'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function VideoAnalysisUI() {
  const { user, token } = useAuth()
  const [selectedFile, setSelectedFile] = useState(null)
  const [dominantPosition, setDominantPosition] = useState(null)
  const [positionsDetected, setPositionsDetected] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [analysis, setAnalysis] = useState(null)
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

      // Use logged-in user's ID or demo user
      const userId = user?.id || user?.user_id || 'demo-user'

      // Upload video with auto_analyze enabled
      const uploadForm = new FormData()
      uploadForm.append('file', selectedFile)
      uploadForm.append('user_id', userId)
      uploadForm.append('title', selectedFile.name)
      uploadForm.append('description', 'Uploaded from frontend')
      uploadForm.append('auto_analyze', 'true') // Enable auto-analysis

      const headers = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const uploadRes = await fetch(`${API_BASE_URL}/api/videos/upload`, {
        method: 'POST',
        body: uploadForm,
        headers,
      })

      if (!uploadRes.ok) {
        const txt = await uploadRes.text()
        throw new Error(`Upload failed: ${uploadRes.status} ${txt}`)
      }

      const uploadData = await uploadRes.json()
      
      // Extract video ID from response
      const videoId = uploadData.video?.id || uploadData.id || uploadData.video_id

      // If upload response contains analysis, use it
      if (uploadData.analysis) {
        const analysisData = uploadData.analysis
        setAnalysis(analysisData)
        
        // Extract position data from pose_analysis
        if (analysisData.pose_analysis) {
          setDominantPosition(analysisData.pose_analysis.dominant_position || null)
          setPositionsDetected(analysisData.pose_analysis.positions_detected || [])
        }
        
        // Extract recommendations
        if (analysisData.llm_analysis?.recommendations) {
          setRecommendations(analysisData.llm_analysis.recommendations)
        }
      } else if (videoId) {
        // Otherwise, make separate analyze request
        const analyzeRes = await fetch(
          `${API_BASE_URL}/api/videos/${videoId}/analyze`,
          { 
            method: 'POST',
            headers,
          }
        )

        if (!analyzeRes.ok) {
          const txt = await analyzeRes.text()
          throw new Error(`Analyze failed: ${analyzeRes.status} ${txt}`)
        }

        const analyzeData = await analyzeRes.json()
        setAnalysis(analyzeData)
        setDominantPosition(analyzeData.dominant_position || analyzeData.pose_analysis?.dominant_position || null)
        setPositionsDetected(analyzeData.positions_detected || analyzeData.pose_analysis?.positions_detected || [])
        setRecommendations(analyzeData.recommendations || analyzeData.llm_analysis?.recommendations || [])
      }
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

      {!user && (
        <div className="info-banner">
          <p>Sign in for a personalized training experience and save your analysis history.</p>
        </div>
      )}

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
        {error && <p style={{ color: 'var(--error)' }} className="error-message">{error}</p>}
      </div>

      {analysis && (
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
            {analysis.pose_analysis?.total_frames && (
              <div className="stat-card">
                <span className="stat-label">Total Frames</span>
                <span className="stat-value">
                  {analysis.pose_analysis.total_frames}
                </span>
              </div>
            )}
            {analysis.pose_analysis?.keypoints_detected && (
              <div className="stat-card">
                <span className="stat-label">Keypoints Detected</span>
                <span className="stat-value">
                  {analysis.pose_analysis.keypoints_detected}
                </span>
              </div>
            )}
          </div>

          {positionsDetected.length > 0 && (
            <div className="positions-timeline">
              <h4>Position Timeline</h4>
              <ul>
                {positionsDetected.slice(0, 10).map((pos, idx) => (
                  <li key={idx}>{pos}</li>
                ))}
                {positionsDetected.length > 10 && (
                  <li className="more-positions">... and {positionsDetected.length - 10} more</li>
                )}
              </ul>
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="recommendations">
              <h4>💡 Recommendations</h4>
              <ul>
                {recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis.llm_analysis?.analysis && (
            <div className="analysis-text">
              <h4>📝 Detailed Analysis</h4>
              <p>{analysis.llm_analysis.analysis}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default VideoAnalysisUI
