import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';
export function LocalMapPanel({lat,lon,crossAz,onEnlarge}:{lat:number;lon:number;crossAz:number;onEnlarge:()=>void}){
  const dx=0.2*Math.sin(crossAz*Math.PI/180), dy=0.2*Math.cos(crossAz*Math.PI/180);
  return <div className='panel small'><div className='panelHeader'><h4>Local Map</h4><button onClick={onEnlarge}>Enlarge</button></div><MapContainer center={[lat,lon]} zoom={7} style={{height:180,width:'100%'}}><TileLayer attribution='&copy; OpenStreetMap contributors' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'/><Marker position={[lat,lon]}/><Polyline positions={[[lat-dy,lon-dx],[lat+dy,lon+dx]]} pathOptions={{color:'#2563eb'}}/></MapContainer></div>}
