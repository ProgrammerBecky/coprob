import {
    LoadingManager,
    FileLoader,
    ImageLoader,
    TextureLoader,
} from 'three';
import { G } from './src/G.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from './node_modules/three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { init3d } from './src/worker/init3d.js';
//import { resize } from './src/worker/resize.js';

ImageLoader.prototype.load = function ( url, onLoad, onProgress, onError ) {

	if( this.path ) url = this.path + url;

	if( this.fileLoader === undefined ) {
		this.fileLoader = new FileLoader( this.manager );
		this.fileLoader.setResponseType( 'blob' );
	}
	
	let onFileLoad = blob => {
		createImageBitmap( blob ).then( image => {
			onLoad( image );
		});
	}
	
	this.fileLoader.load( url, onFileLoad , onProgress, onError );
	
}

G.manager = new LoadingManager();
//G.manager.onProgress = (url, itemsLoaded, itemsTotal) => {};
//G.manager.onLoad = () => {};
G.texture = new TextureLoader( G.manager );
G.gltf = new GLTFLoader( G.manager );
G.fbx = new FBXLoader( G.manager );

/* N8's SSAO
https://github.com/N8python/randomPhysics
*/

try {

    onmessage = (e) => {
        if( e.data.type === 'init' ) {
            init3d( e );
        }
        else if( e.data.type === 'resize' ) {
            resize( e );
        }
    }

}
catch( e ) {
    self.postMessage({ type: 'error' , message: e.message });
}