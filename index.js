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
window.addEventListener( 'mousemove' , (e) => {
    threeD.postMessage({
        type: 'mousemove',
        x: e.clientX,
        y: e.clientY,
    });
});

let controls = {
    turnHorizontal: 0,
    turnVertical: 0,
    rudder: 0,
    throttle: 0,
    slideHorizontal: 0,
    slideVertical: 0,
};
window.addEventListener( 'keydown' , (e) => {
   if( e.code === 'KeyC' ) {
       threeD.postMessage({
           type: 'canopy',
           set: 'toggle'
       });
   }
   else if( e.code === 'KeyA' ) {
       controls.turnHorizontal = -1;
       sendControls();
   }
   else if( e.code === 'KeyD' ) {
       controls.turnHorizontal = 1;
       sendControls();
   }
   else if( e.code === 'KeyW' ) {
       controls.turnVertical = 1;
       sendControls();
   }
   else if( e.code === 'KeyS' ) {
       controls.turnVertical = -1;
       sendControls();
   }
   else if( e.code === 'ArrowLeft' ) {
       controls.slideHorizontal = -1;
       sendControls();
   }
   else if( e.code === 'ArrowRight' ) {
       controls.slideHorizontal = 1;
       sendControls();
   }
   else if( e.code === 'ArrowUp' ) {
       controls.slideVertical = 1;
       sendControls();
   }
   else if( e.code === 'ArrowDown' ) {
       controls.slideVertical = -1;
       sendControls();
   }
   else if( e.code === 'KeyQ' ) {
       controls.rudder = -1;
       sendControls();
   }
   else if( e.code === 'KeyE' ) {
       controls.rudder = 1;
       sendControls();
   }
   else if( e.code === 'Digit1' ) {
       controls.throttle = 0.11;
       sendControls();
   }
   else if( e.code === 'Digit2' ) {
       controls.throttle = 0.22;
       sendControls();
   }
   else if( e.code === 'Digit3' ) {
       controls.throttle = 0.33;
       sendControls();
   }
   else if( e.code === 'Digit4' ) {
       controls.throttle = 0.44;
       sendControls();
   }
   else if( e.code === 'Digit5' ) {
       controls.throttle = 0.56;
       sendControls();
   }
   else if( e.code === 'Digit6' ) {
       controls.throttle = 0.67;
       sendControls();
   }
   else if( e.code === 'Digit7' ) {
       controls.throttle = 0.78;
       sendControls();
   }
   else if( e.code === 'Digit8' ) {
       controls.throttle = 0.89;
       sendControls();
   }
   else if( e.code === 'Digit9' ) {
       controls.throttle = 1.00;
       sendControls();
   }
   else if( e.code === 'Digit0' ) {
       controls.throttle = 0;
       sendControls();
   }
});
window.addEventListener( 'keyup' , (e) => {
   if( ['KeyA','KeyD'].includes( e.code ) ) {
       controls.turnHorizontal = 0;
       sendControls();
   }
   else if( ['KeyW','KeyS'].includes( e.code ) ) {
       controls.turnVertical = 0;
       sendControls();
   }
   else if( ['KeyQ','KeyE'].includes( e.code ) ) {
       controls.rudder = 0;
       sendControls();
   }
   else if( ['ArrowLeft','ArrowRight'].includes( e.code ) ) {
       controls.slideHorizontal = 0;
       sendControls();
   }
   else if( ['ArrowUp','ArrowDown'].includes( e.code ) ) {
       controls.slideVertical = 0;
       sendControls();
   }
});
const sendControls = () => {
    threeD.postMessage({
        type: 'controls',
        controls: controls,
    });
}