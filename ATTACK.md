You are an adversarial auditor. Your job is to BREAK this calculator, not to praise it.
Work in the current directory. Read every file: engine.js, page.html, test.js, plan.test.js, dom.test.js.
Write and RUN your own code to prove each claim. Do not report anything you have not executed.

## What the product is

A Hebrew (RTL) financial goal-gap calculator for an Israeli financial advisory firm.
The user enters a goal and a date, plus how much they actually set aside per month.
The page returns: required monthly, where they will actually land, the gap, when they
will really reach the goal, and a verdict: ON_TRACK / LATE / NEVER.
It is a lead-generation page for paid Facebook/Instagram traffic. Pain is intentional
and approved by the owner. Dishonest or wrong numbers are NOT acceptable.

## The model and its stated assumptions

- Net return 6.2% per year = 7% nominal minus 0.8% management fees. Nominal values, no inflation.
- Monthly compounding: i = annual/12, n = years*12. Ordinary annuity (end of period).
- Emergency fund is deliberately modelled with ZERO return (cash), on purpose.
- Three goal types: children (each child a separate goal with its own horizon),
  financial freedom (monthly desired income / 4% withdrawal -> required capital),
  and a free-form goal where the user supplies the amount and the horizon.
- For children, the contribution is split across children in proportion to each
  child's share of total required monthly, then each child gets its own verdict.

## Numbers I believe are correct. Verify each one independently with your own code.

At 6.2% net:
- monthlyNeeded(400,000 , 15y)   = 1,352
- futureValue(900/mo , 15y)      = 266,246
- yearsToReach(400,000 , 900/mo) = 19.3 years
- monthlyNeeded(600,000 , 20y)   = 1,268
- children aged 4 / 9 / 14, 600,000 each at age 20: 1,835 / 3,182 / 6,900, total 11,917
- splitting 900/mo across those three: 139 / 240 / 521
- delay table for 400,000: 25y=560, 20y=845, 15y=1,352, 10y=2,414, 5y=5,704
- one child 600,000: start at age 0 = 1,268, age 5 = 2,028, age 10 = 3,622, age 15 = 8,556
- emergency fund 3 months of 18,695 = 56,085; at 1,000/mo = 57 months exposed
- shock 30,000 as a loan at 9% over 36 months = 954/mo, 4,344 interest
- financial freedom: 8,000/mo wanted / 4% = 2,400,000 capital

## Two bugs already found and fixed. Do not re-report these; DO verify the fixes hold.

1. The children total was computed as one lump goal on the longest horizon, giving
   5,504 instead of 11,917. Fixed via childrenPlan().
2. The regret line and the tiles disagreed (5,504 vs 11,917), and "10 years ago" is
   meaningless for a 4-year-old. Replaced with "from the day they were born".

## Attack these, in priority order

1. **Math.** Re-derive every formula from first principles with an independent
   implementation (your own, in any language) and a brute-force month-by-month
   simulation. Compare against engine.js. Check: annuity timing (begin vs end of
   period), the `existing` lump sum growth, yearsToReach's closed form against
   simulation, the proportional split, rounding and accumulated drift, whether
   totals equal the sum of their parts anywhere a total is displayed.
2. **Verdict boundaries.** ON_TRACK vs LATE vs NEVER. Is the `years + 1/12`
   tolerance defensible or does it mislabel? Can a user be ON_TRACK while the
   displayed gap is positive, or LATE with a zero gap? Any state where the chip
   contradicts the tiles?
3. **Inputs.** Negative, zero, empty, non-numeric, 1e9, 0.5 children ages, decimals,
   age above target age, target age 0, horizon 0, pasted text, leading zeros,
   Hebrew digits, very large monthly. Does anything render Infinity, NaN, undefined,
   null, "-0", or a nonsense number on screen? Drive page.html in jsdom with real
   events to prove it (jsdom is installed; see dom.test.js for the harness).
4. **Event order and display conditions.** On a previous calculator of ours, all
   three critical bugs were in input handling, listener registration order and
   display conditions, and none were in the formulas. Hunt specifically there.
   Is the first keystroke ever swallowed? Does state leak across tab switches
   (a value from the children tab affecting the freedom tab, or stale output
   remaining after a switch)? Does removing a child mid-edit corrupt anything?
5. **Honesty and defensibility.** Every number shown must be derivable from a
   stated assumption. Flag anything presented as fact that is actually an assumption,
   anything where the wording overstates what the math supports, and any claim that
   a regulator or an ad platform reviewer could call misleading. The page must not
   imply certainty about returns.
6. **Build quality.** Dead code, unused variables, duplicated logic between the
   children path and the single-goal path, accessibility (RTL, labels, contrast,
   keyboard), mobile layout at 360px, and anything that will break when this HTML
   is pasted into WordPress/Elementor.

## Output format

A numbered list, most severe first. For each: SEVERITY (critical/major/minor),
the file and line, what is wrong, the exact reproduction (inputs and the command or
snippet you ran), the observed vs expected value, and the minimal fix.
Then a short section listing what you verified as CORRECT.
If you find no critical bug, say so plainly. Do not invent findings to seem useful.
