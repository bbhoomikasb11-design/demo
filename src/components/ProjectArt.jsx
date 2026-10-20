import { ArrowUpRight, ArrowRight, Search, Heart, ShoppingBag, BookOpen, Headphones, Camera, SlidersHorizontal, Sparkles, Check, Plus, MoreHorizontal, ScanLine, Leaf, Activity, MapPin, Send, ShieldCheck, CornerDownRight, CircleDollarSign, Monitor, Laptop } from 'lucide-react'

function BrowserBar({name}) {
  return <div className="mock-browser-bar"><span className="window-dots"><i/><i/><i/></span><span>{name}</span><MoreHorizontal size={12}/></div>
}

function CampusPreview() {
  return <div className="mock-browser campus-browser">
    <BrowserBar name="campusmesh.app"/>
    <div className="mock-inner">
      <div className="mock-nav"><b><span className="mini-logo">m</span> campusmesh<span className="mini-period">.</span></b><span>Explore <Heart size={12}/><span className="mock-avatar">B</span></span></div>
      <div className="campus-head"><div><span className="mini-label">YOUR CAMPUS. YOUR COMMUNITY.</span><h3>Good finds.<br/>Closer to home.</h3><p>Buy, sell, and share within your campus.</p></div><div className="campus-symbol"><ShoppingBag/><span className="symbol-plus"><Plus/></span></div></div>
      <div className="mock-search"><Search size={13}/><span>Find something you need...</span><SlidersHorizontal size={13}/></div>
      <div className="mock-chips"><span className="chosen">All finds</span><span>Books</span><span>Electronics</span><span>Essentials</span></div>
      <div className="mini-products">{[[BookOpen,'Books','Pass on a good read'],[Headphones,'Electronics','Find your next favorite'],[Camera,'Equipment','Make something new']].map(([Icon,title,label],i)=><div className="mini-product" key={title}><div className={`mini-product-image product-${i}`}><Icon strokeWidth={1.3}/><span><Heart size={10}/></span></div><b>{title}</b><small>{label}</small></div>)}</div>
    </div>
  </div>
}

function ClearPreview() {
  return <div className="mock-browser clear-browser"><BrowserBar name="clearhead"/><div className="clear-inner"><div className="clear-symbol"><Sparkles strokeWidth={1}/></div><h3>ClearHead</h3><p>dump your thoughts. find your clarity.</p><div className="journal"><span>TODAY’S THOUGHTS <span>Just for you</span></span><p>What’s going on in your head?<br/>A little space to let it out.</p><div className="journal-line"/><div className="journal-line short"/><div className="journal-action">Find my clarity <ArrowRight size={12}/></div></div><small>One thought at a time.</small></div></div>
}

function AdaptPreview() {
  return <div className="adapt-composition"><div className="adapt-type">A web that<br/><em>adapts to you.</em><span>Aa</span></div><div className="extension"><div className="extension-brand"><span>A</span><b>AdaptUI</b><MoreHorizontal size={15}/></div><div className="extension-ready"><div className="ready-orb"><Check size={20}/></div><b>Ready when you are</b><small>A more comfortable web starts here.</small></div><div className="extension-profiles">{['Dyslexia-friendly','Low vision','Color-blind safe','Keyboard navigation'].map((s,i)=><div key={s}><span>{s}</span><span className={`mini-toggle ${i===0?'on':''}`}><i/></span></div>)}</div><div className="extension-scan"><ScanLine size={12}/> Scan this page</div></div></div>
}

function SplitPreview() {
  return <div className="split-composition"><div className="split-background-type">Good times.<br/>All squared up.</div><div className="phone split-phone"><div className="phone-top"><span>9:41</span><i/><span>•••</span></div><div className="phone-content"><div className="phone-brand"><CircleDollarSign size={17}/> splitgrid <Plus size={16}/></div><div className="split-title"><span>SAMPLE GROUP</span><h3>The weekend crew</h3><div className="avatar-stack"><i>A</i><i>B</i><i>K</i><i>+1</i></div></div><div className="balance"><span>All settled up</span><b>₹0<span>.00</span></b><small><Check size={10}/> That’s a good feeling.</small></div><div className="split-activity"><b>Recent activity</b><div><span className="activity-icon"><ShoppingBag size={15}/></span><span>Groceries<small>Shared with the group</small></span><Check size={13}/></div><div><span className="activity-icon"><Heart size={15}/></span><span>Weekend plans<small>Everyone’s included</small></span><Check size={13}/></div></div><div className="add-expense"><Plus size={13}/> Add an expense</div></div></div></div>
}

function ScanPreview() {
  return <div className="scan-composition"><div className="scan-label"><ScanLine size={26}/><h3>SafeScan</h3><p>A little clarity.<br/>In every ingredient.</p></div><div className="phone scan-phone"><div className="phone-top"><span>9:41</span><i/><span>•••</span></div><div className="phone-content"><div className="phone-brand">Scan. Understand. <ScanLine size={17}/></div><div className="scan-frame"><div className="product-bottle"><Leaf size={23}/><b>everyday</b><span>OAT DRINK</span><div className="barcode">||||| || ||| ||||||</div></div></div><div className="scan-result"><div><Leaf size={17}/><b>What’s inside?</b></div><p>Ingredients, made easy to read.</p><div className="ingredient-chips"><span>Oats</span><span>Water</span><span>Sea salt</span></div><small>Illustrative product · Design concept</small></div></div></div></div>
}

function MediPreview() {
  return <div className="mock-browser medi-browser"><BrowserBar name="medimatch · prototype"/><div className="mock-inner"><div className="mock-nav"><b><Activity size={18}/> MediMatch</b><span>Care network <span className="mock-avatar">M</span></span></div><div className="medi-heading"><span className="mini-label">CARE, CONNECTED.</span><h3>The right care.<br/>When it matters.</h3></div><div className="medi-network"><div className="map-line line-one"/><div className="map-line line-two"/><div className="map-line line-three"/><span className="map-point point-one"><Plus size={17}/></span><span className="map-point point-two"><Plus size={17}/></span><span className="map-point point-three"><MapPin size={20}/></span><div className="map-card"><span><ShieldCheck size={20}/></span><div><b>Connecting patient to care</b><small>One connected healthcare network</small></div></div></div></div></div>
}

function StorePreview() {
  return <div className="mock-browser store-browser"><BrowserBar name="AI smart store"/><div className="mock-inner"><div className="mock-nav"><b><Sparkles size={17}/> smartstore</b><ShoppingBag size={15}/></div><div className="store-heading"><h3>Find your kind<br/>of perfect.</h3><p>A little help finding what you need.</p></div><div className="chat-bubble">Help me find a desk setup.<CornerDownRight size={13}/></div><div className="store-answer"><span><Sparkles size={14}/> A few things you might like</span><div className="store-products">{[[Laptop,'Work essentials'],[Headphones,'Find your focus'],[Monitor,'Room to create']].map(([Icon,t])=><div key={t}><Icon size={37} strokeWidth={1.2}/><span>{t}</span></div>)}</div></div><div className="mock-search"><span>Ask me anything...</span><Send size={14}/></div></div></div>
}

const previews = {campus:CampusPreview, clarity:ClearPreview, adapt:AdaptPreview, split:SplitPreview, scan:ScanPreview, medi:MediPreview, store:StorePreview}

export default function ProjectArt({project, className = ''}) {
  const Preview = previews[project.theme]
  return <div className={`project-art art-${project.theme} ${className}`} role="img" aria-label={`Illustrative interface preview for ${project.name}`}><div className="art-inner" aria-hidden="true"><Preview/></div><span className="art-caption" aria-hidden="true">{project.name} <ArrowUpRight size={12}/></span></div>
}

export function HeroArtwork() {
  return <div className="hero-art-composition" aria-hidden="true"><div className="hero-art-word">Thoughtfully made.</div><div className="hero-mini hero-mini-clear"><ClearPreview/></div><div className="hero-mini hero-mini-campus"><CampusPreview/></div><div className="hero-mini hero-mini-adapt"><div className="tiny-adapt"><span className="tiny-a">Aa</span><b>Made for everyone.</b><span>Accessible by design</span><div><i/><i/><i/></div></div></div><div className="floating-note note-design"><span className="note-dot"/> Designed with intention</div><div className="floating-note note-code"><Check size={12}/> Built with purpose</div></div>
}
