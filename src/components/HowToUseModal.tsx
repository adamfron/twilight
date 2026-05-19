export function HowToUseModal({open,onClose}:{open:boolean;onClose:()=>void}){
  if(!open) return null;
  return <div className='modalOverlay' onClick={onClose} onKeyDown={(e)=>e.key==='Escape'&&onClose()} tabIndex={-1}>
    <div className='modal' onClick={e=>e.stopPropagation()}>
      <h3>How to use this webpage</h3>
      <ul><li>Choose station or custom location.</li><li>Choose UTC date.</li><li>Select morning/evening/manual time mode.</li><li>Select anchor threshold and click Compute.</li><li>Read cross-section: negative x = toward daylight, positive x = toward night.</li><li>Use CSV/JSON/PNG exports.</li><li>Watch warnings for white nights, polar day/night, or missing threshold crossings.</li></ul>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
}
