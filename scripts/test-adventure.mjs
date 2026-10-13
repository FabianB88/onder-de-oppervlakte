import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fresh,restore,collect,finishRoom,xp,checkFinale} from '../dist/adventure-state.js';
import {inside,project,moveToward,flightBounds,flyDirection} from '../dist/navigation.js';
const book=JSON.parse(readFileSync(new URL('../dist/playbook.json',import.meta.url),'utf8')),i=book.chapters[0].investigations[0],s=fresh();
assert.throws(()=>finishRoom(s,i),/aanwijzingen/);
i.beats.forEach(b=>collect(s,b));assert.throws(()=>finishRoom(s,i),/bewijs/);
for(const slot of i.finale.slots)s.finalAnswers[`${i.id}:${slot.id}`]={option:slot.options.find(o=>o.correct).id,evidence:'invalid'};
assert(!checkFinale(s,i.finale,i.id));assert.throws(()=>finishRoom(s,i));
for(const slot of i.finale.slots)s.finalAnswers[`${i.id}:${slot.id}`].evidence=slot.evidenceBeatId;
finishRoom(s,i);const before=xp(s);i.beats.forEach(b=>collect(s,b));finishRoom(s,i);assert.equal(xp(s),before);assert.equal(s.rooms.length,1);
const restored=restore({...s,beats:[...s.beats,'bad','bad'],rooms:[...s.rooms,'bad'],room:99},book);assert.equal(restored.beats.length,i.beats.length);assert.equal(restored.rooms.length,1);
const poly=[{x:.2,y:.5},{x:.8,y:.5},{x:.8,y:.95},{x:.2,y:.95}];assert(inside(project({x:-2,y:4},poly),poly));let p={x:.25,y:.85},goal={x:.7,y:.55},frames=0;while(!p.arrived&&frames++<300){p=moveToward(p,goal,1/60);assert(inside(p,poly));}assert(p.arrived);assert(frames<300);assert.equal(moveToward(goal,goal,.02).arrived,true);
console.log('PASS: investigation/evidence gates, replay XP invariants, restored state, reachable walking and floor bounds.');
// Keyboard flight must cross the old floor boundary and remain speed-limited.
let drone={x:.5,y:.85};for(let n=0;n<90;n++)drone=flyDirection(drone,0,-1,1/60);assert(drone.y<.45);assert(inside(drone,flightBounds));
const straight=flyDirection({x:.5,y:.6},1,0,.02),diagonal=flyDirection({x:.5,y:.6},1,1,.02);assert(Math.abs(Math.hypot((diagonal.x-.5)*1.78,diagonal.y-.6)-Math.hypot((straight.x-.5)*1.78,straight.y-.6))<1e-10);
assert(inside(flyDirection({x:.5,y:.6},-1,-1,1000),flightBounds));
console.log('PASS: free drone movement across former invisible barriers, normalized diagonal speed and bounded frame time.');
