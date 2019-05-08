const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const {METADATA_YAML, UUID_YAML, METADATA_FOLDER} = require('../context');

exports.loadMetadataYaml = function loadMetadataYaml(folder) {
    const file = fs.readFileSync(path.resolve(folder, METADATA_FOLDER, METADATA_YAML));
    return yaml.safeLoad(file);
};

exports.loadUuidYaml = function loadUuidYaml(folder) {
    const file = fs.readFileSync(path.resolve(folder, METADATA_FOLDER, UUID_YAML));
    return yaml.safeLoad(file);
};
