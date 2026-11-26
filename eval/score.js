// Scores the reply reader on a test set: node eval/score.js data/heldout.json [--show]
// A "wrong yes" is a reply the reader records as a sure yes when the answer key says it isn't one.
const path = require('path');
const { read } = require('../src/reader.js');
const file = process.argv[2] || 'data/heldout.json';
const set = require(path.resolve(file));
let right = 0, wrongYes = 0, goldYes = 0, direct = 0, confirm = 0, missed = 0;
const misses = [];
for (const [text, gold] of set) {
  const r = read(text);
  if (r.label === gold) right++; else misses.push(`${JSON.stringify(text)}  key=${gold}  read=${r.label}${r.sure ? ' (sure)' : ''}`);
  if (gold === 'yes') { goldYes++; if (r.label === 'yes' && r.sure) direct++; else if (r.label === 'yes') confirm++; else missed++; }
  if (r.label === 'yes' && r.sure && gold !== 'yes') wrongYes++;
}
console.log(JSON.stringify({ set: path.basename(file), replies: set.length, readRight: right, wrongYes, yeses: goldYes, recordedOnFirstReply: direct, sentToConfirm: confirm, missedYes: missed }));
if (process.argv.includes('--show')) misses.forEach((m) => console.log('  ' + m));
process.exitCode = wrongYes > 0 ? 1 : 0;
