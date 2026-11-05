/* בדיקת האשף החי ב-jsdom עם אירועים אמיתיים.
   הלקח ממחשבון איחוד ההלוואות: אף אחד מהבאגים לא היה בנוסחה.
   כולם היו בקלט, בסדר האירועים ובתנאי התצוגה. */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  OK   ' + name + (extra ? '  [' + extra + ']' : '')); }
  else { fail++; console.log('  FAIL ' + name + (extra ? '  [' + extra + ']' : '')); }
}

const html = fs.readFileSync(path.join(__dirname, 'page.html'), 'utf8');
const engine = fs.readFileSync(path.join(__dirname, 'engine.js'), 'utf8');
const wired = html.replace('<script src="./engine.js"></script>', '<script>' + engine + '</script>');

const dom = new JSDOM(wired, { runScripts: 'dangerously' });
const { window } = dom;
const doc = window.document;
const $ = (id) => doc.getElementById(id);
const out = () => $('out').textContent;
const onStep = () => {
  const s = doc.querySelector('.step.on');
  return s ? s.getAttribute('data-step') : 'none';
};
function type(id, value) {
  const el = $(id);
  el.value = String(value);
  el.dispatchEvent(new window.Event('input', { bubbles: true }));
}
function typeEl(el, value) {
  el.value = String(value);
  el.dispatchEvent(new window.Event('input', { bubbles: true }));
}
function click(el) { el.dispatchEvent(new window.MouseEvent('click', { bubbles: true })); }
const pick = (g) => doc.querySelector('.pick[data-goal="' + g + '"]');
const goBtn = (n) => doc.querySelector('.step.on [data-go="' + n + '"]');

console.log('--- shlav 1 ---');
ok('matchilim b shlav 1', onStep() === '1', onStep());
ok('shlav 2 mustar', !doc.querySelector('[data-step="2"]').classList.contains('on'));
ok('mad hitkadmut: 1 mitoch 4', doc.querySelectorAll('.bar i.on').length === 1);
ok('3 kartisei bchira', doc.querySelectorAll('.pick').length === 3);
ok('ein totzaa b hatchala', $('out').innerHTML === '');

console.log('--- bchira -> shlav 2 ---');
click(pick('kids'));
ok('avarnu l shlav 2', onStep() === '2', onStep());
ok('pane yeladim galui', !$('pane-kids').hidden);
ok('pane chofesh mustar', $('pane-freedom').hidden);
ok('ha koteret hitadkena', $('h2title').textContent.includes('הילדים'), $('h2title').textContent);
ok('2 yeladim k brirat mechdal', doc.querySelectorAll('.kidrow').length === 2);
ok('ha hagdarot sgurot', !doc.querySelector('.adv').open);
ok('ha summary omer ma munach', $('advSum').textContent.includes('600,000') &&
   $('advSum').textContent.includes('גיל 20'), $('advSum').textContent);
ok('ve lo kotev "hagdarot"', !doc.querySelector('.adv summary').textContent.includes('הגדרות'),
   doc.querySelector('.adv summary').textContent.trim());
type('perChild', 450000);
ok('ha summary mitadken im ha erech', $('advSum').textContent.includes('450,000'), $('advSum').textContent);
type('targetAge', 18);
ok('ve gam im ha gil', $('advSum').textContent.includes('גיל 18'));
type('perChild', 600000); type('targetAge', 20);
ok('mad hitkadmut: 2', doc.querySelectorAll('.bar i.on').length === 2);

console.log('--- shlav 3 ---');
click(goBtn('3'));
ok('avarnu l shlav 3', onStep() === '3', onStep());
ok('shlosha sdot bilvad', doc.querySelectorAll('[data-step="3"] input').length === 3,
   doc.querySelectorAll('[data-step="3"] input').length + ' sdot');

console.log('--- shlav 4 ---');
click(goBtn('4'));
ok('avarnu l shlav 4', onStep() === '4', onStep());
ok('yesh totzaa', $('out').innerHTML.length > 300, $('out').innerHTML.length + ' chars');
['Infinity', 'NaN', 'undefined', 'null'].forEach(bad => {
  ok('ein "' + bad + '" ba pelet', !$('out').innerHTML.includes(bad));
});

console.log('--- keren chirum tofeset kesef lifnei ha yaad ---');
ok('ein kesef -> kartis keren chirum', out().includes('צריך לשלושה חודשים'));
ok('ve ha hodaa she ha kesef shayach la', out().includes('מחזיק את המשפחה'));
const gapNoCash = out();
type('has', 60000);
ok('60,000 -> ha kartis neelam', !out().includes('צריך לשלושה חודשים'), out().slice(0, 40));
ok('ve ha pelet hishtana', out() !== gapNoCash);
type('has', 56085);
ok('bdiuk 56,085 -> mechuse', !out().includes('צריך לשלושה חודשים'));
type('has', 56084);
ok('shekel pachot -> ha kartis hozer', out().includes('צריך לשלושה חודשים'));
type('has', 0);

console.log('--- nusach ha tagim: bli jargon ---');
ok('ein et ha mila "chasufim"', !out().includes('חשופים'), out().slice(0, 45));
ok('omer ma kore b poal', out().includes('אם ההכנסה תיעצר'), out().slice(0, 35));
ok('ha krit: "titmale beod" b shanim', out().includes('יהיה לכם בעוד'));
ok('ein "98 chodashim" (mamir l shanim)', !/\d{2,} חודשים/.test(out()), out().slice(0, 60));

ok('ein "yitkalkel" (ze baltam, lo keren chirum)', !out().includes('יתקלקל'));
ok('medaber al hafsakat hachnasa', out().includes('ההכנסה'), out().slice(0, 40));
ok('ha daf mitrachev rak b shlav 4', doc.body.classList.contains('wide'));

console.log('--- ha hero ve ha tag ---');
ok('yesh ariach hero', !!doc.querySelector('#out .tile.hero'));
ok('ha hero hu ha paar', doc.querySelector('#out .tile.hero .k').textContent.trim() === 'חסר לכם');
ok('yesh tag psak din', !!doc.querySelector('#out .chip'));

console.log('--- ha graf ---');
const svg = doc.querySelector('#out .chart svg');
ok('ha graf nirender', !!svg);
ok('3 paths: band + 2 kavim', doc.querySelectorAll('#out .chart svg path').length === 3);
ok('simun yashir al ha kavim', svg.textContent.includes('צריך') && svg.textContent.includes('יהיה לכם'));
ok('yesh aria-label', (svg.getAttribute('aria-label') || '').length > 20);
svg.dispatchEvent(new window.MouseEvent('mousemove', { bubbles: true, clientX: 300, clientY: 100 }));
const tip = doc.querySelector('#out .tip');
ok('tooltip niftach b hover', tip && !tip.hidden);
ok('tooltip mekil shana, ratzui, mazui, paar',
   tip.textContent.includes('שנה') && tip.textContent.includes('צריך') &&
   tip.textContent.includes('יהיה לכם') && tip.textContent.includes('חסר'));
svg.dispatchEvent(new window.MouseEvent('mouseleave', { bubbles: true }));
ok('tooltip nisgar', tip.hidden);

console.log('--- tavlat ha yeladim ---');
ok('yesh tavla lefi yeled', out().includes('לפי ילד'));
ok('amudat yekabel b gil', out().includes('יקבל בגיל'));
ok('shurat ha charata me yom ha leida', out().includes('ביום שהם נולדו'));

console.log('--- idkun chai b shlav 4 ---');
const before = out();
type('save', 9000);
ok('shinui hafkada meadken miyad', out() !== before);
type('save', 0);
ok('hafkada 0 -> lo bederech', out().includes('לא תגיעו'));
ok('ve ein Infinity', !$('out').innerHTML.includes('Infinity'));
type('save', 900);

console.log('--- chazara ---');
click(doc.querySelector('.step.on .back'));
ok('chazarnu l shlav 3', onStep() === '3', onStep());
click(goBtn('2'));
ok('ve l shlav 2', onStep() === '2');
click(goBtn('1'));
ok('ve l shlav 1', onStep() === '1');

console.log('--- maslul chofesh kalkali ---');
click(pick('freedom'));
ok('pane chofesh galui', !$('pane-freedom').hidden);
ok('pane yeladim mustar', $('pane-kids').hidden);
type('wantMonthly', 8000);
click(goBtn('3'));
click(goBtn('4'));
ok('8,000 bachodesh -> hon 2,400,000', out().includes('2,400,000'), out().slice(0, 60));
ok('ein tavlat yeladim ba maslul ha ze', !out().includes('לפי ילד'));
ok('yesh tavlat dchiya', out().includes('אותו סכום'));

console.log('--- yaad ishi ve kelet pasul ---');
click(goBtn('3')); click(goBtn('2')); click(goBtn('1'));
click(pick('custom'));
type('cAmount', 400000);
type('cYears', 15);
click(goBtn('3')); click(goBtn('4'));
ok('400k/15sh -> nidrash 1,352', out().includes('1,352'), out().slice(0, 50));
var chipTxt = doc.querySelector('#out .chip.late, #out .chip.off, #out .chip.ok').textContent;
ok('ein "beichur shel X shanim"', !/באיחור/.test(out()), chipTxt);
var yr = new Date().getFullYear();
ok('ha tag nokev b shnatayim', out().includes('תגיעו ב-') || out().includes('אתם בדרך') ||
   out().includes('לא תגיעו'), chipTxt);
ok('ha shana ha yeuda mופiעa', out().indexOf(String(yr + 15)) > -1 || out().includes('אתם בדרך'),
   'mechapes ' + (yr + 15));
type('cYears', 0.01);
ok('ofek zair -> ein ma lechashev', out().includes('אין מה לחשב'));
ok('ve ein lo bederech', !out().includes('לא תגיעו'));
type('cYears', 1000000000);
ok('ofek anak -> ein ma lechashev', out().includes('אין מה לחשב'));
ok('ve ein NaN', !$('out').innerHTML.includes('NaN'));
type('cYears', 15);
ok('chozer la chishuv', out().includes('1,352'));

console.log('--- yeladim: takra, hasara, gil me al ha yaad ---');
click(goBtn('3')); click(goBtn('2')); click(goBtn('1'));
click(pick('kids'));
for (let i = 0; i < 9; i++) click($('addKid'));
ok('takrat 6 yeladim', doc.querySelectorAll('.kidrow').length === 6,
   doc.querySelectorAll('.kidrow').length + ' shurot');
ok('kaftor ha hosafa nestar', $('addKid').style.display === 'none');
Array.prototype.slice.call(doc.querySelectorAll('.kDel')).forEach(b => click(b));
ok('efshar lehasir et kulam', doc.querySelectorAll('.kidrow').length === 0);
click(goBtn('3')); click(goBtn('4'));
ok('bli yeladim -> hodaa ve lo crash', out().includes('אין מה לחשב'), out().slice(0, 40));
click(goBtn('3')); click(goBtn('2'));
click($('addKid'));
typeEl(doc.querySelector('.kAge'), 25);
click(goBtn('3')); click(goBtn('4'));
ok('yeled me al gil ha yaad -> hodaa', out().includes('אין מה לחשב'));
ok('ve ein Infinity', !$('out').innerHTML.includes('Infinity'));


console.log('--- shtei ha hanaot l peula ---');
/* bonim matzav naki: shnei yeladim b gilim tkinim */
click(pick('kids'));
Array.prototype.slice.call(doc.querySelectorAll('.kDel')).forEach(b => click(b));
click($('addKid')); click($('addKid'));
var ages = doc.querySelectorAll('.kAge');
typeEl(ages[0], 4); typeEl(ages[1], 9);
click(goBtn('3'));
type('save', 900); type('has', 0); type('exp', 18695);
click(goBtn('4'));
ok('matzav naki: yesh totzaa', out().indexOf('חסר לכם') > 0, out().slice(0, 35));
var wa = $('waBtn').getAttribute('href');
ok('kaftor WhatsApp kayam', !!wa, (wa || '').slice(0, 42));
ok('ha mispar shel Sofi', wa.indexOf('972552767144') > 0);
var msg = decodeURIComponent(wa.split('text=')[1] || '');
ok('ha hodaa b kol ha lakoach', msg.indexOf('עשיתי את המחשבון') === 4 || msg.indexOf('עשיתי') > 0, msg.slice(0, 50));
ok('ein guf shlishi ba hodaa', msg.indexOf('הלקוח') < 0 && msg.indexOf('המשתמש') < 0);
ok('ha hodaa mekila et ha mispar', /[0-9],[0-9]/.test(msg), msg.slice(-60));
ok('ha koteret mitadkenet lefi ha paar', $('ctaTitle').textContent.indexOf('לסגור') > 0,
   $('ctaTitle').textContent);

console.log('--- ha tofes ---');
ok('ha tofes mustar b hatchala', $('leadForm').hidden);
click($('openForm'));
ok('nifta b lechitza', !$('leadForm').hidden);
ok('ha kaftor ha poteach neelam', $('openForm').hidden);
function submit(){ $('leadForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true })); }
submit();
ok('tofes reik -> shgiaa', !$('lErr').hidden, $('lErr').textContent);
type('lName', 'אבי');
submit();
ok('bli telefon -> shgiaa', $('lErr').textContent.indexOf('טלפון') > 0, $('lErr').textContent);
type('lPhone', '0501234567');
submit();
ok('bli email -> shgiaa', $('lErr').textContent.indexOf('אימייל') > 0, $('lErr').textContent);
type('lMail', 'a@b.co.il');
submit();
ok('bli ishur -> shgiaa', $('lErr').textContent.indexOf('לאשר') > 0, $('lErr').textContent);
$('lOk').checked = true;
var sent = null;
window.fetch = function(u, o){ sent = { url: u, opt: o }; return Promise.resolve({}); };
submit();
ok('nishlach la webhook shel Fireberry', sent && sent.url.indexOf('vkkcs5er32scebp61kcdh47cl5ray9ih') > 0,
   sent ? sent.url.slice(-20) : 'lo nishlach');
ok('LO la webhook shel ha reshimot', sent.url.indexOf('0j6ujdpk46') < 0);
var pp = {};
String(sent.opt.body).split('&').forEach(function(kv){
  var e = kv.indexOf('=');
  pp[decodeURIComponent(kv.slice(0, e))] = decodeURIComponent(kv.slice(e + 1));
});
ok('urlencoded ve lo JSON', String(sent.opt.body).indexOf('{') < 0);
ok('bli preflight (urlencoded)', sent.opt.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') === 0);
ok('shlosha sdot she ha tarchish memape', pp.name === 'אבי' && pp.phone === '0501234567' && pp.email === 'a@b.co.il');
ok('yesh makor', pp.source === 'מחשבון הפער', pp.source);
ok('yesh sikum l sde ha teur', pp.summary.indexOf('מחשבון הפער') === 0, pp.summary);
ok('ref mekil et ha sikum (ze ma she nichnas la teur ha chai)',
   pp.ref === pp.summary, pp.ref);
ok('utm_source brirat mechdal', pp.utm_source === 'money-gap', pp.utm_source);
ok('utm_campaign brirat mechdal', pp.utm_campaign === 'money-gap-calculator');
ok('ha misparim ba sikum im psikim', /[0-9],[0-9]/.test(pp.summary), pp.summary);
ok('ha paar meugal, bli nekudot', pp.gap.indexOf('.') < 0, pp.gap);
ok('sug ha yaad b ivrit', pp.goal_type === 'ילדים', pp.goal_type);


console.log('--- kelet pasul lo mashir misparim yeshanim ba kaftor ---');
click(goBtn('3')); click(goBtn('2')); click(goBtn('1'));
click(pick('custom'));
type('cAmount', 400000); type('cYears', 15);
click(goBtn('3')); click(goBtn('4'));
var good = decodeURIComponent($('waBtn').getAttribute('href').split('text=')[1]);
ok('maslul takin: yesh mispar ba hodaa', /[0-9],[0-9]/.test(good), good.slice(0, 45));
type('cYears', 0.01);
var bad = decodeURIComponent($('waBtn').getAttribute('href').split('text=')[1]);
ok('kelet pasul: ein mispar ba hodaa', !/[0-9],[0-9]/.test(bad), bad);
ok('ve ha koteret lo medaberet al paar', $('ctaTitle').textContent.indexOf('לסגור את ה') < 0,
   $('ctaTitle').textContent);
type('cYears', 15);
ok('chozer la mispar ha nachon', decodeURIComponent($('waBtn').getAttribute('href').split('text=')[1]) === good);

console.log('');
console.log('SOF: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
