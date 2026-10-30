#!/usr/bin/env python3
"""Fill a COPY of the IntuitioLabs Estimation Template from a structured estimate.

Writes INPUT cells only — every formula in the template is preserved, so the workbook computes
hours / cost / price / margin when opened. `openpyxl` is pre-installed in the code-execution sandbox.

Usage:
    python fill_template.py --template estimation-template.xlsx --input estimate.json --output out.xlsx

INPUT JSON SCHEMA (all keys optional; provide what you have):
{
  "development": [                      # one object per feature/component -> Development rows from row 6
    {"feature": "Login",                # description: inherited from PRD Section 10 (condensed), never
                                        # authored from the feature name; the Technical line carries the
                                        # PRD trace_id — validate_estimate.py fails rows without one
     "description": "• Ability to ...\\n• Technical - Cognito auth, JWT sessions. (PRD 6.A.2)",
     "role": "Member",                 # Member | Employer | Admin | Other
     "fe": 1.5, "be": 1.0, "ai": 0,    # man-days; QA is auto (template formula), do NOT pass it
     "devops": 0, "analyst": 0, "pm": 0, "architect": 0}
  ],
  "overhead": {                         # Development overhead rows 84-91 (man-days)
    "buffer": {"fe": 2, "be": 0.5, "ai": 0, "qa": 1,        # PER-ROLE reconciliation filler (row 84):
               "devops": 0, "analyst": 0, "pm": 0, "architect": 0},  # buffer[role] = (Plan hours - estimate hours)/8
    "uat": 0, "devops": 0, "pm": 0, "architect": 0,         # a bare number is also accepted for buffer (legacy -> col H)
    "internal_calls": 0, "client_calls": 0, "kt": 0
  },
  "design": [                           # Design sheet rows from row 6 (man-days)
    {"feature": "Auth screens", "description": "...",
     "wireframing": 2, "ui_desktop": 3, "ui_responsive": 2}
  ],
  "plan": {                             # weekly FTE per role (the engine). Lists are per week.
    "development": {                    # rows 26-32, weeks 1..12 (cols D..O)
      "Architect": [0.3, 0.3, ...], "PM": [...], "React": [...], "AI engineer": [...],
      "Backend": [...], "QA": [...], "DevOps": [...]
    },
    "design": {                         # rows 19-21, weeks 1..7 (cols D..J)
      "Designer (Lead)": [...], "Designer": [...], "Designer (Asst)": [...]
    },
    "discovery": {                      # rows 11-14, weeks 1..7 (cols D..J)
      "Architect": [...], "Engineer": [...], "Designer (Lead)": [...], "Designer": [...]
    }
  },
  "estimation_detail": {                # the few manual cells in Estimation-Detail
    "design_hours": {"branding":0,"lofi":0,"uiux":0,"hifi":0,
                     "responsive_tablet":0,"responsive_mobile":0,"edits":0,"design_control":0},
    "other_hours": {"internal_calls":0,"client_calls":0,"dev_estimation":0}
  },
  "summary": {                          # Estimation-Summary inputs
    "buffer_pct": 0.0,                  # J20 (e.g. 0.06 for 6%)
    "durations": {"discovery":0,"design":0,"development":0,"total":0}   # weeks (F9/F10/F11/F13)
  }
}
"""
import argparse, json, shutil
import openpyxl

DEV = "Development "          # note trailing spaces in sheet names
DES = "Design "
PLAN = "Plan"
DET = "Estimation-Detail"
SUM = "Estimation-Summary"

# --- Development feature columns (rows from 6) ---
DEV_COLS = {"feature":"D", "description":"E", "role":"F",
            "fe":"H", "be":"I", "ai":"J",            # K = QA formula (skip)
            "devops":"L", "analyst":"M", "pm":"N", "architect":"O"}
DEV_FEATURE_START = 6
DEV_FEATURE_END = 82                     # template feature rows are 6..82; overhead starts at 84
# Development overhead rows 84-91 -> put man-days in the role-appropriate column (PM->N, DevOps->L, ...).
DEV_OVERHEAD = {  # label -> (row, column)
    "buffer":("84","H"), "uat":("85","H"), "devops":("86","L"), "pm":("87","N"),
    "architect":("88","O"), "internal_calls":("89","N"), "client_calls":("90","N"), "kt":("91","O"),
}
# Per-role buffer (row 84): the reconciliation filler that makes Development hours == Plan hours per role.
BUFFER_ROW = 84
BUFFER_COLS = {"fe":"H", "be":"I", "ai":"J", "qa":"K",
               "devops":"L", "analyst":"M", "pm":"N", "architect":"O"}

# --- Design rows (from 6) ---
DES_COLS = {"feature":"B", "description":"C", "wireframing":"D", "ui_desktop":"E", "ui_responsive":"F"}
DES_FEATURE_START = 6

# --- Plan resource blocks: role -> row ; weeks -> columns ---
PLAN_DEV_ROWS = {"Architect":26,"PM":27,"React":28,"AI engineer":29,"Backend":30,"QA":31,"DevOps":32}
PLAN_DEV_COLS = [c for c in "DEFGHIJKLMNO"]                # weeks 1..12
PLAN_DESIGN_ROWS = {"Designer (Lead)":19,"Designer":20,"Designer (Asst)":21}
PLAN_DISC_ROWS = {"Architect":11,"Engineer":12,"Designer (Lead)":13,"Designer":14}
PLAN_SHORT_COLS = [c for c in "DEFGHIJ"]                   # weeks 1..7 (design/discovery)

# --- Estimation-Detail manual cells ---
DET_DESIGN = {"branding":"D10","lofi":"D12","uiux":"D13","hifi":"D14",
              "responsive_tablet":"D15","responsive_mobile":"D16","edits":"D17","design_control":"D18"}
DET_OTHER = {"internal_calls":"D81","client_calls":"D83","dev_estimation":"D85"}

# --- Estimation-Summary cells ---
SUM_BUFFER = "J20"
SUM_DURATIONS = {"discovery":"F9","design":"F10","development":"F11","total":"F13"}


NUMERIC_KEYS = set(list(DEV_COLS) + list(DES_COLS)) - {"feature", "description", "role"}


def coerce(value):
    """Coerce numeric strings to numbers — Excel's SUM() silently ignores text values."""
    if isinstance(value, str):
        try:
            f = float(value)
            return int(f) if f == int(f) else f
        except ValueError:
            return value
    return value


def set_cell(ws, coord, value, numeric=False):
    if value is None:
        return
    c = ws[coord]
    if isinstance(c.value, str) and c.value.startswith("="):
        return  # never overwrite a formula
    c.value = coerce(value) if numeric else value


def fill(template, data, output):
    shutil.copyfile(template, output)
    wb = openpyxl.load_workbook(output)

    # Development feature rows
    features = data.get("development", [])
    max_features = DEV_FEATURE_END - DEV_FEATURE_START + 1
    if len(features) > max_features:
        raise SystemExit(f"ERROR: {len(features)} development rows exceed the template's "
                         f"{max_features} feature rows (6-{DEV_FEATURE_END}).")
    for i, feat in enumerate(features):
        r = DEV_FEATURE_START + i
        for key, col in DEV_COLS.items():
            if key in feat:
                set_cell(wb[DEV], f"{col}{r}", feat[key], numeric=key in NUMERIC_KEYS)

    # Development overhead rows
    for key, (row, col) in DEV_OVERHEAD.items():
        v = data.get("overhead", {}).get(key)
        if key == "buffer" and isinstance(v, dict):
            for role, md in v.items():
                if role not in BUFFER_COLS:
                    raise SystemExit(f"ERROR: unknown buffer role '{role}' (use {sorted(BUFFER_COLS)})")
                set_cell(wb[DEV], f"{BUFFER_COLS[role]}{BUFFER_ROW}", md, numeric=True)
            continue
        set_cell(wb[DEV], f"{col}{row}", v, numeric=True)

    # Design rows
    designs = data.get("design", [])
    if len(designs) > 33:
        raise SystemExit(f"ERROR: {len(designs)} design rows exceed the template's 33 rows (6-38).")
    for i, d in enumerate(designs):
        r = DES_FEATURE_START + i
        for key, col in DES_COLS.items():
            if key in d:
                set_cell(wb[DES], f"{col}{r}", d[key], numeric=key in NUMERIC_KEYS)

    # Plan resource grids
    plan = data.get("plan", {})
    def fill_block(rows, cols, block, block_name):
        for role, weeks in block.items():
            if role not in rows:
                raise SystemExit(f"ERROR: unknown plan role '{role}' in '{block_name}' "
                                 f"(use {sorted(rows)})")
            if len(weeks) > len(cols):
                raise SystemExit(f"ERROR: plan '{block_name}' role '{role}' has {len(weeks)} weeks; "
                                 f"the template holds {len(cols)}. Re-plan the duration — weeks are "
                                 f"never silently truncated.")
            row = rows[role]
            for j, val in enumerate(weeks):
                set_cell(wb[PLAN], f"{cols[j]}{row}", val, numeric=True)
    fill_block(PLAN_DEV_ROWS, PLAN_DEV_COLS, plan.get("development", {}), "development")
    fill_block(PLAN_DESIGN_ROWS, PLAN_SHORT_COLS, plan.get("design", {}), "design")
    fill_block(PLAN_DISC_ROWS, PLAN_SHORT_COLS, plan.get("discovery", {}), "discovery")

    # Estimation-Detail manual cells
    ed = data.get("estimation_detail", {})
    for key, coord in DET_DESIGN.items():
        set_cell(wb[DET], coord, ed.get("design_hours", {}).get(key), numeric=True)
    for key, coord in DET_OTHER.items():
        set_cell(wb[DET], coord, ed.get("other_hours", {}).get(key), numeric=True)

    # Estimation-Summary
    s = data.get("summary", {})
    set_cell(wb[SUM], SUM_BUFFER, s.get("buffer_pct"), numeric=True)
    for key, coord in SUM_DURATIONS.items():
        set_cell(wb[SUM], coord, s.get("durations", {}).get(key), numeric=True)

    wb.save(output)
    print(f"Filled -> {output}")
    print(f"  development rows: {len(data.get('development', []))} | design rows: {len(data.get('design', []))}")
    print("  NOTE: formulas preserved; open in Excel/Sheets to compute totals (no recalc in sandbox).")
    print("  NEXT: run validate_estimate.py on the output — the estimate is not done until it passes.")


def main():
    ap = argparse.ArgumentParser(description="Fill the IntuitioLabs Estimation Template from a JSON estimate.")
    ap.add_argument("--template", required=True)
    ap.add_argument("--input", required=True, help="path to the estimate JSON")
    ap.add_argument("--output", required=True)
    a = ap.parse_args()
    with open(a.input, encoding="utf-8") as f:
        data = json.load(f)
    fill(a.template, data, a.output)


if __name__ == "__main__":
    main()
