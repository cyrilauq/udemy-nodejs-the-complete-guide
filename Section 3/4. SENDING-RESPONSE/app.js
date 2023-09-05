const http = require('http');

// function rqListener(req, res) {
//    Some stuff...
// }
// http.createServer(rqListener);
// is equivalent to:
const server = http.createServer((req, res) => {
    console.log(req.url, req.method, req.headers);
    // If we want to stop the server, we can use:
    // process.exit();

    const url = req.url;
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>')
        res.write('</html>');
        return res.end();
    }
    // Set header response
    // Define that the content-type is text or html
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My first page</title></head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
    res.write('</html>');
    res.end();
});

server.listen(3000);