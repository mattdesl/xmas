var THREE = require('three')
var TweenMax = require('gsap')
var Circle = require('./circle')
var lerp = require('lerp')

module.exports = function(viewer) {
    var tmpPos = new THREE.Vector3()
    var circle = Circle()
    // var innerCircle = circle.clone()

    var mesh = new THREE.Object3D()
    mesh.add(circle)
    // mesh.add(innerCircle)

    var CIRCLE_SCALE = 0.1
    mesh.visible = false
    mesh.scale.multiplyScalar(CIRCLE_SCALE)

    // innerCircle.material = innerCircle.material.clone()
    // innerCircle.material.uniforms.thickness /= 2
    // innerCircle.scale.multiplyScalar(0.5)

    viewer.scene.add(mesh)

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

        mesh.visible = true
        tween.value = 1

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
            delay: 3.0
        })

        updateMaterials()
    }

    function setVisible(visible) {
        return function() {
            mesh.visible = visible
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
        place: function(position, target, radius) {
            tmpPos.copy(position).sub(target).normalize()
            tmpPos.multiplyScalar(radius * 1.1).add(target)

            mesh.position.copy(tmpPos)
            mesh.lookAt(target)
        },

        show: aniInCircle
    }
}