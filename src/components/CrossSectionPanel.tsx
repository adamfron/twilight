import { ThresholdResult } from '../types';

const safe = (v: number, fallback = 0) => (Number.isFinite(v) ? v : fallback);

export function CrossSectionPanel({ results }: { results: ThresholdResult[] }) {
  const w = 760;
  const h = 380;
  const xMin = -1000;
  const xMax = 1000;
  const yMin = 0;
  const yMax = 500;
  const sx = (x: number) => ((safe(x) - xMin) / (xMax - xMin)) * w;
  const sy = (y: number) => h - ((safe(y) - yMin) / (yMax - yMin)) * h;

  return <div className='panel'><h3>Vertical Cross-Section</h3><svg width={w} height={h}>{results.map(r => <polyline key={r.threshold.key} fill='none' stroke={r.threshold.color} strokeWidth={2} points={r.curve.map(p => `${sx(p.x)},${sy(p.z)}`).join(' ')} />)}<line x1={sx(0)} y1={0} x2={sx(0)} y2={h} stroke='#666' strokeDasharray='4 4' /></svg>
    <table><thead><tr><th>Threshold</th><th>Ground intersection distance [km]</th><th>Ground angle [deg]</th><th>Angle at 90 km [deg]</th><th>Angle at 110 km [deg]</th><th>Status</th></tr></thead>
      <tbody>{results.map(r => <tr key={r.threshold.key}><td>{r.threshold.label}</td><td>{Number.isFinite(r.xGroundKm) ? r.xGroundKm.toFixed(2) : 'N/A'}</td><td>{r.groundAngleDeg != null && Number.isFinite(r.groundAngleDeg) ? r.groundAngleDeg.toFixed(2) : 'N/A'}</td><td>{r.angleAt90Deg != null && Number.isFinite(r.angleAt90Deg) ? r.angleAt90Deg.toFixed(2) : 'N/A'}</td><td>{r.angleAt110Deg != null && Number.isFinite(r.angleAt110Deg) ? r.angleAt110Deg.toFixed(2) : 'N/A'}</td><td>{r.status}</td></tr>)}</tbody></table></div>;
}
