import { useState, useEffect } from 'react'
import { GymService } from '../services/BackendServices'
import './GymsMap.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function GymsMap() {
  const [gyms, setGyms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGym, setSelectedGym] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [searchRadius, setSearchRadius] = useState(50)

  const gymService = GymService()

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          console.log('Location access denied, showing all gyms')
          fetchAllGyms()
        }
      )
    } else {
      fetchAllGyms()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (userLocation) {
      fetchNearbyGyms()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, searchRadius])

  const fetchAllGyms = async () => {
    try {
      setLoading(true)
      const data = await gymService.listGyms()
      setGyms(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchNearbyGyms = async () => {
    if (!userLocation) return
    try {
      setLoading(true)
      const data = await gymService.searchNearby(
        userLocation.lat,
        userLocation.lng,
        searchRadius
      )
      setGyms(data)
    } catch {
      // Fallback to all gyms if nearby search fails
      await fetchAllGyms()
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      if (userLocation) {
        fetchNearbyGyms()
      } else {
        fetchAllGyms()
      }
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${API_BASE_URL}/api/gyms/search?q=${encodeURIComponent(searchQuery)}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setGyms(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const openInMaps = (gym) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${gym.latitude},${gym.longitude}`
    window.open(url, '_blank')
  }

  const getBeltColor = (belt) => {
    const colors = {
      white: '#f7fafc',
      blue: '#3182ce',
      purple: '#805ad5',
      brown: '#c05621',
      black: '#1a202c',
    }
    return colors[belt?.toLowerCase()] || '#718096'
  }

  return (
    <div className="gyms-container">
      <div className="gyms-header">
        <h2>📍 Find BJJ Gyms</h2>
        <p className="gyms-subtitle">Discover academies and training centers near you</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by name, city, or affiliation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-search">Search</button>
        </form>

        {userLocation && (
          <div className="radius-selector">
            <label>Radius:</label>
            <select
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
            >
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
              <option value={250}>250 km</option>
            </select>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="gyms-layout">
        {/* Map placeholder - in real app, integrate with Leaflet/Google Maps */}
        <div className="map-container">
          <div className="map-placeholder">
            <span className="map-icon">🗺️</span>
            <p>Interactive map</p>
            <p className="map-hint">
              {userLocation 
                ? `Showing gyms within ${searchRadius}km of your location`
                : 'Enable location for nearby search'}
            </p>
            {gyms.length > 0 && (
              <div className="map-markers">
                {gyms.slice(0, 10).map((gym, idx) => (
                  <div
                    key={gym.id}
                    className="map-marker"
                    style={{
                      left: `${10 + (idx % 5) * 18}%`,
                      top: `${20 + Math.floor(idx / 5) * 30}%`,
                    }}
                    onClick={() => setSelectedGym(gym)}
                    title={gym.name}
                  >
                    📍
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Gym List */}
        <div className="gyms-list">
          {loading ? (
            <div className="loading">Loading gyms...</div>
          ) : gyms.length === 0 ? (
            <div className="empty-state">No gyms found. Try a different search.</div>
          ) : (
            gyms.map((gym) => (
              <div
                key={gym.id}
                className={`gym-card ${selectedGym?.id === gym.id ? 'selected' : ''}`}
                onClick={() => setSelectedGym(gym)}
              >
                <div className="gym-main">
                  <h3 className="gym-name">{gym.name}</h3>
                  {gym.affiliation && (
                    <span className="gym-affiliation">{gym.affiliation}</span>
                  )}
                  <p className="gym-location">
                    📍 {gym.city}, {gym.country}
                  </p>
                  {gym.address && (
                    <p className="gym-address">{gym.address}</p>
                  )}
                  
                  <div className="gym-tags">
                    {gym.has_gi && <span className="tag gi">Gi</span>}
                    {gym.has_no_gi && <span className="tag nogi">No-Gi</span>}
                    {gym.has_mma && <span className="tag mma">MMA</span>}
                    {gym.trial_class_available && (
                      <span className="tag trial">Free Trial</span>
                    )}
                  </div>

                  {gym.rating && (
                    <div className="gym-rating">
                      ⭐ {gym.rating.toFixed(1)} ({gym.review_count} reviews)
                    </div>
                  )}
                </div>

                <div className="gym-actions">
                  <button
                    className="btn-directions"
                    onClick={(e) => {
                      e.stopPropagation()
                      openInMaps(gym)
                    }}
                  >
                    🧭 Directions
                  </button>
                  {gym.website_url && (
                    <a
                      href={gym.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-website"
                      onClick={(e) => e.stopPropagation()}
                    >
                      🌐 Website
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Gym Detail Modal */}
      {selectedGym && (
        <div className="gym-modal-overlay" onClick={() => setSelectedGym(null)}>
          <div className="gym-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedGym(null)}>✕</button>
            
            <h2>{selectedGym.name}</h2>
            {selectedGym.affiliation && (
              <p className="modal-affiliation">{selectedGym.affiliation}</p>
            )}
            
            <div className="modal-section">
              <h4>📍 Location</h4>
              <p>{selectedGym.address || selectedGym.city}</p>
              <p>{selectedGym.city}, {selectedGym.state && `${selectedGym.state}, `}{selectedGym.country}</p>
            </div>

            {selectedGym.description && (
              <div className="modal-section">
                <h4>About</h4>
                <p>{selectedGym.description}</p>
              </div>
            )}

            {selectedGym.coaches && selectedGym.coaches.length > 0 && (
              <div className="modal-section">
                <h4>🥋 Coaches</h4>
                <ul className="coaches-list">
                  {selectedGym.coaches.map((coach) => (
                    <li key={coach.id} className="coach-item">
                      <span 
                        className="coach-belt"
                        style={{ backgroundColor: getBeltColor(coach.belt_rank) }}
                      />
                      <span className="coach-name">
                        {coach.name}
                        {coach.is_head_coach && ' (Head Coach)'}
                      </span>
                      {coach.specialization && (
                        <span className="coach-spec">{coach.specialization}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="modal-section">
              <h4>Training Options</h4>
              <div className="training-options">
                {selectedGym.has_gi && <span className="option">✅ Gi Classes</span>}
                {selectedGym.has_no_gi && <span className="option">✅ No-Gi Classes</span>}
                {selectedGym.has_mma && <span className="option">✅ MMA Training</span>}
                {selectedGym.trial_class_available && (
                  <span className="option highlight">🎁 Free Trial Available</span>
                )}
              </div>
            </div>

            <div className="modal-section contact">
              {selectedGym.phone && (
                <a href={`tel:${selectedGym.phone}`} className="contact-btn">
                  📞 {selectedGym.phone}
                </a>
              )}
              {selectedGym.email && (
                <a href={`mailto:${selectedGym.email}`} className="contact-btn">
                  ✉️ Email
                </a>
              )}
              {selectedGym.instagram_url && (
                <a
                  href={selectedGym.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn"
                >
                  📷 Instagram
                </a>
              )}
            </div>

            <div className="modal-actions">
              <button
                className="btn-directions-large"
                onClick={() => openInMaps(selectedGym)}
              >
                🧭 Get Directions
              </button>
              {selectedGym.website_url && (
                <a
                  href={selectedGym.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-website-large"
                >
                  🌐 Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
