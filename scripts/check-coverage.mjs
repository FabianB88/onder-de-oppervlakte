import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'sources', 'business-ethics-course.json');
const campaignPath = path.join(root, 'dist', 'campaign.json');
const coveragePath = path.join(root, 'sources', 'coverage.json');
const sourceBytes = fs.readFileSync(sourcePath);
const source = JSON.parse(sourceBytes.toString('utf8'));
const campaign = JSON.parse(fs.readFileSync(campaignPath, 'utf8'));
const errors = [];
const lessonLookup = new Map(source.lessons.map(lesson => [lesson.id, lesson]));
const assignments = new Map();
const ids = new Set();
const strip = value => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const requiredText = (obj, key, at) => {
  if (typeof obj[key] !== 'string' || !obj[key].trim()) errors.push(at + ': missing ' + key);
};

if (campaign.chapters.length !== source.lessons.length) errors.push('Chapter count does not equal source lesson count.');
for (const chapter of campaign.chapters) {
  const lesson = lessonLookup.get(chapter.lessonId);
  if (!lesson) { errors.push('Unknown lesson: ' + chapter.lessonId); continue; }
  if (ids.has(chapter.id)) errors.push('Duplicate chapter id: ' + chapter.id);
  ids.add(chapter.id);
  for (const key of ['id', 'title', 'location', 'image', 'intro', 'subtitle']) requiredText(chapter, key, chapter.id);
  if (chapter.investigations.filter(inv => inv.experiment === true).length !== 1) errors.push(chapter.id + ': exactly one required experiment is expected');
  for (const inv of chapter.investigations) {
    if (ids.has(inv.id)) errors.push('Duplicate investigation id: ' + inv.id);
    ids.add(inv.id);
    for (const key of ['id', 'title', 'mission', 'briefing', 'workedExample', 'reflection']) requiredText(inv, key, inv.id);
    if (!Array.isArray(inv.sourceBlocks) || !inv.sourceBlocks.length) {
      errors.push(inv.id + ': no source blocks');
      continue;
    }
    for (const index of inv.sourceBlocks) {
      if (!Number.isInteger(index) || index < 0 || index >= lesson.blocks.length) {
        errors.push(inv.id + ': invalid source index ' + index);
        continue;
      }
      if (lesson.blocks[index].t === 'continue') errors.push(inv.id + ': continue marker must be excluded (' + index + ')');
      const key = chapter.lessonId + ':' + index;
      const list = assignments.get(key) || [];
      list.push({ chapterId: chapter.id, investigationId: inv.id });
      assignments.set(key, list);
    }
    const activity = inv.activity;
    if (!activity || activity.type !== 'decision' || !Array.isArray(activity.options) || activity.options.length !== 4) {
      errors.push(inv.id + ': decision activity must contain four options');
    } else {
      if (!Number.isInteger(activity.best) || activity.best < 0 || activity.best >= activity.options.length) errors.push(inv.id + ': invalid best answer');
      requiredText(activity, 'prompt', inv.id + '.activity');
      requiredText(activity, 'explanation', inv.id + '.activity');
      for (const option of activity.options) {
        requiredText(option, 'text', inv.id + '.activity.option');
        requiredText(option, 'feedback', inv.id + '.activity.option');
      }
    }
    const transfer = inv.transfer;
    if (!transfer || !Array.isArray(transfer.options) || transfer.options.length !== 4 ||
        !Number.isInteger(transfer.correct) || transfer.correct < 0 || transfer.correct > 3) errors.push(inv.id + ': invalid transfer');
    else {
      requiredText(transfer, 'prompt', inv.id + '.transfer');
      requiredText(transfer, 'feedback', inv.id + '.transfer');
      for (const option of transfer.options) if (typeof option !== 'string' || !option.trim()) errors.push(inv.id + ': empty transfer option');
    }
    if (!Array.isArray(inv.dialogue) || inv.dialogue.length < 2) errors.push(inv.id + ': missing perspectives');
    for (const line of inv.dialogue || []) {
      requiredText(line, 'speaker', inv.id + '.dialogue');
      requiredText(line, 'text', inv.id + '.dialogue');
    }
    for (const key of ['id', 'title', 'description']) requiredText(inv.artifact || {}, key, inv.id + '.artifact');
  }
}

const lessons = source.lessons.map(lesson => {
  const chapter = campaign.chapters.find(item => item.lessonId === lesson.id);
  const excludedContinueBlocks = [];
  const blocks = [];
  lesson.blocks.forEach((block, index) => {
    if (block.t === 'continue') { excludedContinueBlocks.push(index); return; }
    const matches = assignments.get(lesson.id + ':' + index) || [];
    if (!matches.length) errors.push('Unassigned source block: ' + lesson.id + ':' + index);
    if (matches.length > 1) errors.push('Duplicate source assignment: ' + lesson.id + ':' + index);
    const label = block.heading || block.title || block.question || (block.items || []).map(item => item.title || '').join(' | ');
    blocks.push({
      index,
      type: block.t,
      label: strip(label),
      chapterId: matches[0]?.chapterId || null,
      investigationId: matches[0]?.investigationId || null,
      assignmentCount: matches.length
    });
  });
  return {
    lessonId: lesson.id,
    title: lesson.title,
    chapterId: chapter?.id || null,
    sourceBlockCount: lesson.blocks.length,
    substantiveBlockCount: blocks.length,
    excludedContinueBlocks,
    investigations: (chapter?.investigations || []).map(inv => ({ id: inv.id, title: inv.title, sourceBlocks: inv.sourceBlocks, experiment: inv.experiment === true })),
    blocks
  };
});
const substantive = lessons.reduce((sum, lesson) => sum + lesson.substantiveBlockCount, 0);
const types = {};
for (const lesson of lessons) for (const block of lesson.blocks) types[block.type] = (types[block.type] || 0) + 1;
const manifest = {
  schemaVersion: 1,
  source: {
    file: 'sources/business-ethics-course.json',
    id: source.id,
    title: source.title,
    sha256: crypto.createHash('sha256').update(sourceBytes).digest('hex'),
    note: 'All original non-continue blocks are assigned. Complete theory and original media/exercises are read by the app from these source indices; the new scenario does not replace their text.'
  },
  campaign: { file: 'dist/campaign.json', id: campaign.id, title: campaign.title },
  integrity: {
    valid: errors.length === 0,
    lessonCount: lessons.length,
    chapterCount: campaign.chapters.length,
    investigationCount: campaign.chapters.reduce((sum, chapter) => sum + chapter.investigations.length, 0),
    experimentCount: campaign.chapters.reduce((sum, chapter) => sum + chapter.investigations.filter(inv => inv.experiment === true).length, 0),
    substantiveSourceBlockCount: substantive,
    assignedExactlyOnce: lessons.reduce((sum, lesson) => sum + lesson.blocks.filter(block => block.assignmentCount === 1).length, 0),
    excludedContinueBlockCount: lessons.reduce((sum, lesson) => sum + lesson.excludedContinueBlocks.length, 0),
    coveragePercent: substantive ? Math.round(lessons.reduce((sum, lesson) => sum + lesson.blocks.filter(block => block.assignmentCount === 1).length, 0) / substantive * 10000) / 100 : 100,
    sourceBlockTypes: types,
    errors
  },
  lessons
};
if (errors.length) {
  console.error(JSON.stringify({ status: 'FAIL', errors }, null, 2));
  process.exitCode = 1;
} else if (process.argv.includes('--write')) {
  fs.writeFileSync(coveragePath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(JSON.stringify({ status: 'PASS', written: 'sources/coverage.json', ...manifest.integrity }, null, 2));
} else {
  if (!fs.existsSync(coveragePath)) {
    console.error('Coverage manifest missing. Run node scripts/check-coverage.mjs --write after authoring the campaign.');
    process.exitCode = 1;
  } else {
    const existing = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
    if (JSON.stringify(existing) !== JSON.stringify(manifest)) {
      console.error('Coverage manifest is stale. Regenerate with --write and review the source mapping.');
      process.exitCode = 1;
    } else console.log(JSON.stringify({ status: 'PASS', ...manifest.integrity }, null, 2));
  }
}

