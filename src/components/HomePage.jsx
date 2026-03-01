import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { TournamentService, SeminarService, CalendarService } from '../services/BackendServices'
import './HomePage.css'

export default function HomePage({ onNavigate }) {
  const { user } = useAuth()
  const [upcomingTournaments, setUpcomingTournaments] = useState([])
  const [upcomingSeminars, setUpcomingSeminars] = useState([])
  const [myEvents, setMyEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const tournamentService = TournamentService()
  const seminarService = SeminarService()
  const calendarService = user ? CalendarService() : null

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tournaments, seminars] = await Promise.all([
        tournamentService.getUpcoming(5),
        seminarService.getUpcoming(5),
      ])
      setUpcomingTournaments(tournaments)
      setUpcomingSeminars(seminars)

      if (user && calendarService) {
        const events = await calendarService.getUpcomingEvents(30)
        setMyEvents(events)
      }
    } catch (err) {
      console.error('Failed to fetch home data:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="home-hero">
        <h1 className="home-title">
          {user ? `Welcome back, ${user.username}!` : 'Train Smarter with AI'}
        </h1>
        <p className="home-subtitle">
          {user 
            ? 'Your personalized BJJ dashboard awaits'
            : 'Upload videos, get AI analysis, find training partners, and level up your game'}
        </p>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <button className="action-card" onClick={() => onNavigate('analysis')}>
          <span className="action-icon">📹</span>
          <span className="action-title">Video Analysis</span>
          <span className="action-desc">AI-powered technique breakdown</span>
        </button>
        <button className="action-card" onClick={() => onNavigate('positions')}>
          <span className="action-icon">🗺️</span>
          <span className="action-title">Positions Map</span>
          <span className="action-desc">Interactive BJJ flow chart</span>
        </button>
        <button className="action-card" onClick={() => onNavigate('coach')}>
          <span className="action-icon">🤖</span>
          <span className="action-title">AI Coach</span>
          <span className="action-desc">Get personalized advice</span>
        </button>
        <button className="action-card" onClick={() => onNavigate('gyms')}>
          <span className="action-icon">📍</span>
          <span className="action-title">Find Gyms</span>
          <span className="action-desc">Academies near you</span>
        </button>
      </section>

      {/* Content Grid */}
      <div className="home-grid">
        {/* User's Calendar (if logged in) */}
        {user && (
          <section className="home-section user-events">
            <div className="section-header">
              <h2>📅 Your Upcoming Events</h2>
              <button className="see-all" onClick={() => onNavigate('calendar')}>
                View Calendar →
              </button>
            </div>
            {myEvents.length > 0 ? (
              <ul className="event-list">
                {myEvents.slice(0, 5).map((event) => (
                  <li key={event.id} className="event-item">
                    <span className="event-date">{formatDate(event.start_date)}</span>
                    <span className="event-title">{event.title}</span>
                    <span className={`event-type type-${event.event_type}`}>
                      {event.event_type}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No upcoming events. Add some!</p>
            )}
          </section>
        )}

        {/* Upcoming Tournaments */}
        <section className="home-section">
          <div className="section-header">
            <h2>🏆 Upcoming Tournaments</h2>
            <button className="see-all" onClick={() => onNavigate('tournaments')}>
              See All →
            </button>
          </div>
          {loading ? (
            <p className="loading">Loading...</p>
          ) : upcomingTournaments.length > 0 ? (
            <ul className="event-list">
              {upcomingTournaments.map((t) => (
                <li key={t.id} className="event-item">
                  <span className="event-date">{formatDate(t.event_date)}</span>
                  <span className="event-title">{t.name}</span>
                  <span className="event-location">{t.city || t.location}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No tournaments found</p>
          )}
        </section>

        {/* Upcoming Seminars */}
        <section className="home-section">
          <div className="section-header">
            <h2>📚 Upcoming Seminars</h2>
            <button className="see-all" onClick={() => onNavigate('seminars')}>
              See All →
            </button>
          </div>
          {loading ? (
            <p className="loading">Loading...</p>
          ) : upcomingSeminars.length > 0 ? (
            <ul className="event-list">
              {upcomingSeminars.map((s) => (
                <li key={s.id} className="event-item">
                  <span className="event-date">{formatDate(s.event_date)}</span>
                  <span className="event-title">{s.title}</span>
                  <span className="event-instructor">with {s.instructor}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No seminars found</p>
          )}
        </section>

        {/* Profile Card (if logged in) */}
        {user && (
          <section className="home-section profile-card">
            <div className="profile-header">
              <div className="avatar">
                {user.profile_picture_url ? (
                  <img src={user.profile_picture_url} alt={user.username} />
                ) : (
                  <span className="avatar-placeholder">{user.username[0].toUpperCase()}</span>
                )}
              </div>
              <div className="profile-info">
                <h3>{user.full_name || user.username}</h3>
                <span className={`belt belt-${user.belt_rank}`}>{user.belt_rank} belt</span>
                {user.academy && <span className="academy">{user.academy}</span>}
              </div>
            </div>
            <button className="profile-btn" onClick={() => onNavigate('profile')}>
              Edit Profile →
            </button>
          </section>
        )}

        {/* Sign up CTA (if not logged in) */}
        {!user && (
          <section className="home-section cta-card">
            <h3>Join the Community</h3>
            <p>
              Create a free account to save your analysis, track tournaments, and connect
              with training partners.
            </p>
            <button className="cta-btn" onClick={() => onNavigate('signup')}>
              Sign Up Free
            </button>
          </section>
        )}
      </div>
    </div>
  )
}
