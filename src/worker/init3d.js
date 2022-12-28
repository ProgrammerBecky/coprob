import { G } from './../G.js';
import {
    Scene,
    WebGLRenderer,
    PerspectiveCamera,
    AmbientLight,
    PointLight,
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
    
    G.camera = new PerspectiveCamera( 60, e.data.width / e.data.height , 1 , 5000000 );
    G.camera.name = 'Camera';
    G.scene.add( G.camera );

    G.scene.background = G.environmentMap;

    //G.ambient = new AmbientLight( 0x222222 );
    //G.ambient.name = 'Ambient Light';
    //G.scene.add( G.ambient );

    G.sunRealPosition = new Vector3(
        0 , 0 , 50000000
    );

    G.sun = new PointLight( 0x888888 , 1 , 5000000);
    G.sun.position.set( 0 , 0 , 1250000 );
    G.sun.name = 'Sun Light';
    G.sun.castShadow = true;
    //G.sun.shadow.bias = 0.0002;
    //G.sun.shadow.normalBias = 7;
    G.sun.shadow.mapSize.width = 4096;
    G.sun.shadow.mapSize.height = 4096;
    G.sun.shadow.camera.near = 1;
    G.sun.shadow.camera.far = 100000;
    G.sun.shadow.camera.left = -100000;
    G.sun.shadow.camera.right = 100000;
    G.sun.shadow.camera.top = 100000;
    G.sun.shadow.camera.bottom = -100000;
   
    G.scene.add( G.sun );
    //G.sun.target.name = 'Sun Light Target';
    //G.scene.add( G.sun.target );
    
    G.clock = new Clock();

    G.ships = [
        new Ship( 'Drake' ),
        new Ship( 'Drake' ),
    ];
    animate();
    
}