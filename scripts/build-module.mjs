import fs from 'node:fs';
import {loadModule} from './load-module.mjs';
const {book,npcs}=loadModule();
fs.writeFileSync('dist/module.json',JSON.stringify(book));
fs.writeFileSync('dist/dialogues.json',JSON.stringify({rooms:[...npcs.values()]}));
console.log('Module and conversations bundled for parallel loading.');
