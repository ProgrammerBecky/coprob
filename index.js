import { buildSceneGraph } from './src/main/editor/buildSceneGraph.js';

const canvas = document.createElement( 'canvas' );
canvas.classList.add( 'threeD' );
document.body.appendChild( canvas );

const offscreenCanvas = canvas.transferControlToOffscreen();

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
    if( e.data.type === 'sceneGraph' ) {
        buildSceneGraph( e );
    }
});
threeD.postMessage({
    type: 'init',
    canvas: offscreenCanvas,
    width: canvas.clientWidth,
    height: canvas.clientHeight,
    pixelRatio: window.devicePixelRatio,
} , [ offscreenCanvas ]);

window.addEventListener( 'resize' , () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    threeD.postMessage({
        type: 'resize',
        width,
        height,
    });
});

const editor = document.getElementById('EditMode');
if( editor ) {
    editor.addEventListener( 'click' , () => {
        document.getElementById('Editor').removeChild( editor );
        threeD.postMessage({
            type: 'editor',
            set: 1,
        });
    });
}