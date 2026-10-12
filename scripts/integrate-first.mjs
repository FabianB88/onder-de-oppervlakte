import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const book=read('dist/playbook.json'),ch=book.chapters[0],supp=read('dist/chapters/m1-supplement.json');
for(const i of supp.investigations){const at=ch.investigations.findIndex(x=>x.id===i.id);if(at<0)ch.investigations.push(i);else ch.investigations[at]=i;}
for(const p of supp.beatPatches||[]){const i=ch.investigations.find(x=>x.id===p.investigationId),b=i.beats.find(x=>x.id===p.beatId);Object.assign(b,p.replace||{});for(const r of p.appendReveal||[])if(!b.reveal.some(x=>x.id===r.id))b.reveal.push(r);for(const id of p.appendRequired||[])if(!b.required.includes(id))b.required.push(id);}
for(const p of supp.beatInsertions||[]){const i=ch.investigations.find(x=>x.id===p.investigationId),b=p.beat;const at=i.beats.findIndex(x=>x.id===b.id);if(at<0)i.beats.push(b);else i.beats[at]=b;}
const route=['m1-01','m1-02','m1-03','m1-04','m1-05','m1-07','m1-08','m1-06'];
ch.investigations.sort((a,b)=>route.indexOf(a.id)-route.indexOf(b.id));
const before=ch.investigations.find(i=>i.id==='m1-05');
Object.assign(before.world.exit,{label:'Open het verdelingsarchief',destinationReason:'De eigendomsregisters vertellen wie opbrengst ontvangt. Onderzoek in het archief hoe inkomen, vermogen en toegang worden verdeeld.'});
book.release={playableLessons:['m1','m2','m3','m4','m5'],underDevelopment:[],status:'authored-module-with-source-fidelity-audit'};
fs.writeFileSync('dist/playbook.json',JSON.stringify(book,null,2)+'\n');
console.log('First lesson integrated: '+ch.investigations.length+' areas.');
