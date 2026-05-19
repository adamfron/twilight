import { ThresholdDef, TimeMode } from '../types';

export function TimelineDiagnosticsPanel({ timeline, selectedHour, elev, solarAz, crossAz, frontAz, anchor, mode, eventTime, status, onEnlarge, isMain }: { timeline: Array<{ h: number; e: number }>; selectedHour: number; elev: number; solarAz: number; crossAz: number; frontAz: number; anchor: ThresholdDef; mode: TimeMode; eventTime: string; status: string; onEnlarge: () => void; isMain?: boolean }) {
  const w = 720, h = isMain ? 360 : 220, p = 42;
  const min = -30, max = 60;
  const sx = (x: number) => p + (x / 24) * (w - 2 * p), sy = (y: number) => h - p - ((y - min) / (max - min)) * (h - 2 * p);
  const thresholds = [{ y: 0, c: '#1d4ed8', label: '0°' }, { y: -6, c: '#059669', label: '-6°' }, { y: -12, c: '#d97706', label: '-12°' }, { y: -18, c: '#7c3aed', label: '-18°' }];
  return <div className='panel'><div className='panelHeader'><h4>Solar Timeline & Diagnostics</h4><button onClick={onEnlarge}>Enlarge</button></div><svg preserveAspectRatio='none' viewBox={`0 0 ${w} ${h}`}>{thresholds.map(t => <g key={t.y}><line x1={p} x2={w - p} y1={sy(t.y)} y2={sy(t.y)} stroke={t.c} strokeDasharray='4 4' /><text x={w - p + 4} y={sy(t.y) + 4} fontSize='10'>{t.label}</text></g>)}<polyline fill='none' stroke='#2563eb' strokeWidth='2' points={timeline.map(d => `${sx(d.h)},${sy(d.e)}`).join(' ')} /><line x1={sx(selectedHour)} x2={sx(selectedHour)} y1={p} y2={h - p} stroke='#ef4444' />
    <line x1={p} x2={w - p} y1={h - p} y2={h - p} stroke='#334155' /><line x1={p} x2={p} y1={p} y2={h - p} stroke='#334155' />
    {[0, 6, 12, 18, 24].map(x => <g key={x}><line x1={sx(x)} x2={sx(x)} y1={h - p} y2={h - p + 6} stroke='#334155' /><text x={sx(x)} y={h - 10} fontSize='10' textAnchor='middle'>{x}</text></g>)}
    {[-30, -18, -12, -6, 0, 15, 30, 45, 60].map(y => <g key={y}><line x1={p - 5} x2={p} y1={sy(y)} y2={sy(y)} stroke='#334155' /><text x={p - 8} y={sy(y) + 3} textAnchor='end' fontSize='10'>{y}</text></g>)}
    <text x={w / 2} y={h - 2} textAnchor='middle' fontSize='11'>UTC hour</text><text transform={`translate(14 ${h / 2}) rotate(-90)`} textAnchor='middle' fontSize='11'>Solar elevation [deg]</text>
  </svg>
    <table><tbody><tr><td>Solar elevation now</td><td>{elev.toFixed(2)}°</td></tr><tr><td>Solar azimuth now</td><td>{solarAz.toFixed(2)}°</td></tr><tr><td>Cross-section azimuth</td><td>{crossAz.toFixed(2)}°</td></tr><tr><td>Terminator-front azimuth</td><td>{frontAz.toFixed(2)}°</td></tr><tr><td>Anchor</td><td>{anchor.label}</td></tr><tr><td>{mode} event time</td><td>{eventTime || 'N/A'}</td></tr><tr><td>Status</td><td>{status}</td></tr></tbody></table></div>;
}
