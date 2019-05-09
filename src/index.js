( function( wp ) {
    const registerPlugin = wp.plugins.registerPlugin;
    const createElement = wp.element.createElement;
    const { Modal, Button } = wp.components;
    const { withState } = wp.compose;
    
    const insertTemplate = () => {
        fetch('https://www.mocky.io/v2/5cd3fb89350000de307a5211')
        .then( res => res.json() )
        .then( data => {
            const template = data.body.content;
            const blocks = wp.blocks.parse(template);
            wp.data.dispatch('core/editor').insertBlocks(blocks);
        }).catch( err => console.log(err) );
    };
    
    const PageTemplateModal = withState( {
        isOpen: true,
    } )( ( { isOpen, setState } ) => (
        <div>
            { isOpen && (
                <Modal
                    title="Select Page Template"
                    onRequestClose={ () => setState( { isOpen: false } ) }>
                    <Button
                        isDefault
                        onClick={ () => {
                            setState( { isOpen: false } );
                            insertTemplate();
                        }}
                    >
                        This One!
                    </Button>
                </Modal>
            ) }
        </div>
    ) );
    registerPlugin( 'page-templates', {
        render: function() {
            return (
                <PageTemplateModal />
            );
        }
    } );
} )( window.wp );
