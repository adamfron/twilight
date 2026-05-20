import { useMemo, useState } from 'react';
import { ThresholdResult } from '../types';
import { useContainerSize } from './useContainerSize';

const ok = (v: number) => Number.isFinite(v);
const logAlt = (z: number) => Math.log10(Math.max(0, z) + 1);
const ionoBands = [
  { label: 'D', z0: 60, z1: 90, fill: '#cbd5e140' },
  { label: 'E', z0: 90, z1: 150, fill: '#bfdbfe45' },
  { label: 'F1', z0: 150, z1: 250, fill: '#93c5fd40' },
  { label: 'F2', z0: 250, z1: 500, fill: '#60a5fa35' },
  { label: 'Topside', z0: 500, z1: 2000, fill: '#3b82f625' }
];

export function CrossSectionPanel({ results, solarAz, crossAz, timeUTC, timeLocal, showIonosphereBands, showTwilightShading, onEnlarge, isMain }: { results: ThresholdResult[]; solarAz: number; crossAz: number; timeUTC: string; timeLocal: string; showIonosphereBands: boolean; showTwilightShading: boolean; onEnlarge?: () => void; isMain?: boolean }) {
  const { ref, size } = useContainerSize<HTMLDivElement>();
  const [viewMode, setViewMode] = useState<'full' | 'ground'>('full');
  const w = Math.max(380, size.width || 900);
  const h = Math.max(isMain ? 360 : 200, (size.height || 420) - 40);
  const compact = !isMain;
  const m = { l: compact ? 44 : 64, r: 18, t: 20, b: compact ? 38 : 56 };
  const full = viewMode === 'full';
  const xMin = full ? -2500 : -5, xMax = full ? 2500 : 5, yMin = 0, yMax = full ? 2000 : 5;
  const sx = (x: number) => m.l + ((x - xMin) / (xMax - xMin)) * (w - m.l - m.r);
  const sy = (y: number) => {
    const yy = full ? logAlt(y) : y;
    const y0 = full ? logAlt(yMin) : yMin;
    const y1 = full ? logAlt(yMax) : yMax;
    return h - m.b - ((yy - y0) / (y1 - y0)) * (h - m.t - m.b);
  };
  const xt = full ? [-2500, -1500, -500, 0, 500, 1500, 2500] : [-5, -2.5, 0, 2.5, 5];
  const yt = full ? [0, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000] : [0, 1, 2, 3, 4, 5];

  const clippedCurve = (curve: Array<{ x: number; z: number }>) => curve.map(p => ({ x: Math.min(xMax, Math.max(xMin, p.x)), z: Math.min(yMax, Math.max(yMin, p.z)) }));
  const visibleAngles = useMemo(() => results.filter(r => ok(r.xGroundKm) && r.xGroundKm >= xMin && r.xGroundKm <= xMax && r.groundAngleDeg != null), [results, xMin, xMax]);

  return <div className='panel'><div className='panelHeader'><h3>Vertical Cross-Section</h3><div className='headerControls'><div className='segmented'><button className={full ? 'active' : ''} onClick={() => setViewMode('full')}>Full profile</button><button className={!full ? 'active' : ''} onClick={() => setViewMode('ground')}>Ground zoom</button></div>{onEnlarge && !isMain && <button onClick={onEnlarge}>Enlarge</button>}</div></div><div className='panelBody' ref={ref}><svg preserveAspectRatio='none' viewBox={`0 0 ${w} ${h}`}>
    <rect x={m.l} y={m.t} width={w - m.l - m.r} height={h - m.t - m.b} fill='#f8fafc' />
    {showIonosphereBands && full && ionoBands.map(b => <g key={b.label}><rect x={m.l} y={sy(b.z1)} width={w - m.l - m.r} height={sy(b.z0) - sy(b.z1)} fill={b.fill} /><text x={m.l + 6} y={sy((b.z0 + b.z1) / 2) + 4} fontSize={compact ? '8' : '10'} fill='#334155'>{b.label}</text></g>)}
    {xt.map(t => <line key={t} x1={sx(t)} x2={sx(t)} y1={m.t} y2={h - m.b} stroke='#e2e8f0' />)}{yt.map(t => <line key={t} x1={m.l} x2={w - m.r} y1={sy(t)} y2={sy(t)} stroke='#e2e8f0' />)}
    {showTwilightShading && results.map(r => {
      const pts = clippedCurve(r.curve).filter(p => ok(p.x) && ok(p.z));
      if (pts.length < 2) return null;
      const path = `M ${sx(pts[0].x)} ${sy(0)} ` + pts.map(p => `L ${sx(p.x)} ${sy(p.z)}`).join(' ') + ` L ${sx(pts[pts.length - 1].x)} ${sy(0)} Z`;
      return <path key={`shade-${r.threshold.key}`} d={path} fill='#334155' opacity='0.06' />;
    })}
    {results.map(r => { const pts = clippedCurve(r.curve).filter(p => ok(p.x) && ok(p.z)).map(p => `${sx(p.x)},${sy(p.z)}`).join(' '); return pts ? <polyline key={r.threshold.key} fill='none' stroke={r.threshold.color} strokeWidth={2.2} points={pts} /> : null; })}
    <line x1={sx(0)} y1={m.t} x2={sx(0)} y2={h - m.b} stroke='#475569' strokeDasharray='5 4' />
    {visibleAngles.map((r, i) => <text key={`inc-${r.threshold.key}`} x={sx(r.xGroundKm) + 5} y={sy(0) - 6 - (i * 12)} fontSize={compact ? '8' : '10'} fill={r.threshold.color}>∠g {r.groundAngleDeg?.toFixed(2)}°</text>)}
    {xt.map(t => <text key={`xt-${t}`} x={sx(t)} y={h - (compact ? 18 : 30)} fontSize={compact ? '9' : '11'} textAnchor='middle'>{t}</text>)}
    {yt.map(t => <text key={`yt-${t}`} x={m.l - 8} y={sy(t) + 4} fontSize={compact ? '9' : '11'} textAnchor='end'>{t}</text>)}
    <text x={w / 2} y={h - 8} textAnchor='middle' fontSize={compact ? '10' : '12'}>{compact ? 'Dist. [km]' : 'Distance along terminator-normal [km]'}</text><text transform={`translate(16 ${h / 2}) rotate(-90)`} fontSize={compact ? '10' : '12'} textAnchor='middle'>{compact ? 'Alt. [km]' : 'Altitude [km]'}</text>
    {!compact && <>
    <text x={sx(full ? -2100 : -4.2)} y={m.t + 16} fontSize='11'>Toward daylight</text><text x={sx(full ? 1700 : 2.5)} y={m.t + 16} fontSize='11'>Toward night</text><text x={sx(0.3)} y={m.t + 30} fontSize='11'>Selected station line</text>
    <rect x={w - 290} y={m.t + 10} width={262} height={88} fill='white' opacity='0.92' stroke='#cbd5e1' /><text x={w - 280} y={m.t + 26} fontSize='11'>solar azimuth: {ok(solarAz) ? solarAz.toFixed(2) : 'N/A'}°</text><text x={w - 280} y={m.t + 40} fontSize='11'>cross-section azimuth: {ok(crossAz) ? crossAz.toFixed(2) : 'N/A'}°</text><text x={w - 280} y={m.t + 54} fontSize='11'>UTC: {timeUTC}</text><text x={w - 280} y={m.t + 68} fontSize='11'>Local: {timeLocal}</text></>}</svg></div></div>;
}
