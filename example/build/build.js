const vuePlugin = require('lf-spa-stack');

const ENV = process.env.NODE_ENV || 'development';
const isDev = ENV === 'development';
const watch = process.argv.indexOf("--watch") > -1;

let config = {
    entryPoints: ['./src/index.ts'],
    bundle: true,
    outfile: './dist/bundle.js',
    plugins: [vuePlugin],
    logLevel: 'info',
    minify: !isDev,
    incremental: false,
    watch,
    define: {
        "process.env.NODE_ENV": JSON.stringify(ENV)
    }
};

require('esbuild').build(config);