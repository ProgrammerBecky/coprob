import { G } from './../G.js';

export const animate = () => {
 
    requestAnimationFrame( animate );
    G.delta = G.clock.getDelta();
    
    if( G.delta > 0 ) {
        if( G.sun ) {
            G.sun.position.set(
                G.camera.position.x , G.camera.position.y , G.camera.position.z
            );
            G.sun.lookAt(
                G.sunRealPosition.x , G.sunRealPosition.y , G.sunRealPosition.z
            );
            G.sun.translateZ( 80000 );
            
            //G.sun.position.set( G.camera.position.x-1024*10,  1024*25, G.camera.position.z-1024*5 );
            //G.sun.target.position.set( G.camera.position.x, 0, G.camera.position.z );
        }
    }
    
    /*
    G.camera.position.set(
        (G.mouse.x-0.5)*700000 , 100000, (G.mouse.y-0.5)*700000
    );
    G.camera.lookAt(
        0,0,0
    );
    */
    if( G.ships[0].ent ) {
        G.camera.position.copy( G.ships[0].ent.position.clone() );
        G.camera.rotation.copy( G.ships[0].ent.rotation.clone() );
        G.camera.rotateY(Math.PI);
        G.camera.translateY(12000);
        G.camera.translateZ(-6000);
        G.camera.rotateY( 0.5 - G.mouse.x );
        G.camera.rotateX( 0.5 - G.mouse.y );
    }
    
    G.renderer.render( G.scene , G.camera );
    
    G.ships.map( ship => {
       ship.update(); 
    });
    
}