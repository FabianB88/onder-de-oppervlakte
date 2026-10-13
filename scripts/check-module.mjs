import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {loadModule} from './load-module.mjs';
import {defaults,outcome,conceptOptions} from '../dist/simulations.js';
const {book,npcs,course,root}=loadModule(),errors=[],ids=new Set(),types={},lessons=[];
const check=(ok,msg)=>{if(!ok)errors.push(msg);},words=s=>String(s||'').trim().split(/\s+/).filter(Boolean).length;
const short=(s,at,max=65)=>check(typeof s==='string'&&words(s)>0&&words(s)<=max,at+': missing or oversized text');
const options=(rows,at)=>{check(Array.isArray(rows)&&rows.length>=3,at+': alternatives missing');check(rows.filter(o=>o.correct).length===1,at+': answer key');rows.forEach(o=>{short(o.text,at+'.option');short(o.feedback,at+'.feedback');});};
const finale=(f,evidence,at)=>{check(f?.slots?.length>=2,at+': puzzle missing');short(f.intro,at+'.intro');short(f.conclusion,at+'.conclusion');for(const slot of f.slots){check(evidence.has(slot.evidenceBeatId),at+': evidence '+slot.evidenceBeatId);if(slot.evidenceBeatIds){check(slot.evidenceBeatIds.includes(slot.evidenceBeatId),at+': canonical evidence omitted');check(new Set(slot.evidenceBeatIds).size===slot.evidenceBeatIds.length,at+': duplicate accepted evidence');for(const id of slot.evidenceBeatIds){check(evidence.has(id),at+': alternative evidence '+id);short(slot.evidenceNotes?.[id],at+'.evidence explanation',90);}}options(slot.options,at+'.'+slot.id);}};
check(book.chapters.length===5,'Expected all five lessons');
for(const ch of book.chapters){
 const src=course.lessons.find(l=>l.id===ch.lessonId),beats=ch.investigations.flatMap(i=>i.beats),evidence=new Set(beats.map(b=>b.id)),mapped=new Set();
 check(ch.investigations.length>=6,ch.lessonId+': too few areas');
 for(const i of ch.investigations){
  check(!ids.has(i.id),'Duplicate area '+i.id);ids.add(i.id);
  check(fs.existsSync(path.join(root,'dist/assets/'+i.world?.imageKey+'.webp')),i.id+': missing room artwork');
  short(i.world?.exit?.problem,i.id+'.door');short(i.world?.exit?.destinationReason,i.id+'.route');
  check(i.beats.length>=3,i.id+': insufficient research');
  check(i.guide?.story?.length>100&&i.guide?.ethicalQuestion&&i.guide?.task&&i.guide?.reflection,i.id+': missing situation, ethical question or guidance');
  check(i.beats.some(b=>b.id===i.guide?.firstBeat),i.id+': first investigation missing');
  short(i.guide?.goal,i.id+'.learning goal',70);check(i.guide?.core?.length>=3,i.id+': plain-language concepts missing');
  for(const c of i.guide?.core||[]){short(c.term,i.id+'.term',15);short(c.text,i.id+'.plain explanation',90);}
  for(const b of i.beats){
   check(!ids.has(b.id),'Duplicate activity '+b.id);ids.add(b.id);types[b.type]=(types[b.type]||0)+1;
   check(['inspect','sort','connect','order','build','decision','experiment','media'].includes(b.type),b.id+': unsupported activity');short(b.intro,b.id+'.intro');
   check(b.concepts?.length>0,b.id+': concepts missing');check(b.sourceBlocks?.length>0,b.id+': source mapping missing');
   for(const n of b.sourceBlocks||[]){check(Number.isInteger(n)&&src.blocks[n]&&src.blocks[n].t!=='continue',b.id+': invalid source '+n);mapped.add(n);}
   if(b.type!=='media'){short(b.hint,b.id+'.hint');short(b.explainAfter,b.id+'.explanation');}
   check((b.requiresEvidence||[]).every(id=>i.beats.some(x=>x.id===id)&&id!==b.id),b.id+': prerequisite evidence missing');
   for(const t of b.teaching||[])short(t.text,b.id+'.teaching',90);
   if(b.type==='inspect'){check(b.reveal.length>=2,b.id+': missing observations');b.reveal.forEach(r=>short(r.text,b.id+'.'+r.id));check(b.required?.every(id=>b.reveal.some(r=>r.id===id)),b.id+': required observations');}
   if(b.type==='sort')check(b.cards.every(c=>b.categories.some(x=>x.id===c.category)),b.id+': card targets');
   if(b.type==='connect')check(new Set(b.pairs.map(p=>p.id)).size===b.pairs.length,b.id+': relationships');
   if(b.type==='order')check(JSON.stringify(b.correctOrder)===JSON.stringify(b.order.map(o=>o.id)),b.id+': sequence');
   if(b.type==='decision'){check(b.options.filter(o=>o.correct).length>=1,b.id+': no defensible choice');b.options.forEach(o=>{short(o.text,b.id+'.choice');short(o.feedback,b.id+'.feedback');});}
   if(b.type==='build')check(b.required?.length>0&&b.required.every(id=>b.options.some(o=>o.id===id&&o.correct)),b.id+': design key');
   if(b.type==='experiment'){check(b.minimumTrials>=2||b.simulationSpec?.minimumTrials>=2,b.id+': contrasting trials');if(b.simulationSpec){const v=defaults(b.simulationSpec);check(Object.values(outcome(b.simulation,v)).every(Number.isFinite),b.id+': model result');options(conceptOptions(b),b.id+'.model');}}
   if(b.type==='media'){check(/^[\w-]{11}$/.test(b.media.youtube),b.id+': source video');short(b.media.viewingTask,b.id+'.viewing');short(b.media.afterPrompt,b.id+'.synthesis');}
  }
  finale(i.finale,new Set(i.beats.map(b=>b.id)),i.id);
  const row=npcs.get(i.id);check(row?.npcs?.length>=2,i.id+': two NPCs missing');
  for(const n of row?.npcs||[]){check(['Noor','Omar','Mila','Iris','Eva','Lena'].includes(n.name),i.id+': portrait '+n.name);check(n.topics.length>=2,i.id+': shallow conversation');for(const t of n.topics){short(t.answer,i.id+'.'+t.id);check(t.followups?.length>=2,i.id+'.'+t.id+': follow-ups');t.followups.forEach(f=>short(f.answer,i.id+'.'+t.id+'.'+f.id));}if(n.theory){check(n.theory.sections?.length===3,i.id+': theory layers');n.theory.sections.forEach(s=>short(s.text,i.id+'.'+n.name+'.theory',75));}}
 }
 finale(ch.chapterFinale,evidence,ch.lessonId+'.final');check(ch.knowledgeCheck?.items?.length>=8,ch.lessonId+': knowledge questions');ch.knowledgeCheck.items.forEach(q=>options(q.options,ch.lessonId+'.'+q.id));
 const sourceRows=src.blocks.flatMap((b,n)=>b.t==='continue'?[]:[{index:n,type:b.t,mappedTo:beats.filter(x=>x.sourceBlocks.includes(n)).map(x=>x.id)}]);
 // Structural references do not by themselves establish semantic fidelity or learning equivalence.
 lessons.push({lessonId:ch.lessonId,areas:ch.investigations.length,activities:beats.length,requiredSourceProjections:beats.filter(b=>b.type==='media').length,questions:ch.knowledgeCheck.items.length,sourceRows});
}
const report={schemaVersion:2,scope:'Full authored module',coverageKind:'Structural teaching references; semantic fidelity is separately recorded in the proposition/media audits. No empirical learning equivalence claim.',sourceSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'dist/course.json'))).digest('hex'),valid:!errors.length,lessons,counts:{lessons:lessons.length,areas:lessons.reduce((n,c)=>n+c.areas,0),activities:lessons.reduce((n,c)=>n+c.activities,0),questions:lessons.reduce((n,c)=>n+c.questions,0),types},errors};
if(process.argv.includes('--write'))fs.writeFileSync(path.join(root,'sources/module-validation.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({valid:report.valid,counts:report.counts,errors},null,2));if(errors.length)process.exitCode=1;
