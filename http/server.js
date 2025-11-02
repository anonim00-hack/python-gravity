const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer();

server.on('request', (req, res) => {
    console.log(req.url);
    
    if (req.url === '/' && req.method === 'GET') {
        console.log('new user');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        fs.readFile('./http/index.html', 'utf8', (error, html) => {
            if(error){
                console.log('HTML error:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.write('Internal Server Error');
                res.end();
                return;
            }
            res.write(html);
            res.end();
        });
    }
    else if (req.url === '/node_server/style.css' && req.method === 'GET') {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
        fs.readFile('./http/style.css', 'utf8', (error, css) => {
            if(error){
                console.log('CSS error:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.write('Internal Server Error');
                res.end();
                return;
            }
            res.write(css);
            res.end();
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Page not found');
        res.end();
    }
});

server.listen(3000, () => console.log('Server working on http://localhost:3000'));