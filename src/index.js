import replacePlaceholders from './utils/replace-placeholders';

( function( wp, config = {} ) {
    const registerPlugin = wp.plugins.registerPlugin;
    const createElement = wp.element.createElement;
    const { Modal, Button, RadioControl } = wp.components;
    const { withState } = wp.compose;
    
    const { siteInformation = {}, vertical = null } = config;
    
    const insertTemplate = template => {
        console.log( 'Using template', template );

        // set title
        wp.data.dispatch('core/editor').editPost({title: replacePlaceholders( template.title, siteInformation ) } );
        
        // load content
        fetch( template.contentUrl )
        .then( res => res.json() )
        .then( data => {
            const template = replacePlaceholders( data.body.content, siteInformation );
            const blocks = wp.blocks.parse(template);
            wp.data.dispatch('core/editor').insertBlocks(blocks);
        }).catch( err => console.log(err) );
    };
    
    const PageTemplateModal = withState( {
        isOpen: true,
        isLoading: false,
        selectedTemplate: 'home',
        templates: {
            home: { title: 'Home', slug: 'home', contentUrl: 'https://www.mocky.io/v2/5ce525112e00006900f83afe' },
            menu: { title: 'Menu', slug: 'menu', contentUrl: 'https://www.mocky.io/v2/5ce525112e00006900f83afe' },
            contact: { title: 'Contact Us', slug: 'contact', contentUrl: 'https://www.mocky.io/v2/5ce525112e00006900f83afe' },
        },
    } )( ( { isOpen, selectedTemplate, templates, setState } ) => (
        <div>
            { isOpen && (
                <Modal
                    title="Select Page Template"
                    onRequestClose={ () => setState( { isOpen: false } ) }>
                    <RadioControl
                        label="Template"
                        selected={ selectedTemplate }
                        options={ Object.values( templates ).map( template => ( { label: template.title, value: template.slug } ) ) }
                        onChange={ ( selectedTemplate ) => { setState( { selectedTemplate } ) } }
                    />
                    <div>
                        <Button isDefault isLarge onClick={ () => setState( { isOpen: false } ) }>
                            Start with blank page
                        </Button>
                        <Button isPrimary isLarge onClick={ () => {
                            setState( { isOpen: false } );
                            insertTemplate( templates[ selectedTemplate ] );
                        } }>
                            Use Template
                        </Button>
                    </div>
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
} )( window.wp, window.starterPageTemplatesConfig );
