import { useState, useEffect, useRef } from 'react'
import { useAuth } from './contexts/AuthContext'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const SYSTEMS = {
  overview: {
    id: 'overview',
    label: 'FULL MAP',
    description: 'Complete BJJ positions network — all major positions and transitions.',
    nodes: [
      { id: 'standing', label: 'Standing', type: 'position', size: 28, posType: 'neutral' },
      { id: 'closed_guard', label: 'Closed Guard', type: 'guard', size: 32, posType: 'bottom' },
      { id: 'mount', label: 'Mount', type: 'position', size: 34, posType: 'top' },
      { id: 'side_control', label: 'Side Control', type: 'position', size: 32, posType: 'top' },
      { id: 'back_control', label: 'Back Control', type: 'position', size: 32, posType: 'top' },
      { id: 'half_guard', label: 'Half Guard', type: 'guard', size: 28, posType: 'bottom' },
      { id: 'open_guard', label: 'Open Guard', type: 'guard', size: 28, posType: 'bottom' },
      { id: 'turtle', label: 'Turtle', type: 'position', size: 26, posType: 'bottom' },
      { id: 'north_south', label: 'North South', type: 'position', size: 24, posType: 'top' },
      { id: 'knee_on_belly', label: 'Knee on Belly', type: 'position', size: 24, posType: 'top' },
      { id: 'butterfly', label: 'Butterfly', type: 'guard', size: 26, posType: 'bottom' },
      { id: 'de_la_riva', label: 'De La Riva', type: 'guard', size: 24, posType: 'bottom' },
      { id: 'spider', label: 'Spider Guard', type: 'guard', size: 22, posType: 'bottom' },
      { id: 'lasso', label: 'Lasso Guard', type: 'guard', size: 22, posType: 'bottom' },
      { id: 'deep_half', label: 'Deep Half', type: 'guard', size: 22, posType: 'bottom' },
      { id: 'x_guard', label: 'X Guard', type: 'guard', size: 22, posType: 'bottom' },
      { id: 'knee_shield', label: 'Knee Shield', type: 'guard', size: 22, posType: 'bottom' },
      { id: 'tech_mount', label: 'Tech Mount', type: 'position', size: 22, posType: 'top' },
      { id: 'fifty_fifty', label: '50/50', type: 'position', size: 20, posType: 'neutral' },
      { id: 'ashi', label: 'Ashi Garami', type: 'position', size: 22, posType: 'neutral' },
    ],
    edges: [
      { from: 'standing', to: 'closed_guard' },
      { from: 'standing', to: 'open_guard' },
      { from: 'standing', to: 'butterfly' },
      { from: 'closed_guard', to: 'mount' },
      { from: 'closed_guard', to: 'back_control' },
      { from: 'closed_guard', to: 'open_guard' },
      { from: 'closed_guard', to: 'half_guard' },
      { from: 'closed_guard', to: 'de_la_riva' },
      { from: 'mount', to: 'side_control' },
      { from: 'mount', to: 'back_control' },
      { from: 'mount', to: 'tech_mount' },
      { from: 'side_control', to: 'mount' },
      { from: 'side_control', to: 'north_south' },
      { from: 'side_control', to: 'knee_on_belly' },
      { from: 'side_control', to: 'back_control' },
      { from: 'side_control', to: 'turtle' },
      { from: 'back_control', to: 'turtle' },
      { from: 'back_control', to: 'mount' },
      { from: 'half_guard', to: 'closed_guard' },
      { from: 'half_guard', to: 'deep_half' },
      { from: 'half_guard', to: 'side_control' },
      { from: 'half_guard', to: 'knee_shield' },
      { from: 'knee_shield', to: 'butterfly' },
      { from: 'knee_shield', to: 'half_guard' },
      { from: 'open_guard', to: 'butterfly' },
      { from: 'open_guard', to: 'de_la_riva' },
      { from: 'open_guard', to: 'spider' },
      { from: 'open_guard', to: 'lasso' },
      { from: 'butterfly', to: 'x_guard' },
      { from: 'butterfly', to: 'half_guard' },
      { from: 'de_la_riva', to: 'x_guard' },
      { from: 'de_la_riva', to: 'ashi' },
      { from: 'de_la_riva', to: 'fifty_fifty' },
      { from: 'x_guard', to: 'ashi' },
      { from: 'tech_mount', to: 'back_control' },
      { from: 'tech_mount', to: 'mount' },
      { from: 'turtle', to: 'back_control' },
      { from: 'turtle', to: 'side_control' },
      { from: 'knee_on_belly', to: 'mount' },
      { from: 'knee_on_belly', to: 'side_control' },
      { from: 'north_south', to: 'side_control' },
      { from: 'deep_half', to: 'back_control' },
      { from: 'lasso', to: 'spider' },
      { from: 'ashi', to: 'fifty_fifty' },
    ],
  },
  closed_guard: {
    id: 'closed_guard',
    label: 'CLOSED GUARD',
    description: 'Attacks, sweeps and submissions from closed guard bottom position.',
    nodes: [
      {
        id: 'cg',
        label: 'Closed\nGuard',
        type: 'guard',
        size: 40,
        posType: 'bottom',
        origin: 'cg',
        stepsFromOrigin: [
          'Lock ankles behind opponent back.',
          'Break posture with collar/sleeve grip.',
          'Control distance — keep close or extend.',
        ],
      },
      {
        id: 'cg_cross',
        label: 'Cross Collar\nChoke',
        type: 'submission',
        size: 28,
        posType: 'bottom',
        origin: 'cg',
        stepsFromOrigin: [
          'Break posture, double collar grips.',
          'Feed hand deep behind neck.',
          'Second hand crosses; rotate wrists, flare elbows.',
        ],
      },
      {
        id: 'cg_armbar',
        label: 'Armbar',
        type: 'submission',
        size: 28,
        posType: 'bottom',
        origin: 'cg',
        stepsFromOrigin: [
          'Control arm two-on-one; foot on hip.',
          'Pivot 90°, swing leg over head.',
          'Pinch knees, extend hips.',
        ],
      },
      {
        id: 'cg_triangle',
        label: 'Triangle',
        type: 'submission',
        size: 26,
        posType: 'bottom',
        origin: 'cg',
        stepsFromOrigin: [
          'Push one arm across.',
          'Swing leg over shoulder, lock figure-four.',
          'Squeeze knees, pull head down.',
        ],
      },
      {
        id: 'cg_sweep',
        label: 'Hip Bump\nSweep',
        type: 'sweep',
        size: 26,
        posType: 'bottom',
        origin: 'cg',
        stepsFromOrigin: [
          'Sit up, trap posting arm.',
          'Drive hips under center.',
          'Rotate to mount.',
        ],
      },
      {
        id: 'cg_kimura',
        label: 'Kimura',
        type: 'submission',
        size: 26,
        posType: 'bottom',
        origin: 'cg',
        stepsFromOrigin: [
          'Sit up, figure-four wrist.',
          'Post foot, break posture.',
          'Drag wrist behind back.',
        ],
      },
      { id: 'cg_mount', label: 'Mount', type: 'position', size: 30, posType: 'top' },
    ],
    edges: [
      { from: 'cg', to: 'cg_cross' },
      { from: 'cg', to: 'cg_armbar' },
      { from: 'cg', to: 'cg_triangle' },
      { from: 'cg', to: 'cg_sweep' },
      { from: 'cg', to: 'cg_kimura' },
      { from: 'cg_sweep', to: 'cg_mount' },
    ],
  },
  back_control: {
    id: 'back_control',
    label: 'BACK CONTROL',
    description: 'Back takes, chokes, entries and escapes from back control.',
    nodes: [
      {
        id: 'bc',
        label: 'Back\nControl',
        type: 'hub',
        size: 44,
        posType: 'top',
        origin: 'bc',
        stepsFromOrigin: [
          'Secure seatbelt (over-under).',
          'Insert hooks or body triangle.',
          'Chest glued to back.',
        ],
      },
      {
        id: 'bc_rnc',
        label: 'RNC',
        type: 'submission',
        size: 32,
        posType: 'top',
        origin: 'bc',
        stepsFromOrigin: ['Slide arm under chin.', 'Grip own bicep.', 'Expand chest, squeeze.'],
      },
      {
        id: 'bc_bow',
        label: 'Bow &\nArrow',
        type: 'submission',
        size: 26,
        posType: 'top',
        origin: 'bc',
        stepsFromOrigin: ['Grab collar.', 'Grip pant leg.', 'Extend away, drive knee.'],
      },
      {
        id: 'bc_armbar',
        label: 'Armbar',
        type: 'submission',
        size: 24,
        posType: 'top',
        origin: 'bc',
        stepsFromOrigin: ['Isolate arm.', 'Swing leg over head.', 'Sit back, extend hips.'],
      },
      {
        id: 'bc_triangle',
        label: 'Triangle',
        type: 'submission',
        size: 24,
        posType: 'top',
        origin: 'bc',
        stepsFromOrigin: [
          'Lock triangle around neck and arm.',
          'Turn perpendicular.',
          'Squeeze thighs.',
        ],
      },
    ],
    edges: [
      { from: 'bc', to: 'bc_rnc' },
      { from: 'bc', to: 'bc_bow' },
      { from: 'bc', to: 'bc_armbar' },
      { from: 'bc', to: 'bc_triangle' },
    ],
  },
  mount: {
    id: 'mount',
    label: 'MOUNT',
    description: 'Attacks and escapes from full mount top position.',
    nodes: [
      {
        id: 'mt',
        label: 'Mount',
        type: 'hub',
        size: 44,
        posType: 'top',
        origin: 'mt',
        stepsFromOrigin: [
          'Sit heavy, grapevine or high mount.',
          'Weight on chest not hips.',
          'Control arms and head.',
        ],
      },
      {
        id: 'mt_armbar',
        label: 'Armbar',
        type: 'submission',
        size: 28,
        posType: 'top',
        origin: 'mt',
        stepsFromOrigin: [
          'Isolate arm, step over head.',
          'Pinch knees, hips under elbow.',
          'Lean back, extend.',
        ],
      },
      {
        id: 'mt_choke',
        label: 'Cross\nChoke',
        type: 'submission',
        size: 26,
        posType: 'top',
        origin: 'mt',
        stepsFromOrigin: [
          'Pull collar grips across.',
          'Elbows pointed down.',
          'Rotate wrists, drive shoulders.',
        ],
      },
    ],
    edges: [
      { from: 'mt', to: 'mt_armbar' },
      { from: 'mt', to: 'mt_choke' },
    ],
  },
}

function PositionsNetwork() {
  const [positions, setPositions] = useState(SYSTEMS)
  const [currentSystem, setCurrentSystem] = useState('overview')
  const [selectedNode, setSelectedNode] = useState(null)
  const canvasRef = useRef(null)
  const { token } = useAuth()

  useEffect(() => {
    // Try to fetch from backend, fallback to local data
    const fetchSystems = async () => {
      try {
        const headers = {}
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const res = await fetch(`${API_BASE_URL}/api/positions/systems`, { headers })
        if (res.ok) {
          const data = await res.json()
          setPositions(data)
        }
      } catch (err) {
        console.log('Using local positions data:', err.message)
      }
    }

    fetchSystems()
  }, [token])

  useEffect(() => {
    renderNetwork()
  }, [currentSystem, selectedNode, positions])

  const renderNetwork = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const system = positions[currentSystem]

    if (!system) return

    // Clear canvas
    ctx.fillStyle = '#0a0e17'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2

    // Position nodes in circle
    const nodePositions = {}
    system.nodes.forEach((node, idx) => {
      const angle = (idx / system.nodes.length) * Math.PI * 2
      const radius = Math.min(width, height) * 0.35
      nodePositions[node.id] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      }
    })

    // Draw edges
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 1.5
    system.edges.forEach((edge) => {
      const from = nodePositions[edge.from]
      const to = nodePositions[edge.to]
      if (from && to) {
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.stroke()
      }
    })

    // Draw nodes
    system.nodes.forEach((node) => {
      const pos = nodePositions[node.id]
      if (!pos) return

      const isSelected = selectedNode?.id === node.id
      const radius = node.size

      // Node color based on type
      let color = '#6c5ce7'
      if (node.posType === 'top') color = '#e84393'
      else if (node.posType === 'bottom') color = '#00cec9'
      else if (node.posType === 'neutral') color = '#fdcb6e'

      // Draw circle
      ctx.fillStyle = isSelected ? color : `${color}40`
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      ctx.fill()

      // Border
      ctx.strokeStyle = color
      ctx.lineWidth = isSelected ? 2.5 : 1.5
      ctx.stroke()

      // Label
      ctx.fillStyle = '#e2e8f0'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const lines = node.label.split('\n')
      lines.forEach((line, i) => {
        ctx.fillText(line, pos.x, pos.y - (lines.length - 1) * 4 + i * 8)
      })
    })
  }

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const system = positions[currentSystem]
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2

    // Find clicked node
    let clicked = null
    system.nodes.forEach((node, idx) => {
      const angle = (idx / system.nodes.length) * Math.PI * 2
      const radius = Math.min(width, height) * 0.35
      const nodeX = centerX + Math.cos(angle) * radius
      const nodeY = centerY + Math.sin(angle) * radius

      const dist = Math.hypot(x - nodeX, y - nodeY)
      if (dist < node.size) {
        clicked = node
      }
    })

    setSelectedNode(clicked)
  }

  const system = positions[currentSystem]

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🥋 BJJ Positions Network</h1>
        <p style={styles.subtitle}>{system?.description}</p>
      </div>

      <div style={styles.tabs}>
        {Object.keys(positions).map((key) => (
          <button
            key={key}
            style={{
              ...styles.tabBtn,
              ...(currentSystem === key ? styles.tabBtnActive : {}),
            }}
            onClick={() => {
              setCurrentSystem(key)
              setSelectedNode(null)
            }}
          >
            {positions[key].label}
          </button>
        ))}
      </div>

      <div style={styles.main}>
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onClick={handleCanvasClick}
          style={styles.canvas}
        />

        <div style={styles.panel}>
          {selectedNode ? (
            <div style={styles.nodeDetail}>
              <h3>{selectedNode.label.replace('\n', ' ')}</h3>
              <div style={{ marginTop: '10px' }}>
                <span style={{ ...styles.badge, ...getBadgeColor(selectedNode.type) }}>
                  {selectedNode.type}
                </span>
                <span style={{ ...styles.badge, ...getBadgeColor(selectedNode.posType) }}>
                  {selectedNode.posType}
                </span>
              </div>

              {selectedNode.stepsFromOrigin && (
                <div style={styles.stepsSection}>
                  <h4>How to execute:</h4>
                  <ol>
                    {selectedNode.stepsFromOrigin.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.emptyState}>Click on a position to see details and execution steps.</div>
          )}
        </div>
      </div>
    </div>
  )
}

const getBadgeColor = (type) => {
  const colors = {
    top: { background: 'rgba(232,67,147,0.2)', color: '#e84393' },
    bottom: { background: 'rgba(0,206,201,0.2)', color: '#00cec9' },
    neutral: { background: 'rgba(253,203,110,0.2)', color: '#fdcb6e' },
    submission: { background: 'rgba(255,107,107,0.2)', color: '#ff6b6b' },
    guard: { background: 'rgba(0,206,201,0.2)', color: '#00cec9' },
    position: { background: 'rgba(232,67,147,0.2)', color: '#e84393' },
    sweep: { background: 'rgba(108,231,113,0.2)', color: '#6ce771' },
    hub: { background: 'rgba(108,92,231,0.2)', color: '#a29bfe' },
  }
  return colors[type] || { background: 'rgba(108,92,231,0.2)', color: '#a29bfe' }
}

const styles = {
  container: {
    background: '#0a0e17',
    color: '#e2e8f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '20px',
    background: '#111827',
    borderBottom: '1px solid #1e293b',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#e84393',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    padding: '10px 20px',
    background: '#0d1220',
    borderBottom: '1px solid #1e293b',
    overflowX: 'auto',
  },
  tabBtn: {
    padding: '8px 16px',
    borderRadius: '999px',
    border: '1px solid #1e293b',
    background: '#1a2236',
    color: '#94a3b8',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  tabBtnActive: {
    background: '#e84393',
    borderColor: '#e84393',
    color: '#fff',
  },
  main: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  canvas: {
    flex: 1,
    cursor: 'grab',
    display: 'block',
  },
  panel: {
    width: '300px',
    background: '#111827',
    borderLeft: '1px solid #1e293b',
    padding: '20px',
    overflowY: 'auto',
  },
  nodeDetail: {
    fontSize: '13px',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '10px',
    fontWeight: '700',
    marginRight: '6px',
    marginBottom: '8px',
    border: '1px solid',
  },
  stepsSection: {
    marginTop: '16px',
  },
  emptyState: {
    color: '#475569',
    fontSize: '13px',
    lineHeight: '1.6',
  },
}

export default PositionsNetwork
