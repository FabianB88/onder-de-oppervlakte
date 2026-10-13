import {chromium} from 'file:///C:/Users/seube/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {loadModule} from './load-module.mjs';
import {fresh,KEY} from '../dist/adventure-state.js';
const {book}=loadModule(),browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const report={errors:[],areas:0,theoryViews:0,blockedTargets:[]};
try{
 const page=await browser.newPage({viewport:{width:1500,height:1000}});page.on('pageerror',e=>report.errors.push(e.message));page.setDefaultTimeout(12000);
 const click=async s=>page.evaluate(selector=>{const scope=document.querySelector('#panel[open]')||document.querySelector('.interaction-tray')||document;const el=scope.querySelector(selector);if(!el||el.disabled)throw Error('Unavailable: '+selector);el.click();},s);
 const close=async()=>{if(await page.locator('#panel[open]').count())await click('.panel-head [data-act=closePanel]');if(await page.locator('.interaction-tray').count())await click('[data-act=closeTray]');};
 await page.goto('http://127.0.0.1:8187/');await page.locator('[data-act=start]').waitFor();assert.equal(await page.locator('.hero').count(),1);
 await page.locator('.hero [data-act=startExplanation]').click();assert((await page.locator('#panel-content').innerText()).includes('wat een bedrijf behoort te doen'));await close();
 await page.locator('[data-act=start]').click();assert((await page.locator('.arrival-story').innerText()).includes('productielijn'));assert((await page.locator('.ethical-focus').innerText()).includes('stroomtekort'));await close();
 // Real pointer route through the new case, rather than an admin shortcut.
 await page.locator('[data-act=approach][data-id=m1-01-case]').click();await page.locator('.interaction-tray').waitFor();
 for(const id of ['production','repair','emergency','mission'])await page.locator(`[data-act=inspect][data-id=${id}]`).click();
 assert((await page.locator('#reveal-content').innerText()).includes('ethisch oordeel'));await page.locator('[data-act=collectBeat]').click();
 assert((await page.locator('.clue-explanation').innerText()).includes('verschillende belangen'));await page.locator('#clue-observation').fill('Mijn afweging en bewijs blijven bewaard.');
 await page.locator('[data-act=activityTheory]').click();assert((await page.locator('#panel-content').innerText()).includes('De oorspronkelijke cursus'));await page.locator('[data-act=returnTheory]').click();assert.equal(await page.locator('#clue-note').inputValue(),'Mijn afweging en bewijs blijven bewaard.');await close();
 await page.locator('[data-act=approach][data-id=m1-01-b3]').click();await page.locator('.interaction-tray').waitFor();assert((await page.locator('.interaction-tray').innerText()).includes('Een standpunt over bedrijfsverantwoordelijkheid'));await close();
 await page.locator('#walk-scene').focus();await page.keyboard.down('w');await page.waitForTimeout(1200);await page.keyboard.up('w');
 const upper=await page.locator('#player').evaluate(e=>parseFloat(e.style.top));assert(upper<40,'W must cross the former floor boundary');
 await page.waitForTimeout(250);const stopped=await page.locator('#player').evaluate(e=>parseFloat(e.style.top));assert(Math.abs(stopped-upper)<1,'Flight stops on key release');
 await page.locator('#field-notes').fill('Notities zijn geen bewegingsbesturing.');const position=await page.locator('#player').evaluate(e=>e.style.left);await page.locator('#field-notes').press('d');assert.equal(await page.locator('#player').evaluate(e=>e.style.left),position);
 const save=await page.evaluate(key=>localStorage.getItem(key),KEY);
 await page.locator('[data-act=adminPrompt]').click();await page.locator('#admin-code').fill('fabian1');await page.locator('[data-act=adminLogin]').click();await close();
 for(let chapter=0;chapter<book.chapters.length;chapter++)for(let room=0;room<book.chapters[chapter].investigations.length;room++){
  const i=book.chapters[chapter].investigations[room];await page.locator('[data-act=adminOverview]').click();await click(`[data-act=adminVisit][data-chapter="${chapter}"][data-index="${room}"]`);
  const hidden=await page.locator('.room-object[data-act=approach]').evaluateAll(es=>es.filter(e=>{const r=e.querySelector('.object-dot').getBoundingClientRect();return !e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));}).map(e=>e.dataset.id));report.blockedTargets.push(...hidden);
  await page.locator('[data-act=openBriefing]').click();assert.equal(await page.locator('.arrival-story').innerText(),i.guide.story);assert((await page.locator('.ethical-focus').innerText()).includes(i.guide.ethicalQuestion));await close();
  await page.locator('.mission-strip [data-act=areaTheory]').click();assert((await page.locator('.theory-depth').innerText()).length>150);await close();
  for(const b of i.beats){await page.locator('[data-act=adminContent]').click();await click(`[data-act=adminBeat][data-id="${b.id}"]`);await click(`[data-act=activityTheory][data-id="${b.id}"]`);assert.equal(await page.locator('.theory-depth details').count(),b.teaching?.length||3);assert(await page.locator('.library details').count()>0,b.id+' has no source teaching');await click('[data-act=returnTheory]');assert.equal(await page.locator('.interaction-tray').count(),1);await close();report.theoryViews++;}
  if(i.id==='m1-02'){await page.locator('[data-act=npc]').click();await click('[data-act=npcContext]');assert((await page.locator('#panel-content').innerText()).toLowerCase().includes('benedenstrooms'));await click('[data-act=npcReturn]');assert((await page.locator('.npc-line').innerText()).includes('fabriek aan de rivier'));await close();await page.screenshot({path:'qa/depot-repaired.png'});}
  report.areas++;
 }
 await page.locator('[data-act=adminExit]').click();assert.equal(await page.evaluate(key=>localStorage.getItem(key),KEY),save);await page.reload();await page.locator('.hero').waitFor();assert((await page.locator('.resume-location').innerText()).includes('noodcentrale'));await page.locator('[data-act=start]').click();assert.equal(await page.locator('.arrival-story').count(),1);await close();assert((await page.locator('#field-notes').inputValue()).includes('Notities'));assert.equal(await page.locator('.clue-list [data-clue=m1-01-case]').count(),1);
 // An older, already-started save must still show the entrance and the situation.
 const old=await browser.newPage(),raw={...fresh(),started:true,chapter:0,room:1,briefed:['m1-01','m1-02'],tools:['camera'],notes:{'m1-02':'Bestaande docentnotitie'}};
 await old.addInitScript(({key,raw})=>localStorage.setItem(key,JSON.stringify(raw)),{key:KEY,raw});await old.goto('http://127.0.0.1:8187/');await old.locator('.hero').waitFor();assert((await old.locator('.resume-location').innerText()).includes('ontvangstdepot'));await old.locator('[data-act=start]').click();assert((await old.locator('.arrival-story').innerText()).includes('vissers'));await old.locator('.panel-head [data-act=closePanel]').click();assert.equal(await old.locator('#field-notes').inputValue(),'Bestaande docentnotitie');await old.locator('[data-act=openBriefing]').click();await old.screenshot({path:'qa/depot-arrival.png'});
 await page.setViewportSize({width:390,height:844});await page.locator('[data-act=home]').click();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2));await page.screenshot({path:'qa/entrance-mobile.png',fullPage:true});await page.locator('[data-act=start]').click();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2));await page.screenshot({path:'qa/arrival-mobile.png'});
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.blockedTargets,[]);report.passed=true;fs.writeFileSync('qa/learning-flow-report.json',JSON.stringify(report,null,2));console.log('PASS: entrance for new/returning/older saves, preserved notes, concept-before-decision path, held keyboard flight, 32 situations, '+report.theoryViews+' contextual source views and mobile layout.');
}catch(e){report.failure=e.stack;fs.writeFileSync('qa/learning-flow-failure.json',JSON.stringify(report,null,2));throw e;}finally{await browser.close();}
