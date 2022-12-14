import { buildSceneGraph } from './src/main/editor/buildSceneGraph.js';

const canvas = document.createElement( 'canvas' );
canvas.classList.add( 'threeD' );
document.body.appendChild( canvas );

const offscreenCanvas = canvas.transferControlToOffscreen();

const sendCanvas = () => {
    const newCanvas = document.createElement( 'canvas' );
    const newOffscreen = newCanvas.transferControlToOffscreen();
    threeD.postMessage({
        type: 'canvas',
        canvas: newOffscreen,
    }, [ newOffscreen ]);
}
const getImageData = async ( filename ) => {
    
    const loadImage = new Promise( (resolve,reject) => {
        let image = new Image();
        image.onload = () => {
            
            const imageCanvas = document.createElement( 'canvas' );
            imageCanvas.width = image.width;
            imageCanvas.height = image.height;
            const imageContext = imageCanvas.getContext( '2d' , {
                desynchronized: true,                
            });
            imageContext.drawImage( image , 0 , 0 );
            const pixels = imageContext.getImageData( 0,0,image.width,image.height );
            resolve( pixels );
            
        }
        image.src = filename;
    });
    
    return loadImage;
    
}
const getShipTextureParams = async ( custom ) => {
    return new Promise( async (resolve,reject) => {

        let params = {};

        if( custom.ShipClass === 'Archangel' ) {
            //const squadronMask = await getImageData( '3d/ships/Textures/ScifiBattleshipArchangel/SquadronMask.png' );
            
            params = {
                underlay: await getImageData( `3d/ships/Textures/ScifiBattleshipArchangel/Albedo/ScifiBattleshipArchangel${custom.Underlay}Albedo.png` ),
                mask: await getImageData( '3d/ships/Textures/ScifiBattleshipArchangel/Colour.png' ),
                base: await getImageData( '3d/ships/Textures/ScifiBattleshipArchangel/ScifiBattleshipArchangelGloss.png' ),
                overlay: await getImageData( '3d/ships/Textures/ScifiBattleshipArchangel/Overlay.png' ),
                maskPalette: [
                    {r:86,g:86,b:86},
                    {r:47,g:40,b:40},
                    {r:103,g:103,b:103},
                    {r:255,g:255,b:255},
                    {r:59,g:108,b:154},
                    {r:94,g:132,b:179},
                ],
                markings: [
                    //{ type: 'roundel', x: 1846, y: 876, size: 36 },
                    //{ type: 'roundel', x: 711, y: 1543, size: 30 },
                    //{ type: 'squadronArt', x: 48, y: 638, size: 68, mask: squadronMask },
                ], 
            };
        } 
        else if( custom.ShipClass === 'Tigershark' ) {
            const squadronMask = await getImageData( '3d/ships/Textures/TigersharkClassFighter/SquadronMask.png' );
            
            params = {
                underlay: await getImageData( `3d/ships/Textures/TigersharkClassFighter/Albedo/ScifiFighterTigershark${custom.Underlay}Albedo.png` ),
                mask: await getImageData( '3d/ships/Textures/TigersharkClassFighter/Colour.png' ),
                base: await getImageData( '3d/ships/Textures/TigersharkClassFighter/ScifiFighterTigersharkGloss.png' ),
                overlay: await getImageData( '3d/ships/Textures/TigersharkClassFighter/Overlay.png' ),
                maskPalette: [
                    {r:86,g:86,b:86},
                    {r:47,g:40,b:40},
                    {r:125,g:125,b:125},
                    {r:160,g:160,b:160},
                    {r:94,g:132,b:179},
                    {r:204,g:97,b:0},
                ],
                markings: [
                    { type: 'roundel', x: 1846, y: 876, size: 36 },
                    { type: 'roundel', x: 711, y: 1543, size: 30 },
                    { type: 'squadronArt', x: 48, y: 638, size: 68, mask: squadronMask },
                ], 
            };
        } 
        else if( custom.ShipClass === 'Thunderbolt' ) {
            const squadronMask = await getImageData( '3d/ships/Textures/ThunderboltClassFighter/SquadronMark.png' );
            
            params = {
                underlay: await getImageData( `3d/ships/Textures/ThunderboltClassFighter/Albedo/ScifiFighterThunderbolt${custom.Underlay}Albedo.png` ),
                mask: await getImageData( '3d/ships/Textures/ThunderboltClassFighter/Colour.png' ),
                base: await getImageData( '3d/ships/Textures/ThunderboltClassFighter/ScifiFighterThunderboltGloss.png' ),
                overlay: await getImageData( '3d/ships/Textures/ThunderboltClassFighter/Overlay.png' ),
                maskPalette: [
                    {r:86,g:86,b:86},
                    {r:47,g:40,b:40},
                    {r:125,g:125,b:125},
                    {r:160,g:160,b:160},
                    {r:94,g:132,b:179},
                    {r:204,g:97,b:0},
                ],
                markings: [
                    { type: 'roundel', x: 45, y: 547, size: 45 },
                    { type: 'roundel', x: 45, y: 838, size: 45 },
                    { type: 'squadronArt', x: 1831, y: 193, size: 196, mask: squadronMask },
                ], 
            };
        } 
        else if( custom.ShipClass === 'Starkiller' ) {
            const squadronMask = await getImageData( '3d/ships/Textures/StarkillerClassFighter/SquadronMark.png' );
            
            params = {
                underlay: await getImageData( `3d/ships/Textures/StarkillerClassFighter/Albedo/ScifiFighterStarkiller${custom.Underlay}Albedo.png` ),
                mask: await getImageData( '3d/ships/Textures/StarkillerClassFighter/Colour.png' ),
                base: await getImageData( '3d/ships/Textures/StarkillerClassFighter/ScifiFighterStarkillerGloss.png' ),
                overlay: await getImageData( '3d/ships/Textures/StarkillerClassFighter/Overlay.png' ),
                maskPalette: [
                    {r:86,g:86,b:86},
                    {r:47,g:40,b:40},
                    {r:125,g:125,b:125},
                    {r:160,g:160,b:160},
                    {r:94,g:132,b:179},
                    {r:204,g:97,b:0},
                ],
                markings: [
                    { type: 'roundel', x: 311, y: 1377, size: 35 },
                    { type: 'roundel', x: 952, y: 721, size: 14 },
                    { type: 'squadronArt', x: 1022, y: 686, size: 55, mask: squadronMask },
                ], 
            };
        }  
        else if( custom.ShipClass === 'Starhammer' ) {
            const squadronMask = await getImageData( '3d/ships/Textures/StarhammerClassFighter/SquadronMark.png' );
            
            params = {
                underlay: await getImageData( `3d/ships/Textures/StarhammerClassFighter/Albedo/ScifiFighterStarhammer${custom.Underlay}Albedo.png` ),
                mask: await getImageData( '3d/ships/Textures/StarhammerClassFighter/Colour.png' ),
                base: await getImageData( '3d/ships/Textures/StarhammerClassFighter/ScifiFighterStarhammerGloss.png' ),
                overlay: await getImageData( '3d/ships/Textures/StarhammerClassFighter/Overlay.png' ),
                maskPalette: [
                    {r:86,g:86,b:86},
                    {r:47,g:40,b:40},
                    {r:125,g:125,b:125},
                    {r:160,g:160,b:160},
                    {r:94,g:132,b:179},
                    {r:204,g:97,b:0},
                ],
                markings: [
                    { type: 'roundel', x: 543, y: 575, size: 55 },
                    { type: 'roundel', x: 1335, y: 1636, size: 38 },
                    { type: 'squadronArt', x: 1333, y: 1046, size: 170, mask: squadronMask },
                ], 
            };
        }  
        else if( custom.ShipClass === 'Starfury' ) {
            const squadronMask = await getImageData( '3d/ships/Textures/StarfuryClassFighter/SquadronMark.png' );
            
            params = {
                underlay: await getImageData( `3d/ships/Textures/StarfuryClassFighter/Albedo/ScifiFighterStarfury${custom.Underlay}Albedo.png` ),
                mask: await getImageData( '3d/ships/Textures/StarfuryClassFighter/Colour.png' ),
                base: await getImageData( '3d/ships/Textures/StarfuryClassFighter/ScifiFighterStarfuryGloss.png' ),
                overlay: await getImageData( '3d/ships/Textures/StarfuryClassFighter/Overlay.png' ),
                maskPalette: [
                    {r:86,g:86,b:86},
                    {r:47,g:40,b:40},
                    {r:125,g:125,b:125},
                    {r:160,g:160,b:160},
                    {r:94,g:132,b:179},
                    {r:204,g:97,b:0},
                ],
                markings: [
                    { type: 'roundel', x: 970, y: 1362, size: 50 },
                    { type: 'roundel', x: 970, y: 1182, size: 50 },
                    { type: 'roundel', x: 1237, y: 280, size: 40 },
                    { type: 'squadronArt', x: 1556, y: 907, size: 109, mask: squadronMask },
                ], 
            };
        }  
        else if( custom.ShipClass === 'Piranha' ) {
            const squadronMask = await getImageData( '3d/ships/Textures/PiranhaClassFighter/SquadronMark.png' );
            
            params = {
                underlay: await getImageData( `3d/ships/Textures/PiranhaClassFighter/Albedo/ScifiFighterPiranha${custom.Underlay}Albedo.png` ),
                mask: await getImageData( '3d/ships/Textures/PiranhaClassFighter/Colour.png' ),
                base: await getImageData( '3d/ships/Textures/PiranhaClassFighter/ScifiFighterPiranhaGloss.png' ),
                overlay: await getImageData( '3d/ships/Textures/PiranhaClassFighter/Overlay.png' ),
                maskPalette: [
                    {r:86,g:86,b:86},
                    {r:47,g:40,b:40},
                    {r:125,g:125,b:125},
                    {r:160,g:160,b:160},
                    {r:94,g:132,b:179},
                    {r:204,g:97,b:0},
                ],
                markings: [
                    { type: 'roundel', x: 1521, y: 1066, size: 55 },
                    { type: 'roundel', x: 1293, y: 1794, size: 30 },
                    { type: 'squadronArt', x: 1030, y: 364, size: 99, mask: squadronMask },
                ], 
            };
        }  
        else if( custom.ShipClass === 'Panther' ) {
            const squadronMask = await getImageData( '3d/ships/Textures/PantherClassFighter/SquadronMark.png' );
            
            params = {
                underlay: await getImageData( `3d/ships/Textures/PantherClassFighter/Albedo/ScifiFighterPanther${custom.Underlay}Albedo.png` ),
                mask: await getImageData( '3d/ships/Textures/PantherClassFighter/Colour.png' ),
                base: await getImageData( '3d/ships/Textures/PantherClassFighter/ScifiFighterPantherGloss.png' ),
                overlay: await getImageData( '3d/ships/Textures/PantherClassFighter/Overlay.png' ),
                maskPalette: [
                    {r:86,g:86,b:86},
                    {r:47,g:40,b:40},
                    {r:125,g:125,b:125},
                    {r:160,g:160,b:160},
                    {r:94,g:132,b:179},
                    {r:204,g:97,b:0},
                ],
                markings: [
                    { type: 'roundel', x: 1691, y: 1715, size: 55 },
                    { type: 'roundel', x: 1691, y: 1855, size: 55 },
                    { type: 'squadronArt', x: 845, y: 734, size: 104, mask: squadronMask },
                ], 
            };
        }  
        else if( custom.ShipClass === 'Longbow' ) {
            const squadronMask = await getImageData( '3d/ships/Textures/LongbowClassFighter/SquadronMask.png' );
            
            params = {
                underlay: await getImageData( `3d/ships/Textures/LongbowClassFighter/Albedo/ScifiFighterLongbow${custom.Underlay}Albedo.png` ),
                mask: await getImageData( '3d/ships/Textures/LongbowClassFighter/Colour.png' ),
                base: await getImageData( '3d/ships/Textures/LongbowClassFighter/ScifiFighterLongbowGloss.png' ),
                overlay: await getImageData( '3d/ships/Textures/LongbowClassFighter/Overlay.png' ),
                maskPalette: [
                    {r:86,g:86,b:86},
                    {r:47,g:40,b:40},
                    {r:125,g:125,b:125},
                    {r:160,g:160,b:160},
                    {r:94,g:132,b:179},
                    {r:204,g:97,b:0},
                ],
                markings: [
                    { type: 'roundel', x: 1105, y: 698, size: 72 },
                    { type: 'squadronArt', x: 33, y: 401, size: 128, mask: squadronMask },
                ], 
            };
        }  
        else if( custom.ShipClass === 'Hellcat' ) {
            const squadronMask = await getImageData( '3d/ships/Textures/HellcatClassFighter/SquadronMark.png' );
            
            params = {
                underlay: await getImageData( `3d/ships/Textures/HellcatClassFighter/Albedo/ScifiFighterHellcat${custom.Underlay}Albedo.png` ),
                mask: await getImageData( '3d/ships/Textures/HellcatClassFighter/Colour.png' ),
                base: await getImageData( '3d/ships/Textures/HellcatClassFighter/ScifiFighterHellcatGloss.png' ),
                overlay: await getImageData( '3d/ships/Textures/HellcatClassFighter/Overlay.png' ),
                maskPalette: [
                    {r:86,g:86,b:86},
                    {r:47,g:40,b:40},
                    {r:125,g:125,b:125},
                    {r:160,g:160,b:160},
                    {r:94,g:132,b:179},
                    {r:204,g:97,b:0},
                ],
                markings: [
                    { type: 'roundel', x: 1420, y: 535, size: 27 },
                    { type: 'roundel', x: 839, y: 1905, size: 40 },
                    { type: 'squadronArt', x: 133, y: 480, size: 71, mask: squadronMask, flipY: true },
                ], 
            };
        }  
        else if( custom.ShipClass === 'Excalibur' ) {
            const squadronMask = await getImageData( '3d/ships/Textures/ExcaliburClassFighter/SquadronMark.png' );
            
            params = {
                underlay: await getImageData( `3d/ships/Textures/ExcaliburClassFighter/Albedo/ScifiFighterExcalibur${custom.Underlay}Albedo.png` ),
                mask: await getImageData( '3d/ships/Textures/ExcaliburClassFighter/Colour.png' ),
                base: await getImageData( '3d/ships/Textures/ExcaliburClassFighter/ScifiFighterExcaliburGloss.png' ),
                overlay: await getImageData( '3d/ships/Textures/ExcaliburClassFighter/Overlay.png' ),
                maskPalette: [
                    {r:86,g:86,b:86},
                    {r:47,g:40,b:40},
                    {r:125,g:125,b:125},
                    {r:160,g:160,b:160},
                    {r:94,g:132,b:179},
                    {r:204,g:97,b:0},
                ],
                markings: [
                    { type: 'roundel', x: 1094, y: 694, size: 26 },
                    { type: 'roundel', x: 522, y: 1403, size: 33 },
                    { type: 'roundel', x: 1251, y: 853, size: 60 },
                    { type: 'squadronArt', x: 1159, y: 671, size: 53, mask: squadronMask },
                    
                ], 
            };
        }  
        else if( custom.ShipClass === 'Devastator' ) {
            params = {
                underlay: await getImageData( `3d/ships/Textures/DevastatorClassFighter/Albedo/ScifiFighterDevastator${custom.Underlay}Albedo.png` ),
                mask: await getImageData( '3d/ships/Textures/DevastatorClassFighter/Colour.png' ),
                base: await getImageData( '3d/ships/Textures/DevastatorClassFighter/ScifiFighterDevastatorGloss.png' ),
                overlay: await getImageData( '3d/ships/Textures/DevastatorClassFighter/Overlay.png' ),
                maskPalette: [
                    {r:86,g:86,b:86},
                    {r:47,g:40,b:40},
                    {r:125,g:125,b:125},
                    {r:160,g:160,b:160},
                    {r:94,g:132,b:179},
                    {r:204,g:97,b:0},
                ],
                markings: [
                    { type: 'roundel', x: 1439, y: 1641, size: 45 },
                    { type: 'squadronArt', x: 250, y: 1562, size: 75 },
                    { type: 'roundel', x: 1679, y: 1595, size: 45 },
                ], 
            };
        }  
        else if( custom.ShipClass === 'Arrow' ) {
            const squadronMask = await getImageData( '3d/ships/Textures/ArrowClassFighter/SquadronMarking.png' );
            
            params = {
                underlay: await getImageData( `3d/ships/Textures/ArrowClassFighter/Albedo/ScifiFighterArrow${custom.Underlay}Albedo.png` ),
                mask: await getImageData( '3d/ships/Textures/ArrowClassFighter/Colour.png' ),
                base: await getImageData( '3d/ships/Textures/ArrowClassFighter/ScifiFighterArrowGloss.png' ),
                overlay: await getImageData( '3d/ships/Textures/ArrowClassFighter/Overlay.png' ),
                maskPalette: [
                    {r:86,g:86,b:86},
                    {r:47,g:40,b:40},
                    {r:125,g:125,b:125},
                    {r:160,g:160,b:160},
                    {r:94,g:132,b:179},
                    {r:204,g:97,b:0},
                ],
                markings: [
                    { type: 'roundel', x: 1416, y: 1913, size: 55 },
                    { type: 'squadronArt', mask: squadronMask, x: 1507, y: 460, size: 93 },
                    { type: 'roundel', x: 1117, y: 1497, size: 35 },
                ], 
            };
        }    
        else if( custom.ShipClass === 'Drake' ) {
            const squadronMask = await getImageData( '3d/ships/Textures/DrakeClassFighter/DrakeSquadronMask.png' );
            
            params = {
                underlay: await getImageData( `3d/ships/Textures/DrakeClassFighter/Albedo/DrakeClassFighter${custom.Underlay}Albedo.png` ),
                mask: await getImageData( '3d/ships/Textures/DrakeClassFighter/Colour.png' ),
                base: await getImageData( '3d/ships/Textures/DrakeClassFighter/DrakeClassFighterGloss.png' ),
                overlay: await getImageData( '3d/ships/Textures/DrakeClassFighter/Overlay.png' ),
                maskPalette: [
                    {r:85,g:85,b:85},
                    {r:255,g:0,b:42},
                    {r:255,g:217,b:0},
                    {r:33,g:254,b:25},
                    {r:52,g:235,b:255},                    
                ],
                markings: [
                    { type: 'roundel', x: 2213, y: 3489, size: 150 },
                    { type: 'squadronArt', mask: squadronMask, x: 40, y: 2865, size: 240, flipY: true },
                    { type: 'roundel', x: 3663, y: 952, size: 220 },
                    { type: 'roundel', x: 3844, y: 2286, size: 120 },
                ],            
            };
        }
        else if( custom.ShipClass === 'Hellion' ) {
            
            const squadronMask = await getImageData( '3d/ships/Textures/HellionClassFrigate/SquadronMask.png' );
            
            params = {
                underlay: await getImageData( `3d/ships/Textures/HellionClassFrigate/Albedo/HellionClassFrigate${custom.Underlay}Albedo.png` ),
                mask: await getImageData( '3d/ships/Textures/HellionClassFrigate/HellionClassFrigateColor.png' ),
                base: await getImageData( '3d/ships/Textures/HellionClassFrigate/HellionClassFrigateGloss.png' ),
                overlay: await getImageData( '3d/ships/Textures/HellionClassFrigate/Overlay.png' ),
                maskPalette: [
                    {r:85,g:85,b:85},
                    {r:255,g:0,b:42},
                    {r:255,g:217,b:0},
                    {r:33,g:254,b:25},
                    {r:52,g:235,b:255},                    
                ],
                markings: [
                    { type: 'roundel', x: 1920, y: 1426, size: 90 },
                    { type: 'roundel', x: 3405, y: 2206, size: 110 },
                    { type: 'roundel', x: 2286, y: 3724, size: 90 },
                    { type: 'squadronArt', mask: squadronMask, x: 2968, y: 2779, size: 164, rotate: true },
                ],            
            }
        }
        else if( custom.ShipClass === 'Paladin' ) {
            
            const squadronMask = await getImageData( '3d/ships/Textures/PaladinClassFrigate/SquadronMask.png' );
            
            params = {
                underlay: await getImageData( `3d/ships/Textures/PaladinClassFrigate/Albedo/PaladinClassFrigate${custom.Underlay}Albedo.png` ),
                mask: await getImageData( '3d/ships/Textures/PaladinClassFrigate/PaladinClassFrigateColor.png' ),
                base: await getImageData( '3d/ships/Textures/PaladinClassFrigate/PaladinClassFrigateGloss.png' ),
                overlay: await getImageData( '3d/ships/Textures/PaladinClassFrigate/Overlay.png' ),
                maskPalette: [
                    {r:85,g:85,b:85},
                    {r:255,g:0,b:42},
                    {r:255,g:217,b:0},
                    {r:33,g:254,b:25},
                    {r:52,g:235,b:255},                    
                ],
                markings: [
                    { type: 'roundel', x: 1976, y: 2317, size: 80 },
                    { type: 'roundel', x: 3509, y: 3305, size: 60 },
                    { type: 'squadronArt', mask: squadronMask, x: 2994, y: 2433, size: 182 },
                ],            
            }
        }
        
        resolve( params );
        
    });
}
document.getElementById('CustomShip').addEventListener( 'submit' , async (e) => {
    e.preventDefault();

    const form = new FormData( document.getElementById('CustomShip') );
    let custom = {};
    for( const pair of form.entries() ) {
        custom[ pair[0] ] = pair[1];
    }
    
    const textureParams = await getShipTextureParams( custom );
    const squadronArt = await getImageData( custom.Squadron );
    const roundel = await getImageData( custom.Roundel );
    
    threeD.postMessage({
        type: 'shipClass', 
        shipClass: custom.ShipClass,
    });
    
    texture.postMessage({
        ...textureParams,
        type: 'buildTexture',
        name: `${custom.ShipClass}Albedo`,
        paint: custom,
        squadronArt: squadronArt,
        roundel: roundel,
    });  

});

document.getElementById('CustomCockpit').addEventListener( 'submit' , async (e) => {
    e.preventDefault();

    const form = new FormData( document.getElementById('CustomCockpit') );
    let custom = {};
    for( const pair of form.entries() ) {
        custom[ pair[0] ] = pair[1];
    }
    

    const underlay = await getImageData( `3d/ships/Textures/ScifiFighterCockpit/ScifiFighterCockpitAlbedo.png` );
    const mask = await getImageData( '3d/ships/Textures/ScifiFighterCockpit/Colour.png' );
    const base = await getImageData( '3d/ships/Textures/ScifiFighterCockpit/ScifiFighterCockpitGloss.png' );
    const overlay = await getImageData( '3d/ships/Textures/ScifiFighterCockpit/Overlay.png' );

    texture.postMessage({
        type: 'buildTexture',
        name: 'CockpitAlbedo',
        paint: custom,
        mask: mask,
        underlay: underlay,
        maskPalette: [
            {r:31,g:31,b:31},
            {r:170,g:76,b:76},
            {r:228,g:64,b:226},
            {r:173,g:232,b:141},
            {r:141,g:188,b:232},                    
        ],                    
        base: base,
        overlay: overlay,
        markings: [],
    });        
    
});

const texture = new Worker(
    'texture.js',
    {
        type: 'module'
    },
);
texture.addEventListener( 'message' , e => {
    const newCanvas = document.createElement( 'canvas' );

/*
    newCanvas.style.position = 'absolute';
    newCanvas.style.top = 0
    newCanvas.style.left = 0;
    newCanvas.style.zIndex = 10;
    newCanvas.style.transform = 'scale(0.25)';
    document.body.appendChild( newCanvas );
*/
    const newOffscreen = newCanvas.transferControlToOffscreen();
    
    threeD.postMessage({
        type: 'texture',
        name: e.data.name,
        texture: e.data.texture,
        canvas: newOffscreen,
    },[newOffscreen]);
});

const threeD = new Worker(
    '3d.js',
    {
        type: 'module'
    },
);	
threeD.onerror = (e) => {
    console.error( e );
}
threeD.addEventListener( 'message' , e => {
    if( e.data.type === 'sceneGraph' ) {
        buildSceneGraph( e );
    }
    else if( e.data.type === 'canvas' ) {
        sendCanvas();
    }
});
threeD.postMessage({
    type: 'init',
    canvas: offscreenCanvas,
    width: canvas.clientWidth,
    height: canvas.clientHeight,
    pixelRatio: window.devicePixelRatio,
} , [ offscreenCanvas ]);

window.addEventListener( 'resize' , () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    threeD.postMessage({
        type: 'resize',
        width,
        height,
    });
});

const editor = document.getElementById('EditMode');
if( editor ) {
    editor.addEventListener( 'click' , () => {
        document.getElementById('Editor').removeChild( editor );
        threeD.postMessage({
            type: 'editor',
            set: 1,
        });
    });
}
window.addEventListener( 'mousemove' , (e) => {
    threeD.postMessage({
        type: 'mousemove',
        x: e.clientX,
        y: e.clientY,
    });
});

let controls = {
    turnHorizontal: 0,
    turnVertical: 0,
    rudder: 0,
    throttle: 0,
    slideHorizontal: 0,
    slideVertical: 0,
    weaponDoors: 0,
};
window.addEventListener( 'keydown' , (e) => {
   if( e.code === 'KeyC' ) {
       threeD.postMessage({
           type: 'canopy',
           set: 'toggle'
       });
   }
   else if( e.code === 'KeyA' ) {
       controls.turnHorizontal = -1;
       sendControls();
   }
   else if( e.code === 'KeyD' ) {
       controls.turnHorizontal = 1;
       sendControls();
   }
   else if( e.code === 'KeyW' ) {
       controls.turnVertical = 1;
       sendControls();
   }
   else if( e.code === 'KeyS' ) {
       controls.turnVertical = -1;
       sendControls();
   }
   else if( e.code === 'ArrowLeft' ) {
       controls.slideHorizontal = -1;
       sendControls();
   }
   else if( e.code === 'ArrowRight' ) {
       controls.slideHorizontal = 1;
       sendControls();
   }
   else if( e.code === 'ArrowUp' ) {
       controls.slideVertical = 1;
       sendControls();
   }
   else if( e.code === 'ArrowDown' ) {
       controls.slideVertical = -1;
       sendControls();
   }
   else if( e.code === 'KeyQ' ) {
       controls.rudder = -1;
       sendControls();
   }
   else if( e.code === 'KeyE' ) {
       controls.rudder = 1;
       sendControls();
   }
   else if( e.code === 'Digit1' ) {
       controls.throttle = 0.11;
       sendControls();
   }
   else if( e.code === 'Digit2' ) {
       controls.throttle = 0.22;
       sendControls();
   }
   else if( e.code === 'Digit3' ) {
       controls.throttle = 0.33;
       sendControls();
   }
   else if( e.code === 'Digit4' ) {
       controls.throttle = 0.44;
       sendControls();
   }
   else if( e.code === 'Digit5' ) {
       controls.throttle = 0.56;
       sendControls();
   }
   else if( e.code === 'Digit6' ) {
       controls.throttle = 0.67;
       sendControls();
   }
   else if( e.code === 'Digit7' ) {
       controls.throttle = 0.78;
       sendControls();
   }
   else if( e.code === 'Digit8' ) {
       controls.throttle = 0.89;
       sendControls();
   }
   else if( e.code === 'Digit9' ) {
       controls.throttle = 1.00;
       sendControls();
   }
   else if( e.code === 'Digit0' ) {
       controls.throttle = 0;
       sendControls();
   }
   else if( e.code === 'KeyR' ) {
        controls.weaponDoors = 1;
        sendControls();
   }
   else if( e.code === 'KeyF' ) {
        controls.weaponDoors = 0;
        sendControls();
   }
});
window.addEventListener( 'keyup' , (e) => {
   if( ['KeyA','KeyD'].includes( e.code ) ) {
       controls.turnHorizontal = 0;
       sendControls();
   }
   else if( ['KeyW','KeyS'].includes( e.code ) ) {
       controls.turnVertical = 0;
       sendControls();
   }
   else if( ['KeyQ','KeyE'].includes( e.code ) ) {
       controls.rudder = 0;
       sendControls();
   }
   else if( ['ArrowLeft','ArrowRight'].includes( e.code ) ) {
       controls.slideHorizontal = 0;
       sendControls();
   }
   else if( ['ArrowUp','ArrowDown'].includes( e.code ) ) {
       controls.slideVertical = 0;
       sendControls();
   }
});
const sendControls = () => {
    threeD.postMessage({
        type: 'controls',
        controls: controls,
    });
}