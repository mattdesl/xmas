/*jshint -W069 */
var THREE = require('three')
var xtend = require('xtend')

var normalmap = `
#ifdef USE_NORMALMAP

uniform sampler2D normalMap;
uniform vec2 normalScale;

        // Per-Pixel Tangent Space Normal Mapping
        // http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html

vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {
    vec3 q0 = dFdx( eye_pos.xyz );
    vec3 q1 = dFdy( eye_pos.xyz );
    vec2 st0 = dFdx( vUv.st );
    vec2 st1 = dFdy( vUv.st );

    vec3 S = normalize( q0 * st1.t - q1 * st0.t );
    vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
    vec3 N = normalize( surf_norm );

    vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
    mapN.xy = normalScale * mapN.xy;
    mat3 tsn = mat3( S, T, N );
    return normalize( tsn * mapN );

}

#endif
`
module.exports = function(opt) {
    opt = opt||{}

    var ret = xtend({
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib["common"],
            THREE.UniformsLib["bump"],
            THREE.UniformsLib["normalmap"],
            THREE.UniformsLib["fog"],
            THREE.UniformsLib["lights"],
            THREE.UniformsLib["shadowmap"],

            {
                "ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) },
                "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
                "specular" : { type: "c", value: new THREE.Color( 0x111111 ) },
                "shininess": { type: "f", value: 30 },
                "seethru": { type: "f", value: 0 },
                "wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) },
                "tMatCap"  : { type: "t", value: opt.tMatCap || new THREE.Texture() }
            }

        ] ),

        vertexShader: [
            "#define PHONG",

            "varying vec3 vViewPosition;",
            "varying vec3 vNormal;",
            "varying vec3 matCapE;",

            "varying vec2 vUv;",
            "uniform vec4 offsetRepeat;",


            THREE.ShaderChunk[ "lightmap_pars_vertex" ],
            THREE.ShaderChunk[ "envmap_pars_vertex" ],
            THREE.ShaderChunk[ "lights_phong_pars_vertex" ],
            THREE.ShaderChunk[ "color_pars_vertex" ],
            THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
            THREE.ShaderChunk[ "skinning_pars_vertex" ],
            THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
            THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

            "void main() {",

                "matCapE = normalize( vec3( modelViewMatrix * vec4( position.xyz, 1.0 ) ) );",

                THREE.ShaderChunk[ "map_vertex" ],
                THREE.ShaderChunk[ "lightmap_vertex" ],
                THREE.ShaderChunk[ "color_vertex" ],

                THREE.ShaderChunk[ "morphnormal_vertex" ],
                THREE.ShaderChunk[ "skinbase_vertex" ],
                THREE.ShaderChunk[ "skinnormal_vertex" ],
                THREE.ShaderChunk[ "defaultnormal_vertex" ],

            "   vNormal = normalize( transformedNormal );",

                THREE.ShaderChunk[ "morphtarget_vertex" ],
                THREE.ShaderChunk[ "skinning_vertex" ],
                THREE.ShaderChunk[ "default_vertex" ],
                THREE.ShaderChunk[ "logdepthbuf_vertex" ],

            "   vViewPosition = -mvPosition.xyz;",

                THREE.ShaderChunk[ "worldpos_vertex" ],
                THREE.ShaderChunk[ "envmap_vertex" ],
                THREE.ShaderChunk[ "lights_phong_vertex" ],
                THREE.ShaderChunk[ "shadowmap_vertex" ],

            "}"

        ].join("\n"),

        fragmentShader: [
            "#define PHONG",

            "uniform vec3 diffuse;",
            "uniform float opacity;",

            "uniform vec3 ambient;",
            "uniform vec3 emissive;",
            "uniform vec3 specular;",
            "uniform float shininess;",
            "uniform float seethru;",
            "varying vec3 matCapE;",
            "uniform sampler2D tMatCap;",

            THREE.ShaderChunk[ "color_pars_fragment" ],
            
            THREE.ShaderChunk[ "map_pars_fragment" ],
            THREE.ShaderChunk[ "alphamap_pars_fragment" ],
            THREE.ShaderChunk[ "lightmap_pars_fragment" ],
            THREE.ShaderChunk[ "envmap_pars_fragment" ],
            THREE.ShaderChunk[ "fog_pars_fragment" ],
            THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
            THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
            THREE.ShaderChunk[ "bumpmap_pars_fragment" ],
            //THREE.ShaderChunk[ "normalmap_pars_fragment" ],
            normalmap,
            THREE.ShaderChunk[ "specularmap_pars_fragment" ],
            THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

            "void main() {",

            "   gl_FragColor = vec4( vec3( 1.0 ), opacity );",
                THREE.ShaderChunk[ "logdepthbuf_fragment" ],
                THREE.ShaderChunk[ "map_fragment" ],

                THREE.ShaderChunk[ "alphamap_fragment" ],
                THREE.ShaderChunk[ "alphatest_fragment" ],
                THREE.ShaderChunk[ "specularmap_fragment" ],

                THREE.ShaderChunk[ "lights_phong_fragment" ],


                "vec3 r = reflect( matCapE, normal );",
                "r.z += 1.0;",
                "float m = 2. * length(r);",
                "vec2 vN = r.xy / m + .5;",
                "vec3 matCapColor = texture2D( tMatCap, vN ).rgb;",


                "gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * matCapColor, 1.0);",
                    
                "float rimval = 1.0 * smoothstep(-1.0, 1.0, normal.y);",
                "float rimPower = 2.0;",
                "float rimf = rimPower * abs(dot(normal, matCapE));",
                "float rimFade = rimval * (1. - smoothstep(0.0, 1.0, rimf));",
                "gl_FragColor.rgb += vec3(rimFade)*0.25;",

                THREE.ShaderChunk[ "lightmap_fragment" ],
                THREE.ShaderChunk[ "color_fragment" ],

                // THREE.ShaderChunk[ "envmap_fragment" ],

                "gl_FragColor.a *= (1.0 - smoothstep(0.0, 3.0, rimf)*seethru);",

                THREE.ShaderChunk[ "shadowmap_fragment" ],

                THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

                THREE.ShaderChunk[ "fog_fragment" ],
                // "gl_FragColor = vec4(vec3(m), 1.0);",

            "}"
        ].join("\n"),
        defines: {
            USE_ENVMAP:"",
            USE_FOG:"",
            // USE_MAP:""
        },
        lights: true
    }, opt)
    if (opt.normalMap) {
        ret.defines["USE_NORMALMAP"] = ""
        ret.uniforms.normalMap.value = opt.normalMap
    }
    // console.log(ret.vertexShader)
    return ret
}