const http = require('http');

const routes = require('./routes');

// function rqListener(req, res) {
//    Some stuff...
// }
// http.createServer(rqListener);
// is equivalent to:
const server = http.createServer(routes);

server.listen(3000);