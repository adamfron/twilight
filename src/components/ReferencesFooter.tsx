import { references } from '../data/references';
export function ReferencesFooter(){return <footer><div><b>References</b><ul>{references.map(r=><li key={r}>{r}</li>)}</ul></div><div>Cite this webpage as: TWILIGHT MVP placeholder citation text.</div></footer>}
