( function( wp ) {
    const registerPlugin = wp.plugins.registerPlugin;
    const createElement = wp.element.createElement;
    const { Modal, Button } = wp.components;
    const { withState } = wp.compose;
    
    const insertTemplate = () => {
        fetch('https://wpdesignhub.com/designs/basic/051063/code.html')
        .then( res => res.text() )
        .then( text => {
            wp.data.dispatch('core/editor').insertBlocks(wp.blocks.parse(text));
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
