http = require('http')

requestHandler = function(req, res) {
  res.end('long-running server')
}


http.createServer(requestHandler)
    .listen(4000,
            '127.0.0.1',
            function() { console.log('long-running service running at port 4000') })
