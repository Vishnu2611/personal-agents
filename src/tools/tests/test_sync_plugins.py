import json, subprocess, sys, tempfile, unittest
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
        write(src / "hooks" / "hooks.json", '{"hooks": {}}')
        write(src / "tests" / "hooks" / "t.test.cjs", "x")
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
        self.assertTrue((out / "hooks" / "hooks.json").exists())
        self.assertFalse((out / "tests").exists())
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


class PluginsDirtyTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.git("init", "-q")
        self.git("config", "user.email", "t@example.com")
        self.git("config", "user.name", "t")
        write(self.root / "plugins" / "rs-x" / "a.txt", "a")
        self.git("add", ".")
        self.git("commit", "-qm", "init")

    def git(self, *args):
        subprocess.run(["git", *args], cwd=self.root, check=True)

    def test_clean_is_not_dirty(self):
        self.assertFalse(sync_plugins.plugins_dirty(self.root))

    def test_untracked_file_is_dirty(self):
        write(self.root / "plugins" / "rs-x" / "new.txt", "n")
        self.assertTrue(sync_plugins.plugins_dirty(self.root))

    def test_staged_change_is_dirty(self):
        write(self.root / "plugins" / "rs-x" / "a.txt", "changed")
        self.git("add", "plugins")
        self.assertTrue(sync_plugins.plugins_dirty(self.root))

    def test_unstaged_change_is_dirty(self):
        write(self.root / "plugins" / "rs-x" / "a.txt", "changed")
        self.assertTrue(sync_plugins.plugins_dirty(self.root))


if __name__ == "__main__":
    unittest.main()
