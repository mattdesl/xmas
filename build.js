var path = require('path')
var fs = require('fs')
var minstache = require('minstache')
var datauri = require('datauri')
var minify = require('html-minify').minify

var html = fs.readFileSync(__dirname+'/dev.html', 'utf8')

var GZIP = process.argv[2] === '-c'
console.log(GZIP)

var style = 'style/main.css'

html = html.replace(style, 'style/main.min.css')
html = inline(html, 'img/spinner.png')
// html = inline(html, 'img/powered-by-google-on-white@2x.png')
html = html.replace('{{entry}}', GZIP ? 'build/bundle.js.gz' : 'build/bundle.js')

html = minify(html, {
    removeComments: true,
    collapseWhitespace: true,
    minifyJS: true,
    minifyCSS: true
})

fs.writeFileSync(__dirname+'/index.html', html)

function inline(html, img) {
    return html.replace(img, datauri(path.join(__dirname, img)))
}