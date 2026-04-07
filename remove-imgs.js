#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function showHelp() {
  console.log(`Usage: node remove-imgs.js [input.html] [--out output.html]

Default: processes TM_Rules_Final_Low-Res.html in-place and creates a backup file with .bak suffix.
Options:
  --out <file>   Write cleaned HTML to <file> instead of overwriting input.
  --help         Show this help message.
`);
}

const args = process.argv.slice(2);
if (args.includes('--help')) {
  showHelp();
  process.exit(0);
}

let input = args[0] && !args[0].startsWith('--') ? args[0] : 'TM_Rules_Final_Low-Res.html';
let outIndex = args.indexOf('--out');
let output = outIndex !== -1 ? args[outIndex + 1] : null;

if (!fs.existsSync(input)) {
  console.error(`Input file not found: ${input}`);
  process.exit(2);
}

const raw = fs.readFileSync(input, 'utf8');

// Remove all <img ...> tags (case-insensitive). img is a void element, so we remove the entire tag.
const cleaned = raw.replace(/<img\b[^>]*>/gi, '');

if (output) {
  fs.writeFileSync(output, cleaned, 'utf8');
  console.log(`Wrote cleaned file to ${output}`);
} else {
  // default: overwrite input but keep a backup
  const backup = input + '.bak';
  try {
    fs.copyFileSync(input, backup);
  } catch (e) {
    console.error('Failed to create backup:', e.message);
    process.exit(3);
  }
  fs.writeFileSync(input, cleaned, 'utf8');
  console.log(`Removed <img> tags in ${input} (backup saved as ${backup})`);
}
