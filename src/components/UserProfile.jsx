import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { UserProfileService } from '../services/BackendServices'
import './UserProfile.css'

export function UserProfile() {
  const { user, token } = useAuth()
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const userService = UserProfileService()

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await userService.getMyProfile()
      setProfile(data)
      setFormData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      const updated = await userService.updateProfile(formData)
      setProfile(updated)
      setIsEditing(false)
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      setLoading(true)
      const result = await userService.uploadAvatar(file)
      setProfile((prev) => ({
        ...prev,
        profile_picture_url: result.profile_picture_url,
      }))
      setSuccess('Avatar uploaded successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !profile) return <div className="profile-loading">Loading profile...</div>

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar-section">
          <img
            src={profile.profile_picture_url || 'https://via.placeholder.com/150'}
            alt="Avatar"
            className="profile-avatar"
          />
          {isEditing && (
            <label className="avatar-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={loading}
              />
              Change Avatar
            </label>
          )}
        </div>
        <div className="profile-info">
          <h2>{profile.username}</h2>
          <p className="belt-rank">{profile.belt_rank?.toUpperCase()} BELT</p>
          {profile.academy && <p className="academy">{profile.academy}</p>}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-content">
        {!isEditing ? (
          <div className="profile-view">
            <div className="profile-field">
              <label>Full Name</label>
              <p>{profile.full_name || 'Not provided'}</p>
            </div>
            <div className="profile-field">
              <label>Email</label>
              <p>{profile.email}</p>
            </div>
            <div className="profile-field">
              <label>Bio</label>
              <p>{profile.bio || 'No bio yet'}</p>
            </div>
            <div className="profile-field">
              <label>Location</label>
              <p>{profile.location || 'Not provided'}</p>
            </div>
            <div className="profile-field">
              <label>Weight Class</label>
              <p>{profile.weight_class || 'Not provided'}</p>
            </div>
            {profile.instagram_url && (
              <div className="profile-field">
                <label>Instagram</label>
                <a href={profile.instagram_url} target="_blank" rel="noreferrer">
                  {profile.instagram_url}
                </a>
              </div>
            )}
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="profile-edit">
            <div className="form-section">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            <div className="form-section">
              <label>Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            <div className="form-section">
              <label>Email</label>
              <input type="email" value={formData.email} disabled />
            </div>
            <div className="form-section">
              <label>Belt Rank</label>
              <select
                name="belt_rank"
                value={formData.belt_rank || ''}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="white">White</option>
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
                <option value="brown">Brown</option>
                <option value="black">Black</option>
              </select>
            </div>
            <div className="form-section">
              <label>Academy</label>
              <input
                type="text"
                name="academy"
                value={formData.academy || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            <div className="form-section">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleInputChange}
                disabled={loading}
                rows="4"
              />
            </div>
            <div className="form-section">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            <div className="form-section">
              <label>Weight Class</label>
              <input
                type="text"
                name="weight_class"
                value={formData.weight_class || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            <div className="form-section">
              <label>Instagram URL</label>
              <input
                type="url"
                name="instagram_url"
                value={formData.instagram_url || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            <div className="button-group">
              <button className="btn-save" onClick={handleSaveProfile} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                className="btn-cancel"
                onClick={() => {
                  setIsEditing(false)
                  setFormData(profile)
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile
