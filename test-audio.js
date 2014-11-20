var TweenMax = require('gsap')

var play = require('play-audio')

var p = play('ambience.mp3').autoplay()

var normal = true

window.addEventListener("keydown", function(ev) {
    if (ev.keyCode === 32) {
        TweenMax.to(p.element(), 1.0, {
            playbackRate: normal ? 0.1 : 1,
            delay: 0
        })
    }
})
    