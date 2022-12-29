import { G } from './../G.js';
import {
    MeshStandardMaterial,
    RepeatWrapping,
    Vector2,
    Vector3,
    Color,
    DoubleSide,
    CanvasTexture,
} from 'three';

const emissive = new Color(1,1,1);

export class Ship {
    
    constructor( shipType ) {
        
        this.update = this.update.bind( this );
        
        this.setType( shipType );
        this.momentum = new Vector3();
        
    }
    
    destroy() {
        this.joystick = false;
        this.canopy = false;
        this.thrustStick = false;
        this.rudderRight = false;
        this.rudderLeft = false;
        this.throttle = false;
        G.scene.remove( this.ent );
        this.ent = false;
    }
    setType( shipType ) {
        this.shipType = shipType;
        this.meshes = this.getShipMeshes();
        this.getShipMaterials();
        this.loadMesh( 'hull' , this.meshes.hull , this.meshes.hullScale );

        this.canopyOpen = 0;
        this.canopyAngle = 0;
        this.controls = {
            turnHorizontal: 0,
            turnVertical: 0,
            rudder: 0,
            throttle: 0,
            slideHorizontal: 0,
            slideVertical: 0,
            weaponDoors: 0,
        }
        this.setControls = Object.assign( {} , this.controls );
    }
    
    loadMesh( component , filename , scale ) {
        G.fbx.load( filename , result => {

            if( scale ) {
                result.scale.set( scale , scale , scale );
            }

            if( component === 'hull' ) {
                this.ent = result;
                result.name = 'Hull';
                result.position.set( 0,0,0 );
                G.scene.add( result );
                
                this.applyMaterial( result , G.materials[this.shipType] );
                this.findFixedPoints( scale );

                if( this.meshes.canopy ) {
                    this.loadMesh( 'canopy', this.meshes.canopy );
                }
                if( this.meshes.missileDoorLeft ) {
                    this.loadMesh( 'missileDoorLeft', this.meshes.missileDoorLeft , scale );
                    this.loadMesh( 'missileDoorRight', this.meshes.missileDoorRight , scale );
                }
            }
            else if( component === 'missileDoorLeft' ) {
                result.scale.set(1,1,1);
                this.missileDoorLeft = result;
                this.missileDoorLeft.position.set(
                    0.6550,
                    0.447,
                    0.6250,
                );
                this.applyMaterial( this.missileDoorLeft , G.materials.Longbow );
                this.ent.add( this.missileDoorLeft );
                console.log( this.missileDoorLeft , scale );
            }
            else if( component === 'missileDoorRight' ) {
                result.scale.set(1,1,1);
                this.missileDoorRight = result;
                this.missileDoorRight.position.set(
                    - 0.6550,
                    0.447,
                    0.6250,
                );
                this.applyMaterial( this.missileDoorRight , G.materials.Longbow );
                this.ent.add( this.missileDoorRight );
            }            
            else if( component === 'missileDoorRight' ) {
                
            }
            else if( component === 'canopy' ) {
                this.canopy = result;
                result.position.set( 0, 13000, -3300 );
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
    
    findFixedPoints( scale ) {
        this.ent.traverse( child => {
            if( child.isBone ) {
                if( child.name.indexOf( 'MissileRack' ) > -1 ) {
                    this.addFixedPointWeapon( '3d/ships/MeshesFBX/ScifiFighterWeapons/ScifiFighterMissileLauncher.fbx' , child , scale );
                    
                    const newChild = child.clone();
                    newChild.position.set( - child.position.x , child.position.y , child.position.z );
                    newChild.rotation.set( child.rotation.x , child.rotation.y , - child.rotation.z );
                    child.parent.add( newChild );
                    this.addFixedPointWeapon( '3d/ships/MeshesFBX/ScifiFighterWeapons/ScifiFighterMissileLauncher.fbx' , newChild , scale );
                }
                if( child.name.indexOf( 'FixedPoint' ) > -1 ) {
                    this.addFixedPointWeapon( '3d/ships/MeshesFBX/ScifiFighterModularWeapons/ScifiFighterBarrel1.fbx' , child , scale );

                    const newChild = child.clone();
                    newChild.position.set( - child.position.x , child.position.y , child.position.z );
                    newChild.rotation.set( child.rotation.x , child.rotation.y , - child.rotation.z );
                    child.parent.add( newChild );
                    this.addFixedPointWeapon( '3d/ships/MeshesFBX/ScifiFighterModularWeapons/ScifiFighterBarrel1.fbx' , newChild , scale );
                }
                if( child.name.indexOf( 'DorsalPoint' ) > -1 ) {
                    this.addFixedPointWeapon( '3d/ships/MeshesFBX/ScifiFighterModularWeapons/ScifiFighterBarrel1.fbx' , child , scale );
                }
                if( child.name.indexOf( 'TorpedoMount' ) > -1 ) {
                    this.addFixedPointWeapon( '3d/ships/MeshesFBX/ScifiFighterWeapons/ScifiFighterTorpedo.fbx' , child , scale );

                    const newChild = child.clone();
                    newChild.position.set( - child.position.x , child.position.y , child.position.z );
                    newChild.rotation.set( child.rotation.x , child.rotation.y , - child.rotation.z );
                    child.parent.add( newChild );
                    this.addFixedPointWeapon( '3d/ships/MeshesFBX/ScifiFighterWeapons/ScifiFighterTorpedo.fbx' , newChild , scale );
                }
            }
        });
    }
    addFixedPointWeapon( filename ,  mount , scale ) {
        G.fbx.load( filename , result => {
            
            result.traverse( child => {
                if( child.isBone ) {
                    if( child.name.indexOf( 'MissileMount' ) > -1 ) {
                        console.log( 'adding missile' );
                        this.addFixedPointWeapon( '3d/ships/MeshesFBX/ScifiFighterWeapons/ScifiFighterMissile.fbx' , child , scale );
                    }
                }
            });
            
            result.scale.set( 50000/scale , 50000/scale , 50000/scale );
            console.log( 'adding weapon' , result );
            this.applyMaterial( result , G.materials.FighterWeapons );
            mount.add( result );
        });
    }
    
    getShipMeshes() {
        if( this.shipType === 'Starkiller' ) {
            return {
              hull: '3d/ships/MeshesFBX/StarkillerClassFighter/ScifiFighterStarkillerHull.fbx',
              hullScale: 50000,                
            };
        }
        else if( this.shipType === 'Starhammer' ) {
            return {
              hull: '3d/ships/MeshesFBX/StarhammerClassFighter/ScifiFighterStarhammerHull.fbx',
              hullScale: 50000,                
            };
        }
        else if( this.shipType === 'Starfury' ) {
            return {
              hull: '3d/ships/MeshesFBX/StarfuryClassFighter/ScifiFighterStarfuryHull.fbx',
              hullScale: 50000,
            };
        }
        else if( this.shipType === 'Piranha' ) {
            return {
              hull: '3d/ships/MeshesFBX/PiranhaClassFighter/ScifiFighterPiranhaHull.fbx',
              hullScale: 50000,
            };
        }
        else if( this.shipType === 'Panther' ) {
            return {
              hull: '3d/ships/MeshesFBX/PantherClassFighter/ScifiFighterPantherHull.fbx',
              hullScale: 50000,
            };
        }
        else if( this.shipType === 'Longbow' ) {
            return {
              hull: '3d/ships/MeshesFBX/LongbowClassFighter/ScifiFighterLongbowHull.fbx',
              hullScale: 50000,
              missileDoorLeft: '3d/ships/MeshesFBX/LongbowClassFighter/ScifiFighterLongbowMissileDoorLeft.fbx',
              missileDoorRight: '3d/ships/MeshesFBX/LongbowClassFighter/ScifiFighterLongbowMissileDoorRight.fbx',
            };
        }
        else if( this.shipType === 'Hellcat' ) {
            return {
              hull: '3d/ships/MeshesFBX/HellcatClassFighter/ScifiFighterHellcatHull.fbx',
              hullScale: 50000,
            };
        }
        else if( this.shipType === 'Excalibur' ) {
            return {
              hull: '3d/ships/MeshesFBX/ExcaliburClassFighter/ScifiFighterExcaliburHull.fbx',
              hullScale: 50000,
            };
        }
        else if( this.shipType === 'Devastator' ) {
            return {
              hull: '3d/ships/MeshesFBX/DevastatorClassFighter/ScifiFighterDevastatorHull.fbx',
              hullScale: 50000,
            };
        }
        else if( this.shipType === 'Arrow' ) {
            return {
              hull: '3d/ships/MeshesFBX/ArrowClassFighter/ScifiFighterArrowHull.fbx',
              hullScale: 50000,
            };
        }
        else if( this.shipType === 'Paladin' ) {
            return {
                hull: '3d/ships/MeshesFBX/PaladinClassFrigate/PaladinClassFrigateHull.fbx',
                hullScale: 20,
            }
        }
        else if( this.shipType === 'Hellion' ) {
            return {
                hull: '3d/ships/MeshesFBX/HellionClassFrigate/HellionClassFrigateHull.fbx',
                hullScale: 20,
            }
        }
        else if( this.shipType === 'Drake' ) {
            return {
                hull: '3d/ships/MeshesFBX/DrakeClassFighter/DrakeClassFighterHull.fbx',
                fixedPoints: true,
                hullScale: 1,
                canopy: '3d/ships/MeshesFBX/DrakeClassFighter/DrakeClassFighterCanopyFrame.fbx',
                glass: '3d/ships/MeshesFBX/DrakeClassFighter/DrakeClassFighterCanopy.fbx',
                //seat: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterExampleCockpit2Grouped.fbx',
                cockpit: {
                    seat: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitEjectionSeat2.fbx',
                    seatBack: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitBack3.fbx',
                    console: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitConsole1.fbx',
                    hud: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitHUD1.fbx',
                    
                    /* Centre Console 3 */
                    //floorConsole: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitMiddleConsole3.fbx',
                    //floorJoyStick: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystick1Large.fbx',
                    
                    /* Centre Console 1 */
                    //lowerConsole: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitMiddleConsole1.fbx',
                    //stickBase: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystickConsole.fbx',
                    //freeStick: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystick1Large.fbx',

                    /* Centre Console 2 */
                    //lowerConsole: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitMiddleConsole2.fbx',
                    //stickBase: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystickConsole.fbx',
                    //freeStick: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystick1Large.fbx',

                    stickBase: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystickConsole.fbx',
                    freeStick: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystick3Large.fbx',
                    
                    rudderLeft: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitPedalLeft.fbx',
                    rudderRight: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitPedalRight.fbx',

                    /* Side Console 1 */
                    leftConsole: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitSide1Left.fbx',
                    rightConsole: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitSide1Right.fbx',
                    thrustControl: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterThrusterControl3.fbx',
                    thrustControlBase: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterThrusterControlBase.fbx',
                    thrustStick: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystick2Small.fbx',
                    thrustStickBase: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystickBase.fbx',
                    //*/
                    
                    /* Side Console's 2+3 *
                    leftConsole: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitSide3Left.fbx',
                    rightConsole: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitSide3Right.fbx',                    
                    thrustLever: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterThrusterControl1.fbx',
                    thrustBase: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterThrusterControlBase.fbx',
                    thrustHiStick: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystick3Small.fbx',
                    thrustHiStickBase: '3d/ships/MeshesFBX/ScifiFighterCockpit/ScifiFighterCockpitJoystickBase.fbx',
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
                child.material.dispose();
                child.material = material;
                
                if( ! child.material.transparent ) {
                    child.castShadow = true;
                    child.receiveShadow = true;                    
                }
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
        if( ! G.materials.FighterWeapons ) {
            let map = this.loadTexture( '3d/ships/Textures/ScifiFighterModularWeapons/ScifiFighterModularWeaponsAlbedo.png' );
            let metRough = this.loadTexture( '3d/ships/Textures/ScifiFighterModularWeapons/MetRough.png' );
            let normal = this.loadTexture( '3d/ships/Textures/ScifiFighterModularWeapons/ScifiFighterModularWeaponsNormal.png' );
            let aoMap = this.loadTexture( '3d/ships/Textures/ScifiFighterModularWeapons/ScifiFighterModularWeaponsAlbedoAO.png' );
            let emissiveMap = this.loadTexture( '3d/ships/Textures/ScifiFighterModularWeapons/ScifiFighterModularWeaponsIllumination.png' );
            
            G.materials.FighterWeapons = new MeshStandardMaterial({
                name: 'Weapons',
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

        if( ! G.materials.Starkiller && this.shipType === 'Starkiller' ) {
            let map = this.loadTexture( '3d/ships/Textures/StarkillerClassFighter/Albedo/ScifiFighterStarkillerBlueAlbedo.png' );
            map.name = 'StarkillerAlbedo';
            let metRough = this.loadTexture( '3d/ships/Textures/StarkillerClassFighter/MetRough.png' );
            let normal = this.loadTexture( '3d/ships/Textures/StarkillerClassFighter/ScifiFighterStarkillerNormal.png' );
            let aoMap = this.loadTexture( '3d/ships/Textures/StarkillerClassFighter/ScifiFighterStarkillerAO.png' );
            let emissiveMap = this.loadTexture( '3d/ships/Textures/StarkillerClassFighter/ScifiFighterStarkillerIllumination.png' );
            
            G.materials.Starkiller = new MeshStandardMaterial({
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
        if( ! G.materials.Starhammer && this.shipType === 'Starhammer' ) {
            let map = this.loadTexture( '3d/ships/Textures/StarhammerClassFighter/Albedo/ScifiFighterStarhammerBlueAlbedo.png' );
            map.name = 'StarhammerAlbedo';
            let metRough = this.loadTexture( '3d/ships/Textures/StarhammerClassFighter/MetRough.png' );
            let normal = this.loadTexture( '3d/ships/Textures/StarhammerClassFighter/ScifiFighterStarhammerNormal.png' );
            let aoMap = this.loadTexture( '3d/ships/Textures/StarhammerClassFighter/ScifiFighterStarhammerAO.png' );
            let emissiveMap = this.loadTexture( '3d/ships/Textures/StarhammerClassFighter/ScifiFighterStarhammerIllumination.png' );
            
            G.materials.Starhammer = new MeshStandardMaterial({
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
        if( ! G.materials.Starfury && this.shipType === 'Starfury' ) {
            let map = this.loadTexture( '3d/ships/Textures/StarfuryClassFighter/Albedo/ScifiFighterStarfuryBlueAlbedo.png' );
            map.name = 'StarfuryAlbedo';
            let metRough = this.loadTexture( '3d/ships/Textures/StarfuryClassFighter/MetRough.png' );
            let normal = this.loadTexture( '3d/ships/Textures/StarfuryClassFighter/ScifiFighterStarfuryNormal.png' );
            let aoMap = this.loadTexture( '3d/ships/Textures/StarfuryClassFighter/ScifiFighterStarfuryAO.png' );
            let emissiveMap = this.loadTexture( '3d/ships/Textures/StarfuryClassFighter/ScifiFighterStarfuryIllumination.png' );
            
            G.materials.Starfury = new MeshStandardMaterial({
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
        if( ! G.materials.Piranha && this.shipType === 'Piranha' ) {
            let map = this.loadTexture( '3d/ships/Textures/PiranhaClassFighter/Albedo/ScifiFighterPiranhaBlueAlbedo.png' );
            map.name = 'PiranhaAlbedo';
            let metRough = this.loadTexture( '3d/ships/Textures/PiranhaClassFighter/MetRough.png' );
            let normal = this.loadTexture( '3d/ships/Textures/PiranhaClassFighter/ScifiFighterPiranhaNormal.png' );
            let aoMap = this.loadTexture( '3d/ships/Textures/PiranhaClassFighter/ScifiFighterPiranhaAO.png' );
            let emissiveMap = this.loadTexture( '3d/ships/Textures/PiranhaClassFighter/ScifiFighterPiranhaIllumination.png' );
            
            G.materials.Piranha = new MeshStandardMaterial({
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
        if( ! G.materials.Panther && this.shipType === 'Panther' ) {
            let map = this.loadTexture( '3d/ships/Textures/PantherClassFighter/Albedo/ScifiFighterPantherBlueAlbedo.png' );
            map.name = 'PantherAlbedo';
            let metRough = this.loadTexture( '3d/ships/Textures/PantherClassFighter/MetRough.png' );
            let normal = this.loadTexture( '3d/ships/Textures/PantherClassFighter/ScifiFighterPantherNormal.png' );
            let aoMap = this.loadTexture( '3d/ships/Textures/PantherClassFighter/ScifiFighterPantherAO.png' );
            let emissiveMap = this.loadTexture( '3d/ships/Textures/PantherClassFighter/ScifiFighterPantherIllumination.png' );
            
            G.materials.Panther = new MeshStandardMaterial({
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
        if( ! G.materials.Longbow && this.shipType === 'Longbow' ) {
            let map = this.loadTexture( '3d/ships/Textures/LongbowClassFighter/Albedo/ScifiFighterLongbowBlueAlbedo.png' );
            map.name = 'LongbowAlbedo';
            let metRough = this.loadTexture( '3d/ships/Textures/LongbowClassFighter/MetRough.png' );
            let normal = this.loadTexture( '3d/ships/Textures/LongbowClassFighter/ScifiFighterLongbowNormal.png' );
            let aoMap = this.loadTexture( '3d/ships/Textures/LongbowClassFighter/ScifiFighterLongbowAO.png' );
            let emissiveMap = this.loadTexture( '3d/ships/Textures/LongbowClassFighter/ScifiFighterLongbowIllumination.png' );
            
            G.materials.Longbow = new MeshStandardMaterial({
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

        if( ! G.materials.Hellcat && this.shipType === 'Hellcat' ) {
            let map = this.loadTexture( '3d/ships/Textures/HellcatClassFighter/Albedo/ScifiFighterHellcatBlueAlbedo.png' );
            map.name = 'HellcatAlbedo';
            let metRough = this.loadTexture( '3d/ships/Textures/HellcatClassFighter/MetRough.png' );
            let normal = this.loadTexture( '3d/ships/Textures/HellcatClassFighter/ScifiFighterHellcatNormal.png' );
            let aoMap = this.loadTexture( '3d/ships/Textures/HellcatClassFighter/ScifiFighterHellcatAO.png' );
            let emissiveMap = this.loadTexture( '3d/ships/Textures/HellcatClassFighter/ScifiFighterHellcatIllumination.png' );
            
            G.materials.Hellcat = new MeshStandardMaterial({
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
        if( ! G.materials.Excalibur && this.shipType === 'Excalibur' ) {
            
            let map = this.loadTexture( '3d/ships/Textures/ExcaliburClassFighter/Albedo/ScifiFighterExcaliburBlueAlbedo.png' );
            map.name = 'ExcaliburAlbedo';
            let metRough = this.loadTexture( '3d/ships/Textures/ExcaliburClassFighter/MetRough.png' );
            let normal = this.loadTexture( '3d/ships/Textures/ExcaliburClassFighter/ScifiFighterExcaliburNormal.png' );
            let aoMap = this.loadTexture( '3d/ships/Textures/ExcaliburClassFighter/ScifiFighterExcaliburAO.png' );
            let emissiveMap = this.loadTexture( '3d/ships/Textures/ExcaliburClassFighter/ScifiFighterExcaliburIllumination.png' );
            
            G.materials.Excalibur = new MeshStandardMaterial({
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
        if( ! G.materials.Devastator && this.shipType === 'Devastator' ) {
            
            let map = this.loadTexture( '3d/ships/Textures/DevastatorClassFighter/Albedo/ScifiFighterDevastatorBlueAlbedo.png' );
            map.name = 'DevastatorAlbedo';
            let metRough = this.loadTexture( '3d/ships/Textures/DevastatorClassFighter/MetRough.png' );
            let normal = this.loadTexture( '3d/ships/Textures/DevastatorClassFighter/ScifiFighterDevastatorNormal.png' );
            let aoMap = this.loadTexture( '3d/ships/Textures/DevastatorClassFighter/ScifiFighterDevastatorAO.png' );
            let emissiveMap = this.loadTexture( '3d/ships/Textures/DevastatorClassFighter/ScifiFighterDevastatorIllumination.png' );
            
            G.materials.Devastator = new MeshStandardMaterial({
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
        if( ! G.materials.Arrow && this.shipType === 'Arrow' ) {
            let map = this.loadTexture( '3d/ships/Textures/PaladinClassFrigate/Albedo/ScifiFighterArrowBlueAlbedo.png' );
            map.name = 'ArrowAlbedo';
            let metRough = this.loadTexture( '3d/ships/Textures/ArrowClassFighter/MetRough.png' );
            let normal = this.loadTexture( '3d/ships/Textures/ArrowClassFighter/ScifiFighterArrowNormal.png' );
            let aoMap = this.loadTexture( '3d/ships/Textures/ArrowClassFighter/ScifiFighterArrowAO.png' );
            let emissiveMap = this.loadTexture( '3d/ships/Textures/ArrowClassFighter/ScifiFighterArrowIllumination.png' );
            
            G.materials.Arrow = new MeshStandardMaterial({
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
        if( ! G.materials.Cockpit ) {
            let map = this.loadTexture( '3d/ships/Textures/ScifiFighterCockpit/ScifiFighterCockpitAlbedo.png' );
            map.name = 'CockpitAlbedo';
            let metRough = this.loadTexture( '3d/ships/Textures/ScifiFighterCockpit/metRough.png' );
            let normal = this.loadTexture( '3d/ships/Textures/ScifiFighterCockpit/ScifiFighterCockpitNormal.png' );
            let aoMap = this.loadTexture( '3d/ships/Textures/ScifiFighterCockpit/ScifiFighterCockpitAO.png' );

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
        if( ! G.materials.Paladin && this.shipType === 'Paladin' ) {
            let map = this.loadTexture( '3d/ships/Textures/PaladinClassFrigate/Albedo/PaladinClassFrigateBlueAlbedo.png' );
            map.name = 'PaladinAlbedo';
            let metRough = this.loadTexture( '3d/ships/Textures/PaladinClassFrigate/MetRough.png' );
            let normal = this.loadTexture( '3d/ships/Textures/PaladinClassFrigate/PaladinClassFrigateNormal.png' );
            let aoMap = this.loadTexture( '3d/ships/Textures/PaladinClassFrigate/PaladinClassFrigateAO.png' );
            let emissiveMap = this.loadTexture( '3d/ships/Textures/PaladinClassFrigate/PaladinClassFrigateIllumination.png' );
            
            G.materials.Paladin = new MeshStandardMaterial({
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
        if( ! G.materials.Hellion && this.shipType === 'Hellion' ) {
            let map = this.loadTexture( '3d/ships/Textures/HellionClassFrigate/Albedo/HellionClassFrigateBlueAlbedo.png' );
            map.name = 'HellionAlbedo';
            let metRough = this.loadTexture( '3d/ships/Textures/HellionClassFrigate/MetRough.png' );
            let normal = this.loadTexture( '3d/ships/Textures/HellionClassFrigate/HellionClassFrigateNormal.png' );
            let aoMap = this.loadTexture( '3d/ships/Textures/HellionClassFrigate/HellionClassFrigateAO.png' );
            let emissiveMap = this.loadTexture( '3d/ships/Textures/HellionClassFrigate/HellionClassFrigateIllumination.png' );
            
            G.materials.Hellion = new MeshStandardMaterial({
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
        if( ! G.materials.Drake && this.shipType === 'Drake' ) {
            
            let map = this.loadTexture( '3d/ships/Textures/DrakeClassFighter/Albedo/DrakeClassFighterBlueAlbedo.png' );
            map.name = 'DrakeAlbedo';
            let metRough = this.loadTexture( '3d/ships/Textures/DrakeClassFighter/DrakeMetRough.png' );
            let normal = this.loadTexture( '3d/ships/Textures/DrakeClassFighter/DrakeClassFighterNormal.png' );
            let aoMap = this.loadTexture( '3d/ships/Textures/DrakeClassFighter/DrakeClassFighterAO.png' );
            let emissiveMap = this.loadTexture( '3d/ships/Textures/DrakeClassFighter/DrakeClassFighterIllumination.png' );
            
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
        canvas.width = e.data.texture.width;
        canvas.height = e.data.texture.height;
        const context = canvas.getContext('2d', {
            desynchronized: true,
        });
        context.putImageData( e.data.texture , 0,0 );
        
        const texture = new CanvasTexture( canvas );
        texture.name = e.data.name;
        
        this.ent.traverse( child => {
            if( child.isMesh && child.material && child.material.map ) {
                if( child.material.map.name === e.data.name ) {
                    child.material.map = texture;
                }
            }
        });

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
        if( this.missileDoorLeft || this.missileDoorRight ) {
            if( this.controls.weaponDoors === 1 ) {
                this.setControls.weaponDoors -= G.delta * 0.25;
                if( this.setControls.weaponDoors < -1 ) {
                    this.setControls.weaponDoors = -1;
                }
            }
            else {
                this.setControls.weaponDoors += G.delta * 0.25;
                if( this.setControls.weaponDoors > 0 ) {
                    this.setControls.weaponDoors = 0;
                }
            }
            
            if( this.missileDoorLeft ) {
                this.missileDoorLeft.rotation.set( this.setControls.weaponDoors * Math.PI/2 , 0 , 0 );
            }
            if( this.missileDoorRight ) {
                this.missileDoorRight.rotation.set( this.setControls.weaponDoors * Math.PI/2 , 0 , 0 );
            }
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

        if( this.ent ) {
            
            const start = this.ent.position.clone();
            
            this.ent.translateZ(1);
            let effect = new Vector3(
                this.ent.position.x - start.x,
                this.ent.position.y - start.y,
                this.ent.position.z - start.z
            );
            this.ent.position.copy( start.clone() );
            
            this.momentum.set(
                this.momentum.x + ( this.setControls.throttle * G.delta * 100000 * effect.x ),
                this.momentum.y + ( this.setControls.throttle * G.delta * 100000 * effect.y ),
                this.momentum.z + ( this.setControls.throttle * G.delta * 100000 * effect.z ),
            );
            
            this.ent.translateX(1);
            effect = new Vector3(
                this.ent.position.x - start.x,
                this.ent.position.y - start.y,
                this.ent.position.z - start.z
            );
            this.ent.position.copy( start.clone() );            
            this.momentum.set(
                this.momentum.x + ( - this.setControls.slideHorizontal * G.delta * 10000 * effect.x ),
                this.momentum.y + ( - this.setControls.slideHorizontal * G.delta * 10000 * effect.y ),
                this.momentum.z + ( - this.setControls.slideHorizontal * G.delta * 10000 * effect.z ),
            );

            this.ent.translateY(1);
            effect = new Vector3(
                this.ent.position.x - start.x,
                this.ent.position.y - start.y,
                this.ent.position.z - start.z
            );
            this.ent.position.copy( start.clone() );            
            this.momentum.set(
                this.momentum.x + ( this.setControls.slideVertical * G.delta * 10000 * effect.x ),
                this.momentum.y + ( this.setControls.slideVertical * G.delta * 10000 * effect.y ),
                this.momentum.z + ( this.setControls.slideVertical * G.delta * 10000 * effect.z ),
            );
            
            for( let i=1 ; i<G.delta*100 ; i++ ) {
                this.momentum.set(
                    this.momentum.x * 0.995,
                    this.momentum.y * 0.995,
                    this.momentum.z * 0.995
                );
            }
            
            this.ent.rotateX( this.setControls.turnVertical * G.delta );
            this.ent.rotateY( - this.setControls.rudder * G.delta );
            this.ent.rotateZ( this.setControls.turnHorizontal * G.delta );
            this.ent.position.x += this.momentum.x * G.delta;
            this.ent.position.y += this.momentum.y * G.delta;
            this.ent.position.z += this.momentum.z * G.delta;
            
        }
        
    }
    
}