import { references } from '../data/references';
export function ReferencesFooter(){return <footer><div><b>References</b><ul>{references.map(r=><li key={r.href}><a href={r.href} target='_blank' rel='noreferrer'>{r.label}</a></li>)}</ul></div><div>Cite this webpage as: TWILIGHT MVP.</div></footer>}
