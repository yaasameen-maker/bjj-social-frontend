import { useState, useEffect } from 'react'
import { SeminarService, CalendarService } from '../services/BackendServices'
import { useAuth } from '../contexts/AuthContext'
import './Seminars.css'

export default function SeminarsList() {
  const { user } = useAuth()
  const [seminars, setSeminars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSeminar, setSelectedSeminar] = useState(null)
  const [addingToCalendar, setAddingToCalendar] = useState(false)

  const seminarService = SeminarService()
  const calendarService = user ? CalendarService() : null

  useEffect(() => {
    fetchSeminars()
  }, [])

  const fetchSeminars = async () => {
    try {
      setLoading(true)
      const data = await seminarService.getUpcoming(50)
      setSeminars(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addToCalendar = async (seminar) => {
    if (!user || !calendarService) {
      alert('Please log in to add events to your calendar')
      return
    }
    try {
      setAddingToCalendar(true)
      await calendarService.importSeminar(seminar.id)
      alert('Seminar added to your calendar!')
    } catch (err) {
      alert('Failed to add to calendar: ' + err.message)
    } finally {
      setAddingToCalendar(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatPrice = (price, currency) => {
    if (!price) return 'Free'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price)
  }

  if (loading) return <div className="seminars-loading">Loading seminars...</div>

  return (
    <div className="seminars-container">
      <div className="seminars-header">
        <h2>📚 Upcoming Seminars</h2>
        <p className="seminars-subtitle">Learn from world-class instructors</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="seminars-grid">
        {seminars.length === 0 ? (
          <div className="empty-state">No upcoming seminars at this time.</div>
        ) : (
          seminars.map((seminar) => (
            <div 
              key={seminar.id} 
              className={`seminar-card ${selectedSeminar?.id === seminar.id ? 'selected' : ''}`}
              onClick={() => setSelectedSeminar(seminar)}
            >
              <div className="seminar-date">
                <span className="date-day">
                  {new Date(seminar.event_date).getDate()}
                </span>
                <span className="date-month">
                  {new Date(seminar.event_date).toLocaleString('en-US', { month: 'short' })}
                </span>
              </div>
              
              <div className="seminar-content">
                <h3 className="seminar-title">{seminar.title}</h3>
                <p className="seminar-instructor">
                  <span className="instructor-badge">
                    {seminar.instructor_belt || 'Black'} Belt
                  </span>
                  {seminar.instructor}
                  {seminar.instructor_academy && 
                    <span className="instructor-academy"> • {seminar.instructor_academy}</span>
                  }
                </p>
                <p className="seminar-location">
                  📍 {seminar.location}
                  {seminar.city && `, ${seminar.city}`}
                  {seminar.country && `, ${seminar.country}`}
                </p>
                
                <div className="seminar-meta">
                  {seminar.duration_hours && (
                    <span className="meta-item">⏱️ {seminar.duration_hours}h</span>
                  )}
                  <span className="meta-item price">{formatPrice(seminar.price, seminar.currency)}</span>
                  {seminar.spots_remaining !== null && (
                    <span className={`meta-item spots ${seminar.spots_remaining < 10 ? 'low' : ''}`}>
                      {seminar.spots_remaining} spots left
                    </span>
                  )}
                </div>

                <div className="seminar-tags">
                  {seminar.is_gi && <span className="tag gi">Gi</span>}
                  {seminar.is_no_gi && <span className="tag nogi">No-Gi</span>}
                </div>
              </div>

              <div className="seminar-actions">
                {seminar.registration_url && (
                  <a 
                    href={seminar.registration_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-register"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Register
                  </a>
                )}
                <button 
                  className="btn-calendar"
                  onClick={(e) => {
                    e.stopPropagation()
                    addToCalendar(seminar)
                  }}
                  disabled={addingToCalendar}
                >
                  📅 Add to Calendar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Seminar Detail Modal */}
      {selectedSeminar && (
        <div className="seminar-modal-overlay" onClick={() => setSelectedSeminar(null)}>
          <div className="seminar-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedSeminar(null)}>✕</button>
            <h2>{selectedSeminar.title}</h2>
            <p className="modal-instructor">
              <strong>Instructor:</strong> {selectedSeminar.instructor}
              {selectedSeminar.instructor_belt && ` (${selectedSeminar.instructor_belt} Belt)`}
            </p>
            <p className="modal-date">
              <strong>Date:</strong> {formatDate(selectedSeminar.event_date)}
            </p>
            <p className="modal-location">
              <strong>Location:</strong> {selectedSeminar.location}
            </p>
            {selectedSeminar.description && (
              <p className="modal-description">{selectedSeminar.description}</p>
            )}
            <div className="modal-actions">
              {selectedSeminar.registration_url && (
                <a 
                  href={selectedSeminar.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-register-large"
                >
                  Register Now
                </a>
              )}
              <button 
                className="btn-calendar-large"
                onClick={() => addToCalendar(selectedSeminar)}
                disabled={addingToCalendar}
              >
                📅 Add to My Calendar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
