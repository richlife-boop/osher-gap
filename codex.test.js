var E=require('./engine.js'), r=0.062, p=0, f=0;
function ok(n,c,x){if(c){p++;console.log('  OK   '+n+(x?'  ['+x+']':''))}else{f++;console.log('  FAIL '+n+(x?'  ['+x+']':''))}}
console.log('=== shivat ha mimtzaim shel codex ===');
var v1=E.verdict(400000,15,0,r,200000);
ok('#1 kayam 200k levado -> ON_TRACK', v1.state==='ON_TRACK', v1.state);
ok('#1 ve ha zman: 11.25 shanim', v1.yearsToReach!==null && Math.abs(v1.yearsToReach-11.25)<0.1, v1.yearsToReach===null?'null':Math.round(v1.yearsToReach*100)/100);
ok('#1 ein kayam ve ein hafkada -> lo magi\'a', E.verdict(400000,15,0,r,0).state==='NEVER_ZERO');

var p2=E.childrenPlan([{age:4},{age:9},{age:14}],900,r,1800000,600000,20);
ok('#2 kayam 1.8M -> nidrash 0', p2.monthlyNeeded<1, Math.round(p2.monthlyNeeded));
ok('#2 ve ON_TRACK', p2.state==='ON_TRACK', p2.state);
var p2b=E.childrenPlan([{age:4},{age:9},{age:14}],900,r,600000,600000,20);
ok('#2 kayam 600k -> nidrash katan mi 11,917', p2b.monthlyNeeded<11917, Math.round(p2b.monthlyNeeded));
ok('#2 bli kayam nish\'ar 11,917', Math.abs(E.childrenPlan([{age:4},{age:9},{age:14}],900,r,0,600000,20).monthlyNeeded-11917)<3);

var v3=E.verdict(400000,15,1345,r,0);
ok('#3 pa\'ar hiyuvi -> LATE ve lo ON_TRACK', v3.state==='LATE', v3.state+' pa\'ar '+Math.round(v3.shortfall));
var v3b=E.verdict(400000,15,1353,r,0);
ok('#3 hafkada maspika -> ON_TRACK', v3b.state==='ON_TRACK' && v3b.shortfall===0, v3b.state);

var v4a=E.verdict(400000,1e9,900,r,0), v4b=E.verdict(400000,0.01,900,r,0);
ok('#4 ofek 1e9 -> INVALID', v4a.state==='INVALID' && v4a.monthlyNeeded===null, v4a.state);
ok('#4 ofek 0.01 -> INVALID', v4b.state==='INVALID', v4b.state);
ok('#4 ofek 100 shana od taqin', E.verdict(400000,100,900,r,0).state!=='INVALID');
ok('#4 ofek 101 shana -> INVALID', E.verdict(400000,101,900,r,0).state==='INVALID');

ok('#5 hafkada anakit menatzachat yaad she mityaker', E.verdict(400000,15,1000000,r,0,0.0719).state==='ON_TRACK', E.verdict(400000,15,1000000,r,0,0.0719).state);
ok('#5 hafkada ktana lo menatzachat 7.19%', E.verdict(400000,15,900,r,0,0.0719).state==='NEVER_RUNAWAY', E.verdict(400000,15,900,r,0,0.0719).state);
ok('#5 900 lo masig gam 5.56%', E.verdict(400000,15,900,r,0,0.0556).state==='NEVER_RUNAWAY');
ok('#5 10,000 kn masig 5.56%', E.verdict(400000,15,10000,r,0,0.0556).state!=='NEVER_RUNAWAY', E.verdict(400000,15,10000,r,0,0.0556).state);

var t6=E.yearsToReach(400000,1000,0,0);
ok('#6 tsua efes -> 33.33 shanim ve lo null', t6!==null && Math.abs(t6-400/12)<0.01, t6===null?'null':Math.round(t6*100)/100);

var q=E.childrenPlan([{age:4},{age:9},{age:14}],900,r,0,100020,20);
var rr=E.roundToTotal(q.rows.map(function(x){return x.monthlyNeeded}));
ok('#7 shurot meugalot mistakmot la schum', rr.reduce(function(s,x){return s+x})===Math.round(q.monthlyNeeded), rr.join('+')+'='+rr.reduce(function(s,x){return s+x})+' schum '+Math.round(q.monthlyNeeded));

console.log('\n=== regresia: ha misparim she ushru lo zazu ===');
ok('400k/15sh = 1,352', Math.abs(E.monthlyNeeded(400000,15,r)-1352)<1);
ok('900/15sh = 266,246', Math.abs(E.futureValue(900,15,r,0)-266246)<1);
ok('3 yeladim = 11,917', Math.abs(E.childrenPlan([{age:4},{age:9},{age:14}],900,r,0,600000,20).monthlyNeeded-11917)<3);
ok('chalukat 900 = 139/240/521', E.childrenPlan([{age:4},{age:9},{age:14}],900,r,0,600000,20).rows.map(function(x){return Math.round(x.allocated)}).join('/')==='139/240/521');
ok('keren chirum 56,085 / 57 chodashim', E.emergencyFund(18695,3,0,1000).goal===56085 && E.emergencyFund(18695,3,0,1000).exposedMonths===57);
ok('halvaa 30k@9% = 954', Math.abs(E.shockAsLoan(30000,0.09,36).monthly-954)<2);
ok('chofesh 8,000 -> 2.4M', E.freedomGoal(8000).capitalNeeded===2400000);
console.log('\nSOF: '+p+' passed, '+f+' failed');
process.exit(f?1:0);
