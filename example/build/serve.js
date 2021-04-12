const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const dir = path.join(process.cwd(), 'dist');
const PORT = process.env.PORT || 4020;

const server = http.createServer((req, res) => {
    const U = url.parse(req.url);
    let p = U.pathname;
    if(p === '/') p = '/index.html';
    let file = path.join(dir, p);
    fs.exists(file, exists => {
        if(exists) {
            res.setHeader('Content-Type', guessMime(file));
            fs.readFile(file, (err, data) => {
                res.write(data, (err) => {
                    res.end();
                    console.log(200,file);
                })
            })
        } else {
            res.statusCode = 404;
            res.end();
            console.log(404, file);
        }
    })
});


['close', 'connection', 'error', 'listening'].forEach(e => {
    server.on(e, () => {
        console.log(e);
    })
})


server.listen(PORT);
console.log('Listening on port ' + PORT);
console.log('Serving from ' + dir);

function guessMime(file) {
    switch(path.extname(file)) {
        case '.html': return 'text/html';
        case '.png': return 'image/png';
        case '.ico': return 'image/x-icon';
        case '.js': return 'text/javascript';
        default: return 'text/plain';
    }
}