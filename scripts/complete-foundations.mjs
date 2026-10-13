import fs from 'node:fs';
const file='dist/learning-guides.json',data=JSON.parse(fs.readFileSync(file,'utf8'));
const additions={
 'm1-01':{term:'Normatieve afweging',text:'Afwegen wat je behoort te doen en waarom. Je vergelijkt redenen zoals noodzaak, gelijkheid en bestaanszekerheid. Dat verschilt van alleen meten wat er is. Je kunt het eens zijn over 100 beschikbare eenheden en toch verschillend oordelen over voorrang.'},
 'm1-05':{term:'Neoliberalisme',text:'Een benadering waarin marktwerking, private eigendom en concurrentie een grote rol krijgen. Dat kan samengaan met privatisering of veranderingen in regels. Het is geen land zonder overheid: onderzoek juist welke regels de markt vormgeven en wie daardoor invloed of bescherming krijgt.'},
 'm1-06':{term:'Morele ontkoppeling',text:'Een verhaal gebruiken waardoor de morele gevolgen van gedrag minder aandacht krijgen. Bijvoorbeeld schade klein noemen of zeggen dat een ander verantwoordelijk is. Zo kun je een gerust gevoel houden terwijl de gevolgen voor anderen niet veranderen.'}
};
for(const [id,c]of Object.entries(additions)){const core=data.rooms[id].core;if(!core.some(x=>x.term===c.term))core.push(c);}
const aliases={
 'Negatieve externaliteit':['externaliteiten','externaliteit'],
 'Verdelingscriterium':['waarden in prioriteiten','rechtvaardige verdeling'],
 'Vermogensgroei: r en g':['Piketty','r groter dan g','cumulatieve vermogensgroei'],
 'Prikkel':['prikkels'],
 'Kosten internaliseren':['internaliseren'],
 'Trainingsdata en bias':['trainingsdata','representativiteit','bias'],
 'Structuur en agency':['structuur','agency'],
 'Arbeidsaandeel en winstopslag':['arbeidsaandeel','winstopslag'],
 'Kuddegedrag':['kuddegedrag bij onzekerheid'],
 'Relatieve en absolute ontkoppeling':['relatieve versus absolute ontkoppeling']
};
for(const g of Object.values(data.rooms))for(const c of g.core)if(aliases[c.term])c.aliases=aliases[c.term];
fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
console.log('Foundation explanations include the abstract terms introduced in early puzzles.');
