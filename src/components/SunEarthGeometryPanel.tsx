import { useContainerSize } from './useContainerSize';

export function SunEarthGeometryPanel({ crossAz, solarAz, declinationDeg, onEnlarge, isMain }: { crossAz: number; solarAz: number; declinationDeg: number; onEnlarge: () => void; isMain?: boolean }) {
  const { ref, size } = useContainerSize<HTMLDivElement>();
  const w = Math.max(320, size.width || 520);
  const h = Math.max(180, (size.height || 300) - 40);
  const cx = w * 0.48, cy = h * 0.5, r = Math.min(w, h) * 0.28;
  const axisTilt = Math.max(-23.4, Math.min(23.4, declinationDeg));
  const axisRad = (-axisTilt * Math.PI) / 180;
  const dx = Math.cos(axisRad) * r * 1.35;
  const dy = Math.sin(axisRad) * r * 1.35;
  const stationX = cx + r * 0.76, stationY = cy - r * 0.32;
  return <div className='panel'><div className='panelHeader'><h4>Sun–Earth Geometry (placeholder)</h4>{!isMain && <button onClick={onEnlarge}>Enlarge</button>}</div><div className='panelBody' ref={ref}><svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio='none'>
    <rect x='0' y='0' width={w} height={h} fill='#f8fafc' />
    {[0.18, 0.33, 0.48, 0.63, 0.78].map(f => <line key={f} x1={10} y1={h * f} x2={cx - r - 12} y2={h * f} stroke='#f59e0b' strokeWidth='1.6' />)}
    <circle cx={cx} cy={cy} r={r} fill='#c7d2fe' stroke='#1e3a8a' strokeWidth='2' />
    <path d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r}`} fill='#0f172a' opacity='0.65' />
    <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke='#334155' strokeWidth='1.2' />
    <line x1={cx - dx} y1={cy + dy} x2={cx + dx} y2={cy - dy} stroke='#16a34a' strokeWidth='2' />
    <circle cx={stationX} cy={stationY} r='4' fill='#ef4444' />
    <line x1={stationX} y1={stationY} x2={stationX + r * 0.48} y2={stationY - r * 0.34} stroke='#4f46e5' strokeWidth='1.8' />
    <line x1={stationX} y1={stationY} x2={stationX + r * 0.85} y2={stationY} stroke='#0891b2' strokeWidth='1.8' />
    <text x={stationX + 6} y={stationY - 8} fontSize='10'>station</text>
    <text x={stationX + r * 0.5} y={stationY - r * 0.36} fontSize='10'>local vertical</text>
    <text x={stationX + r * 0.86} y={stationY - 5} fontSize='10'>cross-sec dir</text>
    <text x='10' y='16' fontSize='11'>incoming sunlight</text>
    <text x={cx - r * 0.85} y={cy - r - 6} fontSize='10'>Earth axis</text>
    <text x={w * 0.05} y={h - 10} fontSize='11'>Declination: {declinationDeg.toFixed(1)}°</text>
    <text x={w * 0.42} y={h - 10} fontSize='11'>Cross az: {crossAz.toFixed(1)}°</text>
    <text x={w * 0.68} y={h - 10} fontSize='11'>Solar az: {solarAz.toFixed(1)}°</text><text x='10' y={h - 24} fontSize='10'>Detailed Sun-Earth geometry overlay is planned.</text>
  </svg></div></div>;
}
