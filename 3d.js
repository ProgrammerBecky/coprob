import {
    LoadingManager,
    FileLoader,
    ImageLoader,
    TextureLoader,
    Vector2,
} from 'three';
import { G } from './src/G.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from './node_modules/three/examples/jsm/loaders/FBXLoader.js';
import { init3d } from './src/worker/init3d.js';
import { resize } from './src/worker/resize.js';
import { editor } from './src/worker/editor/editor.js';

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
G.mouse = new Vector2(0,0);
G.canvas = false;

/* N8's SSAO
https://github.com/N8python/randomPhysics
*/

try {

    onmessage = (e) => {
        if( e.data.type === 'canvas' ) {
            G.canvas = e.data.canvas;
        }
        if( e.data.type === 'init' ) {
            init3d( e );
        }
        else if( e.data.type === 'resize' ) {
            resize( e );
        }
        else if( e.data.type === 'editor' ) {
            editor( e );
        }
        else if( e.data.type === 'mousemove' ) {
            G.mouse.set( e.data.x/G.viewWidth, e.data.y/G.viewHeight );
        }
        else if( e.data.type === 'canopy' ) {
            G.ships[0].canopyOpen = 1 - G.ships[0].canopyOpen;
        }
        else if( e.data.type === 'controls' ) {
            G.ships[0].controls = e.data.controls;
        }
        else if( e.data.type === 'texture' ) {
            G.ships[0].setCustomPaint( e );
            G.ships[1].setCustomPaint( e );
        }
        else if( e.data.type === 'shipClass' ) {
            if( G.ships[1].shipType !== e.data.shipClass ) {
                G.ships[1].destroy();
                G.ships[1].setType( e.data.shipClass );
            }
        }
    }

}
catch( e ) {
    self.postMessage({ type: 'error' , message: e.message });
}