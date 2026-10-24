import { useId, useState } from 'react'
import { Plus } from 'lucide-react'
import { experience } from '../data.js'
import './ExperienceJournal.css'

export default function ExperienceJournal() {
  const id = useId()
  const [opened, setOpened] = useState({})

  return <div className="experience-journal wide">
    {experience.map(job => {
      const open = Boolean(opened[job.mark])
      return <article key={job.mark} className={`experience-note experience-${job.color} ${open ? 'is-expanded' : ''}`}>
        <div className="experience-note-heading">
          <span className="experience-monogram" aria-hidden="true">{job.mark}.</span>
          <div><h3>{job.company}</h3><p className="experience-role">{job.role}</p></div>
        </div>
        <p className="experience-summary">{job.description}</p>
        <button type="button" className="experience-disclosure" aria-expanded={open} aria-controls={`${id}-${job.mark}`} onClick={() => setOpened(previous => ({ ...previous, [job.mark]: !open }))}>
          <span>{open ? 'Hide focus areas' : 'Explore my focus'}<span className="sr-only"> at {job.company}</span></span>
          <Plus size={17} aria-hidden="true"/>
        </button>
        <div className="experience-reveal" id={`${id}-${job.mark}`} aria-hidden={!open} inert={!open}>
          <div><div className="experience-details">
            <ul className="experience-focus-list">{job.areas.map(area => <li key={area.title}><h4>{area.title}</h4><p>{area.description}</p></li>)}</ul>
            <ul className="experience-skills" aria-label={`Skills at ${job.company}`}>{job.focus.map(skill => <li key={skill}>{skill}</li>)}</ul>
          </div></div>
        </div>
      </article>
    })}
  </div>
}
