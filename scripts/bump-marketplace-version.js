// commit-and-tag-version custom updater for .claude-plugin/marketplace.json.
// The marketplace stores its version at metadata.version (not a root "version" field),
// so the built-in json updater can't touch it — this reads/writes the nested field.
module.exports = {
  readVersion(contents) {
    return JSON.parse(contents).metadata.version;
  },
  writeVersion(contents, version) {
    const json = JSON.parse(contents);
    json.metadata.version = version;
    return JSON.stringify(json, null, 2) + "\n";
  },
};
