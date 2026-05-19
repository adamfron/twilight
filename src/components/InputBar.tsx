import { Station, TimeMode, ThresholdDef } from '../types';
interface P{stations:Station[];stationId:string;onStation:(s:string)=>void;dateTime:string;onDateTime:(v:string)=>void;mode:TimeMode;onMode:(m:TimeMode)=>void;anchor:string;onAnchor:(a:string)=>void;onCompute:()=>void;}
export function InputBar(p:P){return <div className='inputBar'>
<select value={p.stationId} onChange={e=>p.onStation(e.target.value)}>{p.stations.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>
<input type='datetime-local' value={p.dateTime} onChange={e=>p.onDateTime(e.target.value)}/>
<select value={p.mode} onChange={e=>p.onMode(e.target.value as TimeMode)}><option value='morning'>Morning terminator</option><option value='evening'>Evening terminator</option><option value='manual'>Manual time</option></select>
<select value={p.anchor} onChange={e=>p.onAnchor(e.target.value)}><option>0</option><option>-6</option><option>-12</option><option>-18</option></select>
<button onClick={p.onCompute}>Compute</button><button>How to use this webpage</button>
</div>}
