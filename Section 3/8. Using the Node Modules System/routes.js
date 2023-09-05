const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>')
        res.write('</html>');
        return res.end();
    }
    if(url === '/message' && method === 'POST') {
        const body = [];
    
        // We'll listen on certain events with on method
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        req.on('end', () => {
            // Retrieve the data from the body
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
    
            // Write the file asynchronously and do something when it's done
            // Why do this like that? Because we don't want to block the code if you use writeFileSync it will block the code until the file is written
            fs.writeFile('message.txt', message, (err) => {
                // Will redirect to the root path
                res.writeHead(302, {'Location': '/'});
                return res.end();
            });
        });
    }
    
    // Set header response
    // Define that the content-type is text or html
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My first page</title></head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
    res.write('</html>');
    res.end();
}

module.exports = requestHandler;