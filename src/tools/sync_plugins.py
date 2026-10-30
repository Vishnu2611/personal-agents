#!/usr/bin/env python3
"""Generate plugins/<name>/ from src/plugins/<name>/. Run from the repo root (the Makefile's `sync`).

Copies only the shipped parts (.claude-plugin/, skills/, hooks/, README.md), then applies the plugin's
optional sync.json:
  prompts: {skill: "prompts/.../file.md"}           -> skills/<skill>/resources/prompt.md
  copy:    [{"from": <repo-relative>, "to": <plugin-relative>}]
  post:    ["tools/script.py"]                     -> run with cwd = repo root
Refuses to run when plugins/ has uncommitted edits unless --force (guard against hand-editing).
"""
import argparse, json, shutil, subprocess, sys
from pathlib import Path

SHIPPED = (".claude-plugin", "skills", "hooks", "README.md")
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


def plugins_dirty(root: Path) -> bool:
    """True if plugins/ has staged, unstaged or untracked changes that a sync would overwrite."""
    out = subprocess.run(["git", "status", "--porcelain", "--", "plugins"], cwd=root,
                         capture_output=True, text=True, check=True).stdout
    return bool(out.strip())


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    ap.add_argument("plugins", nargs="+")
    args = ap.parse_args()
    root = Path.cwd()
    if not args.force and plugins_dirty(root):
        sys.exit("!! plugins/ has uncommitted edits that 'make sync' would OVERWRITE.\n"
                 "!! Move them into src/plugins/ or re-run with FORCE=1 to discard them.")
    for name in args.plugins:
        sync_plugin(root, name)
        print(f"  synced plugins/{name}")
    print(">> sync complete")


if __name__ == "__main__":
    main()
