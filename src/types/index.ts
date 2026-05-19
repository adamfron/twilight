export type TimeMode = 'morning' | 'evening' | 'manual';
export type ThresholdKey = 'horizon' | 'civil' | 'nautical' | 'astronomical';
export interface ThresholdDef { key: ThresholdKey; label: string; angleDeg: number; color: string; active: boolean; }
export interface Station { id: string; name: string; latitude: number; longitude: number; altitudeM: number; approx?: boolean; }
export interface SolarPosition { elevationDeg: number; azimuthDeg: number; }
export interface ThresholdResult { threshold: ThresholdDef; xGroundKm: number; groundAngleDeg: number | null; angleAt90Deg: number | null; angleAt110Deg: number | null; status: string; warnings: string[]; curve: Array<{x:number;z:number}>; }
export type PanelKey = 'cross'|'geometry'|'map'|'timeline';
