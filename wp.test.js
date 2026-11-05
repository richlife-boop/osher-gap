/* בדיקה על הדף החי בוורדפרס.
   🔴 הכלל אצלנו: content.raw תקין אינו הוכחה. ההשחתה קורית ברינדור,
   ולכן בודקים את ה-HTML שהשרת באמת מגיש. */
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

let pass = 0, fail = 0;
const ok = (n, c, x) => {
  if (c) { pass++; console.log('  OK   ' + n + (x ? '  [' + x + ']' : '')); }
  else { fail++; console.log('  FAIL ' + n + (x ? '  [' + x + ']' : '')); }
};

const h = fs.readFileSync(path.join(__dirname, 'wp-live.html'), 'utf8');

console.log('--- shalosh ha shurot sardu ---');
ok('div osher-gap kayam', /id=["']osher-gap["']/.test(h));
ok('script gap.js kayam', /src=["']https:\/\/richlife-boop\.github\.io\/osher-gap\/gap\.js["']/.test(h));
ok('link gap.css kayam', /href=["']https:\/\/richlife-boop\.github\.io\/osher-gap\/gap\.css["']/.test(h));

console.log('--- shalosh ha hashchatot ha yeduot ---');
ok('ein & she hafach l amp#038', !/gap\.(js|css)[^"']*&#0?38;/.test(h));
const seg = h.slice(Math.max(0, h.indexOf('osher-gap') - 500), h.indexOf('gap.js') + 300);
const pBefore = /<p>\s*<script/.test(seg);
const pAfter = /<\/p>\s*<script/.test(seg);
ok('ein <p> muzrak saviv ha script', !pBefore && !pAfter);
ok('ein <br> muzrak', !/<br\s*\/?>/.test(seg), seg.length + ' chars nivdaku');

console.log('--- ha daf atzmo ---');
ok('ha daf lo 404', !/404/.test(h.slice(0, 2000)) || h.includes('osher-gap'));
ok('ha daf b canvas (bli header shel ha theme)', !/<header/i.test(h));
ok('yesh viewport l nayad', /name=["']viewport["']/.test(h));

console.log('--- hartzat ha machshvon al ha HTML shel ha daf ha chai ---');
const js = fs.readFileSync(path.join(__dirname, 'live', 'gap.js'), 'utf8');
/* מנטרלים את הסקריפטים של וורדפרס עצמה. סקריפט האימוג'י שלה דורש canvas
   ש-jsdom לא מספק, וזאת מגבלה של כלי הבדיקה ולא באג בדף. */
const stripped = h
  .replace(/<script(?![^>]*richlife-boop)[^>]*>[\s\S]*?<\/script>/g, '')
  .replace(/<script(?![^>]*richlife-boop)[^>]*\/>/g, '');
const inlined = stripped.replace(
  /<script[^>]*src=["']https:\/\/richlife-boop\.github\.io\/osher-gap\/gap\.js["'][^>]*><\/script>/,
  '<script>' + js + '</script>');
ok('ha hazraka hitzlicha', inlined !== stripped);
ok('scriptim shel WP nutralu', (stripped.match(/<script/g) || []).length === 1,
   (h.match(/<script/g) || []).length + ' -> ' + (stripped.match(/<script/g) || []).length);

const errs = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errs.push(e.message.split(String.fromCharCode(10))[0]));
const dom = new JSDOM(inlined, { runScripts: 'dangerously', virtualConsole: vc });
const { window } = dom, doc = window.document;
const $ = id => doc.getElementById(id);
const click = el => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
const go = n => doc.querySelector('.step.on [data-go="' + n + '"]');

(async function () {
  await new Promise(r => setTimeout(r, 90));
  const real = errs.filter(e => !/checklist|elementor/i.test(e));
  ok('ein shgiaot shelanu', real.length === 0, real.join(' | '));
  ok('ha machshvon nivna b tokh ha daf', $('osher-gap').innerHTML.length > 2000,
     $('osher-gap').innerHTML.length + ' chars');
  ok('3 kartisei bchira', doc.querySelectorAll('.pick').length === 3);
  click(doc.querySelector('.pick[data-goal="kids"]'));
  click(go('3')); click(go('4'));
  const t = $('out').textContent;
  ok('ha totzaa muatzevet', t.length > 200, t.length + ' chars');
  ok('yesh graf', !!doc.querySelector('#out .chart svg'));
  ok('ein NaN', !$('out').innerHTML.includes('NaN'));
  ok('ein Infinity', !$('out').innerHTML.includes('Infinity'));
  console.log('  dugma: ' + t.slice(0, 55));

  console.log('');
  console.log('SOF: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
