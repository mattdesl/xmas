var TweenMax = require('gsap')
var mobile = require('../is-mobile')

module.exports = function() {
    var el = document.querySelector('.google-overlay')
    var delay = 1.0

    if (!mobile) {
        TweenMax.set(el, { y: 100, opacity: 0, display: 'block' })
        TweenMax.to(el, 1.0, { opacity: 0.5, delay: delay })
        TweenMax.to(el, 1.0, { y: 0, ease: 'easeOutExpo', delay: delay })
    }
}