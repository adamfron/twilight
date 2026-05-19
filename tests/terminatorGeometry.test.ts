import { describe,it,expect } from 'vitest';
import { degToRad, radToDeg } from '../src/math/angle';
import { horizonDipDeg, xFromZAlpha } from '../src/math/terminatorGeometry';

describe('geometry',()=>{
  it('deg/rad conversion',()=>expect(radToDeg(degToRad(90))).toBeCloseTo(90,6));
  it('ground intersection finite',()=>expect(Number.isFinite(xFromZAlpha(-3,0,-6))).toBe(true));
  it('horizon dip finite',()=>expect(horizonDipDeg(110)).toBeGreaterThan(0));
});
