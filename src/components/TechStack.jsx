import { useEffect, useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, MoveHorizontal } from 'lucide-react'
import { skills } from '../data.js'
import TechCardArt from './TechCardArt.jsx'
import './TechStack.css'

const titles = ['Design & product', 'Frontend', 'Backend', 'Databases', 'AI applications', 'Tools & deployment']
const tabs = ['Design', 'Frontend', 'Backend', 'Data', 'AI', 'Tools']
const notes = [
  'From the first sketch to a thoughtful experience.',
  'Interfaces that turn an idea into something useful.',
  'The logic and connections behind the experience.',
  'Giving information a place and a purpose.',
  'A little intelligence. A lot of possibility.',
  'From a local experiment to a working product.',
]

function wrap(index) {
  return (index + skills.length) % skills.length
}

function distance(index, center) {
  const offset = wrap(index - center)
  return offset > skills.length / 2 ? offset - skills.length : offset
}

export default function TechStack() {
  const id = useId()
  const root = useRef(null)
  const buttons = useRef(new Map())
  const gesture = useRef(null)
  const suppressClickUntil = useRef(0)
  const lastPointer = useRef(null)
  const [center, setCenter] = useState(1)
  const [hovered, setHovered] = useState(null)
  const [focused, setFocused] = useState(null)
  const [entered, setEntered] = useState(false)
  const active = hovered ?? focused ?? center

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
    }, { threshold: .2 })
    observer.observe(root.current)
    return () => observer.disconnect()
  }, [])

  function select(index, focus = false) {
    setCenter(wrap(index))
    setHovered(null)
    setFocused(focus ? wrap(index) : null)
    lastPointer.current = null
    if (focus) requestAnimationFrame(() => buttons.current.get(wrap(index))?.focus({ preventScroll: true }))
  }

  function onCardPointer(event, index) {
    if (event.pointerType !== 'mouse' || event.buttons) return
    // Geometry changes can move cards under a still pointer. Only intentional
    // pointer movement should reveal a different card.
    const previous = lastPointer.current
    const moved = !previous || Math.abs(previous.x - event.clientX) + Math.abs(previous.y - event.clientY) > 1
    lastPointer.current = { x: event.clientX, y: event.clientY }
    if (moved) setHovered(index)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - .5
    const y = (event.clientY - rect.top) / rect.height - .5
    const card = buttons.current.get(index)
    card?.style.setProperty('--tech-tilt-x', `${-y * 6}deg`)
    card?.style.setProperty('--tech-tilt-y', `${x * 7}deg`)
  }

  function resetPointer() {
    setHovered(null)
    lastPointer.current = null
    buttons.current.forEach(button => {
      button.style.removeProperty('--tech-tilt-x')
      button.style.removeProperty('--tech-tilt-y')
    })
  }

  function onKey(event, index) {
    const next = event.key === 'ArrowRight' ? wrap(index + 1)
      : event.key === 'ArrowLeft' ? wrap(index - 1)
        : event.key === 'Home' ? 0
          : event.key === 'End' ? skills.length - 1 : null
    if (next === null) return
    event.preventDefault()
    select(next, true)
  }

  function beginSwipe(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    gesture.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId }
  }

  function finishSwipe(event) {
    const start = gesture.current
    gesture.current = null
    if (!start || start.pointerId !== event.pointerId) return
    const dx = event.clientX - start.x, dy = event.clientY - start.y
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      suppressClickUntil.current = performance.now() + 350
      select(center + (dx < 0 ? 1 : -1))
    }
  }

  return <div ref={root} className={`tech-stack wide ${entered ? 'tech-entered' : ''}`}>
    <div
      className="tech-fan-stage"
      role="group"
      aria-label="Explore my tech stack"
      onPointerLeave={() => { gesture.current = null; resetPointer() }}
      onPointerDown={beginSwipe}
      onPointerUp={finishSwipe}
      onPointerCancel={() => { gesture.current = null }}
    >
      {skills.map((skill, index) => {
        const offset = distance(index, center)
        const selected = active === index
        const offstage = Math.abs(offset) > 2
        return <div
          key={skill.icon}
          className={`tech-card-slot ${selected ? 'tech-active' : ''}`}
          data-distance={Math.abs(offset)}
          data-offstage={offstage || undefined}
          style={{ '--fan-offset': offset, '--fan-depth': Math.abs(offset), '--fan-angle': `${offset * 9}deg`, '--fan-z': selected ? 10 : 5 - Math.abs(offset), '--tech-delay': `${index * 55}ms` }}
          onPointerMove={event => onCardPointer(event, index)}
        >
          <button
            ref={node => { if (node) buttons.current.set(index, node); else buttons.current.delete(index) }}
            type="button"
            className={`tech-card tech-theme-${skill.icon}`}
            aria-label={`Explore ${skill.name}`}
            aria-pressed={selected}
            aria-describedby={selected ? `${id}-tools-${skill.icon}` : undefined}
            tabIndex={offstage ? -1 : 0}
            onFocus={() => {
              setHovered(null)
              setFocused(index)
              setCenter(index)
            }}
            onBlur={() => setFocused(null)}
            onKeyDown={event => onKey(event, index)}
            onClick={() => { if (performance.now() > suppressClickUntil.current) select(index) }}
          >
            <span className="tech-card-cover" aria-hidden="true">
              <span className="tech-cover-tag">{tabs[index]}</span>
              <TechCardArt kind={skill.icon} />
              <span className="tech-cover-title">{titles[index]}</span>
              <span className="tech-cover-hint">Take a closer look <ArrowRight size={14} /></span>
            </span>
            <span className="tech-card-reveal" aria-hidden={!selected}>
              <span className="tech-reveal-mark" aria-hidden="true"><TechCardArt kind={skill.icon} /></span>
              <span className="tech-reveal-title">{titles[index]}</span>
              <span className="tech-reveal-note">{notes[index]}</span>
              <span className="tech-tools" id={`${id}-tools-${skill.icon}`} role="list" aria-label={skill.name}>
                {skill.items.map((tool, itemIndex) => <span role="listitem" key={tool} style={{ '--tool-delay': `${itemIndex * 35}ms` }}>{tool}</span>)}
              </span>
            </span>
          </button>
        </div>
      })}
    </div>
    <div className="tech-fan-controls">
      <button type="button" className="tech-arrow" onClick={() => select(center - 1)} aria-label="Previous tech stack"><ArrowLeft size={19} /></button>
      <p><MoveHorizontal size={16} aria-hidden="true" /><span className="tech-desktop-hint">Hover to explore · drag to switch</span><span className="tech-touch-hint">Tap a card or swipe to explore</span></p>
      <button type="button" className="tech-arrow" onClick={() => select(center + 1)} aria-label="Next tech stack"><ArrowRight size={19} /></button>
    </div>
    <div className="tech-category-nav" role="group" aria-label="Choose a tech-stack category">
      {skills.map((skill, index) => <button key={skill.icon} type="button" onClick={() => select(index)} aria-label={`Show ${skill.name}`} aria-pressed={active === index}>{tabs[index]}</button>)}
    </div>
    <p className="sr-only" aria-live="polite" aria-atomic="true">{skills[center].name}: {skills[center].items.join(', ')}.</p>
  </div>
}
