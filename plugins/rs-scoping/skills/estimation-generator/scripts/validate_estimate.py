#!/usr/bin/env python3
"""Deterministic validator for a filled IntuitioLabs Estimation Template.

Machine-checks the studio's estimation rules (SOP §3/§4/§4a) so they cannot decay into
prose-only guidance. Run after fill_template.py; iterate on the INPUTS until this passes.

    python validate_estimate.py "Project - Estimation.xlsx"

Checks (FAIL = exit 1):
  1. Description format  — every Development feature row: 2-4 user-perspective bullets
                           + exactly one '• Technical -' line.
  2. Description floors  — every feature row cites a PRD trace_id (e.g. 'PRD 6.A.2');
                           user bullets are not a name-echo (>=60% of their content
                           tokens re-used from the title) and not generic-verb-only
                           (browse/manage/use/view/access with nothing specific); the
                           '• Technical -' line names a noun-mechanism (service/store/
                           SDK/algorithm).
  3. Granularity trigger — no role cell > 5 MD (the cap is a DECOMPOSITION TRIGGER,
                           not a ceiling to size down to); a cell of exactly 5 MD
                           requires a 'spike' tag in the row's description.
  4. Task grain          — one row = one session-sized deliverable: no single row > ~6
                           MD across FE+BE+AI, and rows sharing one PRD trace_id may
                           not sum > ~6 MD in any one discipline — split into work-item
                           rows with their own sub-trace ids.
  5. FTE increments      — Plan allocations are multiples of 0.5; PM always 0.2;
                           Architect in {0.2, 0.25, 0.5, 0.75, 1}.
  6. Plan reconciliation — per role: Plan hours == Development man-days x 8, with the
                           per-role Buffer (row 84) as the exact filler (plan >= estimate).
  7. DevOps presence     — DevOps > 0 MD in Development and >= 1% of development hours.
  8. Duration realism    — staffed weeks + team peak inside the Pack §4.4 band for the
                           hour total; Summary durations == staffed week counts.
  9. Template integrity  — the 2026-07-03 formula repairs are present (guards against
                           filling an old, buggy template copy).
Margin is recomputed approximately and reported as a WARNING below 50% (the workbook's
own computed margin, opened in Excel/Sheets, stays authoritative).

These are FLOORS, not the bar: they make shortcuts visible (name-echo, missing trace,
generic-only verbs), they cannot certify substance. Descriptions must be inherited from
the PRD Section 10 description blocks — condensed, never authored from the row name to
satisfy this script.
"""
import re
import sys
import openpyxl

DEV, DES, PLAN, DET, SUM = "Development ", "Design ", "Plan", "Estimation-Detail", "Estimation-Summary"

ROLE_COLS = {"fe": "H", "be": "I", "ai": "J", "devops": "L", "analyst": "M", "pm": "N", "architect": "O"}
FEATURE_ROWS = range(6, 83)
OVERHEAD_ROWS = range(84, 92)
BUFFER_ROW = 84

# Plan development block: role row -> (Development column it must reconcile against)
PLAN_DEV = {"Architect": (26, "O"), "PM": (27, "N"), "React": (28, "H"), "AI engineer": (29, "J"),
            "Backend": (30, "I"), "QA": (31, "K"), "DevOps": (32, "L")}
PLAN_DEV_WEEKS = list("DEFGHIJKLMNO")           # 12 weeks
PLAN_DESIGN_ROWS = (19, 20, 21)
PLAN_DISC_ROWS = (11, 12, 13, 14)
PLAN_SHORT_WEEKS = list("DEFGHIJ")              # 7 weeks

ARCHITECT_FTES = {0.2, 0.25, 0.5, 0.75, 1.0}
PM_FTE = 0.2

# --- Description substance floors ---
TRACE_RE = re.compile(r"\bPRD\s*\d+(?:\.[A-Za-z0-9]+)+\b", re.I)   # e.g. 'PRD 6.A.2' / 'PRD 6.A.2.1'
SESSION_MD = 6          # ~ one session-sized deliverable; past this a row/feature is under-decomposed
NAME_ECHO_MAX = 0.6     # user bullets fail when >=60% of their content tokens come from the title

STOPWORDS = {"the", "and", "for", "with", "that", "this", "from", "into", "onto", "via", "are",
             "can", "will", "their", "them", "they", "its", "his", "her", "our", "your", "has",
             "have", "when", "then", "able", "ability", "abilities", "allow", "allows", "allowing",
             "user", "users", "member", "members", "employer", "employers", "admin", "admins",
             "role", "roles", "feature", "features", "each", "all", "any", "also", "own", "new"}
GENERIC_VERBS = {"browse", "browsing", "manage", "managing", "managed", "use", "using", "used",
                 "view", "viewing", "viewed", "access", "accessing", "accessed", "see", "seeing",
                 "navigate", "navigating", "handle", "handling", "interact", "interacting",
                 "open", "opening", "click", "clicking"}
MECH_HINTS = {"api", "apis", "sdk", "sdks", "service", "services", "microservice", "endpoint",
              "endpoints", "webhook", "webhooks", "websocket", "websockets", "socket", "queue",
              "queues", "worker", "workers", "cron", "job", "jobs", "cache", "redis", "database",
              "db", "postgres", "postgresql", "mysql", "sqlite", "dynamodb", "mongodb", "sql",
              "index", "elasticsearch", "opensearch", "algorithm", "model", "pipeline", "etl",
              "stream", "kafka", "oauth", "jwt", "sso", "saml", "cognito", "auth0", "stripe",
              "s3", "cdn", "cloudfront", "lambda", "firebase", "supabase", "graphql", "rest",
              "grpc", "middleware", "orm", "schema", "store", "bucket", "fcm", "apns", "twilio",
              "sendgrid", "llm", "rag", "embedding", "embeddings", "vector", "webrtc", "ffmpeg"}
# Vague objects that do not make a generic verb specific ('manage data', 'view the section').
VAGUE_NOUNS = {"data", "information", "item", "section", "page", "screen", "content", "detail",
               "thing", "stuff", "option", "functionality", "system", "platform", "module", "area"}
# Capitalised words that are NOT evidence of a named mechanism on the Technical line.
CAP_NOISE = {"technical", "standard", "basic", "simple", "custom", "normal", "typical", "general",
             "regular", "various", "the", "a", "an", "this", "that", "some", "core", "main"}


def _stem(t):
    if t.endswith("sses"):
        return t[:-2]
    if t.endswith("s") and not t.endswith("ss") and len(t) > 3:
        return t[:-1]
    return t


def _tokens(text):
    """Lower-cased, stopworded, crudely plural-stripped content tokens."""
    out = set()
    for raw in re.findall(r"[a-z0-9]+", text.lower()):
        if len(raw) < 3 or raw in STOPWORDS:
            continue
        out.add(_stem(raw))
    return out


def _row_trace(name, desc):
    m = TRACE_RE.search(desc) or TRACE_RE.search(name)
    return re.sub(r"\s+", " ", m.group(0).upper()) if m else None


def _has_mechanism(tech_line):
    """The '• Technical -' line must name a noun-mechanism (service/store/SDK/algorithm)."""
    m = re.match(r"•\s*Technical\s*[-–—:]\s*(.*)", tech_line)
    body = TRACE_RE.sub("", m.group(1) if m else tech_line)
    for w in re.findall(r"[A-Za-z][A-Za-z0-9]*", body):
        if w.lower() in MECH_HINTS:
            return True
        # proper noun / acronym / CamelCase (Cognito, JWT, DynamoDB) that isn't cap-noise
        if re.search(r"[A-Z]", w) and w.lower() not in CAP_NOISE and w.lower() not in GENERIC_VERBS:
            return True
    return False

# Pack §4.4: total hours -> (min weeks, max weeks, min peak, max peak)
DURATION_BANDS = [(200, 400, 3, 4, 4, 6), (400, 800, 5, 6, 6, 8), (800, 1500, 7, 10, 8, 10),
                  (1500, 2500, 10, 13, 10, 13), (2500, 3500, 13, 18, 13, 15),
                  (3500, float("inf"), 18, 30, 13, 30)]


def num(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return 0.0


class Report:
    def __init__(self):
        self.failures, self.warnings = [], []

    def fail(self, check, msg):
        self.failures.append((check, msg))

    def warn(self, check, msg):
        self.warnings.append((check, msg))


def check_descriptions(dev, rep):
    for r in FEATURE_ROWS:
        name = dev[f"D{r}"].value
        if not name or not str(name).strip():
            continue
        name = str(name)
        desc = str(dev[f"E{r}"].value or "")
        bullets = [b.strip() for b in re.split(r"[\n]|(?=•)", desc) if b.strip()]
        bullets = [b for b in bullets if b.startswith("•")]
        tech = [b for b in bullets if re.match(r"•\s*Technical\s*[-–—:]", b)]
        user = [b for b in bullets if b not in tech]
        where = f"'{name}' (Development E{r})"
        if not bullets:
            rep.fail("description", f"{where}: not bullet-formatted — needs 2-4 user bullets + one '• Technical -' line")
            continue
        if len(tech) != 1:
            rep.fail("description", f"{where}: needs exactly one '• Technical -' line (found {len(tech)})")
        elif not 2 <= len(user) <= 4:
            rep.fail("description", f"{where}: needs 2-4 user-perspective bullets (found {len(user)})")
        # Substance floors — passing shape does NOT mean these pass, and passing these
        # does not certify substance; they only make the known shortcuts visible.
        if not _row_trace(name, desc):
            rep.fail("trace", f"{where}: no PRD trace_id (e.g. 'PRD 6.A.2') on the row — every row must cite "
                              f"the PRD Section 10 row its description is inherited from")
        title_t = _tokens(TRACE_RE.sub("", name))
        user_t = _tokens(" ".join(TRACE_RE.sub("", b) for b in user))
        if user_t and title_t:
            echo = len(user_t & title_t) / len(user_t)
            if echo >= NAME_ECHO_MAX:
                rep.fail("name-echo", f"{where}: user bullets re-use {echo:.0%} of their content tokens from the "
                                      f"title — a restated name is not a description; inherit and condense the "
                                      f"PRD Section 10 description block for this trace_id")
        if user_t and not (user_t - title_t - GENERIC_VERBS - VAGUE_NOUNS):
            rep.fail("generic", f"{where}: bullets carry only generic verbs (browse/manage/use/view/access) plus "
                                f"the title — name the specific object, state, or mechanism the user acts on")
        if len(tech) == 1 and not _has_mechanism(tech[0]):
            rep.fail("technical", f"{where}: the '• Technical -' line names no noun-mechanism — name the "
                                  f"service/store/SDK/algorithm (e.g. 'Cognito auth', 'Postgres jobs table', "
                                  f"'S3 presigned upload')")


def check_granularity(dev, rep):
    for r in FEATURE_ROWS:
        name = dev[f"D{r}"].value
        if not name or not str(name).strip():
            continue
        desc = str(dev[f"E{r}"].value or "").lower()
        for role, col in ROLE_COLS.items():
            md = num(dev[f"{col}{r}"].value)
            if md > 5:
                rep.fail("granularity", f"'{name}' {role.upper()}={md:g} MD is over the 5-MD cell cap — the cap is a "
                                        f"decomposition trigger, not a ceiling to size down to: the row is "
                                        f"under-decomposed, split it into session-sized work-item rows (Development {col}{r})")
            elif md == 5 and "spike" not in desc:
                rep.fail("granularity", f"'{name}' {role.upper()}=5 MD but the row is not tagged 'spike' — 5 MD is reserved for discovery-needed rows (Development {col}{r})")


def check_grain(dev, rep):
    """One row = one session-sized deliverable (something one engineer builds and demos in a
    short stretch). Flags (a) any single row > SESSION_MD man-days across FE+BE+AI, and (b) rows
    sharing one exact PRD trace_id whose per-discipline sum exceeds SESSION_MD — that PRD feature
    is under-decomposed and must split into work-item rows carrying their own sub-trace ids."""
    groups = {}
    for r in FEATURE_ROWS:
        name = dev[f"D{r}"].value
        if not name or not str(name).strip():
            continue
        trace = _row_trace(str(name), str(dev[f"E{r}"].value or ""))
        groups.setdefault(trace or f"(untraced row {r})", []).append((r, str(name)))
    for trace, rows in groups.items():
        for r, name in rows:
            eng = sum(num(dev[f"{c}{r}"].value) for c in ("H", "I", "J"))
            if eng > SESSION_MD:
                rep.fail("grain", f"'{name}' (row {r}) totals {eng:g} MD across FE+BE+AI — not one session-sized "
                                  f"deliverable; split into work-item rows, each with its own sub-trace id")
        if len(rows) < 2:
            continue
        for role, col in ROLE_COLS.items():
            s = sum(num(dev[f"{col}{r}"].value) for r, _ in rows)
            if s > SESSION_MD:
                rep.fail("grain", f"{len(rows)} rows share trace {trace} and sum {s:g} MD in {role.upper()} — the PRD "
                                  f"feature is under-decomposed; split into named work-item rows with their own "
                                  f"sub-trace ids ({trace}.1, {trace}.2, …), one session-sized deliverable each")


def _fte_ok(v):
    return abs(v * 2 - round(v * 2)) < 1e-9  # multiple of 0.5


def check_fte(plan, rep):
    blocks = [("development", PLAN_DEV_WEEKS, {role: row for role, (row, _) in PLAN_DEV.items()}),
              ("design", PLAN_SHORT_WEEKS, {plan[f"C{r}"].value: r for r in PLAN_DESIGN_ROWS}),
              ("discovery", PLAN_SHORT_WEEKS, {plan[f"C{r}"].value: r for r in PLAN_DISC_ROWS})]
    for block, weeks, roles in blocks:
        for role, row in roles.items():
            role = str(role or "").strip()
            for col in weeks:
                v = num(plan[f"{col}{row}"].value)
                if v == 0:
                    continue
                where = f"Plan!{col}{row} ({block} · {role})"
                if role == "PM":
                    if abs(v - PM_FTE) > 1e-9:
                        rep.fail("fte", f"{where}: PM must always be 0.2 (found {v:g})")
                elif role == "Architect":
                    if not any(abs(v - a) < 1e-9 for a in ARCHITECT_FTES):
                        rep.fail("fte", f"{where}: Architect must be one of 0.2/0.25/0.5/0.75/1 (found {v:g})")
                elif not _fte_ok(v):
                    rep.fail("fte", f"{where}: allocation must be a multiple of 0.5 (found {v:g})")


def dev_role_md(dev, col, include_buffer=True):
    """Total man-days in a Development column: feature rows (QA recomputed) + overhead rows."""
    total = 0.0
    for r in FEATURE_ROWS:
        if col == "K":  # QA is a formula; recompute it
            if dev[f"D{r}"].value:
                total += round((num(dev[f"H{r}"].value) + num(dev[f"I{r}"].value) + num(dev[f"J{r}"].value)) * 0.3)
        else:
            total += num(dev[f"{col}{r}"].value)
    for r in OVERHEAD_ROWS:
        if r == BUFFER_ROW and not include_buffer:
            continue
        v = dev[f"{col}{r}"].value
        if not (isinstance(v, str) and v.startswith("=")):
            total += num(v)
    return total


def plan_hours(plan, row, weeks, hpw):
    return sum(num(plan[f"{c}{row}"].value) for c in weeks) * hpw


def check_reconciliation(dev, plan, rep):
    hpw = num(plan["C7"].value) or 40
    lines = []
    for role, (row, col) in PLAN_DEV.items():
        p = plan_hours(plan, row, PLAN_DEV_WEEKS, hpw)
        est = dev_role_md(dev, col, include_buffer=False) * 8
        buf_v = dev[f"{col}{BUFFER_ROW}"].value
        buf = 0.0 if isinstance(buf_v, str) and buf_v.startswith("=") else num(buf_v) * 8
        lines.append(f"    {role:<12} estimate {est:7.1f}h + buffer {buf:6.1f}h vs plan {p:7.1f}h")
        if p + 1e-6 < est:
            rep.fail("reconcile", f"{role}: Plan ({p:g}h) is BELOW the estimate ({est:g}h) — the plan cannot deliver the estimate; add staffing")
        elif abs(est + buf - p) > 1e-6:
            need = (p - est) / 8
            rep.fail("reconcile", f"{role}: estimate {est:g}h + buffer {buf:g}h != plan {p:g}h — set Buffer (Development {col}{BUFFER_ROW}) to {need:g} MD")
    # Design: totals only (no per-tier man-day source)
    p_des = sum(plan_hours(plan, r, PLAN_SHORT_WEEKS, hpw) for r in PLAN_DESIGN_ROWS)
    print("  Reconciliation (development block):")
    print("\n".join(lines))
    print(f"    {'Design':<12} plan {p_des:7.1f}h (compare with the Design-sheet man-days x 8 and Estimation-Detail design hours)")


def check_devops(dev, plan, rep):
    hpw = num(plan["C7"].value) or 40
    devops_md = dev_role_md(dev, "L")
    if devops_md <= 0:
        rep.fail("devops", "DevOps man-days are 0/empty in Development (features + row 86) — the sheet shown to the client must carry the DevOps effort")
    total_dev_h = sum(plan_hours(plan, row, PLAN_DEV_WEEKS, hpw) for row, _ in PLAN_DEV.values())
    devops_h = plan_hours(plan, PLAN_DEV[ "DevOps"][0], PLAN_DEV_WEEKS, hpw)
    if total_dev_h and devops_h / total_dev_h < 0.01:
        rep.fail("devops", f"DevOps is {devops_h / total_dev_h:.1%} of development hours — must be >= 1%")


def staffed_weeks(plan, rows, weeks):
    return sum(1 for c in weeks if any(num(plan[f"{c}{r}"].value) > 0 for r in rows))


def check_duration(dev, plan, summ, rep):
    hpw = num(plan["C7"].value) or 40
    dev_rows = [row for row, _ in PLAN_DEV.values()]
    wk_dev = staffed_weeks(plan, dev_rows, PLAN_DEV_WEEKS)
    wk_des = staffed_weeks(plan, PLAN_DESIGN_ROWS, PLAN_SHORT_WEEKS)
    wk_dis = staffed_weeks(plan, PLAN_DISC_ROWS, PLAN_SHORT_WEEKS)
    for label, cell, staffed in (("development", "F11", wk_dev), ("design", "F10", wk_des), ("discovery", "F9", wk_dis)):
        stated = num(summ[cell].value)
        if stated != staffed:
            rep.fail("duration", f"Summary {label} duration ({cell}={stated:g} wks) != staffed weeks in the Plan ({staffed}) — the plan, not the template, sets the weeks")
    total_stated = num(summ["F13"].value)
    phases = [wk_dev, wk_des, wk_dis]
    if total_stated and not (max(phases) <= total_stated <= sum(phases)):
        rep.fail("duration", f"Summary total duration (F13={total_stated:g}) must lie between the longest phase ({max(phases)}) and the sum of phases ({sum(phases)})")

    total_h = (sum(plan_hours(plan, row, PLAN_DEV_WEEKS, hpw) for row, _ in PLAN_DEV.values())
               + sum(plan_hours(plan, r, PLAN_SHORT_WEEKS, hpw) for r in PLAN_DESIGN_ROWS)
               + sum(plan_hours(plan, r, PLAN_SHORT_WEEKS, hpw) for r in PLAN_DISC_ROWS))
    peak = max((sum(num(plan[f"{c}{r}"].value) for r in dev_rows) for c in PLAN_DEV_WEEKS), default=0)
    for lo, hi, wmin, wmax, pmin, pmax in DURATION_BANDS:
        if lo <= total_h < hi:
            if not wmin <= wk_dev <= wmax:
                rep.fail("realism", f"{total_h:g} planned hours -> Pack §4.4 expects {wmin}-{wmax} development weeks; the plan has {wk_dev}. Re-plan — no over-parallelised staffing")
            if peak > pmax:
                rep.fail("realism", f"Team peak {peak:g} FTE exceeds the §4.4 band ({pmin}-{pmax}) for {total_h:g} hours — the plan is not realistic")
            break
    else:
        if total_h > 0:
            rep.warn("realism", f"Total planned hours ({total_h:g}) below the smallest §4.4 band (200h) — band check skipped")


def check_template_integrity(plan, det, rep):
    ok = all(plan[f"{c}103"].value == f"={c}59*'Price Rate Card'!$D$15" for c in PLAN_DEV_WEEKS)
    if not ok:
        rep.fail("template", "Plan row 103 (DevOps price) does not use the Price Rate Card for all 12 weeks — this workbook was filled from an OLD template copy; refill from the repaired master")
    if det["D80"].value != "=Plan!Q54":
        rep.fail("template", "Estimation-Detail D80 (PM hours) does not read Plan!Q54 — old template copy; refill from the repaired master")
    if plan["D38"].value != "=$C$7*D11":
        rep.fail("template", "Plan Discovery hours still multiply by the Week# row — old template copy; refill from the repaired master")


def margin_estimate(wb, plan, det, summ, rep):
    """Approximate margin recompute (openpyxl cannot evaluate formulas). Warning-level only."""
    hpw = num(plan["C7"].value) or 40
    cost_ws, price_ws = wb["Cost Rate Card"], wb["Price Rate Card"]

    def price_rate(row):  # Price col D holds '=Ix' pointers into the dated columns
        v = price_ws[f"D{row}"].value
        if isinstance(v, str) and v.startswith("="):
            return num(price_ws[v[1:]].value)
        return num(v)

    cost_rates = {"Architect": num(cost_ws["D6"].value), "PM": num(cost_ws["D7"].value),
                  "React": num(cost_ws["D8"].value), "AI engineer": num(cost_ws["D18"].value),
                  "Backend": num(cost_ws["D12"].value), "QA": num(cost_ws["D14"].value),
                  "DevOps": num(cost_ws["D17"].value)}
    price_rates = {"Architect": price_rate(6), "PM": price_rate(7), "React": price_rate(8),
                   "AI engineer": num(price_ws["I14"].value), "Backend": price_rate(10),
                   "QA": price_rate(12), "DevOps": price_rate(15)}
    cost = price = 0.0
    for role, (row, _) in PLAN_DEV.items():
        h = plan_hours(plan, row, PLAN_DEV_WEEKS, hpw)
        cost += h * cost_rates[role]
        price += h * price_rates[role]
    des_h = sum(num(det[f"D{r}"].value) if not str(det[f"D{r}"].value or "").startswith("=") else 0 for r in range(10, 19))
    des_h += sum(plan_hours(plan, r, PLAN_SHORT_WEEKS, hpw) for r in ())  # wireframing comes via Design!D39; inputs above cover manual lines
    cost += des_h * max(num(cost_ws[f"D{r}"].value) for r in (20, 21, 22))
    price += des_h * max(price_rate(r) for r in (17, 18, 19))
    other_h = sum(num(det[f"D{r}"].value) if not str(det[f"D{r}"].value or "").startswith("=") else 0 for r in (81, 83, 85))
    pm_h = plan_hours(plan, PLAN_DEV["PM"][0], PLAN_DEV_WEEKS, hpw)
    cost += (other_h + pm_h) * cost_rates["PM"]
    price += (other_h + pm_h) * price_rates["PM"]
    buffer_pct = num(summ["J20"].value)
    price *= (1 + buffer_pct)
    if price > 0:
        margin = (price - cost) / price
        print(f"  Margin (approximate recompute, incl. {buffer_pct:.0%} buffer): {margin:.1%} "
              f"(cost ~${cost:,.0f} / price ~${price:,.0f}) — workbook formulas remain authoritative")
        if margin < 0.50:
            rep.warn("margin", f"Recomputed margin {margin:.1%} is below the 50% studio floor — needs written architect + Deep sign-off (A14)")


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    wb = openpyxl.load_workbook(sys.argv[1])
    dev, plan, det, summ = wb[DEV], wb[PLAN], wb[DET], wb[SUM]
    rep = Report()

    print(f"Validating: {sys.argv[1]}")
    check_template_integrity(plan, det, rep)
    check_descriptions(dev, rep)
    check_granularity(dev, rep)
    check_grain(dev, rep)
    check_fte(plan, rep)
    check_reconciliation(dev, plan, rep)
    check_devops(dev, plan, rep)
    check_duration(dev, plan, summ, rep)
    try:
        margin_estimate(wb, plan, det, summ, rep)
    except Exception as e:  # margin recompute is best-effort
        rep.warn("margin", f"could not recompute margin: {e}")

    for check, msg in rep.warnings:
        print(f"  WARN  [{check}] {msg}")
    if rep.failures:
        print(f"\nFAILED — {len(rep.failures)} issue(s):")
        for check, msg in rep.failures:
            print(f"  FAIL  [{check}] {msg}")
        raise SystemExit(1)
    print("\nPASSED — all deterministic checks green.")


if __name__ == "__main__":
    main()
