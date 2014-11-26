var THREE = require('three')
var TextElement = require('three-sdf-text')(THREE)
var TweenMax = require('gsap')


var fontImage = require('./texture-cache')('fonts/LatoBlack-sdf.png')
var mat4 = require('gl-mat4')
var mouse = require('./mouse')

var mobile = require('./is-mobile')

var phrases = [
    (mobile?'swipe':'drag')+' to rotate',
    'tap the Earth\nto warm up with some coffee'
]
var textTimeout = 1.5

module.exports = function(viewer, font) {
    var startDelay = 1.8
    var phraseIndex = 0
    var cancel = false

    var fontTex = THREE.ImageUtils.loadTexture(fontImage)
    fontTex.minFilter = THREE.LinearMipMapLinearFilter
    fontTex.magFilter = THREE.LinearFilter
    fontTex.flipY = false
    fontTex.anistrophy = viewer.renderer.getMaxAnisotropy()

    var tween = null
    var lastTheta = null
    var isShowing = true

    var elements = []
    elements.push(createText(phrases[0]))

    viewer.on('text', function(dt) {
        if (lastTheta === null || lastTheta !== viewer.controls.theta)
            thetaChanged()

        elements.forEach(function(e) {
            e.text.draw(viewer.camera, e.object3d)
        })
        viewer.renderer.resetGLState()

        lastTheta = viewer.controls.theta
    })

    return {

        showing: function() {
            return isShowing
        },

        show: function(text) {
            killAll()
            cancel = false

            var e = elements[0]
            e.text.opacity = 0
            e.object3d.scale.y = 0

            singleLoop(text, e.text, e.object3d)
        }
    }

    function shortestArc(a, b) {
        if (Math.abs(b-a) < Math.PI)
            return b-a
        if (b>a)
            return b-a-Math.PI*2
        return b-a+Math.PI*2
    }

    function thetaChanged() {
        elements.forEach(function(e) {


            // var x = e.parent.rotation.y, 
            //     y = viewer.controls.theta
            // var abdist = Math.abs(x - y)
            // var dist = Math.min((2 * Math.PI) - abdist, abdist)

            var target = viewer.controls.theta
            target = target-2*Math.PI*Math.floor(target/(2*Math.PI)+0.5)
            //Math.atan2(Math.sin(target),Math.cos(target))

            TweenMax.killTweensOf(e.parent.rotation)
            TweenMax.to(e.parent.rotation, 0.5, {
                y: target,
                delay: 0.001,
                ease: 'easeOutQuart'
            })
        })
    }

    function createText(str) {
        var wrap = mobile ? window.innerWidth : undefined

        var text = TextElement(viewer.renderer, {
            text: str,
            font: font,
            padding: -4,
            color: 0xfafafa,
            textures: [ fontTex ]
        })

        var textObj = new THREE.Object3D()
        
        text.opacity = 0
        textObj.position.set(0, 0, 0)
        textObj.scale.y = 0
        position(text)

        var parent = new THREE.Object3D()
        // parent.rotation.y = Math.PI/2
        parent.position.set(0,-1.8,0)
        parent.add(textObj)
        viewer.scene.add(parent)

        animIn(startDelay, phrases[0], text, textObj, function() {
            loop(text, textObj, textTimeout)
        })

        return {
            text: text,
            object3d: textObj,
            parent: parent
        }
    }

    function position(text) {
        var SCALE = 0.007
        mat4.identity(text.transform)
        mat4.scale(text.transform, text.transform, [SCALE,SCALE,SCALE])

        var bounds = text.element.getBounds()
        var translation = [-bounds.width/2, -bounds.height, 0]
        mat4.translate(text.transform, text.transform, translation)

        var s = 1
        var size = [s,s,s]
        mat4.scale(text.transform, text.transform, size)
    }

    function singleLoop(str, text, textObj) {
        animIn(0, str, text, textObj, function() {
            animOut(text, textObj, textTimeout)
        }.bind(this))
    }

    function animOut(text, textObj, delay) {
        TweenMax.to(textObj.scale, 1, {
            y: 0,
            delay: delay,
            ease: 'easeOutExpo'
        })
        TweenMax.to(text, 0.5, {
            opacity: 0,
            delay: delay,
            ease: 'easeOutQuad'
        })
    }

    function animIn(delay, str, text, textObj, onComplete) {
        TweenMax.killTweensOf([text, textObj])

        TweenMax.to(text, 1, {
            opacity: 1,
            delay: delay,
            onStart: function(str, curText, curObj) {
                curText.element.text = str
                curText.element.align = 'center'
                curText.element.layout(500)
                curObj.scale.y = 0
                position(curText)

                TweenMax.to(curObj.scale, 1, {
                    y: 1,
                    ease: 'easeOutExpo'
                })
            }.bind(null, str, text, textObj),
            onComplete: onComplete
        })
    }

    function loop(text, textObj, delay) {
        if (cancel)
            return
        delay = delay||0

        tween = TweenMax.delayedCall(delay, function() {
            animOut(text, textObj)

            var str = nextPhrase()

            if (!str) {
                cancel = true
                return
            }

            animIn(1.0, str, text, textObj, loop.bind(null, text, textObj, textTimeout))
        })
    }

    function killAll() {
        if (tween) {
            tween.kill()
            tween = null
        }
        elements.forEach(function(e) {
            TweenMax.killTweensOf([
                e.parent.rotation,
                e.text,
                e.object3d.scale
            ])
        })
    }
 
    function nextPhrase() {
        phraseIndex++
        if (phraseIndex > phrases.length-1)
            return ''
        return phrases[phraseIndex]//.toLowerCase()
    }
}