export const degToRad = (d:number)=> (d*Math.PI)/180;
export const radToDeg = (r:number)=> (r*180)/Math.PI;
export const clamp = (v:number,min:number,max:number)=>Math.min(max,Math.max(min,v));
