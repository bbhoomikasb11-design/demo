import { useRef, useState } from 'react'
import { Code2, MousePointer2, PencilRuler, Sparkles } from 'lucide-react'
import './PortraitCanvas.css'

const perspectives = [
  { id: 'design', label: 'Design', Icon: PencilRuler, note: 'A little curiosity. A lot of intention.', tag: 'Made of ideas.' },
  { id: 'code', label: 'Code', Icon: Code2, note: 'Turning the what-if into what’s next.', tag: 'Ideas → interfaces' },
  { id: 'ai', label: 'AI', Icon: Sparkles, note: 'Always learning. Always connecting dots.', tag: 'Curiosity, connected.' },
]

export default function PortraitCanvas() {
  const [selected, setSelected] = useState(0)
  const stage = useRef(null)
  const perspective = perspectives[selected]
  function move(event) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    stage.current.style.setProperty('--portrait-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 7}deg`)
    stage.current.style.setProperty('--portrait-y', `${-((event.clientY - bounds.top) / bounds.height - .5) * 7}deg`)
  }
  function reset() {
    stage.current.style.setProperty('--portrait-x', '0deg')
    stage.current.style.setProperty('--portrait-y', '0deg')
  }
  return <div className={`portrait-canvas portrait-${perspective.id}`}>
    <div className="portrait-stage" ref={stage} onPointerMove={move} onPointerLeave={reset}>
      <span className="portrait-paper" aria-hidden="true"/>
      <span className="portrait-margin-note" aria-hidden="true">the person behind the pixels</span>
      <figure className="portrait-photo">
        <div className="portrait-image-wrap">
          <img src="/media/bhoomika-portrait.jpg" alt="Bhoomika S. in a black blazer, standing in sunlight." width="576" height="768" fetchPriority="high" decoding="async"/>
          <span className="portrait-selection" aria-hidden="true"><i/><i/><i/><i/></span>
        </div>
        <figcaption><span>Bhoomika S.</span><span className="portrait-signoff">designer. developer. curious human.</span></figcaption>
      </figure>
      <span className="portrait-sticker" aria-hidden="true"><perspective.Icon size={15}/>{perspective.tag}</span>
      <span className="portrait-cursor" aria-hidden="true"><MousePointer2 size={21} fill="currentColor"/><span>me, in my element</span></span>
      <span className="portrait-code-bracket bracket-left" aria-hidden="true">{'{'}</span><span className="portrait-code-bracket bracket-right" aria-hidden="true">{'}'}</span>
      <div className="portrait-connections" aria-hidden="true"><span>design</span><span>code</span><span>ideas</span></div>
    </div>
    <div className="portrait-controls" role="group" aria-label="Change portrait perspective">
      {perspectives.map(({ id, label, Icon }, index) => <button type="button" key={id} aria-pressed={selected === index} onClick={() => setSelected(index)}><Icon size={14} aria-hidden="true"/>{label}</button>)}
    </div>
    <p className="portrait-note" aria-live="polite">{perspective.note}</p>
  </div>
}
