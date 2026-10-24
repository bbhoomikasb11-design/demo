import { useEffect, useId, useRef, useState } from 'react'
import { ArrowDownRight, ArrowRight, Check, Code2, Heart, Layers, LayoutDashboard, MousePointer2, Palette, PencilRuler, Plus, Route } from 'lucide-react'
import { experience } from '../data.js'
import './ExperienceJournal.css'

const chapters = {
  jc: { label: 'Jarurat Care', field: 'Healthcare & design', note: 'Thoughtful interfaces. Human needs.', Icon: Heart, tools: [LayoutDashboard, Route, Layers] },
  w3: { label: 'WE3.BUILD', field: 'Products, code & stories', note: 'From an idea to an experience.', Icon: Code2, tools: [PencilRuler, Code2, Palette] },
}

export default function ExperienceJournal() {
  const id = useId()
  const root = useRef(null)
  const tabs = useRef([])
  const [active, setActive] = useState(0)
  const [opened, setOpened] = useState({ jc: 0, w3: 0 })
  const [arrived, setArrived] = useState(false)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setArrived(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setArrived(true)
        observer.disconnect()
      }
    }, { threshold: .12 })
    observer.observe(root.current)
    return () => observer.disconnect()
  }, [])

  function navigate(event, index) {
    const next = event.key === 'ArrowRight' ? (index + 1) % experience.length
      : event.key === 'ArrowLeft' ? (index + experience.length - 1) % experience.length
        : event.key === 'Home' ? 0 : event.key === 'End' ? experience.length - 1 : null
    if (next === null) return
    event.preventDefault()
    setActive(next)
    tabs.current[next]?.focus({ preventScroll: true })
  }

  return <div ref={root} className={`experience-journal wide ${arrived ? 'journal-arrived' : ''}`}>
    <div className="journal-invitation"><span>Two teams. Different perspectives.</span><span><MousePointer2 size={14} aria-hidden="true"/> Open a folder</span></div>
    <div className="journal-tabs" role="tablist" aria-label="Explore my experience">
      {experience.map((job, index) => {
        const chapter = chapters[job.mark]
        return <button
          key={job.mark}
          ref={node => { tabs.current[index] = node }}
          type="button"
          role="tab"
          id={`${id}-tab-${job.mark}`}
          aria-controls={`${id}-panel-${job.mark}`}
          aria-selected={active === index}
          tabIndex={active === index ? 0 : -1}
          className={`journal-tab journal-${job.color}`}
          onClick={() => setActive(index)}
          onKeyDown={event => navigate(event, index)}
        >
          <span className="journal-tab-mark" aria-hidden="true">{job.mark}<span>.</span></span>
          <span className="journal-tab-name"><strong>{chapter.label}</strong><span>{chapter.field}</span></span>
          <ArrowDownRight className="journal-tab-arrow" size={19} aria-hidden="true"/>
        </button>
      })}
    </div>
    <div className="journal-binding">
      {experience.map((job, index) => {
        const chapter = chapters[job.mark]
        const Stamp = chapter.Icon
        return <div key={job.mark} id={`${id}-panel-${job.mark}`} role="tabpanel" aria-labelledby={`${id}-tab-${job.mark}`} hidden={active !== index} className={`journal-page journal-${job.color}`}>
          <div className="journal-overview">
            <div className="journal-paper-art" aria-hidden="true">
              <span className="journal-art-sheet sheet-back"><Layers/></span>
              <span className="journal-art-sheet sheet-front"><Stamp/><span>{job.mark}.</span></span>
              <span className="journal-art-seal"><Check size={17}/></span>
            </div>
            <p className="journal-handwritten">{chapter.note}</p>
            <h3>{job.company}</h3>
            <p className="journal-role">{job.role}</p>
            <p className="journal-summary">{job.description}</p>
          </div>
          <div className="journal-work">
            <div className="journal-work-heading"><h4>Inside the work</h4><ArrowDownRight size={22} aria-hidden="true"/></div>
            <p className="journal-work-hint">A closer look at my focus areas.</p>
            <div className="journal-areas">
              {job.areas.map((area, areaIndex) => {
                const Icon = chapter.tools[areaIndex]
                const isOpen = opened[job.mark] === areaIndex
                const areaId = `${id}-area-${job.mark}-${areaIndex}`
                return <div className={`journal-area ${isOpen ? 'area-open' : ''}`} key={area.title}>
                  <h5><button type="button" aria-expanded={isOpen} aria-controls={areaId} onClick={() => setOpened(previous => ({ ...previous, [job.mark]: isOpen ? null : areaIndex }))}>
                    <span className="journal-area-icon"><Icon size={19} aria-hidden="true"/></span>
                    <span>{area.title}</span><Plus size={17} className="journal-area-toggle" aria-hidden="true"/>
                  </button></h5>
                  <div className="journal-area-reveal" id={areaId} aria-hidden={!isOpen}>
                    <div><div className="journal-area-copy"><p>{area.description}</p><div className="journal-area-tags">{area.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></div>
                  </div>
                </div>
              })}
            </div>
            <div className="journal-footnote"><PencilRuler size={15} aria-hidden="true"/><span>Learning by doing. Refining along the way.</span></div>
          </div>
          <div className="journal-toolbox"><span>What I bring <ArrowRight size={14} aria-hidden="true"/></span><ul aria-label={`Focus areas at ${job.company}`}>{job.focus.map(item => <li key={item}>{item}</li>)}</ul></div>
        </div>
      })}
    </div>
  </div>
}
