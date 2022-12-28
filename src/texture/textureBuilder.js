import { hexToRGB } from './hexToRGB.js';

export const textureBuilder = (e) => {
    const paint = e.data.paint;
    const mask = e.data.mask;
    const base = e.data.base;
    const underlay = e.data.underlay;
    const overlay = e.data.overlay;
    const maskPalette = e.data.maskPalette;
    const markings = e.data.markings;
    
    const width = e.data.base.width;
    const height = e.data.base.height;
    
    const target = new ImageData(width,height);
    
    const cl = [
        hexToRGB( e.data.paint.Colour1 ),
        hexToRGB( e.data.paint.Colour2 ),
        hexToRGB( e.data.paint.Colour3 ),
        hexToRGB( e.data.paint.Colour4 ),
        hexToRGB( e.data.paint.Colour5 ),
        hexToRGB( e.data.paint.Colour6 ),
    ];
    
    for( let x=0 ; x<width ; x++ ) {
        for( let y=0 ; y<height ; y++ ) {
            
            const index = ( (y*width) + x ) * 4;
            const mr = mask.data[ index+0 ];
            const mg = mask.data[ index+1 ];
            const mb = mask.data[ index+2 ];
            
            let r = base.data[ index+0 ];
            let g = base.data[ index+1 ];
            let b = base.data[ index+2 ];
            let a = overlay.data[ index+3 ];

            maskPalette.map( (palette,clIndex) => {
                if( palette.r === mr && palette.g === mg && palette.b === mb ) {
                    if( cl[clIndex].r > 0 || cl[clIndex].g > 0 || cl[clIndex].b > 0 ) {
                        r *= cl[clIndex].r / 255;
                        g *= cl[clIndex].g / 255;
                        b *= cl[clIndex].b / 255;
                    }
                    else {
                        r = underlay.data[ index+0 ];
                        g = underlay.data[ index+1 ];
                        b = underlay.data[ index+2 ];
                        a = 0;
                    }
                }
            });
            
            if( a > 0 ) {
                r = r * 1-(a/255);
                g = g * 1-(a/255);
                b = b * 1-(a/255);
                
                r += overlay.data[index+0];
                g += overlay.data[index+1];
                b += overlay.data[index+2];
            }
            
            const remapIndex = ( ( ((height-1)-y)*width ) + x ) * 4;
            target.data[ remapIndex+0 ] = Math.floor( r );
            target.data[ remapIndex+1 ] = Math.floor( g );
            target.data[ remapIndex+2 ] = Math.floor( b );
            target.data[ remapIndex+3 ] = 255;
        }
    }
    
    markings.map( marking => {
        
        const w = e.data[ marking.type ].width;
        const h = e.data[ marking.type ].height;
        
        for( let px=0 ; px<marking.size; px++ ) {
            for( let py=0 ; py<marking.size; py++ ) {
                
                let sx = Math.floor( px*w/marking.size );
                let sy = Math.floor( py*h/marking.size );
                if( marking.rotate ) {
                   const temp = sx;
                   sx = sy;
                   sy = temp;
                }

                let sIndex;
                if( marking.flipY ) {
                    sIndex = ( ( ((h-1)-sy)*w ) + sx ) * 4;
                }
                else {
                    sIndex = ( ( sy*w ) + sx ) * 4;
                }
                
                const r = e.data[ marking.type ].data[ sIndex+0 ];
                const g = e.data[ marking.type ].data[ sIndex+1 ];
                const b = e.data[ marking.type ].data[ sIndex+2 ];
                let a = e.data[ marking.type ].data[ sIndex+3 ] / 255;

                if( marking.mask ) {
                    const mIndex = ( ( py*marking.mask.width ) + px ) * 4;
                    a = Math.min( a , 255 - marking.mask.data[ mIndex+3 ] );
                }

                if( a > 0 ) {
                
                    const dx = marking.x + px;
                    const dy = marking.y + py;
                    const dIndex = ( ( ((height-1)-dy) * width ) + dx ) * 4;
                    
                    let br = target.data[ dIndex+0 ];
                    let bg = target.data[ dIndex+1 ];
                    let bb = target.data[ dIndex+2 ];
                    
                    br = ( br * (1-a) ) + r*a;
                    bg = ( bg * (1-a) ) + g*a;
                    bb = ( bb * (1-a) ) + b*a;
                    
                    target.data[ dIndex+0 ] = Math.floor( br );
                    target.data[ dIndex+1 ] = Math.floor( bg );
                    target.data[ dIndex+2 ] = Math.floor( bb );
                    
                }
                
            }
        }
    });

    self.postMessage({
        type: 'texture',
        name: e.data.name,
        texture: target,
    }); 
    
}