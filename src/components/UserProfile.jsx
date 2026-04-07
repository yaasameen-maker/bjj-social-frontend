import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { UserProfileService } from '../services/BackendServices'

const BELT_COLORS = {
  white: { bg: 'bg-white border border-gray-300', text: 'text-gray-800' },
  blue: { bg: 'bg-blue-600', text: 'text-white' },
  purple: { bg: 'bg-purple-600', text: 'text-white' },
  brown: { bg: 'bg-amber-800', text: 'text-white' },
  black: { bg: 'bg-black', text: 'text-white' },
}

function EditModal({ profile, formData, onChange, onSave, onCancel, onAvatarUpload, loading }) {
  return (
    <div className="fixed inset-0 z-200 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-black text-xl uppercase tracking-tighter" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Edit Profile
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-black">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-sm overflow-hidden bg-gray-100 shrink-0">
              {profile?.profile_picture_url
                ? <img src={profile.profile_picture_url} alt="Avatar" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-3xl text-gray-300">person</span></div>
              }
            </div>
            <label className="cursor-pointer bg-primary hover:bg-primary-container text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-sm transition-all" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Change Avatar
              <input type="file" accept="image/*" className="hidden" onChange={onAvatarUpload} disabled={loading} />
            </label>
          </div>
          {[
            { label: 'Full Name', name: 'full_name', type: 'text' },
            { label: 'Username', name: 'username', type: 'text' },
            { label: 'Academy', name: 'academy', type: 'text' },
            { label: 'Location', name: 'location', type: 'text' },
            { label: 'Weight Class', name: 'weight_class', type: 'text' },
            { label: 'Instagram URL', name: 'instagram_url', type: 'url' },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name] || ''}
                onChange={onChange}
                disabled={loading}
                className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Belt Rank</label>
            <select
              name="belt_rank"
              value={formData.belt_rank || ''}
              onChange={onChange}
              disabled={loading}
              className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
            >
              {['white','blue','purple','brown','black'].map(b => (
                <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={onChange}
              disabled={loading}
              rows={3}
              className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white">
          <button
            onClick={onSave}
            disabled={loading}
            className="flex-1 bg-secondary hover:bg-secondary-container text-white font-black text-xs uppercase tracking-widest py-3 rounded-sm transition-all disabled:opacity-50"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={onCancel}
            className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs uppercase tracking-widest py-3 rounded-sm transition-all"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export function UserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [postText, setPostText] = useState('')
  const [feedTab, setFeedTab] = useState('feed')

  const userService = UserProfileService()

  useEffect(() => {
    if (user) fetchProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      const updated = await userService.updateProfile(formData)
      setProfile(updated)
      setIsEditing(false)
      setSuccess('Profile updated!')
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
      setProfile(prev => ({ ...prev, profile_picture_url: result.profile_picture_url }))
      setSuccess('Avatar updated!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const beltStyle = BELT_COLORS[profile?.belt_rank] || BELT_COLORS.white

  if (!profile && loading) {
    return (
      <div className="h-full flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">autorenew</span>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Loading Profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-surface overflow-y-auto hide-scrollbar flex">
      {/* Main Center Column */}
      <div className="flex-1 min-w-0">
        {/* Profile Header Banner */}
        <div className="relative h-56 bg-linear-to-br from-primary to-tertiary overflow-hidden">
          {/* Abstract BJJ silhouette background */}
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20rem] text-white">person</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-8 flex items-end gap-5">
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-sm border-4 border-white overflow-hidden bg-primary-container">
                {profile?.profile_picture_url
                  ? <img src={profile.profile_picture_url} alt="Avatar" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-5xl text-white/40">person</span></div>
                }
              </div>
              <div className={`absolute -bottom-2 left-0 right-0 mx-auto w-fit ${beltStyle.bg} ${beltStyle.text} text-[9px] font-black uppercase px-2 py-0.5 text-center`}>
                {profile?.belt_rank || 'White'} Belt
              </div>
            </div>
            <div className="pb-3">
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {profile?.full_name || profile?.username || user?.username}
              </h1>
              <p className="text-white/70 text-sm italic">{profile?.bio || 'On the mat every day...'}</p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex flex-wrap lg:flex-nowrap justify-between items-center gap-4 shadow-sm">
          <div className="flex gap-8">
            {[
              { count: '1.2k', label: 'Friends' },
              { count: '8.4k', label: 'Followers' },
              { count: '452', label: 'Following' },
            ].map(({ count, label }) => (
              <div key={label} className="text-center">
                <p className="text-xl font-black text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{count}</p>
                <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">{label}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-sm hover:bg-primary-container transition-colors"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setFeedTab(feedTab === 'feed' ? 'profile' : 'feed')}
              className="px-4 py-2 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-sm hover:bg-primary-container transition-colors"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {feedTab === 'feed' ? 'Profile Info' : 'Feed'}
            </button>
            <button className="p-2 border border-gray-200 rounded-sm hover:bg-gray-50">
              <span className="material-symbols-outlined text-primary">more_horiz</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-8 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-sm">{error}</div>
        )}
        {success && (
          <div className="mx-8 mt-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm font-bold rounded-sm">{success}</div>
        )}

        <div className="max-w-3xl mx-auto px-8 py-8 space-y-6">
          {feedTab === 'feed' ? (
            <>
              {/* Create Post */}
              <div className="bg-white shadow-sm p-6 space-y-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-sm bg-primary-container overflow-hidden shrink-0 flex items-center justify-center">
                    {profile?.profile_picture_url
                      ? <img src={profile.profile_picture_url} alt="" className="w-full h-full object-cover" />
                      : <span className="material-symbols-outlined text-white/50">person</span>
                    }
                  </div>
                  <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    className="flex-1 bg-gray-50 border-none focus:outline-none focus:ring-1 focus:ring-primary rounded-sm p-4 text-sm resize-none h-20 placeholder:text-gray-400"
                    placeholder="Share your technique or mat journey..."
                  />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="flex gap-4">
                    {[
                      { icon: 'image', label: 'Photo' },
                      { icon: 'videocam', label: 'Video' },
                      { icon: 'link', label: 'Link' },
                    ].map(({ icon, label }) => (
                      <button key={label} className="flex items-center gap-1.5 text-gray-400 hover:text-primary text-xs font-bold uppercase transition-colors">
                        <span className="material-symbols-outlined text-lg">{icon}</span>
                        {label}
                      </button>
                    ))}
                  </div>
                  <button className="bg-secondary hover:bg-secondary-container text-white font-black text-xs uppercase tracking-widest px-6 py-2 rounded-sm transition-all" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Post
                  </button>
                </div>
              </div>

              {/* Sample Post */}
              <div className="bg-white shadow-sm p-8 relative">
                <div className="absolute top-4 right-4 text-secondary">
                  <span className="material-symbols-outlined text-lg">push_pin</span>
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="w-12 h-12 rounded-sm bg-primary-container overflow-hidden shrink-0 flex items-center justify-center">
                    {profile?.profile_picture_url
                      ? <img src={profile.profile_picture_url} alt="" className="w-full h-full object-cover" />
                      : <span className="material-symbols-outlined text-white/50">person</span>
                    }
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-primary text-sm uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {profile?.full_name || profile?.username}
                      </h4>
                      <span className="bg-primary text-white text-[8px] font-black px-1.5 py-0.5 uppercase rounded-sm">Official</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">2 hours ago • Submission analysis</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                  Finally mastered the modified bow and arrow choke during today's advanced class at the Academy. The key is in the hip positioning—if you don't clear the shoulder, the leverage is lost. Thoughts?
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex gap-6">
                    {[
                      { icon: 'favorite_border', count: '1.2k' },
                      { icon: 'chat_bubble_outline', count: '48' },
                      { icon: 'share', count: '12' },
                    ].map(({ icon, count }) => (
                      <button key={icon} className="flex items-center gap-1.5 text-gray-400 hover:text-secondary text-xs font-bold transition-colors">
                        <span className="material-symbols-outlined text-lg">{icon}</span>
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Profile Info View */
            <div className="bg-white shadow-sm p-8 space-y-6">
              <h3 className="font-black text-lg text-primary uppercase tracking-tighter border-b border-gray-100 pb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Profile Information
              </h3>
              {[
                { label: 'Full Name', value: profile?.full_name },
                { label: 'Username', value: profile?.username },
                { label: 'Email', value: profile?.email },
                { label: 'Academy', value: profile?.academy },
                { label: 'Location', value: profile?.location },
                { label: 'Weight Class', value: profile?.weight_class },
                { label: 'Belt Rank', value: profile?.belt_rank },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start">
                  <dt className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-1/3">{label}</dt>
                  <dd className="text-sm font-bold text-gray-700 flex-1">{value || <span className="text-gray-300 italic">Not provided</span>}</dd>
                </div>
              ))}
              {profile?.instagram_url && (
                <div className="flex justify-between items-start">
                  <dt className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-1/3">Instagram</dt>
                  <dd className="text-sm font-bold text-secondary flex-1">
                    <a href={profile.instagram_url} target="_blank" rel="noreferrer">{profile.instagram_url}</a>
                  </dd>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="w-80 border-l border-gray-100 bg-white p-6 sticky top-0 h-[calc(100vh-64px)] overflow-y-auto hide-scrollbar hidden xl:block space-y-8 shrink-0">
        {/* Fighter Friends */}
        <div>
          <h3 className="font-black text-primary uppercase tracking-tighter text-base mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Fighter Friends</h3>
          <div className="space-y-4">
            {[
              { name: 'Andre Leoni', belt: 'Black Belt', online: true },
              { name: 'Sarah Kim', belt: 'Blue Belt', online: true },
              { name: 'Coach Marcus', belt: 'Brown Belt', online: false },
            ].map(({ name, belt, online }) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-sm bg-primary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-white/50 text-lg">person</span>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${online ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-primary uppercase">{name}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">{belt}</p>
                  </div>
                </div>
                <button className="text-gray-300 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">chat_bubble</span>
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-[10px] font-black uppercase text-secondary tracking-widest text-center py-2 hover:bg-red-50 transition-colors rounded-sm">
            View All Friends
          </button>
        </div>

        {/* Quick Chat */}
        <div className="bg-gray-50 rounded-sm p-4 flex flex-col" style={{ height: '320px' }}>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <h3 className="font-black text-primary uppercase tracking-tight text-xs" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Quick Chat</h3>
            </div>
            <span className="material-symbols-outlined text-primary text-sm cursor-pointer">settings</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 hide-scrollbar">
            <div className="flex flex-col items-end">
              <div className="bg-primary text-white p-2 rounded-sm text-[11px] max-w-[80%]">Hey Andre, you coming to the 6 PM roll?</div>
              <span className="text-[9px] text-gray-400 mt-1 uppercase font-bold">4:12 PM</span>
            </div>
            <div className="flex flex-col items-start">
              <div className="bg-white border border-gray-200 p-2 rounded-sm text-[11px] max-w-[80%] text-gray-700">Yeah man, bringing the new A2 gi.</div>
              <span className="text-[9px] text-gray-400 mt-1 uppercase font-bold">4:15 PM</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="relative">
              <input className="w-full bg-white border border-gray-200 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-primary" placeholder="Type message..." type="text" />
              <span className="material-symbols-outlined absolute right-2 top-2 text-primary text-sm cursor-pointer">send</span>
            </div>
          </div>
        </div>

        {/* Technique Streak */}
        <div className="bg-primary-container p-6 rounded-sm text-white">
          <h4 className="font-black uppercase tracking-tighter text-base mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Technique Streak</h4>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-secondary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>14</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 leading-tight">Days of continuous progress</p>
              <div className="w-full bg-primary h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-secondary h-full w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Edit Modal */}
      {isEditing && (
        <EditModal
          profile={profile}
          formData={formData}
          onChange={handleInputChange}
          onSave={handleSaveProfile}
          onCancel={() => { setIsEditing(false); setFormData(profile) }}
          onAvatarUpload={handleAvatarUpload}
          loading={loading}
        />
      )}
    </div>
  )
}

export default UserProfile
