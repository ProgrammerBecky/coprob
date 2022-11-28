import Stats from '/node_modules/three/examples/jsm/libs/stats.module.js'

const canvas = document.createElement( 'canvas' );
canvas.classList.add( 'threeD' );
document.body.appendChild( canvas );

let offscreen = canvas.transferControlToOffscreen();

const threeD = new Worker(
    '3d.js',
    {
        type: 'module'
    },
);	
threeD.onerror = (e) => {
    console.error( e );
}
threeD.addEventListener( 'message' , e => {
    console.log( e.data );
});
threeD.postMessage({
    type: 'init',
    canvas: offscreen,
    width: canvas.clientWidth,
    height: canvas.clientHeight,
    pixelRatio: window.devicePixelRatio,
} , [ offscreen ]);

/*

        window.addEventListener( 'resize' , () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            G.camera.aspect = width / height;
            G.camera.updateProjectionMatrix();
            
            G.renderer.setSize( width , height );
        });
        */

/*
let stats;
    stats = Stats();
    document.body.appendChild( stats.dom );

    stats.begin();
*/