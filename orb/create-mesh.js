var THREE = require('three')
var matcap = require('./shaders/matcap')

module.exports = function(cb) {
    cb = cb || ()=>{}

    var loader = new THREE.JSONLoader(true)
    loader.load("ball.js", function(geometry, materials) {
        // geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2))
        geometry.computeVertexNormals()


        var nrm = THREE.ImageUtils.loadTexture('img/nrm3.png')
        nrm.wrapS = nrm.wrapT = THREE.RepeatWrapping

        var tex = THREE.ImageUtils.loadTexture('img/mcap3.png') //mcap1, mcap4
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
        tex.minFilter = tex.magFilter = THREE.LinearFilter

        var mat = material(tex, nrm, 1.0)
        var capMat = material(tex, nrm, 0.0)

        var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial([
            capMat, capMat, mat
        ]))
        cb(null, mesh)
    })



    function material(matCapTex, normalTex, seethru) {
        var nrm = normalTex
        var tex = matCapTex

        var mat = new THREE.ShaderMaterial(matcap({
            normalMap: nrm,
            blending: THREE.NormalBlending,
            transparent: true,
            tMatCap: tex
        }));
        mat.uniforms.combine.value = 2
        // mat.uniforms.envMap.value = reflectionCube
        mat.uniforms.reflectivity.value = 0.5
        mat.uniforms.shininess.value = 70
        mat.uniforms.diffuse.value = new THREE.Color(0xffffff)
        // mat.uniforms.diffuse.value = new THREE.Color(0x737373)
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