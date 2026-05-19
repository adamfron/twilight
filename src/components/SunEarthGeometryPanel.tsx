export function SunEarthGeometryPanel({ crossAz, solarAz, onEnlarge }: { crossAz: number; solarAz: number; onEnlarge: () => void }) {
  return <div className='panel'><div className='panelHeader'><h4>Sun–Earth Geometry</h4><button onClick={onEnlarge}>Enlarge</button></div><svg viewBox='0 0 520 300' preserveAspectRatio='xMidYMid meet'>
    <defs><linearGradient id='earth' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' stopColor='#c7d2fe' /><stop offset='49%' stopColor='#bfdbfe' /><stop offset='51%' stopColor='#334155' /><stop offset='100%' stopColor='#0f172a' /></linearGradient><marker id='arr' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M 0 0 L 10 5 L 0 10 z' fill='#0891b2' /></marker></defs>
    {[30, 70, 110, 150, 190].map(y => <line key={y} x1='12' y1={y} x2='140' y2={y} stroke='#f59e0b' strokeWidth='2' />)}
    <text x='12' y='20' fontSize='11' fill='#92400e'>incoming sunlight</text>
    <circle cx='220' cy='150' r='110' fill='url(#earth)' stroke='#1e3a8a' strokeWidth='2' />
    <line x1='220' y1='40' x2='220' y2='260' stroke='#64748b' strokeDasharray='4 4' />
    <circle cx='305' cy='115' r='5' fill='#ef4444' />
    <text x='314' y='113' fontSize='11'>station</text>
    <line x1='305' y1='115' x2='350' y2='70' stroke='#4f46e5' strokeWidth='2' markerEnd='url(#arr)' />
    <text x='355' y='68' fontSize='11'>local vertical</text>
    <line x1='305' y1='115' x2='420' y2='115' stroke='#0891b2' strokeWidth='2' markerEnd='url(#arr)' />
    <text x='422' y='118' fontSize='11'>cross-section direction</text>
    <line x1='305' y1='115' x2='400' y2='170' stroke='#16a34a' strokeWidth='2' markerEnd='url(#arr)' />
    <text x='403' y='174' fontSize='11'>terminator front</text>
    <text x='16' y='286' fontSize='12'>cross-section azimuth: {crossAz.toFixed(1)}°</text>
    <text x='230' y='286' fontSize='12'>solar azimuth: {solarAz.toFixed(1)}°</text>
  </svg></div>;
}
