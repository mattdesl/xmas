var xtend = require('xtend')
var number = require('as-number')
var THREE = require('three')

module.exports = function (opt) {
    opt = opt||{}

    var ret = xtend({
        transparent: true,
        uniforms: {
            thickness: { type: 'f', value: number(opt.thickness, 0.1) },
            opacity: { type: 'f', value: number(opt.opacity, 1.0) },
            diffuse: { type: 'c', value: new THREE.Color(opt.diffuse) },
            dashed: { type: 'i', value: 1 },
            dashSteps: { type: 'f', value: 12 },
            dashDistance: { type: 'f', value: 0.2 },
            dashSmooth: { type: 'f', value: 0.01 }
        },
        attributes: {
            lineMiter:  { type: 'f', value: 0 },
            lineDistance: { type: 'f', value: 0 },
            lineNormal: { type: 'v2', value: new THREE.Vector2() }
        },
        vertexShader: [
            "uniform float thickness;",
            "attribute float lineMiter;",
            "attribute vec2 lineNormal;",
            "attribute float lineDistance;",
            "varying float lineU;",

            "void main() {",
                "lineU = lineDistance;",
                "vec3 pointPos = position.xyz + vec3(lineNormal * thickness/2.0 * lineMiter, 1.0);",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( pointPos, 1.0 );",
            "}"
        ].join("\n"),
        fragmentShader: [   
            "varying float lineU;",

            "uniform float opacity;",
            "uniform vec3 diffuse;",
            "uniform float dashSteps;",
            "uniform float dashSmooth;",
            "uniform float dashDistance;",
            "uniform int dashed;",

            "void main() {",
                "if (dashed == 1) {",
                    "float lineUMod = mod(lineU, 1.0/dashSteps) * dashSteps;",
                    "float dist = dashDistance;",
                    "float dash = smoothstep(dist, dist+dashSmooth, length(lineUMod-0.5));",
                    "gl_FragColor = vec4(vec3(diffuse * dash), opacity * dash);",
                "} else {",
                    "gl_FragColor = vec4(diffuse, opacity);",
                "}",
            "}"
        ].join("\n")
    }, opt)
    return ret
}