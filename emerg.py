HOTZAA = 18_695   # LMS 2024, hotzaa chodshit memutzaat
print("=== 1. gudel keren chirum ===")
for m in [3,4,6]:
    print(f"  {m} chodashim hotzaa = {HOTZAA*m:>9,} sh")

print("\n=== 2. kama zman ad she hi mukhana (b'mezumanim, bli tsua!) ===")
for target_m in [3,6]:
    goal = HOTZAA*target_m
    print(f"  yaad {goal:,} ({target_m} chodashim):")
    for save in [500,1000,2000,3000]:
        months = goal/save
        print(f"    mafnim {save:>5,}/chodesh -> {months:>5.0f} chodashim = {months/12:>4.1f} shanim CHASUF")

print("\n=== 3. ha pa'ar ha amiti: mi she yesh lo ktzat ===")
goal = HOTZAA*3
for have in [0, 10_000, 30_000, 56_085]:
    rem = max(0, goal-have)
    print(f"  yesh {have:>7,} -> chaser {rem:>7,} -> b'1,000/chodesh od {rem/1000:>4.0f} chodashim chasuf")

print("\n=== 4. machir ha'heseder ha chaser: baltam she hofech l'halvaa ===")
def pmt_loan(P, annual, months):
    i = annual/12
    return P*i/(1-(1+i)**(-months))
for P in [15_000, 30_000, 50_000]:
    for rate in [0.09, 0.12]:
        for mo in [36]:
            pay = pmt_loan(P, rate, mo)
            tot = pay*mo
            print(f"  baltam {P:>6,} b'ribit {rate*100:>2.0f}% l'{mo} chod: {pay:>6,.0f}/chodesh, sach {tot:>7,.0f}, RIBIT {tot-P:>6,.0f}")
