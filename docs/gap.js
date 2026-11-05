/* מחשבון הפער, אושר פיננסי. נבנה אוטומטית מ-page.html. אין לערוך ידנית. */
(function(){
  var MOUNT_ID = "osher-gap";
  var SKELETON = "<div class=\"wrap\">\r\n\r\n  <div class=\"bar\"><i class=\"on\"></i><i></i><i></i><i></i></div>\r\n\r\n  <section class=\"step on\" data-step=\"1\">\r\n    <p class=\"stepno\">שלב 1 מתוך 4</p>\r\n    <h1>מה אתם רוצים <span class=\"mark\">להשיג</span></h1>\r\n    <p class=\"lede\">בוחרים אחד. אפשר לשנות בהמשך.</p>\r\n    <div class=\"picks\">\r\n      <button class=\"pick\" type=\"button\" data-goal=\"kids\">\r\n        <b>לתת לילדים</b><span>דירה וחתונה, לכל ילד</span></button>\r\n      <button class=\"pick\" type=\"button\" data-goal=\"freedom\">\r\n        <b>להפסיק לעבוד</b><span>כסף שנכנס כל חודש גם בלי עבודה</span></button>\r\n      <button class=\"pick\" type=\"button\" data-goal=\"custom\">\r\n        <b>משהו אחר</b><span>דירה גדולה יותר, עסק, כל דבר</span></button>\r\n    </div>\r\n  </section>\r\n\r\n  <section class=\"step\" data-step=\"2\">\r\n    <p class=\"stepno\">שלב 2 מתוך 4</p>\r\n    <h1 id=\"h2title\">הפרטים</h1>\r\n    <p class=\"lede\" id=\"h2lede\"></p>\r\n\r\n    <div class=\"panel\">\r\n      <div id=\"pane-kids\">\r\n        <div class=\"kidhead\"><span>שם הילד</span><span>בן כמה</span><span></span></div>\r\n        <div id=\"kids\"></div>\r\n        <button class=\"addkid\" id=\"addKid\" type=\"button\">הוספת ילד</button>\r\n        <details class=\"adv\">\r\n          <summary><span id=\"advSum\"></span> <u>לשינוי</u></summary>\r\n          <div class=\"row\">\r\n            <div><label for=\"perChild\">כמה כסף לכל ילד</label>\r\n              <input id=\"perChild\" type=\"number\" inputmode=\"numeric\" value=\"600000\"></div>\r\n            <div><label for=\"targetAge\">עד איזה גיל</label>\r\n              <input id=\"targetAge\" type=\"number\" inputmode=\"numeric\" value=\"20\"></div>\r\n          </div>\r\n        </details>\r\n      </div>\r\n\r\n      <div id=\"pane-freedom\" hidden>\r\n        <div class=\"fld\"><label for=\"wantMonthly\">כמה כסף תרצו לקבל כל חודש בלי לעבוד</label>\r\n          <input id=\"wantMonthly\" type=\"number\" inputmode=\"numeric\" value=\"8000\"></div>\r\n        <div class=\"fld row\">\r\n          <div><label for=\"myAge\">בני כמה אתם היום</label>\r\n            <input id=\"myAge\" type=\"number\" inputmode=\"numeric\" value=\"40\"></div>\r\n          <div><label for=\"freedomAge\">ומאיזה גיל</label>\r\n            <input id=\"freedomAge\" type=\"number\" inputmode=\"numeric\" value=\"55\"></div>\r\n        </div>\r\n      </div>\r\n\r\n      <div id=\"pane-custom\" hidden>\r\n        <div class=\"fld\"><label for=\"cName\">מה אתם רוצים</label>\r\n          <input id=\"cName\" type=\"text\" value=\"שדרוג דירה\"></div>\r\n        <div class=\"fld row\">\r\n          <div><label for=\"cAmount\">כמה זה יעלה</label>\r\n            <input id=\"cAmount\" type=\"number\" inputmode=\"numeric\" value=\"400000\"></div>\r\n          <div><label for=\"cYears\">בתוך כמה שנים</label>\r\n            <input id=\"cYears\" type=\"number\" inputmode=\"numeric\" value=\"10\"></div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"nav\"><button class=\"btn\" type=\"button\" data-go=\"3\">הבא</button>\r\n      <button class=\"back\" type=\"button\" data-go=\"1\">חזרה</button></div>\r\n  </section>\r\n\r\n  <section class=\"step\" data-step=\"3\">\r\n    <p class=\"stepno\">שלב 3 מתוך 4</p>\r\n    <h1>ומה יש לכם <span class=\"mark\">היום</span></h1>\r\n    <p class=\"lede\">שלוש שאלות אחרונות.</p>\r\n\r\n    <div class=\"panel\">\r\n      <div class=\"fld\"><label for=\"save\">כמה אתם חוסכים כל חודש</label>\r\n        <input id=\"save\" type=\"number\" inputmode=\"numeric\" value=\"900\"></div>\r\n      <div class=\"fld\"><label for=\"has\">כמה כסף יש לכם בצד היום</label>\r\n        <input id=\"has\" type=\"number\" inputmode=\"numeric\" value=\"0\">\r\n        <p class=\"hint\">הכל ביחד. גם מה שחסכתם למטרה וגם מה ששמור למקרה שההכנסה נעצרת.</p></div>\r\n      <div class=\"fld\"><label for=\"exp\">כמה הבית מוציא כל חודש</label>\r\n        <input id=\"exp\" type=\"number\" inputmode=\"numeric\" value=\"18695\"></div>\r\n    </div>\r\n\r\n    <div class=\"nav\"><button class=\"btn\" type=\"button\" data-go=\"4\">לראות כמה חסר</button>\r\n      <button class=\"back\" type=\"button\" data-go=\"2\">חזרה</button></div>\r\n  </section>\r\n\r\n  <section class=\"step\" data-step=\"4\">\r\n    <p class=\"stepno\">שלב 4 מתוך 4</p>\r\n    <h1>כמה כסף <span class=\"mark\">חסר</span></h1>\r\n    <div id=\"out\"></div>\r\n    <div class=\"card ctabox\">\r\n      <h2 id=\"ctaTitle\">רוצים לסגור את זה?</h2>\r\n      <a class=\"btn wa\" id=\"waBtn\" href=\"#\" target=\"_blank\" rel=\"noopener\">לדבר איתנו בוואטסאפ</a>\r\n      <button class=\"btn ghost\" type=\"button\" id=\"openForm\">או להשאיר פרטים ונחזור אליכם</button>\r\n\r\n      <form id=\"leadForm\" hidden>\r\n        <div class=\"fld\"><label for=\"lName\">איך קוראים לכם</label>\r\n          <input id=\"lName\" type=\"text\" autocomplete=\"name\"></div>\r\n        <div class=\"fld\"><label for=\"lPhone\">טלפון</label>\r\n          <input id=\"lPhone\" type=\"tel\" inputmode=\"tel\" autocomplete=\"tel\"></div>\r\n        <div class=\"fld\"><label for=\"lMail\">אימייל</label>\r\n          <input id=\"lMail\" type=\"email\" inputmode=\"email\" autocomplete=\"email\"></div>\r\n        <label class=\"chk\"><input id=\"lOk\" type=\"checkbox\"><span>מאשר/ת שתחזרו אליי</span></label>\r\n        <p class=\"err\" id=\"lErr\" hidden></p>\r\n        <button class=\"btn\" type=\"submit\" id=\"lSend\">שליחה</button>\r\n      </form>\r\n\r\n      <div id=\"thanks\" hidden>\r\n        <p class=\"done\">קיבלנו. נחזור אליכם.</p>\r\n      </div>\r\n    </div>\r\n    <div class=\"nav\"><button class=\"back\" type=\"button\" data-go=\"3\">חזרה</button></div>\r\n    <div class=\"assump\">\r\n      הכסף גדל ב-6.2% בשנה, אחרי דמי ניהול. לא חישבנו עליית מחירים. הכסף למקרה שההכנסה נעצרת שמור במזומן ולא גדל. זה מחשבון כללי.\r\n    </div>\r\n  </section>\r\n\r\n</div>";
  function boot(){
    var host = document.getElementById(MOUNT_ID);
    if(!host){ return; }
    if(host.getAttribute("data-ready") === "1"){ return; }
    host.setAttribute("data-ready", "1");
    host.innerHTML = SKELETON;
    start();
  }

/* מנוע פער היעדים, אושר פיננסי.
   אותו מנוע ריבית דריבית של child-home-fund ו-loan-consolidation, בכיוון שלישי.
   הנחות ברירת מחדל שאושרו: תשואה 7% נומינלי פחות 0.8% דמי ניהול = 6.2% נטו.
   ערכים נומינליים. מחשבון כללי.

   🔴 כלל העל שנגזר מביקורת קודקס (04/11/26):
   פסק הדין נגזר מהמספרים שמוצגים על המסך, ולא ממסלול חישוב נפרד.
   שלושה באגים אמיתיים נבעו כולם מכך שהתג והאריח חושבו בשני מסלולים. */

var DEF = { nominal: 0.07, fee: 0.008, perChild: 600000, childTargetAge: 20, swr: 0.04 };
var EPS = 0.01;          // שקל אחד חלקי מאה. מתחת לזה אין משמעות כספית
var MAX_MONTHS = 1200;   // 100 שנה. מעל זה הקלט אינו תרחיש אמיתי

function netRate(nominal, fee) {
  return (nominal == null ? DEF.nominal : nominal) - (fee == null ? DEF.fee : fee);
}

/* 🔴 שער קלט. אופק שאין בו אף מועד הפקדה, או אופק אסטרונומי, אינו מחזיר מספר אלא שגיאה. */
function months(years) {
  if (!isFinite(years)) return null;
  var n = Math.round(years * 12);
  if (n < 1 || n > MAX_MONTHS) return null;
  return n;
}

function fvFactor(annualNet, years) {
  var n = months(years);
  if (n === null) return null;
  var i = annualNet / 12;
  if (i === 0) return n;
  return (Math.pow(1 + i, n) - 1) / i;
}

/* ההפקדה החודשית הדרושה כדי להגיע לסכום בתוך אופק */
function monthlyNeeded(goal, years, annualNet) {
  var f = fvFactor(annualNet, years);
  if (f === null || !(f > 0)) return null;
  return goal / f;
}

/* צמיחת סכום קיים לאורך האופק */
function grow(existing, years, annualNet) {
  var n = months(years);
  if (n === null) return null;
  return (existing || 0) * Math.pow(1 + annualNet / 12, n);
}

/* ההפקדה הדרושה כשכבר יש סכום בצד. 🔴 בלי זה הדף דורש כסף שכבר נצבר. */
function monthlyNeededWith(goal, years, annualNet, existing) {
  var g = grow(existing, years, annualNet);
  if (g === null) return null;
  var remaining = goal - g;
  if (remaining <= EPS) return 0;
  return monthlyNeeded(remaining, years, annualNet);
}

function futureValue(monthly, years, annualNet, existing) {
  var f = fvFactor(annualNet, years), g = grow(existing, years, annualNet);
  if (f === null || g === null) return null;
  return g + (monthly || 0) * f;
}

/* תוך כמה שנים מגיעים ליעד. null = לא מגיעים.
   🔴 שלושה מסלולים שהביקורת חשפה: סכום קיים שצומח לבד, תשואה אפס, והמסלול הרגיל. */
function yearsToReach(goal, monthly, annualNet, existing) {
  var i = annualNet / 12, e = existing || 0, p = monthly || 0;
  if (!isFinite(goal) || !isFinite(p) || !isFinite(e)) return null;
  if (e >= goal - EPS) return 0;
  if (p <= 0) {
    if (i <= 0 || e <= 0) return null;         // אין הפקדה ואין מה שיצמח
    var nLump = Math.log(goal / e) / Math.log(1 + i);
    return isFinite(nLump) ? nLump / 12 : null;
  }
  if (i === 0) return (goal - e) / p / 12;     // תשואה אפס, חלוקה פשוטה
  var x = (goal * i + p) / (e * i + p);
  if (!(x > 1)) return null;
  var n = Math.log(x) / Math.log(1 + i);
  return isFinite(n) ? n / 12 : null;
}

/* יעד שמתייקר. 🔴 אין קיצור דרך של השוואת ריביות.
   הביקורת הוכיחה שהפקדה גדולה מספיק מנצחת יעד שצומח מהר יותר, ולכן מסמלצים. */
function yearsToReachGrowing(goal, growthRate, monthly, annualNet, existing) {
  var i = annualNet / 12, g = growthRate / 12, p = monthly || 0;
  var bal = existing || 0, target = goal;
  if (bal >= target - EPS) return 0;
  for (var n = 1; n <= MAX_MONTHS; n++) {
    bal = bal * (1 + i) + p;
    target = target * (1 + g);
    if (bal >= target - EPS) return n / 12;
  }
  return null;
}

/* פסק דין על יעד בודד. השלד: לחשב מה יהיה, ולגזור את התג מזה. */
function verdict(goal, years, monthly, annualNet, existing, goalGrowth) {
  var n = months(years);
  if (n === null || !(goal > 0)) {
    return { state: 'INVALID', monthlyNeeded: null, willHave: null,
             shortfall: null, yearsToReach: null, yearsLate: null };
  }
  var growing = (goalGrowth != null && isFinite(goalGrowth) && goalGrowth !== 0);
  var goalAtEnd = growing ? goal * Math.pow(1 + goalGrowth / 12, n) : goal;
  var willHave = futureValue(monthly, years, annualNet, existing);
  var need = monthlyNeededWith(goalAtEnd, years, annualNet, existing);
  var t = growing
    ? yearsToReachGrowing(goal, goalGrowth, monthly, annualNet, existing)
    : yearsToReach(goal, monthly, annualNet, existing);

  if (willHave === null || !isFinite(willHave)) {
    return { state: 'INVALID', monthlyNeeded: null, willHave: null,
             shortfall: null, yearsToReach: null, yearsLate: null };
  }

  /* 🔴 התג נגזר מהמספר שמוצג, לא מחישוב מקביל. */
  var state;
  if (willHave >= goalAtEnd - EPS) state = 'ON_TRACK';
  else if (t === null) state = growing ? 'NEVER_RUNAWAY' : 'NEVER_ZERO';
  else state = 'LATE';

  return {
    state: state,
    monthlyNeeded: need,
    willHave: willHave,
    goalAtEnd: goalAtEnd,
    shortfall: Math.max(0, goalAtEnd - willHave),
    yearsToReach: t,
    yearsLate: (t === null) ? null : Math.max(0, t - years)
  };
}

/* יעד ילדים: כל ילד עם האופק שלו */
function childrenGoal(children, annualNet, perChild, targetAge) {
  perChild = perChild == null ? DEF.perChild : perChild;
  targetAge = targetAge == null ? DEF.childTargetAge : targetAge;
  var rows = children.map(function (c) {
    var amount = c.amount == null ? perChild : c.amount;
    var years = targetAge - c.age;
    return {
      name: c.name || ('ילד בן ' + c.age),
      age: c.age,
      yearsLeft: years,
      amount: amount,
      monthlyNeeded: monthlyNeeded(amount, years, annualNet)
    };
  });
  var finite = rows.filter(function (r) { return r.monthlyNeeded !== null; });
  return {
    rows: rows,
    totalGoal: rows.reduce(function (s, x) { return s + x.amount; }, 0),
    totalMonthly: finite.length === rows.length
      ? rows.reduce(function (s, x) { return s + x.monthlyNeeded; }, 0)
      : null
  };
}

/* 🔴 תוכנית ילדים. לא סכום אחד על אופק אחד.
   כל ילד הוא יעד בפני עצמו, ולכן הנדרש בחודש הוא *סכום* הדרישות.
   הסכום הקיים מחולק לפי חלקו של הילד ביעד הכולל (ולא לפי הדרישה, שאחרת החישוב מעגלי),
   ואז הדרישה של כל ילד היא על מה שנשאר לו בלבד. */
function childrenPlan(children, monthlySave, annualNet, existing, perChild, targetAge) {
  perChild = perChild == null ? DEF.perChild : perChild;
  targetAge = targetAge == null ? DEF.childTargetAge : targetAge;
  var have = existing || 0;

  var base = children.map(function (c) {
    var amount = c.amount == null ? perChild : c.amount;
    return { name: c.name || ('ילד בן ' + c.age), age: c.age,
             yearsLeft: targetAge - c.age, amount: amount };
  });
  var totalGoal = base.reduce(function (s, x) { return s + x.amount; }, 0);

  /* הסכום הקיים לפי חלקו של הילד ביעד */
  base.forEach(function (r) {
    r.haveShare = totalGoal > 0 ? have * (r.amount / totalGoal) : 0;
    r.monthlyNeeded = monthlyNeededWith(r.amount, r.yearsLeft, annualNet, r.haveShare);
  });

  var valid = base.filter(function (r) { return r.monthlyNeeded !== null; });
  var totalNeeded = valid.reduce(function (s, r) { return s + r.monthlyNeeded; }, 0);

  /* ההפקדה בפועל מתחלקת לפי מידת הדחיפות שנותרה */
  var rows = base.map(function (r) {
    var share = totalNeeded > 0 && r.monthlyNeeded !== null ? r.monthlyNeeded / totalNeeded : 0;
    var alloc = (monthlySave || 0) * share;
    var fv = futureValue(alloc, r.yearsLeft, annualNet, r.haveShare);
    var t = yearsToReach(r.amount, alloc, annualNet, r.haveShare);
    var state;
    if (r.monthlyNeeded === null || fv === null) state = 'INVALID';
    else if (fv >= r.amount - EPS) state = 'ON_TRACK';
    else if (t === null) state = 'NEVER_ZERO';
    else state = 'LATE';
    return {
      name: r.name, age: r.age, yearsLeft: r.yearsLeft, amount: r.amount,
      monthlyNeeded: r.monthlyNeeded, allocated: alloc, haveShare: r.haveShare,
      willHave: fv, shortfall: fv === null ? null : Math.max(0, r.amount - fv),
      yearsToReach: t, yearsLate: (t === null) ? null : Math.max(0, t - r.yearsLeft),
      state: state
    };
  });

  var worst = 'ON_TRACK';
  rows.forEach(function (r) {
    if (r.state === 'INVALID') { if (worst !== 'NEVER_ZERO') worst = 'INVALID'; }
    else if (r.state === 'NEVER_ZERO') worst = 'NEVER_ZERO';
    else if (r.state === 'LATE' && worst === 'ON_TRACK') worst = 'LATE';
  });
  var late = rows.filter(function (r) { return r.yearsLate != null; })
                 .map(function (r) { return r.yearsLate; });

  return {
    rows: rows,
    totalGoal: totalGoal,
    monthlyNeeded: totalNeeded,
    willHave: rows.reduce(function (s, r) { return s + (r.willHave || 0); }, 0),
    shortfall: rows.reduce(function (s, r) { return s + (r.shortfall || 0); }, 0),
    state: worst,
    maxYearsLate: late.length ? Math.max.apply(null, late) : null
  };
}

/* חופש כלכלי: מהכנסה חודשית רצויה להון דרוש */
function freedomGoal(monthlyWanted, swr) {
  swr = swr == null ? DEF.swr : swr;
  return { capitalNeeded: (monthlyWanted * 12) / swr, swr: swr };
}

/* מחיר הדחייה: אותו יעד, לפי מתי מתחילים */
function delayTable(goal, annualNet, horizons) {
  return (horizons || [25, 20, 15, 10, 5]).map(function (y) {
    return { years: y, monthly: monthlyNeeded(goal, y, annualNet) };
  });
}

/* מספר החרטה: כמה אותו יעד היה דורש אם היו מתחילים מוקדם יותר */
function regret(goal, years, annualNet, yearsEarlier) {
  var now = monthlyNeeded(goal, years, annualNet);
  var then = monthlyNeeded(goal, years + (yearsEarlier || 10), annualNet);
  return {
    now: now, then: then,
    extra: (now === null || then === null) ? null : now - then,
    pct: (now === null || !then) ? null : (now / then - 1)
  };
}

/* 🔴 עיגול לתצוגה בשיטת השארית הגדולה, כדי שהשורות יסתכמו בדיוק לסכום המוצג. */
function roundToTotal(values) {
  var floors = values.map(function (v) { return Math.floor(v); });
  var target = Math.round(values.reduce(function (s, v) { return s + v; }, 0));
  var diff = target - floors.reduce(function (s, v) { return s + v; }, 0);
  var order = values.map(function (v, idx) { return { idx: idx, frac: v - Math.floor(v) }; })
                    .sort(function (a, b) { return b.frac - a.frac; });
  for (var k = 0; k < diff && k < order.length; k++) floors[order[k].idx] += 1;
  return floors;
}

/* קרן חירום. 🔴 מנוע נפרד: מזומן, בלי תשואה.
   להריץ אותה דרך monthlyNeeded עם 6.2% זאת טעות מקצועית, כי בבלת"ם מוכרים בהפסד.
   היחידה של הפלט היא חודשי חשיפה, לא שנים של איחור. */
function emergencyFund(monthlyExpense, monthsCover, have, monthlySave) {
  monthsCover = monthsCover == null ? 3 : monthsCover;
  have = have || 0;
  var goal = monthlyExpense * monthsCover;
  var missing = Math.max(0, goal - have);
  var exposedMonths = missing === 0 ? 0 : (monthlySave > 0 ? Math.ceil(missing / monthlySave) : null);
  return {
    goal: goal, have: have, missing: missing,
    coveredMonths: monthlyExpense > 0 ? have / monthlyExpense : 0,
    exposedMonths: exposedMonths,
    state: missing === 0 ? 'COVERED' : (exposedMonths === null ? 'NEVER_ZERO' : 'EXPOSED')
  };
}

/* מחיר ההיעדר: בלת"ם שממומן בהלוואה */
function shockAsLoan(amount, annualRate, monthsCount) {
  var i = annualRate / 12;
  var pay = i === 0 ? amount / monthsCount : amount * i / (1 - Math.pow(1 + i, -monthsCount));
  return { monthly: pay, total: pay * monthsCount, interest: pay * monthsCount - amount };
}

/* ===== סדרות לגרף: המצוי מול הרצוי =====
   המסלול בפועל מול המסלול שהיעד דורש. השטח ביניהם הוא הפער. */

function balanceAt(monthly, monthsElapsed, annualNet, existing) {
  var i = annualNet / 12, n = monthsElapsed;
  if (n <= 0) return existing || 0;
  var f = (i === 0) ? n : (Math.pow(1 + i, n) - 1) / i;
  return (existing || 0) * Math.pow(1 + i, n) + (monthly || 0) * f;
}

/* יעד בודד. מחזיר נקודה לכל חודש, עד 360 נקודות. */
function seriesSingle(goal, years, monthly, annualNet, existing) {
  var total = months(years);
  if (total === null) return null;
  var need = monthlyNeededWith(goal, years, annualNet, existing);
  if (need === null) return null;
  var step = Math.max(1, Math.ceil(total / 360));
  var pts = [];
  for (var n = 0; n <= total; n += step) {
    pts.push({
      t: n / 12,
      actual: balanceAt(monthly, n, annualNet, existing),
      required: balanceAt(need, n, annualNet, existing)
    });
  }
  if (pts[pts.length - 1].t < total / 12) {
    pts.push({ t: total / 12,
               actual: balanceAt(monthly, total, annualNet, existing),
               required: balanceAt(need, total, annualNet, existing) });
  }
  return { points: pts, goal: goal, years: total / 12 };
}

/* ילדים. כל ילד תורם עד התאריך שלו, ואחריו הסכום שלו נשאר ולא ממשיך לצמוח בהפקדה.
   🔴 לא ממצעים אופקים. מסכמים מסלולים. */
function seriesChildren(plan, annualNet) {
  var valid = plan.rows.filter(function (r) { return months(r.yearsLeft) !== null; });
  if (!valid.length) return null;
  var totalMonths = Math.max.apply(null, valid.map(function (r) { return months(r.yearsLeft); }));
  var step = Math.max(1, Math.ceil(totalMonths / 360));
  var pts = [];
  for (var n = 0; n <= totalMonths; n += step) {
    var a = 0, q = 0;
    valid.forEach(function (r) {
      var own = months(r.yearsLeft);
      var m = Math.min(n, own);                         // אחרי התאריך שלו מפסיקים להפקיד עבורו
      a += balanceAt(r.allocated, m, annualNet, r.haveShare);
      q += balanceAt(r.monthlyNeeded, m, annualNet, r.haveShare);
    });
    pts.push({ t: n / 12, actual: a, required: q });
  }
  return { points: pts, goal: plan.totalGoal, years: totalMonths / 12 };
}

var API = {
  DEF: DEF, EPS: EPS, MAX_MONTHS: MAX_MONTHS,
  netRate: netRate, months: months, fvFactor: fvFactor,
  monthlyNeeded: monthlyNeeded, monthlyNeededWith: monthlyNeededWith, grow: grow,
  futureValue: futureValue, yearsToReach: yearsToReach, yearsToReachGrowing: yearsToReachGrowing,
  verdict: verdict, childrenGoal: childrenGoal, childrenPlan: childrenPlan,
  freedomGoal: freedomGoal, delayTable: delayTable, regret: regret,
  roundToTotal: roundToTotal, balanceAt: balanceAt, seriesSingle: seriesSingle, seriesChildren: seriesChildren, emergencyFund: emergencyFund, shockAsLoan: shockAsLoan
};

if (typeof module !== 'undefined') module.exports = API;
if (typeof window !== 'undefined') window.OSHER_ENGINE = API;

  function start(){
(function(){
  var E = window.OSHER_ENGINE;
  function $(id){ return document.getElementById(id); }
  var R = E.netRate();
  var MAX_KIDS = 6, EF_MONTHS = 3;
  var goal = 'kids', step = 1, kidCount = 0;
  var LAST = { gap: null, need: null, what: '' };

  /* 🔴 הרקע הקרם יושב על המחשבון, והמחשבון גבוה רק כגובה התוכן.
     בלי זה נשאר פס לבן מתחתיו ומצדדיו, כי הרקע של דף וורדפרס לבן.
     זאת ההתערבות היחידה שלנו מחוץ לגבולות המחשבון, והיא מכוונת. */
  (function paintPage(){
    try {
      var CREAM = '#f4f0e9';
      document.documentElement.style.background = CREAM;
      document.body.style.background = CREAM;
      document.body.style.margin = '0';
    } catch(ignore) {}
  })();
  /* 🔴 הוובהוק של תרחיש 9528256, שיוצר ליד אמיתי בפייברי בסטטוס "1) חדש".
     לא הוובהוק של רשימות הדיוור. ליד שנוחת ברשימת מיילים הוא ליד שאף אחד לא מתקשר אליו. */
  var HOOK = 'https://hook.eu2.make.com/vkkcs5er32scebp61kcdh47cl5ray9ih';
  var SOFI = '972552767144';

  function nis(n){
    if(n === null || n === undefined || !isFinite(n)) return null;
    return Math.round(n).toLocaleString('he-IL');
  }
  function num(id, def){ var v = parseFloat($(id).value); return isFinite(v) ? v : (def || 0); }

  /* משך זמן בשפה שאפשר לתפוס. 98 חודשים זה מספר, 8 שנים זה תחושה. */
  function dur(months){
    if(months == null || !isFinite(months)) return null;
    var m = Math.round(months);
    if(m < 1) return 'פחות מחודש';
    if(m === 1) return 'חודש';
    if(m < 24) return m + ' חודשים';
    var y = Math.round(m / 12);
    return y + ' שנים';
  }
  /* שנה קלנדרית. "ב-2051 במקום ב-2042" מובן מיד, "באיחור של 9.3 שנים" לא. */
  var NOW_YEAR = new Date().getFullYear();
  function yearIn(years){ return NOW_YEAR + Math.round(years); }

  function goStep(n){
    step = n;
    Array.prototype.forEach.call(document.querySelectorAll('.step'), function(s){
      s.classList.toggle('on', s.getAttribute('data-step') === String(n));
    });
    Array.prototype.forEach.call(document.querySelectorAll('.bar i'), function(b, k){
      b.classList.toggle('on', k < n);
    });
    var host = document.getElementById('osher-gap');
    if(host) host.classList.toggle('wide', n === 4);
    if(n === 4) render();
    window.scrollTo(0, 0);
  }

  var TITLES = {
    kids:    { t: 'ספרו לנו על הילדים', l: 'גיל אחד לכל ילד. השם לא חובה.' },
    freedom: { t: 'מה זה חופש כלכלי בשבילכם', l: 'בכמה כסף בחודש, לא בסכום הגדול.' },
    custom:  { t: 'מה אתם רוצים', l: 'אתם כותבים כמה זה עולה ומתי.' }
  };

  Array.prototype.forEach.call(document.querySelectorAll('.pick'), function(b){
    b.addEventListener('click', function(){
      goal = b.getAttribute('data-goal');
      ['kids','freedom','custom'].forEach(function(g){ $('pane-' + g).hidden = (g !== goal); });
      $('h2title').textContent = TITLES[goal].t;
      $('h2lede').textContent = TITLES[goal].l;
      goStep(2);
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-go]'), function(b){
    b.addEventListener('click', function(){ goStep(parseInt(b.getAttribute('data-go'), 10)); });
  });

  function syncAddBtn(){ $('addKid').style.display = (kidCount >= MAX_KIDS) ? 'none' : 'block'; }
  function addKid(age){
    if(kidCount >= MAX_KIDS) return;
    kidCount++;
    var d = document.createElement('div');
    d.className = 'kidrow';
    d.innerHTML = '<input type="text" class="kName" placeholder="לא חובה" value="">' +
      '<input type="number" inputmode="numeric" class="kAge" value="' + age + '">' +
      '<button type="button" class="kDel" aria-label="הסרת ילד" title="הסרה">&times;</button>';
    $('kids').appendChild(d);
    d.querySelector('.kDel').addEventListener('click', function(){
      d.remove(); kidCount--; syncAddBtn();
    });
    syncAddBtn();
  }
  function readKids(){
    return Array.prototype.map.call(document.querySelectorAll('.kidrow'), function(r, i){
      var a = parseFloat(r.querySelector('.kAge').value);
      var n = r.querySelector('.kName').value.trim();
      return { age: isFinite(a) ? a : 0, name: n || ('ילד ' + (i + 1)) };
    });
  }
  $('addKid').addEventListener('click', function(){ addKid(8); });
  addKid(4); addKid(9);

  /* השורה שמחליפה את המילה "הגדרות": אומרת מה מונח, בלי שצריך לפתוח כלום */
  function syncAdv(){
    $('advSum').textContent = 'חישבנו ' + num('perChild', 600000).toLocaleString('he-IL') +
      ' ש"ח לכל ילד, עד גיל ' + num('targetAge', 20) + '.';
  }
  $('perChild').addEventListener('input', syncAdv);
  $('targetAge').addEventListener('input', syncAdv);
  syncAdv();

  function tile(k, v, u, bad, hero){
    if(v === null) return '';
    return '<div class="tile' + (bad ? ' bad' : '') + (hero ? ' hero' : '') + '">' +
      '<div class="k">' + k + '</div><div class="v">' + v +
      ' <span class="u">' + (u || '') + '</span></div></div>';
  }
  function chipFor(state, lateLabel){
    if(state === 'ON_TRACK') return '<span class="chip ok"><i class="dot"></i>אתם בדרך</span>';
    if(state === 'LATE') return '<span class="chip late"><i class="dot"></i>' + lateLabel + '</span>';
    if(state === 'INVALID') return '<span class="chip ok"><i class="dot"></i>אין מה לחשב</span>';
    return '<span class="chip off"><i class="dot"></i>לא תגיעו</span>';
  }
  function invalidCard(){
    return '<div class="card">' + chipFor('INVALID') +
      '<p class="note">צריך סכום גדול מאפס, ומספר שנים בין שנה למאה.</p></div>';
  }

  var CH = { w: 680, h: 290, l: 56, rr: 88, t: 16, b: 32 };
  function short(n){
    var a = Math.abs(n);
    if(a >= 1000000) return (n/1000000).toFixed(a >= 10000000 ? 0 : 1).replace(/\.0$/,'') + 'M';
    if(a >= 1000) return Math.round(n/1000) + 'K';
    return String(Math.round(n));
  }
  function chartHtml(ser){
    if(!ser || !ser.points || ser.points.length < 2) return '';
    var pts = ser.points, maxV = 0;
    pts.forEach(function(p){ maxV = Math.max(maxV, p.required, p.actual); });
    if(!(maxV > 0)) return '';
    maxV *= 1.06;
    var iw = CH.w - CH.l - CH.rr, ih = CH.h - CH.t - CH.b;
    var X = function(t){ return CH.l + (t / ser.years) * iw; };
    var Y = function(v){ return CH.t + ih - (v / maxV) * ih; };
    var pa = '', pr = '';
    pts.forEach(function(p, k){
      pa += (k ? 'L' : 'M') + X(p.t).toFixed(1) + ' ' + Y(p.actual).toFixed(1);
      pr += (k ? 'L' : 'M') + X(p.t).toFixed(1) + ' ' + Y(p.required).toFixed(1);
    });
    var band = pr;
    for(var k = pts.length - 1; k >= 0; k--){
      band += 'L' + X(pts[k].t).toFixed(1) + ' ' + Y(pts[k].actual).toFixed(1);
    }
    band += 'Z';
    var g = '';
    for(var q = 0; q <= 4; q++){
      var yt = maxV * q / 4;
      g += '<line x1="' + CH.l + '" y1="' + Y(yt).toFixed(1) + '" x2="' + (CH.l + iw) +
        '" y2="' + Y(yt).toFixed(1) + '" stroke="#e8e2d8" stroke-width="1"/>' +
        '<text x="' + (CH.l - 8) + '" y="' + (Y(yt) + 4).toFixed(1) +
        '" text-anchor="end" font-size="11" fill="#585b4d">' + short(yt) + '</text>';
    }
    var sx = Math.max(1, Math.ceil(ser.years / 6));
    for(var yy = 0; yy <= Math.floor(ser.years); yy += sx){
      g += '<text x="' + X(yy).toFixed(1) + '" y="' + (CH.h - 11) +
        '" text-anchor="middle" font-size="11" fill="#585b4d">' + yy + '</text>';
    }
    var last = pts[pts.length - 1];
    return '<div class="card"><div class="chart" dir="ltr">' +
      '<svg viewBox="0 0 ' + CH.w + ' ' + CH.h + '" preserveAspectRatio="xMidYMid meet" role="img" ' +
      'aria-label="גרף שמשווה כמה כסף יהיה לכם מול כמה כסף צריך, לאורך השנים">' + g +
      '<path d="' + band + '" fill="#9b3a2f" fill-opacity="0.14"/>' +
      '<path d="' + pr + '" fill="none" stroke="#9b3a2f" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="' + pa + '" fill="none" stroke="#3a3a31" stroke-width="2" stroke-linejoin="round"/>' +
      '<line class="cross" x1="0" y1="' + CH.t + '" x2="0" y2="' + (CH.t + ih) +
      '" stroke="#585b4d" stroke-width="1" stroke-dasharray="3 3" opacity="0"/>' +
      '<circle class="dotR" r="4" fill="#9b3a2f" stroke="#fff" stroke-width="2" opacity="0"/>' +
      '<circle class="dotA" r="4" fill="#3a3a31" stroke="#fff" stroke-width="2" opacity="0"/>' +
      '<text x="' + (X(last.t) + 7) + '" y="' + (Y(last.required) + 4).toFixed(1) +
      '" font-size="11.5" fill="#9b3a2f" font-weight="500">צריך</text>' +
      '<text x="' + (X(last.t) + 7) + '" y="' + (Y(last.actual) + 4).toFixed(1) +
      '" font-size="11.5" fill="#3a3a31" font-weight="500">יהיה לכם</text>' +
      '<rect class="hit" x="' + CH.l + '" y="' + CH.t + '" width="' + iw + '" height="' + ih +
      '" fill="transparent"/></svg><div class="tip" hidden></div></div>' +
      '<div class="legend"><span><b style="background:#3a3a31"></b>מה שיהיה לכם</span>' +
      '<span><b style="background:#9b3a2f"></b>מה שצריך</span></div></div>';
  }
  function wireChart(ser){
    var box = $('out').querySelector('.chart');
    if(!box || !ser) return;
    var svg = box.querySelector('svg'), tip = box.querySelector('.tip');
    var cross = svg.querySelector('.cross'), dR = svg.querySelector('.dotR'), dA = svg.querySelector('.dotA');
    var pts = ser.points, iw = CH.w - CH.l - CH.rr, ih = CH.h - CH.t - CH.b, maxV = 0;
    pts.forEach(function(p){ maxV = Math.max(maxV, p.required, p.actual); });
    maxV *= 1.06;
    function show(e){
      var r = svg.getBoundingClientRect();
      var cx = e.touches ? e.touches[0].clientX : e.clientX;
      var tt = Math.max(0, Math.min(ser.years, ((cx - r.left) / r.width * CH.w - CH.l) / iw * ser.years));
      var idx = Math.max(0, Math.min(pts.length - 1, Math.round(tt / ser.years * (pts.length - 1))));
      var p = pts[idx], px = CH.l + (p.t / ser.years) * iw;
      cross.setAttribute('x1', px); cross.setAttribute('x2', px); cross.setAttribute('opacity', '1');
      dR.setAttribute('cx', px); dR.setAttribute('cy', CH.t + ih - (p.required / maxV) * ih); dR.setAttribute('opacity', '1');
      dA.setAttribute('cx', px); dA.setAttribute('cy', CH.t + ih - (p.actual / maxV) * ih); dA.setAttribute('opacity', '1');
      tip.hidden = false;
      tip.innerHTML = '<div class="ty">שנה ' + Math.round(p.t) + '</div>' +
        '<div><i style="background:#9b3a2f"></i>צריך: ' + nis(p.required) + '</div>' +
        '<div><i style="background:#3a3a31"></i>יהיה לכם: ' + nis(p.actual) + '</div>' +
        '<div class="tg">חסר: ' + nis(Math.max(0, p.required - p.actual)) + '</div>';
      tip.style.left = Math.min(78, Math.max(2, px / CH.w * 100)) + '%';
    }
    function hide(){
      cross.setAttribute('opacity','0'); dR.setAttribute('opacity','0'); dA.setAttribute('opacity','0');
      tip.hidden = true;
    }
    svg.addEventListener('mousemove', show);
    svg.addEventListener('mouseleave', hide);
    svg.addEventListener('touchstart', show, { passive: true });
    svg.addEventListener('touchmove', show, { passive: true });
  }

  function render(){
    /* 🔴 מאפסים קודם. בלי זה יציאה מוקדמת משאירה מספרים מחישוב קודם
       והלקוח שולח לסופי נתון שגוי. */
    LAST = { gap: null, need: null, what: '' };
    var save = num('save'), have = num('has'), exp = num('exp');
    var ef = E.emergencyFund(exp, EF_MONTHS, have, save);
    /* אותו כסף לא יכול לעשות שתי עבודות.
       מה שקרן החירום תופסת אינו זמין ליעד. */
    var forGoal = Math.max(0, have - ef.goal);

    var out = '';
    if(ef.missing > 0){
      out += '<div class="card">' +
        (ef.state === 'NEVER_ZERO'
          ? '<span class="chip off"><i class="dot"></i>אם ההכנסה תיעצר, תחזיקו ' + dur(ef.coveredMonths) + '</span>'
          : '<span class="chip late"><i class="dot"></i>אם ההכנסה תיעצר, תחזיקו ' + dur(ef.coveredMonths) + '</span>') +
        '<div class="tiles">' + tile('צריך לשלושה חודשים בלי הכנסה', nis(ef.goal), 'ש"ח') +
        tile('חסר', nis(ef.missing), 'ש"ח', true) +
        (ef.state === 'NEVER_ZERO'
          ? tile('יהיה לכם בעוד', 'אף פעם', '', true)
          : tile('יהיה לכם בעוד', dur(ef.exposedMonths), '')) + '</div>' +
        '<p class="note">זה הכסף שמחזיק את המשפחה אם ההכנסה נעצרת. עד שהוא שם, הוא לא שייך למטרה שלכם.</p></div>';
    }

    var ser = null;
    if(goal === 'kids'){
      var tAge = num('targetAge', 20), per = num('perChild', 600000);
      var kids = readKids();
      var live = kids.filter(function(k){ return tAge - k.age > 0; });
      var over = kids.filter(function(k){ return tAge - k.age <= 0; });
      if(!live.length){ $('out').innerHTML = out + invalidCard(); syncCta(); return; }
      var pl = E.childrenPlan(live, save, R, forGoal, per, tAge);
      if(pl.state === 'INVALID' || !isFinite(pl.monthlyNeeded)){
        $('out').innerHTML = out + invalidCard(); syncCta(); return;
      }
      /* לא "באיחור" סתם. מי מהילדים, ובאיזה גיל הוא באמת יקבל. */
      var worst = null;
      pl.rows.forEach(function(r){
        if(r.state === 'ON_TRACK') return;
        if(r.yearsToReach === null){ worst = worst || r; return; }
        if(!worst || worst.yearsToReach === null) { worst = r; return; }
        if(r.yearsToReach - r.yearsLeft > worst.yearsToReach - worst.yearsLeft) worst = r;
      });
      var kidLbl = worst
        ? (worst.yearsToReach === null
            ? worst.name + ' לא יקבל'
            : worst.name + ' יקבל בגיל ' + Math.round(worst.age + worst.yearsToReach) +
              ' במקום ' + tAge)
        : 'באיחור';
      out += '<div class="card">' + chipFor(pl.state, kidLbl) + '<div class="tiles">' +
        tile('חסר לכם', nis(pl.shortfall), 'ש"ח', pl.shortfall > 0, true) +
        tile('צריך כל חודש', nis(pl.monthlyNeeded), 'ש"ח') +
        tile('אתם חוסכים', nis(save), 'ש"ח') + '</div></div>';
      LAST = { gap: pl.shortfall, need: pl.monthlyNeeded, what: 'לילדים שלי' };
      ser = E.seriesChildren(pl, R);
      out += chartHtml(ser);
      out += '<div class="card"><h2>לפי ילד</h2><table><thead><tr><th>הילד</th>' +
        '<th class="num">עוד שנים</th><th class="num">צריך כל חודש</th><th class="num">יקבל בגיל</th>' +
        '</tr></thead><tbody>';
      var shown = E.roundToTotal(pl.rows.map(function(r){ return r.monthlyNeeded; }));
      var mx = Math.max.apply(null, pl.rows.map(function(r){ return r.monthlyNeeded; }));
      pl.rows.forEach(function(r, ri){
        var when = (r.state === 'ON_TRACK') ? tAge
          : (r.yearsToReach === null ? 'לא יקבל' : Math.round(r.age + r.yearsToReach));
        out += '<tr' + (r.monthlyNeeded === mx ? ' class="hot"' : '') + '><td>' + r.name + '</td>' +
          '<td class="num">' + r.yearsLeft + '</td><td class="num">' + shown[ri].toLocaleString('he-IL') +
          '</td><td class="num">' + when + '</td></tr>';
      });
      out += '</tbody></table>';
      var fromBirth = pl.rows.reduce(function(s, r){ return s + E.monthlyNeeded(r.amount, tAge, R); }, 0);
      out += '<p class="note">אם הייתם מתחילים ביום שהם נולדו, זה היה ' + nis(fromBirth) +
        ' כל חודש. היום זה ' + nis(pl.monthlyNeeded) + '.</p>';
      if(over.length){
        out += '<p class="note">' + over.map(function(k){ return k.name; }).join(', ') +
          ' כבר גדולים מהגיל שבחרתם, ולכן לא נכנסו לחשבון.</p>';
      }
      out += '</div>';
    } else {
      var amount, years;
      if(goal === 'freedom'){
        amount = E.freedomGoal(num('wantMonthly', 8000)).capitalNeeded;
        years = num('freedomAge', 55) - num('myAge', 40);
      } else {
        amount = num('cAmount'); years = num('cYears');
      }
      var v = E.verdict(amount, years, save, R, forGoal, null);
      if(v.state === 'INVALID'){ $('out').innerHTML = out + invalidCard(); syncCta(); return; }
      /* "תגיעו ב-2051 במקום ב-2042" מובן מיד. "באיחור של 9.3 שנים" לא. */
      var lbl = (v.yearsToReach != null)
        ? 'תגיעו ב-' + yearIn(v.yearsToReach) + ' במקום ב-' + yearIn(years)
        : 'לא תגיעו';
      out += '<div class="card">' + chipFor(v.state, lbl) + '<div class="tiles">' +
        tile('חסר לכם', nis(v.shortfall), 'ש"ח', v.shortfall > 0, true) +
        tile('צריך כל חודש', nis(v.monthlyNeeded), 'ש"ח') +
        tile(goal === 'freedom' ? 'צריך לאסוף' : 'אתם חוסכים',
             nis(goal === 'freedom' ? amount : save), 'ש"ח') + '</div></div>';
      LAST = { gap: v.shortfall, need: v.monthlyNeeded,
               what: goal === 'freedom' ? 'כדי להפסיק לעבוד' : 'ליעד שלי' };
      ser = E.seriesSingle(amount, years, save, R, forGoal);
      out += chartHtml(ser);
      out += '<div class="card"><h2>אותו סכום, לפי מתי מתחילים</h2><table><thead><tr>' +
        '<th>בעוד כמה שנים</th><th class="num">צריך כל חודש</th></tr></thead><tbody>';
      E.delayTable(amount, R, [25, 20, 15, 10, 5]).forEach(function(d){
        if(d.monthly === null) return;
        out += '<tr' + (d.years === 5 ? ' class="hot"' : '') + '><td>' + d.years +
          '</td><td class="num">' + nis(d.monthly) + '</td></tr>';
      });
      var g = E.regret(amount, years, R, 10);
      out += '</tbody></table>' +
        (g.then === null ? '' : '<p class="note">אם הייתם מתחילים לפני 10 שנים, זה היה ' + nis(g.then) +
          ' כל חודש. היום זה ' + nis(g.now) + '.</p>') + '</div>';
    }
    $('out').innerHTML = out;
    wireChart(ser);
    syncCta();
  }

  /* ===== שתי ההנעות לפעולה =====
     וואטסאפ לסופי, והשארת פרטים כמו ליד רגיל. */

  /* ההודעה כתובה בקול של הלקוח, כי זה מה שהוא שולח.
     🔴 לא לכתוב אותה בגוף שלישי, הלקוח רואה בדיוק את הטקסט הזה. */
  function waText(){
    var t = 'היי, עשיתי את המחשבון באתר.';
    if(LAST.gap !== null && isFinite(LAST.gap) && LAST.gap > 0){
      t += ' יצא לי שחסר ' + nis(LAST.gap) + ' ש"ח ' + LAST.what + '.';
    }
    if(LAST.need !== null && isFinite(LAST.need) && LAST.need > 0){
      t += ' ושצריך ' + nis(LAST.need) + ' ש"ח כל חודש.';
    }
    return t + ' אשמח להבין מה עושים מכאן.';
  }
  function syncCta(){
    $('waBtn').setAttribute('href', 'https://wa.me/' + SOFI + '?text=' + encodeURIComponent(waText()));
    if(LAST.gap !== null && isFinite(LAST.gap) && LAST.gap > 0){
      $('ctaTitle').textContent = 'רוצים לסגור את ה' + nis(LAST.gap) + ' האלה?';
    } else {
      $('ctaTitle').textContent = 'רוצים לוודא שאתם באמת בדרך?';
    }
  }

  $('openForm').addEventListener('click', function(){
    $('leadForm').hidden = false;
    $('openForm').hidden = true;
    $('lName').focus();
  });

  function clean(s){ return String(s || '').trim(); }
  function validPhone(p){
    var d = clean(p).replace(/[^0-9]/g, '');
    if(d.length < 9) return false;
    if(d.length > 15) return false;
    return true;
  }

  $('leadForm').addEventListener('submit', function(e){
    e.preventDefault();
    var name = clean($('lName').value), phone = clean($('lPhone').value), mail = clean($('lMail').value);
    var err = '';
    if(name.length < 2) err = 'צריך שם.';
    else if(!validPhone(phone)) err = 'צריך מספר טלפון תקין.';
    else if(mail.indexOf('@') < 1 || mail.indexOf('.') < 0) err = 'צריך אימייל תקין.';
    else if(!$('lOk').checked) err = 'צריך לאשר שנחזור אליכם.';
    if(err){
      $('lErr').textContent = err;
      $('lErr').hidden = false;
      return;
    }
    $('lErr').hidden = true;
    $('lSend').disabled = true;
    $('lSend').textContent = 'שולח...';

    var q = {};
    try {
      location.search.replace(/^\?/, '').split('&').forEach(function(kv){
        var i = kv.indexOf('=');
        if(i > 0) q[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1));
      });
    } catch(ignore) {}

    var gapR = (LAST.gap === null || !isFinite(LAST.gap)) ? '' : String(Math.round(LAST.gap));
    var needR = (LAST.need === null || !isFinite(LAST.need)) ? '' : String(Math.round(LAST.need));
    var GOALNAME = { kids: 'ילדים', freedom: 'להפסיק לעבוד', custom: 'יעד אישי' };

    /* שלושת הראשונים הם מה שהתרחיש ממפה לפייברי:
       name→accountname, phone→telephone1, email→emailaddress1.
       השאר נשלח לצורך ההקשר, ומחכה לעדכון שדה התיאור בתרחיש. */
    var summary = 'מחשבון הפער, ' + (GOALNAME[goal] || goal) +
      (gapR ? ', חסר ' + Number(gapR).toLocaleString('he-IL') : '') +
      (needR ? ', צריך ' + Number(needR).toLocaleString('he-IL') + ' בחודש' : '');

    /* 🔴 התרחיש כותב בתיאור הליד: "ליד מטופס וובינר · ref: {{ref}} · {{page_url}}".
       לכן ההקשר נכנס דרך ref, ואין צורך לגעת באוטומציה החיה שמשרתת גם את טופס הוובינר.
       summary נשלח גם הוא, ויתפוס ברגע שהתיאור יעודכן שם. */
    var data = {
      name: name, phone: phone, email: mail,
      ref: summary,
      summary: summary,
      source: 'מחשבון הפער',
      goal_type: GOALNAME[goal] || goal,
      gap: gapR, monthly_needed: needR,
      monthly_saving: String(num('save')), has_today: String(num('has')),
      monthly_expense: String(num('exp')),
      page_url: location.href,
      /* ברירת מחדל כדי שהלידים האלה יהיו מזוהים בדוחות גם בלי UTM,
         כי התנועה מגיעה ממאני צאט ולא מקמפיין ממומן. */
      utm_source: q.utm_source || 'money-gap',
      utm_medium: q.utm_medium || 'calculator',
      utm_campaign: q.utm_campaign || 'money-gap-calculator',
      utm_content: q.utm_content || ''
    };

    /* urlencoded ולא JSON: זאת בקשה פשוטה בלי preflight, ולכן היא עוברת
       גם כשהדף יושב על דומיין אחר. זה גם הפורמט שאומת חי מול התרחיש. */
    var body = Object.keys(data).map(function(k){
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    }).join('&');

    var done = function(){
      $('leadForm').hidden = true;
      $('thanks').hidden = false;
    };
    try {
      fetch(HOOK, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: body
      }).then(done, done);
    } catch(ex) { done(); }
  });

  /* שינוי ערך אחרי שראו את התוצאה מעדכן אותה מיד.
     🔴 שדות הטופס מוחרגים, אחרת כל הקשה בשם מריצה חישוב מחדש. */
  document.addEventListener('input', function(e){
    if(step !== 4) return;
    if(!e.target || !e.target.matches('input')) return;
    if(e.target.closest('#leadForm')) return;
    render();
  });
})();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
