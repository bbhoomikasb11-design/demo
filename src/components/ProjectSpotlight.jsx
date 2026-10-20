import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowUpRight, ExternalLink, Paperclip } from 'lucide-react'
import { Github } from './BrandIcons.jsx'
import ProjectArt from './ProjectArt.jsx'
import './ProjectSpotlight.css'

export default function ProjectSpotlight({ project, onClose }) {
  const cardRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    if (!project) return

    const frame = requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      titleRef.current?.focus({ preventScroll: true })
      cardRef.current?.scrollIntoView({
        block: 'start',
        behavior: reducedMotion ? 'instant' : 'smooth',
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [project?.id])

  if (!project) return null

  const titleId = `project-spotlight-title-${project.id}`
  const LinkIcon = project.linkLabel.includes('GitHub') ? Github : ExternalLink

  return (
    <article
      key={project.id}
      id="project-spotlight"
      className="project-spotlight"
      ref={cardRef}
      aria-labelledby={titleId}
    >
      <Paperclip className="spotlight-paperclip" size={48} strokeWidth={1.4} aria-hidden="true" />

      <div className="spotlight-toolbar">
        <button type="button" className="spotlight-back" onClick={onClose}>
          <ArrowLeft size={17} aria-hidden="true" />
          Back to the cards
        </button>
      </div>

      <div className="spotlight-layout">
        <figure className="spotlight-visual">
          <ProjectArt project={project} />
          <figcaption>
            <p className="spotlight-category">{project.category}</p>
            <p className="spotlight-disciplines">{project.disciplines.join(' · ')}</p>
            <p className="spotlight-illustration-note">
              Illustrative interface study. The linked project has the implementation or prototype.
            </p>
          </figcaption>
        </figure>

        <div className="spotlight-story">
          <h3 id={titleId} ref={titleRef} tabIndex={-1}>{project.name}</h3>
          <p className="spotlight-tagline">{project.short}</p>
          <div className="spotlight-description">
            <p>{project.description}</p>
            {project.detail && <p>{project.detail}</p>}
          </div>

          {project.contribution && (
            <div className="spotlight-facts">
              <h4>My contribution</h4>
              <p>{project.contribution}</p>
            </div>
          )}

          {project.tech?.length > 0 && (
            <div className="spotlight-facts">
              <h4>Built with</h4>
              <ul className="spotlight-tools" aria-label="Project technologies">
                {project.tech.map(tool => <li key={tool}>{tool}</li>)}
              </ul>
            </div>
          )}

          <a
            className="spotlight-project-link"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.linkLabel}: ${project.name} (opens in a new tab)`}
          >
            <LinkIcon size={18} aria-hidden="true" />
            <span>{project.linkLabel}</span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  )
}
