import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  compileTemplates,
  getCompilers,
  getAllTemplates,
  startProfile,
  endProfile,
} from './utils.js';

let compiler = getCompilers().find(
  ({ label }) => label === 'glimmer-compiler-experiment'
);

function timestamp() {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth();
  const monthString = month < 10 ? `0${month}` : month;
  const year = now.getFullYear();
  const hours = now.getHours();
  const hoursString = hours < 10 ? `0${hours}` : hours;
  const minutes = now.getMinutes();

  return `${year}-${monthString}-${day}-${hoursString}${minutes}`;
}

(async function run() {
  mkdirSync('cpu-profiles', { recursive: true });

  let templates = await getAllTemplates();

  await startProfile();
  compileTemplates(compiler, templates);
  let profile = await endProfile();

  writeFileSync(
    path.join(
      __dirname,
      '..',
      `cpu-profiles/${timestamp()}-glimmer-compiler-experiment.cpuprofile`
    ),
    JSON.stringify(profile),
    { encoding: 'utf-8' }
  );
})();
