import { describe,it,expect } from 'vitest';
import { enuSolarVector } from '../src/math/coordinates';
import { solarPositionUTC } from '../src/math/solarPosition';
describe('solar',()=>{it('enu finite',()=>{const v=enuSolarVector(10,120); expect(Number.isFinite(v.E+v.N+v.U)).toBe(true);}); it('position finite',()=>{const p=solarPositionUTC(new Date('2026-05-19T00:00:00Z'),53.5,20.6); expect(Number.isFinite(p.elevationDeg+p.azimuthDeg)).toBe(true);});});
