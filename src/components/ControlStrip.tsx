export function ControlStrip({onExport,onStep,onPng,onCopy,status}:{onExport:(f:'csv'|'json')=>void;onStep:(m:number)=>void;onPng:()=>void;onCopy:()=>void;status:string}){
  return <div className='strip'>
    <button onClick={()=>onStep(-15)}>-15 min</button>
    <button onClick={()=>onStep(-5)}>-5 min</button>
    <button onClick={()=>onStep(5)}>+5 min</button>
    <button onClick={()=>onStep(15)}>+15 min</button>
    <button onClick={()=>onExport('csv')}>CSV</button>
    <button onClick={()=>onExport('json')}>JSON</button>
    <button onClick={onPng}>PNG</button>
    <button onClick={onCopy}>Copy results</button>
    <span className='statusText'>{status}</span>
  </div>
}
