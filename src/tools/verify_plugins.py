#!/usr/bin/env python3
"""Verify the generated plugins/ tree, manifests and marketplace. Run from repo root: make verify."""
import json, re, shutil, subprocess, sys, tempfile
from pathlib import Path

NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
PLUGIN_PATH_RE = re.compile(r"\$\{CLAUDE_PLUGIN_ROOT\}/([^\s\"']+)")


def _load_json(path: Path, label: str, errors: list[str]):
    """Load JSON file; append error and return None on failure."""
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        errors.append(f"{label}: file not found")
        return None
    except json.JSONDecodeError as e:
        errors.append(f"{label}: invalid JSON ({e})")
        return None


def frontmatter(text: str):
    if not text.startswith("---"):
        return None
    parts = text.split("---", 2)
    if len(parts) < 3:
        return None
    fm = {}
    lines = parts[1].splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if ":" in line and not line[:1].isspace():
            k, v = line.split(":", 1)
            k = k.strip()
            v = v.strip()
            # Check if v is a block scalar indicator
            if v in (">", "|", ">-", "|-", ">+", "|+"):
                # Collect indented lines
                block_lines = []
                i += 1
                while i < len(lines):
                    if not lines[i] or lines[i][0].isspace():
                        block_lines.append(lines[i].strip())
                        i += 1
                    else:
                        break
                v = " ".join(block_lines).strip()
            else:
                # Strip quotes only if they match on both sides
                if len(v) >= 2 and v[0] in ("\"", "'") and v[0] == v[-1]:
                    v = v[1:-1]
            fm[k] = v
        i += 1
    return fm


def check(root: Path, plugins: list[str]) -> list[str]:
    errors: list[str] = []

    # Load package.json
    pkg = _load_json(root / "package.json", "package.json", errors)
    if not pkg:
        return errors
    version = pkg.get("version")

    seen: dict[str, str] = {}
    for p in plugins:
        # Fix 1: Enforce rs- prefix
        if not p.startswith("rs-"):
            errors.append(f"{p}: plugin name must start with 'rs-'")

        base = root / "plugins" / p
        man = base / ".claude-plugin" / "plugin.json"
        if not man.exists():
            errors.append(f"{p}: missing .claude-plugin/plugin.json")
            continue
        try:
            m = json.loads(man.read_text(encoding="utf-8"))
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
        if not skills and not (base / "hooks" / "hooks.json").exists():
            errors.append(f"{p}: no skills or hooks (empty plugin)")
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

        errors += check_hooks(base, p)

        # Handle sync.json errors gracefully
        sync = root / "src" / "plugins" / p / "sync.json"
        if sync.exists():
            sync_data = _load_json(sync, f"{p}/sync.json", errors)
            if sync_data:
                for sk in sync_data.get("prompts", {}):
                    if not (sdir / sk / "resources" / "prompt.md").exists():
                        errors.append(f"{p}/{sk}: missing resources/prompt.md (run make sync)")

    # Load marketplace.json
    mk = _load_json(root / ".claude-plugin" / "marketplace.json", "marketplace.json", errors)
    if not mk:
        return errors

    # Build local plugins dict, handling entries without names
    local = {}
    for e in mk.get("plugins", []):
        if not isinstance(e, dict):
            continue
        if "name" not in e:
            errors.append("marketplace: entry without a name")
            continue
        if isinstance(e.get("source"), str):
            local[e["name"]] = e["source"]

    for p in plugins:
        if local.get(p) != f"./plugins/{p}":
            errors.append(f"marketplace: {p} missing or source != ./plugins/{p}")
    for n, src in local.items():
        if n not in plugins:
            errors.append(f"marketplace: '{n}' (source {src}) is not in PLUGINS")
    if (root / ".claude-plugin" / "plugin.json").exists():
        errors.append("root .claude-plugin/plugin.json must not exist (root is not a plugin)")
    return errors


def check_hooks(base: Path, p: str) -> list[str]:
    """If the plugin ships hooks/hooks.json: valid shape, referenced scripts exist, JS scripts parse."""
    hj = base / "hooks" / "hooks.json"
    if not hj.exists():
        return []
    errors: list[str] = []
    data = _load_json(hj, f"{p}/hooks/hooks.json", errors)
    if data is None:
        return errors
    events = data.get("hooks") if isinstance(data, dict) else None
    if not isinstance(events, dict) or not events:
        return [f"{p}/hooks/hooks.json: missing or empty 'hooks' object"]
    scripts: set[str] = set()
    for event, entries in events.items():
        if not isinstance(entries, list):
            errors.append(f"{p}/hooks/hooks.json: {event} must be a list")
            continue
        for entry in entries:
            handlers = entry.get("hooks") if isinstance(entry, dict) else None
            if not isinstance(handlers, list) or not handlers:
                errors.append(f"{p}/hooks/hooks.json: {event} entry has no 'hooks' list")
                continue
            for h in handlers:
                if not isinstance(h, dict) or h.get("type") != "command" or not h.get("command"):
                    errors.append(f"{p}/hooks/hooks.json: {event} handler must be a command with 'command'")
                    continue
                scripts.update(PLUGIN_PATH_RE.findall(h["command"]))
    node = shutil.which("node")
    for rel in sorted(scripts):
        f = base / rel
        if not f.is_file():
            errors.append(f"{p}/hooks/hooks.json: referenced script {rel} not found")
        elif f.suffix in (".js", ".cjs", ".mjs"):
            if node is None:
                print(f"  SKIP: node not installed; cannot syntax-check {p}/{rel}")
                continue
            r = subprocess.run([node, "--check", str(f)], capture_output=True, text=True)
            if r.returncode != 0:
                errors.append(f"{p}/{rel}: node --check failed: {r.stderr.strip().splitlines()[0] if r.stderr.strip() else 'error'}")
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
