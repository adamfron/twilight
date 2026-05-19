import { ThresholdResult } from '../types';
const ok=(v:number)=>Number.isFinite(v);
export function CrossSectionPanel({results,solarAz,crossAz,timeUTC,onEnlarge}:{results:ThresholdResult[];solarAz:number;crossAz:number;timeUTC:string;onEnlarge?:()=>void}){
 const w=760,h=380,m={l:64,r:20,t:20,b:48},xMin=-1000,xMax=1000,yMin=0,yMax=500;
 const sx=(x:number)=>m.l+((x-xMin)/(xMax-xMin))*(w-m.l-m.r); const sy=(y:number)=>h-m.b-((y-yMin)/(yMax-yMin))*(h-m.t-m.b);
 const xt=[-1000,-500,0,500,1000], yt=[0,100,200,300,400,500];
 return <div className='panel'><div className='panelHeader'><h3>Vertical Cross-Section</h3>{onEnlarge&&<button onClick={onEnlarge}>Enlarge</button>}</div><svg id='cross-section-svg' viewBox={`0 0 ${w} ${h}`}>
 <rect x={m.l} y={m.t} width={w-m.l-m.r} height={h-m.t-m.b} fill='#f8fafc'/>
 {xt.map(t=><line key={t} x1={sx(t)} x2={sx(t)} y1={m.t} y2={h-m.b} stroke='#e2e8f0'/>)}{yt.map(t=><line key={t} x1={m.l} x2={w-m.r} y1={sy(t)} y2={sy(t)} stroke='#e2e8f0'/>) }
 {[90,110,250,350].map(z=><line key={z} x1={m.l} x2={w-m.r} y1={sy(z)} y2={sy(z)} stroke='#cbd5e1' strokeDasharray='3 4'/>) }
 {results.map(r=>{const pts=r.curve.filter(p=>ok(p.x)&&ok(p.z)&&p.z>=0&&p.z<=500).map(p=>`${sx(p.x)},${sy(p.z)}`).join(' '); return pts?<polyline key={r.threshold.key} fill='none' stroke={r.threshold.color} strokeWidth={2} points={pts}/>:null;})}
 <line x1={sx(0)} y1={m.t} x2={sx(0)} y2={h-m.b} stroke='#475569' strokeDasharray='5 4'/>
 {xt.map(t=><g key={`xt-${t}`}><line x1={sx(t)} x2={sx(t)} y1={h-m.b} y2={h-m.b+6} stroke='#334155'/><text x={sx(t)} y={h-24} fontSize='11' textAnchor='middle'>{t}</text></g>)}
 {yt.map(t=><g key={`yt-${t}`}><line x1={m.l-6} x2={m.l} y1={sy(t)} y2={sy(t)} stroke='#334155'/><text x={m.l-10} y={sy(t)+4} fontSize='11' textAnchor='end'>{t}</text></g>)}
 <text x={w/2} y={h-6} textAnchor='middle' fontSize='12'>Distance along terminator-normal [km]</text><text transform={`translate(16 ${h/2}) rotate(-90)`} fontSize='12' textAnchor='middle'>Altitude [km]</text>
 <text x={sx(-900)} y={m.t+16} fontSize='11'>Toward daylight</text><text x={sx(650)} y={m.t+16} fontSize='11'>Toward night</text><text x={sx(10)} y={m.t+30} fontSize='11'>Selected station</text>
 <rect x={w-230} y={m.t+10} width={200} height={74} fill='white' opacity='0.92' stroke='#cbd5e1'/><text x={w-222} y={m.t+26} fontSize='11'>solar azimuth: {ok(solarAz)?solarAz.toFixed(2):'N/A'}°</text><text x={w-222} y={m.t+40} fontSize='11'>cross-section azimuth: {ok(crossAz)?crossAz.toFixed(2):'N/A'}°</text><text x={w-222} y={m.t+54} fontSize='11'>solar elevation: N/A</text><text x={w-222} y={m.t+68} fontSize='11'>{timeUTC}</text>
 </svg></div>
}
