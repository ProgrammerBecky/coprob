import {
    textureBuilder
} from './src/texture/textureBuilder.js';

try {

    onmessage = (e) => {
        if( e.data.type === 'buildTexture' ) {
            textureBuilder( e );
        }
    }

}
catch( e ) {
    self.postMessage({ type: 'error' , message: e.message });
}