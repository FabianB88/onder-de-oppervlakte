from pathlib import Path

root = Path(__file__).resolve().parents[1]
js = root / 'dist/adventure.js'
s = js.read_text(encoding='utf-8')
assert '${toolObject()}<div class="scene-speech"' in s
s = s.replace('${toolObject()}<div class="scene-speech"', '${toolObject()}${npcObject()}<div class="scene-speech"')
marker = 'function speak(text,name=npc().name)'
assert marker in s
s = s.replace(marker, '''function npcPosition(){const positions=[[.34,.76],[.37,.79],[.37,.79],[.31,.63],[.4,.91],[.69,.64]];const [x,y]=positions[state.room];return project({x,y},cfg().floor);}
function npcObject(){const p=npcPosition(),n=npc(),cell=state.room;return `<div class="npc-shadow" style="left:${p.x*100}%;top:${p.y*100}%"></div><button class="world-npc" data-act="approachNPC" aria-label="Praat met ${esc(n.name)}" style="left:${p.x*100}%;top:${p.y*100}%;--npc-sole:${cell<3?95:92}%;background-position:${[0,50,100][cell%3]}% ${cell<3?0:100}%"><span class="npc-label">${esc(n.name)} · ${icon('talk')}</span></button>`;}
function approachNPC(){closeTray();const p=npcPosition();walkTo(p.x+.075,p.y+.025,npcPanel);speak(`Ik loop naar ${npc().name}.`,'Jij');}
''' + marker)
s = s.replace('shadow.style.left=actor.x*100', "p.style.zIndex=actor.y<npcPosition().y?'2':'4';shadow.style.left=actor.x*100")
s = s.replace('approachTool:b=>approachTool(b.dataset.id),closeTray', 'approachTool:b=>approachTool(b.dataset.id),approachNPC,closeTray')
s = s.replace('Kies Praten om vragen te stellen en door te vragen.', 'Klik op een persoon, of kies Praten, om vragen te stellen en door te vragen.')
s = s.replace("Het leren wordt na technische en inhoudelijke controle ook met studenten onderzocht.</p>`,'Instellingen')", "Het leren wordt na technische en inhoudelijke controle ook met studenten onderzocht.</p><a class=\"research-link\" href=\"research.html\" target=\"_blank\" rel=\"noopener\">Bekijk de wetenschappelijke onderbouwing en het toetsplan ↗</a>`,'Instellingen')")
js.write_text(s, encoding='utf-8')
css = root / 'dist/adventure.css'
with css.open('a',encoding='utf-8') as f:
    f.write('''\n.world-npc{position:absolute;z-index:3;width:15.8%;aspect-ratio:1;background-image:url('assets/npcs.png');background-repeat:no-repeat;background-size:300% 200%;background-color:transparent;border:0;padding:0;transform:translate(-50%,calc(-1 * var(--npc-sole,95%)));filter:drop-shadow(0 5px 4px #08181055);cursor:pointer}.world-npc:hover{filter:drop-shadow(0 0 5px #e3c98788)}.npc-label{position:absolute;left:50%;top:96%;transform:translateX(-50%);display:flex;align-items:center;gap:6px;white-space:nowrap;background:#11271fe8;color:#f4ead3;border:1px solid #cfb57d99;border-radius:14px;padding:4px 9px;font-size:.6rem}.npc-label .ui-icon{width:13px;height:13px}.npc-shadow{position:absolute;width:4%;height:1.4%;background:#0004;filter:blur(3px);border-radius:50%;transform:translate(-50%,-50%);z-index:2;pointer-events:none}.research-link{font-size:.8rem;color:#315942;text-underline-offset:4px}@media(max-width:760px){.npc-label{font-size:.5rem;padding:3px 7px}.npc-label .ui-icon{width:10px;height:10px}}\n''')
research = root / 'dist/research.html'
r = research.read_text(encoding='utf-8').replace('Een spel dat helpt<br>leren. Aantoonbaar.', 'Ontwerpen.<br>Toetsen. Verbeteren.')
research.write_text(r,encoding='utf-8')
readme = root / 'README.md'
r = readme.read_text(encoding='utf-8').replace('the investigator and collectible-tool atlas', 'the investigator, six NPCs and collectible-tool atlas').replace('Further animation, character staging and authored object interactions', 'Further animation and authored object interactions')
readme.write_text(r,encoding='utf-8')
print('Integrated six physical NPCs and linked the research review.')
