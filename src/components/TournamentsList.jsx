import { useState, useEffect } from 'react'
import { TournamentService } from '../services/BackendServices'
import './Tournaments.css'

export function TournamentsList() {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('upcoming')
  const [selectedTournament, setSelectedTournament] = useState(null)
  const [registering, setRegistering] = useState(false)
  const [registrationData, setRegistrationData] = useState({
    weight_class: '',
    division: 'Adult',
    is_gi: true,
  })

  const tournamentsService = TournamentService()

  useEffect(() => {
    fetchTournaments()
  }, [filterStatus])

  const fetchTournaments = async () => {
    try {
      setLoading(true)
      const data = await tournamentsService.listTournaments(filterStatus)
      setTournaments(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!selectedTournament) return

    try {
      setRegistering(true)
      await tournamentsService.registerForTournament(
        selectedTournament.id,
        registrationData.weight_class,
        registrationData.division,
        registrationData.is_gi
      )
      alert('Successfully registered for tournament!')
      setSelectedTournament(null)
      setRegistrationData({ weight_class: '', division: 'Adult', is_gi: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setRegistering(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) return <div className="tournaments-loading">Loading tournaments...</div>

  return (
    <div className="tournaments-container">
      <div className="tournaments-header">
        <h2>🏆 Tournaments</h2>
        <div className="filter-tabs">
          <button
            className={`filter-btn ${filterStatus === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilterStatus('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`filter-btn ${filterStatus === 'ongoing' ? 'active' : ''}`}
            onClick={() => setFilterStatus('ongoing')}
          >
            Ongoing
          </button>
          <button
            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tournament-list">
        {tournaments.length === 0 ? (
          <p className="no-tournaments">No tournaments found</p>
        ) : (
          tournaments.map((tournament) => (
            <div key={tournament.id} className="tournament-card">
              <div className="tournament-info">
                <h3>{tournament.name}</h3>
                <p className="organizer">{tournament.organizer}</p>
                <div className="tournament-meta">
                  <span className="meta-item">
                    📅 {formatDate(tournament.event_date)}
                  </span>
                  <span className="meta-item">📍 {tournament.location}</span>
                  <span className="meta-item">
                    {tournament.is_gi && tournament.is_no_gi
                      ? 'Gi & No-Gi'
                      : tournament.is_gi
                        ? 'Gi'
                        : 'No-Gi'}
                  </span>
                  {tournament.result_count > 0 && (
                    <span className="meta-item">👥 {tournament.result_count} competitors</span>
                  )}
                </div>
              </div>
              <button
                className="btn-register"
                onClick={() => setSelectedTournament(tournament)}
              >
                Register
              </button>
            </div>
          ))
        )}
      </div>

      {selectedTournament && (
        <div className="registration-modal-overlay" onClick={() => setSelectedTournament(null)}>
          <div className="registration-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedTournament(null)}
            >
              ✕
            </button>
            <h3>Register for {selectedTournament.name}</h3>
            <div className="registration-form">
              <div className="form-group">
                <label>Weight Class</label>
                <input
                  type="text"
                  placeholder="e.g. Light (-76kg)"
                  value={registrationData.weight_class}
                  onChange={(e) =>
                    setRegistrationData((prev) => ({
                      ...prev,
                      weight_class: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Division</label>
                <select
                  value={registrationData.division}
                  onChange={(e) =>
                    setRegistrationData((prev) => ({
                      ...prev,
                      division: e.target.value,
                    }))
                  }
                >
                  <option>Adult</option>
                  <option>Master 1</option>
                  <option>Master 2</option>
                  <option>Master 3</option>
                  <option>Juvenile</option>
                </select>
              </div>
              <div className="form-group">
                <label>Format</label>
                <select
                  value={registrationData.is_gi ? 'gi' : 'no-gi'}
                  onChange={(e) =>
                    setRegistrationData((prev) => ({
                      ...prev,
                      is_gi: e.target.value === 'gi',
                    }))
                  }
                >
                  {selectedTournament.is_gi && <option value="gi">Gi</option>}
                  {selectedTournament.is_no_gi && <option value="no-gi">No-Gi</option>}
                </select>
              </div>
              <div className="button-group">
                <button
                  className="btn-submit"
                  onClick={handleRegister}
                  disabled={registering}
                >
                  {registering ? 'Registering...' : 'Confirm Registration'}
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => setSelectedTournament(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TournamentsList
