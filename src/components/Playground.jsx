import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, CheckCheck, MousePointer2, RotateCcw, Sparkles, Type, Plus, Minus } from 'lucide-react'

export default function Playground({compact = false}) {
  const [saved, setSaved] = useState(false)
  const [size, setSize] = useState(32)
  const [playing, setPlaying] = useState(false)
  const [replay, setReplay] = useState(0)
  const timer = useRef()
  useEffect(()=>()=>clearTimeout(timer.current),[])
  function play() {
    clearTimeout(timer.current)
    setReplay(n=>n+1)
    setPlaying(true)
    timer.current=setTimeout(()=>setPlaying(false),1800)
  }
  return <div className={`playground-grid ${compact?'playground-compact':''}`}>
    <article className="experiment save-experiment">
      <div className="experiment-stage"><span className="experiment-detail">A LITTLE FEEDBACK GOES A LONG WAY</span><button className={`save-demo ${saved?'is-saved':''}`} onClick={()=>setSaved(v=>!v)} aria-pressed={saved}>{saved?<CheckCheck size={19}/>:<Plus size={19}/>}<span>{saved?'Saved to collection':'Save something good'}</span></button><span className="experiment-status" aria-live="polite">{saved?'That little moment of “done”.':'Go on. Give it a click.'}</span></div>
      <div className="experiment-caption"><div><h3>A satisfying little button</h3><p>Interaction design · State transitions</p></div><MousePointer2 size={17}/></div>
    </article>
    <article className="experiment type-experiment">
      <div className="experiment-stage"><div className="type-toolbar"><Type size={15}/><span>Manrope</span><span className="type-control"><button aria-label="Decrease type size" disabled={size<=24} onClick={()=>setSize(s=>Math.max(24,s-4))}><Minus size={12}/></button><output>{size}px</output><button aria-label="Increase type size" disabled={size>=48} onClick={()=>setSize(s=>Math.min(48,s+4))}><Plus size={12}/></button></span></div><div className="type-sample" style={{'--type-size':`${size}px`}}>Make room<br/>for <em>curiosity.</em></div><label className="type-slider"><span className="sr-only">Type size</span><input aria-label="Type size" type="range" min="24" max="48" step="4" value={size} onChange={e=>setSize(Number(e.target.value))}/></label></div>
      <div className="experiment-caption"><div><h3>Type with a little personality</h3><p>Typography · Interactive exploration</p></div><Type size={18}/></div>
    </article>
    <article className="experiment motion-experiment">
      <div className="experiment-stage"><div key={replay} className={`motion-tiles ${playing?'is-playing':''}`} aria-hidden="true"><span><MousePointer2/></span><span><Sparkles/></span><span><Check/></span></div><button className="motion-play" onClick={play}><RotateCcw size={13}/>{playing?'Replay motion':'Play the little moment'}</button></div>
      <div className="experiment-caption"><div><h3>Everything, in its own time</h3><p>Motion study · A softer entrance</p></div><ArrowRight size={18}/></div>
    </article>
  </div>
}
