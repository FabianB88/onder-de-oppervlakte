from pathlib import Path
p=Path('dist/adventure.js');s=p.read_text(encoding='utf-8')
start=s.index('try{[course,campaign,book,extras,briefings]')
normal=s.index('book.chapters.forEach((ch,n)=>',start)
npc=s.index("dialogues=await(await fetch('npc-dialogues.json'))",normal)
raw=s.index('let raw;try{raw=',npc)
prefix="try{[course,campaign,book,extras,briefings,dialogues]=await Promise.all(['course.json','campaign.json','module.json','room-extras.json','briefings.json','dialogues.json'].map(async url=>{const r=await fetch(url);if(!r.ok)throw Error('De adventure wordt klaargezet.');return r.json();}));"
s=s[:start]+prefix+s[normal:npc]+s[raw:]
p.write_text(s,encoding='utf-8')
