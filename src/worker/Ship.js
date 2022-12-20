import { G } from './../G.js';
import {
    MeshStandardMaterial,
    RepeatWrapping,
    Vector2,
    Color,
    DoubleSide,
    CanvasTexture,
} from 'three';

const emissive = new Color(1,1,1);

export class Ship {
    
    constructor( shipType ) {
        
        this.update = this.update.bind( this );
        this.shipType = shipType;
        
        this.meshes = this.getShipMeshes();
        this.getShipMaterials();
        this.loadMesh( 'hull' , this.meshes.hull );
        
        this.canopyOpen = 0;
        this.canopyAngle = 0;
        this.controls = {
            turnHorizontal: 0,
            turnVertical: 0,
            rudder: 0,
            throttle: 0,
            slideHorizontal: 0,
            slideVertical: 0,
        }
        this.setControls = Object.assign( {} , this.controls );
            
    }
    
    loadMesh( component , filename ) {
        G.fbx.load( filename , result => {

            if( component === 'hull' ) {
                this.ent = result;
                result.name = 'Hull';
                result.position.set( 0,0,0 );
                G.scene.add( result );
                
                this.applyMaterial( result , G.materials.Drake );
                this.loadMesh( 'canopy', this.meshes.canopy );
            }
            else if( component === 'canopy' ) {
                this.canopy = result;
                result.position.set( 0, 13000, -3000 );
                result.rotation.set( 0 , 0 , 0 ); // - Math.PI/2
                this.ent.add( result );
                
                this.applyMaterial( result , G.materials.Drake );
                this.loadMesh( 'glass', this.meshes.glass );
            }
            else if( component === 'glass' ) {
                this.canopy.add( result );
                
                this.applyMaterial( result , G.materials.Glass );
                this.loadMesh( 'seat', this.meshes.cockpit.seat );
                this.loadMesh( 'seatBack', this.meshes.cockpit.seatBack );
                this.loadMesh( 'console', this.meshes.cockpit.console );
                this.loadMesh( 'hud', this.meshes.cockpit.hud );
                
                if( this.meshes.cockpit.floorConsole ) {
                    this.loadMesh( 'floorConsole', this.meshes.cockpit.floorConsole );
                    this.loadMesh( 'floorJoyStick', this.meshes.cockpit.floorJoyStick );
                }
                if( this.meshes.cockpit.lowerConsole ) {
                    this.loadMesh( 'lowerConsole', this.meshes.cockpit.lowerConsole );
                }
                if( this.meshes.cockpit.freeStick ) {
                    this.loadMesh( 'freeStick', this.meshes.cockpit.freeStick );
                    this.loadMesh( 'stickBase', this.meshes.cockpit.stickBase );
                }
                
                this.loadMesh( 'rudderLeft', this.meshes.cockpit.rudderLeft );
                this.loadMesh( 'rudderRight', this.meshes.cockpit.rudderRight );
                this.loadMesh( 'leftConsole' , this.meshes.cockpit.leftConsole );
                this.loadMesh( 'rightConsole' , this.meshes.cockpit.rightConsole );
                
                if( this.meshes.cockpit.thrustControl ) {
                    this.loadMesh( 'thrustControl', this.meshes.cockpit.thrustControl );
                    this.loadMesh( 'thrustControlBase' , this.meshes.cockpit.thrustControlBase );
                    this.loadMesh( 'thrustStick' , this.meshes.cockpit.thrustStick );
                    this.loadMesh( 'thrustStickBase' , this.meshes.cockpit.thrustStickBase );
                }
                if( this.meshes.cockpit.thrustLever ) {
                    this.loadMesh( 'thrustLever', this.meshes.cockpit.thrustLever );
                    this.loadMesh( 'thrustBase' , this.meshes.cockpit.thrustBase );
                    this.loadMesh( 'thrustHiStick' , this.meshes.cockpit.thrustHiStick );
                    this.loadMesh( 'thrustHiStickBase' , this.meshes.cockpit.thrustHiStickBase );
                }
                
            }
            else if( component === 'seat' ) {
                result.position.set( 0,4000,6000 );
                result.scale.set(100,100,100);
                this.ent.add( result );
                
                this.applyMaterial( result , G.materials.Cockpit );
            }
            else if( component === 'seatBack' ) {
                result.position.set( 0,7000,1000 );
                result.scale.set(100,100,100);
                this.ent.add( result );
                
                this.applyMaterial( result , G.materials.Cockpit );
            }
            else if( component === 'console' ) {
                result.position.set( 0,5000,22000 );
                result.scale.set(100,100,100);
                this.ent.add( result );
                
                this.applyMaterial( result , G.materials.Cockpit );
            }
            else if( component === 'hud' ) {
                result.position.set( -1800,6500,16000 );
                result.scale.set(100,100,100);
                this.ent.add( result );
                
                this.applyMaterial( result , G.materials.Cockpit );
            }
            else if( component === 'floorConsole' ) {
                result.position.set( 0,-4000,18500 );
                result.scale.set(100,100,100);
                this.ent.add( result );
                
                this.applyMaterial( result , G.materials.Cockpit );
            }
            else if( component === 'lowerConsole' ) {
                result.position.set( 0,-500,18500 );
                result.scale.set(100,100,100);
                this.ent.add( result );
                
                this.applyMaterial( result , G.materials.Cockpit );                
            }
            else if( component === 'floorJoyStick' ) {
                this.joystick = result;
                result.position.set( 0,-2250,16500 );
                result.scale.set(100,100,100);
                this.ent.add( result );
                
                this.applyMaterial( result , G.materials.Cockpit );
            }     
            else if( component === 'freeStick' ) {
                this.joystick = result;
                result.position.set( 0,-2250,16500 );
                result.scale.set(100,100,100);
                this.ent.add( result );
                
                this.applyMaterial( result , G.materials.Cockpit );
            }    
            else if( component === 'stickBase' ) {
                result.position.set( 0,-2000,20500 );
                result.scale.set(100,100,100);
                this.ent.add( result );
                
                this.applyMaterial( result , G.materials.Cockpit );
            }   
            else if( component === 'rudderRight' ) {
                this.rudderRight = result;
                result.position.set( -2750,-3500,18000 );
                result.scale.set(100,100,100);
                this.ent.add( result );
                
                this.applyMaterial( result , G.materials.Cockpit );                
            }
            else if( component === 'rudderLeft' ) {
                this.rudderLeft = result;
                result.position.set( 2750,-3500,18000 );
                result.scale.set(100,100,100);
                this.ent.add( result );
                
                this.applyMaterial( result , G.materials.Cockpit );                
            }
            else if( component === 'leftConsole' ) {
                result.position.set( 5000 , 5000 , 12000 );
                result.scale.set( 100,100,100 );
                this.ent.add( result );
                this.applyMaterial( result , G.materials.Cockpit );                
            }
            else if( component === 'rightConsole' ) {
                result.position.set( -5000 , 5000 , 12000 );
                result.scale.set( 100,100,100 );
                this.ent.add( result );
                this.applyMaterial( result , G.materials.Cockpit );                
            }
            else if( component === 'thrustControl' ) {
                this.throttle = result;
                this.thrustStartPosition = 13250;
                result.position.set( 4500 , 4000 , 13250 );
                result.scale.set( 100,100,100 );
                this.ent.add( result );
                this.applyMaterial( result , G.materials.Cockpit );                                
            }
            else if( component === 'thrustLever' ) {
                this.throttle = result;
                this.thrustStartPosition = 11000;
                result.position.set( 4500 , 5500 , this.thrustStartPosition );
                result.scale.set( 100,100,100 );
                this.ent.add( result );
                this.applyMaterial( result , G.materials.Cockpit );                                
            }
            else if( component === 'thrustBase' ) {
                result.position.set( 4500 , 5350 , 11500 );
                result.scale.set( 100,100,100 );
                this.ent.add( result );
                this.applyMaterial( result , G.materials.Cockpit );                                                
            }
            else if( component === 'thrustControlBase' ) {
                result.position.set( 4500 , 4250 , 13750 );
                result.scale.set( 100,100,100 );
                this.ent.add( result );
                this.applyMaterial( result , G.materials.Cockpit );                                                                
            }
            else if( component === 'thrustStick' ) {
                this.thrustStick = result;
                result.position.set( -4500 , 4500 , 13750 );
                result.scale.set( 100,100,100 );
                this.ent.add( result );
                this.applyMaterial( result , G.materials.Cockpit );                                                                                
            }
            else if( component === 'thrustStickBase' ) {
                result.position.set( -4500 , 4500 , 13750 );
                result.scale.set( 100,100,100 );
                this.ent.add( result );
                this.applyMaterial( result , G.materials.Cockpit );                                                                                                
            }
            else if( component === 'thrustHiStick' ) {
                this.thrustStick = result;
                result.position.set( -4500 , 5250 , 12000 );
                result.scale.set( 100,100,100 );
                this.ent.add( result );
                this.applyMaterial( result , G.materials.Cockpit );                                                                                
            }
            else if( component === 'thrustHiStickBase' ) {
                result.position.set( -4500 , 5250 , 12000 );
                result.scale.set( 100,100,100 );
                this.ent.add( result );
                this.applyMaterial( result , G.materials.Cockpit );                                                                                                
            }

        });
    }
    
    getShipMeshes() {
        if( this.shipType === 'Drake' ) {
            return {
                hull: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/DrakeClassFighter/DrakeClassFighterHull.fbx',
                canopy: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/DrakeClassFighter/DrakeClassFighterCanopyFrame.fbx',
                glass: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/DrakeClassFighter/DrakeClassFighterCanopy.fbx',
                //seat: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterExampleCockpit2Grouped.fbx',
                cockpit: {
                    seat: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitEjectionSeat2.fbx',
                    seatBack: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitBack3.fbx',
                    console: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitConsole1.fbx',
                    hud: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitHUD1.fbx',
                    
                    /* Centre Console 3 */
                    //floorConsole: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitMiddleConsole3.fbx',
                    //floorJoyStick: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystick1Large.fbx',
                    
                    /* Centre Console 1 */
                    //lowerConsole: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitMiddleConsole1.fbx',
                    //stickBase: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystickConsole.fbx',
                    //freeStick: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystick1Large.fbx',

                    /* Centre Console 2 */
                    //lowerConsole: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitMiddleConsole2.fbx',
                    //stickBase: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystickConsole.fbx',
                    //freeStick: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystick1Large.fbx',

                    stickBase: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystickConsole.fbx',
                    freeStick: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystick3Large.fbx',
                    
                    rudderLeft: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitPedalLeft.fbx',
                    rudderRight: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitPedalRight.fbx',

                    /* Side Console 1 */
                    leftConsole: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitSide1Left.fbx',
                    rightConsole: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitSide1Right.fbx',
                    thrustControl: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterThrusterControl3.fbx',
                    thrustControlBase: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterThrusterControlBase.fbx',
                    thrustStick: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystick2Small.fbx',
                    thrustStickBase: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystickBase.fbx',
                    //*/
                    
                    /* Side Console's 2+3 *
                    leftConsole: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitSide3Left.fbx',
                    rightConsole: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitSide3Right.fbx',                    
                    thrustLever: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterThrusterControl1.fbx',
                    thrustBase: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterThrusterControlBase.fbx',
                    thrustHiStick: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystick3Small.fbx',
                    thrustHiStickBase: '3d/DrakeClassFighterFBX+OBJ/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystickBase.fbx',
                    //*/
                },
            };
        }
    }
    applyMaterial( mother , material ) {
        mother.traverse( child => {
            if( child.isMesh ) {
                const uv = child.geometry.getAttribute( 'uv' );
                for( let i=0 ; i<uv.count ; i++ ) {
                    uv.array[ 1 + i * uv.itemSize ] = 1 - uv.array[ 1 + i * uv.itemSize ];
                }
                child.geometry.setAttribute( 'uv' , uv );
                child.material = material;
            }
        });
    }
    loadTexture( filename ) {
        let map = G.texture.load( filename );
        map.wrapS = map.wrapT = RepeatWrapping;
        return map;
    }
    
    getShipMaterials() {
        if( ! G.materials ) {
            G.materials = {};
        }
        if( ! G.materials.Glass ) {
            G.materials.Glass = new MeshStandardMaterial({
                envMap: G.environmentMap,
                roughness: 0,
                metalness: 0.7,
                transparent: true,
                depthWrite: true,
                depthTest: true,
                opacity: 0.2,
                side: DoubleSide,
            });            
        }
        if( ! G.materials.Cockpit ) {
            let map = this.loadTexture( '3d/DrakeClassFighterFBX+OBJ/Textures/ScifiFighterCockpit/ScifiFighterCockpitAlbedo.png' );
            let metRough = this.loadTexture( '3d/DrakeClassFighterFBX+OBJ/Textures/ScifiFighterCockpit/metRough.png' );
            let normal = this.loadTexture( '3d/DrakeClassFighterFBX+OBJ/Textures/ScifiFighterCockpit/ScifiFighterCockpitNormal.png' );
            let aoMap = this.loadTexture( '3d/DrakeClassFighterFBX+OBJ/Textures/ScifiFighterCockpit/ScifiFighterCockpitAO.png' );

            G.materials.Cockpit = new MeshStandardMaterial({
                map: map,
                aoMap: aoMap,
                envMap: G.environmentMap,
                roughnessMap: metRough,
                roughness: 1,
                metalnessMap: metRough,
                metalness: 1,
                normalMap: normal,
            });            
        }
        if( ! G.materials.Drake ) {
            
            let map = this.loadTexture( '3d/DrakeClassFighterFBX+OBJ/Textures/DrakeClassFighter/Albedo/DrakeClassFighterBlueAlbedo.png' );
            map.name = 'DrakeAlbedo';
            let metRough = this.loadTexture( '3d/DrakeClassFighterFBX+OBJ/Textures/DrakeClassFighter/DrakeMetRough.png' );
            let normal = this.loadTexture( '3d/DrakeClassFighterFBX+OBJ/Textures/DrakeClassFighter/DrakeClassFighterNormal.png' );
            let aoMap = this.loadTexture( '3d/DrakeClassFighterFBX+OBJ/Textures/DrakeClassFighter/DrakeClassFighterAO.png' );
            let emissiveMap = this.loadTexture( '3d/DrakeClassFighterFBX+OBJ/Textures/DrakeClassFighter/DrakeClassFighterIllumination.png' );
            
            G.materials.Drake = new MeshStandardMaterial({
                map: map,
                aoMap: aoMap,
                envMap: G.environmentMap,
                roughnessMap: metRough,
                roughness: 1,
                metalnessMap: metRough,
                metalness: 1,
                normalMap: normal,
                emissive: emissive, 
                emissiveMap: emissiveMap,
            });
        }
    }

    setCustomPaint(e) {
        
        let canvas = e.data.canvas;
        canvas.width = 4096;
        canvas.height = 4096;
        const context = canvas.getContext('2d');
        context.putImageData( e.data.texture , 0,0 );
        
        const texture = new CanvasTexture( canvas );
        texture.name = 'DrakeAlbedo';
        
        this.ent.traverse( child => {
            if( child.isMesh && child.material && child.material.map ) {
                if( child.material.map.name === 'DrakeAlbedo' ) {
                    child.material.map = texture;
                }
            }
        });

        console.log( e );
    }
    
    update() {
        
        if( this.canopy ) {
            if( this.canopyOpen === 1 ) {
                this.canopyAngle -= G.delta;
                if( this.canopyAngle < -Math.PI/2 ) {
                    this.canopyAngle = -Math.PI/2;
                }
            }
            else {
                this.canopyAngle += G.delta;
                if( this.canopyAngle > 0 ) {
                    this.canopyAngle = 0;
                }
            }
            this.canopy.rotation.set( this.canopyAngle , 0 , 0 );
        }
        
        if( this.joystick ) {
            if( this.setControls.turnHorizontal > this.controls.turnHorizontal ) {
                this.setControls.turnHorizontal -= G.delta * 3;
                if( this.setControls.turnHorizontal < this.controls.turnHorizontal ) {
                    this.setControls.turnHorizontal = this.controls.turnHorizontal;
                }
            }
            else {
                this.setControls.turnHorizontal += G.delta * 3;
                if( this.setControls.turnHorizontal > this.controls.turnHorizontal ) {
                    this.setControls.turnHorizontal = this.controls.turnHorizontal;
                }                
            }
                
            if( this.setControls.turnVertical > this.controls.turnVertical ) {
                this.setControls.turnVertical -= G.delta * 3;
                if( this.setControls.turnVertical < this.controls.turnVertical ) {
                    this.setControls.turnVertical = this.controls.turnVertical;
                }
            }
            else {
                this.setControls.turnVertical += G.delta * 3;
                if( this.setControls.turnVertical > this.controls.turnVertical ) {
                    this.setControls.turnVertical = this.controls.turnVertical;
                }                
            }

            this.joystick.rotation.set( this.setControls.turnVertical*0.3 , 0 , this.setControls.turnHorizontal*0.3 );
        }
        
        if( this.thrustStick ) {
            if( this.setControls.slideHorizontal > this.controls.slideHorizontal ) {
                this.setControls.slideHorizontal -= G.delta * 3;
                if( this.setControls.slideHorizontal < this.controls.slideHorizontal ) {
                    this.setControls.slideHorizontal = this.controls.slideHorizontal;
                }
            }
            else {
                this.setControls.slideHorizontal += G.delta * 3;
                if( this.setControls.slideHorizontal > this.controls.slideHorizontal ) {
                    this.setControls.slideHorizontal = this.controls.slideHorizontal;
                }                
            }
                
            if( this.setControls.slideVertical > this.controls.slideVertical ) {
                this.setControls.slideVertical -= G.delta * 3;
                if( this.setControls.slideVertical < this.controls.slideVertical ) {
                    this.setControls.slideVertical = this.controls.slideVertical;
                }
            }
            else {
                this.setControls.slideVertical += G.delta * 3;
                if( this.setControls.slideVertical > this.controls.slideVertical ) {
                    this.setControls.slideVertical = this.controls.slideVertical;
                }                
            }

            this.thrustStick.rotation.set( this.setControls.slideVertical*0.3 , 0 , this.setControls.slideHorizontal*0.3 );
        }
                
        if( this.rudderRight || this.rudderLeft ) {
            if( this.setControls.rudder > this.controls.rudder ) {
                this.setControls.rudder -= G.delta * 1.5;
                if( this.setControls.rudder < this.controls.rudder ) {
                    this.setControls.rudder = this.controls.rudder;
                }
            }
            else {
                this.setControls.rudder += G.delta * 1.5;
                if( this.setControls.rudder > this.controls.rudder ) {
                    this.setControls.rudder = this.controls.rudder;
                }                
            }     
            
            if( this.rudderRight ) {
                const rudderPos = this.setControls.rudder > 0 ? this.setControls.rudder * 1000 : 0;
                this.rudderRight.position.y = -3500 - rudderPos;
            }
            if( this.rudderLeft ) {
                const rudderPos = this.setControls.rudder < 0 ? Math.abs( this.setControls.rudder ) * 1000 : 0;
                this.rudderLeft.position.y = -3500 - rudderPos;                
            }
        }
        
        if( this.throttle ) {
            if( this.setControls.throttle > this.controls.throttle ) {
                this.setControls.throttle -= G.delta * 3;
                if( this.setControls.throttle < this.controls.throttle ) {
                    this.setControls.throttle = this.controls.throttle;
                }
            }
            else {
                this.setControls.throttle += G.delta * 3;
                if( this.setControls.throttle > this.controls.throttle ) {
                    this.setControls.throttle = this.controls.throttle;
                }                
            }  
            this.throttle.position.z = this.thrustStartPosition + this.setControls.throttle * 1000;
        }
        
    }
    
}