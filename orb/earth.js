var THREE = require('three')
var array = require('array-range')

var syncFloor = require('./sync-floor')
var lerp = require('lerp')

var mouse = require('touch-position').emitter()
var TweenMax = require('gsap')

var blendShader = require('./shaders/blend')
var tmpSphere = new THREE.Sphere()

var earthURL = require('./texture-cache')('img/earth1-small.jpg')

module.exports = function(viewer, mesh) {
    var t = 0
    var START = 4
    var mouseVec = new THREE.Vector3()
    var raycaster = new THREE.Raycaster()
    var mouseCastPos = new THREE.Vector3()
    var mouseOrigin = new THREE.Vector3()


    mesh.position.y = START 

    var r = 1.15
    var sphere = new THREE.SphereGeometry(r, 50, 50)
    sphere.computeBoundingSphere()

    var tex2 = new THREE.Texture()
    
    var tex = THREE.ImageUtils.loadTexture(earthURL, undefined, function() {
        tex2.image = require('delaunify')(tex.image, { count: 2000 })
        tex2.needsUpdate = true
    })

    var mat = new THREE.ShaderMaterial(blendShader({
        tProcessed: tex2,
        map: tex
    }))

    var earth = new THREE.Mesh(sphere, mat)
    viewer.scene.add(earth)
    viewer.scene.add(mesh)

    var s = 0.001
    earth.scale.set(s,s,s)
    mesh.scale.set(s,s,s)

    var delay = 0.75
    TweenMax.fromTo(earth.rotation, 1.0, { y: -Math.PI*0.5 }, {
        y: 0, delay: delay, ease: "easeOutQuart"
    })
    TweenMax.to([earth.scale, mesh.scale], 1.0, {
        ease: "easeOutExpo",
        x: 1, y: 1, z: 1,
        delay: delay,
        onComplete: function() {
            //initial mouse position
            mouse.position[0] = viewer.width/2
            mouse.position[1] = viewer.height/2
        }
    })

    viewer.on('tick', function(dt) {
        update(dt/1000)
    })

    update(0.0)

    function update(dt) {
        t += dt
        var mousePos = mouse.position
        var width = viewer.width, 
            height = viewer.height

        mouseVec.set(mousePos[0]/width * 2 - 1, -mousePos[1]/height * 2 + 1, 0.5)

        var spd = 0.04
        earth.rotation.y += dt * spd
        // mesh.position.y = Math.sin(t*0.5) * 0.1 + START
        earth.position.copy(mesh.position)
        // syncFloor(floor, mesh)
            
        mouseVec.unproject(viewer.camera)
        mouseVec.sub(viewer.camera.position).normalize()
        raycaster.set(viewer.camera.position, mouseVec)

        var lerpSpeed = 0.02
        var boundingSphere = sphere.boundingSphere
        tmpSphere.copy(boundingSphere)
        tmpSphere.applyMatrix4(earth.matrixWorld)
        if (raycaster.ray.isIntersectionSphere(tmpSphere)) {
            lerpSpeed = 0.1
            raycaster.ray.intersectSphere(tmpSphere, mouseCastPos)
        } else {
            mouseVec.set(0, 0, 0.5)
            mouseVec.unproject(viewer.camera)
            mouseVec.sub(viewer.camera.position).normalize()
            raycaster.set(viewer.camera.position, mouseVec)
            raycaster.ray.intersectSphere(tmpSphere, mouseCastPos)
        }
        
        mouseOrigin.lerp(mouseCastPos, lerpSpeed)
        mat.uniforms.origin.value = mouseOrigin
        mat.uniforms.anim.value = Math.sin(t)/2+0.5
    }
}

