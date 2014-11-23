var Promise = require('bluebird')
var THREE = require('three')
var create = require('./three-mesh-viewer')(THREE)

var preload = require('./preload-textures')
var createOrb = Promise.promisify(require('./create-orb'))
var createGift = Promise.promisify(require('./create-gift'))
var createEarth = require('./earth')
var TweenMax = require('gsap')

var cache = require('./texture-cache')
var config = require('./config')

require('domready')(function() {
    document.body.style.background = '#171c10'

    var viewer = create()

    Promise.all([
        preload(cache.paths),
        createOrb({ envMap: viewer.cubeCamera.renderTarget }),
        createGift()
    ]).spread( (images, mesh, gift) => {
        var tmp = new THREE.Vector3()
                
        viewer.controls.target.set(0, 0, 0)
        viewer.controls.zoomSpeed = 0.1
        viewer.controls.rotateSpeed = 0.4
        viewer.controls.minDistance = 4
        viewer.controls.minPolarAngle = 30 * Math.PI/180 
        viewer.controls.maxPolarAngle = 150 * Math.PI/180 
        viewer.controls.maxDistance = 7
        viewer.camera.position.set(0, 4, 5)
            
        TweenMax.to(viewer.camera.position, 1, {
            x: 5, ease: 'easeOutQuart', delay: config.startDelay
        })

        require('./add-lights')(viewer.scene)
        require('./stars')(viewer)
        createEarth(viewer, mesh)
        require('./add-gifts')(viewer, gift)



    })
})
