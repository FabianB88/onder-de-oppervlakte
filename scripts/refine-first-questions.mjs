import fs from 'node:fs';
const book=JSON.parse(fs.readFileSync('dist/playbook.json','utf8')),ch=book.chapters[0],items=ch.knowledgeCheck.items.slice(0,8);
const alternatives=[
 [
  ['Een expliciet verdelingscriterium, de relevante behoeften en de gevolgen voor de betrokken groepen.','Uitvoerbaarheid begrenst de mogelijkheden. Een norm en de gevolgen onderbouwen welke verdeling je verdedigt.'],
  ['Een vergelijking van gemiddelde wachttijd, waarna de laagste gemiddelde waarde de verdeling verantwoordt.','Een gemiddelde is een gekozen maatstaf. Je moet verantwoorden welke verschillen en behoeften het gemiddelde wel en niet meeneemt.'],
  ['Een gelijke openstelling per afdeling, omdat een gelijke procedure ook gelijke bescherming voor cliënten biedt.','Gelijke procedures kunnen bij ongelijke behoeften verschillende bescherming bieden. De normatieve afweging blijft nodig.'],
  ['Een peiling onder alle medewerkers, waarna de meest populaire optie het verdelingscriterium vastlegt.','Een peiling geeft voorkeuren, maar onderbouwt nog niet hoe behoeften en gevolgen voor cliënten moeten worden gewogen.']
 ],
 [
  ['De tweede kan een lagere bedrijfsprijs hebben terwijl dezelfde totale last anders over betrokkenen wordt verdeeld.','De rekening ligt anders. De gegeven hoeveelheden tonen geen daling van de gezamenlijke afvalkosten.'],
  ['De eerste heeft een hogere maatschappelijke last, omdat de verwerkingsbetaling aan haar productiekosten wordt toegevoegd.','Je telt bij de eerste kosten mee die bij de tweede buiten de bedrijfsrekening vallen. Een volledige vergelijking moet dezelfde grenzen gebruiken.'],
  ['De tweede is productiever, omdat een lagere bedrijfsprijs bij gelijke hoeveelheden meer economische waarde toevoegt.','Lagere eigen kosten kunnen door afwenteling ontstaan. Dit is geen bewijs van een efficiëntieverbetering in verwerking of productie.'],
  ['De eerste verlaagt de totale afvalschade zodra de verwerkingsrekening op haar eigen factuur verschijnt.','Betaling verandert de kostendrager. Voor daadwerkelijke schadevermindering zijn een veranderde verwerking of andere gevolgen nodig.']
 ],
 [
  ['Afspraken over gezamenlijk gebruik, herstelgrenzen, toezicht en verdeling naast het betalen van afvalkosten.','Het nieuwe probleem betreft gedeeld gebruik boven de aanvulling. De afvalrekening alleen organiseert die gebruiksgrens niet.'],
  ['Een gelijke waterbijdrage per gebruiker, waarbij de som van de betalingen de herstelgrens van het gebied bepaalt.','Betalingen bepalen de fysieke aanvulling niet. Meet het gebied en organiseer het gebruik binnen die grens.'],
  ['Een individuele korting voor minder afval, waarbij verbetering van de afvalprestatie ook wateronttrekking beheerst.','Afval en wateronttrekking zijn verschillende mechanismen. Een gekoppelde prikkel zou eerst op dat effect moeten worden onderzocht.'],
  ['Een vrijwillige publieksrapportage van afvalbetalingen, waarbij transparantie de gezamenlijke gebruiksafspraak vervangt.','Transparantie kan helpen, maar bepaalt geen limiet, verdeling, toezicht of passende reactie op overschrijding.']
 ],
 [
  ['Verbind winning, verwerking, gebruik en afval aan betrokken partijen, belangen, afhankelijkheden en ontbrekende gegevens.','Zo onderzoek je de materiële route en de verdeling van gevolgen en invloed, ook buiten de laatste overdracht.'],
  ['Vergelijk leveranciersverklaringen en neem de eindverkoper als verantwoordelijk voor de onderliggende ketenkwaliteit.','Verklaringen zijn informatie, maar de analyse moet aantonen welke mechanismen en gevolgen in andere schakels bestaan.'],
  ['Bereken de toegevoegde waarde per schakel en gebruik die verdeling als maat voor de invloed van iedere partij.','Toegevoegde waarde en invloed zijn verschillende grootheden. Controle over infrastructuur of toegang vraagt eigen bewijs.'],
  ['Volg alle eigendomsoverdrachten en leg de lasten bij de partij die op elk moment formeel eigenaar is.','Een eigendomspositie vertelt niet vanzelf wie schade veroorzaakt, ondergaat of een besluit kan veranderen.']
 ],
 [
  ['Onderzoek hoe meetlat, beloning en bevoegdheid individuele zorg beperken en hoe een ingreep daarop werkt.','Het patroon vraagt concrete systeeminformatie én aandacht voor menselijke handelingsruimte en verantwoordelijkheid.'],
  ['Maak de zorgverklaring preciezer en toets vervolgens of medewerkers haar tijdens dezelfde targetdruk onderschrijven.','Instemming meet een uitgesproken waarde. De oorspronkelijke meetlat, budgetgevolgen en beslisruimte kunnen het gedrag blijven sturen.'],
  ['Vergelijk individuele overtuigingen en verklaar de lagere reparatiescore uit de medewerkers met de laagste zorgscore.','Een verband tussen overtuiging en score sluit een sturend beloningssysteem niet uit. Onderzoek de concrete werkvoorwaarden.'],
  ['Laat elke medewerker zelf afwegen hoeveel reparatie acceptabel is, terwijl score en budget aan nieuwverkoop gekoppeld blijven.','Individuele keuze kan ruimte geven, maar behoudt de beschreven organisatorische sanctie op repareren. Die spanning verdient onderzoek.']
 ],
 [
  ['Een mogelijke route naar vermogensconcentratie, afhankelijk van beginbezit, herinvestering, erfenissen, belasting en instituties.','De verhouding is relevant voor cumulatie onder voorwaarden. Zij bepaalt niet zonder verdere gegevens iedere huishoudelijke uitkomst.'],
  ['Een groei van het gemiddelde arbeidsinkomen die dezelfde verhouding volgt als het rendement op bestaand bezit.','Arbeidsinkomen en vermogensrendement zijn verschillende stromen. Het rapport geeft geen gelijke ontwikkeling van lonen.'],
  ['Een herverdeling naar nieuwe beleggers, omdat economische groei langzamer stijgt dan de opbrengst op vermogen.','De verhouding toont niet wie vermogen bezit of toegang krijgt. Beginverdeling en institutionele voorwaarden blijven bepalend.'],
  ['Een concentratieverklaring op basis van het rendementsverschil alleen, waarbij belasting en erfenissen uitsluitend de meetfout beïnvloeden.','Belasting, erfenissen en herinvestering veranderen het verdelingsmechanisme zelf, niet alleen de nauwkeurigheid van een indicator.']
 ],
 [
  ['Onderzoek wie data en toegang controleert, wie waarde bijdraagt en welke regels opbrengst en invloed verbinden.','Bijdrage, eigendomsrecht en beslisrecht zijn verschillende posities. Onderzoek hun institutionele koppeling.'],
  ['Vergelijk het gebruiksvolume per deelnemer en wijs zeggenschap toe op basis van de huidige omzet per account.','Gebruiksvolume en omzet tonen geen bestaande rechten of controle over toegang. Je hebt afzonderlijk bewijs van die posities nodig.'],
  ['Gebruik de verdeling van platformaandelen als afspiegeling van de totale maatschappelijke bijdrage aan het netwerk.','Gebruikers, medewerkers en publieke infrastructuur kunnen waarde leveren zonder overeenkomstige eigendomsrechten.'],
  ['Meet toegangstarieven en gebruik het laagste tarief als aanwijzing dat deelnemers de platformregels gezamenlijk bepalen.','Toegang en prijs zeggen niet wie een regel kan wijzigen. Een goedkope dienst kan toch sterk geconcentreerde controle kennen.']
 ],
 [
  ['Onderzoek de meerderheid als informatie, mogelijke verliesdruk en de ontworpen zichtbaarheid van alternatieven met onderscheidende vergelijkingen.','Deze mechanismen kunnen samen optreden. Vergelijk bijvoorbeeld de deadline en populariteitsmelding afzonderlijk.'],
  ['Vergelijk de verkoop vóór en na de campagne en schrijf het verschil toe aan verliesaversie vanwege de vervaldatum.','De campagne veranderde tegelijk sociale informatie en zichtbaarheid. Het verkoopverschil is niet uniek aan verliesdruk toe te schrijven.'],
  ['Houd de prijs constant en schrijf de resterende verandering toe aan kuddegedrag zolang alternatieve producten beschikbaar zijn.','Een gelijke prijs en formele beschikbaarheid houden framing, aandacht en deadline-effecten nog niet gelijk.'],
  ['Meet de gekozen producten en verklaar populariteit als een bestaande voorkeur die door de boodschap vooral wordt geregistreerd.','Dat is een mogelijke hypothese, maar het eindpatroon onderscheidt registratie en beïnvloeding niet. Je hebt vergelijkingsgegevens nodig.']
 ]
];
items.forEach((q,n)=>{q.options=alternatives[n].map(([text,feedback],k)=>({id:'a'+k,text,feedback,correct:k===0}));const target=[1,3,0,2,3,1,2,0][n];const answer=q.options.shift();q.options.splice(target,0,answer);});
items.push({id:'m1-q9',question:'Twee buurten hebben hetzelfde gemiddelde inkomen. In de eerste bezit een kleine groep bijna alle woningen; in de tweede is woningbezit breder verdeeld. Welke extra vergelijking is nodig voor een onderbouwd verdelingsoordeel?',concepts:['inkomen versus vermogen','indicatorgrenzen'],sourceBlocks:[3,19],options:[
 {id:'a0',text:'Vergelijk het gemiddelde inkomen opnieuw over een langere periode; dat maakt het woningbezit onderdeel van dezelfde indicator.',correct:false,feedback:'Een langere inkomensperiode verandert inkomen niet in een vermogensvoorraad. Eigendom en toegang vragen afzonderlijke gegevens.'},
 {id:'a1',text:'Vergelijk de huidige huurprijzen en behandel een gelijke huur als bewijs van dezelfde bezitsverdeling.',correct:false,feedback:'Een prijs kan bij verschillende eigendomsverdelingen voorkomen. Het zegt ook niet wie waardestijging of zeggenschap ontvangt.'},
 {id:'a2',text:'Onderzoek inkomensspreiding, nettovermogen, eigendomsrechten en toegang tot wonen naast het gemiddelde.',correct:true,feedback:'Het gemiddelde verbergt spreiding. Voor het verdelingsoordeel zijn verschillende stromen, voorraden en toegangsdimensies relevant.'},
 {id:'a3',text:'Gebruik de inkomens-Gini als maat voor woningbezit en leid daaruit af welke buurt een eerlijker woonbeleid heeft.',correct:false,feedback:'Een inkomensmaat meet niet vanzelf vermogen of toegang. Ook het normatieve oordeel vraagt een verantwoord criterium.'}
]});
items.push({id:'m1-q10',question:'Een fabriek verlaagt materiaalgebruik per toestel met 20% en maakt vervolgens 50% meer toestellen. Welke conclusie wordt door alleen deze gegevens gedragen?',concepts:['relatieve versus absolute ontkoppeling','productievolume'],sourceBlocks:[21],options:[
 {id:'a0',text:'Binnen dezelfde meetgrens stijgt het totale materiaalgebruik met 20%; het effect op alle levenscyclusimpacts is hiermee nog onbekend.',correct:true,feedback:'0,8 × 1,5 = 1,2. Een intensiteitsverbetering gaat hier samen met meer totaal materiaal. Andere impacts en systeemgrenzen vragen extra gegevens.'},
 {id:'a1',text:'De totale materiaalbesparing blijft 20%, omdat de efficiencymaat al rekening houdt met het aantal gemaakte toestellen.',correct:false,feedback:'De efficiencymaat is per toestel. Het totale gebruik vereist vermenigvuldiging met het nieuwe volume.'},
 {id:'a2',text:'De stijging toont een reboundeffect veroorzaakt door de lagere materiaalkosten, ook zonder informatie over de verkoopbeslissing.',correct:false,feedback:'Het totale gebruik neemt toe, maar de oorzaak van het extra volume is niet gegeven. Rebound vraagt een verband met de efficiencyverbetering.'},
 {id:'a3',text:'De twee percentages tonen dat economische groei in deze fabriek absoluut is ontkoppeld van materiaalgebruik.',correct:false,feedback:'Absolute ontkoppeling vraagt dalend totaal materiaal bij groei binnen de meetgrens. Hier neemt het totaal juist toe.'}
]});
ch.knowledgeCheck.items=items;
ch.investigations.find(i=>i.id==='m1-05').beats.find(b=>b.id==='m1-05-b6').requiresTool='ledger';
ch.investigations.find(i=>i.id==='m1-06').beats.find(b=>b.id==='m1-06-b2').requiresTool='lens';
fs.writeFileSync('dist/playbook.json',JSON.stringify(book,null,2)+'\n');console.log('First lesson: ten application questions with plausible alternatives and balanced keys.');
