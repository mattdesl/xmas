var THREE = require('three')
var matcap = require('./shaders/matcap')

module.exports = function(cb) {
    cb = cb || ()=>{}

    var loader = new THREE.JSONLoader(true)
    loader.load("ball.js", function(geometry) {
        geometry.computeVertexNormals()

        var urls = ['px', 'nx', 'py', 'ny', 'pz', 'nz'].map(function(loc) {
            return ['img/SwedishRoyalCastle/', loc, '.jpg'].join('')
        })

        var reflectionCube = THREE.ImageUtils.loadTextureCube(urls)
        reflectionCube.minFilter = THREE.LinearFilter
        reflectionCube.magFilter = THREE.LinearFilter
        reflectionCube.format = THREE.RGBFormat

        var nrm = THREE.ImageUtils.loadTexture('img/nrm3.png')
        nrm.wrapS = nrm.wrapT = THREE.RepeatWrapping

        var tex = THREE.ImageUtils.loadTexture('img/mcap3.png') //mcap1, mcap4
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
        tex.minFilter = tex.magFilter = THREE.LinearFilter

        var mat = new THREE.ShaderMaterial(matcap({
            normalMap: nrm,
            tMatCap: tex
        }));
        mat.uniforms.combine.value = 2
        mat.uniforms.envMap.value = reflectionCube
        mat.uniforms.reflectivity.value = 0.70
        mat.uniforms.shininess.value = 70
        mat.uniforms.diffuse.value = new THREE.Color(0xefefef)
        mat.uniforms.tMatCap.value = tex
        mat.normalMap = nrm
        mat.uniforms.normalScale.value.multiplyScalar(0.03)
        mat.needsUpdate = true
        
        var mesh = new THREE.Mesh(geometry, mat)
        cb(null, mesh)
    })
}