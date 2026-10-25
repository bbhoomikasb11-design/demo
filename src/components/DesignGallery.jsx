import { useEffect, useRef, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Coffee, Heart, Headphones, Home, Leaf, Maximize2, MoreHorizontal, Pause, Play, Plus, ScanLine, Search, ShoppingBag, SlidersHorizontal, X, ZoomIn, ZoomOut } from 'lucide-react'
import './DesignGallery.css'

const asset = name => `/media/designs/${name}.jpg`
const categories = [['mobile-apps', 'Mobile Apps'], ['web-apps', 'Web Apps'], ['websites', 'Websites']]
const collections = {
  'mobile-apps': [
    { id: 'scan', name: 'SafeScan', kind: 'Mobile UI study', palette: ['#253e32', '#d6e6b9', '#f4f1e7'] },
    { id: 'roam', name: 'Roam', kind: 'Travel app concept', palette: ['#214e51', '#eb7e54', '#eee9df'] },
    { id: 'tempo', name: 'Tempo', kind: 'Music app concept', palette: ['#29241f', '#edab74', '#eee2cb'] },
  ],
  'web-apps': [
    { id: 'campus', name: 'CampusMesh', kind: 'Web UI study', palette: ['#344d37', '#dce2bb', '#fbfaf6'] },
    { id: 'split', name: 'SplitGrid', kind: 'Dashboard study', palette: ['#2e2942', '#b5a7e4', '#f0edf6'] },
    { id: 'clear', name: 'ClearHead', kind: 'Interface design', palette: ['#151613', '#8f9677', '#eeece6'] },
  ],
  websites: [
    { id: 'atelier', name: 'Atelier / 04', kind: 'Architecture concept', palette: ['#343a31', '#c2bdad', '#eeeae1'] },
    { id: 'sunday', name: 'Sunday', kind: 'Coffee house concept', palette: ['#592c23', '#e99e61', '#f4e5ca'] },
    { id: 'elsewhere', name: 'Elsewhere', kind: 'Travel editorial concept', palette: ['#214e51', '#dc6545', '#eae5d9'] },
  ],
}

function Phone({ children, className = '' }) {
  return <div className={`dg-phone ${className}`}><div className="dg-phone-status"><b>9:41</b><i/><span>••• ▰</span></div><div className="dg-phone-content">{children}</div><div className="dg-home-bar"/></div>
}
function PhoneNav({ labels = ['Home', 'Explore', 'Saved'], active = 0 }) {
  return <div className="dg-phone-nav">{[Home, Search, Heart].map((Icon, i) => <span className={active === i ? 'active' : ''} key={labels[i]}><Icon size={17}/>{labels[i]}</span>)}</div>
}
function ScanPhones() {
  return <>
    <Phone><div className="dg-app-brand"><ScanLine size={20}/>SafeScan<MoreHorizontal size={18}/></div><p className="dg-small-label">A LITTLE EVERYDAY CLARITY</p><h3>Good choices.<br/><em>Made simple.</em></h3><div className="dg-scan-product"><span>OAT & CO.</span><Leaf size={48}/><b>the daily<br/>oat drink</b><small>ORIGINAL · 1 LITRE</small></div><span className="dg-app-cta"><ScanLine size={16}/>Scan a barcode</span><div className="dg-mini-heading">Recently explored <ArrowRight size={14}/></div><div className="dg-ingredient-row"><span className="dg-food-mark"><Leaf/></span><span>Everyday oat drink<small>Ingredient overview</small></span><ChevronRight size={15}/></div><PhoneNav labels={['Home', 'Scan', 'Saved']}/></Phone>
    <Phone><div className="dg-app-brand"><ArrowLeft size={18}/><span>Ingredient details</span><Heart size={18}/></div><div className="dg-scan-product compact"><Leaf size={34}/><b>OAT & CO.</b></div><p className="dg-small-label">KNOW YOUR EVERYDAY</p><h3>What’s inside?</h3><p className="dg-app-copy">A closer look at the label.</p>{[['Oats', 'The main ingredient'], ['Water', 'Keeps it simple'], ['Sea salt', 'A little balance']].map(([name, note]) => <div className="dg-ingredient-row" key={name}><span className="dg-food-mark"><Leaf size={17}/></span><span>{name}<small>{note}</small></span><Plus size={15}/></div>)}<PhoneNav labels={['Home', 'Scan', 'Saved']} active={1}/></Phone>
    <Phone><div className="dg-app-brand"><ScanLine size={20}/>SafeScan<MoreHorizontal size={18}/></div><p className="dg-small-label">YOUR LITTLE COLLECTION</p><h3>Saved for<br/><em>another day.</em></h3><div className="dg-choice-chips"><span className="active">All items</span><span>Drinks</span><span>Pantry</span></div>{['Oat drink', 'Rolled oats', 'Almond butter', 'Dark chocolate'].map((t, i) => <div className="dg-saved-row" key={t}><span className={`dg-food-tile food-${i}`}><ShoppingBag size={27}/></span><span><b>{t}</b><small>Saved to your collection</small></span><Heart size={16}/></div>)}<PhoneNav labels={['Home', 'Scan', 'Saved']} active={2}/></Phone>
  </>
}
function RoamPhones() {
  return <>
    <Phone><div className="dg-app-brand">roam<MoreHorizontal size={20}/></div><p className="dg-small-label">TAKE THE SCENIC ROUTE</p><h3>Away is<br/><em>a good place.</em></h3><div className="dg-search"><Search size={15}/>Where to next?</div><div className="dg-choice-chips"><span className="active">Mountains</span><span>Coast</span><span>City</span></div><div className="dg-trip-photo"><img src={asset('landscape')} alt=""/><div><small>CANADA</small><h4>Moraine Lake</h4><span>Alpine air. A slower pace. <ArrowUpRight size={16}/></span></div></div><div className="dg-mini-heading">Find your kind of outside <ArrowRight size={14}/></div><PhoneNav/></Phone>
    <Phone className="dg-roam-cover"><div className="dg-app-brand"><ArrowLeft size={19}/><Heart size={19}/></div><div className="dg-destination"><span className="dg-small-label">THE CANADIAN ROCKIES</span><h3>Go where<br/>you feel small.</h3><p>Quiet water. Endless mountains.</p><div className="dg-trip-facts"><span>3 days<small>Slow travel</small></span><span>Alpine<small>A change of scene</small></span></div><span className="dg-app-cta">Make room for adventure<ArrowRight size={17}/></span></div></Phone>
    <Phone><div className="dg-app-brand"><ArrowLeft size={18}/>Your itinerary<MoreHorizontal size={18}/></div><h3>Less rushing.<br/><em>More roaming.</em></h3><div className="dg-day-tabs"><b>Day 01</b><span>Day 02</span><span>Day 03</span></div><img className="dg-itinerary-photo" src={asset('landscape')} alt=""/>{[['08:00', 'A lakeside morning', 'Take the path less hurried.'], ['11:30', 'A picnic, with a view', 'Stay a little longer.'], ['16:00', 'Chase the golden hour', 'One last look at the mountains.']].map(([time, title, note]) => <div className="dg-itinerary-row" key={time}><span>{time}</span><div><b>{title}</b><small>{note}</small></div></div>)}<PhoneNav active={2}/></Phone>
  </>
}
function TempoPhones() {
  return <>
    <Phone><div className="dg-app-brand">tempo<span className="dg-profile-dot">b.</span></div><p className="dg-small-label">TUNE INTO YOURSELF</p><h3>Your day.<br/><em>Your rhythm.</em></h3><div className="dg-album"><div className="dg-record"/><span>SOFT<br/>FOCUS</span><small>A LITTLE ROOM TO THINK.</small></div><div className="dg-mini-heading">Made for this moment<ArrowRight size={14}/></div>{['The long way home', 'Sunday, on repeat'].map((t, i) => <div className="dg-track" key={t}><span>{i + 1}</span><b>{t}<small>Tempo sessions</small></b><Play size={16}/></div>)}<PhoneNav labels={['Listen', 'Search', 'Library']}/></Phone>
    <Phone><div className="dg-app-brand"><ChevronLeft size={18}/><span>NOW PLAYING</span><MoreHorizontal size={19}/></div><div className="dg-album now-playing"><div className="dg-record"/><span>SOFT<br/>FOCUS</span></div><h3>A little room<br/>to think.</h3><p className="dg-app-copy">Tempo sessions · Soft focus</p><div className="dg-audio-line"><i/></div><div className="dg-audio-times"><span>1:24</span><span>3:48</span></div><div className="dg-player-controls"><Heart size={20}/><ChevronLeft/><span><Pause size={27}/></span><ChevronRight/><Plus size={20}/></div><div className="dg-queue-label">UP NEXT <span>The long way home</span></div></Phone>
    <Phone><div className="dg-app-brand">Your library<Plus size={20}/></div><h3>A soundtrack<br/><em>for everything.</em></h3><div className="dg-choice-chips"><span className="active">Playlists</span><span>Albums</span><span>Artists</span></div><div className="dg-album-grid">{['Soft focus', 'Golden hour', 'After hours', 'Slow mornings'].map((t, i) => <div key={t}><div className={`dg-album-mini album-${i}`}><Headphones size={36}/></div><b>{t}</b><small>Tempo collection</small></div>)}</div><PhoneNav labels={['Listen', 'Search', 'Library']} active={2}/></Phone>
  </>
}

function Window({ children, name, className = '' }) {
  return <div className={`dg-window ${className}`}><div className="dg-window-bar"><span><i/><i/><i/></span><small>{name}</small><MoreHorizontal size={16}/></div>{children}</div>
}
function CampusApp({ detail }) {
  return <Window name="CampusMesh · interface study"><div className="dg-campus-nav"><b>m<span>campusmesh.</span></b><span>Explore campus　 Saved finds　 My listings</span><span className="dg-profile-dot">B</span></div>{detail ? <div className="dg-campus-detail"><div className="dg-listing-image"><Headphones size={140} strokeWidth={1}/></div><div><span className="dg-small-label">ELECTRONICS / AUDIO</span><h3>A soundtrack for<br/>your study sessions.</h3><p>Over-ear headphones</p><strong>₹1,200</strong><div className="dg-listing-divider"/><span>Good condition · On campus</span><div className="dg-seller"><span className="dg-profile-dot">A</span><div><b>Listed by a student</b><small>Sample listing · UI study</small></div></div><span className="dg-app-cta">Start a conversation <ArrowUpRight size={18}/></span></div></div> : <div className="dg-campus-main"><div className="dg-market-heading"><div><span className="dg-small-label">YOUR CAMPUS. YOUR COMMUNITY.</span><h3>Find your next<br/><em>little essential.</em></h3></div><div className="dg-market-note">Less buying new.<br/>More passing it on.<ArrowUpRight size={33}/></div></div><div className="dg-search"><Search size={18}/>Search books, tech, and the little things...<SlidersHorizontal size={17}/></div><div className="dg-market-categories"><b>All finds</b><span>Books & notes</span><span>Electronics</span><span>Everyday essentials</span><span>Creative tools</span></div><div className="dg-market-items">{[[Headphones, 'Over-ear headphones', '₹1,200'], [Coffee, 'Your new favorite mug', '₹180'], [ShoppingBag, 'The everyday tote', '₹250']].map(([Icon, name, price], i) => <div key={name}><div className={`dg-market-object object-${i}`}><Icon size={90} strokeWidth={1.1}/><Heart size={16}/></div><b>{name}</b><span>{price}<small>Sample listing</small></span></div>)}</div></div>}</Window>
}
function SplitApp({ detail }) {
  return <Window name="SplitGrid · dashboard study"><div className="dg-split-shell"><aside><b className="dg-split-logo">splitgrid<span>↗</span></b><div className="dg-split-nav"><span className={!detail ? 'active' : ''}>Overview</span><span className={detail ? 'active' : ''}>Shared groups</span><span>Activity</span><span>Settlements</span></div><small>KEEP THE MEMORIES.<br/>SPLIT THE REST.</small><div className="dg-sample-user"><span>B</span>Sample workspace</div></aside><div className="dg-split-main"><div className="dg-dashboard-top"><span>YOUR SHARED SPACE</span><span>Search　 /　 <MoreHorizontal size={18}/></span></div><h3>{detail ? 'The weekend crew' : 'Good times. All squared up.'}</h3><p>{detail ? 'A little trip. Everything in one place.' : 'A little less maths. A lot more living.'}</p><div className="dg-balance-grid"><div><span>{detail ? 'Group spending' : 'Total shared'}</span><b>₹{detail ? '8,640' : '12,480'}<small>.00</small></b><small>Sample data</small></div><div><span>You’re owed</span><b>₹1,240<small>.00</small></b><small>Across your groups</small></div><div><span>You owe</span><b>₹480<small>.00</small></b><small>Keep it simple</small></div></div><div className="dg-split-bottom"><div className="dg-expenses"><div className="dg-mini-heading">{detail ? 'Group expenses' : 'Recent activity'}<Plus size={17}/></div>{[['Weekend stay', 'The weekend crew', '₹4,800'], ['Dinner together', 'Friday people', '₹1,920'], ['Coffee run', 'Roommates', '₹420'], ['Train tickets', 'The weekend crew', '₹2,400']].map(([t,g,p],i)=><div className="dg-expense-row" key={t}><span className="dg-expense-icon">{i===2?<Coffee size={19}/>:<ShoppingBag size={19}/>}</span><span><b>{t}</b><small>{g}</small></span><strong>{p}</strong></div>)}</div><div className="dg-group-note"><span className="dg-avatar-row"><i>B</i><i>A</i><i>K</i></span><h4>Better<br/>together.</h4><p>One place for all<br/>your shared moments.</p><span className="dg-app-cta">Add an expense <Plus size={15}/></span></div></div></div></div></Window>
}
function ClearApp({ detail }) {
  return <Window name="ClearHead · original interface"><div className={`dg-clear-shot ${detail ? 'show-detail' : ''}`}><img src="/media/designs/clearhead.png" alt=""/></div></Window>
}
function Website({ id, detail }) {
  if(id==='atelier')return <Window name="Atelier / 04 · website concept"><div className="dg-atelier"><header><b>ATELIER<span>/04</span></b><span>Spaces　 Approach　 Journal</span><span>Let’s talk <ArrowUpRight size={15}/></span></header>{detail?<div className="dg-atelier-detail"><div><span className="dg-small-label">THE WAY WE SEE IT</span><h3>Less, but<br/><em>considered.</em></h3><p>Honest materials. Quiet details.<br/>Room for life to happen.</p><div className="dg-materials"><i/><i/><i/><i/></div><span>CONCRETE　 /　 OAK　 /　 LIGHT</span></div><img src={asset('architecture')} alt=""/></div>:<><div className="dg-atelier-heading"><h3>Spaces for<br/><em>being.</em></h3><p>Architecture that leaves<br/>room for the everyday.</p></div><img className="dg-architecture-image" src={asset('architecture')} alt=""/><div className="dg-architecture-caption"><span>A quiet dialogue between space and light.</span><span>RESIDENTIAL / STUDY 01 <ArrowUpRight size={15}/></span></div></>}</div></Window>
  if(id==='sunday')return <Window name="Sunday · website concept"><div className="dg-sunday"><header><b>sunday<span>coffee & little rituals</span></b><span>The coffee　 Our corner　 Visit us</span><span>Find your ritual <ArrowUpRight size={16}/></span></header>{detail?<div className="dg-coffee-menu"><h3>A cup for<br/><em>every kind of day.</em></h3><div className="dg-coffee-menu-grid">{[['01','Slow morning','Flat white'],['02','A little lift','Espresso'],['03','Stay a while','Filter coffee']].map(([n,t,d])=><div key={n}><small>{n}</small><Coffee size={55} strokeWidth={1}/><h4>{t}</h4><p>{d}</p></div>)}</div><div className="dg-sunday-strip">GOOD COFFEE. GOOD COMPANY. NO HURRY.</div></div>:<div className="dg-sunday-hero"><div><span className="dg-small-label">A LITTLE PAUSE, EVERY DAY.</span><h3>Take it<br/><em>slow.</em></h3><p>Good coffee. Warm corners.<br/>Nowhere else you need to be.</p><span className="dg-coffee-cta">Meet your morning <ArrowUpRight size={18}/></span></div><img src={asset('coffee')} alt=""/><span className="dg-coffee-seal">Brewed<br/><em>with care.</em></span></div>}</div></Window>
  return <Window name="Elsewhere · editorial website concept"><div className="dg-elsewhere"><header><b>elsewhere.</b><span>Places　 Stories　 Field notes</span><span>Go somewhere <ArrowUpRight size={16}/></span></header>{detail?<div className="dg-elsewhere-detail"><div><span className="dg-small-label">A FIELD NOTE FROM THE ROCKIES</span><h3>The art<br/>of getting<br/><em>a little lost.</em></h3><p>Some places ask you to slow down.<br/>This is one of them.</p><span className="dg-coffee-cta">Keep wandering <ArrowRight size={18}/></span></div><img src={asset('landscape')} alt=""/><span className="dg-vertical-word">WONDER IS A WAY OF SEEING.</span></div>:<div className="dg-elsewhere-hero"><img src={asset('landscape')} alt=""/><div><span>FOR THE WANDERERS, NOT THE HURRIED.</span><h3>Less ordinary.<br/><em>More out there.</em></h3><span className="dg-travel-cta">Find your elsewhere <ArrowUpRight size={17}/></span></div><small>THE CANADIAN ROCKIES　/　A FIELD NOTE</small></div>}</div></Window>
}

function Artwork({ item, view }) {
  const mobile = ['scan','roam','tempo'].includes(item.id)
  return <div className={`dg-artwork dg-art-${item.id} ${mobile && view ? 'dg-focused' : ''}`}>
    {mobile ? <><span className="dg-board-word">{item.name}<span>.</span></span><div className="dg-phone-spread">{item.id==='scan'?<ScanPhones/>:item.id==='roam'?<RoamPhones/>:<TempoPhones/>}</div></> : <div className="dg-browser-stage">{item.id==='campus'?<CampusApp detail={view}/>:item.id==='split'?<SplitApp detail={view}/>:item.id==='clear'?<ClearApp detail={view}/>:<Website id={item.id} detail={view}/>}</div>}
  </div>
}
function ScaledArtwork({ item, view, zoom = false }) {
  const root = useRef(null)
  useEffect(()=>{
    const observer=new ResizeObserver(([entry])=>root.current?.style.setProperty('--dg-scale',entry.contentRect.width/1000))
    observer.observe(root.current)
    return()=>observer.disconnect()
  },[])
  return <div ref={root} className={`dg-art-viewport ${zoom ? 'dg-zoomed' : ''}`}><div className="dg-art-scale" aria-hidden="true"><Artwork item={item} view={view}/></div></div>
}
function DesignBoard({ item, onOpen }) {
  const [view,setView]=useState(false)
  return <article className={`dg-board dg-board-${item.id}`} aria-label={item.name}>
    <button type="button" className="dg-open-art" onClick={()=>onOpen(item,view)} aria-label={`Enlarge ${item.name} design`}><ScaledArtwork item={item} view={view}/><span className="dg-enlarge-hint"><Maximize2 size={16}/>View design</span></button>
    <div className="dg-board-footer"><div><h2>{item.name}</h2><span>{item.kind}</span></div><div className="dg-board-actions"><span className="dg-palette" aria-hidden="true">{item.palette.map(color=><i key={color} style={{background:color}}/>)}</span><button type="button" aria-label={`Show ${view?'overview':'close-up'} of ${item.name}`} aria-pressed={view} onClick={()=>setView(v=>!v)}>{view?<ArrowLeft size={16}/>:<ArrowRight size={16}/>}<span>{view?'Overview':'Closer look'}</span></button></div></div>
  </article>
}

export default function DesignGallery() {
  const { category }=useParams()
  const selected=categories.some(([id])=>id===category)?category:'mobile-apps'
  const [opened,setOpened]=useState(null)
  const [view,setView]=useState(false)
  const [zoom,setZoom]=useState(false)
  const dialog=useRef(null)
  const opener=useRef(null)
  useEffect(()=>{document.title=`${categories.find(([id])=>id===selected)[1]} — Designs by Bhoomika S.`},[selected])
  function open(item,initialView){opener.current=document.activeElement;setOpened(item);setView(initialView);setZoom(false);dialog.current.showModal()}
  function close(){dialog.current.close();setOpened(null);opener.current?.focus({preventScroll:true})}
  return <div className="design-gallery">
    <header className="dg-gallery-header"><h1 className="sr-only">Designs by Bhoomika S.</h1><nav aria-label="Design categories" className="dg-category-nav">{categories.map(([id,label])=><NavLink key={id} to={`/designs/${id}`} className={selected===id?'selected':''} aria-current={selected===id?'page':undefined}>{label}</NavLink>)}</nav><span className="dg-gallery-signature">a little eye for detail.</span></header>
    <div className="dg-collection" key={selected}>{collections[selected].map(item=><DesignBoard key={item.id} item={item} onOpen={open}/>)}</div>
    <div className="dg-gallery-end"><span>Thoughtfully arranged. Made to explore.</span><span>Bhoomika S.</span></div>
    <dialog ref={dialog} className="dg-viewer" onCancel={event=>{event.preventDefault();close()}} aria-labelledby="dg-viewer-title" onClick={e=>{if(e.target===e.currentTarget)close()}}>
      {opened&&<><header><div><h2 id="dg-viewer-title">{opened.name}</h2><span>{opened.kind}</span></div><div className="dg-viewer-tools"><button type="button" onClick={()=>setView(v=>!v)} aria-pressed={view}>{view?'Overview':'Closer look'}<ArrowRight size={17}/></button><button type="button" aria-label={zoom?'Fit design to screen':'Zoom design for detail'} aria-pressed={zoom} onClick={()=>setZoom(v=>!v)}>{zoom?<ZoomOut size={19}/>:<ZoomIn size={19}/>}</button><button type="button" onClick={close} aria-label="Close design viewer" autoFocus><X size={22}/></button></div></header><div className="dg-viewer-scroll" tabIndex="0" aria-label="Design canvas; scroll to explore when zoomed"><ScaledArtwork item={opened} view={view} zoom={zoom}/></div></>}
    </dialog>
  </div>
}
