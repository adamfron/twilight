import { Station, TimeMode } from '../types';
interface P{stations:Station[];stationId:string;onStation:(s:string)=>void;date:string;onDate:(v:string)=>void;manualTime:string;onManualTime:(v:string)=>void;mode:TimeMode;onMode:(m:TimeMode)=>void;anchor:string;onAnchor:(a:string)=>void;onCompute:()=>void;onHowTo:()=>void;}
export function InputBar(p:P){return <div className='inputBar'>
<select value={p.stationId} onChange={e=>p.onStation(e.target.value)}>{p.stations.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>
<input type='date' value={p.date} onChange={e=>p.onDate(e.target.value)}/>
<select value={p.mode} onChange={e=>p.onMode(e.target.value as TimeMode)}><option value='morning'>Morning terminator</option><option value='evening'>Evening terminator</option><option value='manual'>Manual time</option></select>
<select value={p.anchor} onChange={e=>p.onAnchor(e.target.value)}><option value='0'>Horizon 0°</option><option value='-6'>Civil -6°</option><option value='-12'>Nautical -12°</option><option value='-18'>Astronomical -18°</option></select>
{p.mode==='manual' && <input type='time' step={60} value={p.manualTime} onChange={e=>p.onManualTime(e.target.value)}/>}
<button onClick={p.onCompute}>Compute</button><button onClick={p.onHowTo}>How to use this webpage</button>
</div>}
