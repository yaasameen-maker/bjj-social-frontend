import { useState } from 'react'
import './App.css'

function App() {
  const [video, setVideo] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!video) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', video)
    formData.append('user_id', '1')
    formData.append('title', 'Training Session')

    try {
      const res = await fetch(`${API_URL}/api/videos/upload`, {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      
      // Analyze video
      const analysisRes = await fetch(
        `${API_URL}/api/videos/${data.video.id}/analyze`,
        { method: 'POST' }
      )
      const analysisData = await analysisRes.json()
      setAnalysis(analysisData)
      
      alert('Video uploaded and analyzed!')
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="App">
      <h1>🥋 BJJ Social - AI Training Platform</h1>
      
      <div className="upload-section">
        <h2>Upload Training Video</h2>
        <input 
          type="file" 
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
        />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload & Analyze'}
        </button>
      </div>

      {analysis && (
        <div className="analysis-results">
          <h2>AI Analysis Results</h2>
          <div className="positions">
            <h3>Positions Detected:</h3>
            {analysis.positions_detected?.map((p, i) => (
              <div key={i} className="position-item">
                <span>{p.position}</span>
                <span>{p.timestamp.toFixed(1)}s</span>
                <span>{(p.confidence * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
          
          <div className="recommendations">
            <h3>Training Recommendations:</h3>
            <ul>
              {analysis.analysis?.recommendations?.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
