import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

function Widget({ children, className = '' }) {
  return (
    <div className={`paper-texture p-5 relative group ${className}`}>
      <div className="push-pin" />
      <div className="widget-controls">
        <button className="p-1 text-gray-400 hover:text-gray-700">
          <span className="material-symbols-outlined text-sm">drag_indicator</span>
        </button>
        <div className="flex gap-1">
          <button className="p-1 text-gray-400 hover:text-gray-700">
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
          <button className="p-1 text-gray-400 hover:text-red-600">
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>
      {children}
    </div>
  )
}

function WidgetTitle({ icon, children }) {
  return (
    <h3 className="font-black text-[10px] uppercase tracking-widest mb-4 border-b border-black/10 pb-2 mt-4 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
      {icon && <span className="material-symbols-outlined text-sm">{icon}</span>}
      {children}
    </h3>
  )
}

export default function HomePage({ onOpenAuth }) {
  const { user } = useAuth()
  const [todos, setTodos] = useState([
    { id: 1, text: 'Review guard retention film', done: true },
    { id: 2, text: 'Drill 50 reps: ankle pick', done: false },
    { id: 3, text: 'Schedule private w/ coach', done: false },
    { id: 4, text: 'Update weight log', done: false },
  ])

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  return (
    <div className="h-full flex flex-col bg-navy-dark overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="cork-board-bg min-h-full">
          <div className="p-6 lg:px-12 lg:pt-14 lg:pb-14">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-14 max-w-350 mx-auto w-full">

              {/* Widget 1: My Profile */}
              <Widget>
                <div className="aspect-square bg-gray-100 mb-3 overflow-hidden relative mt-4">
                  {user?.profile_picture_url ? (
                    <img src={user.profile_picture_url} alt={user.username} className="w-full h-full object-cover grayscale contrast-125" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-container">
                      <span className="material-symbols-outlined text-7xl text-white/40">person</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black text-white px-2 py-0.5 text-[9px] font-black uppercase">
                    {user?.full_name || user?.username || 'Guest'}
                  </div>
                </div>
                <div className="space-y-1 px-1">
                  <h3 className="font-black text-lg uppercase leading-tight tracking-tighter" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {user ? 'My Profile' : 'Sign In'}
                  </h3>
                  {user ? (
                    <div className="flex gap-2">
                      <span className="bg-black text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase">{user.belt_rank || 'BJJ'} Belt</span>
                      {user.weight_class && <span className="border border-black text-black text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase">{user.weight_class}</span>}
                    </div>
                  ) : (
                    <button onClick={() => onOpenAuth('login')} className="text-[10px] font-black text-secondary uppercase tracking-wider">
                      Sign in to view →
                    </button>
                  )}
                </div>
              </Widget>

              {/* Widget 2: Training Performance */}
              <Widget>
                <WidgetTitle>Training Performance</WidgetTitle>
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Monthly Mat Hours</span>
                    <span className="text-5xl font-black text-primary tracking-tighter" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>42.5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-lg">trending_up</span>
                    <span className="text-xs font-black text-secondary">+12% vs last month</span>
                  </div>
                  <div>
                    <div className="h-1.5 bg-gray-100 overflow-hidden rounded-full">
                      <div className="h-full bg-primary w-[70%]" />
                    </div>
                    <span className="block mt-1 text-[8px] font-bold text-gray-500 uppercase">Goal: 60 Hours / Month</span>
                  </div>
                </div>
              </Widget>

              {/* Widget 3: AI Coach Snippet */}
              <Widget>
                <div className="flex justify-between items-start mb-4 mt-4">
                  <span className="bg-secondary text-white text-[8px] font-black px-1.5 py-0.5 tracking-tighter uppercase">META COACH SNIPPET</span>
                  <span className="material-symbols-outlined text-lg text-primary">psychology</span>
                </div>
                <h3 className="font-black text-xl uppercase tracking-tight leading-none mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Scissor Sweep Efficiency
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-dashed border-black/20 pb-2">
                    <span className="text-[10px] font-bold uppercase">Success Rate</span>
                    <span className="text-2xl font-black" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>84%</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-dashed border-black/20 pb-2">
                    <span className="text-[10px] font-bold uppercase">Grip Retention</span>
                    <span className="text-2xl font-black" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>91%</span>
                  </div>
                  <div className="p-3 bg-gray-50 text-[11px] italic leading-snug border-l-4 border-secondary">
                    "Knee shield height is optimal, transition lagging."
                  </div>
                </div>
              </Widget>

              {/* Widget 4: To-Do List */}
              <Widget>
                <WidgetTitle icon="fact_check">Academy Tasks</WidgetTitle>
                <ul className="space-y-3">
                  {todos.map(todo => (
                    <li
                      key={todo.id}
                      className="flex items-center gap-3 cursor-pointer group/item"
                      onClick={() => toggleTodo(todo.id)}
                    >
                      <div className="w-4 h-4 border-2 border-black flex items-center justify-center shrink-0 group-hover/item:bg-black/5">
                        {todo.done && <span className="material-symbols-outlined text-[10px] font-black">check</span>}
                      </div>
                      <span className={`text-xs font-bold uppercase ${todo.done ? 'line-through opacity-40' : ''}`}>
                        {todo.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </Widget>

              {/* Widget 5: Quote */}
              <Widget>
                <div className="mt-4 h-full flex flex-col justify-center items-center text-center py-6">
                  <p className="text-lg font-bold leading-snug italic text-gray-700" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    "If you want to be a lion, you must train with lions."
                  </p>
                  <span className="block mt-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                    — Machado Brother
                  </span>
                </div>
              </Widget>

              {/* Widget 6: Upcoming Classes */}
              <Widget>
                <WidgetTitle icon="event_note">Upcoming Classes</WidgetTitle>
                <div className="space-y-2">
                  {[
                    { day: 'Mon 18:00', cls: 'GI Advanced' },
                    { day: 'Tue 07:00', cls: 'No GI Drills' },
                    { day: 'Wed 19:30', cls: 'Open Mat' },
                  ].map(({ day, cls }) => (
                    <div key={day} className="flex justify-between items-center bg-gray-50 p-2">
                      <span className="text-[10px] font-black uppercase">{day}</span>
                      <span className="text-[10px] font-bold">{cls}</span>
                    </div>
                  ))}
                </div>
              </Widget>

              {/* Widget 7: Academy Ranking */}
              <Widget>
                <WidgetTitle>Academy Ranking</WidgetTitle>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-secondary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>#4</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase">Division Lead</div>
                    <div className="text-[9px] text-gray-500 font-bold uppercase">850 Points</div>
                  </div>
                </div>
              </Widget>

              {/* Widget 8: Gear Status */}
              <Widget>
                <WidgetTitle>Gear Status</WidgetTitle>
                <div className="space-y-2">
                  {[
                    { item: 'Competition Gi', status: 'Ready', color: 'text-green-600' },
                    { item: 'Finger Tape', status: 'Low', color: 'text-secondary' },
                    { item: 'Mouth Guard', status: 'Ready', color: 'text-green-600' },
                  ].map(({ item, status, color }) => (
                    <div key={item} className="flex justify-between text-[10px] font-bold">
                      <span>{item}</span>
                      <span className={`${color} uppercase`}>{status}</span>
                    </div>
                  ))}
                </div>
              </Widget>

              {/* Widget 9: My Rankings */}
              <Widget>
                <WidgetTitle>My Rankings</WidgetTitle>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase">State</span>
                    <span className="font-black text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>#12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase">National</span>
                    <span className="font-black text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>#48</span>
                  </div>
                  <div className="mt-3 p-2 bg-gray-50 text-[10px] text-center font-bold text-secondary uppercase border border-secondary/20">
                    Top 5% in Heavyweight Class
                  </div>
                </div>
              </Widget>

              {/* Add Widget */}
              <div className="paper-texture border-2 border-dashed border-black/20 flex items-center justify-center bg-white/10 hover:bg-white/30 hover:border-black/40 transition-all cursor-pointer group min-h-65">
                <div className="flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-4xl text-black/40 group-hover:scale-110 transition-transform">add</span>
                  <span className="text-black/40 font-black text-[10px] uppercase tracking-[0.2em]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Add Widget</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
