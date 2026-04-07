#!/usr/bin/env node
const fs = require('fs');

function showHelp() {
  console.log(`Usage: node shift-left-divs.js [input.html] [--out output.html]

Default: processes TM_Rules_Final_Low-Res.html in-place and creates a backup file with .bak suffix.
Behavior:
  - Only <div> tags are processed.
  - If a div's inline style contains left: N em and N > 20, 20 is added to N.
  - Other styles and tags are left unchanged.
Options:
  --out <file>   Write modified HTML to <file> instead of overwriting input.
  --help         Show this help message.
`);
}

const args = process.argv.slice(2);
if (args.includes('--help')) {
  showHelp();
  process.exit(0);
}

const input = args[0] && !args[0].startsWith('--') ? args[0] : 'TM_Rules_Final_Low-Res.html';
const outIndex = args.indexOf('--out');
const output = outIndex !== -1 ? args[outIndex + 1] : null;

if (!fs.existsSync(input)) {
  console.error(`Input file not found: ${input}`);
  process.exit(2);
}

const raw = fs.readFileSync(input, 'utf8');

function shiftLeftInStyle(styleText) {
  let changed = false;

  const updated = styleText.replace(/\bleft\s*:\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))em\b/gi, (match, value) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue <= 20) {
      return match;
    }

    changed = true;
    return `left: ${numericValue + 20}em`;
  });

  return changed ? updated : styleText;
}

const modified = raw.replace(/<div\b[^>]*>/gi, (tag) => {
  const styleMatch = tag.match(/\bstyle\s*=\s*(["'])([\s\S]*?)\1/i);
  if (!styleMatch) {
    return tag;
  }

  const quote = styleMatch[1];
  const styleText = styleMatch[2];
  const updatedStyle = shiftLeftInStyle(styleText);
  if (updatedStyle === styleText) {
    return tag;
  }

  return tag.replace(styleMatch[0], `style=${quote}${updatedStyle}${quote}`);
});

if (output) {
  fs.writeFileSync(output, modified, 'utf8');
  console.log(`Wrote modified file to ${output}`);
} else {
  const backup = `${input}.bak`;
  try {
    fs.copyFileSync(input, backup);
  } catch (error) {
    console.error(`Failed to create backup: ${error.message}`);
    process.exit(3);
  }

  fs.writeFileSync(input, modified, 'utf8');
  console.log(`Shifted left values in ${input} (backup saved as ${backup})`);
}
