/* בדיקה על קבצי ההפצה עצמם, לא על page.html.
   זה מה שבאמת יעלה לאוויר, ולכן זה מה שצריך לעבור. */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  OK   ' + name + (extra ? '  [' + extra + ']' : '')); }
  else { fail++; console.log('  FAIL ' + name + (extra ? '  [' + extra + ']' : '')); }
}

const D = path.join(__dirname, 'docs');
const js = fs.readFileSync(path.join(D, 'gap.js'), 'utf8');
const css = fs.readFileSync(path.join(D, 'gap.css'), 'utf8');
const idx = fs.readFileSync(path.join(D, 'index.html'), 'utf8');

console.log('--- ha kvatzim ---');
ok('gap.js gadol mi 20KB', js.length > 20000, Math.round(js.length / 1024) + ' KB');
ok('gap.css gadol mi 3KB', css.length > 3000, Math.round(css.length / 1024) + ' KB');
ok('index.html mekil et ha mount', idx.includes('id="osher-gap"'));
ok('index.html bli HTML shel ha machshvon', !idx.includes('data-step'));
ok('ein tagit script b tokh gap.js', !js.includes('</script'));

console.log('--- ha daf ha chai ---');
const html = idx
  .replace('<link rel="stylesheet" href="./gap.css">', '')
  .replace('<script src="./gap.js"></script>', '<script>' + js + '</script>');
const { VirtualConsole } = require('jsdom');
const vc = new VirtualConsole();
const errors = [];
vc.on('jsdomError', e => errors.push(e.message.split(String.fromCharCode(10))[0]));
const dom = new JSDOM(html, { runScripts: 'dangerously', virtualConsole: vc });
const { window } = dom;
const doc = window.document;
const $ = (id) => doc.getElementById(id);
const out = () => $('out').textContent;
function click(el) { el.dispatchEvent(new window.MouseEvent('click', { bubbles: true })); }
function type(id, v) {
  const el = $(id); el.value = String(v);
  el.dispatchEvent(new window.Event('input', { bubbles: true }));
}
const goBtn = (n) => doc.querySelector('.step.on [data-go="' + n + '"]');

(async function(){
  await new Promise(r => setTimeout(r, 60));
  ok('ein shgiaot bizman ha teina', errors.length === 0, errors.join(' | '));

  ok('ha mount hitmale levad', doc.getElementById('osher-gap').innerHTML.length > 2000,
     doc.getElementById('osher-gap').innerHTML.length + ' chars');
  ok('ha mount mesuman k muchan', doc.getElementById('osher-gap').getAttribute('data-ready') === '1');
  ok('shlav 1 galui', !!doc.querySelector('.step.on[data-step="1"]'));
  ok('3 kartisei bchira', doc.querySelectorAll('.pick').length === 3);
  ok('2 shurot yeladim nitzru', doc.querySelectorAll('.kidrow').length === 2);
  ok('ein hagdarot mustarot', !doc.querySelector('details.adv'));

  console.log('--- maslul male, im milui yadani ---');
  click(doc.querySelector('.pick[data-goal="kids"]'));
  ok('shlav 2', !!doc.querySelector('.step.on[data-step="2"]'));
  var ages = doc.querySelectorAll('.kAge');
  ok('ein brirot mechdal la gilim', ages[0].value === '' && ages[1].value === '');
  click(goBtn('3'));
  ok('bli milui lo ovrim', !!doc.querySelector('.step.on[data-step="2"]'));
  [].forEach.call(ages, function(a, i){ a.value = i ? '9' : '4';
    a.dispatchEvent(new window.Event('input', { bubbles: true })); });
  ok('gam perChild ve targetAge reikim', $('perChild').value === '' && $('targetAge').value === '');
  type('perChild', 600000); type('targetAge', 20);
  click(goBtn('3'));
  ok('shlav 3', !!doc.querySelector('.step.on[data-step="3"]'));
  type('save', 900); type('has', 0); type('exp', 18695);
  click(goBtn('4'));
  ok('shlav 4', !!doc.querySelector('.step.on[data-step="4"]'));
  ok('yesh totzaa', out().length > 200, out().length + ' chars');
  ok('yesh graf', !!doc.querySelector('#out .chart svg'));
  ok('yesh ariach hero', !!doc.querySelector('#out .tile.hero'));
  ['NaN', 'Infinity', 'undefined'].forEach(b => ok('ein ' + b, !$('out').innerHTML.includes(b)));
  type('save', 9000);
  ok('idkun chai oved', out().includes('אתם בדרך'), out().slice(0, 30));

  console.log('--- boot kaful lo shover ---');
  const before = doc.getElementById('osher-gap').innerHTML.length;
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  ok('kria shniya lo mochekt et ha matzav',
     doc.getElementById('osher-gap').innerHTML.length === before);

  ok('ha itzuv mesugnan l tokh ha mount', css.split('#osher-gap').length - 1 > 40,
     (css.split('#osher-gap').length - 1) + ' boRRim mesugnanim');
  ok('yesh ipus negged ha tavnit', css.indexOf('appearance:none') > 0);
  ok('ha machshvon mele et ha masach', css.indexOf('min-height:100vh') > 0);
  var bg = doc.body.style.background.replace(/\s/g, '').toLowerCase();
  ok('ha reka shel ha daf nitzba krem',
     bg.indexOf('f4f0e9') >= 0 || bg.indexOf('rgb(244,240,233)') >= 0, doc.body.style.background);
  ok('ha machshvon mishtachrer me ha mechola shel Elementor',
     css.indexOf('margin-inline:calc(50% - 50vw)') > 0);
  ok('bli glila ofkit', css.indexOf('overflow-x:clip') > 0);
  ok('gova ha masach ha katan b nayad (svh)', css.indexOf('min-height:100svh') > 0);
  ok('ha remazim nir'+'im k remazim', css.indexOf('::placeholder') > 0);
  console.log('');
  console.log('SOF: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
