import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,d)=>fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');
const book=read('dist/playbook.json'),ch=book.chapters[0],area=ch.investigations.find(i=>i.id==='m1-03');
area.sourceProjections=[{id:'rare-metals',title:'De schaduwkant van kritieke metalen',youtube:'mmXGtf6GRjM',start:0,sourceBlocks:[11],purpose:'Onderzoek het oorspronkelijke korte bronfragment naast jouw gereconstrueerde materiaalroute.',viewingTask:'Welke afhankelijkheid of machtspositie noemt het fragment? Welk bewijs wordt gegeven, en wat blijft onduidelijk?',afterPrompt:'Verbind één concreet bronvoorbeeld aan een schakel in de keten. Leg uit wie afhankelijk is van wie en welke informatie nog ontbreekt.',knownCoreConcepts:['grondstoffenketen','geopolitieke macht'],contentVerification:'Exacte VPRO-video van 60 seconden, oorspronkelijke cursusbron. Metadata gecontroleerd; volledige gesproken inhoud nog niet onafhankelijk geverifieerd.'}];
write('dist/playbook.json',book);
for(let n=2;n<=5;n++){
 const file=`dist/chapters/m${n}.json`,chapter=read(file);
 for(const i of chapter.investigations){
  for(const b of i.beats)if(b.type==='experiment'){if(b.simulation==='governance')b.requiresTool='ledger';if(b.simulation==='sorter')b.requiresTool='key';if(b.simulation==='claim-boundary')b.requiresTool='lens';}
  i.world.spots??=[{id:i.id+'-record',title:'Werknotitie naast het dossier',point:[.18,.55],approach:[.25,.7],observation:'Een korte werknotitie verbindt dit dossier met de dagelijkse praktijk.',detail:i.beats[0].hint},{id:i.id+'-empty',title:'Een ongebruikte lade',point:[.84,.73],approach:[.76,.83],observation:'De lade is leeg. De krassen en stoflaag vertellen niet waarom het besluit is genomen.',detail:'Dit spoor geeft geen inhoudelijk bewijs voor je verklaring. Een onderzoek bevat ook doodlopende sporen: keer terug naar de concrete documenten, handelingen en mensen.'}];
 }
 write(file,chapter);
}
const pkg=read('package.json');pkg.version='0.3.0';pkg.scripts.test='node scripts/check-module.mjs && node scripts/test-adventure.mjs && node scripts/test-models.mjs';write('package.json',pkg);
