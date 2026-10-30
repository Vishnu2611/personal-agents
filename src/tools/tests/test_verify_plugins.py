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
            {"name": "mattpocock-skills", "source": {"source": "github", "repo": "mattpocock/skills"}},
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

    def test_hooks_only_plugin_passes(self):
        (self.root / "plugins/rs-b/skills/two/SKILL.md").unlink()
        (self.root / "plugins/rs-b/skills/two").rmdir()
        write(self.root / "plugins/rs-b/hooks/hooks.json", json.dumps({"hooks": {"SessionStart": [
            {"hooks": [{"type": "command", "command": "true"}]}]}}))
        self.assertEqual(self.errs(), [])

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

    # Fix 1: Enforce rs- prefix
    def test_plugin_name_must_start_with_rs_fails(self):
        write(self.root / "plugins/x-b/.claude-plugin/plugin.json",
              json.dumps({"name": "x-b", "version": "2.4.0", "description": "d"}))
        skill(self.root, "x-b", "two-b")
        self.market["plugins"].append({"name": "x-b", "source": "./plugins/x-b"})
        self._market()
        e = verify_plugins.check(self.root, ["rs-a", "rs-b", "x-b"])
        self.assertTrue(any("must start with 'rs-'" in x for x in e))

    # Fix 2: Block scalar frontmatter
    def test_block_scalar_description_with_content_passes(self):
        body = "---\nname: four\ndescription: >\n  This is a\n  multi-line description\n---\n# x\n"
        write(self.root / "plugins/rs-a/skills/four/SKILL.md", body)
        self.assertEqual(self.errs(), [])

    def test_block_scalar_description_empty_fails(self):
        body = "---\nname: five\ndescription: >\n---\n# x\n"
        write(self.root / "plugins/rs-a/skills/five/SKILL.md", body)
        e = self.errs()
        self.assertTrue(any("missing description" in x for x in e))

    # Fix 3: Malformed JSON
    def test_invalid_package_json_fails(self):
        write(self.root / "package.json", '{"version": "2.4.0" BROKEN}')
        e = self.errs()
        self.assertTrue(any("package.json" in x for x in e))

    def test_invalid_marketplace_json_fails(self):
        write(self.root / ".claude-plugin/marketplace.json", '{"name": "rightshift" BROKEN}')
        e = self.errs()
        self.assertTrue(any("marketplace.json" in x for x in e))

    def test_invalid_sync_json_fails(self):
        write(self.root / "src/plugins/rs-a/sync.json", '{"prompts": {"one" BROKEN}')
        e = self.errs()
        self.assertTrue(len(e) > 0)

    def test_marketplace_entry_without_name_is_skipped(self):
        self.market["plugins"].append({"source": "./plugins/missing-name"})
        self._market()
        e = verify_plugins.check(self.root, ["rs-a", "rs-b"])
        self.assertTrue(any("entry without a name" in x for x in e))


class HooksCheckTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.base = Path(self.tmp.name) / "plugins" / "rs-a"
        self.hooks = {"hooks": {"PreToolUse": [{"matcher": "Bash", "hooks": [
            {"type": "command", "command": 'node "${CLAUDE_PLUGIN_ROOT}/hooks/pre-bash.cjs"'}]}]}}
        write(self.base / "hooks" / "pre-bash.cjs", "'use strict';\nmodule.exports = 1;\n")
        self._hooks()

    def _hooks(self):
        write(self.base / "hooks" / "hooks.json", json.dumps(self.hooks))

    def errs(self):
        return verify_plugins.check_hooks(self.base, "rs-a")

    def test_no_hooks_dir_passes(self):
        self.assertEqual(verify_plugins.check_hooks(Path(self.tmp.name) / "nope", "rs-x"), [])

    def test_valid_hooks_pass(self):
        self.assertEqual(self.errs(), [])

    def test_invalid_json_fails(self):
        write(self.base / "hooks" / "hooks.json", "{BROKEN")
        self.assertTrue(any("invalid JSON" in e for e in self.errs()))

    def test_empty_hooks_object_fails(self):
        self.hooks = {"hooks": {}}
        self._hooks()
        self.assertTrue(any("missing or empty" in e for e in self.errs()))

    def test_handler_without_command_fails(self):
        self.hooks["hooks"]["PreToolUse"][0]["hooks"][0] = {"type": "command"}
        self._hooks()
        self.assertTrue(any("must be a command" in e for e in self.errs()))

    def test_missing_script_fails(self):
        (self.base / "hooks" / "pre-bash.cjs").unlink()
        self.assertTrue(any("not found" in e for e in self.errs()))

    @unittest.skipIf(verify_plugins.shutil.which("node") is None, "node not installed")
    def test_script_syntax_error_fails(self):
        write(self.base / "hooks" / "pre-bash.cjs", "function (\n")
        self.assertTrue(any("node --check failed" in e for e in self.errs()))


if __name__ == "__main__":
    unittest.main()
