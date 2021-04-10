const pug = require('pug');
const fs = require('fs');
const parse5 = require('parse5')
const compiler = require('vue-template-compiler')
const ccu = require('@vue/component-compiler-utils');
const os = require('os');
const path = require('path');

function serializeTemplate(node) {
    const childNode = node.childNodes[0]
    if (childNode && childNode.nodeName === '#document-fragment') {
        return parse5.serialize(childNode)
    }
    return parse5.serialize(node)
}

function minCss(css) {
    return css
        .replace(/\s*([;:{}>])\s*/g, '$1')
        .replace(/\n/g, '')
        .replace(/\s{2,}/, ' ')
        .trim();
}

function copyAssets(from, to) {
    if(!fs.existsSync(from)) return;
    if(!fs.existsSync(to)) fs.mkdirSync(to);
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        } else {
            copyAssets(path.join(from, element), path.join(to, element));
        }
    });
}

let plugin = {
    name: 'mine',
    setup(build) {
        const libPath = path.join(os.tmpdir(), 'vue-plugin-lib.ts');
        fs.writeFileSync(libPath, `export default function addStyle(css) {
            var s=document.querySelector('head > style'); 
            if(!s) { s = document.createElement('style');document.head.appendChild(s); } 
            s.append(css);
        }`);

        copyAssets(path.join(process.cwd(), './assets'), path.join(process.cwd(), './dist'));

        build.onLoad({ filter: /[^/]\.vue$/ }, async args => {
            const source = await fs.promises.readFile(args.path, "utf8");
            let render, script, className, style = '';
            const fragment = parse5.parseFragment(source);
            //const fragment = parser.parseFragment(source);
            fragment.childNodes.forEach(function (node) {
                switch (node.nodeName) {
                    case 'template':
                        let content = serializeTemplate(node);
                        let template = pug.render(content.trim());
                        let cru = ccu.compileTemplate({ source: template, compiler });
                        render = cru.code;
                        break;
                    case 'script':
                        let raw = node.childNodes[0].value;
                        script = raw;
                        className = script.match(/export default class (.+) extends/)[1];
                        break;
                    case 'style':
                        style += minCss(node.childNodes[0].value);
                        break;
                }
            });

            let styleCode = style ? `import addStyle from '${libPath}'; addStyle("${style}");` : '';
            let result = `${script}\n${render}\n${className}.options.render=render;${className}.options.staticRenderFns=staticRenderFns;${styleCode}`;
            return { contents: result, loader: 'ts' };
        });
    }
}

module.exports = plugin;