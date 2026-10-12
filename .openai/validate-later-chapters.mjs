import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const course=read('sources/business-ethics-course.json');
const errors=[],warnings=[],report=[];
const assert=(ok,msg)=>{if(!ok)errors.push(msg);};
const words=s=>(s||'').trim().split(/\s+/u).filter(Boolean).length;
function segment(value,limit,id){if(words(value)>limit)errors.push(`${id}: ${words(value)} words > ${limit}`);}
function options(v,id,plural=false){assert(Array.isArray(v)&&v.length>=2,`${id}: options absent`);assert(new Set(v.map(x=>x.id)).size===v.length,`${id}: duplicate options`);assert(v.some(x=>x.correct),`${id}: no correct option`);assert(v.some(x=>!x.correct),`${id}: no distractor`);if(!plural)assert(v.filter(x=>x.correct).length===1,`${id}: multiple correct closed answers`);v.forEach(x=>assert(x.feedback?.trim(),`${id}:${x.id}: feedback missing`));}
for(const lessonId of ['m4','m5']){
  const chapter=read(`dist/chapters/${lessonId}.json`),npcs=read(`dist/chapters/${lessonId}-npcs.json`),coverage=read(`sources/${lessonId}-coverage.json`),source=course.lessons.find(x=>x.id===lessonId);
  assert(chapter.investigations.length===6,`${lessonId}: expected six areas`);
  const beats=chapter.investigations.flatMap(a=>a.beats),beatMap=new Map(beats.map(b=>[b.id,b]));
  assert(beats.length>=24,`${lessonId}: expected at least 24 beats`);
  assert(beatMap.size===beats.length,`${lessonId}: duplicate beat IDs`);
  assert(new Set(chapter.investigations.map(a=>a.world.imageKey)).size>=3,`${lessonId}: fewer than three distinct artworks`);
  for(const a of chapter.investigations){
    assert(a.world.exit.problem&&a.world.exit.destinationReason,`${a.id}: incomplete world gate`);
    assert(a.finale.slots.length>=2&&a.finale.slots.length<=3,`${a.id}: expected 2–3 causal slots`);
    for(const s of a.finale.slots){assert(beatMap.has(s.evidenceBeatId),`${a.id}:${s.id}: missing evidence reference ${s.evidenceBeatId}`);options(s.options,`${a.id}:finale:${s.id}`);}
    for(const b of a.beats){
      assert(['inspect','sort','connect','order','build','decision','experiment'].includes(b.type),`${b.id}: unsupported beat`);
      segment(b.intro,35,`${b.id}:intro`);segment(b.hint,45,`${b.id}:hint`);segment(b.explainAfter,45,`${b.id}:explainAfter`);segment(b.boundary,45,`${b.id}:boundary`);
      b.sourceBlocks.forEach(i=>assert(Number.isInteger(i)&&source.blocks[i],`${b.id}: invalid source ${i}`));
      if(b.type==='inspect'){b.reveal.forEach(r=>segment(r.text,45,`${b.id}:${r.id}`));assert(b.required.every(id=>b.reveal.some(r=>r.id===id)),`${b.id}: missing required reveal`);}
      if(b.type==='sort')b.cards.forEach(c=>assert(b.categories.some(x=>x.id===c.category),`${b.id}: invalid card category`));
      if(b.type==='connect')assert(b.pairs?.length>=3,`${b.id}: inadequate connections`);
      if(b.type==='order')assert(b.correctOrder.length===b.order.length&&new Set(b.correctOrder).size===b.order.length&&b.correctOrder.every(id=>b.order.some(x=>x.id===id)),`${b.id}: invalid ordering`);
      if(b.type==='build'){options(b.options,b.id,true);assert(b.required.length&&b.required.every(id=>b.options.some(x=>x.id===id&&x.correct)),`${b.id}: missing required build option`);}
      if(b.type==='decision')options(b.options,b.id,true);
      if(b.type==='experiment'){assert(['sorter','claim-boundary'].includes(b.simulation),`${b.id}: unsupported custom simulation`);assert(b.simulationSpec?.parameters?.length&&b.simulationSpec?.assumptions?.length,`${b.id}: missing explicit model assumptions`);}
    }
    const room=npcs.rooms.find(r=>r.investigationId===a.id);assert(room?.npcs?.length===2,`${a.id}: expected two NPCs`);
    for(const npc of room.npcs){assert(npc.topics.length>=4,`${a.id}:${npc.name}: insufficient dialogue depth`);for(const t of npc.topics){segment(t.answer,45,`${t.id}:answer`);assert(t.followups.length>=3,`${t.id}: missing layered followups`);t.followups.forEach(f=>segment(f.answer,45,`${t.id}:${f.id}`));}}
  }
  assert(chapter.chapterFinale.slots.length===4,`${lessonId}: expected four chapter-transfer slots`);
  chapter.chapterFinale.slots.forEach(s=>{if(s.evidenceBeatId)assert(beatMap.has(s.evidenceBeatId),`${lessonId}: transfer missing evidence`);options(s.options,`${lessonId}:chapter:${s.id}`);});
  assert(chapter.knowledgeCheck.items.length===8,`${lessonId}: expected eight separate questions`);
  chapter.knowledgeCheck.items.forEach(it=>options(it.options,it.id));
  const positions=chapter.knowledgeCheck.items.map(it=>it.options.findIndex(x=>x.correct));assert(new Set(positions).size>=3,`${lessonId}: answer-position cue`);
  assert(coverage.unmappedEssentialSourceBlocks.length===0,`${lessonId}: unmapped essential text`);
  for(const row of coverage.sourcePropositionAudit.rows){for(const loc of [...row.teachingLocations,...row.practiceLocations]){
    const parts=loc.split(':');if(/-k\d+$/.test(parts[0])){assert(chapter.knowledgeCheck.items.some(q=>q.id===parts[0]),`${row.id}: invalid knowledge-check location ${loc}`);continue;}
    if(parts[1]==='finale'){assert(chapter.investigations.some(a=>a.id===parts[0]),`${row.id}: invalid area location ${loc}`);continue;}
    const b=beatMap.get(parts[0]);assert(Boolean(b),`${row.id}: invalid beat location ${loc}`);if(!b)continue;
    if(parts.length===1)continue;
    if(['reveal','pairs','cards'].includes(parts[1]))assert(b[parts[1]]?.some(r=>r.id===parts[2]),`${row.id}: invalid element ${loc}`);
    else assert(typeof b[parts[1]]==='string',`${row.id}: invalid text location ${loc}`);
  }}
  const media=coverage.sourceMediaAudit.clips;media.forEach(v=>{assert(source.blocks[v.sourceBlock]?.t==='video',`${lessonId}: media index not video`);assert(source.blocks[v.sourceBlock]?.youtube===v.youtube,`${lessonId}: video ID mismatch`);assert((source.blocks[v.sourceBlock]?.start||0)===v.start,`${lessonId}: original start mismatch`);v.teachingLocations.forEach(id=>assert(beatMap.has(id),`${lessonId}: media location ${id} missing`));if(v.requiredProjection){const area=chapter.investigations.find(a=>a.id===v.projectionRequirements.investigationId);const projection=area?.sourceProjections?.find(p=>p.youtube===v.youtube);assert(projection&&projection.start===v.start&&projection.afterPrompt&&projection.viewingTask&&projection.sourceBlocks.includes(v.sourceBlock),`${lessonId}: required projection not authored ${v.youtube}`);}});
  report.push({lessonId,areas:6,beats:beats.length,sourceAuditRows:coverage.sourcePropositionAudit.rows.length,sourceTeachingPropositions:coverage.propositions.length,npcTopics:npcs.rooms.reduce((n,r)=>n+r.npcs.reduce((x,p)=>x+p.topics.length,0),0),questions:8,correctAnswerPositions:positions,mandatoryOriginalProjections:media.filter(v=>v.requiredProjection).length});
}
const result={validatedAt:new Date().toISOString(),errors,warnings,report,scope:'Content structure, references, segmentation, dialogue depth, evidence trace and answer position. This does not certify runtime mechanics, semantic completeness of unverified original clips or empirical learning outcomes.'};
fs.writeFileSync('sources/later-chapters-validation.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));if(errors.length)process.exitCode=1;
