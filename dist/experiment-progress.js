import {contrasted} from './simulations.js';

const total=v=>v.production+v.repair+v.emergency;
const feasible=v=>['production','repair','emergency'].every(k=>Number.isFinite(v[k])&&v[k]>=0&&v[k]<=(k==='production'?60:40))&&total(v)>0&&total(v)<=100;
const pair=(trials,test)=>trials.some((a,n)=>trials.slice(n+1).some(b=>test(a.values,b.values)));
export function experimentReady(beat,trials=[]){
 if(beat.simulationSpec)return contrasted(beat,trials);
 if(beat.simulation==='electricity')return pair(trials,(a,b)=>feasible(a)&&feasible(b)&&total(a)===total(b)&&['production','repair','emergency'].some(k=>a[k]!==b[k]));
 if(beat.simulation==='externalities')return pair(trials,(a,b)=>a.share!==b.share&&a.share>=0&&a.share<=100&&b.share>=0&&b.share<=100);
 return false;
}
export function experimentSteps(beat,trials=[]){
 const varied=(key,fixed)=>pair(trials,(a,b)=>a[key]!==b[key]&&fixed.every(k=>a[k]===b[k]));
 const has=test=>trials.some(t=>test(t.values));
 const rows={
  electricity:[['Bewaar een eerste uitvoerbaar plan dat stroom gebruikt.',has(feasible)],['Bewaar een andere verdeling die evenveel stroom gebruikt. Zo vergelijk je wie het tekort draagt. De voorbeeldknoppen zetten twee plannen van 100 klaar.',experimentReady(beat,trials)]],
  externalities:[['Bewaar een eerste afspraak over wie de schade betaalt.',trials.length>0],['Bewaar een afspraak met een ander NOVA-aandeel. Iedere verandering telt; de productie blijft gelijk.',experimentReady(beat,trials)]],
  incentives:[['Vergelijk een onbeschermde meldroute bij targetdruk 2.',has(v=>v.protected===0&&v.pressure===2)],['Vergelijk een beschermde route met meer beoordelingsplaatsen dan targetdruk.',has(v=>v.protected===1&&v.reviewTime>v.pressure)]],
  governance:[['Bewaar de huidige regels: panelrecht 0, horizon 1, aparte criteria 0.',has(v=>v.voice===0&&v.horizon===1&&v.broad===0)],['Bewaar de herziene regels: panelrecht 2, horizon 5, aparte criteria 1.',has(v=>v.voice===2&&v.horizon===5&&v.broad===1)]],
  sorter:[['Vergelijk beide doelen met dezelfde oefendata en menselijke controle.',varied('goal',['representativeTraining','humanReview'])],['Vergelijk beperkte en bredere oefendata met hetzelfde doel en dezelfde controle.',varied('representativeTraining',['goal','humanReview'])]],
  'claim-boundary':[['Vergelijk twee volumes met dezelfde verbetering en hetzelfde pilotaandeel.',varied('productionMultiplier',['perUnitReduction','coveragePercent'])],['Vergelijk twee pilotaandelen met hetzelfde volume en dezelfde verbetering.',varied('coveragePercent',['productionMultiplier','perUnitReduction'])]]
 };
 return (rows[beat.simulation]||[]).map(([text,done])=>({text,done}));
}
export function exampleTrials(beat){
 return {
  electricity:[{label:'Voorbeeld A · productie voorrang',values:{production:60,repair:20,emergency:20}},{label:'Voorbeeld B · reparatie en noodtoestellen voorrang',values:{production:20,repair:40,emergency:40}}],
  externalities:[{label:'Voorbeeld A · NOVA betaalt geen schade',values:{share:0}},{label:'Voorbeeld B · NOVA betaalt alle schade',values:{share:100}}],
  incentives:[{label:'A · onbeschermde route',values:{pressure:2,reviewTime:1,protected:0}},{label:'B · beschermde route met ruimte',values:{pressure:2,reviewTime:4,protected:1}}],
  governance:[{label:'A · huidige regels',values:{voice:0,horizon:1,broad:0}},{label:'B · herziene regels',values:{voice:2,horizon:5,broad:1}}],
  sorter:[{label:'A · verkoopdoel, beperkte oefendata',values:{goal:'value',representativeTraining:false,humanReview:false}},{label:'B · terugwinning, beperkte oefendata',values:{goal:'recovery',representativeTraining:false,humanReview:false}},{label:'C · terugwinning, bredere oefendata',values:{goal:'recovery',representativeTraining:true,humanReview:false}}],
  'claim-boundary':[{label:'A · 1.000 stuks, 20% verbetering, 5% pilot',values:{productionMultiplier:1,perUnitReduction:20,coveragePercent:5}},{label:'B · 2.000 stuks, dezelfde pilot',values:{productionMultiplier:2,perUnitReduction:20,coveragePercent:5}},{label:'C · 2.000 stuks, verbetering overal',values:{productionMultiplier:2,perUnitReduction:20,coveragePercent:100}}]
 }[beat.simulation]||[];
}
