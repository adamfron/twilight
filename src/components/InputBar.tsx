import { CSSProperties } from 'react';
import { Station, ThresholdKey, TimeMode } from '../types';

interface P {
  stations: Station[];
  stationId: string;
  onStation: (s: string) => void;
  customLat: number;
  customLon: number;
  customAltM: number;
  onCustomLat: (v:number)=>void;
  onCustomLon: (v:number)=>void;
  onCustomAltM: (v:number)=>void;
  date: string;
  onDate: (v: string) => void;
  manualTime: string;
  onManualTime: (v: string) => void;
  mode: TimeMode;
  onMode: (m: TimeMode) => void;
  anchor: string;
  onAnchor: (a: string) => void;
  visibleThresholds: ThresholdKey[];
  onToggleThreshold: (k: ThresholdKey) => void;
  onCompute: () => void;
  onHowTo: () => void;
}

const modes: Array<{ key: TimeMode; label: string }> = [
  { key: 'morning', label: 'Morning terminator' },
  { key: 'evening', label: 'Evening terminator' },
  { key: 'manual', label: 'Manual time' }
];

const anchors: Array<{ value: string; label: string; color: string; key: ThresholdKey; short: string }> = [
  { value: '0', label: 'Horizon 0°', color: '#1d4ed8', key: 'horizon', short: 'H 0°' },
  { value: '-6', label: 'Civil -6°', color: '#059669', key: 'civil', short: 'C -6°' },
  { value: '-12', label: 'Nautical -12°', color: '#d97706', key: 'nautical', short: 'N -12°' },
  { value: '-18', label: 'Astronomical -18°', color: '#7c3aed', key: 'astronomical', short: 'A -18°' }
];

export function InputBar(p: P) {
  return <div className='inputBar'>
    <div className='controlRow compact'>
      <select value={p.stationId} onChange={e => p.onStation(e.target.value)}>{p.stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}<option value='custom'>Custom position</option></select>
      {p.stationId === 'custom' && <>
        <input type='number' step='0.0001' value={p.customLat} onChange={e => p.onCustomLat(Number(e.target.value))} placeholder='Latitude' />
        <input type='number' step='0.0001' value={p.customLon} onChange={e => p.onCustomLon(Number(e.target.value))} placeholder='Longitude' />
        <input type='number' step='1' value={p.customAltM} onChange={e => p.onCustomAltM(Number(e.target.value))} placeholder='Altitude [m]' />
      </>}
      <input type='date' value={p.date} onChange={e => p.onDate(e.target.value)} />
      {p.mode === 'manual' && <input type='time' step={60} value={p.manualTime} onChange={e => p.onManualTime(e.target.value)} />}
      <div className='segmented'>{modes.map(m => <button key={m.key} className={p.mode === m.key ? 'active' : ''} onClick={() => p.onMode(m.key)}>{m.label}</button>)}</div>
      <div className='chipGroup'>{anchors.map(a => <button key={a.key} className={p.visibleThresholds.includes(a.key) ? 'chip active' : 'chip'} style={{ '--chip': a.color } as CSSProperties} onClick={() => p.onToggleThreshold(a.key)}>{a.label}{p.anchor === a.value && <span className='anchorDot'>●</span>}</button>)}</div>
      <div className='segmented anchor'>
        <span className='compactLabel'>Event anchor</span>
        {anchors.map(a => <button key={a.value} className={p.anchor === a.value ? 'active' : ''} style={{ '--chip': a.color } as CSSProperties} onClick={() => p.onAnchor(a.value)}>{a.short}</button>)}
      </div>
      <button className='computeBtn' onClick={p.onCompute}>Compute</button>
      <button className='helpBtn' aria-label='How to use this webpage' onClick={p.onHowTo}>?</button>
    </div>
  </div>;
}
