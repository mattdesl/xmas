var path = require('path')
var fs = require('fs')
var minstache = require('minstache')
var datauri = require('datauri')
var minify = require('html-minifier').minify

var html = fs.readFileSync(__dirname+'/dev.html', 'utf8')


var style = 'style/main.css'
var img = 'img/spinner.png'
var b64 = datauri(path.join(__dirname, img))

html = html.replace(style, 'style/main.min.css')
html = html.replace(img, b64)
// console.log(minify(html))

fs.writeFileSync(__dirname+'/index.html', html)