import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useContainerSize } from './useContainerSize';

function MapResizeWatcher({ watch }: { watch: string }) {
  const map = useMap();
  useEffect(() => { setTimeout(() => map.invalidateSize(), 80); }, [map, watch]);
  return null;
}

export function LocalMapPanel({ lat, lon, crossAz, frontAz, onEnlarge, mapState, isMain }: { lat: number; lon: number; crossAz: number; frontAz: number; onEnlarge: () => void; mapState: string; isMain?: boolean }) {
  const { ref, size } = useContainerSize<HTMLDivElement>();
  const overlay = useMemo(() => {
    const w = Math.max(200, size.width), h = Math.max(130, size.height - 34);
    const cx = w / 2, cy = h / 2;
    const cr = ((crossAz - 90) * Math.PI) / 180;
    const fr = ((frontAz - 90) * Math.PI) / 180;
    const vx = Math.cos(cr), vy = Math.sin(cr);
    const fx = Math.cos(fr), fy = Math.sin(fr);
    const len = Math.min(w, h) * 0.42;
    return {
      w, h, cx, cy,
      arrow: `${cx},${cy} ${cx + vx * len},${cy + vy * len}`,
      front: `${cx - fx * len},${cy - fy * len} ${cx + fx * len},${cy + fy * len}`,
      night: `${cx - fx * len},${cy - fy * len} ${cx + fx * len},${cy + fy * len} ${cx + fx * len + vx * len * 1.4},${cy + fy * len + vy * len * 1.4} ${cx - fx * len + vx * len * 1.4},${cy - fy * len + vy * len * 1.4}`
    };
  }, [size.width, size.height, crossAz, frontAz]);

  return <div className='panel'><div className='panelHeader'><h4>Local Map (placeholder)</h4>{!isMain && <button onClick={onEnlarge}>Enlarge</button>}</div><div className='panelBody mapWrap' ref={ref}><MapContainer center={[lat, lon]} zoom={7} style={{ height: '100%', width: '100%' }} zoomControl={false} dragging={false} doubleClickZoom={false} scrollWheelZoom={false}><MapResizeWatcher watch={mapState + size.width} /><TileLayer attribution='&copy; OpenStreetMap contributors' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' /><Marker position={[lat, lon]} /></MapContainer>
    <svg className='mapOverlay' viewBox={`0 0 ${overlay.w} ${overlay.h}`} preserveAspectRatio='none'>
      <line x1={overlay.front.split(' ')[0].split(',')[0]} y1={overlay.front.split(' ')[0].split(',')[1]} x2={overlay.front.split(' ')[1].split(',')[0]} y2={overlay.front.split(' ')[1].split(',')[1]} stroke='#16a34a' strokeWidth='2' strokeDasharray='8 5' />
      <polyline points={overlay.arrow} stroke='#2563eb' strokeWidth='3' fill='none' />
      <polygon points={`${overlay.w / 2 + Math.cos((crossAz - 90) * Math.PI / 180) * (Math.min(overlay.w, overlay.h) * 0.42)},${overlay.h / 2 + Math.sin((crossAz - 90) * Math.PI / 180) * (Math.min(overlay.w, overlay.h) * 0.42)} ${overlay.w / 2 + Math.cos((crossAz - 130) * Math.PI / 180) * (Math.min(overlay.w, overlay.h) * 0.34)},${overlay.h / 2 + Math.sin((crossAz - 130) * Math.PI / 180) * (Math.min(overlay.w, overlay.h) * 0.34)} ${overlay.w / 2 + Math.cos((crossAz - 50) * Math.PI / 180) * (Math.min(overlay.w, overlay.h) * 0.34)},${overlay.h / 2 + Math.sin((crossAz - 50) * Math.PI / 180) * (Math.min(overlay.w, overlay.h) * 0.34)}`} fill='#2563eb' />
      <circle cx={overlay.cx} cy={overlay.cy} r='5' fill='#ef4444' stroke='white' strokeWidth='1.5' />
      <text x='8' y='14' fontSize='11'>Detailed Earth-shadow overlay planned.</text>
    </svg></div></div>;
}
