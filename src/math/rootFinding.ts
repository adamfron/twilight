export function bisectRoot(f:(x:number)=>number,a:number,b:number,tol=1e-6,max=80){
  let fa=f(a),fb=f(b); if(!Number.isFinite(fa)||!Number.isFinite(fb)||fa*fb>0) return null;
  for(let i=0;i<max;i++){ const m=(a+b)/2,fm=f(m); if(Math.abs(fm)<tol) return m; if(fa*fm<=0){b=m;fb=fm;}else{a=m;fa=fm;} }
  return (a+b)/2;
}
