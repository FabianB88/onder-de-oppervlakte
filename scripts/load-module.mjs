import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
export function loadModule(){
 const book=read('dist/playbook.json'),index=read('dist/chapter-index.json');
 for(const file of index.chapters)book.chapters.push(read('dist/'+file));
 for(const ch of book.chapters)for(const i of ch.investigations)for(const p of i.sourceProjections||[])i.beats.push({id:`${ch.lessonId}-projection-${p.id}`,type:'media',title:p.title,sceneObject:'projector',intro:p.purpose,hint:'Vergelijk wat de bron beweert met een concreet voorbeeld in deze casus. Een verklaring en een oordeel vragen passend bewijs.',explainAfter:'Je bronnotitie koppelt een begrip aan de casus. In de gebiedspuzzel moet je het mechanisme met relevant bewijs onderbouwen.',concepts:p.knownCoreConcepts||[],sourceBlocks:p.sourceBlocks,clueId:`${ch.lessonId}-projection-${p.id}-clue`,clueTitle:'Bronvergelijking: '+p.title,media:p});
 const npcs=new Map();for(const file of index.npcFiles)for(const row of read('dist/'+file).rooms)npcs.set(row.investigationId,row);
 return {book,npcs,course:read('dist/course.json'),root};
}
