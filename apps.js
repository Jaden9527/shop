
var express = require('express');

var PORT = 4200;

var app = express(); 
const path = require('path') 
app.use(express.static(path.join(__dirname, 'dist')))


app.listen(PORT);
console.log('Running on http://localhost:' + PORT);