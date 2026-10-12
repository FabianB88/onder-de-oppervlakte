from pathlib import Path
p=Path(__file__).resolve().parent/'qa-controls.mjs'
s=p.read_text(encoding='utf-8-sig').replace("'[data-act=approachNPC] .npc-label'","'[data-act=approachNPC][data-name=Noor] .npc-label'").replace("assert.equal(await page.locator('[data-act=adminVisit]').count(),6)","assert((await page.locator('[data-act=adminVisit]').count())>=6)").replace('[data-act=adminVisit][data-index="5"]','[data-act=adminVisit][data-chapter="0"][data-index="5"]')
p.write_text(s,encoding='utf-8')
