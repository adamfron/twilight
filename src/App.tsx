import { useMemo, useState } from 'react';
import { stations } from './data/stations';
import { InputBar } from './components/InputBar';
import { solarPositionUTC } from './math/solarPosition';
import { ThresholdDef, TimeMode } from './types';
import { computeThresholdResult } from './math/terminatorGeometry';
import { CrossSectionPanel } from './components/CrossSectionPanel';
import { ControlStrip } from './components/ControlStrip';
import { download } from './math/export';
import { SunEarthGeometryPanel } from './components/SunEarthGeometryPanel';
import { LocalMapPanel } from './components/LocalMapPanel';
import { TimelineDiagnosticsPanel } from './components/TimelineDiagnosticsPanel';
import { ReferencesFooter } from './components/ReferencesFooter';

const defs:ThresholdDef[]=[{key:'horizon',label:'Horizon (0°)',angleDeg:0,color:'#1d4ed8',active:true},{key:'civil',label:'Civil (-6°)',angleDeg:-6,color:'#059669',active:true},{key:'nautical',label:'Nautical (-12°)',angleDeg:-12,color:'#d97706',active:true},{key:'astronomical',label:'Astronomical (-18°)',angleDeg:-18,color:'#7c3aed',active:true}];

export default function App(){
  const [stationId,setStationId]=useState(stations[0].id); const [dateTime,setDateTime]=useState('2026-05-19T04:00'); const [mode,setMode]=useState<TimeMode>('manual'); const [anchor,setAnchor]=useState('0');
  const station=stations.find(s=>s.id===stationId)!;
  const solar=solarPositionUTC(new Date(dateTime+'Z'),station.latitude,station.longitude);
  const results=useMemo(()=>defs.map(d=>computeThresholdResult(solar.elevationDeg,d)),[solar.elevationDeg]);
  const onExport=(fmt:'csv'|'json')=>{ if(fmt==='json') download('twilight.json',JSON.stringify({station,dateTimeUTC:new Date(dateTime+'Z').toISOString(),mode,anchor,solar,results},null,2),'application/json'); else download('twilight.csv','threshold,xGroundKm,groundAngleDeg,status\n'+results.map(r=>`${r.threshold.label},${r.xGroundKm},${r.groundAngleDeg},${r.status}`).join('\n'),'text/csv'); };
  return <div className='app'><header><h1>TWILIGHT</h1><p>Terminator Web Interface for Local Inclination Geometry, Heights & Twilight</p></header>
    <InputBar stations={stations} stationId={stationId} onStation={setStationId} dateTime={dateTime} onDateTime={setDateTime} mode={mode} onMode={setMode} anchor={anchor} onAnchor={setAnchor} onCompute={()=>{}}/>
    <main><section className='left'><CrossSectionPanel results={results}/></section><aside className='right'><SunEarthGeometryPanel/><LocalMapPanel/><TimelineDiagnosticsPanel elev={solar.elevationDeg} az={solar.azimuthDeg}/></aside></main>
    <ControlStrip onExport={onExport}/><ReferencesFooter/></div>;
}
