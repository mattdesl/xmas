var THREE = require('three')
var createApp = require('canvas-testbed')
var number = require('as-number')
var MakeOrbitController = require('./three-orbit-controls')
var createBackground = require('gl-vignette-background')
var Emitter = require('events/')

module.exports = function(THREE) {
    var OrbitController = MakeOrbitController(THREE)
    return function(opt) {
        return setup(THREE, OrbitController, opt)
    }
}

function setup(THREE, OrbitController, opt) {
    var viewer = new Emitter()

    viewer.margin = 0

    opt = opt||{}
    createApp(render, start, {
        canvas: opt.canvas,
        context: 'webgl',
        contextAttributes: {
            antialias: true,
            alpha: false
        },
        onResize: handleResize,
        // retina: false
    })

    var background, bgStyle = { scale: [1, 1] }
    var dpr = window.devicePixelRatio||1

    return viewer

    function render(gl, width, height, dt) {
        gl.disable(gl.DEPTH_TEST)
        gl.disable(gl.CULL_FACE)
        var pad = viewer.margin 
        
        viewer.renderer.enableScissorTest(false)
        viewer.renderer.clear()

        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        
        viewer.renderer.enableScissorTest(true)
        viewer.renderer.setScissor(pad, pad, width - pad*2, height - pad*2)

        var radius = Math.max(width, height) * 1.05
        bgStyle.scale[0] = 1/width * radius
        bgStyle.scale[1] = 1/height * radius
        background.style(bgStyle)
        background.draw()

        viewer.renderer.resetGLState()
        viewer.controls.update()

        // viewer.renderer.enableScissorTest(true)
        // viewer.renderer.setScissor(pad, pad, width*dpr, height*dpr)

        // viewer.cubeIgnores.forEach(function(mesh) {
        //     mesh.visible = false
        // })
        // viewer.renderer.clearTarget(viewer.cubeCamera.renderTarget, true, true, false)
        // viewer.cubeCamera.updateCubeMap(viewer.renderer, viewer.scene);
        // viewer.cubeIgnores.forEach(function(mesh) {
        //     mesh.visible = true
        // })
        // viewer.renderer.setViewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
            
        viewer.renderer.render(viewer.scene, viewer.camera)

        viewer.emit('tick', dt)
        viewer.emit('text', dt)
    }

    function start(gl, width, height) {
        viewer.renderer = new THREE.WebGLRenderer({
            canvas: gl.canvas,
            width: width,
            antialias: true,
            alpha: false,
            height: height,
        })
        viewer.renderer.setClearColor(0xffffff, 1.0)
        viewer.renderer.autoClear = false
        viewer.width = width
        viewer.height = height
        
        opt.fov = number(opt.fov, 45)
        opt.near = number(opt.near, 0.01)
        opt.far = number(opt.far, 1000)
        viewer.camera = new THREE.PerspectiveCamera(opt.fov, width/height, opt.near, opt.far)
        viewer.camera.position.z = -5
        viewer.camera.lookAt(new THREE.Vector3())

        viewer.scene = new THREE.Scene()
        
        viewer.controls = new OrbitController(viewer.camera)
        viewer.cubeIgnores = []
        // viewer.cubeCamera = new THREE.CubeCamera( opt.near, opt.far, 256 )
        // viewer.cubeCamera.renderTarget.minFilter = THREE.LinearFilter
        // viewer.cubeCamera.renderTarget.generateMipmaps = false
        // viewer.scene.add(viewer.cubeCamera);

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

