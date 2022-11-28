import { G } from './../G.js';

export const animate = () => {
 
    requestAnimationFrame( animate );
    const delta = G.clock.getDelta();
    
    if( delta > 0 ) {
        if( G.sun ) {
            G.sun.position.set( G.camera.position.x-1024*10,  1024*25, G.camera.position.z-1024*5 );
            G.sun.target.position.set( G.camera.position.x, 0, G.camera.position.z );
        }
    }
    
    G.renderer.render( G.scene , G.camera );
    
}