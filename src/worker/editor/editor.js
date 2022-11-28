import { G } from './../../G.js';
import { getSceneGraph } from './getSceneGraph.js';

export const editor = ( e ) => {
    if( e.data.set === 1 ) {
        self.postMessage({
            type: 'sceneGraph',
            nodes: getSceneGraph( G.scene ),
        });
    }
    else {
        //Editor Off
    }
}