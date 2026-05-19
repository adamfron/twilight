import { degToRad, radToDeg } from './angle';
import { ThresholdDef, ThresholdResult } from '../types';
export const R_EARTH_KM = 6371;
export const horizonDipDeg = (zKm:number)=> radToDeg(Math.acos(R_EARTH_KM/(R_EARTH_KM+Math.max(0,zKm))));
export function xFromZAlpha(eStationDeg:number,zKm:number,alphaDeg:number){
  return R_EARTH_KM*degToRad(eStationDeg + horizonDipDeg(zKm)-alphaDeg);
}
function tangentAt(z0:number, fn:(z:number)=>number){ const dz=0.5; const x1=fn(Math.max(0,z0-dz)), x2=fn(z0+dz); const dx=x2-x1; return dx===0?null:radToDeg(Math.atan2((z0+dz)-Math.max(0,z0-dz),dx)); }
export function computeThresholdResult(eStationDeg:number,t:ThresholdDef):ThresholdResult{
  const curve=[0,1,2,5,10,20,30,60,90,110,150,200,250,350,500,700,1000,1500,2000].map(z=>({z,x:xFromZAlpha(eStationDeg,z,t.angleDeg)}));
  const xGroundKm=xFromZAlpha(eStationDeg,0,t.angleDeg);
  const groundAngle=tangentAt(0,(z)=>xFromZAlpha(eStationDeg,z,t.angleDeg));
  const status=Math.abs(xGroundKm)<1?'OK':'Projected to ground';
  return { threshold:t, xGroundKm, groundAngleDeg:groundAngle?Math.abs(groundAngle):null, angleAt90Deg:tangentAt(90,(z)=>xFromZAlpha(eStationDeg,z,t.angleDeg)), angleAt110Deg:tangentAt(110,(z)=>xFromZAlpha(eStationDeg,z,t.angleDeg)), status, warnings:[], curve };
}
