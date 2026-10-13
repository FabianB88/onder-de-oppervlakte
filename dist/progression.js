export const LEVELS=[
 {level:1,xp:0,name:'Verkenner',perk:'Basisgereedschap',detail:'Situatie-uitleg, theorie, NPC-gesprekken en gewone hints zijn altijd beschikbaar.'},
 {level:2,xp:300,name:'Spoorzoeker',perk:'Spoorscanner',detail:'Laat een volgend hoofdspoor en eventueel benodigd gereedschap in de kamer aanwijzen.'},
 {level:3,xp:900,name:'Onderzoeker',perk:'Voorbeeldlens',detail:'Open bij een onderzoek direct een uitgewerkt theorievoorbeeld en een aanpak voor dit soort opdracht.'},
 {level:4,xp:2100,name:'Verbinder',perk:'Vergelijkingsbord',detail:'Leg twee verzamelde aanwijzingen naast elkaar en bewaar je eigen verbinding.'},
 {level:5,xp:4200,name:'Reconstructeur',perk:'Bewijskompas',detail:'Bekijk bij een eindpuzzel een inhoudelijke shortlist van bruikbaar bewijs. De verklaring kies en onderbouw je zelf.'}
];
export function progressFor(total){const earned=LEVELS.filter(l=>l.xp<=total),current=earned.at(-1)||LEVELS[0],next=LEVELS[current.level];return {current,next,earned,remaining:next?next.xp-total:0,fraction:next?Math.max(0,Math.min(1,(total-current.xp)/(next.xp-current.xp))):1};}
export const researchXP=s=>s.beats.length*30+s.rooms.length*120+Math.max(s.completedLessons?.length||0,s.finalLesson?1:0)*300;
