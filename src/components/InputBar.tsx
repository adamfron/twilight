import { CSSProperties } from 'react';
import { Station, ThresholdKey, TimeMode } from '../types';

interface P {
  stations: Station[];
  stationId: string;
  onStation: (s: string) => void;
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

const anchors: Array<{ value: string; label: string; color: string; key: ThresholdKey }> = [
  { value: '0', label: 'Horizon 0°', color: '#1d4ed8', key: 'horizon' },
  { value: '-6', label: 'Civil -6°', color: '#059669', key: 'civil' },
  { value: '-12', label: 'Nautical -12°', color: '#d97706', key: 'nautical' },
  { value: '-18', label: 'Astronomical -18°', color: '#7c3aed', key: 'astronomical' }
];

export function InputBar(p: P) {
  return <div className='inputBar'>
    <div className='controlRow'>
      <select value={p.stationId} onChange={e => p.onStation(e.target.value)}>{p.stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
      <input type='date' value={p.date} onChange={e => p.onDate(e.target.value)} />
      {p.mode === 'manual' && <input type='time' step={60} value={p.manualTime} onChange={e => p.onManualTime(e.target.value)} />}
      <button onClick={p.onCompute}>Compute</button>
      <button onClick={p.onHowTo}>How to use this webpage</button>
    </div>
    <div className='controlRow'>
      <div className='segmented'>{modes.map(m => <button key={m.key} className={p.mode === m.key ? 'active' : ''} onClick={() => p.onMode(m.key)}>{m.label}</button>)}</div>
      <div className='segmented anchor'>{anchors.map(a => <button key={a.value} className={p.anchor === a.value ? 'active' : ''} style={{ '--chip': a.color } as CSSProperties} onClick={() => p.onAnchor(a.value)}>{a.label}</button>)}</div>
      <div className='chipGroup'>{anchors.map(a => <button key={a.key} className={p.visibleThresholds.includes(a.key) ? 'chip active' : 'chip'} style={{ '--chip': a.color } as CSSProperties} onClick={() => p.onToggleThreshold(a.key)}>{a.label}</button>)}</div>
    </div>
  </div>;
}
