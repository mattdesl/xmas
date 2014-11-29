var THREE = require('three')
var matcap = require('../shaders/matcap')
var cache = require('../texture-cache')

var normUrl = cache('img/nrm3.png')
var matCapUrl = cache('img/mcap3.png')

module.exports = function(cb) {
    cb = typeof cb === 'function' ? cb : function() {}

    var reflectionCube
    // opt.envMap
    //require('./get-cube')()

    var loader = new THREE.JSONLoader(false)
    loader.load("models/ball.js", function(geometry, materials) {
        // geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2))
        geometry.computeVertexNormals()

        var nrm = THREE.ImageUtils.loadTexture(normUrl)
        nrm.wrapS = nrm.wrapT = THREE.RepeatWrapping
        nrm.minFilter = nrm.magFilter = THREE.LinearFilter
        nrm.generateMipmaps = false

        var tex = THREE.ImageUtils.loadTexture(matCapUrl) //mcap1, mcap4
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
        tex.minFilter = tex.magFilter = THREE.LinearFilter
        tex.generateMipmaps = false

        var mat = material(tex, nrm, reflectionCube, 1.0)
        var capMat = material(tex, nrm, reflectionCube, 0.0)

        var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial([
            capMat, capMat, mat
        ]))
        cb(null, mesh)
    })


    function material(matCapTex, normalTex, envMap, seethru) {
        var nrm = normalTex
        var tex = matCapTex

        var mat = new THREE.ShaderMaterial(matcap({
            normalMap: nrm,
            blending: THREE.NormalBlending,
            transparent: true,
            tMatCap: tex
        }));
        mat.uniforms.combine.value = 2
        mat.uniforms.envMap.value = envMap
        mat.uniforms.reflectivity.value = 0.15
        mat.uniforms.shininess.value = 70
        mat.uniforms.diffuse.value = new THREE.Color(0xffffff)
        // mat.uniforms.diffuse.value = new THREE.Color(0xde7415)
        mat.uniforms.tMatCap.value = tex
        mat.uniforms.refractionRatio.value = 0.9
        mat.uniforms.flipEnvMap.value = 1
        mat.normalMap = nrm
        mat.uniforms.normalScale.value.multiplyScalar(0.02)
        mat.uniforms.seethru.value = seethru
        mat.needsUpdate = true
        return mat
    }
}