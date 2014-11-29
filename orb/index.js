var Promise = require('bluebird')
var THREE = require('three')
var create = require('./3d/three-mesh-viewer')(THREE)

var mobile = require('./is-mobile')
var preload = require('./preload-textures')
var createOrb = Promise.promisify(require('./3d/create-orb'))
var createGift = Promise.promisify(require('./3d/create-gift'))
var createEarth = require('./3d/earth')
var TweenMax = require('gsap')

var loadJSON = Promise.promisify(require('load-json-xhr'))

var cache = require('./texture-cache')
var config = require('./config')
var coffee = require('./coffee')

// var $ = document.querySelector

require('domready')(function() {
    document.body.style.background = '#151a17'
    var viewer = create()

    Promise.all([
        preload(cache.paths),
        createOrb({ envMap: viewer.cubeCamera.renderTarget }),
        createGift(),
        loadJSON('fonts/LatoBlack-sdf.json')
    ]).spread( (images, mesh, gift, font) => {
        require('./about')()

        viewer.scene.fog = new THREE.FogExp2(0x181f1e, 0.05)

        viewer.controls.target.set(0, 0, 0)
        viewer.controls.zoomSpeed = 0.1
        viewer.controls.rotateSpeed = 0.4
        viewer.controls.minPolarAngle = 30 * Math.PI/180 
        viewer.controls.maxPolarAngle = 150 * Math.PI/180 
        viewer.controls.minDistance = 4
        viewer.controls.maxDistance = 9
        viewer.controls.noPan = true
        viewer.camera.position.set(0, 6, 6)
        
        TweenMax.to(viewer.camera.position, 1, {
            y: 3, ease: 'easeOutQuart', delay: config.startDelay
        })

        require('./3d/add-lights')(viewer.scene)
        require('./3d/stars')(viewer)
        var earth = createEarth(viewer, mesh)
        require('./3d/add-gifts')(viewer, gift)
        var text = require('./3d/add-text')(viewer, font)

        var margin = mobile ? 0 : 20
        TweenMax.to(viewer, 1.0, {
            margin: margin, ease: 'easeOutQuart', delay: 1.0,
            onStart: function() {
                document.body.style.background = '#fff'
            }
        })

        var search = coffee(text)


        var circle = require('./circle')()
        var CIRCLE_SCALE = 0.1
        circle.visible = false
        
        viewer.scene.add(circle)

        viewer.on('tick', function() {
            // circle.lookAt(viewer.camera.position)
        })  

        var tmpPos = new THREE.Vector3()
        var lastTween = null

        //don't let user click right away
        setTimeout(function() {
            console.log("allow")
            earth.on('select', function(latlng, pos) {
                tmpPos.copy(pos).sub(earth.object3d.position).normalize()
                var sphere = earth.geometry.boundingSphere
                tmpPos.multiplyScalar(sphere.radius * 1.0).add(earth.object3d.position)

                circle.position.copy(tmpPos)
                circle.lookAt(earth.object3d.position)

                aniInCircle(circle)

                search(latlng)
            })
        }, 2000)

        function aniInCircle(circle) {
            if (lastTween)
                lastTween.kill()

            var s = 0.0001
            circle.visible = true
            circle.scale.set(s,s,s)
            TweenMax.to(circle.scale, 1, {
                x: CIRCLE_SCALE, y: CIRCLE_SCALE, z: CIRCLE_SCALE, 
                ease: 'easeOutExpo'
            })

            lastTween = TweenMax.to(circle.scale, 0.5, {
                ease: 'easeOutExpo',
                x: s, y: s, z: s,
                delay: 2.0
            })
        }
    })
})
