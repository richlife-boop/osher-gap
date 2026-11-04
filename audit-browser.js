// Runs unchanged page.html inside same-origin iframes; real browser DOM events.
(async()=>{
const report=document.getElementById('report');
function log(name,data){report.textContent+=name+' '+JSON.stringify(data)+'\n';}
async function fresh(){let f=document.createElement('iframe');f.src='./page.html';f.style.width='360px';f.style.height='1000px';document.body.append(f);await new Promise(r=>f.onload=r);let w=f.contentWindow,d=w.document;return {f,w,d,$:id=>d.getElementById(id),type:(id,v)=>{let el=typeof id==='string'?d.getElementById(id):id;el.value=String(v);el.dispatchEvent(new w.Event('input',{bubbles:true}));},tab:g=>d.querySelector('[data-goal="'+g+'"]').click(),txt:()=>d.getElementById('out').textContent,tiles:()=>Array.from(d.querySelectorAll('#out .tile')).map(x=>x.textContent)};}
let b=await fresh();log('initial fixes',{tiles:b.tiles(),birth:b.txt().includes('ביום שהם נולדו'),old:b.txt().includes('לפני 10 שנים')});
b.tab('custom');b.type('cYears',15);b.type('save',0);b.type('has',200000);log('zero deposit existing',{tiles:b.tiles(),chip:b.d.querySelector('#out .chip').textContent,never:b.txt().includes('לעולם')});
b.type('has',0);b.type('save',1345);log('tolerance',{tiles:b.tiles(),chip:b.d.querySelector('#out .chip').textContent});
b.tab('kids');b.type('has',1800000);log('children existing',{tiles:b.tiles(),chip:b.d.querySelector('#out .chip').textContent});
b=await fresh();b.type(b.d.querySelector('.kName'),'<img src="bad" onerror="window.auditExecuted=1">');let img=b.d.querySelector('#out img');img.dispatchEvent(new b.w.Event('error'));log('injection',{imageInserted:!!img,scriptExecuted:b.w.auditExecuted});
b=await fresh();b.type('perChild',0);log('zero child target',{tiles:b.tiles(),rows:b.d.querySelector('#out table').textContent,chip:b.d.querySelector('#out .chip').textContent});
b.type('perChild',-600000);log('negative child target',{tiles:b.tiles(),notes:b.txt().slice(-320)});
b=await fresh();b.tab('custom');b.type('cYears',.01);log('tiny horizon',{tiles:b.tiles(),nullText:b.txt().includes('null'),tail:b.txt().slice(-230)});
b.type('cYears',1e9);log('huge horizon',{tiles:b.tiles(),NaN:b.txt().includes('NaN'),nullText:b.txt().includes('null')});
b=await fresh();b.type('save',-900);log('negative save',{tiles:b.tiles(),never:b.txt().includes('לא יקבל')});b.type('efHave',-1000);log('negative emergency',b.$('efOut').textContent);
b=await fresh();b.type('perChild','');log('empty target',{input:b.$('perChild').value,tiles:b.tiles()});b.type(b.d.querySelector('.kAge'),'אבג');log('Hebrew age',{input:b.d.querySelector('.kAge').value,firstRow:b.d.querySelector('#out tbody tr').textContent});
b=await fresh();b.type('save',5);log('first input',{value:b.$('save').value,actual:b.tiles()[1]});b.type(b.d.querySelector('.kAge'),.5);log('half year',b.d.querySelector('#out tbody tr').textContent);b.type(b.d.querySelector('.kAge'),19.99);log('near target',{nullText:b.txt().includes('null'),rows:b.d.querySelector('#out table').textContent});
b=await fresh();b.type('has',1800000);b.tab('custom');b.type('cYears',15);log('regret existing',{tiles:b.tiles(),regret:Array.from(b.d.querySelectorAll('#out .note')).map(x=>x.textContent)});
b=await fresh();let before=b.txt();b.d.querySelector('.cta').click();log('CTA',{unchanged:before===b.txt(),href:b.d.querySelector('.cta').getAttribute('href'),onclick:b.d.querySelector('.cta').onclick});
log('labels',{children:Array.from(b.d.querySelectorAll('.kidrow input')).map(x=>({class:x.className,labelCount:x.labels.length})),live:b.$('out').getAttribute('aria-live')});
let tab=b.d.querySelector('[data-goal="kids"]');tab.focus();tab.dispatchEvent(new b.w.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));log('keyboard tabs',{selected:b.d.querySelector('.tab[aria-selected="true"]').dataset.goal});
b.type(b.d.querySelectorAll('.kName')[1],'KEEP');b.d.querySelector('.kDel').click();log('remove mid edit',{remaining:b.d.querySelector('.kName').value,output:b.txt().includes('KEEP')});
b.tab('custom');b.type('cAmount',123456);let custom=b.txt();b.tab('kids');b.type('perChild',999999);b.tab('custom');log('tab isolation',{unchanged:custom===b.txt()});
b=await fresh();log('360 layout',{viewport:b.w.innerWidth,scroll:b.d.documentElement.scrollWidth,client:b.d.documentElement.clientWidth});b.type('save',1e9);log('360 large number layout',{scroll:b.d.documentElement.scrollWidth,client:b.d.documentElement.clientWidth});
log('certainty wording',{ageFact:b.txt().includes('מתי הכסף באמת יהיה שם'),disclaimer:b.d.querySelector('.assump').textContent});
// Simulate an Elementor HTML fragment at a normal permalink, with no engine asset there.
let f=document.createElement('iframe');f.srcdoc='<!doctype html><base href="http://127.0.0.1:8765/wordpress/landing/">'+(await(await fetch('./page.html')).text());document.body.append(f);await new Promise(r=>f.onload=r);log('wordpress fragment',{outputLength:f.contentDocument.getElementById('out').textContent.length,engine:typeof f.contentWindow.OSHER_ENGINE,asset:f.contentDocument.querySelector('script[src]').src});
document.title='AUDIT COMPLETE';
})().catch(e=>{document.getElementById('report').textContent+='ERROR '+e.stack;});
