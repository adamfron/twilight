import { degToRad } from './angle';
export function enuSolarVector(elevationDeg:number, azimuthDeg:number){
  const e=degToRad(elevationDeg), a=degToRad(azimuthDeg);
  return { E: Math.cos(e)*Math.sin(a), N: Math.cos(e)*Math.cos(a), U: Math.sin(e) };
}
