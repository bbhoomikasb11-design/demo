import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Blocks, BriefcaseBusiness, Check, Code2, Copy, ExternalLink, FileText, FolderOpen, GraduationCap, Home, Layers, Mail, MapPin, Menu, MousePointer2, PanelLeftClose, PanelLeftOpen, PencilRuler, Send, Sparkles, Trophy, UserRound, X } from 'lucide-react'
import { Github, Linkedin } from './components/BrandIcons.jsx'
import { links, projects, experience } from './data.js'
import ProjectArt from './components/ProjectArt.jsx'
import Playground from './components/Playground.jsx'
import ReelPlayer from './components/ReelPlayer.jsx'
import ProjectBoard from './components/ProjectBoard.jsx'
import TechStack from './components/TechStack.jsx'

const navItems = [
  {to:'/',label:'Home',Icon:Home},
  {to:'/projects',label:'Projects',Icon:FolderOpen},
  {to:'/playground',label:'Playground',Icon:Blocks},
  {to:'/skills',label:'My toolkit',Icon:Layers},
  {to:'/about',label:'About me',Icon:UserRound},
]

function External({href,children,className='',...props}) {
  const isMail = href.startsWith('mailto:')
  return <a href={href} className={className} {...(!isMail?{target:'_blank',rel:'noopener noreferrer'}:{})} {...props}>{children}</a>
}

function Brand({small=false}) {
  return <Link className={`brand ${small?'brand-small':''}`} to="/" aria-label="Bhoomika S. home"><span className="brand-mark" aria-hidden="true">b<span>.</span></span><span className="brand-name">bhoomika<span>.</span></span></Link>
}

function ButtonLink({to,href,children,primary=false,className='',...props}) {
  const cls=`button ${primary?'button-primary':''} ${className}`
  return href?<External href={href} className={cls} {...props}>{children}</External>:<Link to={to} className={cls} {...props}>{children}</Link>
}

function SectionTitle({label,children,description,Icon=Sparkles,level=2}) {
  const Heading=level===1?'h1':'h2'
  return <header className="section-heading"><span className="section-label"><Icon size={15}/>{label}</span><Heading>{children}</Heading>{description&&<p>{description}</p>}</header>
}

function Sidebar({collapsed,setCollapsed,mobileOpen,setMobileOpen,isMobile}) {
  const aside = useRef()
  useEffect(()=>{
    if(!mobileOpen||!isMobile)return
    const el=aside.current
    const focusable=()=>[...el.querySelectorAll('a,button')].filter(e=>!e.disabled)
    focusable()[0]?.focus()
    function handle(e) {
      if(e.key==='Escape')setMobileOpen(false)
      if(e.key==='Tab'){
        const items=focusable(),first=items[0],last=items.at(-1)
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
      }
    }
    el.addEventListener('keydown',handle)
    return ()=>el.removeEventListener('keydown',handle)
  },[mobileOpen,isMobile,setMobileOpen])
  return <>
    {mobileOpen&&<div className="menu-backdrop" onClick={()=>setMobileOpen(false)} aria-hidden="true"/>}
    <aside ref={aside} className={`sidebar ${mobileOpen?'mobile-open':''}`} id="site-navigation" inert={isMobile&&!mobileOpen?true:undefined} aria-label="Site navigation" {...(isMobile&&mobileOpen?{role:'dialog','aria-modal':true}:{})}>
      <div className="sidebar-top"><Brand/><button className="sidebar-toggle icon-button" aria-label={isMobile?'Close menu':collapsed?'Expand sidebar':'Collapse sidebar'} onClick={()=>isMobile?setMobileOpen(false):setCollapsed(v=>!v)}>{isMobile?<X size={20}/>:collapsed?<PanelLeftOpen size={18}/>:<PanelLeftClose size={18}/>}</button></div>
      <nav className="main-navigation" aria-label="Main navigation">{navItems.map(({to,label,Icon})=><NavLink end={to==='/'} to={to} key={to} title={collapsed?label:undefined} onClick={()=>setMobileOpen(false)} className={({isActive})=>`nav-link ${isActive?'active':''}`}><Icon size={19} strokeWidth={1.8}/><span className="nav-label">{label}</span><ArrowRight className="nav-arrow" size={17}/></NavLink>)}</nav>
      <div className="sidebar-connect"><span className="sidebar-caption">SOMETHING IN MIND?</span><Link to="/contact" className="sidebar-contact" title="Let's connect" onClick={()=>setMobileOpen(false)}><span className="contact-spark"><Sparkles size={18}/></span><span className="nav-label">Let’s connect</span><ArrowUpRight size={15} className="nav-arrow"/></Link><External href={links.resume} className="sidebar-resume" title="View resume"><FileText size={18}/><span className="nav-label">View resume</span><ArrowUpRight size={14} className="nav-arrow"/></External></div>
      <div className="sidebar-bottom"><div className="availability"><span/>Open to opportunities</div><div className="sidebar-location"><MapPin size={13}/> Bengaluru, India</div><div className="sidebar-socials"><External href={links.github} aria-label="GitHub" title="GitHub"><Github size={18}/></External><External href={links.linkedin} aria-label="LinkedIn" title="LinkedIn"><Linkedin size={18}/></External><External href={links.email} aria-label="Email Bhoomika" title="Email"><Mail size={18}/></External><span className="sidebar-year">© 2026</span></div></div>
    </aside>
  </>
}

function Hero() {
  return <>
    <section className="hero narrow" aria-labelledby="hero-title">
      <div className="hero-availability"><span className="status-dot"/>OPEN TO INTERNSHIPS & FULL-TIME OPPORTUNITIES</div>
      <p className="hero-intro">Hi, I’m <strong>Bhoomika S.</strong><span className="hello-line"/></p>
      <h1 id="hero-title">Curiosity in <span className="muted-word">design.</span><br/>Purpose in <span className="inline-code" aria-hidden="true"><Code2/></span> code.</h1>
      <p className="hero-roles">Full-Stack Developer <i/> Product Designer <i/> AI Builder</p>
      <p className="hero-description">I design thoughtful digital experiences and build useful products by combining product design, frontend and backend development, and AI integration.</p>
      <div className="button-row"><ButtonLink to="/contact" primary><Sparkles size={17}/>Let’s connect<ArrowUpRight size={16}/></ButtonLink><ButtonLink to="/projects"><FolderOpen size={18}/>Explore projects</ButtonLink></div>
      <span className="hero-location"><MapPin size={13}/>Based in Bengaluru, India</span>
    </section>
    <ReelPlayer/>
    <div className="under-showcase wide"><span>Made with intention. Built to be useful.</span><a href="#selected-work" className="text-link">Take a look around <ArrowDown size={13}/></a></div>
  </>
}

function WorkFeature() {
  return <section className="section-block" id="selected-work">
    <div className="narrow"><SectionTitle label="SELECTED WORK" Icon={FolderOpen}>Ideas out of my head.<br/><span className="muted-word">And into the world.</span></SectionTitle><p className="section-copy">A few things I’ve designed, developed, and learned from. Different problems. Different possibilities. The same attention to detail.</p></div>
    <ProjectBoard/>
    <div className="work-categories narrow">{[[PencilRuler,'Product design','Design'],[Code2,'Full-stack development','Full-stack'],[Sparkles,'AI applications','AI']].map(([Icon,label,filter])=><Link key={label} to={`/projects?filter=${encodeURIComponent(filter)}`}><span><Icon strokeWidth={1.4}/></span>{label}</Link>)}</div><div className="center-action"><ButtonLink to="/projects"><FolderOpen size={17}/>See all seven projects<ArrowRight size={16}/></ButtonLink></div>
  </section>
}

function SkillsSection({page=false}) {
  return <section className={`section-block ${page?'page-section':''}`} id="skills"><div className="narrow"><SectionTitle label="MY TECH STACK" Icon={Layers} level={page?1:2}>From the first sketch<br/>to the <span className="highlight-word">last commit.</span></SectionTitle><p className="section-copy">The tools behind the things I make. Explore the stack I use to connect design, development, and intelligent applications.</p></div><TechStack/></section>
}

function ExperienceSection({page=false}) {
  return <section className={`section-block ${page?'page-section':''}`} id="experience"><div className="narrow"><SectionTitle label="EXPERIENCE" Icon={BriefcaseBusiness} level={page?1:2}>Learning by doing.<br/><span className="muted-word">Building with people.</span></SectionTitle></div><div className="experience-list wide">{experience.map(exp=><article className="experience-card" key={exp.company}><div className={`company-mark mark-${exp.color}`} aria-hidden="true">{exp.mark}<span>.</span></div><div className="experience-content"><h3>{exp.company}</h3><p className="experience-role">{exp.role}</p><p className="experience-description">{exp.description}</p><div className="experience-focus">{exp.focus.map(f=><span key={f}>{f}</span>)}</div></div></article>)}</div></section>
}

function EducationAchievements() {
  return <>
    <section className="section-block education-section" id="education"><div className="narrow"><SectionTitle label="EDUCATION" Icon={GraduationCap}>A foundation in curiosity.<br/><span className="muted-word">And a little data science.</span></SectionTitle><article className="education-card"><div className="education-icon"><GraduationCap size={30} strokeWidth={1.5}/></div><div><h3>Don Bosco Institute of Technology</h3><p>Bachelor of Engineering<br/>Artificial Intelligence & Data Science</p><span><MapPin size={12}/>Bengaluru</span></div><div className="cgpa"><strong>9.0<span>/10</span></strong><span>CGPA</span></div></article></div></section>
    <section className="section-block achievements-section" id="achievements"><div className="narrow"><SectionTitle label="A FEW MILESTONES" Icon={Trophy}>Showing up.<br/><span className="muted-word">And giving it a go.</span></SectionTitle></div><div className="achievements wide"><article className="achievement-row"><span className="achievement-symbol"><Trophy size={23}/></span><div><span className="achievement-note">ROUND 1 SELECTION</span><h3>SEBI Securities Market TechSprint</h3><p>Participation and selection for Round 1 of the SEBI Securities Market TechSprint.</p></div><External href="https://hackculture.io/hackathons/sebi-securities-market-techsprint" className="icon-button raised-button" aria-label="View SEBI TechSprint event"><ArrowUpRight size={18}/></External></article><article className="achievement-row"><span className="achievement-symbol"><Code2 size={23}/></span><div><span className="achievement-note">24-HOUR HACKATHON · TEAM BAREMETAL</span><h3>Code Carnage 2.0</h3><p>Participated in a 24-hour offline hackathon at SJB Institute of Technology. Contributed to a disaster management and volunteer platform connecting disaster-response needs with volunteers.</p></div><External href="https://github.com/Prajwal-17/disaster-volunteer-platform" className="icon-button raised-button" aria-label="View Team BareMetal hackathon project on GitHub"><ArrowUpRight size={18}/></External></article><div className="achievement-small-row"><article><span className="award-mark">1<sup>st</sup></span><div><h3>A voice worth finding.</h3><p>First place in a debate competition<br/>at Gousia College.</p></div></article><article><span className="award-mark">3<span>×</span></span><div><h3>Ideas worth sharing.</h3><p>Won three poster<br/>presentation competitions.</p></div></article></div></div></section>
  </>
}

function AboutSection({page=false}) {
  return <section className={`section-block about-section ${page?'page-section':''}`} id="about"><div className="narrow"><SectionTitle label="A LITTLE ABOUT ME" Icon={UserRound} level={page?1:2}>Designer’s curiosity.<br/><span className="muted-word">Developer’s mindset.</span></SectionTitle><div className="about-intro"><span className="about-monogram" aria-hidden="true">b<span>.</span></span><p>Hi, I’m Bhoomika.<br/><span>I like making things make sense.</span></p></div><div className="about-prose"><p>I’m Bhoomika, a final-year Artificial Intelligence & Data Science engineering student from Bengaluru. I enjoy working at the intersection of design and technology—understanding user problems, designing intuitive interfaces, and turning ideas into working digital products.</p><p>My interests span product design, full-stack web development, and AI-powered applications. I like exploring ideas, experimenting with interfaces, and building projects that combine usability with practical engineering.</p><p>I’m continuously learning, building, and <span className="highlight-word">refining my craft.</span></p></div><div className="about-signoff"><span>Bhoomika S.</span><small>Always a work in progress.</small></div></div></section>
}

function ContactSection({page=false}) {
  const Heading=page?'h1':'h2'
  const [copyState,setCopyState]=useState('idle')
  const timer=useRef()
  useEffect(()=>()=>clearTimeout(timer.current),[])
  async function copyEmail() {
    try{await navigator.clipboard.writeText('bbhoomikasb11@gmail.com');setCopyState('copied')}
    catch{setCopyState('failed')}
    clearTimeout(timer.current);timer.current=setTimeout(()=>setCopyState('idle'),3000)
  }
  return <section className={`contact-section ${page?'contact-page':''}`} id="connect"><div className="narrow"><span className="section-label"><Send size={15}/>THE NEXT GOOD THING STARTS WITH HELLO</span><Heading>Have an idea<br/>worth <span className="contact-emphasis">building?</span></Heading><p>Let’s connect. I’m open to internships, full-time opportunities, and conversations about thoughtful digital products.</p><div className="button-row"><ButtonLink href={links.email} primary><Mail size={18}/>Say hello<ArrowUpRight size={16}/></ButtonLink><ButtonLink href={links.resume}><FileText size={17}/>View resume<ArrowUpRight size={15}/></ButtonLink></div><div className="email-copy"><a href={links.email}>bbhoomikasb11@gmail.com</a><button className="icon-button" onClick={copyEmail} aria-label="Copy email address">{copyState==='copied'?<Check size={15}/>:<Copy size={15}/>}</button><span className="copy-status" role="status">{copyState==='copied'?'Copied!':copyState==='failed'?'Select the email to copy it.':''}</span></div><div className="contact-links"><External href={links.github}>GitHub<ArrowUpRight size={13}/></External><External href={links.linkedin}>LinkedIn<ArrowUpRight size={13}/></External><span><MapPin size={12}/>Bengaluru, India</span></div></div><div className="contact-watermark" aria-hidden="true">let’s make it happen<span>.</span></div></section>
}

function Footer() {
  return <footer className="site-footer"><span>© 2026 Bhoomika S.</span><span>Designed and built with curiosity.</span><button className="back-to-top" onClick={()=>document.getElementById('main-content')?.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}>Back to top <ArrowUpRight size={13}/></button></footer>
}

function HomePage() {
  return <><Hero/><section className="intro-story section-block narrow"><p className="story-lead">The best part of an idea?<br/><span className="muted-word">Turning it into something real.</span></p><p>Sometimes that starts with a wireframe.<br/>Sometimes, a line of code. Or a little <span className="inline-spark"><Sparkles size={18}/></span> “what if?”</p><p>I enjoy connecting those dots—understanding the problem, shaping the experience, and building something that’s <span className="highlight-word">actually useful.</span></p><div className="craft-tokens"><span><PencilRuler size={18}/>Think it through.</span><ArrowRight size={15}/><span><Code2 size={19}/>Bring it to life.</span></div></section><WorkFeature/><SkillsSection/><ExperienceSection/><EducationAchievements/><AboutSection/><ContactSection/><Footer/></>
}

function ProjectsPage() {
  const location=useLocation()
  const startFilter=new URLSearchParams(location.search).get('filter')
  const [filter,setFilter]=useState(['All work','Design','Full-stack','AI'].includes(startFilter)?startFilter:'All work')
  useEffect(()=>{const v=new URLSearchParams(location.search).get('filter');setFilter(['Design','Full-stack','AI'].includes(v)?v:'All work')},[location.search])
  const filtered=projects.filter(p=>filter==='All work'||p.filters.includes(filter))
  return <><header className="project-gallery-heading wide"><h1>Selected work<span>.</span></h1><p>Thoughtfully designed. Purposefully built.</p></header><div className="project-filters wide" role="group" aria-label="Filter projects">{['All work','Design','Full-stack','AI'].map(f=><button key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)} className={filter===f?'selected':''}>{f}<span>{f==='All work'?projects.length:projects.filter(p=>p.filters.includes(f)).length}</span></button>)}</div><div className="project-grid wide" aria-live="polite">{filtered.map(project=><article className="project-card" key={project.id}><Link className="project-card-art" to={`/projects/${project.id}`} aria-label={`Explore ${project.name}`}><ProjectArt project={project}/><span className="project-open"><ArrowUpRight size={22}/></span></Link><div className="project-card-heading"><Link to={`/projects/${project.id}`}><h2>{project.name}</h2></Link><External href={project.url} aria-label={`${project.linkLabel}: ${project.name}`} className="icon-button"><ArrowUpRight size={18}/></External></div><p className="project-discipline">{project.category}</p><p className="project-summary">{project.description}</p><Link className="text-link" to={`/projects/${project.id}`}>Explore project <ArrowRight size={14}/></Link></article>)}</div><ContactSection/><Footer/></>
}

function ProjectPage() {
  const {projectId}=useParams()
  const project=projects.find(p=>p.id===projectId)
  if(!project)return <NotFound/>
  const next=projects[(projects.indexOf(project)+1)%projects.length]
  return <><header className="project-detail-heading narrow"><Link to="/projects" className="text-link back-link"><ArrowLeft size={15}/>All projects</Link><span className="section-label">{project.category}</span><h1>{project.name}</h1><p className="project-detail-tagline">{project.short}</p><div className="project-tags">{project.disciplines.map(d=><span key={d}>{d}</span>)}</div></header><div className="project-detail-art wide"><ProjectArt project={project}/></div><div className="project-detail-copy narrow"><h2>The idea</h2><p>{project.description}</p>{project.detail&&<p>{project.detail}</p>}{project.contribution&&<><h2>My contribution</h2><p>{project.contribution}</p></>}{project.tech&&<><h2>Built with</h2><div className="detail-tech">{project.tech.map(t=><span key={t}>{t}</span>)}</div></>}<div className="button-row"><ButtonLink href={project.url} primary>{project.linkLabel.includes('GitHub')?<Github size={18}/>:<ExternalLink size={18}/>} {project.linkLabel}<ArrowUpRight size={16}/></ButtonLink></div><p className="illustration-note">The visual above is an illustrative interface study. Explore the linked project for the implementation or prototype.</p></div><Link to={`/projects/${next.id}`} className="next-project wide"><span>UP NEXT<h2>{next.name}</h2></span><ArrowRight size={28}/></Link><Footer/></>
}

function PlaygroundPage() {
  return <><header className="page-heading narrow"><span className="section-label"><Blocks size={15}/>OFF THE CLOCK. ON THE CANVAS.</span><h1>A little space<br/>to <span className="muted-word">experiment.</span></h1><p>A compact collection of UI experiments, interactive components, motion studies, and design explorations. Just a few small things to play with.</p></header><div className="playground-page wide"><Playground/></div><div className="playground-note narrow"><MousePointer2 size={17}/><p>Try a button, play with type, or set a little motion in motion.<br/>Everything here moves at your pace.</p></div><ContactSection/><Footer/></>
}

function NotFound(){return <div className="not-found narrow"><span className="section-label">A LITTLE DETOUR</span><h1>This page wandered off.</h1><p>There’s plenty of good work back this way.</p><ButtonLink to="/" primary><ArrowLeft size={17}/>Back home</ButtonLink></div>}

function App() {
  const [collapsed,setCollapsed]=useState(false)
  const [mobileOpen,setMobileOpen]=useState(false)
  const [isMobile,setIsMobile]=useState(()=>window.matchMedia('(max-width: 760px)').matches)
  const location=useLocation()
  const main=useRef()
  const firstRender=useRef(true)
  useEffect(()=>{
    const media=window.matchMedia('(max-width: 760px)')
    const update=()=>{setIsMobile(media.matches);setMobileOpen(false)}
    media.addEventListener('change',update)
    return()=>media.removeEventListener('change',update)
  },[])
  useEffect(()=>{
    main.current?.scrollTo({top:0,behavior:'instant'})
    setMobileOpen(false)
    const project=projects.find(p=>location.pathname===`/projects/${p.id}`)
    const title=project?.name||{'/projects':'Selected work','/playground':'Playground','/skills':'My toolkit','/about':'About me','/experience':'Experience','/contact':'Let’s connect'}[location.pathname]
    document.title=title?`${title} — Bhoomika S.`:'Bhoomika S. — Designer & Developer'
    if(!firstRender.current)main.current?.focus({preventScroll:true})
    firstRender.current=false
  },[location.pathname])
  useEffect(()=>{
    const targets=main.current?.querySelectorAll('.section-heading,.intro-story,.experience-card,.education-card,.achievement-row')||[]
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}}),{root:main.current,threshold:0.12})
    targets.forEach(t=>observer.observe(t))
    return()=>observer.disconnect()
  },[location.pathname])
  function closeMenu(){setMobileOpen(false);requestAnimationFrame(()=>document.getElementById('mobile-menu-toggle')?.focus())}
  return <div className={`app-shell ${collapsed?'sidebar-collapsed':''}`}><a href="#main-content" className="skip-link" onClick={()=>main.current?.focus()}>Skip to content</a><header className="mobile-header"><Brand/><button id="mobile-menu-toggle" className="icon-button" aria-label={mobileOpen?'Close navigation':'Open navigation'} aria-expanded={mobileOpen} aria-controls="site-navigation" onClick={()=>setMobileOpen(v=>!v)}>{mobileOpen?<X size={24}/>:<Menu size={24}/>}</button></header><Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={v=>v===false?closeMenu():setMobileOpen(v)} isMobile={isMobile}/><main id="main-content" tabIndex="-1" ref={main} className="main-scroll" inert={isMobile&&mobileOpen?true:undefined}><div className={`page-sheet ${location.pathname==='/playground'?'playground-sheet':''}`}><Routes><Route path="/" element={<HomePage/>}/><Route path="/projects" element={<ProjectsPage/>}/><Route path="/projects/:projectId" element={<ProjectPage/>}/><Route path="/playground" element={<PlaygroundPage/>}/><Route path="/skills" element={<><SkillsSection page/><ContactSection/><Footer/></>}/><Route path="/about" element={<><AboutSection page/><ExperienceSection/><EducationAchievements/><ContactSection/><Footer/></>}/><Route path="/experience" element={<><ExperienceSection page/><EducationAchievements/><ContactSection/><Footer/></>}/><Route path="/contact" element={<><ContactSection page/><Footer/></>}/><Route path="*" element={<NotFound/>}/></Routes></div></main></div>
}

export default App
