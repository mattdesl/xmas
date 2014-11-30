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

var throttle = require('lodash.throttle')

// var $ = document.querySelector

require('domready')(function() {
    document.body.style.background = '#151a17'
    var viewer = create()

    Promise.all([
        preload(cache.paths),
        createOrb(),
        createGift(),
        loadJSON('fonts/IstokBold.json')
    ]).spread( (images, mesh, gift, font) => {
        var about = require('./about')()

        var margin = mobile ? 0 : 20
        TweenMax.to(viewer, 1.0, {
            margin: margin, ease: 'easeOutQuart', delay: 1.0,
            onStart: function() {
                document.body.style.background = '#fff'
            }
        })

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
        var indicator = require('./3d/click-indicator')(viewer, earth.object3d)

        //hide text when menu is opening
        about.on('open', text.hide.bind(null))

        var search = coffee(text)
        var tmpSphere = new THREE.Sphere()

        var handleSearch = throttle(function(latlng, pos) {
            if (about.open)
                return

            var sphere = earth.geometry.boundingSphere
            tmpSphere.copy(sphere)
            tmpSphere.applyMatrix4(earth.object3d.matrixWorld)

            indicator.place(pos, earth.object3d.position, tmpSphere.radius)
            indicator.show()
            
            search(latlng)
        }, 3000, { leading: true, trailing: true })

        //don't let user click right away
        setTimeout(function() {
            earth.on('select', handleSearch)
        }, 3000)


    })
})
