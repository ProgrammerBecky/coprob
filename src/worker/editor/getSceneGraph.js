export const getSceneGraph = (parent) => {
    
    let graph = [];

    parent.children.map( child => {
        
        let material;
        if( child.material ) {
            if( Array.isArray( child.material ) ) {
                material = child.material.map( mat => mat.name );
            }
            else {
                material = [ child.material.name ];
            }
        }
        
        let name = '';
        if( child.geometry ) {
            name = '🔳 ';
        }
        name += child.name ? child.name : '';
        name += `<small> ${child.type}</small>`;
        
        graph.push({
            uuid: child.uuid,
            name,
            material,
            children: child.children.length > 0 ? getSceneGraph( child ) : false,
        });
    
    });
    
    return graph;

}