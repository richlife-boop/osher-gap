var E=require('./engine.js'), r=E.netRate(), f=0,p=0;
function ok(n,g,w,t){t=t==null?1:t;var good=(w===null)?(g===null):(g!==null&&Math.abs(g-w)<=t);
 if(good){p++;console.log('  OK   '+n+' = '+(g===null?'null':Math.round(g*100)/100));}else{f++;console.log('  FAIL '+n+' got '+g+' want '+w);}}
var kids=[{age:4,name:'a'},{age:9,name:'b'},{age:14,name:'c'}];
console.log('--- childrenPlan: ha nidrash hu SCHUM, lo yaad echad ---');
var pl=E.childrenPlan(kids,900,r,0,600000,20);
ok('nidrash bachodesh (schum)',pl.monthlyNeeded,11917,3);
ok('LO 5,505 (ha bug)',pl.monthlyNeeded>10000?1:0,1,0);
ok('yaad kolel',pl.totalGoal,1800000);
console.log('    hashva\'a: monthlyNeeded al yaad echad/16sh = '+Math.round(E.monthlyNeeded(1800000,16,r)));
console.log('--- chalukat ha 900 lefi dchifut ---');
ok('sach ha hakzaot = 900',pl.rows.reduce(function(s,x){return s+x.allocated},0),900,0.01);
console.log('    '+pl.rows.map(function(x){return x.name+': '+Math.round(x.allocated)}).join(' | '));
console.log('--- psak din le kol yeled ---');
pl.rows.forEach(function(x){console.log('    '+x.name+' ('+x.yearsLeft+'sh): '+x.state+
  (x.yearsToReach===null?'':' magi\'a acharei '+(Math.round(x.yearsToReach*10)/10)+'sh'));});
ok('psak din kolel = LATE',pl.state==='LATE'?1:0,1,0);
console.log('--- mafnim maspik: 11,917 -> ON_TRACK le kulam ---');
var pl2=E.childrenPlan(kids,11917,r,0,600000,20);
ok('kolel ON_TRACK',pl2.state==='ON_TRACK'?1:0,1,0);
ok('pa\'ar efes',pl2.shortfall,0,500);
console.log('--- mafnim efes -> NEVER_ZERO ---');
ok('state',E.childrenPlan(kids,0,r,0,600000,20).state==='NEVER_ZERO'?1:0,1,0);
console.log('--- yeled bodeded zehe l monthlyNeeded ---');
ok('yeled ben 14 levad',E.childrenPlan([{age:14}],0,r,0,600000,20).monthlyNeeded,6900);
console.log('\n'+p+' passed, '+f+' failed');
process.exit(f?1:0);
