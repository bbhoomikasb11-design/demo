const ink = '#29483d'
const paper = '#fbfcf8'

function Cursor({ x, y, rotation = -12 }) {
  return <path d="M0 0 0 36 9 28 17 43 25 39 17 25 29 24Z" transform={`translate(${x} ${y}) rotate(${rotation})`} fill={ink} stroke={paper} strokeWidth="3" strokeLinejoin="round"/>
}

function DesignArt() {
  return <>
    <g className="tech-art-piece" transform="rotate(-10 112 91)">
      <rect x="31" y="28" width="153" height="127" rx="15" fill="#bacdab"/>
      <rect x="37" y="22" width="153" height="127" rx="15" fill={paper} stroke="#94ae83" strokeWidth="1.5"/>
      <path d="M37 49H190" stroke="#c4d2bb" strokeWidth="1.5"/>
      <circle cx="50" cy="36" r="3" fill="#a4b996"/><circle cx="60" cy="36" r="3" fill="#c2ccaf"/>
      <rect x="51" y="62" width="54" height="70" rx="7" fill="#dce9cf"/>
      <path d="M62 115 77 96 91 111" fill="none" stroke="#6b8959" strokeWidth="2.5" strokeLinejoin="round"/>
      <circle cx="86" cy="79" r="7" fill="#a5c08a"/>
      <path d="M117 71H172M117 83H158M117 94H165" stroke="#b3bfa7" strokeWidth="5" strokeLinecap="round"/>
      <rect x="116" y="110" width="49" height="21" rx="10.5" fill={ink}/>
    </g>
    <g className="tech-art-piece" transform="rotate(11 179 129)">
      <rect x="150" y="98" width="56" height="57" rx="11" fill="#ddd2eb" stroke={paper} strokeWidth="3"/>
      <path d="M165 112H192V140H165Z" fill="none" stroke="#776282" strokeWidth="1.5"/>
      {[ [165,112], [192,112], [165,140], [192,140] ].map(([x,y]) => <rect key={`${x}-${y}`} x={x-3} y={y-3} width="6" height="6" fill={paper} stroke="#776282" strokeWidth="1.5"/>)}
    </g>
    <g className="tech-art-piece"><Cursor x={127} y={113} rotation={-16}/></g>
  </>
}

function FrontendArt() {
  return <>
    <rect className="tech-art-piece" x="46" y="27" width="155" height="120" rx="13" transform="rotate(9 123 87)" fill="#bfd4d0"/>
    <g className="tech-art-piece" transform="rotate(-6 113 90)">
      <rect x="25" y="39" width="172" height="123" rx="14" fill={paper} stroke="#9bbdb4" strokeWidth="1.5"/>
      <path d="M25 66H197" stroke="#cbded4" strokeWidth="1.5"/>
      {[40,50,60].map(x=><circle key={x} cx={x} cy="52" r="2.5" fill="#83a598"/>)}
      <rect x="38" y="79" width="146" height="69" rx="8" fill={ink}/>
      <path d="m76 98-17 15 17 15m58-30 17 15-17 15m-26-37-12 43" fill="none" stroke="#d9edca" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <g className="tech-art-piece" transform="rotate(9 194 145)">
      <rect x="172" y="116" width="40" height="53" rx="9" fill="#d2dfbd" stroke={paper} strokeWidth="3"/>
      <path d="m184 140 6 6 12-14" stroke={ink} fill="none" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </>
}

function BackendArt() {
  return <>
    <path className="tech-art-piece" d="M58 53H102V94H184M58 142H102V94" stroke="#bba689" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <g className="tech-art-piece">
      <rect x="25" y="27" width="61" height="52" rx="13" fill="#e4d7c5" stroke={paper} strokeWidth="2"/>
      <path d="m44 44-8 9 8 9m21-18 8 9-8 9" fill="none" stroke="#896c4d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="25" y="116" width="61" height="52" rx="13" fill="#d5e1ca" stroke={paper} strokeWidth="2"/>
      <path d="M45 143a10 10 0 0 1 20 0M41 143H69V153H41Z" fill="none" stroke="#69805b" strokeWidth="2.5" strokeLinejoin="round"/>
    </g>
    <g className="tech-art-piece" transform="rotate(5 168 94)">
      <rect x="129" y="42" width="83" height="108" rx="16" fill={ink}/>
      {[56,86,116].map(y=><g key={y}><rect x="142" y={y} width="57" height="21" rx="5" fill="#4d6d5d"/><circle cx="152" cy={y+10.5} r="3" fill="#c5dfa8"/><path d={`M164 ${y+11}H188`} stroke="#a2b6a7" strokeWidth="3" strokeLinecap="round"/></g>)}
    </g>
    <circle className="tech-art-piece" cx="102" cy="94" r="11" fill="#e2c79c" stroke={paper} strokeWidth="3"/>
  </>
}

function DatabaseArt() {
  return <>
    <ellipse cx="120" cy="163" rx="73" ry="9" fill="#bccdbe" opacity=".45"/>
    <g className="tech-art-piece">
      <path d="M61 66V132C61 155 179 155 179 132V66Z" fill="#63896c"/>
      <path d="M61 98C61 120 179 120 179 98M61 122C61 144 179 144 179 122" fill="none" stroke="#bbd4b5" strokeWidth="2"/>
      <ellipse cx="120" cy="66" rx="59" ry="21" fill="#a9c69a" stroke={paper} strokeWidth="2"/>
      <ellipse cx="120" cy="66" rx="35" ry="11" fill="none" stroke="#789768" strokeWidth="1.5"/>
      {[98,122,144].map(y=><circle key={y} cx="165" cy={y-6} r="3" fill="#d3e5bb"/>)}
    </g>
    <g className="tech-art-piece" transform="rotate(-12 51 61)">
      <rect x="24" y="29" width="49" height="52" rx="11" fill="#e6d6c5" stroke={paper} strokeWidth="3"/>
      <path d="M37 42H61M37 52H61M37 62H51" stroke="#a78a6c" strokeWidth="3" strokeLinecap="round"/>
    </g>
    <g className="tech-art-piece" transform="rotate(10 187 137)">
      <rect x="165" y="114" width="45" height="46" rx="11" fill={paper} stroke="#99b49b" strokeWidth="2"/>
      <path d="m178 136 7 7 13-15" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </>
}

function AIArt() {
  return <>
    <g className="tech-art-piece" fill="none" stroke="#baaccb" strokeWidth="1.5">
      <ellipse cx="120" cy="95" rx="87" ry="47" transform="rotate(-30 120 95)"/>
      <ellipse cx="120" cy="95" rx="87" ry="47" transform="rotate(30 120 95)"/>
      <path d="M44 59 120 95 193 133M51 141 120 95 187 49" strokeDasharray="3 5"/>
    </g>
    <g className="tech-art-piece" fill="#d9cbe8" stroke={paper} strokeWidth="3">
      <circle cx="44" cy="59" r="12"/><circle cx="51" cy="141" r="9"/><circle cx="193" cy="133" r="12"/><circle cx="187" cy="49" r="9"/>
    </g>
    <g className="tech-art-piece" transform="rotate(-8 120 95)">
      <rect x="81" y="56" width="78" height="78" rx="23" fill="#e8dff0" stroke={paper} strokeWidth="3"/>
      <path d="M120 70C125 86 129 90 145 95C129 100 125 104 120 120C115 104 111 100 95 95C111 90 115 86 120 70Z" fill="#685978"/>
      <path d="m153 38 2 8 8 2-8 2-2 8-2-8-8-2 8-2Z" fill="#947da8"/>
    </g>
  </>
}

function ToolsArt() {
  return <>
    <g className="tech-art-piece" transform="rotate(-7 111 102)">
      <rect x="26" y="47" width="160" height="112" rx="14" fill={ink} stroke={paper} strokeWidth="2"/>
      <path d="M27 74H185" stroke="#5d7b67" strokeWidth="1.5"/>
      {[41,51,61].map(x=><circle key={x} cx={x} cy="60" r="2.5" fill="#b1c49f"/>)}
      <path d="m43 94 10 8-10 8m23 0H87" fill="none" stroke="#d2e9b7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M43 130H97M106 130H140" stroke="#79977d" strokeWidth="4" strokeLinecap="round"/>
    </g>
    <g className="tech-art-piece">
      <path d="M159 68C146 68 142 49 153 43C155 24 184 21 192 38C210 35 220 58 205 66C202 68 196 68 191 68Z" fill="#dbe7cf" stroke={paper} strokeWidth="3"/>
      <path d="M178 60V44m-7 7 7-7 7 7" fill="none" stroke="#5f7c4b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M191 83V109H171" fill="none" stroke="#89a17b" strokeWidth="2" strokeDasharray="4 5" strokeLinecap="round"/>
      <rect x="168" y="123" width="43" height="42" rx="12" transform="rotate(10 189 144)" fill="#d9ccb8" stroke={paper} strokeWidth="3"/>
      <path d="m180 143 6 6 12-13" fill="none" stroke="#82694d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </>
}

const art = { design: DesignArt, frontend: FrontendArt, backend: BackendArt, database: DatabaseArt, ai: AIArt, tools: ToolsArt }

export default function TechCardArt({ kind }) {
  const Art = art[kind] || DesignArt
  return <svg className="tech-card-art" viewBox="0 0 240 190" fill="none" aria-hidden="true" focusable="false"><Art/></svg>
}
