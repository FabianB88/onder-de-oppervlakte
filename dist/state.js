export const SAVE_KEY = 'onder-de-oppervlakte-v1';
export const newState = () => ({version:1,started:false,chapter:0,done:[],read:[],answers:{},notes:{},experiments:{},simValues:{},artifacts:[],orientation:false,muted:true,finish:false});
export const unique = a => [...new Set(a)];
export function normaliseState(s, campaign) {
  const fresh=newState(), ids=new Set(campaign.chapters.flatMap(c=>c.investigations.map(i=>i.id)));
  if (!s || s.version!==1) return fresh;
  return {...fresh,...s,chapter:Math.max(0,Math.min(campaign.chapters.length-1,Number(s.chapter)||0)),done:unique((Array.isArray(s.done)?s.done:[]).filter(x=>ids.has(x))),read:unique(Array.isArray(s.read)?s.read:[]),answers:s.answers&&typeof s.answers==='object'?s.answers:{},notes:s.notes&&typeof s.notes==='object'?s.notes:{},artifacts:unique(Array.isArray(s.artifacts)?s.artifacts:[])};
}
export const chapterDone=(state,ch)=>ch.investigations.every(i=>state.done.includes(i.id));
export function unlocked(state,campaign,index){return index===0 || campaign.chapters.slice(0,index).every(ch=>chapterDone(state,ch));}
export function earnedXP(state){return state.done.length*100+(state.orientation?50:0);}
export function rank(state){const xp=earnedXP(state); return {level:Math.floor(xp/400)+1,progress:xp%400,title:xp<600?'Verkenner':xp<1400?'Onderzoeker':xp<2200?'Systeemanalist':'Veranderaar'};}
export function completeInvestigation(state, inv, lessonId){
  const required=inv.sourceBlocks.map(b=>`${lessonId}:${b}`);
  if(!required.every(k=>state.read.includes(k)))throw new Error('Eerst de volledige leerroute doorlopen.');
  if(state.answers[`${inv.id}:activity`]!==inv.activity.best || state.answers[`${inv.id}:transfer`]!==inv.transfer.correct)throw new Error('Rond de toepassing en de nieuwe casus af.');
  if(inv.experiment&&(!state.experiments[lessonId]||!String(state.notes[`sim-${lessonId}`]||'').trim()))throw new Error('Verken de werktafel en beschrijf je observatie.');
  state.done=unique([...state.done,inv.id]);
  state.artifacts=unique([...state.artifacts,inv.artifact.id]);
  return state;
}
