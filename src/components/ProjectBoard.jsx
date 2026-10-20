import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, RotateCcw } from 'lucide-react'
import { projects } from '../data.js'
import ProjectArt from './ProjectArt.jsx'
import ProjectSpotlight from './ProjectSpotlight.jsx'
import './ProjectBoard.css'

const arrangements = [
  { angle: '-4deg', fastener: 'pin', color: '#a85c46', caption: 'Campus, connected.' },
  { angle: '3deg', fastener: 'clip', caption: 'A little room to think.' },
  { angle: '-2deg', fastener: 'pin', color: '#648354', caption: 'The web, your way.' },
  { angle: '2.5deg', fastener: 'tape', caption: 'Good times. All squared up.' },
  { angle: '-3deg', fastener: 'clip', caption: 'A little clarity in every scan.' },
  { angle: '4deg', fastener: 'tape', caption: 'Care, connected.' },
  { angle: '-3deg', fastener: 'pin', color: '#7c7697', caption: 'Find your kind of perfect.' },
]

export default function ProjectBoard() {
  const board = useRef(null)
  const triggers = useRef(new Map())
  const lastSelected = useRef(null)
  const [selected, setSelected] = useState(null)
  const [opened, setOpened] = useState(0)
  const [entered, setEntered] = useState(false)
  const [swing, setSwing] = useState(0)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setEntered(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntered(true)
        observer.disconnect()
      }
    }, { threshold: 0.12 })
    observer.observe(board.current)
    return () => observer.disconnect()
  }, [])

  function openProject(project) {
    lastSelected.current = project.id
    setSelected(project)
    setOpened(n => n + 1)
  }

  function closeProject() {
    setSelected(null)
    const trigger = triggers.current.get(lastSelected.current)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    trigger?.focus({ preventScroll: true })
    trigger?.scrollIntoView({ block: 'center', behavior: reduce ? 'instant' : 'smooth' })
  }

  function tiltCard(event) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - .5
    const y = (event.clientY - rect.top) / rect.height - .5
    card.style.setProperty('--tilt-x', `${-y * 9}deg`)
    card.style.setProperty('--tilt-y', `${x * 9}deg`)
  }

  function resetTilt(event) {
    event.currentTarget.style.setProperty('--tilt-x', '0deg')
    event.currentTarget.style.setProperty('--tilt-y', '0deg')
  }

  return <div className="project-board-wrap wide" id="project-board">
    <div className="project-board-toolbar">
      <p id="project-board-hint">Pick a card. There’s a story behind it.</p>
      <button type="button" className="board-swing" onClick={() => { setEntered(true); setSwing(n => n + 1) }} aria-label="Replay the swinging card animation">
        <RotateCcw size={14} aria-hidden="true" /><span>Swing the cards</span>
      </button>
    </div>
    <ul ref={board} className={`project-board ${entered ? 'board-entered' : ''}`} aria-label="Selected projects" aria-describedby="project-board-hint">
      {projects.map((project, i) => {
        const arrangement = arrangements[i]
        return <li
          key={`${project.id}-${swing}`}
          className={`project-pin-slot pin-slot-${project.id}`}
          style={{ '--card-angle': arrangement.angle, '--card-delay': `${i * 65}ms`, '--pin-color': arrangement.color }}
        >
          <button
            ref={node => { if (node) triggers.current.set(project.id, node); else triggers.current.delete(project.id) }}
            type="button"
            className={`project-pin ${selected?.id === project.id ? 'pin-selected' : ''}`}
            onClick={() => openProject(project)}
            onPointerMove={tiltCard}
            onPointerLeave={resetTilt}
            onBlur={resetTilt}
            aria-label={`Read about ${project.name}`}
            aria-expanded={selected?.id === project.id}
            aria-controls="home-project-detail"
          >
            <span className={`pin-fastener fastener-${arrangement.fastener}`} aria-hidden="true" />
            <span className="pin-art"><ProjectArt project={project} /></span>
            <span className="pin-caption">
              <span className="pin-name">{project.name}</span>
              <span className="pin-note">{arrangement.caption}</span>
              <span className="pin-open" aria-hidden="true"><ArrowUpRight size={16} /></span>
            </span>
          </button>
        </li>
      })}
    </ul>
    <div className="board-footnote"><span>Seven projects. Different possibilities.</span><span>Made with curiosity.</span></div>
    <div id="home-project-detail">
      {selected && <ProjectSpotlight key={`${selected.id}-${opened}`} project={selected} onClose={closeProject} />}
    </div>
  </div>
}
