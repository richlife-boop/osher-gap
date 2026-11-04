const assert=require('node:assert/strict'), E=require('./engine');
const r=.062, i=r/12;
// Recurrence B[m+1]=(1+i)*B[m]+p: deposit AFTER interest.
function sim(p,n,e=0,rate=r){let b=e;for(let m=0;m<n;m++)b=b*(1+rate/12)+p;return b;}
function need(g,n,e=0){let lo=0,hi=g;for(let k=0;k<100;k++){let p=(lo+hi)/2;if(sim(p,n,e)>=g)hi=p;else lo=p;}return hi;}
function reach(g,p,e=0,rate=r){let b=e,m=0;while(b<g&&m<12000){b=b*(1+rate/12)+p;m++;}return m;}
const log=(k,v)=>console.log(k,JSON.stringify(v,(key,value)=>typeof value==='number'&&!Number.isFinite(value)?String(value):value));
log('independent reference',{need400k15:need(400000,180),fv90015:sim(900,180),reachMonths:reach(400000,900),need600k20:need(600000,240),delay:[300,240,180,120,60].map(n=>need(400000,n)),childStart:[0,5,10,15].map(a=>need(600000,(20-a)*12)),emergency:Math.ceil(18695*3/1000),capital:8000*12/.04});
// Loan payment solved by amortizing to zero, not annuity closed form.
let lo=0,hi=30000;for(let k=0;k<100;k++){let p=(lo+hi)/2;if(sim(-p,36,30000,.09)>0)lo=p;else hi=p;}log('loan',{monthly:hi,interest:hi*36-30000});
let maxError=0,cases=0;
for(const n of [1,6,72,132,180,192,240,300])for(const p of [0,1,900,12000])for(const e of [0,100000,500000]){
 maxError=Math.max(maxError,Math.abs(E.futureValue(p,n/12,r,e)-sim(p,n,e)));cases++;
 if(p>0){let t=E.yearsToReach(600000,p,r,e);assert.equal(Math.ceil(t*12-1e-8),reach(600000,p,e));}
 assert.ok(Math.abs(E.verdict(600000,n/12,p,r,e).monthlyNeeded-need(600000,n,e))<1e-6);
}log('simulation checks',{cases,maxError});
const kids=[{age:4},{age:9},{age:14}], ns=[192,132,72], needs=ns.map(n=>need(600000,n)), total=needs.reduce((a,b)=>a+b);
log('independent children',{needs,total,alloc:needs.map(n=>900*n/total)});
for(const has of [0,100000,600000,1800000]){const p=E.childrenPlan(kids,900,r,has);log('children existing '+has,{need:p.monthlyNeeded,correctByAllocatedExisting:p.rows.reduce((s,row,j)=>s+need(600000,ns[j],has*needs[j]/total),0),gap:p.shortfall,state:p.state});}
log('zero deposit existing', {got:E.verdict(400000,15,0,r,200000),simFV:sim(0,180,200000),reachMonths:reach(400000,0,200000)});
log('tolerance',E.verdict(400000,15,1345,r,0));
log('zero rate', {got:E.yearsToReach(400000,1000,0,0),expectedMonths:reach(400000,1000,0,0)});
log('runaway counterexample',{got:E.verdict(400000,15,1000000,r,0,.0719).state,firstMonthSaved:sim(1000000,1),firstMonthGrowingGoal:400000*(1+.0719/12)});
log('rounding',{rowRounded:needs.map(Math.round),sumRounded:needs.map(Math.round).reduce((a,b)=>a+b),roundedTotal:Math.round(total)});
log('overflow',E.verdict(400000,1e9,900,r,0));
log('submonth',E.verdict(400000,.01,900,r,0));
log('zero child goal',E.childrenPlan(kids,900,r,0,0,20));
log('negative savings',E.verdict(400000,15,-900,r,0));
// Locate a displayed-total rounding disagreement without changing the model.
for(let amount=100000;amount<100100;amount++){
 const p=E.childrenPlan(kids,900,r,0,amount,20),sum=p.rows.reduce((s,x)=>s+Math.round(x.monthlyNeeded),0);
 if(sum!==Math.round(p.monthlyNeeded)){log('rounding counterexample',{amount,rows:p.rows.map(x=>Math.round(x.monthlyNeeded)),sum,total:Math.round(p.monthlyNeeded)});break;}
}
let mix=E.childrenPlan(kids,5000,r,600000,600000,20);
log('mixed surplus gap',{willHave:mix.willHave,totalGoal:mix.totalGoal,shortfall:mix.shortfall,aggregateGap:Math.max(0,mix.totalGoal-mix.willHave),rows:mix.rows.map(x=>({fv:x.willHave,gap:x.shortfall}))});
// The logarithm solves a continuous interpolation; ordinary deposits occur at whole months.
log('closed vs discrete',{closed:E.yearsToReach(400000,900,r,0),firstHit:reach(400000,900)/12,before:sim(900,231),after:sim(900,232)});
const html=require('fs').readFileSync('page.html','utf8');
const kidsRender=html.slice(html.indexOf('function renderKids'),html.indexOf('function runEF'));
assert.ok(kidsRender.includes('ביום שהם נולדו'));
assert.ok(!kidsRender.includes("E.regret("));
assert.ok(kidsRender.includes('nis(pl.monthlyNeeded)'));
log('fixed regression source checks',{birthWording:true,samePlanForRegretAndTile:true});
