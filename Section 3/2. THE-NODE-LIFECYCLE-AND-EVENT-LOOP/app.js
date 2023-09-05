const http = require('http');

// function rqListener(req, res) {
//    Some stuff...
// }
// http.createServer(rqListener);
// is equivalent to:
const server = http.createServer((req, res) => {
    console.log(req);
    // If we want to stop the server, we can use:
    // process.exit();
});

server.listen(3000);