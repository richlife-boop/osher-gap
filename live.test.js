/* בדיקה על הקבצים כפי שהם מוגשים מהכתובת החיה.
   לא על מה שבנינו, אלא על מה שהגולש באמת מקבל.
   הרץ קודם: curl את שלושת הקבצים לתיקיית live/ */
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const L = path.join(__dirname, 'live');
let pass = 0, fail = 0;
const ok = (n, c, x) => {
  if (c) { pass++; console.log('  OK   ' + n + (x ? '  [' + x + ']' : '')); }
  else { fail++; console.log('  FAIL ' + n + (x ? '  [' + x + ']' : '')); }
};

const idx = fs.readFileSync(path.join(L, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(L, 'gap.js'), 'utf8');
const html = idx
  .replace(/<link rel="stylesheet" href="\.\/gap\.css">/, '')
  .replace(/<script src="\.\/gap\.js"><\/script>/, '<script>' + js + '</script>');

const errs = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errs.push(e.message.split(String.fromCharCode(10))[0]));
const dom = new JSDOM(html, { runScripts: 'dangerously', virtualConsole: vc });
const { window } = dom, doc = window.document;
const $ = id => doc.getElementById(id);
const out = () => $('out').textContent;
const click = el => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
const go = n => doc.querySelector('.step.on [data-go="' + n + '"]');
const type = (id, v) => {
  const el = $(id); el.value = String(v);
  el.dispatchEvent(new window.Event('input', { bubbles: true }));
};

(async function () {
  await new Promise(r => setTimeout(r, 80));
  console.log('--- ha kod ha chai rats ---');
  ok('ein shgiaot', errs.length === 0, errs.join(' | '));
  ok('ha machshvon nivna me atzmo', $('osher-gap').innerHTML.length > 2000,
     $('osher-gap').innerHTML.length + ' chars');
  ok('3 kartisei bchira', doc.querySelectorAll('.pick').length === 3);

  console.log('--- shlosha maslulim ---');
  click(doc.querySelector('.pick[data-goal="kids"]'));
  var ag = doc.querySelectorAll('.kAge');
  ok('ein brirot mechdal la gilim', ag[0].value === '' && ag[1].value === '');
  click(go('3'));
  ok('shaar: bli milui lo ovrim', !!doc.querySelector('.step.on[data-step="2"]'));
  [].forEach.call(ag, function(a, i){ a.value = i ? '9' : '4';
    a.dispatchEvent(new window.Event('input', { bubbles: true })); });
  click(go('3'));
  type('save', 900); type('has', 0); type('exp', 18695);
  click(go('4'));
  ok('yeladim: totzaa', out().length > 200, out().length + ' chars');
  ok('yeladim: graf', !!doc.querySelector('#out .chart svg'));
  ok('yeladim: hero', !!doc.querySelector('#out .tile.hero'));
  ok('yeladim: tavla', out().includes('לפי ילד'));

  click(go('3')); click(go('2')); click(go('1'));
  click(doc.querySelector('.pick[data-goal="freedom"]'));
  type('wantMonthly', 8000); type('myAge', 40); type('freedomAge', 55);
  click(go('3')); click(go('4'));
  ok('chofesh: hon 2,400,000', out().includes('2,400,000'));

  click(go('3')); click(go('2')); click(go('1'));
  click(doc.querySelector('.pick[data-goal="custom"]'));
  type('cAmount', 400000); type('cYears', 15);
  click(go('3')); click(go('4'));
  ok('yaad ishi: 1,352', out().includes('1,352'));

  console.log('--- nikayon ---');
  ['NaN', 'Infinity', 'undefined'].forEach(b => ok('ein ' + b, !$('out').innerHTML.includes(b)));
  ['פער', 'נדרש', 'מפנים', 'המצוי', 'הרצוי', 'נומינלי', 'חשופ'].forEach(w => {
    /* רק הטקסט שהגולש רואה, לא תוכן הסקריפט ולא הערות בקוד */
    ok('ein jargon: ' + w, !$('osher-gap').textContent.includes(w));
  });

  console.log('');
  console.log('SOF: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
