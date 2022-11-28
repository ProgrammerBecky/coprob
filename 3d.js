import {
    Scene,
    WebGLRenderer,
    PerspectiveCamera,
    AmbientLight,
    DirectionalLight,
    TextureLoader,
    CubeTextureLoader,
    PCFSoftShadowMap,
    Clock,

    CubeRefractionMapping,
    LinearFilter,
    LinearMipMapLinearFilter,
    sRGBEncoding,
    
    Color,
    LoadingManager,
    
    FileLoader,
    ImageLoader,
    
    Vector3,
} from 'three';
import { G } from './G.js';
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from '/node_modules/three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';

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

/* N8's SSAO
https://github.com/N8python/randomPhysics
*/

try {
    console.log( 'init' );
    onmessage = (e) => {
        if( e.data.type === 'init' ) {
            init3d( e );
        }
    }

    const init3d = (e) => {
        
        e.data.canvas.setAttribute = (a,b) => {};
		e.data.canvas.style = { width: 0 , height: 0 };        
        
        G.texture = new TextureLoader( G.manager );
        G.gltf = new GLTFLoader( G.manager );
        G.fbx = new FBXLoader( G.manager );
        
        G.scene = new Scene();

/*
        const cubeTextureLoader = new CubeTextureLoader();
        cubeTextureLoader.setPath( '3d/high/skybox/' );
        G.environmentMap = cubeTextureLoader.load([
            'posx.jpg',
            'negx.jpg',
            'posy.jpg',
            'negy.jpg',
            'posz.jpg',
            'negz.jpg'
        ]);
        
        G.environmentMap.mapping = CubeRefractionMapping;
        G.environmentMap.magFilter = LinearFilter;
        G.environmentMap.minFilter = LinearMipMapLinearFilter;
        G.environmentMap.encoding = sRGBEncoding;
*/
        G.renderer = new WebGLRenderer({
            canvas: e.data.canvas,
            logarithmicDepthBuffer: true,
            antialias: true,
        });

        G.renderer.outputEncoding = sRGBEncoding;
        G.renderer.shadowMap.enabled = true;
        G.renderer.shadowMap.type = PCFSoftShadowMap;    
        G.renderer.setPixelRatio( e.data.devicePixelRatio );
        G.renderer.setSize( e.data.width , e.data.height );

        G.camera = new PerspectiveCamera( 60, e.data.width / e.data.height , 1 , 1024*7 );
        G.scene.add( G.camera );

        
        G.scene.background = new Color( 0x081215 );

        G.ambient = new AmbientLight( 0x222222 );
        G.scene.add( G.ambient );

        G.sun = new DirectionalLight( 0xffffff , 2 );
        G.sun.castShadow = true;
        //G.sun.shadow.bias = 0.0002;
        G.sun.shadow.normalBias = 7;
        G.sun.shadow.mapSize.width = 4096;
        G.sun.shadow.mapSize.height = 4096;
        G.sun.shadow.camera.near = 1;
        G.sun.shadow.camera.far = 2048*50;
        G.sun.shadow.camera.left = -1024 * 7;
        G.sun.shadow.camera.right = 1024 * 7;
        G.sun.shadow.camera.top = 1024 * 7;
        G.sun.shadow.camera.bottom = -1024 * 7;
       
        G.scene.add( G.sun );
        G.scene.add( G.sun.target );
        
        G.clock = new Clock();

        animate();
     
    }

    const animate = () => {
     
        requestAnimationFrame( animate );
        const delta = G.clock.getDelta();

        if( delta < 0.1 ) G.unlockLoading++;

        if( G.sun ) {
            G.sun.position.set( G.camera.position.x-1024*10,  1024*25, G.camera.position.z-1024*5 );
            G.sun.target.position.set( G.camera.position.x, 0, G.camera.position.z );
        }
        
        if( delta > 0 ) {
        }
        
        G.renderer.render( G.scene , G.camera );
        
    }

}
catch( e ) {
    self.postMessage({ type: 'error' , message: e.message });
}