import { hexToRGB } from './hexToRGB.js';

export const textureBuilder = (e) => {
    
    const paint = e.data.paint;
    const mask = e.data.mask;
    const base = e.data.base;
    const overlay = e.data.overlay;
    
    console.log( mask , base );
    
    const target = new ImageData(4096,4096);
    
    const cl = [
        hexToRGB( e.data.paint.Colour1 ),
        hexToRGB( e.data.paint.Colour2 ),
        hexToRGB( e.data.paint.Colour3 ),
        hexToRGB( e.data.paint.Colour4 ),
        hexToRGB( e.data.paint.Colour5 )
    ];
    
    for( let x=0 ; x<4096 ; x++ ) {
        for( let y=0 ; y<4096 ; y++ ) {
            
            const index = ( (y*4096) + x ) * 4;
            const mr = mask.data[ index+0 ];
            const mg = mask.data[ index+1 ];
            const mb = mask.data[ index+2 ];
            
            let r = base.data[ index+0 ];
            let g = base.data[ index+1 ];
            let b = base.data[ index+2 ];
            const a = overlay.data[ index+3 ];

            if( mr === 85 && mg === 85 && mb === 85 ) {
                r *= cl[0].r / 255;
                g *= cl[0].g / 255;
                b *= cl[0].b / 255;
            }
            else if( mr === 255 && mg === 0 && mb === 42 ) {
                r *= cl[1].r / 255;
                g *= cl[1].g / 255;
                b *= cl[1].b / 255;                
            }
            else if( mr === 255 && mg === 217 && mb === 0 ) {
                r *= cl[2].r / 255;
                g *= cl[2].g / 255;
                b *= cl[2].b / 255;                
            }
            else if( mr === 33 && mg === 254 && mb === 25 ) {
                r *= cl[3].r / 255;
                g *= cl[3].g / 255;
                b *= cl[3].b / 255;                
            }
            else if( mr === 52 && mg === 235 && mb === 255 ) {
                r *= cl[4].r / 255;
                g *= cl[4].g / 255;
                b *= cl[4].b / 255;                
            }
            
            if( a > 0 ) {
                r = r * 1-(a/255);
                g = g * 1-(a/255);
                b = b * 1-(a/255);
                
                r += overlay.data[index+0];
                g += overlay.data[index+1];
                b += overlay.data[index+2];
            }
            
            const remapIndex = ( ( (4095-y)*4096 ) + x ) * 4;
            target.data[ remapIndex+0 ] = Math.floor( r );
            target.data[ remapIndex+1 ] = Math.floor( g );
            target.data[ remapIndex+2 ] = Math.floor( b );
            target.data[ remapIndex+3 ] = 255;
        }
    }

    self.postMessage({
        type: 'texture',
        name: e.data.name,
        texture: target,
    }); 
    
}