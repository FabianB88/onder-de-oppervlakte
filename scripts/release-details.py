from pathlib import Path
p=Path('dist/adventure.js');s=p.read_text(encoding='utf-8');s=s.replace('render();},export:exportSave','render();if(!admin.active)welcomeArea();},export:exportSave')
s=s.replace("required==='map'?'bij de routekaart in het vorige depot':'in deze kamer'", "(state.chapter||0)>0?'in de eerste les; je kunt daar via Route terugkijken':required==='map'?'bij de routekaart in het vorige depot':'in deze kamer'")
s=s.replace('title="${esc(b.title)}"><span class="object-dot">', 'aria-label="${esc(b.title)}" title="${esc(b.title)}"><span class="object-dot">')
s=s.replace('course.lessons[state?.chapter||0].title)', "course.lessons[state?.chapter||0].title.replace(/\\s*\\(kort\\)/,'')")
s=s.replace('Bekijk de wetenschappelijke onderbouwing en het toetsplan ↗</a>', 'Bekijk de wetenschappelijke onderbouwing en het toetsplan ↗</a><br><a class="research-link" href="plan.html" target="_blank" rel="noopener">Bekijk het volledige bouwplan ↗</a>')
p.write_text(s,encoding='utf-8')
p=Path('scripts/build-plan.mjs');s=p.read_text().replace('Twaalf oorspronkelijke clips','Dertien oorspronkelijke clips');p.write_text(s)
