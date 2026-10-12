import {existsSync,readFileSync,writeFileSync} from 'node:fs';
const index={chapters:[],npcFiles:[]};
if(existsSync('dist/chapters/m1-npcs.json'))index.npcFiles.push('chapters/m1-npcs.json');
if(existsSync('dist/chapters/m1-supplement-npcs.json'))index.npcFiles.push('chapters/m1-supplement-npcs.json');
for(let n=2;n<=5;n++){
 const file=`chapters/m${n}.json`;if(!existsSync(`dist/${file}`))break;
 JSON.parse(readFileSync(`dist/${file}`,'utf8'));index.chapters.push(file);
 const npc=`chapters/m${n}-npcs.json`;if(existsSync(`dist/${npc}`)){JSON.parse(readFileSync(`dist/${npc}`,'utf8'));index.npcFiles.push(npc);}
}
writeFileSync('dist/chapter-index.json',JSON.stringify(index,null,2));console.log(`Prepared ${index.chapters.length+1} consecutive lesson routes.`);
