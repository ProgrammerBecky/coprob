import { G } from './../G.js';
import {
    Scene,
    WebGLRenderer,
    PerspectiveCamera,
    AmbientLight,
    DirectionalLight,
    CubeTextureLoader,
    PCFSoftShadowMap,
    Clock,

    CubeRefractionMapping,
    LinearFilter,
    LinearMipMapLinearFilter,
    sRGBEncoding,
    
    Color,
    Vector3,
} from 'three';
import { animate } from './animate.js';

export const init3d = (e) => {

    e.data.canvas.setAttribute = (a,b) => {};
    e.data.canvas.style = { width: 0 , height: 0 };        
    
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

    G.camera = new PerspectiveCamera( 60, e.data.width / e.data.height , 1 , 50000 );
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

    G.fbx.load( '/3d/buildings/BB-001.fbx' , result => {
        result.position.set( 0,0,100 );
        G.camera.lookAt( 0,0,100 );
        G.scene.add( result );
    });

    animate();
    
}