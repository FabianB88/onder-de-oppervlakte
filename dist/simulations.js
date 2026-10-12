export const customSimulation=b=>Boolean(b.simulationSpec);
export function defaults(spec){return {...Object.fromEntries(spec.parameters.map(p=>[p.id,p.default??(p.type==='boolean'?false:p.options?.[0]?.value??p.min??0)])),...spec.defaults};}
export function outcome(id,v){
 if(id==='incentives'){const availableSlots=Math.max(0,v.reviewTime-v.pressure),reached=v.protected===1?Math.min(4,availableSlots):0;return {availableSlots,reached,waiting:4-reached};}
 if(id==='sorter'){const correctHigh=Math.min(6,(v.representativeTraining?6:5)+(v.humanReview?1:0)),correctLow=v.goal==='recovery'?Math.min(4,(v.representativeTraining?3:1)+(v.humanReview?1:0)):0,recoveredItems=correctHigh+correctLow;return {correctHigh,correctLow,recoveredItems,rejectedItems:12-recoveredItems,illustrativeRevenue:8*correctHigh+2*correctLow-(v.humanReview?6:0)};}
 if(id==='claim-boundary'){const volume=1000*v.productionMultiplier,pilotImpactPerUnit=10*(1-v.perUnitReduction/100),averageImpactPerUnit=v.coveragePercent/100*pilotImpactPerUnit+(1-v.coveragePercent/100)*10,totalImpact=volume*averageImpactPerUnit;return {volume,pilotImpactPerUnit,averageImpactPerUnit,totalImpact,absoluteChangePercent:(totalImpact/10000-1)*100};}
 if(id==='governance')return {shownNet:v.horizon===5?40:-30,panelInput:v.voice>=1?1:0,canReopen:v.voice===2?1:0,separateValue:v.broad===1?1:0};
 throw Error('Onbekend leermodel.');
}
const varied=(trials,key,fixed)=>trials.some(a=>trials.some(b=>a.values[key]!==b.values[key]&&fixed.every(k=>a.values[k]===b.values[k])));
export function contrasted(b,trials){
 if(trials.length<(b.simulationSpec.minimumTrials||2))return false;
 if(b.simulation==='incentives')return trials.some(t=>t.values.protected===0&&t.values.pressure===2)&&trials.some(t=>t.values.protected===1&&t.values.reviewTime>t.values.pressure);
 if(b.simulation==='sorter')return varied(trials,'goal',['representativeTraining','humanReview'])&&varied(trials,'representativeTraining',['goal','humanReview']);
 if(b.simulation==='claim-boundary')return varied(trials,'productionMultiplier',['perUnitReduction','coveragePercent'])&&varied(trials,'coveragePercent',['productionMultiplier','perUnitReduction']);
 if(b.simulation==='governance')return trials.some(t=>t.values.voice===0&&t.values.horizon===1&&t.values.broad===0)&&trials.some(t=>t.values.voice===2&&t.values.horizon===5&&t.values.broad===1);
 return false;
}
export const conceptOptions=b=>b.simulationSpec.conceptOptions||b.simulationSpec.options;
export const outputRows=spec=>spec.outputRows||spec.outcomeRules.map(r=>({id:r.id,label:r.label}));
