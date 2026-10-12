import {chromium} from 'file:///C:/Users/seube/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {loadModule} from './load-module.mjs';
import {conceptOptions} from '../dist/simulations.js';
const {book,npcs}=loadModule(),browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),report={areas:[],errors:[],unreachable:[]};fs.mkdirSync('qa',{recursive:true});
const page=await browser.newPage({viewport:{width:1500,height:1000}});page.setDefaultTimeout(6000);
page.on('pageerror',e=>report.errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1:8187/'))report.errors.push(r.status()+' '+r.url());});
await page.route('https://www.youtube-nocookie.com/**',r=>r.abort());
// Synthetic DOM activation tests every authored answer/branch. Real pointer targeting is checked separately by qa-controls and qa-features.
const click=async s=>page.evaluate(selector=>{const scope=document.querySelector('#panel[open]')||document.querySelector('.interaction-tray')||document;const button=scope.querySelector(selector);if(!button||button.disabled)throw Error('Unavailable control: '+selector);button.click();},s);
const close=async()=>{if(await page.locator('#panel[open]').count())await click('[data-act=closePanel]');if(await page.locator('.interaction-tray').count())await click('[data-act=closeTray]');};
const set=async values=>{for(const [id,value]of Object.entries(values)){const e=page.locator(`[data-exp="${id}"]`),type=await e.getAttribute('type');if(type==='checkbox')await e.setChecked(value);else if(await e.evaluate(n=>n.tagName)==='SELECT')await e.selectOption(String(value));else await e.evaluate((n,v)=>n.value=v,value);await e.dispatchEvent('input');}};
const solve=async b=>{
 if(b.type==='inspect'){for(const r of b.reveal)await click(`[data-act=inspect][data-id="${r.id}"]`);await click('[data-act=collectBeat]');}
 if(b.type==='sort'){for(const c of b.cards){await click(`[data-act=selectCard][data-id="${c.id}"]`);await click(`[data-act=placeCard][data-id="${c.category}"]`);}await click('[data-act=checkBeat]');await click('[data-act=collectBeat]');}
 if(b.type==='connect'){for(const p of b.pairs){await click(`[data-act=selectCard][data-id="${p.id}"]`);await click(`[data-act=connect][data-id="${p.id}"]`);}await click('[data-act=checkBeat]');await click('[data-act=collectBeat]');}
 if(b.type==='order'){for(const id of b.correctOrder)await click(`[data-act=addOrder][data-id="${id}"]`);await click('[data-act=checkBeat]');await click('[data-act=collectBeat]');}
 if(b.type==='build'){for(const id of b.required)await click(`[data-act=build][data-id="${id}"]`);await click('[data-act=checkBeat]');await click('[data-act=collectBeat]');}
 if(b.type==='decision'){await click(`[data-act=decide][data-id="${b.options.find(o=>!o.correct).id}"]`);assert.equal(await page.locator('[data-act=collectBeat]').count(),0);await click(`[data-act=decide][data-id="${b.options.find(o=>o.correct).id}"]`);await click('[data-act=collectBeat]');}
 if(b.type==='media'){assert(await page.locator('[data-act=collectMedia]').isDisabled());await click('[data-act=projectMedia]');assert((await page.locator('#projection-screen iframe').getAttribute('src')).includes(b.media.youtube));await page.locator('#media-notes').fill('Dit bronvoorbeeld toont hoe een gekozen doel de zichtbaarheid van belangen beïnvloedt. Ik vergelijk daarom het criterium, de getroffen groepen en de begrenzing van het bewijs.');await click('[data-act=collectMedia]');}
 if(b.type==='experiment'){
  await page.locator('#prediction').fill('Ik verwacht dat een ander criterium andere groepen bereikt. Ik vergelijk de relevante variabele en houd de overige instellingen gelijk.');
  const trials={electricity:[{production:60,repair:20,emergency:20},{production:20,repair:40,emergency:40}],externalities:[{share:0},{share:100}],incentives:[{protected:0,pressure:2,reviewTime:1},{protected:1,pressure:0,reviewTime:4}],governance:[{voice:0,horizon:1,broad:0},{voice:2,horizon:5,broad:1}],sorter:[{goal:'value',representativeTraining:false,humanReview:false},{goal:'recovery',representativeTraining:false,humanReview:false},{goal:'recovery',representativeTraining:true,humanReview:false}], 'claim-boundary':[{productionMultiplier:1,perUnitReduction:20,coveragePercent:5},{productionMultiplier:1.5,perUnitReduction:20,coveragePercent:5},{productionMultiplier:1.5,perUnitReduction:20,coveragePercent:100}]}[b.simulation];
  for(const values of trials){await set(values);await click('[data-act=runExperiment]');}
  await page.locator('#experiment-interpretation').fill('De vergelijking toont een gevolg binnen deze fictieve aannames. Dit bewijst geen universele werking; daarvoor ontbreken omstandigheden en onafhankelijke gegevens.');await click('[data-act=finishExperiment]');const answer=b.simulationSpec?conceptOptions(b).find(o=>o.correct).id:b.simulation==='electricity'?'criterion':'distribution';await click(`[data-act=interpretExperiment][data-id="${answer}"]`);
 }
 assert.equal(await page.locator(`.clue-list [data-clue="${b.id}"]`).count(),1,b.id+' not saved');await close();
};
const puzzle=async f=>{for(const slot of f.slots){await click(`[data-act=chooseEvidence][data-id="${slot.evidenceBeatId}"]`);await click('[data-act=placeEvidence]');await click(`[data-act=finalOption][data-id="${slot.options.find(o=>!o.correct).id}"]`);assert(await page.locator('[data-act=nextFinal]').isDisabled());await click(`[data-act=finalOption][data-id="${slot.options.find(o=>o.correct).id}"]`);await click('[data-act=checkFinale]');await click('[data-act=nextFinal]');}await close();};
try{
 await page.goto('http://127.0.0.1:8187/');await page.locator('[data-act=start]').waitFor({timeout:60000});await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}'});await page.locator('[data-act=start]').click();await close();await page.locator('#field-notes').fill('Mijn bestaande notitie blijft bewaard.');const backup=await page.evaluate(()=>localStorage.getItem('onder-de-oppervlakte-adventure-v2'));
 await page.locator('[data-act=adminPrompt]').click();await page.locator('#admin-code').fill('fabian1');await click('[data-act=adminLogin]');assert.equal(await page.locator('[data-act=adminVisit]').count(),32);await close();
 for(let chapter=0;chapter<book.chapters.length;chapter++){
  const ch=book.chapters[chapter];
  for(let room=0;room<ch.investigations.length;room++){
   const i=ch.investigations[room];await page.locator('[data-act=adminOverview]').click();await click(`[data-act=adminVisit][data-chapter="${chapter}"][data-index="${room}"]`);assert.equal(await page.locator('.room-object[data-act=approach]').count(),i.beats.length);
   // Check that the visible hotspot core is reachable instead of hidden behind a person/another hotspot.
   const hidden=await page.locator('.room-object[data-act=approach]').evaluateAll(es=>es.filter(e=>{const dot=e.querySelector('.object-dot'),r=dot.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return !e.contains(hit);}).map(e=>e.dataset.id));report.unreachable.push(...hidden);
   if(room===0)await page.screenshot({path:`qa/${i.id}-scene.png`});
   await page.locator('[data-act=npc]').click();const row=npcs.get(i.id);for(const n of row.npcs){await click(`[data-act=switchNPC][data-name="${n.name}"]`);for(const t of n.topics){await click(`[data-act=npcTopic][data-id="${t.id}"]`);for(const f of t.followups){await click(`[data-act=npcFollow][data-id="${f.id}"]`);assert((await page.locator('.npc-line').innerText()).includes(f.answer.slice(0,30)));}await click('[data-act=npcTopics]');}}await close();
   for(const b of i.beats){await page.locator('[data-act=adminContent]').click();const item=page.locator('.admin-content-item').filter({has:page.locator(`[data-act=adminBeat][data-id="${b.id}"]`)});await item.locator('summary').click();await click(`[data-act=adminBeat][data-id="${b.id}"]`);await solve(b);}
   await page.locator('[data-act=adminFinal]').click();await puzzle(i.finale);report.areas.push({id:i.id,activities:i.beats.length,npcs:row.npcs.length,puzzle:true});console.log('PASS '+i.id+' '+i.beats.length+' interactions, NPCs and puzzle');
  }
  await page.locator('[data-act=adminLessonFinal]').click();await puzzle(ch.chapterFinale);
  await page.locator('.admin-bar [data-act=beginKnowledge]').click();for(const q of ch.knowledgeCheck.items){await click(`[data-act=knowledgeAnswer][data-id="${q.options.find(o=>!o.correct).id}"]`);assert(await page.locator('[data-act=knowledgeNext]').isDisabled());await click(`[data-act=knowledgeAnswer][data-id="${q.options.find(o=>o.correct).id}"]`);await click('[data-act=knowledgeNext]');}await close();console.log('PASS '+ch.lessonId+' transfer finale and '+ch.knowledgeCheck.items.length+' questions');
 }
 await page.locator('[data-act=adminExit]').click();assert.equal(await page.evaluate(()=>localStorage.getItem('onder-de-oppervlakte-adventure-v2')),backup);assert.equal(await page.locator('#field-notes').inputValue(),'Mijn bestaande notitie blijft bewaard.');assert.deepEqual(report.errors,[]);assert.deepEqual(report.unreachable,[]);report.passed=true;fs.writeFileSync('qa/module-report.json',JSON.stringify(report,null,2));console.log('PASS full module UI, all areas, interactions, conversation branches, puzzles, knowledge checks and unchanged learner save.');
}catch(e){report.failure=e.stack;fs.writeFileSync('qa/module-failure.json',JSON.stringify(report,null,2));await page.screenshot({path:'qa/module-failure.png'});throw e;}finally{await browser.close();}
