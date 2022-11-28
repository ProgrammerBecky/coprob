export const buildSceneGraph = ( e ) => {

    let ul = document.createElement( 'ul' );;
    
    e.data.nodes.map( node => {
        ul.appendChild( showNode( node ) );
    });
    
    document.getElementById( 'Editor' ).appendChild( ul );
}

const showElement = ( uuid ) => {
    console.log( 'selected element' , uuid );
}

const showNode = ( node ) => {
    
    const li = document.createElement( 'li' );
    li.setAttribute( 'data-guid' , node.uuid );
    
    if( node.children ) {
        li.classList.add( 'hasChildren' );
        li.addEventListener( 'click' , (e) => {

            const selected = document.getElementsByClassName( 'graphSelected' );
            for( let i=0 ; i<selected.length ; i++ ) {
                selected[i].classList.remove( 'graphSelected' );
            }
            e.target.classList.add( 'graphSelected' );
            showElement( e.target.getAttribute( 'data-guid' ) );

            if( e.target.classList.contains( 'open' ) ) {
                e.target.classList.remove( 'open' );
            }
            else {
                e.target.classList.add( 'open' );
            }
            e.stopPropagation();
        });
    }
    li.innerHTML = node.name;
    if( node.material ) li.innerHTML += ` (${node.material.join( ', ' )})`;
    
    if( node.children ) {
        const ul = document.createElement( 'ul' );
        
        node.children.map( child => {
            ul.appendChild( showNode( child ) );
        });
        
        li.appendChild( ul );
    }
    
    return li;
    
}
