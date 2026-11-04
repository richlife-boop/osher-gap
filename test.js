var E = require('./engine.js');
var r = E.netRate();          // 0.062
var fail = 0, pass = 0;
function ok(name, got, want, tol) {
  tol = tol == null ? 1 : tol;
  var good = (want === null) ? (got === null) : (got !== null && Math.abs(got - want) <= tol);
  if (good) { pass++; console.log('  OK   ' + name + '  = ' + (got === null ? 'null' : Math.round(got * 100) / 100)); }
  else { fail++; console.log('  FAIL ' + name + '  got ' + got + ' want ' + want); }
}
console.log('netRate = ' + r.toFixed(4) + '\n--- mul ha chishuv b python ---');
ok('monthlyNeeded 400k/15y', E.monthlyNeeded(400000, 15, r), 1352);
ok('futureValue 900/15y', E.futureValue(900, 15, r, 0), 266246);
ok('yearsToReach 400k @900', E.yearsToReach(400000, 900, r, 0), 19.3, 0.05);
ok('monthlyNeeded 400k/25y', E.monthlyNeeded(400000, 25, r), 560);
ok('monthlyNeeded 600k/20y', E.monthlyNeeded(600000, 20, r), 1268);

console.log('--- yeladim 4, 9, 14 ---');
var kids = E.childrenGoal([{ age: 4 }, { age: 9 }, { age: 14 }], r);
ok('ben 4  (16y)', kids.rows[0].monthlyNeeded, 1835);
ok('ben 9  (11y)', kids.rows[1].monthlyNeeded, 3182);
ok('ben 14 (6y)', kids.rows[2].monthlyNeeded, 6900);
ok('sach hakol', kids.totalMonthly, 11917, 3);
ok('yaad kolel', kids.totalGoal, 1800000);

console.log('--- chofesh kalkali ---');
ok('8,000 bachodesh -> hon', E.freedomGoal(8000).capitalNeeded, 2400000);
ok('18,695 bachodesh -> hon', E.freedomGoal(18695).capitalNeeded, 5608500);

console.log('--- machir hadchiya + charata ---');
var d = E.delayTable(400000, r);
ok('tavla 5 shanim', d[4].monthly, 5704);
var g = E.regret(600000, 15, r, 5);
ok('charata: nidrash achshav', g.now, 2028, 2);

console.log('--- mikrei katze ("lo tagi\'u") ---');
ok('mafnim 0 -> lo tagi\'u', E.yearsToReach(400000, 0, r, 0), null);
var v1 = E.verdict(400000, 15, 0, r, 0, null);
console.log(v1.state === 'NEVER_ZERO' ? '  OK   state NEVER_ZERO' : '  FAIL state ' + v1.state), v1.state === 'NEVER_ZERO' ? pass++ : fail++;
var v2 = E.verdict(400000, 15, 900, r, 0, 0.0719);   // dirot 7.19% > 6.2%
console.log(v2.state === 'NEVER_RUNAWAY' ? '  OK   state NEVER_RUNAWAY (yaad boreach)' : '  FAIL state ' + v2.state), v2.state === 'NEVER_RUNAWAY' ? pass++ : fail++;
/* 🔴 tukan acharei bikoret codex: hashva'at ribiyot lo kov'aat.
   gam al 5.56%, hafkada shel 900 lo masiga et ha yaad be'ofek enoshi. */
var v3 = E.verdict(400000, 15, 900, r, 0, 0.0556);
console.log(v3.state === 'NEVER_RUNAWAY' ? '  OK   state NEVER_RUNAWAY (900 lo masig gam 5.56%)' : '  FAIL state ' + v3.state), v3.state === 'NEVER_RUNAWAY' ? pass++ : fail++;
var v3c = E.verdict(400000, 15, 10000, r, 0, 0.0556);
console.log(v3c.state !== 'NEVER_RUNAWAY' ? '  OK   hafkada 10,000 kn masiga 5.56% (' + v3c.state + ')' : '  FAIL ' + v3c.state), v3c.state !== 'NEVER_RUNAWAY' ? pass++ : fail++;
/* 🔴 tukan: 1352 ha'uggal nofel mi'tachat la yaad b'39 sh, ve achshav ze LATE ve lo ON_TRACK. */
var v4 = E.verdict(400000, 15, 1353, r, 0, null);
console.log(v4.state === 'ON_TRACK' ? '  OK   state ON_TRACK (1353)' : '  FAIL state ' + v4.state), v4.state === 'ON_TRACK' ? pass++ : fail++;
var v4b = E.verdict(400000, 15, 1352, r, 0, null);
console.log(v4b.state === 'LATE' ? '  OK   1352 meugal -> LATE, chaser ' + Math.round(v4b.shortfall) : '  FAIL ' + v4b.state), v4b.state === 'LATE' ? pass++ : fail++;
var v5 = E.verdict(400000, 15, 100, r, 500000, null);
console.log(v5.state === 'ON_TRACK' ? '  OK   kvar yesh lahem -> ON_TRACK' : '  FAIL state ' + v5.state), v5.state === 'ON_TRACK' ? pass++ : fail++;

console.log('--- yeled ben 20 ve ben 21 (ofek 0 ve shlili) ---');
var k2 = E.childrenGoal([{ age: 20 }, { age: 21 }], r);
console.log('  ben 20: ' + k2.rows[0].monthlyNeeded + ' | ben 21: ' + k2.rows[1].monthlyNeeded);
/* 🔴 tukan: ha manoa mahzir null (lo Infinity) le ofek efes. isFinite(null)===true ve lo tofes et ze. */
console.log(k2.totalMonthly === null ? '  OK   ofek 0/shlili mahzir null, lo Infinity' : '  FAIL hichzir ' + k2.totalMonthly), k2.totalMonthly === null ? pass++ : fail++;
console.log(k2.rows[0].monthlyNeeded === null ? '  OK   ve gam ba shura atzma null' : '  FAIL ' + k2.rows[0].monthlyNeeded), k2.rows[0].monthlyNeeded === null ? pass++ : fail++;

console.log('\n--- keren chirum (manoa nifrad, bli tsua) ---');
var ef = E.emergencyFund(18695, 3, 0, 1000);
ok('yaad 3 chodashim', ef.goal, 56085);
ok('chodashim chasufim b1000', ef.exposedMonths, 57, 1);
var ef2 = E.emergencyFund(18695, 3, 30000, 1000);
ok('yesh 30k -> chaser', ef2.missing, 26085);
ok('yesh 30k -> mechuse', ef2.coveredMonths, 1.6, 0.05);
var ef3 = E.emergencyFund(18695, 3, 0, 0);
console.log(ef3.state === 'NEVER_ZERO' ? '  OK   mafnim 0 -> NEVER_ZERO' : '  FAIL ' + ef3.state), ef3.state === 'NEVER_ZERO' ? pass++ : fail++;
var ef4 = E.emergencyFund(18695, 3, 60000, 1000);
console.log(ef4.state === 'COVERED' && ef4.exposedMonths === 0 ? '  OK   kiseta -> COVERED' : '  FAIL ' + ef4.state), (ef4.state === 'COVERED') ? pass++ : fail++;
var sl = E.shockAsLoan(30000, 0.09, 36);
ok('baltam 30k @9%/36: chodshi', sl.monthly, 954, 2);
ok('baltam 30k @9%/36: ribit', sl.interest, 4344, 5);
console.log('\nSOF: ' + pass + ' passed, ' + fail + ' failed');

process.exit(fail ? 1 : 0);
