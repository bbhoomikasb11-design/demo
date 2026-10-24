import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas'
import ffmpeg from 'ffmpeg-static'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Deterministic 3D projection, real UI textures, exact vector type and original music.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.join(ROOT, 'public/media')
const REVIEW = path.join(ROOT, '.impeccable/review/ideas-move')
const TEMP = path.join(os.tmpdir(), 'bhoomika-ideas-move')
const ASSETS = path.join(ROOT, 'scripts/reel/assets')
const W = 1920, H = 1080, FPS = 24, DURATION = 43
const cuts = [0, 3, 7, 10, 18, 21, 24, 27, 35, 43]
// Cream and sage sampled from the supplied H.264 reference; deep sage from its source.
const C = { paper: '#f3f4ed', sage: '#e2ebda', ink: '#234638', deep: '#244d3e', mid: '#81947a', yellow: '#e9dda0', line: '#c3cfb8' }
GlobalFonts.registerFromPath(path.join(ROOT, 'public/fonts/manrope-variable.ttf'), 'Manrope')
const images = {}
for (const name of ['campus-filters', 'campus-login', 'adaptui', 'clearhead', 'splitgrid', 'splitgrid-create', 'safescan']) {
  images[name] = await loadImage(path.join(ASSETS, name + (name === 'safescan' ? '.webp' : '.png')))
}
const code = (await fs.readFile(path.join(ASSETS, 'splitgrid-code.txt'), 'utf8')).trimEnd().split('\n')
const canvas = createCanvas(W, H), sceneCanvas = createCanvas(W, H), oldCanvas = createCanvas(W, H)
const ctx = canvas.getContext('2d')
const shutter = createCanvas(W,H), shutterCtx = shutter.getContext('2d')
let g = sceneCanvas.getContext('2d')
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const lerp = (a, b, t) => a + (b - a) * t
const ease = t => 1 - (1 - clamp(t)) ** 4
const prog = (t, start = 0, length = .5) => ease((t - start) / length)
const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t) }
function fill(color) { g.fillStyle = color; g.fillRect(0, 0, W, H) }
function box(x, y, w, h, color, radius = 0) { g.beginPath(); g.roundRect(x, y, w, h, radius); g.fillStyle = color; g.fill() }
function stroke(points, color = C.ink, width = 2, p = 1, closed = false) {
  g.beginPath(); g.moveTo(...points[0])
  for (let i = 1; i < points.length; i++) { const a = clamp(p * (points.length - 1) - i + 1); if (!a) break; g.lineTo(lerp(points[i - 1][0], points[i][0], a), lerp(points[i - 1][1], points[i][1], a)) }
  if (closed) g.closePath(); g.strokeStyle = color; g.lineWidth = width; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke()
}
function circle(x, y, radius, color) { g.beginPath(); g.arc(x, y, Math.max(.001, radius), 0, Math.PI * 2); g.fillStyle = color; g.fill() }
function transform(x, y, scale, rotation, draw) { g.save(); g.translate(x, y); g.rotate(rotation); g.scale(scale, scale); draw(); g.restore() }
function text(s, x, y, size = 50, color = C.ink, weight = 750, align = 'left', max = 1750) {
  g.save(); g.font = `${weight} ${size}px Manrope`; const ratio = Math.min(1, max / Math.max(1, g.measureText(s).width));
  g.font = `${weight} ${size * ratio}px Manrope`; g.textBaseline = 'middle'; g.textAlign = align; g.fillStyle = color; g.fillText(s, x, y); g.restore()
}
function reveal(s, x, y, size, t, color = C.ink, max = 1740, align = 'left') {
  const a = prog(t, 0, .45); g.save(); g.beginPath(); g.rect(0, y - size * .65, W, size * 1.35); g.clip(); text(s, x, y + (1 - a) * size * 1.4, size, color, 800, align, max); g.restore()
}
function cursor(x, y, color = C.yellow, scale = 1) {
  transform(x, y, scale, -.12, () => { g.beginPath(); g.moveTo(0, 0); g.lineTo(8, 42); g.lineTo(19, 30); g.lineTo(30, 49); g.lineTo(39, 44); g.lineTo(28, 25); g.lineTo(43, 22); g.closePath(); g.fillStyle = color; g.fill() })
}
function meta(label, dark = false) {
  text('BHOOMIKA S.', 80, 1010, 21, dark ? C.sage : C.deep, 650)
  text(label, 1840, 1010, 21, dark ? C.sage : C.deep, 500, 'right')
}
function grid(t, color = C.line, spacing = 160) {
  g.save(); g.globalAlpha = .5
  for (let x = 80; x < W; x += spacing) stroke([[x, 70], [x, lerp(70, 940, prog(t, (x % 320) / 1200, .65))]], color, 1)
  for (let y = 100; y < H - 120; y += spacing) stroke([[80, y], [lerp(80, 1840, prog(t, (y % 320) / 1200, .65)), y]], color, 1)
  g.restore()
}
function project([x, y, z], rx, ry, scale, cx, cy) {
  const xx = x * Math.cos(ry) + z * Math.sin(ry), zz = -x * Math.sin(ry) + z * Math.cos(ry)
  const yy = y * Math.cos(rx) - zz * Math.sin(rx), zzz = y * Math.sin(rx) + zz * Math.cos(rx)
  const p = 4 / (4 + zzz)
  return [cx + xx * scale * p, cy + yy * scale * p, zzz]
}
function cube(t, cx = 1420, cy = 540, scale = 190, wire = 0, unfold = 0) {
  const ry = -.6 + t * .36, rx = -.35 + Math.sin(t * .4) * .12
  const verts = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]
  const faces = [[0,1,2,3],[1,5,6,2],[5,4,7,6],[4,0,3,7],[4,5,1,0],[3,2,6,7]]
  const pts = verts.map(v => project(v, rx, ry, scale, cx, cy))
  const sorted = faces.map((f,i) => ({f,i,z:f.reduce((n,v) => n + pts[v][2],0)/4})).sort((a,b)=>b.z-a.z)
  if (wire < .98) { g.save(); g.globalAlpha = (1 - wire) * .16; g.filter = 'blur(22px)'; g.beginPath(); g.ellipse(cx, cy + scale * 1.55, scale * 1.1, scale * .19, 0, 0, Math.PI * 2); g.fillStyle = C.ink; g.fill(); g.restore() }
  for (const {f,i} of sorted) {
    const p = f.map(v => pts[v]); g.save()
    if (unfold) g.translate((i % 3 - 1) * unfold * 320, (Math.floor(i / 3) - .5) * unfold * 360)
    g.beginPath(); p.forEach(([x,y],j)=>j ? g.lineTo(x,y):g.moveTo(x,y));g.closePath()
    const shades = [C.deep, '#94a98c', '#b9cbb0', '#6e896e', C.sage, '#3d654c']
    if (wire < 1) {g.globalAlpha = 1 - wire;const grad=g.createLinearGradient(p[0][0],p[0][1],p[2][0],p[2][1]);grad.addColorStop(0,shades[i]);grad.addColorStop(1,i===4?C.paper:shades[(i+1)%6]);g.fillStyle=grad;g.fill()}
    g.globalAlpha=1;g.strokeStyle = wire > .5 ? C.deep : C.paper;g.lineWidth = wire > .5 ? 2.5 : 1.2;g.stroke()
    for(let n=1;n<3;n++){const a=n/3;stroke([[lerp(p[0][0],p[1][0],a),lerp(p[0][1],p[1][1],a)],[lerp(p[3][0],p[2][0],a),lerp(p[3][1],p[2][1],a)]],wire>.5?C.mid:C.paper,1);stroke([[lerp(p[0][0],p[3][0],a),lerp(p[0][1],p[3][1],a)],[lerp(p[1][0],p[2][0],a),lerp(p[1][1],p[2][1],a)]],wire>.5?C.mid:C.paper,1)}
    g.restore()
  }
}
// Genuine screenshot planes projected into 3D; no UI reconstruction or recoloring.
const textures = {}
function browserTexture(name) {
  if(textures[name])return textures[name]
  const im=images[name],c=createCanvas(im.width,im.height+44),q=c.getContext('2d');q.fillStyle=C.paper;q.fillRect(0,0,c.width,c.height)
  q.fillStyle=C.mid;for(let i=0;i<3;i++){q.beginPath();q.arc(21+i*18,22,4,0,Math.PI*2);q.fill()}
  q.font='500 14px Manrope';q.textAlign='center';q.fillStyle=C.deep;q.fillText(({ 'campus-filters':'CampusMesh','campus-login':'CampusMesh',adaptui:'AdaptUI',clearhead:'ClearHead',splitgrid:'SplitGrid','splitgrid-create':'SplitGrid',safescan:'SafeScan · design concept' })[name],c.width/2,27)
  q.drawImage(im,0,44);textures[name]=c;return c
}
function plane(name,x,y,width,ry=0,rz=0,rx=0) {
  const im=browserTexture(name),height=width*im.height/im.width
  // Orthographic 3D projection: a single image resample keeps text and edges clean.
  const ax=Math.cos(ry),by=Math.cos(rx),shear=Math.sin(ry)*Math.sin(rx)
  transform(x,y,1,rz,()=>{
    g.transform(ax,shear,0,by,0,0)
    g.save();g.shadowColor='#23463835';g.shadowBlur=30;g.shadowOffsetY=24
    box(-width/2,-height/2,width,height,C.paper);g.restore()
    g.drawImage(im,-width/2,-height/2,width,height)
  })
}
function crop(name,sx,sy,sw,sh,x,y,w,h) {g.drawImage(images[name],sx,sy,sw,sh,x,y,w,h)}
function opening(t) {
  fill(C.deep)
  if(t<.25){if(Math.floor(t*12)%2===0)box(950,495,10,90,C.paper);return}
  if(t<1.25){const a=prog(t,.25,.22),burst=prog(t,.93,.32);const word='IDEAS.';const size=310;g.font=`800 ${size}px Manrope`;const width=g.measureText(word).width
    transform(960,535,lerp(1.35,1,a),0,()=>{
      for(let i=0;i<6;i++){g.save();g.translate((i-2.5)*burst*70,Math.sin(i*2)*burst*170);g.rotate((i-2.5)*burst*.055);g.beginPath();g.rect(-width/2+i*width/6,-240,width/6+1,500);g.clip();text(word,0,0,size,C.paper,800,'center');g.restore()}
    })
    stroke([[370,740],[lerp(370,1550,prog(t,.55,.35)),740]],C.yellow,10)
  } else {
    const a=prog(t,1.25,.42),leave=prog(t,2.65,.35)
    for(let i=0;i<4;i++){g.save();g.translate((i%2?1:-1)*(1-a)*500,(i-1.5)*leave*260);g.beginPath();g.rect(0,320+i*100,W,101);g.clip();text('EVERYWHERE.',960,535,238,C.paper,800,'center',1780);g.restore()}
    if(t>1.7)cursor(lerp(230,1700,prog(t,1.7,.8)),735,C.yellow,.8)
    text('One idea. Endless possibilities.',100,900,33,C.sage,500)
  }
}
function sketch(t) {
  fill(C.paper);grid(t,C.line,180)
  const solid=prog(t,.65,.7),rush=prog(t,3.35,.65)
  cube(t*.8,lerp(1340,960,rush),lerp(535,540,rush),lerp(180,1300,rush),1-solid)
  reveal('MY BRAIN',100,270,120,t-.35,C.ink,1050)
  reveal("DOESN’T DO",100,420,120,t-.85,C.ink,1050)
  if(t>1.25){box(95,510,lerp(0,625,prog(t,1.25,.35)),154,C.yellow);reveal('STATIC.',110,584,143,t-1.3,C.ink,1000)}
  if(t>2) {stroke([[1030,750],[1180,750],[1270,665]],C.mid,2,prog(t,2,.4));text('A sketch is just the beginning.',100,845,33,C.deep,500)}
  if(t<.65){cursor(lerp(1110,1500,prog(t,0,.65)),lerp(400,720,prog(t,0,.65)),C.yellow,.8)}
}
function identity(t) {
  fill(C.sage);grid(t,C.mid,240)
  if(t<.6)cube(3.2,960,540,200,0,prog(t,0,.6))
  reveal('BHOOMIKA S.',95,395,200,t-.2,C.ink,1740)
  reveal('AI & DATA SCIENCE',105,610,62,t-.7,C.ink)
  reveal('DESIGN × CODE × IDEAS',105,720,42,t-1.1,C.ink)
  const p=prog(t,1.7,.55);cursor(lerp(1700,480,p),lerp(850,405,p),C.yellow,1.2)
  if(t>2.35){const r=prog(t,2.35,.65)*1500;circle(480,380,r,C.deep);circle(480,380,Math.max(0,r-30),C.paper)}
}
function campus(t) {
  fill(C.sage)
  if(t<2.5){reveal('CampusMesh',90,155,106,t,C.ink);reveal('Connecting students through a',95,280,40,t-.35,C.deep);reveal('smarter campus experience.',95,335,40,t-.5,C.deep)
    plane('campus-filters',1070,690,1500,lerp(.38,.02,prog(t,.3,1)),lerp(-.09,.015,prog(t,.3,1)),.08);if(t>1.4){const q=prog(t,1.4,.7);cursor(lerp(1720,610,q),lerp(920,705,q),C.yellow,.8)}
  }else if(t<4.5){const p=prog(t,2.5,.55);text('CampusMesh',90,130,70,C.ink);text('FIND. FILTER. CONNECT.',90,230,36,C.deep)
    transform(960,610,lerp(.88,1.1,p),-.025*(1-p),()=>plane('campus-filters',0,0,1670,0,0,0))
    stroke([[200,855],[lerp(200,1710,prog(t,3.1,.8)),855]],C.yellow,9)
  }else if(t<6.7){const p=prog(t,4.5,.6);text('CampusMesh',90,145,82,C.ink);text('A campus. A community.',95,245,35,C.deep)
    plane('campus-login',1160,610,1080,lerp(-.5,-.08,p),lerp(.08,0,p));plane('campus-filters',350,685,560,.1,-.08);if(t>5.4)cursor(lerp(1780,1300,prog(t,5.4,.7)),lerp(850,725,prog(t,5.4,.7)),C.yellow,.8)
  }else{const p=prog(t,6.7,.7);plane('campus-login',lerp(1160,2600,p),610,1080,-.08,0);plane('campus-filters',lerp(350,960,p),540,lerp(560,1550,p),0,0)
    stroke([[90,920],[1830*prog(t,6.85,.8),920]],C.yellow,10)
  }
  meta('CampusMesh · source interface')
}
function adapt(t) {
  fill(C.paper);reveal('AdaptUI',90,200,138,t,C.ink);reveal('A more adaptable web.',95,350,42,t-.35,C.deep)
  const assemble=prog(t,.2,.95)
  // Crop only existing profile rows, then return them to their source positions.
  if(t<1.5){for(let i=0;i<4;i++){const a=prog(t,.12+i*.15,.65);crop('adaptui',22,307+i*76,396,69,lerp(2100,1020,a)+(i%2?1:-1)*(1-assemble)*130,280+i*130,650,113)}
  }else{plane('adaptui',1280,540,440*lerp(1.05,1.02,prog(t,1.5,1.2)),0,lerp(.06,0,prog(t,1.5,.35)));stroke([[1520,340],[1540,340],[1540,640],[1520,640]],C.yellow,6,prog(t,1.7,.6))}
  if(t>1.1)text('Accessibility, with intention.',95,840,32,C.deep,500)
  meta('AdaptUI · original extension UI')
}
function clarity(t) {
  fill(C.sage)
  reveal('ClearHead',90,155,108,t,C.ink)
  const a=prog(t,0,.65)
  if(t<.65){for(let i=0;i<3;i++){g.save();g.translate((1-a)*(i%2?1900:-1900),0);g.beginPath();g.rect(0,270+i*230,W,232);g.clip();plane('clearhead',1180,620,1100,0,0);g.restore()}}
  else plane('clearhead',1180,620,1100+Math.sin((t-.65)*.6)*14,0,0)
  stroke([[90,248],[lerp(90,720,prog(t,.8,.7)),248]],C.deep,2)
  if(t>1.4)reveal('A little space',90,430,40,t-1.4,C.deep);if(t>1.6)reveal('for clarity.',90,490,40,t-1.6,C.deep)
  meta('ClearHead · source interface')
}
function split(t) {
  fill(C.paper);grid(t,C.line,240);reveal('SplitGrid',90,150,108,t,C.ink)
  const a=prog(t,0,.65)
  if(t<1.4){for(let i=0;i<4;i++){g.save();g.translate((1-a)*(i%2?500:-500),(1-a)*(i<2?-500:500));g.beginPath();g.rect(360+(i%2)*600,260+Math.floor(i/2)*325,602,327);g.clip();plane('splitgrid',960,585,1200,0,0);g.restore()}}
  else{plane('splitgrid',520,610,820,-.12,-.025);plane('splitgrid-create',1340,610,820,.12,.025)}
  stroke([[155,930],[960,930],[960,850],[1770,850]],C.yellow,7,prog(t,1.45,.8));meta('SplitGrid · source interfaces')
}
function codePanel(x,y,w,angle=0) {
  transform(x,y,w/900,angle,()=>{box(-450,-320,900,640,C.deep,12);text('SplitGrid / simplifyDebts',-410,-270,27,C.sage,600);g.save();g.font='22px monospace';g.fillStyle=C.paper;g.textBaseline='middle';code.slice(0,17).forEach((s,i)=>g.fillText(s,-410,-204+i*27));g.restore()})
}
function montage(t) {
  fill(t<2.5?C.deep:t<5?C.paper:C.sage)
  const stage=t<2.5?0:t<5?1:2,local=t-[0,2.5,5][stage]
  const word=['THINK.','DESIGN.','BUILD.'][stage],dark=stage===0
  if(local<.65){text(word,lerp(2050,960,prog(local,0,.35)),500,300,dark?C.paper:C.ink,800,'center');stroke([[190,750],[lerp(190,1730,prog(local,.18,.4)),750]],C.yellow,12);return}
  const p=prog(local,.65,.45),collapse=prog(t,7.4,.6),s=1-collapse*.98
  transform(960,540,s,collapse*.3,()=>{
    text(word,-850,-345,130,dark?C.paper:C.ink,800)
    if(stage===0){plane('campus-filters',lerp(-1500,-400,p),0,900,.12,-.065);plane('adaptui',440,lerp(1000,20,prog(local,.85,.55)),320,-.2,.06);cube(t,50,170,130)}
    if(stage===1){plane('safescan',-520,lerp(1000,110,p),640,.1,-.065);plane('clearhead',lerp(1600,300,prog(local,.85,.55)),70,1000,-.15,.05);text('SafeScan · product design concept',-840,450,24,C.deep,500)}
    if(stage===2){codePanel(lerp(-1600,-330,p),40,930,-.045);plane('splitgrid-create',450,lerp(-1000,40,prog(local,.85,.55)),740,.17,.05);plane('campus-filters',80,lerp(1000,370,prog(local,1.05,.55)),730,-.05,-.025)}
    // A framing rule travels with the idea across each composition.
    stroke([[-850,480],[-850+1700*p,480]],C.yellow,7)
  })
  if(t>7.4)circle(960,540,5+collapse*4,C.deep)
  meta('Design × code × ideas',dark)
}
function finale(t) {
  fill(C.deep)
  const emerge=prog(t,0,.7),settle=prog(t,1.2,1.2)
  cube(9+Math.min(t,6)*.45,lerp(960,1460,settle),lerp(540,480,settle),lerp(8,220,emerge),0)
  if(t>.9)reveal('I MAKE',90,330,175,t-.9,C.paper,1280)
  if(t>1.5)reveal('IDEAS',90,520,175,t-1.5,C.paper,1280)
  if(t>2.1){box(85,620,lerp(0,710,prog(t,2.1,.45)),175,C.yellow);reveal('MOVE.',105,705,175,t-2.15,C.ink,1100)}
  if(t>3.3)reveal('BHOOMIKA S.',100,870,58,t-3.3,C.paper)
  if(t>4.1)reveal('PRODUCT DESIGN · FRONTEND DEVELOPMENT · AI',100,945,28,t-4.1,C.sage)
  // Clean lower-right area is deliberately reserved for a confirmed portfolio URL.
  if(t>5.2)stroke([[1260,820],[lerp(1260,1780,prog(t,5.2,.9)),820]],C.sage,1)
  if(t>6.3&&t<7.1){const x=lerp(1670,1770,prog(t,6.3,.5));cursor(x,855,C.paper,.6)}
  if(t>7.1){g.save();g.globalAlpha=1-prog(t,7.1,.2);g.fillStyle=C.deep;g.fillRect(1740,835,90,90);g.restore();if(Math.floor((t-7.1)*4)%2===0)box(1780,850,5,33,C.paper)}
}
const scenes=[opening,sketch,identity,campus,adapt,clarity,split,montage,finale]
function drawScene(target,i,t){g=target.getContext('2d');g.resetTransform();g.globalAlpha=1;g.filter='none';g.clearRect(0,0,W,H);scenes[i](Math.max(0,t))}
function render(t){
  let i=cuts.findIndex((v,n)=>n<scenes.length&&t>=v&&t<cuts[n+1]);if(i<0)i=scenes.length-1
  const local=t-cuts[i];drawScene(sceneCanvas,i,local);ctx.resetTransform();ctx.globalAlpha=1;ctx.drawImage(sceneCanvas,0,0)
  // The same crease/line drives short wipes. The name's O supplies the product portal.
  if(i>0&&local<.25&&i!==8){drawScene(oldCanvas,i-1,cuts[i]-cuts[i-1]-.001);const p=prog(local,0,.25);ctx.save();ctx.beginPath()
    if(i===3){ctx.rect(0,0,W,H);ctx.arc(480,380,p*2200,0,Math.PI*2,true);ctx.clip('evenodd')}
    else{ctx.moveTo(W*p,0);ctx.lineTo(W,0);ctx.lineTo(W,H);ctx.lineTo(W*p-160,H);ctx.closePath();ctx.clip()}
    ctx.drawImage(oldCanvas,0,0);ctx.restore()
  }
}
function poster(){
  g=ctx;fill(C.sage);grid(2,C.line,240);text('I MAKE',105,225,175,C.ink);text('IDEAS MOVE.',100,415,175,C.ink,800,'left',1650)
  cube(10,1450,710,170);box(100,620,210,9,C.yellow);text('BHOOMIKA S.',100,730,51,C.ink);text('DESIGN × CODE × IDEAS',100,812,28,C.deep,600);text('43 seconds. One moving idea.',100,962,27,C.deep,500)
}
async function previews(){await fs.mkdir(REVIEW,{recursive:true});await fs.mkdir(OUT,{recursive:true});poster();await fs.writeFile(path.join(REVIEW,'poster.jpg'),canvas.toBuffer('image/jpeg',94))
  const times=[.6,1.8,3.5,5.2,6.3,8.3,9.3,10.9,12.9,15.2,17.3,18.9,20.1,22.3,24.8,26.1,27.2,28.5,30.5,32.2,33.3,34.8,36.2,38,40,42.6]
  const sheet=createCanvas(1600,Math.ceil(times.length/4)*250),q=sheet.getContext('2d');q.fillStyle=C.deep;q.fillRect(0,0,sheet.width,sheet.height)
  for(let n=0;n<times.length;n++){render(times[n]);const x=n%4*400,y=Math.floor(n/4)*250;q.drawImage(canvas,x,y,400,225);q.fillStyle=C.paper;q.font='14px Manrope';q.fillText(`${times[n].toFixed(1)}s`,x+12,y+244);await fs.writeFile(path.join(REVIEW,`frame-${times[n]}.jpg`),canvas.toBuffer('image/jpeg',92))}
  await fs.writeFile(path.join(REVIEW,'storyboard.jpg'),sheet.toBuffer('image/jpeg',94));console.log(`Storyboard: ${REVIEW}/storyboard.jpg`)
}
await previews()
if(!process.argv.includes('--preview')){
  await fs.mkdir(TEMP,{recursive:true})
  const audio=path.join(TEMP,'score.wav'),output=path.join(TEMP,'Bhoomika-S-Ideas-Move.mp4')
  const music=spawn('python3',[path.join(ROOT,'scripts/reel/music.py'),'--output',audio,'--ffmpeg',ffmpeg],{stdio:'inherit'});if((await once(music,'exit'))[0]!==0)throw Error('Score render failed')
  const enc=spawn(ffmpeg,['-hide_banner','-loglevel','warning','-y','-f','rawvideo','-pixel_format','rgba','-video_size',`${W}x${H}`,'-framerate',`${FPS}`,'-i','pipe:0','-i',audio,'-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart','-t',`${DURATION}`,'-metadata','title=Bhoomika S. — I MAKE IDEAS MOVE','-metadata','comment=Original motion graphics and score. Authentic source-interface captures; no generated UI.',output],{stdio:['pipe','inherit','inherit']})
  const done=once(enc,'exit');enc.stdin.on('error',e=>{if(e.code!=='EPIPE')console.error(e)})
  for(let f=0;f<FPS*DURATION;f++){const t=f/FPS;const rapid=cuts.some(c=>t>=c&&t<c+.55)||(t>27&&t<35);if(rapid&&f>0){render(t-1/96);shutterCtx.drawImage(canvas,0,0);render(t);ctx.globalAlpha=.18;ctx.drawImage(shutter,0,0);ctx.globalAlpha=1}else render(t);if(!enc.stdin.write(canvas.data()))await once(enc.stdin,'drain');if(f%120===0)console.log(`Rendered ${f/FPS}s / ${DURATION}s`)}
  enc.stdin.end();if((await done)[0]!==0)throw Error('Film encode failed')
  // Replace the served film only after a complete successful encode.
  await fs.copyFile(output,path.join(OUT,'bhoomika-introduction.mp4'));await fs.copyFile(path.join(REVIEW,'poster.jpg'),path.join(OUT,'bhoomika-introduction-poster.jpg'));console.log(`Film: ${OUT}/bhoomika-introduction.mp4`)
}
