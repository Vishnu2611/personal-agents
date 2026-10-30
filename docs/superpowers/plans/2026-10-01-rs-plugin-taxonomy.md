# RS Plugin Taxonomy Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `rightshift-doc-gen`, `chatbot-forge` and `delivery-agent` with twelve `rs-*` plugins authored in `src/plugins/` and generated into `plugins/`, per `docs/superpowers/specs/2026-10-01-rs-plugin-taxonomy-design.md`.

**Architecture:** A Python generator (`src/tools/sync_plugins.py`) copies each plugin's shipped parts and applies a plugin-local `sync.json`. A Python verifier (`src/tools/verify_plugins.py`) checks the generated tree, manifests and marketplace. The Makefile drives both from one `PLUGINS` list. Existing skills move first in one atomic cutover; prompt-only plugins are then added one per task.

**Tech Stack:** GNU Make, Python 3.13 stdlib (`unittest`, no new deps), Node (installer), Claude Code plugin manifests.

## Global Constraints

- Work on branch `refactor/rs-plugin-taxonomy`. Never push, tag or run `npm run release` (step 7 is out of scope).
- `.husky/pre-commit` runs `make verify` — **every commit must pass it**. Never use `--no-verify`.
- Commit messages: Conventional Commits, ending with `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.
- Never hand-edit `plugins/`. Edit `src/plugins/`, then `make sync`.
- Every plugin name starts with `rs-`. Every plugin manifest `version` equals `package.json` `version` (`2.4.0`).
- Plugin manifests omit the `skills` field — skills are auto-discovered from `skills/`.
- Prompt bodies are moved with `git mv`, never edited.
- Final `PLUGINS` order: `rs-research rs-scoping rs-sales rs-content rs-design rs-prototype rs-delivery rs-qa rs-project-management rs-product rs-chatbot rs-common`.
- Repo root for all commands: `/home/vishnu-pradeep/Desktop/data/projects/intuitiolabs/agents`. Scratch dir: `$SCRATCH` = `/tmp/claude-1000/-home-vishnu-pradeep-Desktop-data-projects-intuitiolabs-agents/51dbee4b-3414-4557-9dc1-eaa0ec28b48b/scratchpad`.

### Plugin manifest descriptions (use verbatim)

| Plugin | `description` |
|---|---|
| rs-research | Understand a market, prospect company or competitor before anything is scoped; sharpen discovery questions; turn a vague client complaint into a sharp problem statement. Ends where client-facing documents begin. |
| rs-scoping | Client notes, transcripts or emails to opportunity packet, BRD, PRD, technical design and a man-day estimate priced against the rate card. The chain that ends in a number. Not for presenting or selling it. |
| rs-sales | Win scoped work: proposal and platform decks, startup pitch decks, contracts, outbound campaigns, and review of client-facing material before it goes out. Not for producing the scope. |
| rs-content | Write what is published under the RightShift name: LinkedIn posts, case studies, traction pieces, speaking-engagement campaigns, one-pagers, editorial and client-communication QA, and the voice guide they follow. Not for client deliverables. |
| rs-design | Interface and visual design (SaaS UI in Figma, design reference to CSS spec) and evaluating a page, site or Figma file against its brief. Also brand identity. Not for building it in code. |
| rs-prototype | Something running or clickable fast: HTML or Next.js prototypes, Spark or Propel engagements, and deciding which prototype features become the MVP. Not for production delivery. |
| rs-delivery | Ship an approved PRD: per-feature specs a coding agent can execute, then design-briefed, prototype-gated, TDD-implemented, QA-verified features shipped as a PR linked to the ticket. Not for prototypes or deciding what to build. |
| rs-qa | Risk-based test strategy and coverage matrix, executable Gherkin test cases, and Playwright runs against a live application with real verdicts. Not for code review. |
| rs-project-management | Run sold work: map a PRD into Linear sprints and tickets. Not for deciding what to build or writing code. |
| rs-product | Training course that teaches team leads to turn a client's stated want into a spec a designer and engineer can build from. Training, not production. |
| rs-chatbot | Build a knowledge-grounded chatbot for a client or internally, define its personality rulebook, and specify how it behaves and falls back when it does not know. |
| rs-common | Shared utilities other rs-* plugins lean on: D2 diagram rendering and the document formatting standard. Install alongside anything else. |

### Manifest template

`src/plugins/<p>/.claude-plugin/plugin.json`:

```json
{
  "name": "<p>",
  "version": "2.4.0",
  "description": "<description from table above>",
  "author": { "name": "IntuitioLabs" },
  "homepage": "https://github.com/IntuitioLabsLLC/rightshift-managed-agents",
  "license": "UNLICENSED"
}
```

### Marketplace entry template

```json
{ "name": "<p>", "source": "./plugins/<p>", "description": "<same description>" }
```

---

### Task 1: Merge product-thinking-course

**Files:** whatever `origin/feat/product-thinking-course` adds (`src/product-management/product-thinking-course/**`, `skills/product-thinking-course/**`, Makefile `PM_SKILLS`).

- [ ] **Step 1:** `git fetch origin && git merge --no-ff --no-edit origin/feat/product-thinking-course`. Keep git's default `Merge remote-tracking branch …` message — commitlint ignores merge commits, whereas a custom `merge:` type would be rejected. Expected: clean merge (branch is one commit ahead of `ec80751`).
- [ ] **Step 2:** `make verify` → `VERIFY: PASS`. `ls src/product-management/product-thinking-course/SKILL.md` exists.

---

### Task 2: Generator `sync_plugins.py`

**Files:**
- Create: `src/tools/sync_plugins.py`
- Create: `src/tools/tests/__init__.py` (empty), `src/tools/tests/test_sync_plugins.py`

**Interfaces:**
- Produces: `sync_plugin(root: Path, name: str) -> None`; CLI `python3 src/tools/sync_plugins.py [--force] PLUGIN...` (exit 1 if `plugins/` has uncommitted diffs and no `--force`).

- [ ] **Step 1: Write the failing test** — `src/tools/tests/test_sync_plugins.py`:

```python
import json, sys, tempfile, unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import sync_plugins  # noqa: E402


def write(p: Path, text: str) -> None:
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding="utf-8")


class SyncPluginTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        src = self.root / "src" / "plugins" / "rs-x"
        write(src / ".claude-plugin" / "plugin.json", '{"name": "rs-x"}')
        write(src / "README.md", "readme")
        write(src / "skills" / "a" / "SKILL.md", "---\nname: a\n---\n")
        write(src / "skills" / "a" / "node_modules" / "junk.js", "x")
        write(src / "prompts" / "a" / "current" / "a-v1.md", "PROMPT A")
        write(src / "tools" / "post.py",
              "from pathlib import Path\n"
              "Path('plugins/rs-x/skills/a/resources/post.txt').write_text('ran')\n")
        write(self.root / "src" / "standards" / "std.md", "STD")
        write(src / "sync.json", json.dumps({
            "prompts": {"a": "prompts/a/current/a-v1.md"},
            "copy": [{"from": "src/standards/std.md", "to": "skills/a/resources/std.md"}],
            "post": ["tools/post.py"],
        }))
        write(self.root / "plugins" / "rs-x" / "stale.txt", "old")

    def tearDown(self):
        self.tmp.cleanup()

    def test_copies_shipped_parts_only(self):
        sync_plugins.sync_plugin(self.root, "rs-x")
        out = self.root / "plugins" / "rs-x"
        self.assertTrue((out / ".claude-plugin" / "plugin.json").exists())
        self.assertEqual((out / "README.md").read_text(), "readme")
        self.assertTrue((out / "skills" / "a" / "SKILL.md").exists())
        self.assertFalse((out / "prompts").exists())
        self.assertFalse((out / "tools").exists())
        self.assertFalse((out / "sync.json").exists())
        self.assertFalse((out / "skills" / "a" / "node_modules").exists())
        self.assertFalse((out / "stale.txt").exists())

    def test_applies_sync_json(self):
        sync_plugins.sync_plugin(self.root, "rs-x")
        res = self.root / "plugins" / "rs-x" / "skills" / "a" / "resources"
        self.assertEqual((res / "prompt.md").read_text(), "PROMPT A")
        self.assertEqual((res / "std.md").read_text(), "STD")
        self.assertEqual((res / "post.txt").read_text(), "ran")

    def test_missing_manifest_raises(self):
        with self.assertRaises(SystemExit):
            sync_plugins.sync_plugin(self.root, "rs-missing")


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2:** `touch src/tools/tests/__init__.py && python3 -m unittest discover -s src/tools/tests -v` → FAIL (`ModuleNotFoundError: No module named 'sync_plugins'`).

- [ ] **Step 3: Implement** — `src/tools/sync_plugins.py`:

```python
#!/usr/bin/env python3
"""Generate plugins/<name>/ from src/plugins/<name>/. Run from the repo root (the Makefile's `sync`).

Copies only the shipped parts (.claude-plugin/, skills/, README.md), then applies the plugin's
optional sync.json:
  prompts: {skill: "prompts/.../file.md"}           -> skills/<skill>/resources/prompt.md
  copy:    [{"from": <repo-relative>, "to": <plugin-relative>}]
  post:    ["tools/script.py"]                     -> run with cwd = repo root
Refuses to run when plugins/ has uncommitted edits unless --force (guard against hand-editing).
"""
import argparse, json, shutil, subprocess, sys
from pathlib import Path

SHIPPED = (".claude-plugin", "skills", "README.md")
IGNORE = shutil.ignore_patterns("node_modules", "__pycache__", ".DS_Store")


def sync_plugin(root: Path, name: str) -> None:
    src = root / "src" / "plugins" / name
    out = root / "plugins" / name
    if not (src / ".claude-plugin" / "plugin.json").exists():
        raise SystemExit(f"!! {name}: no src/plugins/{name}/.claude-plugin/plugin.json")
    shutil.rmtree(out, ignore_errors=True)
    out.mkdir(parents=True)
    for item in SHIPPED:
        p = src / item
        if p.is_dir():
            shutil.copytree(p, out / item, ignore=IGNORE)
        elif p.is_file():
            shutil.copy2(p, out / item)
    cfg_path = src / "sync.json"
    if not cfg_path.exists():
        return
    cfg = json.loads(cfg_path.read_text(encoding="utf-8"))
    for skill, rel in cfg.get("prompts", {}).items():
        _copy(src / rel, out / "skills" / skill / "resources" / "prompt.md")
    for c in cfg.get("copy", []):
        _copy(root / c["from"], out / c["to"])
    for script in cfg.get("post", []):
        subprocess.run([sys.executable, str(src / script)], cwd=root, check=True)


def _copy(frm: Path, to: Path) -> None:
    if not frm.exists():
        raise SystemExit(f"!! sync source missing: {frm}")
    to.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(frm, to)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    ap.add_argument("plugins", nargs="+")
    args = ap.parse_args()
    root = Path.cwd()
    if not args.force and subprocess.run(["git", "diff", "--quiet", "--", "plugins"], cwd=root).returncode:
        sys.exit("!! plugins/ has uncommitted edits that 'make sync' would OVERWRITE.\n"
                 "!! Move them into src/plugins/ or re-run with FORCE=1 to discard them.")
    for name in args.plugins:
        sync_plugin(root, name)
        print(f"  synced plugins/{name}")
    print(">> sync complete")


if __name__ == "__main__":
    main()
```

- [ ] **Step 4:** `python3 -m unittest discover -s src/tools/tests -v` → 3 tests OK.
- [ ] **Step 5: Commit** `git add src/tools/sync_plugins.py src/tools/tests && git commit -m "build: add sync_plugins.py generator for src/plugins -> plugins"`.

---

### Task 3: Verifier `verify_plugins.py`

**Files:**
- Create: `src/tools/verify_plugins.py`, `src/tools/tests/test_verify_plugins.py`

**Interfaces:**
- Produces: `check(root: Path, plugins: list[str]) -> list[str]` (error strings, empty = pass); CLI `python3 src/tools/verify_plugins.py PLUGIN...` prints `VERIFY: PASS|FAIL`, exits 1 on FAIL. Also runs the d2 and estimation checks when those plugins are in the list.

- [ ] **Step 1: Write the failing test** — `src/tools/tests/test_verify_plugins.py`:

```python
import json, sys, tempfile, unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import verify_plugins  # noqa: E402


def write(p: Path, text: str) -> None:
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding="utf-8")


def skill(root, plugin, name, fm_name=None, desc="Does a thing."):
    body = f"---\nname: {fm_name or name}\n" + (f"description: {desc}\n" if desc else "") + "---\n# x\n"
    write(root / "plugins" / plugin / "skills" / name / "SKILL.md", body)


class VerifyTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        write(self.root / "package.json", '{"version": "2.4.0"}')
        for p in ("rs-a", "rs-b"):
            write(self.root / "plugins" / p / ".claude-plugin" / "plugin.json",
                  json.dumps({"name": p, "version": "2.4.0", "description": "d"}))
        skill(self.root, "rs-a", "one")
        skill(self.root, "rs-b", "two")
        self.market = {"name": "rightshift", "plugins": [
            {"name": "rs-a", "source": "./plugins/rs-a"},
            {"name": "rs-b", "source": "./plugins/rs-b"},
            {"name": "superpowers", "source": {"source": "github", "repo": "obra/superpowers"}},
        ]}
        self._market()

    def _market(self):
        write(self.root / ".claude-plugin" / "marketplace.json", json.dumps(self.market))

    def tearDown(self):
        self.tmp.cleanup()

    def errs(self):
        return verify_plugins.check(self.root, ["rs-a", "rs-b"])

    def test_clean_tree_passes(self):
        self.assertEqual(self.errs(), [])

    def test_missing_skill_md_fails(self):
        (self.root / "plugins/rs-a/skills/one/SKILL.md").unlink()
        self.assertTrue(any("missing SKILL.md" in e for e in self.errs()))

    def test_empty_plugin_fails(self):
        (self.root / "plugins/rs-b/skills/two/SKILL.md").unlink()
        (self.root / "plugins/rs-b/skills/two").rmdir()
        self.assertTrue(any("empty plugin" in e for e in self.errs()))

    def test_missing_manifest_fails(self):
        (self.root / "plugins/rs-a/.claude-plugin/plugin.json").unlink()
        self.assertTrue(any("missing .claude-plugin/plugin.json" in e for e in self.errs()))

    def test_version_drift_fails(self):
        write(self.root / "plugins/rs-a/.claude-plugin/plugin.json",
              json.dumps({"name": "rs-a", "version": "2.3.0", "description": "d"}))
        self.assertTrue(any("version" in e for e in self.errs()))

    def test_name_mismatch_and_missing_description_fail(self):
        skill(self.root, "rs-a", "three", fm_name="Three", desc=None)
        e = self.errs()
        self.assertTrue(any("!= folder" in x for x in e))
        self.assertTrue(any("missing description" in x for x in e))

    def test_duplicate_skill_fails(self):
        skill(self.root, "rs-b", "one")
        self.assertTrue(any("duplicate skill" in e for e in self.errs()))

    def test_prompt_backed_skill_without_prompt_fails(self):
        write(self.root / "src/plugins/rs-a/sync.json", json.dumps({"prompts": {"one": "prompts/x.md"}}))
        self.assertTrue(any("resources/prompt.md" in e for e in self.errs()))

    def test_marketplace_mismatch_fails(self):
        self.market["plugins"][1]["source"] = "./rs-b"
        self.market["plugins"].append({"name": "rightshift-doc-gen", "source": "./"})
        self._market()
        e = self.errs()
        self.assertTrue(any("rs-b" in x and "marketplace" in x for x in e))
        self.assertTrue(any("rightshift-doc-gen" in x for x in e))

    def test_root_plugin_manifest_fails(self):
        write(self.root / ".claude-plugin/plugin.json", "{}")
        self.assertTrue(any("root .claude-plugin/plugin.json" in e for e in self.errs()))


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2:** `python3 -m unittest discover -s src/tools/tests -v` → FAIL (`No module named 'verify_plugins'`).

- [ ] **Step 3: Implement** — `src/tools/verify_plugins.py`:

```python
#!/usr/bin/env python3
"""Verify the generated plugins/ tree, manifests and marketplace. Run from repo root: make verify."""
import json, re, subprocess, sys, tempfile
from pathlib import Path

NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")


def frontmatter(text: str):
    if not text.startswith("---"):
        return None
    parts = text.split("---", 2)
    if len(parts) < 3:
        return None
    fm = {}
    for line in parts[1].splitlines():
        if ":" in line and not line[:1].isspace():
            k, v = line.split(":", 1)
            fm[k.strip()] = v.strip().strip("\"'")
    return fm


def check(root: Path, plugins: list[str]) -> list[str]:
    errors: list[str] = []
    version = json.loads((root / "package.json").read_text())["version"]
    seen: dict[str, str] = {}
    for p in plugins:
        base = root / "plugins" / p
        man = base / ".claude-plugin" / "plugin.json"
        if not man.exists():
            errors.append(f"{p}: missing .claude-plugin/plugin.json")
            continue
        try:
            m = json.loads(man.read_text())
        except json.JSONDecodeError as e:
            errors.append(f"{p}: invalid plugin.json ({e})")
            continue
        if m.get("name") != p:
            errors.append(f"{p}: manifest name '{m.get('name')}' != '{p}'")
        if m.get("version") != version:
            errors.append(f"{p}: version {m.get('version')} != package.json {version}")
        if not m.get("description"):
            errors.append(f"{p}: manifest missing description")
        sdir = base / "skills"
        skills = sorted(d for d in sdir.iterdir() if d.is_dir()) if sdir.is_dir() else []
        if not skills:
            errors.append(f"{p}: no skills (empty plugin)")
        for s in skills:
            md = s / "SKILL.md"
            if not md.exists():
                errors.append(f"{p}/{s.name}: missing SKILL.md")
                continue
            fm = frontmatter(md.read_text(encoding="utf-8"))
            if fm is None:
                errors.append(f"{p}/{s.name}: SKILL.md has no YAML frontmatter")
                continue
            name = fm.get("name", "")
            if name != s.name:
                errors.append(f"{p}/{s.name}: frontmatter name '{name}' != folder '{s.name}'")
            if len(name) > 64 or not NAME_RE.match(name):
                errors.append(f"{p}/{s.name}: name must be <=64 chars, lowercase + hyphens")
            if not fm.get("description"):
                errors.append(f"{p}/{s.name}: missing description")
            if s.name in seen:
                errors.append(f"{p}/{s.name}: duplicate skill name (also in {seen[s.name]})")
            seen[s.name] = p
        sync = root / "src" / "plugins" / p / "sync.json"
        if sync.exists():
            for sk in json.loads(sync.read_text()).get("prompts", {}):
                if not (sdir / sk / "resources" / "prompt.md").exists():
                    errors.append(f"{p}/{sk}: missing resources/prompt.md (run make sync)")
    mk = json.loads((root / ".claude-plugin" / "marketplace.json").read_text())
    local = {e["name"]: e["source"] for e in mk.get("plugins", []) if isinstance(e.get("source"), str)}
    for p in plugins:
        if local.get(p) != f"./plugins/{p}":
            errors.append(f"marketplace: {p} missing or source != ./plugins/{p}")
    for n, src in local.items():
        if n not in plugins:
            errors.append(f"marketplace: '{n}' (source {src}) is not in PLUGINS")
    if (root / ".claude-plugin" / "plugin.json").exists():
        errors.append("root .claude-plugin/plugin.json must not exist (root is not a plugin)")
    return errors


def extra_checks(root: Path, plugins: list[str]) -> list[str]:
    errors: list[str] = []
    if "rs-common" in plugins:
        d2 = root / "plugins/rs-common/skills/d2-diagrams"
        for f in ("scripts/render.mjs", "package.json"):
            if not (d2 / f).exists():
                errors.append(f"d2-diagrams: missing {f}")
    if "rs-scoping" in plugins:
        est = root / "plugins/rs-scoping/skills/estimation-generator"
        for f in ("master-context-pack.md", "estimation-template.xlsx", "document-formatting-standard.md"):
            if not (est / "resources" / f).exists():
                errors.append(f"estimation-generator: missing resources/{f}")
        errors += smoke_fill(est)
    return errors


def smoke_fill(est: Path) -> list[str]:
    try:
        import openpyxl
    except ImportError:
        print("  SKIP: openpyxl not installed (it IS pre-installed in the Claude sandbox)")
        return []
    sample = {"development": [{"feature": "Smoke", "role": "Other", "fe": 1, "be": 1, "ai": 0}],
              "summary": {"buffer_pct": 0.0}}
    with tempfile.TemporaryDirectory() as d:
        jp, op = Path(d) / "in.json", Path(d) / "out.xlsx"
        jp.write_text(json.dumps(sample))
        r = subprocess.run([sys.executable, str(est / "scripts/fill_template.py"),
                            "--template", str(est / "resources/estimation-template.xlsx"),
                            "--input", str(jp), "--output", str(op)], capture_output=True, text=True)
        if r.returncode != 0 or not op.exists():
            return [f"fill_template.py smoke test failed: {r.stderr.strip()}"]
        k6 = openpyxl.load_workbook(op)["Development "]["K6"].value
        if not (k6 and str(k6).startswith("=")):
            return ["fill_template.py did not preserve the QA formula"]
    print("  OK: estimation fill script runs; formulas preserved")
    return []


def main() -> None:
    plugins = sys.argv[1:]
    root = Path.cwd()
    errors = check(root, plugins) + extra_checks(root, plugins)
    for e in errors:
        print("  FAIL:", e)
    if not errors:
        print(f"  OK: {len(plugins)} plugins, manifests + skills + marketplace consistent")
    print("\nVERIFY:", "FAIL" if errors else "PASS")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
```

- [ ] **Step 4:** `python3 -m unittest discover -s src/tools/tests -v` → all tests OK.
- [ ] **Step 5: Commit** `git add src/tools/verify_plugins.py src/tools/tests/test_verify_plugins.py && git commit -m "build: add verify_plugins.py for the rs-* plugin tree"`.

---

### Task 4: Cutover — existing skills into six rs-* plugins (atomic)

One commit: the old verifier reads the paths this task moves, so moves + Makefile + verifier switch land together.

**Files:**
- Move (git mv): `src/01-brd-generator`→`src/plugins/rs-scoping/prompts/01-brd-generator`, `src/02-prd-generator`→`…/02-prd-generator`, `src/03-technical-design`→`…/03-technical-design`, `src/04-estimation-agent`→`…/04-estimation-agent`; `src/05-test-planner`,`src/06-test-case-generator`,`src/07-test-executor`→`src/plugins/rs-qa/prompts/`; `src/08-spec-generator`→`src/plugins/rs-delivery/prompts/08-spec-generator`.
- Move skill dirs (authored, minus generated `resources/prompt.md` / pack / standard / template): `skills/{brd-generator,prd-generator,technical-design-generator,estimation-generator}`→`src/plugins/rs-scoping/skills/`; `skills/{test-planner,test-case-generator,test-executor}`→`src/plugins/rs-qa/skills/`; `qa-framework`→`src/plugins/rs-qa/skills/qa-test-planner`; `skills/spec-generator`→`src/plugins/rs-delivery/skills/`; `src/delivery-agent/skills/*`→`src/plugins/rs-delivery/skills/`; `src/delivery-agent/README.md`→`src/plugins/rs-delivery/README.md`; `src/chatbot-forge/skills/chatbot-forge`→`src/plugins/rs-chatbot/skills/chatbot-forge`; `src/chatbot-forge/README.md`→`src/plugins/rs-chatbot/README.md`; `src/d2-diagrams`→`src/plugins/rs-common/skills/d2-diagrams`; `src/product-management/product-thinking-course`→`src/plugins/rs-product/skills/product-thinking-course`.
- Move: `src/tools/extract_pack.py`→`src/plugins/rs-scoping/tools/extract_pack.py` (edit 2 paths).
- Create: 6 manifests, `src/plugins/{rs-scoping,rs-qa,rs-delivery}/sync.json`.
- Delete: `.claude-plugin/plugin.json`, `skills/`, `chatbot-forge/`, `delivery-agent/`, `src/chatbot-forge/.claude-plugin`, `src/delivery-agent/.claude-plugin`, `src/tools/verify_skills.py`.
- Modify: `Makefile`, `.claude-plugin/marketplace.json`, `.versionrc.json`.
- Generated: `plugins/rs-{scoping,qa,delivery,chatbot,common,product}/`.

- [ ] **Step 1: Snapshot old output for the identity check**

```bash
rm -rf "$SCRATCH/old" && mkdir -p "$SCRATCH/old"
cp -R skills chatbot-forge delivery-agent qa-framework "$SCRATCH/old/"
```

- [ ] **Step 2: Move prompt sources** (the eight `git mv` lines for `src/01…08` listed under Files; `mkdir -p` the target `prompts/` dirs first).

- [ ] **Step 3: Move authored skills.** For each of the 8 doc-gen skills, `git mv skills/<s> src/plugins/<p>/skills/<s>` then remove the generated files from source:

```bash
for s in brd-generator prd-generator technical-design-generator estimation-generator test-planner test-case-generator test-executor spec-generator; do
  d=$(ls -d src/plugins/*/skills/$s)
  git rm -q --cached "$d/resources/prompt.md" "$d/resources/document-formatting-standard.md" && rm "$d/resources/prompt.md" "$d/resources/document-formatting-standard.md"
done
d=src/plugins/rs-scoping/skills/estimation-generator/resources
git rm -q "$d/master-context-pack.md" "$d/estimation-template.xlsx"
```

Then the delivery-agent, chatbot-forge, d2-diagrams, product-thinking-course, qa-framework moves listed under Files. Move d2's untracked `node_modules` with plain `mv` (or delete it — the skill runs `npm install` on first use). `git rm -r -q skills chatbot-forge delivery-agent .claude-plugin/plugin.json src/chatbot-forge/.claude-plugin src/delivery-agent/.claude-plugin`; `rmdir` the now-empty `src/chatbot-forge src/delivery-agent src/product-management`.

- [ ] **Step 4: Manifests.** Write the six `src/plugins/<p>/.claude-plugin/plugin.json` from the Manifest template. `rs-delivery` additionally gets `"dependencies": ["superpowers", "rs-scoping"]` (carried from delivery-agent's `["superpowers", "rightshift-doc-gen"]`; Task 5 refines it).

- [ ] **Step 5: sync.json files**

`src/plugins/rs-scoping/sync.json`:

```json
{
  "prompts": {
    "brd-generator": "prompts/01-brd-generator/current/brd-generator-v4.md",
    "prd-generator": "prompts/02-prd-generator/current/prd-generator-v7.md",
    "technical-design-generator": "prompts/03-technical-design/current/technical-design-generator-v1.md",
    "estimation-generator": "prompts/04-estimation-agent/improvements/estimation-agent-v2.md"
  },
  "copy": [
    { "from": "src/plugins/rs-scoping/prompts/04-estimation-agent/template/IntuitioLabs - Estimation Template.xlsx", "to": "skills/estimation-generator/resources/estimation-template.xlsx" },
    { "from": "src/standards/document-formatting-standard.md", "to": "skills/brd-generator/resources/document-formatting-standard.md" },
    { "from": "src/standards/document-formatting-standard.md", "to": "skills/prd-generator/resources/document-formatting-standard.md" },
    { "from": "src/standards/document-formatting-standard.md", "to": "skills/technical-design-generator/resources/document-formatting-standard.md" },
    { "from": "src/standards/document-formatting-standard.md", "to": "skills/estimation-generator/resources/document-formatting-standard.md" }
  ],
  "post": ["tools/extract_pack.py"]
}
```

`src/plugins/rs-qa/sync.json`:

```json
{
  "prompts": {
    "test-planner": "prompts/05-test-planner/current/test-planner-v1.md",
    "test-case-generator": "prompts/06-test-case-generator/current/test-case-generator-v1.md",
    "test-executor": "prompts/07-test-executor/current/test-executor-v1.md"
  },
  "copy": [
    { "from": "src/standards/document-formatting-standard.md", "to": "skills/test-planner/resources/document-formatting-standard.md" },
    { "from": "src/standards/document-formatting-standard.md", "to": "skills/test-case-generator/resources/document-formatting-standard.md" },
    { "from": "src/standards/document-formatting-standard.md", "to": "skills/test-executor/resources/document-formatting-standard.md" }
  ]
}
```

`src/plugins/rs-delivery/sync.json`:

```json
{
  "prompts": { "spec-generator": "prompts/08-spec-generator/current/spec-generator-v2.md" },
  "copy": [
    { "from": "src/standards/document-formatting-standard.md", "to": "skills/spec-generator/resources/document-formatting-standard.md" }
  ]
}
```

- [ ] **Step 6: extract_pack.py paths** — in `src/plugins/rs-scoping/tools/extract_pack.py` set:

```python
SRC = Path("src/plugins/rs-scoping/prompts/04-estimation-agent/current/estimation-generation-from-prd-v1.6.md")
OUT = Path("plugins/rs-scoping/skills/estimation-generator/resources/master-context-pack.md")
```

- [ ] **Step 7: Makefile** — replace the variable block and the `help`/`sync`/`dist`/`install-claude-code`/`verify` targets (keep `orchestrator-setup`, `provision`, `run-managed`, `run-sdk`, `clean` as-is):

```make
# Makefile — generate & deploy the RightShift rs-* plugins (see docs/DEPLOYMENT.md).
# Uses '>' as the recipe prefix (not tab) for robustness. Requires GNU Make 3.82+.
# Sources live under src/plugins/<name>/; plugins/<name>/ is generated by 'make sync' — never hand-edit it.
.RECIPEPREFIX := >
.DEFAULT_GOAL := help
SHELL := /bin/bash

# ONE plugin list. Adding a plugin = one entry here + src/plugins/<name>/ + a marketplace.json entry.
PLUGINS   := rs-scoping rs-delivery rs-qa rs-product rs-chatbot rs-common
SRC_DIR   := src
DIST      := dist
CC_SKILLS := .claude/skills
SYNC_FLAGS := $(if $(filter 1,$(FORCE)),--force,)

PACKET ?=

.PHONY: help sync dist install-claude-code orchestrator-setup provision run-sdk run-managed verify test clean

help:
> @echo "RightShift plugins — make targets:"
> @echo "  make sync                 regenerate plugins/<name>/ from $(SRC_DIR)/plugins/ (refuses to overwrite uncommitted plugins/ edits unless FORCE=1)"
> @echo "  make dist                 zip every skill into $(DIST)/ (artifacts for claude.ai upload)"
> @echo "  make install-claude-code  copy every skill into $(CC_SKILLS) (Method 1: Claude Code)"
> @echo "  make orchestrator-setup   pip install the runner deps (Methods 3 & 4)"
> @echo "  make provision            create the hosted agent + environment (Method 3: Managed Agents)"
> @echo "  make run-sdk PACKET=path/to/packet.md      run the full pipeline via the Agent SDK (Method 4)"
> @echo "  make run-managed PACKET=path/to/packet.md  run the full pipeline on the hosted agent (Method 3)"
> @echo "  make verify               check every plugin, skill and the marketplace + smoke-test the fill script"
> @echo "  make test                 unit-test the sync/verify tooling"
> @echo "  make clean                remove $(DIST)/, $(CC_SKILLS)/, $(SRC_DIR)/orchestrator/runs/"

sync:
> python3 $(SRC_DIR)/tools/sync_plugins.py $(SYNC_FLAGS) $(PLUGINS)

dist: sync
> mkdir -p $(DIST)
> for p in $(PLUGINS); do for d in plugins/$$p/skills/*/; do s=$$(basename $$d); rm -f "$(DIST)/$$s.zip"; (cd plugins/$$p/skills && zip -qr "$(CURDIR)/$(DIST)/$$s.zip" "$$s") && echo "  packaged $(DIST)/$$s.zip"; done; done

install-claude-code: sync
> mkdir -p $(CC_SKILLS)
> for p in $(PLUGINS); do for d in plugins/$$p/skills/*/; do s=$$(basename $$d); rm -rf "$(CC_SKILLS)/$$s"; cp -R "$$d" "$(CC_SKILLS)/$$s" && echo "  installed $$s"; done; done
> @echo ">> connect Notion:  claude mcp add --transport http notion https://mcp.notion.com/mcp"

verify:
> python3 $(SRC_DIR)/tools/verify_plugins.py $(PLUGINS)

test:
> python3 -m unittest discover -s $(SRC_DIR)/tools/tests
```

Then `git rm src/tools/verify_skills.py`.

- [ ] **Step 8: marketplace.json** — `plugins` array becomes: six entries from the Marketplace entry template (same order as `PLUGINS`) + the unchanged `superpowers` entry. Remove `rightshift-doc-gen`, `chatbot-forge`, `delivery-agent`.

- [ ] **Step 9: .versionrc.json** — replace the `.claude-plugin/plugin.json` bumpFile with one `{ "filename": "src/plugins/<p>/.claude-plugin/plugin.json", "type": "json" }` and one `{ "filename": "plugins/<p>/.claude-plugin/plugin.json", "type": "json" }` per current plugin (later tasks append theirs).

- [ ] **Step 10: Generate + verify**

```bash
make sync FORCE=1 && make verify && make test
```

Expected: `VERIFY: PASS`, estimation smoke test OK, unit tests OK.

- [ ] **Step 11: Identity check** — generated skills must match the snapshot:

```bash
for p in rs-scoping rs-qa rs-delivery; do for d in plugins/$p/skills/*/; do s=$(basename $d)
  [ -d "$SCRATCH/old/skills/$s" ] && diff -r "$SCRATCH/old/skills/$s" "$d" && echo "same $s"; done; done
diff -r "$SCRATCH/old/qa-framework" plugins/rs-qa/skills/qa-test-planner
for s in "$SCRATCH"/old/delivery-agent/skills/*/; do diff -r "$s" plugins/rs-delivery/skills/$(basename $s); done
diff -r "$SCRATCH/old/chatbot-forge/skills/chatbot-forge" plugins/rs-chatbot/skills/chatbot-forge
diff -r "$SCRATCH/old/skills/d2-diagrams" plugins/rs-common/skills/d2-diagrams
diff -r "$SCRATCH/old/skills/product-thinking-course" plugins/rs-product/skills/product-thinking-course
```

Expected: no diff output. Any difference = a sync rule is wrong; fix `sync.json`, never the generated file.

- [ ] **Step 12: Determinism** — `git add -A && make sync && git status --porcelain plugins/` → empty.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "refactor!: split rightshift-doc-gen, chatbot-forge and delivery-agent into rs-* plugins

Sources move under src/plugins/<name>/ and are generated into plugins/<name>/ by
make sync. Root is no longer a plugin.

BREAKING CHANGE: rightshift-doc-gen, chatbot-forge and delivery-agent no longer exist;
install rs-scoping, rs-qa, rs-delivery, rs-chatbot, rs-common, rs-product instead."
```

(`git status` must not stage `chatbot-forge-feedback.md` or the guide PDF — they are untracked user files; use `git add src plugins .claude-plugin Makefile .versionrc.json` plus the deletions if `-A` would pick them up.)

---

### Task 5: Repoint consumers

**Files:**
- Modify: `package.json` (`files`, `description`), `bin/install.js`, `src/orchestrator/pipeline.yaml`, `src/orchestrator/run_pipeline_sdk.py` (docstring/comment paths), `src/orchestrator/provision_agent.py` (docstring path), `src/plugins/rs-delivery/**` (`rightshift-doc-gen` refs), `src/plugins/rs-delivery/.claude-plugin/plugin.json` (`dependencies`), `docs/templates/rightshift-project/.claude/settings.json`.

- [ ] **Step 1: Failing check** — `grep -rn "rightshift-doc-gen\|\.\./\.\./skills\|\"skills/\"" package.json bin src/orchestrator src/plugins docs/templates` → matches (expected before the change).
- [ ] **Step 2: package.json** — `"files": ["plugins/", "bin/"]`; `"description": "RightShift rs-* Claude plugins — sources under src/plugins/, generated into plugins/ by \`make sync\`."`.
- [ ] **Step 3: bin/install.js** — replace the single-dir loop with a walk over `plugins/*/skills/*`:

```js
const pkgPlugins = path.join(__dirname, "..", "plugins");
// …existsSync check now on pkgPlugins, message "plugins/ not found in package"…
let n = 0;
for (const p of fs.readdirSync(pkgPlugins, { withFileTypes: true })) {
  const skillsDir = path.join(pkgPlugins, p.name, "skills");
  if (!p.isDirectory() || !fs.existsSync(skillsDir)) continue;
  for (const d of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const from = path.join(skillsDir, d.name);
    if (!fs.existsSync(path.join(from, "SKILL.md"))) continue; // only real skills
    const to = path.join(target, d.name);
    fs.rmSync(to, { recursive: true, force: true });
    fs.cpSync(from, to, { recursive: true });
    console.log(`  installed ${d.name} (${p.name})`);
    n++;
  }
}
```

Update the header comment ("Copies each skill folder from this package's plugins/*/skills/ …").
- [ ] **Step 4: Orchestrator** — `pipeline.yaml`: `skills_dir: ../../plugins/rs-scoping/skills` and comment line 39 → `# Skills live in ../../plugins/rs-scoping/skills/ (generated by make sync).`; `run_pipeline_sdk.py` default `CFG.get("skills_dir", "../../plugins/rs-scoping/skills")` and docstring path; `provision_agent.py` docstring `../../plugins/rs-scoping/skills`.
- [ ] **Step 5: rs-delivery references** — in each `src/plugins/rs-delivery/**` match: BRD/PRD/Technical-Design skills → "`rs-scoping`"; spec-generator → "this plugin (`rs-delivery`)"; plugin-dependency wording → "`rs-scoping`". If any skill invokes test-planner/test-case-generator/test-executor, add `rs-qa` to `dependencies`; otherwise `["superpowers", "rs-scoping"]`.
- [ ] **Step 6: Template settings** — in `docs/templates/rightshift-project/.claude/settings.json` replace the two entries with `"rs-scoping@rightshift": true, "rs-delivery@rightshift": true, "rs-qa@rightshift": true, "rs-common@rightshift": true` (keep `superpowers` entry if present).
- [ ] **Step 7: Verify** — re-run Step 1 grep → no matches. `make sync && make verify`. Installer: `node bin/install.js --help` then `(cd "$SCRATCH" && rm -rf inst && mkdir inst && cd inst && node <repo>/bin/install.js)` → reports every skill installed, count = number of `plugins/*/skills/*`.
- [ ] **Step 8: Commit** `fix: repoint installer, orchestrator, delivery skills and project template at rs-* plugins`.

---

### Tasks 6–12: Prompt-backed wrapper plugins

All seven follow the same procedure. Each task lists its prompt moves and skills.

#### Wrapper procedure (apply per task)

1. **Failing test first.** Create `src/plugins/<p>/.claude-plugin/plugin.json` (if new plugin), add `<p>` to `PLUGINS` (in final-order position), add its marketplace entry and its two `.versionrc.json` bumpFiles. Run `make sync && make verify` → **FAIL** with `<p>: no skills (empty plugin)` (or, for existing plugins, `missing SKILL.md` after `mkdir` of the skill dirs). Do not commit.
2. **Move prompts** with `git mv` to `src/plugins/<p>/prompts/<skill>/current/<original-file>.md`.
3. **Write each `src/plugins/<p>/skills/<skill>/SKILL.md`.** Read the whole prompt first. Template:

```markdown
---
name: <skill>
description: <One sentence: what it produces, from what input. Then: Trigger on "<2–3 phrases a user would actually say>". ≤ 1024 chars, no line breaks.>
---

# <Title Case Name>

<1–2 sentences: what the prompt does, in its own terms.>

## When to use

<When to reach for it — inputs it needs, where it sits relative to neighbouring skills in this plugin.>

## Not for

<The plugin row's "Not for" clause, made specific to this skill.>

## How to run

Read `resources/prompt.md` and follow it exactly — it is the canonical prompt (source:
`src/plugins/<p>/prompts/<skill>/current/<file>`). Ask the user for any required inputs it lists
before starting.
```

4. **`sync.json`** — add every skill to `prompts` (`"<skill>": "prompts/<skill>/current/<file>.md"`), plus any `copy` entries the task lists.
5. `make sync && make verify && make test` → PASS.
6. **Commit** `feat(<p>): add <p> plugin with <N> skills` (Task 6: `feat(rs-scoping): wrap opportunity-packet, feature-pov-narrative, google-estimation-sheet-extractor`).

#### Task 6: rs-scoping supporting prompts (existing plugin)

| Skill | From |
|---|---|
| opportunity-packet | `src/supporting/create-opportunity-packet-v1.md` |
| feature-pov-narrative | `src/supporting/feature-pov-narrative-v1.md` |
| google-estimation-sheet-extractor | `src/supporting/google-estimation-sheet-extractor-v1.md` |

Also `git mv src/supporting/README.md src/plugins/rs-scoping/prompts/SUPPORTING.md`; `src/supporting/` then removed.

#### Task 7: rs-research (new)

| Skill | From `src/prompts/discovery-strategy/` |
|---|---|
| company-research | `company-research-v1.md` |
| market-analyzer | `market-analyzer-v1.md` |
| competitive-and-market-research | `competitive-and-market-research-v1.md` |
| customer-discovery-question-optimizer | `customer-discovery-question-optimizer-v1.md` |
| problem-statement-analyzer | `problem-statement-analyzer-v1.md` |

#### Task 8: rs-sales (new)

| Skill | From `src/prompts/` |
|---|---|
| gamma-prototype-proposal-deck | `sales-deal/gamma-prototype-proposal-deck-v3.md` |
| gamma-platform-proposal | `sales-deal/gamma-platform-proposal-generation-v1.md` |
| startup-pitch-deck-generator | `sales-deal/startup-pitch-deck-generator-v2.md` |
| contract-creator | `sales-deal/contract-creator-v1.md` |
| outbound-sales-machine | `sales-deal/outbound-sales-machine-v1.md` |
| pitch-deck-analyzer | `quality-review/pitch-deck-analyzer-v1.md` |
| executive-summary-evaluator | `quality-review/executive-summary-evaluator-v1.md` |

#### Task 9: rs-content (new)

| Skill | From `src/prompts/` |
|---|---|
| deep-voice-guide | `internal-enablement/deep-voice-guide-v1.md` |
| linkedin-post-machine | `gtm-traction/linkedin-post-machine-v1.md` |
| case-study-and-testimonial-generator | `gtm-traction/case-study-and-testimonial-generator-v2.md` |
| rightshift-traction | `gtm-traction/rightshift-traction-v1.md` |
| ai-adoption-one-pager | `gtm-traction/ai-adoption-rightshift-one-pager-v1.md` |
| speaking-engagement | the four `gtm-traction/speaking-engagement-*.md` |
| cross-page-editorial-consistency-audit | `quality-review/cross-page-editorial-consistency-audit-v1.md` |
| client-communication-qa | `quality-review/client-communication-qa-v1.md` |

**speaking-engagement exception:** move all four files to `prompts/speaking-engagement/current/`; no `prompts` entry; instead four `copy` entries to `skills/speaking-engagement/resources/<same-file-name>`. Its `SKILL.md` *How to run* lists the four phases (pitch deck → pre-event email → RSVP enrichment → post-event email) with the resource file for each, and says "ask which phase; read only that file". Verify adds no prompt check for it (not in `prompts`), so in step 5 also `ls plugins/rs-content/skills/speaking-engagement/resources/` → 4 files.

#### Task 10: rs-design (new)

| Skill | From `src/prompts/` |
|---|---|
| saas-uiux-designer-figma | `build-prototype-mvp/saas-uiux-designer-figma-v1.1.md` |
| design-reference-to-css-spec | `build-prototype-mvp/design-reference-to-css-spec-v1.md` |
| figma-page-review-vs-brief | `quality-review/figma-page-review-vs-brief-v1.md` |
| page-design-evaluation-generic | `quality-review/page-design-evaluation-generic-v1.md` |
| rightshift-site-design-evaluation | `quality-review/rightshift-site-design-evaluation-v1.md` |
| rightshift-identity | `brand-identity/rightshift-identity-v1.md` |

#### Task 11: rs-prototype (new)

| Skill | From `src/prompts/build-prototype-mvp/` |
|---|---|
| html-prototype-generator | `html-prototype-generator-v1.md` |
| nextjs-prototype-generator | `nextjs-prototype-generator-v4.md` |
| rightshift-spark | `rightshift-spark-v1.md` |
| rightshift-propel | `rightshift-propel-v1.md` |
| rightshift-feature-generator | `rightshift-feature-generator-v1.md` |
| prototype-to-mvp-feature-generation | `prototype-to-mvp-feature-generation-v1.md` |
| prototype-feature-audit-and-ideation | `prototype-feature-audit-and-ideation-v1.md` |

#### Task 12: rs-project-management (new), rs-chatbot + rs-common additions, empty src/prompts

| Plugin | Skill | From `src/prompts/` |
|---|---|---|
| rs-project-management | prd-to-linear-sprint-mapper | `delivery-ops/prd-to-linear-sprint-mapper-v3.md` |
| rs-chatbot | chatbot-personality-rulebook | `engineering/chatbot-personality-rulebook-v1.md` |
| rs-chatbot | chatbot-behaviour-and-fallback | `engineering/chatbot-behaviour-and-fallback-v1.md` |
| rs-common | document-formatting-standard | (no prompt) |

- `git mv src/prompts/delivery-ops/hour-reporting-invoice-reconciliation-idea.md src/plugins/rs-project-management/prompts/hour-reporting-invoice-reconciliation/current/` — **no skill** (idea stage).
- `rs-common/document-formatting-standard`: `SKILL.md` (*How to run*: "Read `resources/document-formatting-standard.md` and apply it to the document being produced"); `src/plugins/rs-common/sync.json` = `{"copy": [{"from": "src/standards/document-formatting-standard.md", "to": "skills/document-formatting-standard/resources/document-formatting-standard.md"}]}`.
- `git rm src/prompts/misc/untitled-new-page.md`. Move `src/prompts/README.md` content into `src/_meta/catalog.md` only if it carries information the catalog lacks; otherwise `git rm` it. Update `src/_meta/catalog.md` "Local copies live in `prompts/<category>/`" → "Local copies live in `src/plugins/<plugin>/prompts/<skill>/current/`" and each section heading path.
- Done when `ls src/prompts src/supporting 2>&1` → both "No such file or directory", and `PLUGINS` has all twelve in final order.
- Commit `feat(rs-project-management): add plugin; wrap chatbot prompts and formatting standard`.

---

### Task 13: Marketplace renames + docs

**Files:** `.claude-plugin/marketplace.json`, `README.md`, `docs/SOP.md`, `docs/DEPLOYMENT.md`, `docs/templates/rightshift-project/AGENTS.md`, `docs/templates/rightshift-project/README.md`.

- [ ] **Step 1: renames semantics.** Read the Claude Code plugin-marketplace docs (`https://code.claude.com/docs/en/plugin-marketplaces` — use the claude-code-guide agent or WebFetch) for a marketplace `renames` field. Decision rule:
  - Supported and maps one old name → one new name: add `rightshift-doc-gen → rs-scoping`, `chatbot-forge → rs-chatbot`, `delivery-agent → rs-delivery`, and note in DEPLOYMENT.md that `rs-qa`/`rs-common` still need a manual install.
  - Not supported / one-to-many unclear: add nothing; DEPLOYMENT.md gets the manual uninstall/install commands.
  - Record the finding (with doc URL) in the commit body.
- [ ] **Step 2: Docs.** Replace plugin names, `skills/` paths and install commands. Include the guide's *Updating a skill* flow (edit `src/plugins/` → `make verify` → `make sync` → Conventional Commit → `npm run release` → push with tags) and the version-pin warning, and the twelve-plugin table (plugin + "reach for it when"). Do not touch `CHANGELOG.md` or historical `docs/superpowers/` specs/plans.
- [ ] **Step 3:** `grep -rn "rightshift-doc-gen\|skills/<\|make sync.*skills/" README.md docs/SOP.md docs/DEPLOYMENT.md docs/templates` → only intentional migration mentions remain.
- [ ] **Step 4: Commit** `docs: document rs-* plugin taxonomy, install and update flow`.

---

### Task 14: Final verification (no commit unless a fix is needed)

- [ ] `make test` → OK. `make sync && git status --porcelain` → empty (apart from the two untracked user files).
- [ ] `make verify` → PASS listing 12 plugins.
- [ ] Deletion test: `rm plugins/rs-research/skills/company-research/SKILL.md && make verify` → FAIL with `missing SKILL.md`; restore with `git checkout plugins/rs-research`.
- [ ] `python3 -c "import json,glob;[json.load(open(f)) for f in glob.glob('plugins/*/.claude-plugin/plugin.json')+glob.glob('src/plugins/*/.claude-plugin/plugin.json')+['.claude-plugin/marketplace.json','.versionrc.json','package.json']]"` → no error; count `ls plugins | wc -l` = 12.
- [ ] If `claude plugin validate` exists (`claude plugin --help`), run it on `.` and each `plugins/rs-*`; fix any reported issue in `src/plugins/`.
- [ ] `make dist` → one zip per skill; `ls dist/*.zip | wc -l` = total skill count (`ls -d plugins/*/skills/*/ | wc -l`). `dist/` is gitignored.
- [ ] `npm run release:dry` → shows a **major** bump to `3.0.0` touching `package.json`, all 24 plugin manifests and `marketplace.json`. Do **not** run the real release.
- [ ] Report: commits on branch, final plugin/skill counts, renames decision, anything skipped.
