import { describe,it,expect } from 'vitest';
import { bisectRoot } from '../src/math/rootFinding';
describe('root',()=>{it('finds simple root',()=>expect(bisectRoot(x=>x-2,0,4)).toBeCloseTo(2,3)); it('no crossing',()=>expect(bisectRoot(x=>x*x+1,-1,1)).toBeNull());});
