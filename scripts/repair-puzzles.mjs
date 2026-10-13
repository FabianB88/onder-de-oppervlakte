// Explicit evidence alternatives: shared subject matter alone is not sufficient.
import fs from 'node:fs';
const book=JSON.parse(fs.readFileSync('dist/playbook.json','utf8'));
const room=id=>book.chapters[0].investigations.find(i=>i.id===id);
const first=room('m1-01'),depot=room('m1-02');
first.beats.find(b=>b.id==='m1-01-case').reveal.find(r=>r.id==='mission').text='De accu bevat 100 eenheden; de drie aanvragen tellen op tot 140. Er ontbreekt dus 40. Een ethisch oordeel vraagt wat we behoren te doen en waarom. De cijfers tonen wat mogelijk is; je verdelingsregel bepaalt wiens behoefte voorrang krijgt en wie wacht. Verantwoord je regel met belangen en gevolgen voor alle drie de groepen.';
first.finale.intro='Je moet het noodbesluit uitleggen aan productie, reparatie en noodklanten. Beantwoord twee vragen: waarom blijft er een tekort, en hoe verantwoord je wie voorrang krijgt? Kies per vraag een aanwijzing en een verklaring.';
first.finale.facts=['De accu bevat 100 energie-eenheden. Productie vraagt 60, reparatie 40 en noodklanten 40: samen 140.','Je verandert in de proef alleen de verdeling. De accu en de aanvragen blijven gelijk.','De cijfers zeggen hoeveel beschikbaar is. Om te bepalen wie voorrang hoort te krijgen, heb je ook een reden nodig.'];
const [cause,rule]=first.finale.slots;
cause.label='Je verdeelt dezelfde 100 eenheden anders. Waarom blijft er toch een tekort?';
cause.evidenceBeatIds=['m1-01-b1','m1-01-b2','m1-01-case'];
cause.evidenceHelp='Zoek bewijs met de beschikbare stroom en de drie aanvragen. Vergelijk die totalen; een bedrijfsstandpunt alleen geeft die rekensom niet.';
cause.evidenceNotes={
 'm1-01-case':'De aanvragen en de opdracht noemen 140 gevraagd en 100 beschikbaar. Er blijft 40 onvervuld, ongeacht wie voorrang krijgt.',
 'm1-01-b1':'Je stroomproeven gebruiken dezelfde accu en aanvragen. Een andere verdeling verandert wie wacht, niet het tekort van 40.',
 'm1-01-b2':'De meetkaarten geven 100 beschikbaar en 140 gevraagd. Het verschil blijft bestaan wanneer je een ander criterium kiest.'
};
cause.options.find(o=>o.id==='cap').text='Er wordt 140 gevraagd en er is 100 beschikbaar. Een andere verdeling verandert wie de ontbrekende 40 draagt.';
rule.label='De cijfers tonen het tekort. Wat heb je daarnaast nodig om voorrang te rechtvaardigen?';
rule.evidenceBeatIds=['m1-01-b2','m1-01-case','m1-01-b1','m1-01-b3','m1-01-friedman'];
rule.evidenceHelp='Zoek een aanwijzing die laat zien welke belangen een regel beschermt en wie de gevolgen draagt. Een meetgetal kan die prioriteit niet zelfstandig rechtvaardigen.';
rule.evidenceNotes={
 'm1-01-b2':'De twee stapels onderscheiden meetgegevens van waardeoordelen: hoeveel stroom er is en welke reden je voor voorrang gebruikt.',
 'm1-01-case':'De aanvragen benoemen verschillende belangen. De opdracht vraagt je uit te leggen waarom je het ene belang voorrang geeft en wat dat voor anderen betekent.',
 'm1-01-b1':'Je proeven laten zien dat uitvoerbare plannen verschillende groepen laten wachten. Om een plan te kiezen moet je verantwoorden welke gevolgen zwaarder wegen.',
 'm1-01-b3':'De winstregel vraagt wie bescherming krijgt, wie nadeel draagt en wie de regel kan herzien. Een regel is daarmee meer dan een technische rekensom.',
 'm1-01-friedman':'Het dossier beschrijft een standpunt over verantwoordelijkheid en vergelijkt belangen. Een standpunt geeft redenen voor een prioriteit, niet meer stroom.'
};
rule.options.find(o=>o.id==='values').text='Een verdelingscriterium met redenen: welke belangen krijgen voorrang, en welke gevolgen heeft dat voor de andere groepen?';
depot.finale.intro='Je onderzoekt twee vragen over dezelfde rivier: wie draagt de lozingsschade, en hoe regelen de gebruikers het gedeelde water? Verbind per vraag een gevonden aanwijzing aan een verklaring.';
depot.finale.facts=['De fabriek loost afvalwater. In deze fictieve situatie verliezen vissers daardoor inkomen.','De productfactuur vergoedt hun schade niet. De fabriek, bewoners en vissers hebben dezelfde rivier nodig.','In de rekeningproef veranderen de productie en de lozing niet. Je verandert uitsluitend wie de vaste kosten betaalt.'];
const [cost,agreement,prediction]=depot.finale.slots;
cost.evidenceBeatIds=['m1-02-b1','m1-02-case'];
cost.evidenceHelp='Zoek het bericht over vissersschade en de ontbrekende vergoeding in de productfactuur. Dat verbindt een productiegevolg aan een last voor een derde partij.';
cost.evidenceNotes={'m1-02-b1':'De factuur en het vissersbericht tonen schade door productie die anderen dragen. Dat is de negatieve externaliteit.','m1-02-case':'De herkomstkaart en het bericht verbinden de fabriekslozing aan vissersverlies buiten de koopovereenkomst. Dat ondersteunt de verklaring van een negatieve externaliteit.'};
agreement.evidenceBeatIds=['m1-02-b3','m1-02-water'];
agreement.evidenceHelp='Zoek bewijs over de gebruiksgrens, invloed van gebruikers en controle. Alleen een betaling zegt nog niet hoe het gedeelde water wordt beheerd.';
agreement.evidenceNotes={'m1-02-b3':'Je afspraak verbindt een onderbouwde grens met inspraak, metingen en ingrijpen. Daarmee organiseer je gezamenlijk gebruik.','m1-02-water':'De vier onderdelen leggen uit waarom grenzen, inspraak en controle samen nodig zijn voor het beheer van de rivier.'};
prediction.evidenceBeatIds=['m1-02-b2'];
prediction.evidenceHelp='Gebruik de rekeningproef: die houdt de productie en schade gelijk terwijl je het NOVA-aandeel verandert. Zo kun je betaling onderscheiden van schadepreventie.';
prediction.evidenceNotes={'m1-02-b2':'De twee kostenposten tellen steeds op tot €12.000. Als NOVA meer betaalt, betalen anderen minder. De proef verandert de lozing niet.'};
fs.writeFileSync('dist/playbook.json',JSON.stringify(book,null,2)+'\n');
console.log('Repaired explicitly supported evidence in the first two area puzzles.');
