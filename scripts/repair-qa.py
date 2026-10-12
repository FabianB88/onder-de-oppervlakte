from pathlib import Path
for name in ['qa-module.mjs','qa-features.mjs']:
 p=Path('scripts')/name;s=p.read_text();s=s.replace("await page.goto('http://127.0.0.1:8187/');await page.addStyleTag", "await page.goto('http://127.0.0.1:8187/');await page.locator('[data-act=start]').waitFor({timeout:60000});await page.addStyleTag")
 p.write_text(s)
p=Path('scripts/qa-controls.mjs');s=p.read_text().replace("await page.locator('[data-act=start]').click();", "await page.locator('[data-act=start]').click();await page.locator('#panel [data-act=closePanel]').click();")
s=s.replace('data-index="5"','data-index="7"');p.write_text(s)
