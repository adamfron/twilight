import { useMemo, useState } from 'react';
import { stations } from './data/stations';
import { InputBar } from './components/InputBar';
import { solarPositionUTC } from './math/solarPosition';
import { PanelKey, ThresholdDef, ThresholdKey, TimeMode } from './types';
import { computeThresholdResult } from './math/terminatorGeometry';
import { CrossSectionPanel } from './components/CrossSectionPanel';
import { ControlStrip } from './components/ControlStrip';
import { download } from './math/export';
import { SunEarthGeometryPanel } from './components/SunEarthGeometryPanel';
import { LocalMapPanel } from './components/LocalMapPanel';
import { TimelineDiagnosticsPanel } from './components/TimelineDiagnosticsPanel';
import { ReferencesFooter } from './components/ReferencesFooter';
import { bisectRoot } from './math/rootFinding';
import { HowToUseModal } from './components/HowToUseModal';

const defs: ThresholdDef[] = [{ key: 'horizon', label: 'Horizon (0°)', angleDeg: 0, color: '#1d4ed8', active: true }, { key: 'civil', label: 'Civil (-6°)', angleDeg: -6, color: '#059669', active: true }, { key: 'nautical', label: 'Nautical (-12°)', angleDeg: -12, color: '#d97706', active: true }, { key: 'astronomical', label: 'Astronomical (-18°)', angleDeg: -18, color: '#7c3aed', active: true }];
const toIso = (d: Date) => d.toISOString().slice(0, 16);
const panelCode: Record<PanelKey, string> = { cross: 'XSEC', geometry: 'SGEO', map: 'MAP', timeline: 'DIAG' };

export default function App() {
  const [stationId, setStationId] = useState(stations[0].id); const [date, setDate] = useState('2026-05-19'); const [manualTime, setManualTime] = useState('04:00'); const [mode, setMode] = useState<TimeMode>('manual'); const [anchor, setAnchor] = useState('0');
  const [activeUtc, setActiveUtc] = useState('2026-05-19T04:00'); const [main, setMain] = useState<PanelKey>('cross'); const [status, setStatus] = useState(''); const [howTo, setHowTo] = useState(false);
  const [visibleThresholds, setVisibleThresholds] = useState<ThresholdKey[]>(defs.map(d => d.key));
  const station = stations.find(s => s.id === stationId)!; const anchorDef = defs.find(d => d.angleDeg === Number(anchor))!;
  const computeTime = () => { if (mode === 'manual') return `${date}T${manualTime}`; const start = new Date(`${date}T00:00:00Z`); const f = (m: number) => solarPositionUTC(new Date(start.getTime() + m * 60000), station.latitude, station.longitude).elevationDeg - anchorDef.angleDeg; let root: number | null = null; for (let a = 0; a < 24 * 60 - 30; a += 30) { const b = a + 30; const fa = f(a), fb = f(b); if (!Number.isFinite(fa) || !Number.isFinite(fb)) continue; if (fa === 0 || fa * fb <= 0) { const r = bisectRoot(f, a, b, 1e-4, 50); if (r != null) { const up = f(Math.min(r + 1, 1439)) - f(Math.max(r - 1, 0)); if ((mode === 'morning' && up > 0) || (mode === 'evening' && up < 0)) { root = r; break; } } } } if (root == null) { setStatus('No crossing on selected date'); return activeUtc; } const d = new Date(start.getTime() + root * 60000); return toIso(d); };
  const onCompute = () => setActiveUtc(computeTime());
  const activeDate = new Date(activeUtc + 'Z'); const solar = solarPositionUTC(activeDate, station.latitude, station.longitude);
  const crossAz = (solar.azimuthDeg + 180) % 360, frontAz = (crossAz + 90) % 360;
  const results = useMemo(() => defs.map(d => computeThresholdResult(solar.elevationDeg, d)), [solar.elevationDeg]);
  const filteredResults = results.map(r => ({ ...r, curve: visibleThresholds.includes(r.threshold.key) ? r.curve : [] }));
  const timeline = Array.from({ length: 97 }, (_, i) => { const h = i * 0.25; const d = new Date(`${date}T00:00:00Z`); d.setUTCMinutes(d.getUTCMinutes() + h * 60); return { h, e: solarPositionUTC(d, station.latitude, station.longitude).elevationDeg }; });
  const onExport = (fmt: 'csv' | 'json') => { const payload = { station, dateTimeUTC: new Date(activeUtc + 'Z').toISOString(), mode, anchor, solar, crossSectionAzimuthDeg: crossAz, terminatorFrontAzimuthDeg: frontAz, results }; if (fmt === 'json') download('twilight.json', JSON.stringify(payload, null, 2), 'application/json'); else download('twilight.csv', 'threshold,xGroundKm,groundAngleDeg,status,crossAzimuthDeg,terminatorFrontAzimuthDeg\n' + results.map(r => `${r.threshold.label},${r.xGroundKm},${r.groundAngleDeg},${r.status},${crossAz},${frontAz}`).join('\n'), 'text/csv'); };
  const onStep = (m: number) => { const d = new Date(activeUtc + 'Z'); d.setUTCMinutes(d.getUTCMinutes() + m); setActiveUtc(toIso(d)); };
  const exportName = () => {
    const site = station.id === 'pl612' ? 'PL612' : station.id === 'lama' ? 'LAMA' : 'CUSTOM';
    const ts = new Date(activeUtc + 'Z').toISOString().replace(/[-:]/g, '').replace('.000', '');
    const modeCode = mode === 'morning' ? 'MOR' : mode === 'evening' ? 'EVE' : 'MAN';
    const anchorCode = ({ '0': 'H00', '-6': 'C06', '-12': 'N12', '-18': 'A18' } as Record<string, string>)[anchor] ?? 'H00';
    return `TWI0VIS_${site}_${ts.slice(0, 8)}T${ts.slice(9, 15)}Z_${modeCode}_${anchorCode}_${panelCode[main]}.png`;
  };
  const onPng = async () => {
    const panel = document.querySelector('.left .panel') as HTMLElement | null;
    if (!panel) return setStatus('No active panel found.');
    try {
      const rect = panel.getBoundingClientRect();
      const clone = panel.cloneNode(true) as HTMLElement;
      clone.style.margin = '0';
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${Math.round(rect.width)}' height='${Math.round(rect.height)}'><foreignObject width='100%' height='100%'>${new XMLSerializer().serializeToString(clone)}</foreignObject></svg>`;
      const img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
      const canvas = document.createElement('canvas'); canvas.width = Math.round(rect.width * 2); canvas.height = Math.round(rect.height * 2);
      const ctx = canvas.getContext('2d'); if (!ctx) return setStatus('PNG failed.');
      ctx.scale(2, 2); ctx.drawImage(img, 0, 0);
      canvas.toBlob(b => { if (!b) return setStatus('PNG failed.'); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = exportName(); a.click(); setStatus('PNG exported from active panel.'); });
    } catch {
      setStatus(main === 'map' ? 'Map export may be blocked by tile security policy. Try cross/geometry/timeline.' : 'PNG export failed for this panel.');
    }
  };

  const onCopy = async () => { const txt = `TWILIGHT\nStation: ${station.name}\nLat/Lon/Alt: ${station.latitude}, ${station.longitude}, ${station.altitudeM} m\nUTC: ${new Date(activeUtc + 'Z').toISOString()}\nMode: ${mode}\nAnchor: ${anchorDef.label}\nSolar elevation: ${solar.elevationDeg.toFixed(2)}\nSolar azimuth: ${solar.azimuthDeg.toFixed(2)}\nCross-section azimuth: ${crossAz.toFixed(2)}\nTerminator-front azimuth: ${frontAz.toFixed(2)}`; try { await navigator.clipboard.writeText(txt); setStatus('Copied results to clipboard'); } catch { setStatus(txt); } };
  const mapState = `${main}-${station.latitude.toFixed(3)}-${station.longitude.toFixed(3)}-${crossAz.toFixed(2)}`;
  const panels = { cross: <CrossSectionPanel results={filteredResults} solarAz={solar.azimuthDeg} crossAz={crossAz} timeUTC={new Date(activeUtc + 'Z').toISOString()} onEnlarge={() => setMain('cross')} isMain={main === 'cross'} />, geometry: <SunEarthGeometryPanel crossAz={crossAz} solarAz={solar.azimuthDeg} onEnlarge={() => setMain('geometry')} />, map: <LocalMapPanel lat={station.latitude} lon={station.longitude} crossAz={crossAz} onEnlarge={() => setMain('map')} mapState={mapState} />, timeline: <TimelineDiagnosticsPanel timeline={timeline} selectedHour={activeDate.getUTCHours() + activeDate.getUTCMinutes() / 60} elev={solar.elevationDeg} solarAz={solar.azimuthDeg} crossAz={crossAz} frontAz={frontAz} anchor={anchorDef} mode={mode} eventTime={mode === 'manual' ? '' : new Date(activeUtc + 'Z').toISOString().slice(11, 16)} status={status} onEnlarge={() => setMain('timeline')} isMain={main === 'timeline'} /> };
  const right = (['cross', 'geometry', 'map', 'timeline'] as PanelKey[]).filter(k => k !== main);
  return <div className='app'><header><h1>TWILIGHT</h1><p>Terminator Web Interface for Local Inclination Geometry, Heights & Twilight</p></header>
    <InputBar stations={stations} stationId={stationId} onStation={setStationId} date={date} onDate={setDate} manualTime={manualTime} onManualTime={setManualTime} mode={mode} onMode={setMode} anchor={anchor} onAnchor={setAnchor} onCompute={onCompute} onHowTo={() => setHowTo(true)} visibleThresholds={visibleThresholds} onToggleThreshold={k => setVisibleThresholds(v => v.includes(k) ? v.filter(x => x !== k) : [...v, k])} />
    <main><section className='left'>{panels[main]}</section><aside className='right'>{right.map(k => <div key={k} className='stacked'>{panels[k]}</div>)}</aside></main>
    <ControlStrip onExport={onExport} onStep={onStep} onPng={onPng} onCopy={onCopy} status={status} /><ReferencesFooter /><HowToUseModal open={howTo} onClose={() => setHowTo(false)} /></div>;
}
