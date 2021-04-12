const fs = require('fs');
const path = require('path');
const dir = "./example";
const dest = process.env.INIT_CWD;

function copyExample(from, to) {
    if(!fs.existsSync(from)) return;
    if(!fs.existsSync(to)) fs.mkdirSync(to);
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        } else {
            copyExample(path.join(from, element), path.join(to, element));
        }
    });
}

copyExample(dir, dest);