export function ControlStrip({onExport,onStep,onPng,onCopy,status,showIonosphereBands,showTwilightShading,onToggleIonosphere,onToggleTwilight}:{onExport:(f:'csv'|'json')=>void;onStep:(m:number)=>void;onPng:()=>void;onCopy:()=>void;status:string;showIonosphereBands:boolean;showTwilightShading:boolean;onToggleIonosphere:()=>void;onToggleTwilight:()=>void;}){
  return <div className='strip'>
    <button onClick={()=>onStep(-15)}>-15 min</button>
    <button onClick={()=>onStep(-5)}>-5 min</button>
    <button onClick={()=>onStep(5)}>+5 min</button>
    <button onClick={()=>onStep(15)}>+15 min</button>
    <button onClick={()=>onExport('csv')}>CSV</button>
    <button onClick={()=>onExport('json')}>JSON</button>
    <button onClick={onPng}>PNG</button>
    <button onClick={onCopy}>Copy results</button>
    <label><input type='checkbox' checked={showIonosphereBands} onChange={onToggleIonosphere} /> Show ionosphere bands</label>
    <label><input type='checkbox' checked={showTwilightShading} onChange={onToggleTwilight} /> Show twilight shading</label>
    <span className='statusText'>{status}</span>
  </div>
}
