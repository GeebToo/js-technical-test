'use strict'
var express = require('express')
var path = require('path')
var app = express()

// Configuration
app.set('port', 9042)
app.use(express.static(path.join(__dirname, '..', 'app')))

app.listen(app.get('port'), function () {
  console.log('Express is in DEV mode')
})

module.exports = app

console.log('Express server listening on port ' + app.get('port'))
