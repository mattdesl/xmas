var THREE = require('three')
var array = require('array-range')
var random = require('gl-vec3/random')
var randf = require('randf')
var TweenMax = require('gsap')
var config = require('./config')

var colors = require('./colors')

var World = require('verlet-system/3d')
var Point = require('verlet-point/3d')

module.exports = function(viewer, gift) {
    var startDelay = config.startDelay + 1.5
    var delay = startDelay
    var gifts = array(25).map(function(i) {
        var mesh = gift.clone()

        var newMats = mesh.material.materials.map(function(mat) {
            if (/ribbon/i.test(mat.name)) {
                mat = mat.clone()
                mat.color = new THREE.Color(colors[i%colors.length])
            } 
            return mat
        })
        mesh.material = new THREE.MeshFaceMaterial(newMats)

        var pos = random([0, 0, 0], 8)
        mesh.position.fromArray(pos)

        mesh.rotation.x = randf(-Math.PI*2, Math.PI*2)
        mesh.rotation.y = randf(-Math.PI*2, Math.PI*2) 
        mesh.rotation.z = randf(-Math.PI*2, Math.PI*2)
        mesh.scale.multiplyScalar(0.0001)

        var s = randf(0.08, 0.35)
        TweenMax.to(mesh.scale, 1.0, {
            x: s * randf(0.95,1.05), y: s * randf(0.95,1.05), z: s,
            delay: delay+=0.02
        })
        return mesh
    })

    var points = gifts.map(function(mesh) {
        var point = Point({
            position: mesh.position.toArray()
        })
        
        return point
    })

    setTimeout(function() {
        points.forEach(function(p, i) {
            var f = randf(0.001, 0.005)
            p.addForce([ randf(-f,f), randf(-f,f), randf(-f,f) ])
        })
    }, startDelay*1000)

    gifts.forEach( (g) => {
        viewer.scene.add(g)
    })

    var world = World({ 
        gravity: [0,0,0],
        friction: 0.9999
    })

    viewer.on('tick', function(dt) {
        world.integrate(points, dt/1000)

        points.forEach(function(p, i) {
            gifts[i].position.fromArray(p.position)
            gifts[i].rotation.x += dt/1000 * 0.1
        })
    })
}