import { useState, useEffect } from 'react'
import { CalendarService } from '../services/BackendServices'
import { useAuth } from '../contexts/AuthContext'
import './CalendarView.css'

export default function CalendarView() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    event_type: 'training',
    start_date: '',
    end_date: '',
    location: '',
    notes: '',
    color: '#3B82F6',
  })

  const calendarService = user ? CalendarService() : null

  useEffect(() => {
    if (user) {
      fetchEvents()
    }
  }, [user, currentMonth])

  const fetchEvents = async () => {
    if (!calendarService) return
    try {
      setLoading(true)
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
      
      const data = await calendarService.getEvents(
        null,
        firstDay.toISOString(),
        lastDay.toISOString()
      )
      setEvents(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addEvent = async () => {
    if (!calendarService || !newEvent.title || !newEvent.start_date) return
    try {
      await calendarService.createEvent(newEvent)
      setShowAddModal(false)
      setNewEvent({
        title: '',
        event_type: 'training',
        start_date: '',
        end_date: '',
        location: '',
        notes: '',
        color: '#3B82F6',
      })
      fetchEvents()
    } catch (err) {
      alert('Failed to add event: ' + err.message)
    }
  }

  const deleteEvent = async (eventId) => {
    if (!calendarService) return
    if (!confirm('Delete this event?')) return
    try {
      await calendarService.deleteEvent(eventId)
      fetchEvents()
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay()

    const days = []
    // Add empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null)
    }
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    return days
  }

  const getEventsForDate = (date) => {
    if (!date) return []
    return events.filter((event) => {
      const eventDate = new Date(event.start_date)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  if (!user) {
    return (
      <div className="calendar-auth-required">
        <h2>📅 Personal Calendar</h2>
        <p>Sign in to access your personal training calendar.</p>
      </div>
    )
  }

  const days = getDaysInMonth()
  const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>📅 My Calendar</h2>
        <button className="btn-add-event" onClick={() => setShowAddModal(true)}>
          + Add Event
        </button>
      </div>

      <div className="calendar-nav">
        <button onClick={goToPrevMonth}>← Prev</button>
        <h3>{monthName}</h3>
        <button onClick={goToNextMonth}>Next →</button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {days.map((date, index) => {
            const dayEvents = getEventsForDate(date)
            const isToday = date && 
              date.toDateString() === new Date().toDateString()
            const isSelected = selectedDate && date &&
              date.toDateString() === selectedDate.toDateString()

            return (
              <div
                key={index}
                className={`calendar-day ${!date ? 'empty' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => date && setSelectedDate(date)}
              >
                {date && (
                  <>
                    <span className="day-number">{date.getDate()}</span>
                    {dayEvents.length > 0 && (
                      <div className="day-events">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className="day-event-dot"
                            style={{ backgroundColor: event.color }}
                            title={event.title}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="selected-date-events">
          <h4>
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </h4>
          {getEventsForDate(selectedDate).length === 0 ? (
            <p className="no-events">No events scheduled</p>
          ) : (
            <ul className="event-list">
              {getEventsForDate(selectedDate).map((event) => (
                <li key={event.id} className="event-item">
                  <div
                    className="event-color"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="event-details">
                    <span className="event-title">{event.title}</span>
                    <span className="event-time">{formatTime(event.start_date)}</span>
                    <span className={`event-type type-${event.event_type}`}>
                      {event.event_type}
                    </span>
                  </div>
                  <button
                    className="btn-delete-event"
                    onClick={() => deleteEvent(event.id)}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            <h3>Add New Event</h3>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Training session, competition, etc."
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select
                value={newEvent.event_type}
                onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value })}
              >
                <option value="training">Training</option>
                <option value="tournament">Tournament</option>
                <option value="seminar">Seminar</option>
                <option value="competition">Competition</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Start Date & Time</label>
              <input
                type="datetime-local"
                value={newEvent.start_date}
                onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Location (optional)</label>
              <input
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="Gym, arena, etc."
              />
            </div>
            <div className="form-group">
              <label>Color</label>
              <input
                type="color"
                value={newEvent.color}
                onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Notes (optional)</label>
              <textarea
                value={newEvent.notes}
                onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                placeholder="Any additional details..."
              />
            </div>
            <button className="btn-submit" onClick={addEvent}>
              Add Event
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
