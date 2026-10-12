import {chromium} from 'file:///C:/Users/seube/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1500,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8187/',{waitUntil:'networkidle'});await page.locator('[data-act=start]').click();await page.locator('#panel .panel-head [data-act=closePanel]').click();
 await page.locator('[data-act=approachNPC][data-name=Noor] .npc-label').click();
 const scene=await page.locator('#walk-scene').boundingBox();
 await page.locator('#walk-scene').click({position:{x:scene.width*.72,y:scene.height*.87}});
 await page.waitForTimeout(4500);
 assert.equal(await page.locator('[data-act=npcTopic]').count(),0);
 const player=await page.locator('#player').evaluate(e=>({x:parseFloat(e.style.left),y:parseFloat(e.style.top)}));assert(player.x>68);
 await page.locator('[data-act=verb][data-verb=inspect]').click();
 await page.locator('#walk-scene').click({position:{x:scene.width*.52,y:scene.height*.2}});
 await page.locator('#place-inspection').waitFor();assert((await page.locator('.place-caption').innerText()).includes('Raam'));
 await page.locator('[data-act=closeInspection]').first().click();
 const before=await page.evaluate(()=>localStorage.getItem('onder-de-oppervlakte-adventure-v2'));
 await page.locator('[data-act=settings]').click();await page.locator('#panel [data-act=adminPrompt]').click();
 await page.locator('#admin-code').fill('incorrect');await page.locator('[data-act=adminLogin]').click();assert((await page.locator('#admin-error').textContent()).includes('niet'));
 await page.locator('#admin-code').fill('fabian1');await page.locator('[data-act=adminLogin]').click();
 assert((await page.locator('[data-act=adminVisit]').count())>=6);
 await page.locator('[data-act=adminVisit][data-chapter="0"][data-index="7"]').click();
 assert((await page.locator('.world-heading h1').innerText()).includes('etalage'));
 await page.locator('[data-act=adminContent]').click();assert.equal(await page.locator('.admin-content-item').count(),6);
 await page.locator('[data-act=closePanel]').click();await page.locator('[data-act=adminExit]').click();
 assert((await page.locator('.world-heading h1').innerText()).includes('noodcentrale'));
 assert.equal(await page.evaluate(()=>localStorage.getItem('onder-de-oppervlakte-adventure-v2')),before);
 assert.deepEqual(errors,[]);console.log('PASS: new destination cancels NPC arrival, detailed place inspection, code-locked admin area access and learner save isolation.');
}finally{await browser.close();}
