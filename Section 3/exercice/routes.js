const users = require('./dummy_users');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if(url === '/') {
        res.write('<html>');
        res.write('<head><title>My first Node JS exercise</title></head>');
        res.write('<body>');
        res.write('<h1>Hi Everyone!</h1>');
        res.write('<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Create User</button></form>');
        res.write('</body>');
        res.write(('</html>'));
        return res.end();
    } else if(url === '/users') {
        res.write('<html>');
        res.write('<head><title>My first Node JS exercise</title></head>');
        res.write('<body>');
        res.write('<h1>List of users</h1>');
        res.write('<ul>');
        for(let user of users) {
            res.write('<li>');
            res.write('<div>');
            res.write('<ul>');
            res.write(`<li>Name: ${user.name}</li>`);
            res.write(`<li>Age: ${user.age}/li>`);
            res.write(`<li>Mail: ${user.mail}/li>`);
            res.write('</ul>');
            res.write('</div>');
            res.write('</li>');
        }
        res.write('</ul>');
        res.write('</body>');
        res.write(('</html>'));
        return res.end();
    } else if(url === '/create-user' && method === 'POST') {
        const body = [];
        // Register an event listener
        // This will listen the data event,it is emitted when a chunk of data is received
        req.on('data', (chunk) => body.push(chunk));
        // This will listen the end event, it is fired when the client request has been completely received and the server response has been completely sent
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split('=')[1];

            console.log(username);
        });
        return res.end();
    }
}

module.exports = requestHandler;