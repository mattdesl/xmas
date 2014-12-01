/*jshint -W069 */
var THREE = require('three')

module.exports = function (opt) {
    opt = opt||{}
    var ret = {

        uniforms: THREE.UniformsUtils.merge( [

            THREE.UniformsLib[ "common" ],
            THREE.UniformsLib[ "fog" ],
            THREE.UniformsLib[ "shadowmap" ],
            {
                "tProcessed"  : { type: "t", value: opt.tProcessed || new THREE.Texture() },
                "origin"  : { type: "v3", value: new THREE.Vector3() },
                "anim"  : { type: "f", value: 0 }
            }
        ] ),

        vertexShader: [

            THREE.ShaderChunk[ "map_pars_vertex" ],
            THREE.ShaderChunk[ "lightmap_pars_vertex" ],
            THREE.ShaderChunk[ "envmap_pars_vertex" ],
            THREE.ShaderChunk[ "color_pars_vertex" ],
            THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
            THREE.ShaderChunk[ "skinning_pars_vertex" ],
            THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
            THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],
            "varying vec4 vWorldPos1;",

            "void main() {",
            
                THREE.ShaderChunk[ "map_vertex" ],
                THREE.ShaderChunk[ "lightmap_vertex" ],
                THREE.ShaderChunk[ "color_vertex" ],
                THREE.ShaderChunk[ "skinbase_vertex" ],

            "   #ifdef USE_ENVMAP",

                THREE.ShaderChunk[ "morphnormal_vertex" ],
                THREE.ShaderChunk[ "skinnormal_vertex" ],
                THREE.ShaderChunk[ "defaultnormal_vertex" ],

            "   #endif",

                THREE.ShaderChunk[ "morphtarget_vertex" ],
                THREE.ShaderChunk[ "skinning_vertex" ],
                THREE.ShaderChunk[ "default_vertex" ],
                THREE.ShaderChunk[ "logdepthbuf_vertex" ],

                THREE.ShaderChunk[ "worldpos_vertex" ],
                THREE.ShaderChunk[ "envmap_vertex" ],
                THREE.ShaderChunk[ "shadowmap_vertex" ],

                "vWorldPos1 = modelMatrix * vec4(position, 1.0);",
            "}"

        ].join("\n"),

        fragmentShader: [

            "uniform vec3 diffuse;",
            "uniform float opacity;",
            "uniform sampler2D tProcessed;",
            "uniform float anim;",
            "uniform vec3 origin;",
            "varying vec4 vWorldPos1;",

            THREE.ShaderChunk[ "color_pars_fragment" ],
            THREE.ShaderChunk[ "map_pars_fragment" ],
            THREE.ShaderChunk[ "alphamap_pars_fragment" ],
            THREE.ShaderChunk[ "lightmap_pars_fragment" ],
            THREE.ShaderChunk[ "envmap_pars_fragment" ],
            THREE.ShaderChunk[ "fog_pars_fragment" ],
            THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
            THREE.ShaderChunk[ "specularmap_pars_fragment" ],
            THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

            "void main() {",

            "   gl_FragColor = vec4( diffuse, opacity );",

                THREE.ShaderChunk[ "logdepthbuf_fragment" ],
                THREE.ShaderChunk[ "map_fragment" ],

                "float dist = distance(origin, vWorldPos1.xyz) / (1.0);",
                "dist = smoothstep(0.20, 0.81, dist);",

                "vec4 procColor = texture2D(tProcessed, vUv);",
                "vec3 blended = max(gl_FragColor.rgb, procColor.rgb);",
                "vec3 other = mix(procColor.rgb, blended, anim);",
                "gl_FragColor.rgb = mix(other, gl_FragColor.rgb, 1.0-dist);",


                THREE.ShaderChunk[ "alphamap_fragment" ],
                THREE.ShaderChunk[ "alphatest_fragment" ],
                THREE.ShaderChunk[ "specularmap_fragment" ],
                THREE.ShaderChunk[ "lightmap_fragment" ],
                THREE.ShaderChunk[ "color_fragment" ],
                THREE.ShaderChunk[ "envmap_fragment" ],
                THREE.ShaderChunk[ "shadowmap_fragment" ],

                THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

                THREE.ShaderChunk[ "fog_fragment" ],
            "}"

        ].join("\n"),

        fog: false,
        defines: {
            "USE_MAP": ""
        }
    }
    ret.uniforms.tProcessed.value = opt.tProcessed
    ret.uniforms.map.value = opt.map
    return ret
}