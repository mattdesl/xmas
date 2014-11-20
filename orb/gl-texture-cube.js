var THREE = require('three')

module.exports = function() {
    var reflectionCube = new THREE.CubeTexture( [] );
    reflectionCube.format = THREE.RGBFormat;
    reflectionCube.flipY = false;

    var loader = new THREE.ImageLoader();
    loader.load( 'img/earth.png', function ( image ) {

        var getSide = function ( x, y ) {

            var size = 512;

            var canvas = document.createElement( 'canvas' );
            canvas.width = size;
            canvas.height = size;

            var context = canvas.getContext( '2d' );
            context.drawImage( image, - x * size, - y * size );

            return canvas;

        };

        reflectionCube.images[ 0 ] = getSide( 2, 1 ); // px
        reflectionCube.images[ 1 ] = getSide( 0, 1 ); // nx
        reflectionCube.images[ 2 ] = getSide( 1, 0 ); // py
        reflectionCube.images[ 3 ] = getSide( 1, 2 ); // ny
        reflectionCube.images[ 4 ] = getSide( 1, 1 ); // pz
        reflectionCube.images[ 5 ] = getSide( 3, 1 ); // nz
        reflectionCube.needsUpdate = true;

    } );

    // var urls = ['px', 'nx', 'py', 'ny', 'pz', 'nz'].map(function(loc) {
    //     return ['img/SwedishRoyalCastle/', loc, '.jpg'].join('')
    // })

    // var reflectionCube = THREE.ImageUtils.loadTextureCube(urls)
    reflectionCube.minFilter = THREE.LinearFilter
    reflectionCube.magFilter = THREE.LinearFilter
    // reflectionCube.format = THREE.RGBFormat
    return reflectionCube
}