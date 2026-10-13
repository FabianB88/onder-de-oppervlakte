import assert from 'node:assert/strict';
import {loadModule} from './load-module.mjs';
import {fresh,restore,xp,level,collect,answerSupported,checkFinale,finishRoom} from '../dist/adventure-state.js';
import {experimentReady,experimentSteps,exampleTrials} from '../dist/experiment-progress.js';
import {LEVELS,progressFor} from '../dist/progression.js';
const {book}=loadModule(),first=book.chapters[0].investigations[0],depot=book.chapters[0].investigations[1],s=fresh();
for(const i of [first,depot]){
 i.beats.forEach(b=>collect(s,b));
 for(const slot of i.finale.slots){
  for(const evidence of slot.evidenceBeatIds||[slot.evidenceBeatId]){
   const option=slot.options.find(o=>o.correct).id;
   assert(answerSupported(slot,{option,evidence}),`${i.id}: valid alternate evidence rejected`);
   assert(!answerSupported(slot,{option:slot.options.find(o=>!o.correct).id,evidence}));
  }
  assert(!answerSupported(slot,{option:slot.options.find(o=>o.correct).id,evidence:'unrelated'}));
  s.finalAnswers[`${i.id}:${slot.id}`]={option:slot.options.find(o=>o.correct).id,evidence:(slot.evidenceBeatIds||[slot.evidenceBeatId]).at(-1)};
 }
 assert(checkFinale(s,i.finale,i.id));finishRoom(s,i);
}
const restored=restore({...s,notes:{'m1-01':'Mijn aantekening'},trials:{'m1-02-b2':[{values:{share:25},prediction:'Eerste'},{values:{share:50},prediction:'Tweede'}]}},book);
assert.equal(restored.notes['m1-01'],'Mijn aantekening');assert(checkFinale(restored,first.finale,first.id));assert(checkFinale(restored,depot.finale,depot.id));assert.equal(xp(restored),xp(s));
const power=first.beats.find(b=>b.simulation==='electricity'),water=depot.beats.find(b=>b.simulation==='externalities'),trial=values=>({values});
assert(experimentReady(power,[{production:40,repair:30,emergency:30},{production:30,repair:30,emergency:40}].map(trial)),'Legitimate comparison must not require arbitrary 50/30 thresholds');
assert(!experimentReady(power,[{production:40,repair:30,emergency:30},{production:40,repair:30,emergency:30}].map(trial)));
assert(!experimentReady(power,[{production:40,repair:30,emergency:30},{production:30,repair:20,emergency:40}].map(trial)),'Different totals are not a controlled distribution comparison');
assert(!experimentReady(power,[{production:60,repair:40,emergency:40},{production:60,repair:30,emergency:50}].map(trial)));
assert(experimentReady(water,[25,50].map(share=>trial({share}))),'Any different share is a valid comparison');
assert(!experimentReady(water,[50,50].map(share=>trial({share}))));assert(experimentReady(water,restored.trials[water.id]));
for(const ch of book.chapters)for(const i of ch.investigations)for(const b of i.beats)if(b.type==='experiment'){
 const examples=exampleTrials(b).map(t=>trial(t.values));assert(experimentReady(b,examples),b.id+' example presets do not complete comparison');assert(experimentSteps(b,examples).every(s=>s.done),b.id+' progress disagrees with completion');assert(!experimentReady(b,examples.slice(0,1)));
}
for(const l of LEVELS){assert.equal(progressFor(l.xp).current.level,l.level);if(l.level>1)assert.equal(progressFor(l.xp-1).current.level,l.level-1);}
assert.equal(progressFor(99999).current.level,LEVELS.length);assert.equal(progressFor(99999).next,undefined);
const before=xp(s);first.beats.forEach(b=>collect(s,b));finishRoom(s,first);assert.equal(xp(s),before);assert.equal(level(s),progressFor(xp(s)).current.level);
console.log('PASS: alternate evidence fidelity, incorrect reasoning gates, saved answers/notes/trials, fair comparisons, all guided presets, progress and level thresholds, repeat XP invariants.');
