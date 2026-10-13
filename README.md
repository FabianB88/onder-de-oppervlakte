# Onder de oppervlakte

Dutch browser adventure for all five Business Ethics lessons. The authored module contains 32 areas, 166 world activities, 13 required original source projections, area reconstructions, five transfer finales and 42 application questions. This is a substantial playable implementation; its educational superiority has not been empirically established.

## Play

Live on GitHub Pages: https://fabianb88.github.io/onder-de-oppervlakte/

Hosting is GitHub Pages only. The repository's `main` branch is published from `/`; `index.html` opens the static app in `dist/`. `.nojekyll` preserves the authored assets. No ChatGPT login or OpenAI hosting is used by this deployment.

Start the static server with `npm start`. Fly the inspection drone with the arrow keys, WASD, or by clicking a destination. Click an object to approach it. Collect physical tools, select a tool in the inventory, and use it on an object. NPC conversations provide clickable questions and targeted follow-ups. The notebook preserves clues, predictions, experiments and personal notes.

All clues must be investigated before each reconstruction unlocks. Reconstructions require causal interpretation and evidence. The lesson finale applies the learned lenses to a new sector.

## Teaching and scope

Lesson 1 contains eight areas; the other lessons each contain six. The first route includes 33 optional environmental investigations, evidence checks, dead ends and a services-key return route. Later routes include optional work records and dead ends. Physical tools also unlock later accounting, model configuration and claim inspection tasks.

Every entry shows the start/resume screen without resetting progress. Each of the 32 areas has an authored situation, transition, ethical question, task and specific reflection prompt. The first two areas include preparatory evidence objects before concept application. Each activity has expandable context, explanation and the relevant original course reading; a quick theory overview remains available before play. There are two NPCs per area: 64 NPC instances using a six-character cast, with questions, follow-ups and three substantial optional theory sections each. The notebook stores evidence, predictions and personal notes.

Use **Beheer**, code **fabian1**, to jump directly to any area, preview activities, read conversations, inspect area/lesson puzzles and view the questions. Preview changes never overwrite the ordinary learner save. This is a local content-review facility, not an authentication system for sensitive accounts.

`dist/plan.html` is the readable complete production plan. `dist/research.html` presents the design evidence and evaluation plan. The original source remains intact in Naslag. Thirteen clips are mandatory world sources where the exact spoken content has not been fully replaced or verified; opening a clip plus a synthesis is engagement evidence, not proof of complete viewing or mastery.

Six experiments require a prediction, contrasting trials, an interpretation and a concept check. Their numerical consequences are explicitly fictional and limited by stated assumptions. Early hints and NPC examples provide beginner support. Ethical disagreement is allowed: causal explanations and evidential support are assessed, rather than moral conformity.

The complete original course is pinned to GitHub commit `de712d3616e669404cded8711e2ed1dc317deec9`, `FabianB88/minor-ce-elearnings`, `modules/business-ethics/course.json`. Source provenance and conceptual coverage are stored in `sources/`.

## Research and evaluation

`sources/learning-evidence.json` contains a targeted critical review of 25 original sources, 14 design requirements, study limitations and a proposed evaluation. It includes guided investigation, worked examples, cognitive engagement, intrinsic integration, feedback, retention/transfer, motivation and blended learning. It is not an exhaustive systematic review and does not establish that this implementation is superior.

Before educational rollout, independent subject review must confirm equivalence of the teaching propositions and accessibility of required media. These basic quality requirements do not wait for six months of usage feedback. Later matched-content comparison, independent delayed and transfer assessments and reasoning rubrics can test actual effectiveness. For blended classroom use, learners compare evidence maps and revise their intervention after peer critique and teacher debriefing. The standalone route includes the teaching content.

## Validation

Run `npm run build` after editing chapter or NPC authoring data to refresh the complete runtime module, conversations and readable plan. Commit and push changes to `main` to update GitHub Pages.

`npm test` validates all five lessons, source references, activity shapes, dialogue depth, causal evidence, model results, progression gates, replay rewards and navigation. `scripts/qa-module.mjs` exercises all authored activity answers, dialogue branches, area/lesson finales and knowledge checks using synthetic DOM activation in a separate test profile. `scripts/qa-learning-flow.mjs` checks the new/returning entry, older saves, concrete theory-before-decision path, continuous keyboard flight, all 179 contextual theory views, mobile layout and preserved notes. `qa-controls.mjs` checks pointer movement/cancellation, inspection and save isolation. `qa-features.mjs` checks all briefings, theory panels, hotspot hit targets and mobile layout. Screenshots and reports are in ignored `qa/`. Structural coverage is distinct from the separate semantic proposition and media audits in `sources/`.

## Artwork

Game environments, the inspection drone, the early investigator study, six NPCs and the collectible-tool atlas are original assets created with the built-in image generation tool. Full prompts, provenance and visual QA are in `sources/art-prompts.md`. WebP environments are used at runtime; original PNGs are retained. The inspection drone uses a deliberate flight animation.
