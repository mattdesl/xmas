var THREE = require('three')
var array = require('array-range')

var Emitter = require('events/')
var lerp = require('lerp')

var TweenMax = require('gsap')

var blendShader = require('../shaders/blend')
var tmpSphere = new THREE.Sphere()

var earthURL = require('../texture-cache')('img/street2.png')
var config = require('../config')
var isMobile = require('../is-mobile')

var getLatLng = require('./point-to-latlng')
var mouse = require('../mouse')

module.exports = function(viewer, mesh) {
    var t = 0
    var START = config.startPosition
    var mouseCastPos = new THREE.Vector3()
    var mouseOrigin = new THREE.Vector3()
    var tmpPos = new THREE.Vector3()

    var emitter = new Emitter()

    mesh.position.y = START 

    var r = 1.15
    var sphere = new THREE.SphereGeometry(r, 50, 50)
    sphere.computeBoundingSphere()

    var tex2 = new THREE.Texture()
    
    var tex = THREE.ImageUtils.loadTexture(earthURL, undefined, function() {
        // tex2.image = require('delaunify')(tex.image, { count: 8000 })
        // tex2.needsUpdate = true
    })

    var mat = new THREE.ShaderMaterial(blendShader({
        tProcessed: tex2,
        map: tex
    }))

    var earth = new THREE.Mesh(sphere, mat)
    viewer.scene.add(earth)
    viewer.scene.add(mesh)

    viewer.cubeIgnores.push(earth, mesh)

    var s = 0.001
    earth.scale.set(s,s,s)
    mesh.scale.set(s,s,s)
    earth.scale.x *= -1;


    var delay = config.startDelay + 0.25
    TweenMax.fromTo(earth.rotation, 1.0, { y: -Math.PI*0.5 }, {
        y: 0, delay: delay, ease: "easeOutQuart"
    })
    TweenMax.to([earth.scale, mesh.scale], 1.0, {
        ease: "easeOutExpo",
        x: 1, y: 1, z: 1,
        delay: delay,
        onComplete: function() {
            //initial mouse position
            // mouse.position[0] = viewer.width/2
            // mouse.position[1] = viewer.height/2
        }
    })

    viewer.on('tick', function(dt) {
        update(dt/1000)
    })

    mouse.on('click', function(x, y) {
        mouse.position[0] = x
        mouse.position[1] = y
        var hit = hits(tmpPos)

        if (hit) {
            var latlng = getLatLng(tmpPos, tmpSphere.radius, -earth.rotation.y)
            emitter.emit('select', latlng, tmpPos.clone())
        }
    })

    update(0.0)

    emitter.object3d = earth
    emitter.geometry = sphere
    return emitter

    function update(dt) {
        t += dt
        

        var spd = 0.02
        earth.rotation.y += dt * spd
        earth.position.copy(mesh.position)
        var lerpSpeed = 0.02
        
        mouse.update(viewer)

        var boundingSphere = sphere.boundingSphere
        tmpSphere.copy(boundingSphere)
        tmpSphere.applyMatrix4(earth.matrixWorld)
        if (mouse.raycaster.ray.isIntersectionSphere(tmpSphere)) {
            lerpSpeed = 0.1
            mouse.raycaster.ray.intersectSphere(tmpSphere, mouseCastPos)
        }
         // else {
            // mouse.vector.set(0, 0, 0.5)
            // mouse.vector.unproject(viewer.camera)
            // mouse.vector.sub(viewer.camera.position).normalize()
            // mouse.raycaster.set(viewer.camera.position, mouse.vector)
            // mouse.raycaster.ray.intersectSphere(tmpSphere, mouseCastPos)
        // }
        
        mouseOrigin.lerp(mouseCastPos, lerpSpeed)
        mat.uniforms.origin.value = mouseOrigin
        mat.uniforms.anim.value = Math.sin(t)/2+0.5
    }

    function hits(out) {
        mouse.update(viewer)

        var boundingSphere = sphere.boundingSphere
        tmpSphere.copy(boundingSphere)
        tmpSphere.applyMatrix4(earth.matrixWorld)

        if (mouse.raycaster.ray.isIntersectionSphere(tmpSphere))
            return mouse.raycaster.ray.intersectSphere(tmpSphere, out)
        return false
    }

}

