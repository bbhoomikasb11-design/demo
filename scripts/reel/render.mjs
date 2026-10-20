import { createCanvas, GlobalFonts } from '@napi-rs/canvas'
import ffmpeg from 'ffmpeg-static'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Original, deterministic motion graphics. No reference footage or sampled audio.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.join(ROOT, 'public/media')
const REVIEW = path.join(ROOT, '.impeccable/review/reel')
const TEMP = path.join(os.tmpdir(), 'bhoomika-reel-render')
const W = 1920, H = 1080, FPS = 30, DURATION = 60
const cuts = [0, 4.8, 9.6, 14.4, 21.6, 28.8, 36, 43.2, 48, 55.2, 60]
const C = {
  paper: '#f5f5ee', white: '#ffffff', ink: '#234638', forest: '#244d3e',
  sage: '#dce6cd', mint: '#b6d5bf', muted: '#61735e', dark: '#182b24',
  lavender: '#d9d7ed', violet: '#b9b3d8', clay: '#dfc8b0', line: '#d8dfd2',
}
GlobalFonts.registerFromPath(path.join(ROOT, 'public/fonts/manrope-variable.ttf'), 'Manrope')
const canvas = createCanvas(W, H)
const current = createCanvas(W, H)
const previous = createCanvas(W, H)
const ctx = canvas.getContext('2d')
let g = current.getContext('2d')

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const mix = (a, b, t) => a + (b - a) * t
const out = t => 1 - Math.pow(1 - clamp(t), 4)
const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t) }
const arrive = (t, delay = 0, length = .75) => out((t - delay) / length)
const pulse = (t, speed = 1) => Math.sin(t * speed)

function rr(x, y, w, h, r = 24, fill = C.white, stroke, sw = 1) {
  g.beginPath(); g.roundRect(x, y, w, h, r)
  if (fill) { g.fillStyle = fill; g.fill() }
  if (stroke) { g.lineWidth = sw; g.strokeStyle = stroke; g.stroke() }
}
function circle(x, y, r, fill, stroke, sw = 2) {
  g.beginPath(); g.arc(x, y, Math.max(.01, r), 0, Math.PI * 2)
  if (fill) { g.fillStyle = fill; g.fill() }
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = sw; g.stroke() }
}
function line(points, color = C.ink, width = 3, progress = 1) {
  g.beginPath(); g.moveTo(...points[0])
  for (let i = 1; i < points.length; i++) {
    const p = clamp(progress * (points.length - 1) - (i - 1))
    if (!p) break
    g.lineTo(mix(points[i - 1][0], points[i][0], p), mix(points[i - 1][1], points[i][1], p))
  }
  g.strokeStyle = color; g.lineWidth = width; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke()
}
function txt(s, x, y, size = 40, color = C.ink, weight = 600, align = 'left', maxWidth) {
  g.save(); g.textBaseline = 'middle'; g.textAlign = align; g.fillStyle = color
  g.font = `${weight} ${size}px Manrope`
  if (maxWidth && g.measureText(s).width > maxWidth) {
    size *= maxWidth / g.measureText(s).width
    g.font = `${weight} ${size}px Manrope`
  }
  g.fillText(s, x, y); g.restore()
}
function lines(strings, x, y, size = 80, color = C.ink, weight = 650, align = 'left', gap = size * 1.14) {
  strings.forEach((s, i) => txt(s, x, y + i * gap, size, color, weight, align))
}
function shadow(fn, blur = 45, y = 18, opacity = .12) {
  g.save(); g.shadowColor = `rgba(22,49,34,${opacity})`; g.shadowBlur = blur; g.shadowOffsetY = y
  fn(); g.restore()
}
function transform(x, y, scale, rotation, fn) {
  g.save(); g.translate(x, y); g.rotate(rotation); g.scale(scale, scale); fn(); g.restore()
}
function appear(t, delay, x, y, fn, dy = 65, duration = .8) {
  const a = arrive(t, delay, duration)
  g.save(); g.globalAlpha *= a; g.translate(x, y + (1 - a) * dy); fn(a); g.restore()
}
function field(color = C.paper, glow = C.sage, time = 0) {
  g.fillStyle = color; g.fillRect(0, 0, W, H)
  const x = 1450 + Math.sin(time * .28) * 80, y = 900
  const grad = g.createRadialGradient(x, y, 10, x, y, 1150)
  grad.addColorStop(0, glow); grad.addColorStop(1, `${glow}00`)
  g.fillStyle = grad; g.fillRect(0, 0, W, H)
}
function mark(x, y, size = 96, rotation = -.12, dark = false) {
  transform(x, y, 1, rotation, () => {
    shadow(() => rr(-size / 2, -size / 2, size, size, size * .23, dark ? C.sage : C.forest), 22, 9, .13)
    txt('b.', -size * .015, -size * .015, size * .85, dark ? C.forest : C.paper, 750, 'center')
  })
}
function footer(dark = false, study = false) {
  g.save(); g.globalAlpha = .75
  txt('BHOOMIKA S.', 78, 1033, 22, dark ? C.mint : C.muted, 700)
  if (study) txt('Illustrative interface study', 1840, 1033, 22, dark ? C.mint : C.muted, 500, 'right')
  g.restore()
}
function cursor(x, y, scale = 1, rotation = -.12, color = C.forest, click = 0) {
  if (click > 0) {
    g.save(); g.globalAlpha = (1 - click) * .5
    circle(x, y, 20 + click * 55, null, color, 4); g.restore()
  }
  transform(x, y, scale, rotation, () => {
    shadow(() => {
      g.beginPath(); g.moveTo(0, 0); g.lineTo(9, 57); g.lineTo(24, 43)
      g.lineTo(39, 67); g.lineTo(50, 59); g.lineTo(35, 36); g.lineTo(56, 31); g.closePath()
      g.fillStyle = color; g.fill(); g.strokeStyle = C.white; g.lineWidth = 4; g.stroke()
    }, 12, 5, .15)
  })
}
function icon(kind, x, y, size = 70, color = C.ink) {
  transform(x, y, size / 100, 0, () => {
    g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = color; g.lineWidth = 5
    if (kind === 'code') {
      line([[-26, -24], [-49, 0], [-26, 24]], color, 6)
      line([[26, -24], [49, 0], [26, 24]], color, 6)
      line([[10, -34], [-10, 34]], color, 6)
    } else if (kind === 'spark') {
      g.beginPath(); g.moveTo(0, -48); g.quadraticCurveTo(7, -7, 48, 0)
      g.quadraticCurveTo(7, 7, 0, 48); g.quadraticCurveTo(-7, 7, -48, 0)
      g.quadraticCurveTo(-7, -7, 0, -48); g.stroke()
    } else if (kind === 'pen') {
      line([[-35, 35], [-27, 8], [22, -42], [42, -22], [-8, 27], [-35, 35]], color, 5)
      line([[10, -30], [30, -10]], color, 5)
    } else if (kind === 'book') {
      g.beginPath(); g.moveTo(0, 35); g.lineTo(0, -30)
      g.quadraticCurveTo(-24, -43, -44, -34); g.lineTo(-44, 31); g.quadraticCurveTo(-20, 22, 0, 35)
      g.quadraticCurveTo(20, 22, 44, 31); g.lineTo(44, -34); g.quadraticCurveTo(24, -43, 0, -30); g.stroke()
    } else if (kind === 'headphones') {
      g.beginPath(); g.arc(0, 0, 35, Math.PI, 0); g.stroke()
      rr(-43, -2, 18, 39, 8, null, color, 5); rr(25, -2, 18, 39, 8, null, color, 5)
    } else if (kind === 'bag') {
      rr(-35, -24, 70, 65, 10, null, color, 5)
      g.beginPath(); g.arc(0, -18, 18, Math.PI, 0); g.stroke()
    } else if (kind === 'check') {
      line([[-32, 0], [-8, 24], [36, -24]], color, 7)
    } else if (kind === 'plus') {
      line([[-35, 0], [35, 0]], color, 8); line([[0, -35], [0, 35]], color, 8)
    } else if (kind === 'barcode') {
      ;[-40, -29, -23, -10, 4, 12, 28, 40].forEach((v, i) => line([[v, -35], [v, 35]], color, i % 3 === 0 ? 7 : 3))
    } else if (kind === 'chat') {
      rr(-45, -35, 90, 62, 17, null, color, 5)
      line([[-26, 28], [-32, 45], [-8, 28]], color, 5)
      ;[-20, 0, 20].forEach(v => circle(v, -4, 4, color))
    }
  })
}
function pill(label, x, y, fill = C.white, color = C.ink, font = 28, width) {
  g.font = `650 ${font}px Manrope`
  const w = width || g.measureText(label).width + 58
  rr(x, y - 29, w, 58, 29, fill); txt(label, x + w / 2, y, font, color, 650, 'center')
  return w
}
function windowFrame(x, y, w, h, title, dark = false) {
  shadow(() => rr(x, y, w, h, 26, dark ? '#25372f' : C.white), 70, 28, .16)
  rr(x, y, w, 58, [26, 26, 0, 0], dark ? '#34483c' : '#f1f3ec')
  ;['#d2b5a5', '#dbcf9d', '#acc39d'].forEach((c, i) => circle(x + 26 + i * 21, y + 29, 6, c))
  txt(title, x + w / 2, y + 29, 21, dark ? '#cbd7c8' : C.muted, 500, 'center')
}

function curiosity(t) {
  field(C.paper, '#d3e4cd', t)
  appear(t, .08, 390, 222, () => mark(0, 0, 92))
  appear(t, .3, 500, 218, () => {
    shadow(() => rr(0, -59, 955, 118, 55), 45, 14, .1)
    txt('It starts with a “what if?”', 55, 0, 54, C.ink, 600)
  })
  appear(t, 1.22, 380, 430, () => {
    shadow(() => rr(0, -53, 220, 106, 52), 30, 12, .08)
    for (let i = 0; i < 3; i++) circle(64 + i * 43, -Math.sin(t * 5 - i) * 5, 10, [C.mint, '#8fa987', C.forest][i])
  })
  const reply = arrive(t, 1.85)
  appear(t, 1.85, 690, 615, () => {
    shadow(() => rr(0, -75, 1000, 150, 62, C.forest), 50, 19, .15)
    txt('Then I make it real.', 500, 0, 65, C.paper, 650, 'center')
  }, 90)
  if (reply > .05) cursor(mix(1770, 1620, reply), mix(900, 705, reply), .95, -.1, C.forest, clamp((t - 2.7) * 1.6))
  appear(t, 2.9, 960, 870, () => txt('Design. Code. A little curiosity.', 0, 0, 36, C.muted, 500, 'center'))
  footer()
}

function identity(t) {
  field(C.paper, '#dce7d4', t)
  const a = arrive(t, .1, 1)
  mark(mix(390, 270, a), mix(222, 215, a), 120, mix(-.12, -.055, a))
  appear(t, .25, 960, 264, () => txt('Hi, I’m', 0, 0, 56, C.muted, 500, 'center'))
  const letters = [...'Bhoomika.']
  g.font = '750 190px Manrope'
  const widths = letters.map(s => g.measureText(s).width)
  let x = (W - widths.reduce((a, b) => a + b, 0)) / 2
  letters.forEach((s, i) => {
    const a = arrive(t, .4 + i * .055, .7)
    g.save(); g.globalAlpha = a; txt(s, x, 465 + (1 - a) * 130, 190, i === 8 ? '#72946c' : C.ink, 750); g.restore()
    x += widths[i]
  })
  const p = arrive(t, 1.2)
  line([[595, 605], [1325, 605]], '#a0b390', 5, p)
  appear(t, 1.3, 960, 697, () => txt('Bengaluru, India', 0, 0, 43, C.ink, 600, 'center'))
  appear(t, 1.7, 960, 783, () => txt('Final-year AI & Data Science engineering student', 0, 0, 34, C.muted, 500, 'center'))
  footer()
}

function workflow(t) {
  field(C.dark, '#2b4e3c', t)
  appear(t, .05, 960, 173, () => txt('Think it through. Bring it to life.', 0, 0, 72, C.paper, 650, 'center'))
  const xs = [440, 960, 1480], labels = ['Design.', 'Develop.', 'Add intelligence.']
  const fills = [C.sage, C.paper, C.mint]
  xs.forEach((x, i) => {
    const a = arrive(t, .35 + i * .25)
    transform(x, 520 + (1 - a) * 110, .88 + .12 * a, (1 - a) * (i - 1) * .16, () => {
      g.globalAlpha = a
      shadow(() => rr(-205, -200, 410, 370, 32, fills[i]), 35, 20, .2)
      icon(['pen', 'code', 'spark'][i], 0, -57, 105, C.forest)
      txt(labels[i], 0, 85, i === 2 ? 37 : 47, C.ink, 700, 'center')
    })
  })
  line([[655, 505], [740, 505]], '#90af8d', 4, arrive(t, .95))
  line([[1175, 505], [1260, 505]], '#90af8d', 4, arrive(t, 1.3))
  const cursorP = smooth((t - 1.1) / 2.2)
  cursor(mix(575, 1590, cursorP), 690 - Math.sin(cursorP * Math.PI) * 210, 1, -.1, C.mint)
  appear(t, 2.0, 960, 884, () => txt('Product thinking  ×  Full-stack development  ×  AI', 0, 0, 35, C.sage, 500, 'center'))
  footer(true)
}

function campus(t) {
  field('#e5ebdc', '#d0dfc1', t)
  appear(t, .15, 110, 180, () => txt('CampusMesh', 0, 0, 44, C.forest, 700))
  appear(t, .25, 110, 343, () => lines(['Campus,', 'connected.'], 0, 0, 97))
  appear(t, .75, 110, 635, () => lines(['Student exchanges.', 'Thoughtfully connected.'], 0, 0, 33, C.muted, 500, 'left', 49))
  appear(t, 1, 110, 842, () => pill('Design + full-stack', 0, 0, C.forest, C.paper, 25))
  const a = arrive(t, .15, 1.2)
  transform(1285 + (1 - a) * 520, 540 + Math.sin(t * .45) * 12, .92 + .06 * a, -.055 + .015 * smooth(t / 7.2), () => {
    windowFrame(-570, -390, 1140, 780, 'CampusMesh')
    txt('campusmesh.', -505, -265, 38, C.ink, 750)
    icon('bag', 450, -254, 60, '#7a9466')
    lines(['Good finds.', 'Closer to home.'], -505, -147, 67, C.ink, 700, 'left', 79)
    txt('Buy, sell, and share within your campus.', -505, 36, 25, C.muted, 500)
    rr(-505, 95, 1010, 62, 16, '#f3f5ed', C.line)
    txt('Find something you need…', -475, 126, 24, C.muted, 450)
    ;[['book', 'Books'], ['headphones', 'Electronics'], ['bag', 'Essentials']].forEach(([kind, label], i) => {
      const b = arrive(t, 1.05 + i * .18)
      g.save(); g.globalAlpha = b; g.translate(0, (1 - b) * 80)
      const x = -505 + i * 345
      rr(x, 195, 320, 138, 16, ['#e8e5d8', '#e0e8dd', '#e4e1d9'][i])
      icon(kind, x + 160, 258, 63, ['#9c8f66', '#73886b', '#8d8573'][i])
      txt(label, x + 160, 365, 24, C.ink, 600, 'center')
      g.restore()
    })
  })
  if (t > 2.4) cursor(1410 + 80 * Math.sin(t * .6), 765 + 20 * Math.cos(t), .85, -.08, C.forest, clamp((t - 3.2) * 2))
  footer(false, true)
}

function clearhead(t) {
  field('#201f2c', '#333c36', t)
  appear(t, .12, 110, 170, () => txt('ClearHead', 0, 0, 44, C.lavender, 650))
  appear(t, .3, 110, 332, () => lines(['Room for', 'your thoughts.'], 0, 0, 88, C.paper))
  appear(t, .8, 110, 647, () => lines(['A space to reflect.', 'A little help from AI.'], 0, 0, 32, '#bbb9cd', 500, 'left', 50))
  appear(t, 1.05, 110, 842, () => pill('Full-stack + AI integration', 0, 0, C.lavender, '#2e2c40', 24))
  const a = arrive(t, .2, 1.1)
  transform(1320 + (1 - a) * 460, 530, .93 + .035 * Math.sin(t / 3), .045 - t * .006, () => {
    shadow(() => rr(-555, -350, 1090, 740, 30, '#2d2b3d'), 70, 25, .3)
    txt('clearhead.', -478, -270, 37, '#e6e0f0', 650)
    txt('A moment, just for you.', -478, -185, 29, '#b9b2ce', 500)
    rr(-478, -110, 934, 245, 20, '#373448', '#4e485e', 2)
    txt('What’s on your mind?', -435, -59, 35, '#efeaf6', 600)
    const thought = 'An idea I want to explore…'
    const typed = thought.slice(0, Math.floor(clamp((t - 1.3) / 2) * thought.length))
    txt(typed, -435, 24, 28, '#beb7d1', 450)
    if (t > 1.3 && t < 3.5) {
      g.save(); g.font = '450 28px Manrope'
      rr(-430 + g.measureText(typed).width, 10, 3, 28, 1, '#c9bfdc')
      g.restore()
    }
    pill('Find a little clarity', -478, 201, '#c8bade', '#30283f', 26, 934)
    ;['Reflect', 'Notice', 'Explore'].forEach((word, i) => {
      appear(t, 3.5 + i * .16, -478 + i * 320, 315, () => {
        rr(0, -36, 294, 72, 14, '#423d53')
        txt(word, 147, 0, 27, '#e4dcec', 500, 'center')
      }, 25)
    })
  })
  footer(true, true)
}

function adapt(t) {
  field('#e8ebdf', '#d9e5c8', t)
  const a = arrive(t, .15, 1)
  transform(660 - (1 - a) * 500, 537, .94 + .045 * a, .035 * (1 - smooth(t / 7.2)), () => {
    windowFrame(-535, -355, 1070, 760, 'A web that works for you')
    rr(-535, -297, 1070, 702, [0, 0, 26, 26], '#fffef9')
    txt('Readable by design.', -455, -198, 48, C.ink, 700)
    const font = 32 + 8 * smooth((t - 2.4) / 1.4)
    lines(['Comfortable type.', 'A little more space.', 'Thoughtful contrast.'], -455, -65, font, C.ink, 500, 'left', 82 + smooth((t - 2.4) / 1.4) * 8)
    rr(-455, 238, 402, 78, 18, C.forest)
    txt('Made for real people', -254, 277, 27, C.paper, 650, 'center')
    const selection = arrive(t, 1.7)
    if (selection > 0) {
      g.save(); g.globalAlpha = selection; rr(-470, -111, 740, 257, 8, null, '#8aa970', 3); g.restore()
      ;[[-470, -111], [270, -111], [-470, 146], [270, 146]].forEach(([x, y]) => rr(x - 5, y - 5, 10, 10, 1, C.white, '#8aa970', 2))
    }
  })
  appear(t, .3, 1250, 202, () => txt('AdaptUI', 0, 0, 44, C.forest, 700))
  appear(t, .5, 1250, 328, () => lines(['The web,', 'your way.'], 0, 0, 79))
  appear(t, 1.1, 1250, 601, () => {
    shadow(() => rr(-5, -35, 520, 215, 22, C.white), 30, 12, .09)
    txt('Make room for you.', 26, 15, 30, C.ink, 650)
    line([[30, 93], [465, 93]], '#d8dfd2', 8)
    const p = smooth((t - 2.4) / 1.4)
    line([[30, 93], [mix(165, 363, p), 93]], '#728c64', 8)
    circle(mix(165, 363, p), 93, 15, C.forest)
    txt('Type size', 30, 144, 23, C.muted, 500)
    txt(`${Math.round(mix(32, 40, p))} px`, 465, 144, 23, C.muted, 500, 'right')
  })
  appear(t, 1.5, 1250, 882, () => lines(['Accessibility-focused', 'browser extension'], 0, 0, 29, C.muted, 500, 'left', 43))
  footer(false, true)
}

function split(t) {
  field('#eee4d6', '#e0d6bf', t)
  appear(t, .1, 115, 172, () => txt('SplitGrid', 0, 0, 44, C.ink, 700))
  appear(t, .3, 115, 325, () => lines(['Shared plans.', 'Simpler expenses.'], 0, 0, 78))
  appear(t, .9, 115, 626, () => lines(['Real-time collaboration.', 'One clearer way to settle up.'], 0, 0, 30, C.muted, 500, 'left', 49))
  appear(t, 1.2, 115, 850, () => pill('React · Node.js · Socket.IO', 0, 0, C.forest, C.paper, 22))
  const a = arrive(t, .2, 1.1)
  transform(1320 + (1 - a) * 450, 534, .96, -.035 + t * .004, () => {
    windowFrame(-535, -370, 1070, 780, 'SplitGrid')
    txt('splitgrid.', -465, -249, 39, C.ink, 750)
    txt('Good company. Clear expenses.', -465, -165, 37, C.ink, 650)
    ;[['Weekend trip', 'Travel together'], ['Shared groceries', 'Everyday essentials'], ['Dinner together', 'Good food, good friends']].forEach(([name, desc], i) => {
      appear(t, 1 + i * .2, -465, -47 + i * 110, () => {
        rr(0, -42, 930, 89, 14, '#f1f3eb')
        circle(46, 2, 23, ['#d7e2ca', '#e4d7be', '#cbded6'][i])
        txt(name, 91, -8, 29, C.ink, 650)
        txt(desc, 91, 25, 19, C.muted, 450)
        icon('check', 870, 0, 27, '#617f52')
      }, 35)
    })
    const p = arrive(t, 3, 1)
    g.save(); g.globalAlpha = p
    const xs = [-365, 0, 365]
    line([[xs[0], 322], [xs[2], 322]], '#b8c9aa', 3)
    xs.forEach((x, i) => { circle(x, 322, 32, [C.sage, C.mint, C.clay][i]); txt(['A', 'S', 'Y'][i], x, 322, 25, C.ink, 700, 'center') })
    g.restore()
  })
  footer(false, true)
}

function more(t) {
  field(C.dark, '#2d4b38', t)
  appear(t, .05, 960, 170, () => txt('Still curious. Always building.', 0, 0, 78, C.paper, 650, 'center'))
  const data = [
    { title: ['SafeScan'], label: 'Product concept', icon: 'barcode', fill: C.sage },
    { title: ['MediMatch'], label: 'Healthcare prototype', icon: 'plus', fill: '#d6e7df' },
    { title: ['AI Smart Store', 'Assistant'], label: 'AI product discovery', icon: 'chat', fill: C.clay },
  ]
  data.forEach((d, i) => {
    const a = arrive(t, .25 + i * .2, .85)
    transform(370 + i * 590, 575 + (1 - a) * 240, .86 + .14 * a, (i - 1) * .045 * a, () => {
      g.globalAlpha = a
      shadow(() => rr(-255, -245, 510, 500, 28, d.fill), 40, 18, .25)
      icon(d.icon, 0, -116, 92, C.forest)
      lines(d.title, 0, d.title.length === 1 ? 45 : 20, d.title.length === 1 ? 50 : 43, C.ink, 700, 'center', 56)
      txt(d.label, 0, 177, 28, C.forest, 500, 'center')
    })
  })
  appear(t, 1.5, 960, 917, () => txt('Different problems. The same care.', 0, 0, 35, C.sage, 500, 'center'))
  footer(true)
}

function experience(t) {
  field(C.paper, '#d9e6ce', t)
  appear(t, .1, 110, 230, () => lines(['Learning by doing.', 'Building with people.'], 0, 0, 76))
  appear(t, .8, 110, 573, () => {
    txt('AI & Data Science', 0, 0, 41, C.ink, 650)
    lines(['Don Bosco Institute of Technology', 'Bengaluru'], 0, 72, 29, C.muted, 500, 'left', 46)
    pill('9.0 / 10 CGPA', 0, 230, C.sage, C.forest, 27)
  })
  ;[
    { y: 290, title: 'Jarurat Care Foundation', role: 'UI/UX Design Intern', detail: 'Healthcare experiences, thoughtfully designed.', mark: 'jc', fill: C.sage },
    { y: 620, title: 'Mini Web Solutions / WE3.BUILD', role: 'Design · Frontend · Digital content', detail: 'Turning ideas into digital experiences.', mark: 'w3', fill: C.clay },
  ].forEach((d, i) => {
    appear(t, .5 + i * .5, 1050, d.y, () => {
      shadow(() => rr(-30, -70, 790, 266, 25, C.white), 40, 14, .09)
      rr(0, -38, 72, 72, 17, d.fill); txt(d.mark, 36, -2, 31, C.ink, 750, 'center')
      txt(d.title, 100, -3, i ? 30 : 34, C.ink, 700, 'left', 620)
      txt(d.role, 0, 82, 29, C.ink, 600)
      txt(d.detail, 0, 143, 24, C.muted, 450, 'left', 730)
    }, 90)
  })
  footer()
}

function closing(t) {
  field('#1f3d2f', '#33543b', t)
  const a = arrive(t, .05, .85)
  mark(960, 193 + (1 - a) * 65, 122 * (.7 + a * .3), -.09 + .06 * a, true)
  appear(t, .25, 960, 405, () => lines(['Curiosity in design.', 'Purpose in code.'], 0, 0, 95, C.paper, 650, 'center', 119))
  appear(t, .85, 960, 717, () => txt('Bhoomika S.', 0, 0, 44, C.sage, 700, 'center'))
  appear(t, 1.15, 960, 798, () => txt('bbhoomikasb11@gmail.com', 0, 0, 34, C.paper, 500, 'center'))
  appear(t, 1.5, 960, 927, () => txt('Open to internships & full-time opportunities', 0, 0, 28, '#b7cdb3', 500, 'center'))
}

const scenes = [curiosity, identity, workflow, campus, clearhead, adapt, split, more, experience, closing]
function sceneAt(time) {
  return Math.max(0, Math.min(9, cuts.findIndex((c, i) => i < 10 && time >= c && time < cuts[i + 1])))
}
function drawOn(target, scene, time) {
  g = target.getContext('2d')
  g.resetTransform(); g.globalAlpha = 1; g.clearRect(0, 0, W, H)
  scenes[scene](Math.max(0, time))
}
function render(time) {
  const i = sceneAt(Math.min(time, DURATION - .001)), local = time - cuts[i]
  drawOn(current, i, local)
  ctx.resetTransform(); ctx.globalAlpha = 1
  if (i > 0 && local < .54) {
    const p = out(local / .54)
    drawOn(previous, i - 1, cuts[i] - cuts[i - 1] - .015)
    ctx.drawImage(previous, 0, 0)
    ctx.save()
    if (i % 3 === 0) {
      ctx.beginPath(); ctx.arc(1460, 530, Math.max(.1, p * 2000), 0, Math.PI * 2); ctx.clip()
      ctx.drawImage(current, 0, 0)
    } else if (i % 3 === 1) {
      ctx.drawImage(current, W * (1 - p), 0)
    } else {
      const scale = 1.12 - p * .12
      ctx.globalAlpha = p; ctx.translate(W / 2, H / 2); ctx.scale(scale, scale)
      ctx.drawImage(current, -W / 2, -H / 2)
    }
    ctx.restore()
  } else ctx.drawImage(current, 0, 0)
}
function poster() {
  g = ctx; field(C.paper, '#d8e6cb', 0)
  mark(960, 177, 115, -.08)
  txt('Bhoomika, in motion.', 960, 326, 91, C.ink, 750, 'center')
  txt('A little design. A little code. A lot of curiosity.', 960, 440, 34, C.muted, 500, 'center')
  const icons = [
    { x: 310, y: 667, a: -.12, icon: 'pen', label: 'Design', fill: C.white },
    { x: 1578, y: 650, a: .1, icon: 'code', label: 'Develop', fill: C.forest },
    { x: 1350, y: 865, a: -.07, icon: 'spark', label: 'Explore AI', fill: '#c8dcb9' },
  ]
  icons.forEach(d => transform(d.x, d.y, 1, d.a, () => {
    shadow(() => rr(-145, -110, 290, 220, 29, d.fill), 40, 17, .12)
    icon(d.icon, 0, -32, 70, d.fill === C.forest ? C.sage : C.forest)
    txt(d.label, 0, 64, 29, d.fill === C.forest ? C.paper : C.ink, 650, 'center')
  }))
  txt('A 60-second introduction', 960, 946, 28, C.muted, 500, 'center')
}

async function savePreviews() {
  await fs.mkdir(OUT, { recursive: true }); await fs.mkdir(REVIEW, { recursive: true })
  poster()
  await fs.writeFile(path.join(OUT, 'bhoomika-introduction-poster.jpg'), canvas.toBuffer('image/jpeg', 94))
  const sheet = createCanvas(1280, 2000)
  const sc = sheet.getContext('2d'); sc.fillStyle = '#14271e'; sc.fillRect(0, 0, sheet.width, sheet.height)
  for (let i = 0; i < 10; i++) {
    const time = cuts[i] + (cuts[i + 1] - cuts[i]) * .67
    render(time)
    await fs.writeFile(path.join(REVIEW, `scene-${String(i + 1).padStart(2, '0')}.jpg`), canvas.toBuffer('image/jpeg', 92))
    const x = i % 2 * 640, y = Math.floor(i / 2) * 400
    sc.drawImage(canvas, x, y, 640, 360)
    sc.font = '20px Manrope'; sc.fillStyle = '#eff4e9'; sc.fillText(`${cuts[i].toFixed(1)}–${cuts[i + 1].toFixed(1)} sec`, x + 20, y + 388)
  }
  await fs.writeFile(path.join(REVIEW, 'storyboard.jpg'), sheet.toBuffer('image/jpeg', 94))
}

await savePreviews()
if (process.argv.includes('--preview')) {
  console.log(`Storyboard: ${path.join(REVIEW, 'storyboard.jpg')}`)
  console.log(`Poster: ${path.join(OUT, 'bhoomika-introduction-poster.jpg')}`)
} else {
  await fs.mkdir(TEMP, { recursive: true })
  const audio = path.join(TEMP, 'music.wav')
  try { await fs.access(audio) } catch {
    const music = spawn('python3', [path.join(ROOT, 'scripts/reel/music.py'), '--output', audio, '--ffmpeg', ffmpeg], { stdio: 'inherit' })
    const [code] = await once(music, 'exit')
    if (code !== 0) throw new Error('Music rendering failed')
  }
  const output = path.join(OUT, 'bhoomika-introduction.mp4')
  const encoder = spawn(ffmpeg, [
    '-hide_banner', '-loglevel', 'warning', '-y',
    '-f', 'rawvideo', '-pixel_format', 'rgba', '-video_size', `${W}x${H}`, '-framerate', `${FPS}`, '-i', 'pipe:0',
    '-i', audio, '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', '-t', `${DURATION}`,
    '-metadata', 'title=Bhoomika S. — Curiosity in design. Purpose in code.',
    '-metadata', 'comment=Original motion graphics and original synthesized music. Interface visuals are illustrative.',
    output,
  ], { stdio: ['pipe', 'inherit', 'inherit'] })
  const done = once(encoder, 'exit')
  encoder.stdin.on('error', e => { if (e.code !== 'EPIPE') console.error(e) })
  for (let frame = 0; frame < FPS * DURATION; frame++) {
    render(frame / FPS)
    if (!encoder.stdin.write(canvas.data())) await once(encoder.stdin, 'drain')
    if (frame % 150 === 0) console.log(`Rendered ${frame / FPS}s / ${DURATION}s`)
  }
  encoder.stdin.end()
  const [code] = await done
  if (code !== 0) throw new Error(`Video rendering failed with exit ${code}`)
  console.log(`Rendered: ${output}`)
}
