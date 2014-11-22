var THREE = require('three')
var array = require('array-range')

// var Floor = require('./create-floor')
var syncFloor = require('./sync-floor')
var lerp = require('lerp')

var mouse = require('touch-position').emitter()
var TweenMax = require('gsap')

var blendShader = require('./shaders/blend')
var tmpSphere = new THREE.Sphere()

module.exports = function(viewer, mesh) {
    // var floor = Floor()
    var t = 0
    var START = 4
    var mouseVec = new THREE.Vector3()
    var projector = new THREE.Projector()
    var raycaster = new THREE.Raycaster()
    var mouseCastPos = new THREE.Vector3()
    var mouseOrigin = new THREE.Vector3()
    // viewer.scene.add(floor)


    //if we aren't moving mouse, at least start it nicely
    mouse.position[0] = viewer.width/2
    mouse.position[1] = viewer.height/2

    mesh.position.y = START 

    var r = 1.15
    var sphere = new THREE.SphereGeometry(r, 50, 50)
    sphere.computeBoundingSphere()

    var tex2 = new THREE.Texture()
    var tex = THREE.ImageUtils.loadTexture('img/earth1-small.jpg', undefined, function() {
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


    viewer.on('tick', function(dt) {
        update(dt/1000)
    })

    update(0.0)

    mouse.on('move', function(ev) {
        // var mult = 0.01 * Math.PI/180
        // var xOff = (mouse.position[0]/viewer.width * 2 - 1)
        // var yOff = (mouse.position[1]/viewer.height * 2 - 1)

        // var opt = {
        //     phi: viewer.controls.rotateOffset.phi,
        //     theta: viewer.controls.rotateOffset.theta
        // }

        // var max = (1 * Math.PI/180)/4

        // // opt.phi = Math.abs(opt.phi) < max ? yOff * mult : 0
        // // opt.theta = Math.abs(opt.theta) < max ? xOff * mult : 0

        // viewer.controls.rotateOffset.phi = yOff * (5 * Math.PI/180)

        // TweenMax.to(viewer.controls.rotateOffset, 1.0, {
        //     phi: 0,
        //     theta: 0
        // })
    })



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

            // mousePos[0] = lerp(mousePos[0], width/2, 0.6)
            // mousePos[1] = lerp(mousePos[1], height/2, 0.6)
            // mouseVec.set(0, 0, 0.5)
            // mouseVec.unproject(viewer.camera)
        }
        
        mouseOrigin.lerp(mouseCastPos, lerpSpeed)
        mat.uniforms.origin.value = mouseOrigin
        mat.uniforms.anim.value = Math.sin(t)/2+0.5

    }
}

