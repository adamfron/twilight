import { degToRad, radToDeg } from './angle';
import { SolarPosition } from '../types';
export function solarPositionUTC(date: Date, latDeg:number, lonDeg:number): SolarPosition {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const n = jd - 2451545.0;
  const L = (280.46 + 0.9856474 * n) % 360;
  const g = degToRad((357.528 + 0.9856003 * n) % 360);
  const lambda = degToRad(L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g));
  const eps = degToRad(23.439 - 0.0000004 * n);
  const ra = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda));
  const dec = Math.asin(Math.sin(eps) * Math.sin(lambda));
  const gmst = (18.697374558 + 24.06570982441908 * n) % 24;
  const lst = degToRad((gmst * 15 + lonDeg) % 360);
  const H = lst - ra;
  const lat = degToRad(latDeg);
  const elev = Math.asin(Math.sin(lat)*Math.sin(dec)+Math.cos(lat)*Math.cos(dec)*Math.cos(H));
  const az = Math.atan2(-Math.sin(H), Math.tan(dec)*Math.cos(lat)-Math.sin(lat)*Math.cos(H));
  return { elevationDeg: radToDeg(elev), azimuthDeg: (radToDeg(az)+360)%360, declinationDeg: radToDeg(dec) };
}
