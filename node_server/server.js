const http = require('http');
const fs = require('fs');
const server = http.createServer();

server.on('request', (req, res) => {
    console.log(req.url);
    if (req.url === '/' && req.method === 'GET') {
        console.log('new user');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        fs.readFile('./node_server/index.html', 'utf8', (error, html) => {
            res.write(html);
            res.end();
        });
    }
    else if (req.url === '/node_server/style.css' && req.method === 'GET') {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
        fs.readFile('./node_server/style.css', 'utf8', (error, css) => {
            res.write(css)
            res.end();
        })
    }
    else {
        res.statusCode = 404;
        res.write('Page not found');
        res.end();
    }
});

server.listen(3000, () => console.log('Server working on http://localhost:3000'));