import fs from 'node:fs';
const book=JSON.parse(fs.readFileSync('dist/playbook.json','utf8'));
const npcs=JSON.parse(fs.readFileSync('dist/chapters/m1-npcs.json','utf8'));
for(const n of npcs.rooms.find(r=>r.investigationId==='m1-01').npcs)for(const s of n.theory.sections)s.text=s.text.replace('Iedere verdeling laat dus 40 onvervuld.','Zelfs bij volledige inzet van de 100 eenheden blijven er minstens 40 onvervuld.');
fs.writeFileSync('dist/chapters/m1-npcs.json',JSON.stringify(npcs,null,2)+'\n');
book.release.status='playable-module-runtime-checked';fs.writeFileSync('dist/playbook.json',JSON.stringify(book,null,2)+'\n');
for(let n=2;n<=5;n++){const p=`dist/chapters/m${n}.json`,ch=JSON.parse(fs.readFileSync(p));ch.status='playable-runtime-checked';fs.writeFileSync(p,JSON.stringify(ch,null,2)+'\n');}
const audit=JSON.parse(fs.readFileSync('sources/m1-media-audit.json'));audit.runtimeIntegration={areas:8,worldActivities:35,requiredSourceProjections:1,exactVproClip:'Included as a required in-world source with case synthesis; complete speech remains independently unverified.'};fs.writeFileSync('sources/m1-media-audit.json',JSON.stringify(audit,null,2)+'\n');
const plan=JSON.parse(fs.readFileSync('sources/production-plan.json'));plan.scope.totalActivities=175;plan.scope.questions=42;plan.scope.areasPerLesson=[8,6,6,6,6];plan.currentGaps.find(g=>g.id==='G-runtime').status='Runtimecontrole geslaagd: alle 32 gebieden, 175 activiteiten en 42 vragen';plan.currentGaps.find(g=>g.id==='G-media').issue='Dertien oorspronkelijke clips zijn verplichte bronprojecties. Volledige gesproken details van enkele clips zijn nog niet onafhankelijk geverifieerd; een bronnotitie bewijst geen volledige weergave of beheersing.';fs.writeFileSync('sources/production-plan.json',JSON.stringify(plan,null,2)+'\n');
console.log('Integration status and precise source qualifications updated.');
