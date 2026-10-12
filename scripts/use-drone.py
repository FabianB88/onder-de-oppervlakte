from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'dist/adventure.js'
s=p.read_text(encoding='utf-8')
s=s.replace('src="assets/player.png" alt="Je onderzoeker"','src="assets/drone.png" alt="Je onderzoeksdrone"')
s=s.replace('Loop door de kamers. Spreek de mensen.','Verken de kamers. Spreek de mensen.')
s=s.replace('Loop door ${esc(c.name)} met WASD, pijltjestoetsen of door op de vloer te klikken','Bestuur je onderzoeksdrone in ${esc(c.name)} met WASD, pijltjestoetsen of door te klikken')
s=s.replace('Klik op de vloer om te lopen · klik op een voorwerp om het te onderzoeken','Klik om te vliegen · klik op een voorwerp om het te onderzoeken')
s=s.replace('WASD / pijltjes · klik om te lopen','WASD / pijltjes · klik om te vliegen')
s=s.replace("translate(-50%,-95%) scaleX(${actor.facing||1}) scale(${.83+(actor.y-.55)*.6})", "translate(-50%,-148%) rotate(${goal?(actor.facing||1)*5:0}deg) scale(${.83+(actor.y-.55)*.6})")
s=s.replace('Ik loop naar ${npc().name}.','Ik vlieg naar ${npc().name}.')
s=s.replace('<h3>Lopen en kijken</h3><p>Klik op de vloer of gebruik WASD / pijltjestoetsen. Klik op een voorwerp: je onderzoeker loopt erheen.</p>', '<h3>Vliegen en kijken</h3><p>Bestuur je onderzoeksdrone door te klikken of met WASD / pijltjestoetsen. Klik op een voorwerp: je drone vliegt erheen.</p>')
p.write_text(s,encoding='utf-8')
with (root/'dist/adventure.css').open('a',encoding='utf-8') as f:
    f.write('''\n.actor{height:auto;width:14%;animation:drone-hover 2.6s ease-in-out infinite;filter:drop-shadow(0 4px 3px #08181055)}.actor.walking{animation:drone-hover 1.4s ease-in-out infinite}.foot-shadow{width:5%;height:1.3%;opacity:.65;filter:blur(4px)}@keyframes drone-hover{0%,100%{translate:0 -2px}50%{translate:0 -7px}}@media(prefers-reduced-motion:reduce){.actor,.actor.walking{animation:none}}\n''')
p=root/'README.md'
s=p.read_text(encoding='utf-8').replace('Walk with the arrow keys, WASD, or by clicking the floor.', 'Fly the inspection drone with the arrow keys, WASD, or by clicking a destination.').replace('the investigator, six NPCs', 'the inspection drone, the early investigator study and six NPCs')
p.write_text(s,encoding='utf-8')
print('Drone protagonist, grounded hover motion and movement instructions prepared.')
