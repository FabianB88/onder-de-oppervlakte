from pathlib import Path
p=Path('dist/adventure.js');s=p.read_text(encoding='utf-8');s=s.replace("title.replace(/\\s*\\(kort\\)/,'')}","title.replace(/\\s*\\(kort\\)/,''))}");p.write_text(s,encoding='utf-8')
p=Path('scripts/build-plan.mjs');s=p.read_text(encoding='utf-8').replace('Twaalf oorspronkelijke clips','Dertien oorspronkelijke clips');p.write_text(s,encoding='utf-8')
p=Path('scripts/qa-module.mjs');s=p.read_text().replace("page.locator('[data-act=beginKnowledge]').click()", "page.locator('.admin-bar [data-act=beginKnowledge]').click()");s=s.replace("await page.screenshot({path:fileURLToPath", "await page.screenshot({path:fileURLToPath")
s=s.replace("await page.screenshot({path:`qa/${i.id}-scene.png`});", "if(room===0)await page.screenshot({path:`qa/${i.id}-scene.png`});")
p.write_text(s)
p=Path('scripts/qa-features.mjs');s=p.read_text().replace("await page.screenshot({path:`qa/${i.id}-latest.png`});", "if(room===0)await page.screenshot({path:`qa/${i.id}-latest.png`});");p.write_text(s)
