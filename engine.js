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
