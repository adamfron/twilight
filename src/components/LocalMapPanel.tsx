import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Polygon, Polyline, TileLayer, useMap } from 'react-leaflet';

function MapResizeWatcher({ watch }: { watch: string }) {
  const map = useMap();
  useEffect(() => { setTimeout(() => map.invalidateSize(), 120); }, [map, watch]);
  useEffect(() => {
    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [map]);
  return null;
}

export function LocalMapPanel({ lat, lon, crossAz, onEnlarge, mapState }: { lat: number; lon: number; crossAz: number; onEnlarge: () => void; mapState: string }) {
  const geom = useMemo(() => {
    const kmToDegLat = 1 / 111;
    const kmToDegLon = 1 / (111 * Math.cos((lat * Math.PI) / 180));
    const mk = (distKm: number, az: number) => [lat + distKm * Math.cos((az * Math.PI) / 180) * kmToDegLat, lon + distKm * Math.sin((az * Math.PI) / 180) * kmToDegLon] as [number, number];
    const a = mk(30, crossAz), b = mk(-30, crossAz);
    const frontA = mk(30, crossAz + 90), frontB = mk(-30, crossAz + 90);
    const nightPoly: [number, number][] = [frontA, mk(80, crossAz + 180), mk(-80, crossAz + 180), frontB];
    return { a, b, frontA, frontB, nightPoly, arrow: mk(45, crossAz) };
  }, [lat, lon, crossAz]);
  return <div className='panel'><div className='panelHeader'><h4>Local Map</h4><button onClick={onEnlarge}>Enlarge</button></div><MapContainer center={[lat, lon]} zoom={7} style={{ height: '100%', minHeight: 220, width: '100%' }}><MapResizeWatcher watch={mapState} /><TileLayer attribution='&copy; OpenStreetMap contributors' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' /><Polygon positions={geom.nightPoly} pathOptions={{ color: '#334155', fillColor: '#1e293b', fillOpacity: 0.2, weight: 1 }} /><Marker position={[lat, lon]} /><Polyline positions={[geom.b, geom.a]} pathOptions={{ color: '#2563eb', weight: 3 }} /><Polyline positions={[geom.frontB, geom.frontA]} pathOptions={{ color: '#16a34a', weight: 3, dashArray: '8 6' }} /><Polyline positions={[[lat, lon], geom.arrow]} pathOptions={{ color: '#ef4444', weight: 3 }} /></MapContainer></div>;
}
