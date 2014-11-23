var Promise = require('bluebird')
var THREE = require('three')
var create = require('./three-mesh-viewer')(THREE)

var preload = require('./preload-textures')
var createMesh = Promise.promisify(require('./create-mesh'))
var createEarth = require('./earth')
var TweenMax = require('gsap')

var cache = require('./texture-cache')

require('domready')(function() {
    document.body.style.background = '#171c10'

    Promise.all([
        preload(cache.paths),
        createMesh()
    ]).spread( (images, mesh) => {
        var viewer = create()
        var tmp = new THREE.Vector3()
            
        viewer.controls.target.set(0, 4, 0)
        viewer.controls.zoomSpeed = 0.1
        viewer.controls.rotateSpeed = 0.4
        viewer.controls.minDistance = 4
        viewer.controls.minPolarAngle = 30 * Math.PI/180 
        viewer.controls.maxPolarAngle = 150 * Math.PI/180 
        viewer.controls.maxDistance = 7
        viewer.camera.position.set(0, 8, 5)
            
        TweenMax.to(viewer.camera.position, 1, {
            x: 5, ease: 'easeOutQuart', delay: 0
        })

        require('./add-lights')(viewer.scene)
        require('./stars')(viewer)
        createEarth(viewer, mesh)
    })
})
