import { useState, useEffect } from 'react'
import { TournamentService } from '../services/BackendServices'

const SEMINARS = [
  { name: 'Gordon Ryan: No-Gi Systems', location: 'Austin, TX', dates: 'May 15-16, 2025', price: '$250', spots: 'Limited Spots', spotColor: 'text-secondary' },
  { name: 'Lachlan Giles: K-Guard', location: 'Melbourne, AU', dates: 'Jun 04, 2025', price: '$180', spots: 'Early Bird', spotColor: 'text-slate-400' },
]

const OPEN_MATS = [
  { gym: 'Renzo Gracie Austin', time: 'Sat 10amâ€“12pm', spots: 4, spotsLeft: 2 },
  { gym: 'Checkmat San Diego', time: 'Sun 9amâ€“11am', spots: 8, spotsLeft: 5 },
]

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      alert('Successfully registered!')
      setSelectedTournament(null)
      setRegistrationData({ weight_class: '', division: 'Adult', is_gi: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setRegistering(false)
    }
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div className="h-full bg-surface overflow-y-auto hide-scrollbar">
      <div className="max-w-360 mx-auto px-8 lg:px-14 py-14">
        <div className="grid grid-cols-12 gap-10 lg:gap-14">

          {/* Left Column */}
          <div className="col-span-12 lg:col-span-7 space-y-14">

            {/* Upcoming Tournaments */}
            <section>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-secondary font-black text-xs uppercase tracking-[0.3em] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Live Registry</p>
                  <h2 className="text-3xl lg:text-4xl font-black text-primary tracking-tight uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Upcoming Tournaments</h2>
                </div>
                <div className="flex gap-2 pb-1">
                  {['upcoming', 'ongoing', 'completed'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilterStatus(f)}
                      className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors rounded-sm ${filterStatus === f ? 'bg-primary text-white' : 'bg-white text-slate-500 border border-gray-200 hover:bg-gray-50'}`}
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-sm mb-6">{error}</div>}

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[0, 1].map(i => (
                    <div key={i} className="bg-white rounded-sm shadow-sm animate-pulse">
                      <div className="h-44 bg-gray-200" />
                      <div className="p-6 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                        <div className="h-10 bg-gray-200 rounded mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : tournaments.length === 0 ? (
                <div className="bg-white rounded-sm p-12 text-center border border-dashed border-gray-200">
                  <span className="material-symbols-outlined text-4xl text-slate-300 block mb-3">event_busy</span>
                  <p className="text-slate-400 font-bold uppercase text-sm">No tournaments found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tournaments.map((t) => {
                    const isMajor = t.organizer?.toLowerCase().includes('ibjjf') || t.name?.toLowerCase().includes('championship')
                    return (
                      <div key={t.id} className="bg-white border-l-4 border-primary shadow-md overflow-hidden group flex flex-col">
                        <div className="h-44 bg-linear-to-br from-primary to-primary-container relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white/10 text-[100px]">emoji_events</span>
                          </div>
                          <div className="absolute top-3 right-3 text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest" style={{ backgroundColor: isMajor ? '#002046' : '#b6191a' }}>
                            {isMajor ? 'Major' : 'Qualifiers'}
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-black text-primary leading-tight uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{t.name}</h3>
                            <span className="text-secondary font-black text-sm ml-2 shrink-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{formatDate(t.event_date)}</span>
                          </div>
                          {t.organizer && <p className="text-xs text-slate-400 font-bold uppercase mb-2">{t.organizer}</p>}
                          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-6 mt-auto">
                            <span className="material-symbols-outlined text-base">location_on</span>
                            <span>{t.location}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              className="flex-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest py-3 hover:bg-primary/90 transition-all"
                              onClick={() => setSelectedTournament(t)}
                            >
                              Register Now
                            </button>
                            <button className="p-2.5 border border-slate-200 text-primary hover:bg-slate-50 transition-colors">
                              <span className="material-symbols-outlined text-base">share</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Technical Seminars */}
            <section>
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-black text-primary tracking-tight uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Technical Seminars</h2>
                <div className="flex gap-2">
                  <button className="p-2 bg-white rounded-sm shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                  </button>
                  <button className="p-2 bg-white rounded-sm shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {SEMINARS.map((s) => (
                  <div key={s.name} className="flex flex-col md:flex-row items-center gap-5 bg-white p-4 shadow-md border border-slate-50 hover:shadow-lg transition-all group">
                    <div className="w-16 h-16 rounded-sm bg-linear-to-br from-primary to-primary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-white/40 text-xl">person</span>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.name}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{s.location} â€¢ {s.dates}</p>
                    </div>
                    <div className="text-center md:text-right px-6 md:border-r border-slate-100">
                      <p className="text-xl font-black text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.price}</p>
                      <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${s.spotColor}`}>{s.spots}</p>
                    </div>
                    <button className="w-full md:w-auto bg-gray-100 text-primary px-8 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                      Join Class
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-5 space-y-8">

            {/* Mat Finder */}
            <div className="bg-white border border-slate-100 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-50">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-black text-primary uppercase tracking-widest text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Mat Finder</h3>
                  <div className="flex items-center gap-2 text-[9px] text-secondary font-black animate-pulse">
                    <span className="w-2 h-2 bg-secondary rounded-full" />
                    Live Feed
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Find verified training worldwide</p>
              </div>
              {/* Map placeholder */}
              <div className="aspect-21/9 bg-linear-to-br from-primary to-primary-container relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white/10 text-[120px]">map</span>
                </div>
                <div className="absolute top-1/3 left-1/3">
                  <div className="w-7 h-7 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-secondary/20">
                    <span className="material-symbols-outlined text-xs">sports_martial_arts</span>
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 flex flex-col gap-1">
                  <button className="bg-white p-1.5 shadow border border-slate-100"><span className="material-symbols-outlined text-[10px]">add</span></button>
                  <button className="bg-white p-1.5 shadow border border-slate-100"><span className="material-symbols-outlined text-[10px]">remove</span></button>
                </div>
              </div>
              {/* Gym Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h4 className="text-lg font-black text-primary uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Renzo Gracie Austin</h4>
                    <p className="text-[11px] font-medium text-slate-500">701 Tillery St Suite A-11, Austin, TX 78702</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="bg-secondary text-white text-[9px] font-black px-2.5 py-1 uppercase tracking-widest">Verified Mat</span>
                    <span className="bg-primary text-white text-[9px] font-black px-2.5 py-1 uppercase tracking-widest">$30 Drop-In</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { icon: 'call', text: '(512) 522-8232' },
                    { icon: 'language', text: 'renzogracieaustin.com' },
                    { icon: 'share', text: '@renzogracieaustin' },
                    { icon: 'stars', text: '4.9 Rating (240+)' },
                  ].map(({ icon, text }) => (
                    <div key={icon} className="flex items-center gap-2 text-[10px] font-bold text-primary">
                      <span className="material-symbols-outlined text-secondary text-base">{icon}</span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Elite Open Mat Feed */}
                <div className="p-4 bg-secondary/5 border-l-4 border-secondary">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-black text-secondary uppercase tracking-widest text-xs" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Elite Open Mat Feed</h5>
                    <span className="text-[9px] text-secondary font-black animate-pulse">â— Live</span>
                  </div>
                  <div className="space-y-3">
                    {OPEN_MATS.map(({ gym, time, spots, spotsLeft }) => (
                      <div key={gym} className="flex items-center justify-between bg-white p-3 rounded-sm shadow-sm">
                        <div>
                          <p className="text-xs font-black text-primary uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{gym}</p>
                          <p className="text-[10px] text-slate-500">{time}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{spotsLeft}/{spots}</p>
                          <p className="text-[9px] text-slate-400 uppercase font-bold">spots left</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6">
                <button className="w-full bg-primary text-white py-4 font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <span className="material-symbols-outlined">add_location</span>
                  Host Event
                </button>
              </div>
            </div>

            {/* Travel & Training Passport */}
            <div className="bg-primary p-8 rounded-sm relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10">
                <span className="material-symbols-outlined text-[180px]">flight</span>
              </div>
              <div className="relative z-10">
                <p className="text-secondary font-black text-xs uppercase tracking-[0.2em] mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Global Passport</p>
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Travel & Training</h4>
                <p className="text-white/50 text-xs mb-6">Connect with academies worldwide. Access verified drop-in sessions and elite open mats anywhere.</p>
                <button className="bg-white text-primary px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Explore Global Maps
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {selectedTournament && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedTournament(null)}>
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-gray-100 flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">Registration</p>
                <h3 className="text-xl font-black text-primary uppercase tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{selectedTournament.name}</h3>
              </div>
              <button onClick={() => setSelectedTournament(null)} className="text-slate-400 hover:text-primary transition-colors ml-4">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8 space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Weight Class</label>
                <input
                  type="text"
                  placeholder="e.g. Light (-76kg)"
                  value={registrationData.weight_class}
                  onChange={(e) => setRegistrationData((p) => ({ ...p, weight_class: e.target.value }))}
                  className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Division</label>
                <select
                  value={registrationData.division}
                  onChange={(e) => setRegistrationData((p) => ({ ...p, division: e.target.value }))}
                  className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                >
                  {['Adult', 'Master 1', 'Master 2', 'Master 3', 'Juvenile'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Format</label>
                <select
                  value={registrationData.is_gi ? 'gi' : 'no-gi'}
                  onChange={(e) => setRegistrationData((p) => ({ ...p, is_gi: e.target.value === 'gi' }))}
                  className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                >
                  {selectedTournament.is_gi && <option value="gi">Gi</option>}
                  {selectedTournament.is_no_gi && <option value="no-gi">No-Gi</option>}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="flex-1 bg-primary text-white py-4 font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {registering ? 'Registering...' : 'Confirm Registration'}
                </button>
                <button onClick={() => setSelectedTournament(null)} className="px-5 border border-gray-200 text-slate-500 hover:bg-gray-50 transition-colors">
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
