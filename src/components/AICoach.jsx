import { useState } from 'react'
import { CoachService } from '../services/BackendServices'
import './AICoach.css'

export function AICoach() {
  const [question, setQuestion] = useState('')
  const [position, setPosition] = useState('')
  const [beltRank, setBeltRank] = useState('blue')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const coachService = CoachService()

  const handleAsk = async () => {
    if (!question.trim()) {
      setError('Please enter a question')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const answer = await coachService.askCoach(
        question,
        null,
        position || null,
        beltRank || null
      )
      setResponse(answer)
      setQuestion('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-coach-container">
      <div className="coach-header">
        <h2>🤖 AI BJJ Coach</h2>
        <p>Ask the AI coach for technique tips, position advice, and training recommendations</p>
      </div>

      <div className="coach-input-section">
        <div className="input-group">
          <label>Your Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., 'How do I improve my armbar from closed guard?'"
            disabled={loading}
            rows="4"
          />
        </div>

        <div className="options-row">
          <div className="input-group">
            <label>Position (Optional)</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={loading}
            >
              <option value="">Any Position</option>
              <option value="closed guard">Closed Guard</option>
              <option value="mount">Mount</option>
              <option value="back control">Back Control</option>
              <option value="side control">Side Control</option>
              <option value="open guard">Open Guard</option>
              <option value="half guard">Half Guard</option>
            </select>
          </div>

          <div className="input-group">
            <label>Your Belt Rank (Optional)</label>
            <select value={beltRank} onChange={(e) => setBeltRank(e.target.value)} disabled={loading}>
              <option value="white">White Belt</option>
              <option value="blue">Blue Belt</option>
              <option value="purple">Purple Belt</option>
              <option value="brown">Brown Belt</option>
              <option value="black">Black Belt</option>
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          className="btn-ask"
          onClick={handleAsk}
          disabled={loading || !question.trim()}
        >
          {loading ? 'Thinking...' : '💭 Ask Coach'}
        </button>
      </div>

      {response && (
        <div className="coach-response">
          <h3>💡 Coach's Advice</h3>
          <div className="response-answer">
            <p>{response.answer}</p>
          </div>

          {response.tips && response.tips.length > 0 && (
            <div className="response-tips">
              <h4>📌 Key Tips:</h4>
              <ul>
                {response.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {response.related_positions && response.related_positions.length > 0 && (
            <div className="response-positions">
              <h4>🔗 Related Positions:</h4>
              <div className="position-tags">
                {response.related_positions.map((pos, idx) => (
                  <span key={idx} className="position-tag">
                    {pos}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button className="btn-ask-again" onClick={() => setResponse(null)}>
            Ask Another Question
          </button>
        </div>
      )}
    </div>
  )
}

export default AICoach
