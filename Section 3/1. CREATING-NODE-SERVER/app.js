const http = require('http');

// function rqListener(req, res) {
//    Some stuff...
// }
// http.createServer(rqListener);
// is equivalent to:
const server = http.createServer((req, res) => {
    console.log(req);
});

server.listen(3000);