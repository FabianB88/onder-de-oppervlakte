import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceBytes = fs.readFileSync(path.join(root, 'sources/business-ethics-course.json'));
const playbookBytes = fs.readFileSync(path.join(root, 'dist/playbook.json'));
const source = JSON.parse(sourceBytes.toString('utf8'));
const playbook = JSON.parse(playbookBytes.toString('utf8'));
const campaign = JSON.parse(fs.readFileSync(path.join(root, 'dist/campaign.json'), 'utf8'));
const expectedClaims = [{"block":0,"claims":["schaarste","morele economie","waarden in prioriteiten"]},{"block":2,"claims":["rechtvaardige verdeling","Friedmans verantwoordelijkheid","spelregels zijn institutionele keuzes","collectieve actie en prikkels"]},{"block":7,"claims":["externaliteiten","commons","begrenzing","rechtvaardige verdeling","commons-governance","prijs versus maatschappelijke kosten"]},{"block":12,"claims":["grondstoffenketen","Congo kobalt","China zeldzame aardmetalen","e-waste Ghana en India","geopolitieke macht","baten lasten machtsverhoudingen","technologie en infrastructuur als macht"]},{"block":15,"claims":["systeemdoel","menselijk oordeel versus organisatieontwerp","KPI-prikkels","morele paradox organisaties","Goodpaster","systeeminterventie","waarden in prestatiemeting"]},{"block":19,"claims":["eigendom zeggenschap opbrengst","cumulatieve vermogensgroei","Piketty","rendement r","economische groei g","r groter dan g","Smith: eigendom als autonomie","vastgoedfondsen","institutionele investeerders","databezit","schaalvoordelen","eigendom versus bijdrage"]},{"block":24,"claims":["neoliberalisme","deregulering","privatisering","financialisering","marktconcentratie","toezicht","publieke voorzieningen","aannames markt versus staat","marktmacht prijzen","toegang tot werk","innovatie","politieke invloed","data-autonomie"]},{"block":28,"claims":["aanbod vormt vraag","algoritmische zichtbaarheid","geconstrueerde keuzeruimte","financiële dominantie","kortetermijnrendement","werknemerskosten","onderhoud en duurzaamheid","kwetsbaarheid bij crises","aandeelhouders versus stakeholders","publieke waarden"]},{"block":31,"claims":["kuddegedrag","verliesaversie","morele ontkoppeling","kuddegedrag bij onzekerheid","angst voor uitsluiting","meerderheid als informatie","zichzelf versterkende navolging","tunnelvisie en instabiliteit","risicomijding","overreactie onder verliesdruk"]}];
const errors = [];
const wordCount = value => String(value || '').trim().split(/\s+/).filter(Boolean).length;
const checkText = (value, max, at) => {
  if (typeof value !== 'string' || !value.trim()) errors.push(at + ': missing text');
  else if (wordCount(value) > max) errors.push(at + ': ' + wordCount(value) + ' words exceeds ' + max);
};
const allowedTypes = new Set(['inspect', 'sort', 'connect', 'order', 'decision', 'build', 'experiment']);
const allowedSimulations = new Set(['electricity', 'externalities', 'incentives', 'governance', 'algorithm', 'claims']);
const allIds = new Set();
const released = playbook.release?.playableLessons || playbook.chapters.map(c => c.lessonId);
if (!released.length) errors.push('No playable lesson declared.');

function checkFinale(finale, at, evidenceIds, min, max) {
  if (!finale) { errors.push(at + ': finale missing'); return; }
  checkText(finale.intro, 45, at + '.intro');
  checkText(finale.conclusion, 50, at + '.conclusion');
  if (!Array.isArray(finale.slots) || finale.slots.length < min || finale.slots.length > max) errors.push(at + ': wrong slot count');
  const slotIds = new Set();
  for (const slot of finale.slots || []) {
    if (slotIds.has(slot.id)) errors.push(at + ': duplicate slot ' + slot.id);
    slotIds.add(slot.id);
    checkText(slot.label, 45, at + '.' + slot.id + '.label');
    if (!evidenceIds.has(slot.evidenceBeatId)) errors.push(at + ': invalid evidence link ' + slot.evidenceBeatId);
    if (!Array.isArray(slot.options) || slot.options.length < 3 || slot.options.length > 4) errors.push(at + ': expected 3-4 plausible interpretations');
    if ((slot.options || []).filter(o => o.correct === true).length !== 1) errors.push(at + ': exactly one factual/causal interpretation is required');
    for (const option of slot.options || []) {
      checkText(option.text, 45, at + '.option');
      checkText(option.feedback, 45, at + '.feedback');
    }
  }
  for (const fact of finale.caseFacts || []) checkText(fact.text, 45, at + '.caseFacts');
}

const lessonManifests = [];
for (const lessonId of released) {
  const chapter = playbook.chapters.find(c => c.lessonId === lessonId);
  const lesson = source.lessons.find(l => l.id === lessonId);
  const originalChapter = campaign.chapters.find(c => c.lessonId === lessonId);
  if (!chapter || !lesson || !originalChapter) { errors.push('Missing released lesson: ' + lessonId); continue; }
  const expectedIds = originalChapter.investigations.map(i => i.id);
  const actualIds = chapter.investigations.map(i => i.id);
  if (JSON.stringify(expectedIds) !== JSON.stringify(actualIds)) errors.push(lessonId + ': investigation sequence does not match campaign');
  const chapterEvidence = new Set();
  const originalAssignments = new Map();
  const beatList = [];
  for (const inv of chapter.investigations) {
    const originalInv = originalChapter.investigations.find(i => i.id === inv.id);
    if (!originalInv) { errors.push('Unknown investigation: ' + inv.id); continue; }
    if (!Array.isArray(inv.beats) || inv.beats.length < 3 || inv.beats.length > 7) errors.push(inv.id + ': expected 3-7 experiential beats');
    if (JSON.stringify(inv.originalSourceBlocks) !== JSON.stringify(originalInv.sourceBlocks)) errors.push(inv.id + ': original source references missing or changed');
    for (const index of inv.originalSourceBlocks || []) {
      const entries = originalAssignments.get(index) || [];
      entries.push(inv.id);
      originalAssignments.set(index, entries);
    }
    const evidenceIds = new Set();
    for (const beat of inv.beats || []) {
      if (allIds.has(beat.id)) errors.push('Duplicate beat id: ' + beat.id);
      allIds.add(beat.id); evidenceIds.add(beat.id); chapterEvidence.add(beat.id); beatList.push(beat);
      if (!allowedTypes.has(beat.type)) errors.push(beat.id + ': unsupported beat type');
      if (!['product', 'person', 'system', 'evidence'].includes(beat.sceneObject)) errors.push(beat.id + ': invalid scene object');
      checkText(beat.intro, 35, beat.id + '.intro');
      checkText(beat.hint, 45, beat.id + '.hint');
      checkText(beat.explainAfter, 45, beat.id + '.explainAfter');
      if (!Array.isArray(beat.concepts) || !beat.concepts.length) errors.push(beat.id + ': no taught concepts');
      if (!Array.isArray(beat.sourceBlocks) || !beat.sourceBlocks.length) errors.push(beat.id + ': no source mapping');
      for (const index of beat.sourceBlocks || []) if (!Number.isInteger(index) || !lesson.blocks[index] || lesson.blocks[index].t === 'continue' || !originalInv.sourceBlocks.includes(index)) errors.push(beat.id + ': invalid source mapping ' + index);
      if (beat.type === 'inspect') {
        if (!Array.isArray(beat.reveal) || beat.reveal.length < 2 || beat.reveal.length > 4) errors.push(beat.id + ': inspect needs 2-4 objects');
        for (const item of beat.reveal || []) checkText(item.text, 45, beat.id + '.reveal.' + item.id);
        if (!Array.isArray(beat.required) || !beat.required.length || beat.required.some(id => !beat.reveal.some(r => r.id === id))) errors.push(beat.id + ': invalid required objects');
      }
      if (beat.type === 'sort') {
        if (beat.categories?.length < 2 || beat.categories?.length > 3 || beat.cards?.length < 4 || beat.cards?.length > 6) errors.push(beat.id + ': sort shape');
        for (const card of beat.cards || []) {
          if (!beat.categories.some(c => c.id === card.category)) errors.push(beat.id + ': unknown card category');
          checkText(card.feedback, 45, beat.id + '.cardFeedback');
        }
      }
      if (beat.type === 'connect') {
        if (beat.pairs?.length < 3 || beat.pairs?.length > 5) errors.push(beat.id + ': expected 3-5 relationships');
        for (const pair of beat.pairs || []) checkText(pair.feedback, 45, beat.id + '.pairFeedback');
      }
      if (beat.type === 'order') {
        if (beat.order?.length < 3 || beat.order?.length > 5) errors.push(beat.id + ': expected 3-5 sequence cards');
        if (JSON.stringify(beat.correctOrder) !== JSON.stringify(beat.order.map(o => o.id))) errors.push(beat.id + ': missing or inconsistent correct sequence');
      }
      if (beat.type === 'decision' || beat.type === 'build') {
        if (!Array.isArray(beat.options)) errors.push(beat.id + ': no options');
        for (const option of beat.options || []) { checkText(option.text, 45, beat.id + '.option'); checkText(option.feedback, 45, beat.id + '.feedback'); }
        if (beat.type === 'decision' && (beat.options || []).filter(o => o.correct === true).length !== 1) errors.push(beat.id + ': decision answer count');
        if (beat.type === 'build') {
          const right = beat.options.filter(o => o.correct === true).map(o => o.id).sort();
          if (beat.options.length !== 6 || right.length < 2 || right.length > 4 || JSON.stringify(right) !== JSON.stringify([...(beat.required || [])].sort())) errors.push(beat.id + ': build answer schema');
        }
      }
      if (beat.type === 'experiment' && (!allowedSimulations.has(beat.simulation) || beat.minimumTrials < 2)) errors.push(beat.id + ': simulation must require contrasting trials');
    }
    checkFinale(inv.finale, inv.id + '.finale', evidenceIds, 2, 3);
  }
  checkFinale(chapter.chapterFinale, lessonId + '.chapterFinale', chapterEvidence, 3, 4);
  const blocks = lesson.blocks.flatMap((block, index) => {
    if (block.t === 'continue') return [];
    const assigned = originalAssignments.get(index) || [];
    if (assigned.length !== 1) errors.push(lessonId + ':' + index + ': source reference must appear once');
    const mapped = beatList.filter(b => b.sourceBlocks.includes(index));
    const claimSpec = lessonId === 'm1' ? expectedClaims.find(c => c.block === index) : null;
    const claims = (claimSpec?.claims || []).map(claim => {
      const evidence = mapped.filter(b => b.concepts.includes(claim));
      if (!evidence.length) errors.push(lessonId + ':' + index + ': missing teaching for ' + claim);
      return { concept: claim, beats: evidence.map(b => b.id) };
    });
    const hasContent = block.t === 'tabs' || block.t === 'list' || (block.t === 'text' && String(block.body || '').replace(/<[^>]*>/g, '').trim());
    if (hasContent && !claims.length) errors.push(lessonId + ':' + index + ': substantive text has no curated conceptual audit');
    return [{
      index, type: block.t, investigationId: assigned[0] || null,
      mode: claims.length ? 'experiential teaching' : hasContent ? 'unmapped content' : block.t === 'text' ? 'structural heading' : 'optional original review/media',
      experientialBeatIds: mapped.map(b => b.id), claims
    }];
  });
  lessonManifests.push({
    lessonId, title: lesson.title, investigationCount: chapter.investigations.length,
    beatCount: beatList.length,
    finaleSlotCount: chapter.investigations.reduce((n, i) => n + (i.finale?.slots?.length || 0), 0),
    changedSectorFinaleSlotCount: chapter.chapterFinale?.slots?.length || 0,
    originalSubstantiveBlockReferences: blocks.length,
    curatedKeyConceptCount: blocks.reduce((n, b) => n + b.claims.length, 0),
    sourceBlocks: blocks
  });
}
const types = {};
for (const c of playbook.chapters) if (released.includes(c.lessonId)) for (const i of c.investigations) for (const b of i.beats) types[b.type] = (types[b.type] || 0) + 1;
const manifest = {
  schemaVersion: 1,
  coverageKind: 'Authored conceptual mapping, not a claim that every source word is reproduced or that learning equivalence has been empirically demonstrated.',
  source: { file: 'sources/business-ethics-course.json', sha256: crypto.createHash('sha256').update(sourceBytes).digest('hex') },
  playbook: { file: 'dist/playbook.json', sha256: crypto.createHash('sha256').update(playbookBytes).digest('hex') },
  scope: { playableLessons: released, underDevelopment: playbook.release?.underDevelopment || [], originalMediaAndExercises: 'Preserved as optional library review; completion is not required for adventure progress.' },
  validation: { valid: !errors.length, lessonCount: lessonManifests.length, investigationCount: lessonManifests.reduce((n,l)=>n+l.investigationCount,0), beatCount: lessonManifests.reduce((n,l)=>n+l.beatCount,0), keyConceptCount: lessonManifests.reduce((n,l)=>n+l.curatedKeyConceptCount,0), beatTypes: types, errors },
  lessons: lessonManifests
};
const coveragePath = path.join(root, 'sources/experiential-coverage.json');
if (errors.length) { console.error(JSON.stringify({ status: 'FAIL', errors }, null, 2)); process.exitCode = 1; }
else if (process.argv.includes('--write')) {
  fs.writeFileSync(coveragePath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(JSON.stringify({ status: 'PASS', written: 'sources/experiential-coverage.json', ...manifest.validation }, null, 2));
} else if (!fs.existsSync(coveragePath) || JSON.stringify(JSON.parse(fs.readFileSync(coveragePath,'utf8'))) !== JSON.stringify(manifest)) {
  console.error('Experiential coverage is missing or stale. Run node scripts/check-playbook.mjs --write and review the mapping.');
  process.exitCode = 1;
} else console.log(JSON.stringify({ status: 'PASS', ...manifest.validation }, null, 2));

