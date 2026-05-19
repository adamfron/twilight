import { ThresholdResult } from '../types';
import { useContainerSize } from './useContainerSize';

const ok = (v: number) => Number.isFinite(v);

export function CrossSectionPanel({ results, solarAz, crossAz, timeUTC, onEnlarge, isMain }: { results: ThresholdResult[]; solarAz: number; crossAz: number; timeUTC: string; onEnlarge?: () => void; isMain?: boolean }) {
  const { ref, size } = useContainerSize<HTMLDivElement>();
  const w = Math.max(380, size.width || 900);
  const h = Math.max(isMain ? 360 : 200, (size.height || 420) - 40);
  const compact = !isMain;
  const m = { l: compact ? 44 : 64, r: 18, t: 20, b: compact ? 38 : 56 };
  const xMin = -2500, xMax = 2500, yMin = 0, yMax = 2000;
  const sx = (x: number) => m.l + ((x - xMin) / (xMax - xMin)) * (w - m.l - m.r);
  const sy = (y: number) => h - m.b - ((y - yMin) / (yMax - yMin)) * (h - m.t - m.b);
  const xt = [-2500, -1500, -500, 0, 500, 1500, 2500], yt = [0, 500, 1000, 1500, 2000];
  return <div className='panel'><div className='panelHeader'><h3>Vertical Cross-Section</h3>{onEnlarge && <button onClick={onEnlarge}>Enlarge</button>}</div><div className='panelBody' ref={ref}><svg preserveAspectRatio='none' viewBox={`0 0 ${w} ${h}`}>
    <rect x={m.l} y={m.t} width={w - m.l - m.r} height={h - m.t - m.b} fill='#f8fafc' />
    {xt.map(t => <line key={t} x1={sx(t)} x2={sx(t)} y1={m.t} y2={h - m.b} stroke='#e2e8f0' />)}{yt.map(t => <line key={t} x1={m.l} x2={w - m.r} y1={sy(t)} y2={sy(t)} stroke='#e2e8f0' />)}
    {results.map(r => { const pts = r.curve.filter(p => ok(p.x) && ok(p.z) && p.z >= 0 && p.z <= yMax && p.x >= xMin && p.x <= xMax).map(p => `${sx(p.x)},${sy(p.z)}`).join(' '); return pts ? <polyline key={r.threshold.key} fill='none' stroke={r.threshold.color} strokeWidth={2.2} points={pts} /> : null; })}
    <line x1={sx(0)} y1={m.t} x2={sx(0)} y2={h - m.b} stroke='#475569' strokeDasharray='5 4' />
    {xt.map(t => <text key={`xt-${t}`} x={sx(t)} y={h - (compact ? 18 : 30)} fontSize={compact ? '9' : '11'} textAnchor='middle'>{t}</text>)}
    {yt.map(t => <text key={`yt-${t}`} x={m.l - 8} y={sy(t) + 4} fontSize={compact ? '9' : '11'} textAnchor='end'>{t}</text>)}
    {!compact && <><text x={w / 2} y={h - 8} textAnchor='middle' fontSize='12'>Distance along terminator-normal [km]</text><text transform={`translate(16 ${h / 2}) rotate(-90)`} fontSize='12' textAnchor='middle'>Altitude [km]</text>
    <text x={sx(-2100)} y={m.t + 16} fontSize='11'>Toward daylight</text><text x={sx(1700)} y={m.t + 16} fontSize='11'>Toward night</text><text x={sx(15)} y={m.t + 30} fontSize='11'>Selected station line</text>
    <rect x={w - 280} y={m.t + 10} width={252} height={74} fill='white' opacity='0.92' stroke='#cbd5e1' /><text x={w - 270} y={m.t + 26} fontSize='11'>solar azimuth: {ok(solarAz) ? solarAz.toFixed(2) : 'N/A'}°</text><text x={w - 270} y={m.t + 40} fontSize='11'>cross-section azimuth: {ok(crossAz) ? crossAz.toFixed(2) : 'N/A'}°</text><text x={w - 270} y={m.t + 68} fontSize='11'>{timeUTC}</text></>}</svg></div></div>;
}
