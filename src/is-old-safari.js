var mobile = require('./is-mobile')

//ugh, safari. 
//context alpha:false does not work correctly with scissor test
//also the CSS3D animations don't seem to composite properly on
//top of WebGL :( 
module.exports = (function isSafari() {
    var ua = (navigator.userAgent||'').toLowerCase()
    if (!mobile 
        && ua.search("safari") >= 0 
        && ua.search("chrome") < 0) {
        return true
    }
    return false
})()