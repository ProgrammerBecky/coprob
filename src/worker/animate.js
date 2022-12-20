import { G } from './../G.js';

export const animate = () => {
 
    requestAnimationFrame( animate );
    G.delta = G.clock.getDelta();
    
    if( G.delta > 0 ) {
        if( G.sun ) {
            G.sun.position.set( G.camera.position.x-1024*10,  1024*25, G.camera.position.z-1024*5 );
            G.sun.target.position.set( G.camera.position.x, 0, G.camera.position.z );
        }
    }
    
    G.camera.position.set(
        (G.mouse.x-0.5)*200000 , 50000, (G.mouse.y-0.5)*200000
    );
    G.camera.lookAt(
        0,0,0
    );
    
    G.renderer.render( G.scene , G.camera );
    
    G.ships.map( ship => {
       ship.update(); 
    });
    
}