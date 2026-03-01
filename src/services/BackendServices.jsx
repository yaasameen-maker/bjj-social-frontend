import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function UserProfileService() {
  const { token } = useAuth()

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  return {
    // Get current user profile
    async getMyProfile() {
      const res = await fetch(`${API_BASE_URL}/api/users/me`, { headers })
      if (!res.ok) throw new Error('Failed to fetch profile')
      return res.json()
    },

    // Update user profile
    async updateProfile(data) {
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update profile')
      return res.json()
    },

    // Upload avatar
    async uploadAvatar(file) {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`${API_BASE_URL}/api/users/me/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!res.ok) throw new Error('Failed to upload avatar')
      return res.json()
    },

    // Change password
    async changePassword(currentPassword, newPassword) {
      const res = await fetch(`${API_BASE_URL}/api/users/me/password`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      })
      if (!res.ok) throw new Error('Failed to change password')
      return res.json()
    },

    // Delete account
    async deleteAccount() {
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'DELETE',
        headers,
      })
      if (!res.ok) throw new Error('Failed to delete account')
      return res.json()
    },
  }
}

export function TournamentService() {
  const { token } = useAuth()

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  return {
    // List tournaments
    async listTournaments(status = null, country = null, isGi = null) {
      let url = `${API_BASE_URL}/api/tournaments?limit=50`
      if (status) url += `&status=${status}`
      if (country) url += `&country=${country}`
      if (isGi !== null) url += `&is_gi=${isGi}`

      const res = await fetch(url, { headers })
      if (!res.ok) throw new Error('Failed to fetch tournaments')
      return res.json()
    },

    // Get upcoming tournaments
    async getUpcoming(limit = 20) {
      const res = await fetch(`${API_BASE_URL}/api/tournaments/upcoming?limit=${limit}`, {
        headers,
      })
      if (!res.ok) throw new Error('Failed to fetch upcoming tournaments')
      return res.json()
    },

    // Get tournament details
    async getTournament(tournamentId) {
      const res = await fetch(`${API_BASE_URL}/api/tournaments/${tournamentId}`, {
        headers,
      })
      if (!res.ok) throw new Error('Failed to fetch tournament')
      return res.json()
    },

    // Register for tournament
    async registerForTournament(tournamentId, weightClass, division, isGi = true) {
      const res = await fetch(
        `${API_BASE_URL}/api/tournaments/${tournamentId}/register`,
        {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            weight_class: weightClass,
            division,
            is_gi: isGi,
          }),
        }
      )
      if (!res.ok) throw new Error('Failed to register for tournament')
      return res.json()
    },
  }
}

export function CalendarService() {
  const { token } = useAuth()

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  return {
    // Get calendar events
    async getEvents(eventType = null, fromDate = null, toDate = null) {
      let url = `${API_BASE_URL}/api/calendar`
      const params = []
      if (eventType) params.push(`event_type=${eventType}`)
      if (fromDate) params.push(`from_date=${fromDate}`)
      if (toDate) params.push(`to_date=${toDate}`)
      if (params.length > 0) url += `?${params.join('&')}`

      const res = await fetch(url, { headers })
      if (!res.ok) throw new Error('Failed to fetch calendar events')
      return res.json()
    },

    // Create calendar event
    async createEvent(eventData) {
      const res = await fetch(`${API_BASE_URL}/api/calendar`, {
        method: 'POST',
        headers,
        body: JSON.stringify(eventData),
      })
      if (!res.ok) throw new Error('Failed to create event')
      return res.json()
    },

    // Update calendar event
    async updateEvent(eventId, eventData) {
      const res = await fetch(`${API_BASE_URL}/api/calendar/${eventId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(eventData),
      })
      if (!res.ok) throw new Error('Failed to update event')
      return res.json()
    },

    // Delete calendar event
    async deleteEvent(eventId) {
      const res = await fetch(`${API_BASE_URL}/api/calendar/${eventId}`, {
        method: 'DELETE',
        headers,
      })
      if (!res.ok) throw new Error('Failed to delete event')
      return res.json()
    },
  }
}

export function GymService() {
  const { token } = useAuth()

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  return {
    // List gyms with filters
    async listGyms(city = null, country = null, hasGi = null, skip = 0, limit = 50) {
      let url = `${API_BASE_URL}/api/gyms?skip=${skip}&limit=${limit}`
      if (city) url += `&city=${city}`
      if (country) url += `&country=${country}`
      if (hasGi !== null) url += `&has_gi=${hasGi}`

      const res = await fetch(url, { headers })
      if (!res.ok) throw new Error('Failed to fetch gyms')
      return res.json()
    },

    // Search gyms nearby (by coordinates)
    async searchNearby(latitude, longitude, radiusKm = 50) {
      const res = await fetch(
        `${API_BASE_URL}/api/gyms/nearby?lat=${latitude}&lng=${longitude}&radius=${radiusKm}`,
        { headers }
      )
      if (!res.ok) throw new Error('Failed to search nearby gyms')
      return res.json()
    },

    // Get gym details
    async getGym(gymId) {
      const res = await fetch(`${API_BASE_URL}/api/gyms/${gymId}`, { headers })
      if (!res.ok) throw new Error('Failed to fetch gym')
      return res.json()
    },
  }
}

export function CoachService() {
  const { token } = useAuth()

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  return {
    // Ask AI coach a question
    async askCoach(question, videoId = null, position = null, beltRank = null) {
      const res = await fetch(`${API_BASE_URL}/api/coach/ask`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          question,
          video_id: videoId,
          position,
          belt_rank: beltRank,
        }),
      })
      if (!res.ok) throw new Error('Failed to get coach response')
      return res.json()
    },
  }
}

export function SeminarService() {
  return {
    // Get upcoming seminars (public endpoint)
    async getUpcoming(limit = 20) {
      const res = await fetch(`${API_BASE_URL}/api/seminars/upcoming?limit=${limit}`)
      if (!res.ok) throw new Error('Failed to fetch upcoming seminars')
      return res.json()
    },

    // List all seminars with filters
    async listSeminars(status = null, country = null, isGi = null, skip = 0, limit = 50) {
      let url = `${API_BASE_URL}/api/seminars?skip=${skip}&limit=${limit}`
      if (status) url += `&status=${status}`
      if (country) url += `&country=${country}`
      if (isGi !== null) url += `&is_gi=${isGi}`

      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch seminars')
      return res.json()
    },

    // Get seminar details
    async getSeminar(seminarId) {
      const res = await fetch(`${API_BASE_URL}/api/seminars/${seminarId}`)
      if (!res.ok) throw new Error('Failed to fetch seminar')
      return res.json()
    },
  }
}

// Export all services as a single hook
export function useBackendServices() {
  return {
    userProfile: UserProfileService(),
    tournaments: TournamentService(),
    calendar: CalendarService(),
    gyms: GymService(),
    coach: CoachService(),
    seminars: SeminarService(),
  }
}
