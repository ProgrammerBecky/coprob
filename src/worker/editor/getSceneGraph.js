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
        
        graph.push({
            uuid: child.uuid,
            name: child.name ? child.name : `&lt;noname&gt; ${child.type}` ,
            material,
            children: child.children.length > 0 ? getSceneGraph( child ) : false,
        });
    
    });
    
    return graph;

}