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
});

server.listen(3000);