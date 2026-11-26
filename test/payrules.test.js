// Checks the extra-pay rules against the city's own worked examples and common cases: node test/payrules.test.js
const { owed } = require('../src/payrules.js');
const cases = [
  // The city's FAQ example: a shift in the week starting Mon Jul 27, 2020, canceled on different days.
  ['city example: canceled, told Jul 12', owed('cut', '2020-07-27', '2020-07-12'), 0],
  ['city example: told Jul 13', owed('cut', '2020-07-27', '2020-07-13'), 20],
  ['city example: told Jul 19', owed('cut', '2020-07-27', '2020-07-19'), 20],
  ['city example: told Jul 20', owed('cut', '2020-07-27', '2020-07-20'), 45],
  ['city example: told Jul 25', owed('cut', '2020-07-27', '2020-07-25'), 45],
  ['city example: told Jul 26', owed('cut', '2020-07-27', '2020-07-26'), 75],
  ['city example: told Jul 30', owed('cut', '2020-07-27', '2020-07-30'), 75],
  ['asked to stay late, same week', owed('late', '2026-11-23', '2026-11-25'), 15],
  ['worker asked for the change', owed('asked', '2026-11-23', '2026-11-25'), 0],
  ['extra hours, under 7 days notice', owed('extra', '2026-11-22', '2026-11-21'), 15],
  ['extra hours, 10 days notice', owed('extra', '2026-12-07', '2026-11-27'), 10],
  ['close then open', owed('clopen', '2026-11-23', '2026-11-25'), 100],
  ['close then open during an emergency', owed('clopen', '2026-11-23', '2026-11-25', false, true), 100],
  ['added time paid as overtime', owed('extra', '2026-11-23', '2026-11-25', true), 0],
  ['cut because of an emergency', owed('cut', '2026-11-23', '2026-11-25', false, true), 0],
  ['trade between workers', owed('trade', '2026-11-23', '2026-11-25'), 0],
];
let bad = 0;
for (const [name, got, want] of cases) if (got !== want) { bad++; console.log('FAIL', name, 'got', got, 'want', want); }
console.log(`${cases.length - bad} of ${cases.length} pay checks match`);
process.exitCode = bad ? 1 : 0;
