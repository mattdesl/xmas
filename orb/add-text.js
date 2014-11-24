var THREE = require('three')
var TextElement = require('three-sdf-text')(THREE)
var TweenMax = require('gsap')


var fontImage = require('./texture-cache')('fonts/LatoBlack-sdf.png')
var mat4 = require('gl-mat4')
var mouse = require('./mouse')

var phrases = [
    'merry xmas!',
    'drag to rotate'
] //require('./phrases')

module.exports = function(viewer, font) {
    var startDelay = 1.8
    var phraseIndex = 0
    var cancel = false

    var fontTex = THREE.ImageUtils.loadTexture(fontImage)
    fontTex.minFilter = THREE.LinearMipMapLinearFilter
    fontTex.magFilter = THREE.LinearFilter
    fontTex.flipY = false
    fontTex.anistrophy = viewer.renderer.getMaxAnisotropy()

    var elements = []

    elements.push(createText(phrases[0]))

    viewer.on('text', function(dt) {

        elements.forEach(function(e) {
            e.text.draw(viewer.camera, e.object3d)
        })
        viewer.renderer.resetGLState()
    })


    function createText(str) {
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
        textObj.rotation.y = Math.PI/2


        TweenMax.to(textObj.rotation, 1.0, {
            y: 0 * Math.PI/180,
            ease: 'easeInOutExpo',
            delay: startDelay
        })
        TweenMax.to(text, 1.0, {
            opacity: 1,
            delay: startDelay
        })

        position(text)

        var parent = new THREE.Object3D()
        parent.rotation.y = Math.PI/2
        parent.scale.set(0.5,1,1)
        parent.add(textObj)

        viewer.scene.add(parent)

        loop(text, textObj, startDelay)

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

        var translation = [-text.element.getBounds().width/2, -295, 0]
        mat4.translate(text.transform, text.transform, translation)

        var s = 1
        var size = [s,s,s]
        mat4.scale(text.transform, text.transform, size)
    }


    function loop(text, textObj, delay) {
        if (cancel)
            return

        delay = delay||0
        
        TweenMax.delayedCall(delay + 3.0, function() {
            TweenMax.killTweensOf([text, textObj])

            TweenMax.to(textObj.rotation, 0.5, {
                y: -Math.PI/2,
                ease: 'easeInOutExpo'
            })
            TweenMax.to(text, 0.5, {
                opacity: 0,
                ease: 'easeOutQuad'
            })

            var str = nextPhrase()

            if (!str) {
                cancel = true
                return
            }

            TweenMax.to(text, 1, {
                opacity: 1,
                // ease: 'easeIn',
                delay: 0.5,
                onStart: function(str, curText, curObj) {
                    curText.element.text = str
                    curObj.rotation.y = Math.PI/2
                    position(curText)

                    TweenMax.to(curObj.rotation, 1, {
                        y: 0,
                        ease: 'easeInOutExpo'
                    })
                }.bind(null, str, text, textObj),
                onComplete: loop.bind(null, text, textObj)
            })
        })


    }
 
    function nextPhrase() {
        phraseIndex++
        if (phraseIndex > phrases.length-1)
            return ''
        return phrases[phraseIndex].toLowerCase()
    }
}