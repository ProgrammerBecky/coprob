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
import { CSM } from './../../node_modules/three/examples/jsm/csm/CSM.js';
import { CSMHelper } from './../../node_modules/three/examples/jsm/csm/CSMHelper.js';
import { animate } from './animate.js';
import { Ship } from './Ship.js';

export const init3d = (e) => {

    e.data.canvas.setAttribute = (a,b) => {};
    e.data.canvas.style = { width: 0 , height: 0 };        
    
    G.scene = new Scene();

    const cubeTextureLoader = new CubeTextureLoader();
    cubeTextureLoader.setPath( '3d/envMap/' );
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

    G.viewWidth = e.data.width;
    G.viewHeight = e.data.height;
    
    G.camera = new PerspectiveCamera( 60, e.data.width / e.data.height , 1 , 50000000 );
    G.camera.name = 'Camera';
    G.scene.add( G.camera );

    G.scene.background = G.environmentMap;

    //G.ambient = new AmbientLight( 0x222222 );
    //G.ambient.name = 'Ambient Light';
    //G.scene.add( G.ambient );

    G.sunRealPosition = new Vector3(
        0 , 0 , 50000000
    );
/*
    G.sun = new DirectionalLight( 0x888888 , 1 );
    G.sun.position.set( 0 , 1 , 1 );
    G.sun.name = 'Sun Light';
    G.sun.castShadow = true;
    //G.sun.shadow.bias = 0.0002;
    //G.sun.shadow.normalBias = 7;
    G.sun.shadow.mapSize.width = 4096;
    G.sun.shadow.mapSize.height = 4096;
    G.sun.shadow.camera.near = 1;
    G.sun.shadow.camera.far = 2500000;
    G.sun.shadow.camera.left = -1250000;
    G.sun.shadow.camera.right = 1250000;
    G.sun.shadow.camera.top = 1250000;
    G.sun.shadow.camera.bottom = -1250000;
*/   
    G.csm = new CSM({
        fade: true,
        maxFar: 5000000,
        lightNear: 1000,
        lightFar: 5000000,
        shadowBias: 0.00015,
        cascades: 4,
        mode: 'logarithmic',
        parent: G.scene,
        shadowMapSize: 4096,
        lightDirection: new Vector3( -0.5,0.5,0.5 ),
        camera: G.camera,
        lightIntensity: 1.5,
    });
   
    //G.scene.add( G.sun );
    //G.sun.target.name = 'Sun Light Target';
    //G.scene.add( G.sun.target );
    
    G.clock = new Clock();

    G.ships = [
        new Ship( 'Drake' ),
        new Ship( 'Archangel' ),
    ];
    animate();
    
}