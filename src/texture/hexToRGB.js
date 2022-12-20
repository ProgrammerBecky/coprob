export const hexToRGB = (vl) => {
    return {
        r: parseInt( vl.substr(1,2) , 16 ),
        g: parseInt( vl.substr(3,2) , 16 ),
        b: parseInt( vl.substr(5,2) , 16 ),
    };
}