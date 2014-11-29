var THREE = require('three')
var TweenMax = require('gsap')
var Circle = require('./circle')
var lerp = require('lerp')

module.exports = function(viewer) {
    var circle = Circle()
    var CIRCLE_SCALE = 0.1
    circle.visible = false
    circle.scale.multiplyScalar(CIRCLE_SCALE)

    viewer.scene.add(circle)

    viewer.on('tick', function() {
        // circle.lookAt(viewer.camera.position)
    })  

    var lastTween = null
    var tween = {
        value: 0
    }

    function aniInCircle() {
        if (lastTween)
            lastTween.kill()

        var s = 0.0001
        circle.visible = true
        // circle.scale.set(s,s,s)
        tween.value = 1

        // TweenMax.to(circle.scale, 1, {
        //     x: CIRCLE_SCALE, y: CIRCLE_SCALE, z: CIRCLE_SCALE, 
        //     ease: 'easeOutExpo'
        // })
        TweenMax.to(tween, 1, {
            onUpdate: updateMaterials,
            onStart: setDash(true),
            onComplete: setDash(false),
            value: 0.0, 
            delay: 0.0,
            ease: 'easeOutQuart'
        })

        lastTween = TweenMax.to(tween, 1, {
            ease: 'easeOutExpo',
            value: 1,
            onStart: setDash(true),
            onUpdate: updateMaterials,
            onComplete: setVisible(false),
            delay: 2.0
        })

        updateMaterials()
    }

    function setVisible(visible) {
        return function() {
            circle.visible = visible
        }
    }

    function setDash(enabled) {
        return function() {
            circle.material.uniforms.dashed.value = enabled ? 1 : 0
        }
    }

    function updateMaterials() {
        circle.material.uniforms.dashDistance.value = lerp(0, 0.6, tween.value)
        circle.material.uniforms.dashSteps.value = lerp(8, 0, tween.value)
    }



    return {
        mesh: circle,
        show: aniInCircle
    }
}