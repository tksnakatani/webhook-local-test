"use strict";
exports.__esModule = true;
var http = require("http");
var server = http.createServer(function (req, res) {
    console.log('- header ---------------');
    console.log(req.headers);
    console.log('-- url    --------------');
    console.log(req.url);
    console.log('-- body    --------------');
    var body = "";
    req.on('readable', function () {
        body += req.read();
    });
    req.on('end', function () {
        console.log(body);
    });
    res.end('OK'); // レスポンスボディが「OK」になる
});
server.listen(3000);
