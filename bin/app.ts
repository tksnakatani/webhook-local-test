import http = require('http')
const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    console.log('- header ---------------')
    console.log(req.headers)
    console.log('-- url    --------------')
    console.log(req.url)
    console.log('-- body    --------------')
    var body = "";
    req.on('readable', function() {
        body += req.read()
    });
    req.on('end', function() {
        console.log(body)

    });
    res.end('OK') // レスポンスボディが「OK」になる
})

server.listen(3000) 