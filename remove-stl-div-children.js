#!/usr/bin/env node
const fs = require('fs');

function showHelp() {
	console.log(`Usage: node remove-stl-div-children.js [input.html] [--out output.html] [--log log.html]

Default: processes TM_Rules_Final_Low-Res.html in-place and creates a backup file with .bak suffix.
Behavior:
	- Only divs whose class attribute is exactly "stl_05 stl_06" are targeted.
	- For each target div, only the direct child divs are considered.
	- The first, second, and third direct child div are removed if present.
	- Removed divs are written into a log HTML document.
Options:
	--out <file>   Write modified HTML to <file> instead of overwriting input.
	--log <file>   Write removed divs to <file> instead of the default log file.
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
const logIndex = args.indexOf('--log');
const output = outIndex !== -1 ? args[outIndex + 1] : null;
const logFile = logIndex !== -1 ? args[logIndex + 1] : 'remove-stl-div-children.log.html';

if (!fs.existsSync(input)) {
	console.error(`Input file not found: ${input}`);
	process.exit(2);
}

const html = fs.readFileSync(input, 'utf8');

const VOID_TAGS = new Set([
	'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
	'param', 'source', 'track', 'wbr'
]);

function escapeHtml(text) {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function parseTagAt(source, index) {
	if (source.startsWith('<!--', index)) {
		const end = source.indexOf('-->', index + 4);
		return { type: 'comment', endIndex: end === -1 ? source.length : end + 3 };
	}

	if (source.startsWith('<!', index)) {
		const end = source.indexOf('>', index + 2);
		return { type: 'declaration', endIndex: end === -1 ? source.length : end + 1 };
	}

	if (source[index] !== '<') {
		return null;
	}

	const close = source.indexOf('>', index + 1);
	if (close === -1) {
		return { type: 'broken', endIndex: source.length };
	}

	const raw = source.slice(index, close + 1);
	const closeMatch = raw.match(/^<\s*\/\s*([a-zA-Z][\w:-]*)\s*>$/);
	if (closeMatch) {
		return { type: 'close', tagName: closeMatch[1].toLowerCase(), endIndex: close + 1, raw };
	}

	const openMatch = raw.match(/^<\s*([a-zA-Z][\w:-]*)([\s\S]*?)>$/);
	if (!openMatch) {
		return { type: 'other', endIndex: close + 1, raw };
	}

	const tagName = openMatch[1].toLowerCase();
	const inner = openMatch[2] || '';
	const selfClosing = /\/$/.test(inner.trim()) || VOID_TAGS.has(tagName);
	return { type: 'open', tagName, attrs: inner, selfClosing, endIndex: close + 1, raw };
}

function parseHtml(source) {
	const root = { type: 'element', tagName: '#root', children: [], parent: null, start: 0, end: source.length };
	const stack = [root];
	const allElements = [];

	let i = 0;
	while (i < source.length) {
		const lt = source.indexOf('<', i);
		if (lt === -1) break;

		const parsed = parseTagAt(source, lt);
		if (!parsed) {
			i = lt + 1;
			continue;
		}

		if (parsed.type === 'comment' || parsed.type === 'declaration' || parsed.type === 'broken' || parsed.type === 'other') {
			i = parsed.endIndex;
			continue;
		}

		if (parsed.type === 'open') {
			const parent = stack[stack.length - 1];
			const node = {
				type: 'element',
				tagName: parsed.tagName,
				attrs: parsed.attrs,
				start: lt,
				startTagEnd: parsed.endIndex,
				end: null,
				children: [],
				parent,
			};
			parent.children.push(node);
			allElements.push(node);

			if (!parsed.selfClosing) {
				stack.push(node);
			} else {
				node.end = parsed.endIndex;
			}

			i = parsed.endIndex;
			continue;
		}

		if (parsed.type === 'close') {
			let foundIndex = -1;
			for (let s = stack.length - 1; s >= 1; s--) {
				if (stack[s].tagName === parsed.tagName) {
					foundIndex = s;
					break;
				}
			}

			if (foundIndex !== -1) {
				const node = stack[foundIndex];
				node.end = parsed.endIndex;
				stack.splice(foundIndex, 1);
			}

			i = parsed.endIndex;
		}
	}

	return { root, allElements };
}

function hasExactClass(node, expectedClassString) {
	const classMatch = node.attrs.match(/\bclass\s*=\s*(["'])([\s\S]*?)\1/i);
	if (!classMatch) return false;

	return classMatch[2].trim() === expectedClassString;
}

function getAncestorPageId(node) {
	let current = node.parent;
	while (current) {
		if (current.tagName === 'div') {
			const idMatch = current.attrs.match(/\bid\s*=\s*(["'])([\s\S]*?)\1/i);
			if (idMatch && /^page_\d+$/.test(idMatch[2].trim())) {
				return idMatch[2].trim();
			}
		}
		current = current.parent;
	}
	return '';
}

function collectRemovals(root, source) {
	const removals = [];

	function walk(node) {
		if (!node || !node.children) return;

		if (node.tagName === 'div' && hasExactClass(node, 'stl_05 stl_06')) {
			const directChildDivs = node.children.filter((child) => child.tagName === 'div' && child.end !== null);
			const indices = [0, 1, 2].filter((index) => index < directChildDivs.length);

			for (const index of indices) {
				const child = directChildDivs[index];
				removals.push({
					start: child.start,
					end: child.end,
					html: source.slice(child.start, child.end),
					pageId: getAncestorPageId(child) || getAncestorPageId(node),
					directIndex: index + 1,
				});
			}
		}

		for (const child of node.children) {
			walk(child);
		}
	}

	walk(root);
	return removals;
}

function applyRemovals(source, ranges) {
	if (ranges.length === 0) return source;

	ranges.sort((a, b) => a.start - b.start || a.end - b.end);
	const merged = [];

	for (const range of ranges) {
		if (merged.length === 0) {
			merged.push({ start: range.start, end: range.end });
			continue;
		}

		const last = merged[merged.length - 1];
		if (range.start <= last.end) {
			last.end = Math.max(last.end, range.end);
		} else {
			merged.push({ start: range.start, end: range.end });
		}
	}

	let out = '';
	let cursor = 0;
	for (const range of merged) {
		out += source.slice(cursor, range.start);
		cursor = range.end;
	}
	out += source.slice(cursor);
	return out;
}

function buildLogDocument(removals, inputName) {
	const timestamp = new Date().toISOString();
	const items = removals.map((entry, idx) => {
		const title = `Removed div ${idx + 1}${entry.pageId ? ` from ${entry.pageId}` : ''} (direct child #${entry.directIndex})`;
		return `<section class="log-item"><h2>${escapeHtml(title)}</h2><pre>${escapeHtml(entry.html)}</pre></section>`;
	}).join('\n');

	return `<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Removed div log</title>
	<style>
		body { font-family: Arial, sans-serif; margin: 24px; line-height: 1.5; }
		h1 { margin-bottom: 0.25rem; }
		.meta { color: #555; margin-bottom: 1.5rem; }
		.log-item { border: 1px solid #ddd; border-radius: 8px; padding: 12px 14px; margin: 0 0 16px; background: #fafafa; }
		.log-item h2 { font-size: 14px; margin: 0 0 10px; }
		pre { white-space: pre-wrap; word-break: break-word; margin: 0; font-size: 12px; }
	</style>
</head>
<body>
	<h1>Removed div log</h1>
	<div class="meta">Source: ${escapeHtml(inputName)}<br />Generated: ${escapeHtml(timestamp)}<br />Removed count: ${removals.length}</div>
	${items || '<p>No matching direct child divs were removed.</p>'}
</body>
</html>`;
}

const parsed = parseHtml(html);
const removals = collectRemovals(parsed.root, html);
const modified = applyRemovals(html, removals);
const logHtml = buildLogDocument(removals, input);

fs.writeFileSync(logFile, logHtml, 'utf8');

if (output) {
	fs.writeFileSync(output, modified, 'utf8');
	console.log(`Wrote modified file to ${output}`);
	console.log(`Wrote log file to ${logFile}`);
} else {
	const backup = `${input}.bak`;
	try {
		fs.copyFileSync(input, backup);
	} catch (error) {
		console.error(`Failed to create backup: ${error.message}`);
		process.exit(3);
	}

	fs.writeFileSync(input, modified, 'utf8');
	console.log(`Processed ${input} (backup saved as ${backup})`);
	console.log(`Wrote log file to ${logFile}`);
}

