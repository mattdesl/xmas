var Promise = require('bluebird')
var THREE = require('three')
var create = require('./three-mesh-viewer')(THREE)

var preload = require('./preload-textures')
var createOrb = Promise.promisify(require('./create-orb'))
var createGift = Promise.promisify(require('./create-gift'))
var createEarth = require('./earth')
var TweenMax = require('gsap')

var loadJSON = Promise.promisify(require('load-json-xhr'))

var cache = require('./texture-cache')
var config = require('./config')

require('domready')(function() {
    document.body.style.background = '#151a17'

    var viewer = create()

    Promise.all([
        preload(cache.paths),
        createOrb({ envMap: viewer.cubeCamera.renderTarget }),
        createGift(),
        loadJSON('fonts/LatoBlack-sdf.json')
    ]).spread( (images, mesh, gift, font) => {
        var tmp = new THREE.Vector3()
                
        viewer.scene.fog = new THREE.FogExp2(0x181f1e, 0.05)

        viewer.controls.target.set(0, 0, 0)
        viewer.controls.zoomSpeed = 0.1
        viewer.controls.rotateSpeed = 0.4
        viewer.controls.minPolarAngle = 30 * Math.PI/180 
        viewer.controls.maxPolarAngle = 150 * Math.PI/180 
        viewer.controls.minDistance = 5
        viewer.controls.maxDistance = 9
        viewer.controls.noPan = true
        viewer.camera.position.set(0, 6, 6)
        
        TweenMax.to(viewer.camera.position, 1, {
            y: 3, ease: 'easeOutQuart', delay: config.startDelay
        })

        require('./add-lights')(viewer.scene)
        require('./stars')(viewer)
        createEarth(viewer, mesh)
        require('./add-gifts')(viewer, gift)
        require('./add-text')(viewer, font)

        TweenMax.to(viewer, 1.0, {
            margin: 20, ease: 'easeOutQuart', delay: 1.0,
            onStart: function() {
                document.body.style.background = '#fff'
            }
        })
    })
})
