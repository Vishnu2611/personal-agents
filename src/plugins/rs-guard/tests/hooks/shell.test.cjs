'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { splitCommands, stepsOf } = require(path.join(require('./helpers.cjs').HOOKS, 'lib', 'shell.cjs'));

test('splits on operators and keeps quoted words whole', () => {
  assert.deepEqual(splitCommands('git add a && git commit -m "x && y"; ls | wc -l'),
    [['git', 'add', 'a'], ['git', 'commit', '-m', 'x && y'], ['ls'], ['wc', '-l']]);
});

test('handles single quotes, escapes and line continuations', () => {
  assert.deepEqual(splitCommands("echo 'a b' c\\ d \\\n e"), [['echo', 'a b', 'c d', 'e']]);
});

test('drops redirections and their targets', () => {
  assert.deepEqual(splitCommands('git push origin main 2>&1 > out.log'), [['git', 'push', 'origin', 'main']]);
  assert.deepEqual(splitCommands('git push origin x>out.log'), [['git', 'push', 'origin', 'x']]);
});

test('skips heredoc bodies', () => {
  const cmd = "cat > f.md <<'EOF'\ngh pr create\ngit push --force\nEOF\ngit status";
  assert.deepEqual(splitCommands(cmd), [['cat'], ['git', 'status']]);
});

test('skips indented <<- heredoc bodies', () => {
  assert.deepEqual(splitCommands('cat <<-END\n\tgh pr create\n\tEND\nls'), [['cat'], ['ls']]);
});

test('ignores comments', () => {
  assert.deepEqual(splitCommands('ls # gh pr create'), [['ls']]);
});

const argvs = (cmd, cwd = '/w') => stepsOf(cmd, cwd).map((s) => s.argv);
const cwds = (cmd, cwd = '/w') => stepsOf(cmd, cwd).map((s) => s.cwd);

test('stepsOf strips env assignments and prefixes, drops text carriers', () => {
  assert.deepEqual(argvs('FOO=1 env -i sudo gh pr create; echo gh pr create; python3 -c x'),
    [['gh', 'pr', 'create']]);
});

test('stepsOf sees commands in subshells', () => {
  assert.deepEqual(argvs('(cd x && git push -f)'), [['git', 'push', '-f']]);
});

test('stepsOf follows cd for the commands after it', () => {
  assert.deepEqual(cwds('ls; cd ../be && gh pr create; cd /abs; ls'), ['/w', '/be', '/abs']);
  assert.deepEqual(cwds('cd -P -- sub && ls'), ['/w/sub']);
  assert.deepEqual(cwds('pushd sub && ls'), ['/w/sub']);
});

test('stepsOf resolves ~ and a bare cd against HOME', (t) => {
  const home = process.env.HOME;
  t.after(() => { process.env.HOME = home; });
  process.env.HOME = '/home/u';
  assert.deepEqual(cwds('cd ~/be && ls; cd && ls'), ['/home/u/be', '/home/u']);
});

test('stepsOf marks the directory unknown after a run-time cd', () => {
  assert.deepEqual(cwds('cd "$REPO" && ls'), [null]);
  assert.deepEqual(cwds('cd - && ls'), [null]);
  assert.deepEqual(cwds('cd be* && ls'), [null]);
  assert.deepEqual(cwds('pushd x; popd; ls'), [null]);
  assert.deepEqual(cwds('cd "$REPO"; cd /abs && ls'), ['/abs']);
});

test('a cd inside a subshell or $(...) ends with it', () => {
  assert.deepEqual(cwds('(cd /other && ls) && gh pr create'), ['/other', '/w']);
  assert.deepEqual(cwds('x=$(cd /other; pwd); gh pr create'), ['/other', '/w']);
});
