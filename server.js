var express = require('express');
var app = express();

app.use('/app', express.static('src'));
app.use('/node_modules', express.static('node_modules'));

var port = process.argv[2] || 3000;
app.listen(port);
console.log('app listening on port ' + port);
