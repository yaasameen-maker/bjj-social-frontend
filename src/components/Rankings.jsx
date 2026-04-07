import { useState } from 'react'

const LEADERBOARD = [
  { rank: '01', name: 'Gordon Ryan', team: 'New Wave Jiu-Jitsu', belt: 'Black Belt', points: '14,250', winRate: '98.2%', featured: true },
  { rank: '02', name: 'Mica Galvao', team: 'Melqui Galvão', belt: 'Black Belt', points: '12,890' },
  { rank: '03', name: 'Nicholas Meregali', team: 'New Wave', belt: 'Black Belt', points: '12,110' },
  { rank: '04', name: 'Tainan Dalpra', team: 'Art of Jiu-Jitsu', belt: 'Black Belt', points: '11,420', division: 'Middleweight' },
  { rank: '05', name: 'Victor Hugo', team: 'Six Blades BJJ', belt: 'Black Belt', points: '10,950', division: 'Ultra Heavy' },
  { rank: '06', name: 'Kaynan Duarte', team: 'Atos BJJ', belt: 'Black Belt', points: '10,700', division: 'Super Heavy' },
  { rank: '07', name: 'Pedro Marinho', team: 'Checkmat', belt: 'Black Belt', points: '10,450', division: 'Heavyweight' },
  { rank: '08', name: 'Roberto Jimenez', team: '10th Planet', belt: 'Black Belt', points: '10,200', division: 'Welterweight' },
]

const FILTERS = ['All', 'IBJJF GI', 'IBJJF NO-GI', 'ADCC', 'SmoothComp']

function MyRankings() {
  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-primary uppercase tracking-tighter" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>My Rankings</h1>
        <p className="text-gray-400 font-bold uppercase text-[11px] tracking-widest mt-1">Official performance metrics across global organizations</p>
      </div>

      <div className="space-y-6">
        {/* ADCC Featured Card */}
        <div className="bg-navy-dark text-white p-8 rounded-sm border-l-8 border-secondary relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[200px]">military_tech</span>
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="bg-secondary text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm">Elite Standard</span>
                  <h2 className="text-2xl font-black tracking-tighter uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>ADCC World Federation</h2>
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Global No-Gi Submission Fighting Ranking</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Public Profile</span>
                <div className="w-10 h-5 bg-secondary rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Current Rank', value: '#42', sub: 'Top 5% Globally', subColor: 'text-secondary' },
                { label: 'Ranking Points', value: '2,840', sub: '+150 this month', subColor: 'text-green-400', icon: 'trending_up' },
                { label: 'Division', value: 'Professional', sub: '-77kg Class', subColor: 'text-slate-400' },
              ].map(({ label, value, sub, subColor, icon }) => (
                <div key={label} className="bg-white/5 p-6 rounded-sm border border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
                  <p className="text-3xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{value}</p>
                  <div className={`flex items-center gap-1 ${subColor} mt-2`}>
                    {icon && <span className="material-symbols-outlined text-sm">{icon}</span>}
                    <span className="text-[10px] font-bold uppercase">{sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grid of Federation Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* IBJJF */}
          <div className="bg-white p-8 rounded-sm shadow-sm border-t-4 border-primary">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black text-primary tracking-tighter uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>IBJJF</h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">International BJJ Federation</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Public</span>
                <div className="w-8 h-4 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: 'checkroom', label: 'Gi Ranking', division: 'Purple / Master 1', rank: '#114', pts: '1,250 pts' },
                { icon: 'dry_cleaning', label: 'No-Gi Ranking', division: 'Purple / Adult', rank: '#82', pts: '940 pts' },
              ].map(({ icon, label, division, rank, pts }) => (
                <div key={label} className="flex items-center justify-between p-4 bg-gray-50 rounded-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-sm">
                      <span className="material-symbols-outlined text-lg">{icon}</span>
                    </div>
                    <div>
                      <p className="font-black text-primary uppercase text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{label}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">{division}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{rank}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{pts}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SmoothComp */}
          <div className="bg-white p-8 rounded-sm shadow-sm border-t-4 border-slate-400">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black text-primary tracking-tighter uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>SmoothComp</h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Global Competition Ecosystem</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Public</span>
                <div className="w-8 h-4 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Global Rank', value: '#1,402' },
                { label: 'Total Wins', value: '124' },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 border border-gray-200 rounded-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{label}</p>
                  <p className="text-2xl font-black text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{value}</p>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 rounded-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase">Accumulated Points</p>
                <p className="text-xl font-black text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>42,500</p>
              </div>
              <span className="material-symbols-outlined text-primary text-3xl opacity-20">analytics</span>
            </div>
          </div>

          {/* TAP Tournament */}
          <div className="bg-white p-8 rounded-sm shadow-sm border-t-4 border-secondary/40">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black text-primary tracking-tighter uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>TAP Tournament</h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Regional Circuit Ranking</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Private</span>
                <div className="w-8 h-4 bg-gray-300 rounded-full relative cursor-pointer">
                  <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-4xl font-black text-secondary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>#7</span>
              <div>
                <p className="text-xs font-bold uppercase text-primary">Regional Leader</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Southwest Division</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GlobalRankings() {
  const [activeFilter, setActiveFilter] = useState('All')
  const rest = LEADERBOARD.slice(3)

  return (
    <div className="max-w-7xl mx-auto py-10 px-8 lg:px-12">
      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h1 className="font-black text-6xl lg:text-8xl text-primary tracking-tighter uppercase leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Global<br /><span className="text-secondary">Rankings</span>
          </h1>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors ${
                  activeFilter === f
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-primary hover:bg-gray-200'
                }`}
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Top 3 Podium */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
        {/* Rank 1 */}
        <div className="lg:col-span-6 bg-primary p-8 rounded-sm relative overflow-hidden group min-h-70">
          <div className="absolute inset-0 bg-linear-to-r from-primary via-primary to-transparent z-10" />
          <div className="relative z-20 flex flex-col h-full justify-between">
            <div>
              <span className="text-secondary font-black text-8xl leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>01</span>
              <div className="mt-3">
                <h3 className="text-white font-black text-3xl uppercase tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Gordon Ryan</h3>
                <p className="text-white/60 text-xs uppercase tracking-[0.2em] mt-1">New Wave Jiu-Jitsu • Black Belt</p>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Points</p>
                  <p className="text-white font-black text-2xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>14,250</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Win Rate</p>
                  <p className="text-white font-black text-2xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>98.2%</p>
                </div>
              </div>
              <button className="bg-secondary text-white p-3 rounded-sm hover:scale-105 transition-transform">
                <span className="material-symbols-outlined">arrow_outward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Rank 2 */}
        <div className="lg:col-span-3 bg-white p-6 rounded-sm border-l-4 border-secondary flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-primary/20 font-black text-5xl leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>02</span>
            <h4 className="text-primary font-black text-xl uppercase tracking-tight mt-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Mica Galvao</h4>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Melqui Galvão • Black Belt</p>
          </div>
          <div className="mt-6">
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Points</p>
            <p className="text-primary font-black text-3xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>12,890</p>
          </div>
        </div>

        {/* Rank 3 */}
        <div className="lg:col-span-3 bg-white p-6 rounded-sm border-l-4 border-slate-300 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-primary/20 font-black text-5xl leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>03</span>
            <h4 className="text-primary font-black text-xl uppercase tracking-tight mt-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Nicholas Meregali</h4>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">New Wave • Black Belt</p>
          </div>
          <div className="mt-6">
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Points</p>
            <p className="text-primary font-black text-3xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>12,110</p>
          </div>
        </div>
      </section>

      {/* Leaderboard Table */}
      <section className="bg-white rounded-sm overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-gray-100 bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-5">Athlete</div>
          <div className="col-span-2">Belt</div>
          <div className="col-span-2">Team</div>
          <div className="col-span-2 text-right">Points</div>
        </div>
        <div className="divide-y divide-gray-50">
          {rest.map((a) => (
            <div key={a.rank} className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-gray-50/50 transition-colors group cursor-pointer">
              <div className="col-span-1 text-center font-black text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{a.rank}</div>
              <div className="col-span-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-container rounded-sm overflow-hidden shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white/40 text-lg">person</span>
                </div>
                <div>
                  <p className="font-bold text-primary group-hover:text-secondary transition-colors">{a.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">{a.division || a.team}</p>
                </div>
              </div>
              <div className="col-span-2">
                <span className="px-2 py-0.5 bg-primary text-white text-[9px] font-bold uppercase tracking-tighter">{a.belt}</span>
              </div>
              <div className="col-span-2 text-sm text-slate-600 font-medium">{a.team}</div>
              <div className="col-span-2 text-right font-black text-primary text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{a.points}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default function Rankings() {
  const [tab, setTab] = useState('global')

  return (
    <div className="h-full bg-surface flex flex-col overflow-hidden">
      {/* Sub-nav */}
      <div className="bg-white border-b border-gray-200 shrink-0">
        <nav className="flex gap-8 px-8 h-14 items-center">
          {[
            { id: 'my', label: 'My Rankings' },
            { id: 'global', label: 'Global Rankings' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`h-full flex items-center border-b-2 font-black text-xs uppercase tracking-widest transition-colors ${
                tab === id
                  ? 'border-secondary text-primary'
                  : 'border-transparent text-slate-400 hover:text-primary'
              }`}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {tab === 'my' ? <MyRankings /> : <GlobalRankings />}
      </div>
    </div>
  )
}
