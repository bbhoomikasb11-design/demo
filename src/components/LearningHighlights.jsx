import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Code2, GraduationCap, MapPin, Plus, Trophy } from 'lucide-react'
import './LearningHighlights.css'

const milestones = [
  {
    title: 'SEBI Securities Market TechSprint',
    note: 'Round 1 selection',
    Icon: Trophy,
    description: 'Participation and selection for Round 1 of the SEBI Securities Market TechSprint.',
    href: 'https://hackculture.io/hackathons/sebi-securities-market-techsprint',
    linkLabel: 'Explore the event',
  },
  {
    title: 'Code Carnage 2.0',
    note: '24-hour hackathon · Team BareMetal',
    Icon: Code2,
    description: 'Participated in a 24-hour offline hackathon at SJB Institute of Technology. Contributed to a disaster management and volunteer platform connecting disaster-response needs with volunteers.',
    href: 'https://github.com/Prajwal-17/disaster-volunteer-platform',
    linkLabel: 'View the team project',
  },
]

export function EducationNote() {
  return <article className="education-note">
    <div className="education-note-top">
      <span className="learning-seal" aria-hidden="true"><GraduationCap size={28} strokeWidth={1.5}/></span>
      <span className="education-place"><MapPin size={13}/>Bengaluru</span>
    </div>
    <h3>Don Bosco Institute of Technology</h3>
    <p className="education-degree">Bachelor of Engineering</p>
    <p className="education-specialism">Artificial Intelligence &amp; Data Science</p>
    <div className="education-note-bottom">
      <p className="education-grade"><strong>9.0<span>/10</span></strong><span>CGPA</span></p>
      <Link to="/#project-board" className="learning-link">See what I’m building<ArrowRight size={17}/></Link>
    </div>
  </article>
}

export function MilestoneHighlights() {
  const [expanded, setExpanded] = useState(null)
  const id = useId()
  return <div className="learning-highlights wide">
    <div className="learning-awards">
      <article className="learning-award-primary">
        <div className="learning-award-top"><span className="learning-award-mark" aria-hidden="true">4<span>×</span></span><Trophy size={24} strokeWidth={1.5} aria-hidden="true"/></div>
        <h3>Four poster presentation wins.</h3><p>Turning ideas into stories worth sharing. Winner of four poster presentation competitions.</p>
      </article>
      <article>
        <div className="learning-award-top"><span className="learning-award-mark" aria-hidden="true">1<sup>st</sup></span><Trophy size={24} strokeWidth={1.5} aria-hidden="true"/></div>
        <h3>First place in debate.</h3><p>A voice worth finding. First place in a debate competition at Gousia College.</p>
      </article>
    </div>
    <p className="milestone-invitation">Hackathons &amp; participation</p>
    <div className="milestone-paper">
      {milestones.map(({ title, note, Icon, description, href, linkLabel }, index) => {
        const open = expanded === index
        return <article className={`milestone-entry ${open ? 'is-open' : ''}`} key={title}>
          <h3><button className="milestone-toggle" aria-expanded={open} aria-controls={`${id}-story-${index}`} id={`${id}-toggle-${index}`} onClick={() => setExpanded(open ? null : index)}>
            <span className="milestone-stamp" aria-hidden="true"><Icon size={23} strokeWidth={1.6}/></span>
            <span className="milestone-label"><span>{note}</span><strong>{title}</strong></span>
            <span className="milestone-plus" aria-hidden="true"><Plus size={19}/></span>
          </button></h3>
          <div className="milestone-reveal" id={`${id}-story-${index}`} role="region" aria-labelledby={`${id}-toggle-${index}`} aria-hidden={!open} inert={!open}>
            <div><div className="milestone-story">
              <p>{description}</p>
              <a href={href} target="_blank" rel="noopener noreferrer" className="learning-link">{linkLabel}<ArrowUpRight size={16}/></a>
            </div></div>
          </div>
        </article>
      })}
    </div>
  </div>
}
