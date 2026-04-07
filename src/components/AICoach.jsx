import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { CoachService } from '../services/BackendServices'

const ARCHIVE = [
  { title: 'Open Mat Session', date: 'OCT 24', tags: ['Mount', 'Escape'] },
  { title: 'No-Gi Sparring', date: 'OCT 22', tags: ['Leg Lock', 'DLR'] },
  { title: 'Tournament Prep', date: 'OCT 18', tags: ['Guard', 'Passing'] },
]

export function AICoach() {
  const [question, setQuestion] = useState('')
  const [position, setPosition] = useState('')
  const [beltRank, setBeltRank] = useState('blue')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const coachService = CoachService()

  const handleAsk = async () => {
    if (!question.trim()) {
      setError('Please enter a question')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const answer = await coachService.askCoach(
        question,
        null,
        position || null,
        beltRank || null
      )
      setResponse(answer)
      setQuestion('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full bg-surface overflow-y-auto hide-scrollbar">
      <div className="max-w-5xl mx-auto px-8 py-10">

        {/* Page Header */}
        <header className="mb-10 flex justify-between items-end">
          <div>
            <span className="text-secondary font-bold text-xs uppercase tracking-[0.2em] block" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Live Analysis Lab</span>
            <h1 className="text-5xl font-black text-primary tracking-tighter -mt-1 uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Coach AI Podium</h1>
          </div>
          <div className="flex flex-col items-end pb-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Session ID</span>
            <span className="text-xs font-mono font-bold text-primary">#MJ-8829-YOLO11</span>
          </div>
        </header>

        {/* Video Player */}
        <section className="mb-8 space-y-4">
          <div className="relative aspect-video bg-black rounded-sm overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-linear-to-br from-primary via-[#0a1a2e] to-black flex items-center justify-center">
              <svg className="w-full h-full absolute inset-0 opacity-20" viewBox="0 0 100 100">
                <path d="M40,30 L45,35 L45,45 M45,35 L55,32 L60,38" fill="none" stroke="#b6191a" strokeDasharray="1,1" strokeWidth="0.5" />
                <circle cx="40" cy="30" fill="#b6191a" r="1" />
                <circle cx="45" cy="35" fill="#b6191a" r="1" />
                <circle cx="55" cy="32" fill="#b6191a" r="1" />
                <path d="M30,60 L35,55 L45,58 M35,55 L32,45 L38,40" fill="none" stroke="#002046" strokeDasharray="1,1" strokeWidth="0.5" />
                <circle cx="30" cy="60" fill="#b6191a" r="1" />
                <circle cx="35" cy="55" fill="#b6191a" r="1" />
                <circle cx="32" cy="45" fill="#b6191a" r="1" />
              </svg>
              <div className="text-center z-10">
                <span className="material-symbols-outlined text-white/20 text-8xl">videocam</span>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">No video loaded</p>
              </div>
            </div>
            <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              AI Live: YOLO11 Pose Detection
            </div>
            <div className="absolute bottom-0 left-0 w-full p-5 bg-linear-to-t from-black/90 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-5 text-white">
                <span className="material-symbols-outlined cursor-pointer hover:text-secondary transition-colors">play_arrow</span>
                <span className="material-symbols-outlined cursor-pointer hover:text-secondary transition-colors">skip_next</span>
                <div className="w-48 h-0.5 bg-white/20 rounded-full relative">
                  <div className="absolute left-0 top-0 h-full w-1/3 bg-secondary" />
                </div>
                <span className="text-[10px] font-mono">00:00 / 00:00</span>
              </div>
              <span className="material-symbols-outlined text-white cursor-pointer hover:text-secondary transition-colors">fullscreen</span>
            </div>
          </div>
          <div className="flex justify-center">
            <button className="bg-primary text-white px-10 py-4 rounded-sm font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-3 shadow-xl w-full max-w-md justify-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="material-symbols-outlined">upload_file</span>
              Upload New Training Video
            </button>
          </div>
        </section>

        {/* MotionLLM Report */}
        <section className="mb-10 bg-white p-8 rounded-sm shadow-sm border-t-4 border-primary">
          <h2 className="font-black text-2xl text-primary uppercase tracking-tighter mb-8 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <span className="material-symbols-outlined text-secondary">analytics</span>
            MotionLLM Analysis Report
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Guard Retention', badge: '88% EFFICIENCY', badgeBg: 'bg-primary', desc: 'Hip escape timing is precise. Late frame engagement detected at 02:45. Recommend earlier knee-elbow connection.' },
              { title: 'Scissor Sweep', badge: 'CRITICAL GAP', badgeBg: 'bg-secondary', desc: 'Insufficient pull on the sleeve at 03:12. Base weight of opponent not fully shifted before kick.' },
            ].map(({ title, badge, badgeBg, desc }) => (
              <div key={title} className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-black text-sm text-primary uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h4>
                  <span className={`${badgeBg} text-white text-[10px] font-black px-2 py-0.5 whitespace-nowrap`}>{badge}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
                <button className="w-full py-2.5 bg-gray-50 hover:bg-primary hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm border border-gray-200">
                  <span className="material-symbols-outlined text-sm">visibility</span> Highlight Body Parts
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button className="max-w-md w-full bg-secondary text-white py-4 rounded-sm font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 transition-all" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Save Report to Dashboard
              <span className="material-symbols-outlined">save_as</span>
            </button>
          </div>
        </section>

        {/* Ask AI Coach — live backend */}
        <section className="mb-10 bg-white p-8 rounded-sm shadow-sm border-t-4 border-secondary">
          <h2 className="font-black text-2xl text-primary uppercase tracking-tighter mb-8 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <span className="material-symbols-outlined text-secondary">psychology</span>
            Ask AI Coach
          </h2>
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Your Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., 'How do I improve my armbar from closed guard?'"
                disabled={loading}
                rows={4}
                className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none font-body"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  label: 'Position (Optional)',
                  value: position,
                  onChange: (e) => setPosition(e.target.value),
                  options: [
                    ['', 'Any Position'], ['closed guard', 'Closed Guard'], ['mount', 'Mount'],
                    ['back control', 'Back Control'], ['side control', 'Side Control'],
                    ['open guard', 'Open Guard'], ['half guard', 'Half Guard'],
                  ],
                },
                {
                  label: 'Belt Rank (Optional)',
                  value: beltRank,
                  onChange: (e) => setBeltRank(e.target.value),
                  options: [
                    ['white', 'White Belt'], ['blue', 'Blue Belt'], ['purple', 'Purple Belt'],
                    ['brown', 'Brown Belt'], ['black', 'Black Belt'],
                  ],
                },
              ].map(({ label, value, onChange, options }) => (
                <div key={label}>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">{label}</label>
                  <select
                    value={value}
                    onChange={onChange}
                    disabled={loading}
                    className="w-full border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                  >
                    {options.map(([val, text]) => <option key={val} value={val}>{text}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="w-full bg-primary text-white py-4 rounded-sm font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              <span className="material-symbols-outlined">{loading ? 'hourglass_empty' : 'send'}</span>
              {loading ? 'Analyzing...' : 'Ask Coach'}
            </button>
          </div>

          {response && (
            <div className="mt-8 space-y-6 border-t border-gray-100 pt-8">
              <div className="bg-gray-50 p-6 rounded-sm border-l-4 border-primary">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Coach Response</h3>
                <div className="prose prose-sm max-w-none text-slate-700">
                  <ReactMarkdown>{response.answer}</ReactMarkdown>
                </div>
              </div>

              {response.tips && response.tips.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Key Tips</h4>
                  <ul className="space-y-2">
                    {response.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {response.related_positions && response.related_positions.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Related Positions</h4>
                  <div className="flex flex-wrap gap-2">
                    {response.related_positions.map((pos, idx) => (
                      <span key={idx} className="px-3 py-1 bg-primary text-white text-xs font-bold uppercase">{pos}</span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setResponse(null)}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                Ask Another Question
              </button>
            </div>
          )}
        </section>

        {/* Performance Optimization */}
        <section className="mb-10">
          <h3 className="font-black text-3xl text-primary tracking-tighter uppercase mb-8 flex items-center gap-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <span className="w-12 h-0.75 bg-secondary" />
            Performance Optimization
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-sm border-l-4 border-secondary shadow-sm flex gap-6">
              <div className="w-20 h-20 bg-gray-50 shrink-0 flex items-center justify-center rounded-sm border border-gray-100">
                <span className="material-symbols-outlined text-4xl text-primary">fitness_center</span>
              </div>
              <div className="flex-1">
                <h4 className="font-black text-lg text-primary uppercase tracking-tight mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Strength & Conditioning</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest block">Mobility Focus</span>
                    <p className="text-sm font-bold text-primary">Hip Mobility for Guard Retention</p>
                    <p className="text-xs text-slate-500 italic">3 sets of 15 reps: 90/90 switches</p>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest block">Strength Focus</span>
                    <p className="text-sm font-bold text-primary">Explosive Glute Bridges</p>
                    <p className="text-xs text-slate-500 italic">4 sets of 8 reps: Weighted (30kg)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-primary p-8 rounded-sm shadow-sm flex gap-6 relative overflow-hidden">
              <div className="absolute -right-5 -top-5 opacity-10">
                <span className="material-symbols-outlined text-[120px]">sports_mma</span>
              </div>
              <div className="w-20 h-20 bg-white/10 shrink-0 flex items-center justify-center rounded-sm">
                <span className="material-symbols-outlined text-4xl text-secondary">model_training</span>
              </div>
              <div className="flex-1 relative z-10">
                <h4 className="font-black text-lg text-white uppercase tracking-tight mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Tactical Drills</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest block">Recommended Drill</span>
                    <p className="text-sm font-bold text-white">Scissor Sweep Power-Entry</p>
                    <p className="text-xs text-white/60 italic">Isolation sparring: Start from failed sweep</p>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest block">Mat Time</span>
                    <p className="text-sm font-bold text-white">Drill Duration: 20 Minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reports Archive */}
        <section className="pb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-3xl text-primary tracking-tighter uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Reports Archive</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {ARCHIVE.map(({ title, date, tags }) => (
              <div key={title} className="bg-white p-5 rounded-sm shadow-sm hover:border-t-2 hover:border-secondary transition-all group cursor-pointer">
                <div className="aspect-video mb-4 rounded-sm bg-linear-to-br from-primary to-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-white/20 text-4xl">videocam</span>
                </div>
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-black text-sm text-primary uppercase group-hover:text-secondary transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h5>
                  <span className="text-[10px] font-mono text-slate-400">{date}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(t => (
                    <span key={t} className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold uppercase">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

export default AICoach
