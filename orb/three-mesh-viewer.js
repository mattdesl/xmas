var THREE = require('three')
var createApp = require('canvas-testbed')
var number = require('as-number')
var MakeOrbitController = require('./three-orbit-controls')
var createBackground = require('gl-vignette-background')
var clear = require('gl-clear')({color: 0xffffff})
var Emitter = require('events/')

module.exports = function(THREE) {
    var OrbitController = MakeOrbitController(THREE)
    return setup.bind(null, THREE, OrbitController)
}

function setup(THREE, OrbitController, mesh, opt) {
    var viewer = new Emitter()

    opt = opt||{}
    createApp(render, start, {
        context: 'webgl',
        onResize: handleResize,
        // retina: false
    })

    var background, bgStyle = { scale: [1, 1] }

    return viewer

    function render(gl, width, height, dt) {
        gl.disable(gl.DEPTH_TEST)
        gl.disable(gl.CULL_FACE)
        
        clear(gl)

        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

        var radius = Math.max(width, height) * 1.05
        bgStyle.scale[0] = 1/width * radius
        bgStyle.scale[1] = 1/height * radius
        background.style(bgStyle)
        background.draw()

        viewer.renderer.resetGLState()
        viewer.controls.update()
        viewer.renderer.render(viewer.scene, viewer.camera)

        viewer.emit('tick', dt)
    }

    function start(gl, width, height) {
        viewer.renderer = new THREE.WebGLRenderer({
            canvas: gl.canvas,
            width: width,
            height: height,
        })
        viewer.renderer.setClearColor(0x000000, 1.0)
        viewer.renderer.autoClear = false
        viewer.width = width
        viewer.height = height
        
        opt.fov = number(opt.fov, 50)
        opt.near = number(opt.near, 0.01)
        opt.far = number(opt.far, 1000)
        viewer.camera = new THREE.PerspectiveCamera(opt.fov, width/height, opt.near, opt.far)
        viewer.camera.position.z = -5
        viewer.camera.lookAt(new THREE.Vector3())

        viewer.scene = new THREE.Scene()
        if (mesh) 
            viewer.scene.add(mesh)

        viewer.controls = new OrbitController(viewer.camera)

        background = createBackground(viewer.renderer.getContext(), {
            aspect: 1,
            // color1: [1, 1, 1],
            // color2: [0.25, 0.25, 0.25],
            color2: [0.02, 0.02, 0.02],
            color1: [0.12, 0.12, 0.12],
            smoothing: [ -0.5, 1.0 ],
            noiseAlpha: 0.4,
            offset: [ -0.05, -0.15 ]
        })
    }

    function handleResize(width, height) {
        viewer.renderer.setViewport(0,0,width,height)
        viewer.width = width
        viewer.height = height
        viewer.camera.aspect = width/height
        viewer.camera.updateProjectionMatrix()
    }
}

