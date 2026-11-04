/* בונה את גרסת ההפצה מתוך page.html, שהוא מקור האמת היחיד.
   מפצל אוטומטית ולא בהעתקה ידנית, כדי שהגרסה החיה לא תסטה מהגרסה שנבדקה.

   הפלט ב-dist/:
     gap.css    הסגנון
     gap.js     המנוע + השלד + הממשק, הכל בקובץ אחד
     index.html דף תצוגה מקדימה עצמאי

   🔴 למה זה בנוי כך: וורדפרס משחית JavaScript שיש בו <div> או & בתוך מחרוזת.
   קובץ חיצוני לא עובר את העיבוד הזה כלל, ולכן כל ה-HTML נבנה מתוך gap.js
   ובוורדפרס נשארות שלוש שורות בלי שום תגית שאפשר לשבור. */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'page.html');
const DIST = path.join(__dirname, 'docs');
const MOUNT = 'osher-gap';

const html = fs.readFileSync(SRC, 'utf8');
const engine = fs.readFileSync(path.join(__dirname, 'engine.js'), 'utf8');

function between(s, open, close, label) {
  const i = s.indexOf(open);
  const j = s.indexOf(close, i + open.length);
  if (i < 0 || j < 0) throw new Error('לא נמצא ' + label);
  return s.slice(i + open.length, j);
}

const css = between(html, '<style>', '</style>', 'style');

/* גוף הדף, בלי תגיות ה-script */
let body = between(html, '<body>', '</body>', 'body');
body = body.replace(/<script[\s\S]*?<\/script>/g, '').trim();

/* קוד הממשק: ה-IIFE האחרון */
const scripts = html.match(/<script>([\s\S]*?)<\/script>/g) || [];
if (!scripts.length) throw new Error('לא נמצא סקריפט ממשק');
const ui = scripts[scripts.length - 1].replace(/^<script>/, '').replace(/<\/script>$/, '').trim();

/* בדיקות שפיות על הפיצול */
if (css.length < 1000) throw new Error('ה-CSS קצר מדי, הפיצול נכשל');
if (body.indexOf('data-step="4"') < 0) throw new Error('חסר שלב 4 בשלד');
if (ui.indexOf('OSHER_ENGINE') < 0) throw new Error('קוד הממשק לא מצא את המנוע');
if (ui.indexOf('<script') >= 0) throw new Error('תגית script נשארה בקוד הממשק');

fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, 'gap.css'), css.trim() + '\n', 'utf8');

const bundle = [
  '/* מחשבון הפער, אושר פיננסי. נבנה אוטומטית מ-page.html. אין לערוך ידנית. */',
  '(function(){',
  '  var MOUNT_ID = ' + JSON.stringify(MOUNT) + ';',
  '  var SKELETON = ' + JSON.stringify(body) + ';',
  '  function boot(){',
  '    var host = document.getElementById(MOUNT_ID);',
  '    if(!host){ return; }',
  '    if(host.getAttribute("data-ready") === "1"){ return; }',
  '    host.setAttribute("data-ready", "1");',
  '    host.innerHTML = SKELETON;',
  '    start();',
  '  }',
  '',
  engine.trim(),
  '',
  '  function start(){',
  ui,
  '  }',
  '',
  '  if(document.readyState === "loading"){',
  '    document.addEventListener("DOMContentLoaded", boot);',
  '  } else { boot(); }',
  '})();',
  ''
].join('\n');

fs.writeFileSync(path.join(DIST, 'gap.js'), bundle, 'utf8');

const preview = [
  '<!DOCTYPE html>',
  '<html lang="he" dir="rtl">',
  '<head>',
  '<meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width,initial-scale=1">',
  '<title>כמה כסף חסר לכם</title>',
  '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@300;400;500;600&display=swap" rel="stylesheet">',
  '<link rel="stylesheet" href="./gap.css">',
  '</head>',
  '<body>',
  '<div id="' + MOUNT + '"></div>',
  '<script src="./gap.js"></script>',
  '</body>',
  '</html>',
  ''
].join('\n');

fs.writeFileSync(path.join(DIST, 'index.html'), preview, 'utf8');

const kb = (f) => Math.round(fs.statSync(path.join(DIST, f)).size / 1024) + ' KB';
console.log('נבנה ב-docs/');
console.log('  gap.css    ' + kb('gap.css'));
console.log('  gap.js     ' + kb('gap.js'));
console.log('  index.html ' + kb('index.html'));
