import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useContainerSize } from './useContainerSize';

function MapResizeWatcher({ watch }: { watch: string }) {
  const map = useMap();
  useEffect(() => { setTimeout(() => map.invalidateSize(), 80); }, [map, watch]);
  return null;
}

export function LocalMapPanel({ lat, lon, crossAz, onEnlarge, mapState }: { lat: number; lon: number; crossAz: number; onEnlarge: () => void; mapState: string }) {
  const { ref, size } = useContainerSize<HTMLDivElement>();
  const overlay = useMemo(() => {
    const w = Math.max(200, size.width), h = Math.max(130, size.height - 34);
    const cx = w / 2, cy = h / 2;
    const rad = ((crossAz - 90) * Math.PI) / 180;
    const vx = Math.cos(rad), vy = Math.sin(rad);
    const px = -vy, py = vx;
    const len = Math.min(w, h) * 0.42;
    return {
      w, h, cx, cy,
      arrow: `${cx},${cy} ${cx + vx * len},${cy + vy * len}`,
      front: `${cx - px * len},${cy - py * len} ${cx + px * len},${cy + py * len}`,
      night: `${cx - px * len},${cy - py * len} ${cx + px * len},${cy + py * len} ${cx + px * len + vx * len * 1.6},${cy + py * len + vy * len * 1.6} ${cx - px * len + vx * len * 1.6},${cy - py * len + vy * len * 1.6}`
    };
  }, [size.width, size.height, crossAz]);

  return <div className='panel'><div className='panelHeader'><h4>Local Map</h4><button onClick={onEnlarge}>Enlarge</button></div><div className='panelBody mapWrap' ref={ref}><MapContainer center={[lat, lon]} zoom={7} style={{ height: '100%', width: '100%' }} zoomControl={false} dragging={false} doubleClickZoom={false} scrollWheelZoom={false}><MapResizeWatcher watch={mapState + size.width} /><TileLayer attribution='&copy; OpenStreetMap contributors' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' /><Marker position={[lat, lon]} /></MapContainer>
    <svg className='mapOverlay' viewBox={`0 0 ${overlay.w} ${overlay.h}`} preserveAspectRatio='none'>
      <polygon points={overlay.night} fill='#1e293b' opacity='0.18' />
      <line x1={overlay.front.split(' ')[0].split(',')[0]} y1={overlay.front.split(' ')[0].split(',')[1]} x2={overlay.front.split(' ')[1].split(',')[0]} y2={overlay.front.split(' ')[1].split(',')[1]} stroke='#16a34a' strokeWidth='2' strokeDasharray='8 5' />
      <polyline points={overlay.arrow} stroke='#2563eb' strokeWidth='3' fill='none' />
      <text x='8' y='14' fontSize='11'>toward night</text>
    </svg></div></div>;
}
