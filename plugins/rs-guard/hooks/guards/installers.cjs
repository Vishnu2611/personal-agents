'use strict';
// Deny the agent running the harness installer (`rs-doctor --install`, `rightshift-skills doctor
// --install`): it runs third-party code and downloads a browser, so only a human may start it.
// Checked on raw commands: `node .../rs-doctor.cjs` would otherwise be skipped as a text carrier.
const { splitCommands, normalize, basename } = require('../lib/shell.cjs');

function isInstaller(argv) {
  if (!argv.includes('--install')) return false;
  if (argv.some((a) => basename(a) === 'rs-doctor.cjs' || basename(a) === 'rs-doctor')) return true;
  const i = argv.findIndex((a) => basename(a) === 'rightshift-skills' || /^rightshift-skills(@|$)/.test(a)
    || /(^|\/)bin\/install\.js$/.test(a));
  return i !== -1 && argv[i + 1] === 'doctor';
}

module.exports = {
  name: 'installers',
  check({ rawCommand }) {
    const hit = splitCommands(rawCommand).map(normalize).some(isInstaller);
    return hit
      ? 'Blocked: installing the harness tools runs third-party code, so only the human may run it. '
        + 'Show them the command and ask them to run it in their own terminal.'
      : null;
  },
};
