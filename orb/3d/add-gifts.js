var THREE = require('three')
var array = require('array-range')
var random = require('gl-vec3/random')
var randf = require('randf')
var TweenMax = require('gsap')
var config = require('../config')
var clamp = require('clamp')

var colors = require('./colors')

var mouseOffset = require('mouse-event-offset')

var World = require('verlet-system/3d')
var Point = require('verlet-point/3d')
var mouse = require('../mouse')
var mobile = require('../is-mobile')

var tmpSphere = new THREE.Sphere()
var MIN_SCALE = 0.0001

module.exports = function(viewer, gift) {
    var startDelay = config.startDelay + 1.5
    var delay = startDelay


    // var geoSphere = new THREE.IcosahedronGeometry(3, 2)
    // var geoMesh = new THREE.Mesh(geoSphere, new THREE.MeshBasicMaterial({ 
    //     color: 0xd1d1d1, 
    //     opacity: 0.3,
    //     transparent: true,
    //     wireframe: true 
    // }))

    var clickSphere = new THREE.Sphere()
    clickSphere.radius = 3

    // geoSphere.computeBoundingSphere()

    var amount = mobile ? 50 : 100
    var gifts = array(amount).map(function(i) {
        var mesh = gift.clone()

        var newMats = mesh.material.materials.map(function(mat) {
            if (/ribbon/i.test(mat.name)) {
                mat = mat.clone()
                mat.color = new THREE.Color(colors[i%colors.length])
            } 
            return mat
        })
        mesh.material = new THREE.MeshFaceMaterial(newMats)


        var giftObj = new THREE.Object3D()
        giftObj.add(mesh)
        
        // var hover = geoMesh.clone()
        var meshObj = new THREE.Object3D()
        meshObj.scale.multiplyScalar(MIN_SCALE)
        meshObj.add(giftObj)
        // meshObj.add(hover)

        var s = randf(0.08, 0.35)
        TweenMax.to(meshObj.scale, 1.0, {
            x: s * randf(0.95,1.05), y: s * randf(0.95,1.05), z: s,
            delay: delay+=0.02
        })

        // hover.visible = false
        mesh.position.y = -0.4 //fix model to origin

        var pos = random([0, 0, 0], 10)
        meshObj.position.fromArray(pos)
        meshObj.rotation.x = randf(-Math.PI*2, Math.PI*2)
        meshObj.rotation.y = randf(-Math.PI*2, Math.PI*2) 
        meshObj.rotation.z = randf(-Math.PI*2, Math.PI*2)
        
        // meshObj.hover = hover
        return meshObj
    })

    var points = gifts.map(function(mesh) {
        var p = Point({
            position: mesh.position.toArray()
        })
        p.rotational = new THREE.Vector2()
        return p
    })

    //add some forces after they all animate in
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

    var lastHover = -1,
        newHover = -1,
        dragIdx = -1

    viewer.on('tick', function(dt) {
        world.integrate(points, dt/1000)

        points.forEach(function(p, i) {
            gifts[i].position.fromArray(p.position)
            gifts[i].rotation.x += p.rotational.x
            gifts[i].rotation.y += p.rotational.y
            p.rotational.multiplyScalar(0.99)
            gifts[i].rotation.x += dt/1000 * 0.1
        })

        mouse.update(viewer)

        newHover = closest(gifts, clickSphere)
        // if (!viewer.controls.isRotating())
        //     viewer.controls.noRotate = newHover !== -1
        // else 
        //     newHover = -1

        // if (lastHover !== -1) {
        //     gifts[lastHover].hover.visible = false
        // }

        // if (newHover !== -1) {
        //     gifts[newHover].hover.visible = true
        // }

        if (newHover !== lastHover) {
            if (lastHover !== -1) {
                // TweenMax.to(gifts[lastHover].hover.scale, 0.5, {
                //     x: MIN_SCALE, y: MIN_SCALE, z: MIN_SCALE,
                //     ease: "easeOutExpo", onComplete: hide.bind(null, gifts[lastHover].hover)
                // })
            }
            if (newHover !== -1) {
                // gifts[newHover].hover.scale.set(MIN_SCALE, MIN_SCALE, MIN_SCALE)
                // gifts[newHover].hover.visible = true
                // TweenMax.killTweensOf(gifts[newHover].hover.scale)
                // TweenMax.to(gifts[newHover].hover.scale, 0.25, {
                //     x: 1.0, y: 1.0, z: 1.0,
                //     ease: "easeOutExpo"
                // })
            }
        }

        lastHover = newHover
    })
    
    setupMove()


    function setupMove() {
        var lastPosition = new THREE.Vector2().fromArray(mouse.position)
        var tmpPos = new THREE.Vector3()
        var tmpPos2 = new THREE.Vector3()

        mouse.on('move', function(ev) {
            if (newHover !== -1) {
                // var dist = tmpPos.distanceTo(lastPosition)

                var mousePos = mouse.position
                var width = viewer.width, 
                    height = viewer.height

                tmpPos.set(mousePos[0]/width * 2 - 1, -mousePos[1]/height * 2 + 1, 0.5)
                tmpPos.unproject(viewer.camera)

                tmpPos2.set(lastPosition.x/width * 2 - 1, -lastPosition.y/height * 2 + 1, 0.5)
                tmpPos2.unproject(viewer.camera)
                tmpPos2.sub(tmpPos).negate().normalize()
                

                points[newHover].rotational.x -= tmpPos2.x*0.005
                points[newHover].rotational.y -= tmpPos2.y*0.005

                tmpPos2.multiplyScalar(0.001)

                points[newHover].addForce(tmpPos2.toArray())
            }    
            lastPosition.fromArray(mouse.position)
        })

    }
}

function hide(mesh) {
    mesh.visible = false
}

function closest(meshes, boundingSphere) {
    for (var i=0; i<meshes.length; i++) {
        tmpSphere.copy(boundingSphere)
        tmpSphere.applyMatrix4(meshes[i].matrixWorld)

        if (mouse.raycaster.ray.isIntersectionSphere(tmpSphere))
            return i
    }
    return -1
}
