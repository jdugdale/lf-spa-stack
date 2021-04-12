const fs = require('fs');
const path = require('path');
const os = require('os');
const esbuild = require('esbuild');
const jasmine = require('jasmine');

const specDir = "./spec";
const tmpDir = path.join(os.tmpdir(), 'specs');

const specs = [];

function findSpecs(dir) {
    fs.readdirSync(dir).forEach(element => {
        if (fs.lstatSync(path.join(dir, element)).isFile()) {
            if (/.+\.ts$/.test(element)) {
                specs.push(path.join(dir, element));
            }
        } else {
            findSpecs(path.join(dir, element));
        }
    });
}

async function runTests() {
    const j = new jasmine();
    try {
        j.loadConfigFile(path.join(__dirname, '../spec/support/jasmine.json'));
        let r = await j.execute([path.join(tmpDir, '**.spec.js'), path.join(tmpDir, '**/*.spec.js')]);
    } catch (err) {
        console.error(err);
    }
}

async function build(specs) {
    let opts = {
        entryPoints: specs,
        bundle: true,
        outdir: tmpDir
    };
    let buildResult = await esbuild.build(opts);
    console.log(buildResult);
}

(async function () {
    findSpecs(specDir);
    await build(specs);
    await runTests();
})();