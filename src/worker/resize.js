import { G } from './../G.js';

export const resize = (e) => {
    G.camera.aspect = e.data.width / e.data.height;
    G.camera.updateProjectionMatrix();
    G.renderer.setSize( e.data.width , e.data.height );
}