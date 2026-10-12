# Onder de oppervlakte

First playable Business Ethics adventure, in Dutch. This release implements lesson 1, Economics & Systems. Lessons 2–5 retain their source material in the optional reference library and have draft campaign material, but their adventures are not implemented.

## Play

Start the static server with `npm start`. Fly the inspection drone with the arrow keys, WASD, or by clicking a destination. Click an object to approach it. Collect physical tools, select a tool in the inventory, and use it on an object. NPC conversations provide clickable questions and targeted follow-ups. The notebook preserves clues, predictions, experiments and personal notes.

All clues must be investigated before each reconstruction unlocks. Reconstructions require causal interpretation and evidence. The lesson finale applies the learned lenses to a new sector.

## Teaching and scope

The first lesson contains 30 optional environmental investigations (including evidence checks, dead ends and a services-key return route), 24 experiential beats, six investigation reconstructions and a changed-sector lesson finale. An authored map traces 72 essential concepts to the original Economics & Systems lesson. This is a curriculum audit, not empirical evidence of learning equivalence. Source media and original quizzes remain available as optional review.

The two experiments require a prediction, contrasting trials, an interpretation and a concept check. Early hints and NPC examples provide beginner support. Ethical disagreement is allowed: causal explanations and evidential support are assessed, rather than moral conformity.

The complete original course is pinned to GitHub commit `de712d3616e669404cded8711e2ed1dc317deec9`, `FabianB88/minor-ce-elearnings`, `modules/business-ethics/course.json`. Source provenance and conceptual coverage are stored in `sources/`.

## Research and evaluation

`sources/learning-evidence.json` contains a targeted critical review of 25 original sources, 14 design requirements, study limitations and a proposed evaluation. It includes guided investigation, worked examples, cognitive engagement, intrinsic integration, feedback, retention/transfer, motivation and blended learning. It is not an exhaustive systematic review and does not establish that this implementation is superior.

Next evaluation stages: subject expert review of the concept map; novice usability sessions; student co-design of challenge, support and reward preferences; matched-content comparison with the original e-learning; independent delayed and transfer assessments with a reasoning rubric. For blended classroom use, learners compare evidence maps and revise their intervention after peer critique and teacher debriefing. The standalone route remains self-contained.

## Validation

`node scripts/check-playbook.mjs` verifies short-panel limits, required concepts, source references, causal evidence and the content schema. `node scripts/test-adventure.mjs` verifies progression/evidence gates, replay rewards and navigation. `scripts/qa-first.mjs` and `scripts/qa-adventure.mjs` exercise the browser route with the bundled local Playwright runtime.

## Artwork

All game environments, the inspection drone, the early investigator study and six NPCs and collectible-tool atlas are original assets created with the built-in image generation tool. Full prompts, provenance and visual QA are in `sources/art-prompts.md`. WebP assets are used for environments; original PNGs are retained separately. Artwork has been inspected. Further animation and authored object interactions remain part of production refinement.
