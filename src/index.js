import replacePlaceholders from './utils/replace-placeholders';
import './styles/starter-page-templates-editor.scss';

import TemplateSelectorControl from './components/template-selector-control';

( function( wp ) {
    const registerPlugin = wp.plugins.registerPlugin;
    const createElement = wp.element.createElement;
    const { Modal, Button } = wp.components;
    const { withState } = wp.compose;
    
    const insertTemplate = template => {
        // set title
        wp.data.dispatch('core/editor').editPost({title: replacePlaceholders( template.title ) } );
        
        // load content
        fetch( template.contentUrl )
        .then( res => res.json() )
        .then( data => {
            const template = replacePlaceholders( data.body.content );
            const blocks = wp.blocks.parse(template);
            wp.data.dispatch('core/editor').insertBlocks(blocks);
        }).catch( err => console.log(err) );
    };
    
    const PageTemplateModal = withState( {
        isOpen: true,
        isLoading: false,
        selectedTemplate: 'home',
        templates: {
            home: { title: 'Home', slug: 'home', contentUrl: 'https://www.mocky.io/v2/5ce525112e00006900f83afe', imgSrc: 'https://via.placeholder.com/200x180', },
            menu: { title: 'Menu', slug: 'menu', contentUrl: 'https://www.mocky.io/v2/5ce525112e00006900f83afe', imgSrc: 'https://via.placeholder.com/200x180', },
            contact: { title: 'Contact Us', slug: 'contact', contentUrl: 'https://www.mocky.io/v2/5ce525112e00006900f83afe', imgSrc: 'https://via.placeholder.com/200x180', },
        },
    } )( ( { isOpen, selectedTemplate, templates, setState } ) => (
        <div>
            { isOpen && (
                <Modal
                    title="Select Page Template"
                    onRequestClose={ () => setState( { isOpen: false } ) }
                    className="st-template-selector__modal"
                    >
                    <div className="st-template-selector">
                        <div className="st-template-selector__inner">

                            <div className="st-template-selector__intro">
                                <p>Pick a Template that matches the purpose of your page.</p>
                                <p>You can customise each Template to meet your needs.</p>
                            </div>
                            <form className="st-template-form">
                                <fieldset className="st-template-list">
                                    <TemplateSelectorControl
                                        label="Template"
                                        selected={ selectedTemplate }
                                        templates={ Object.values( templates ).map( template => ( {
                                             label: template.title, 
                                             value: template.slug,
                                             preview: template.imgSrc
                                         } ) ) }
                                        onChange={ ( selectedTemplate ) => { setState( { selectedTemplate } ) } }
                                    />
                                </fieldset>
                                <div class="st-template-actions">
                                    <Button className="st-template-action st-template-action--use" isPrimary isLarge onClick={ () => {
                                        setState( { isOpen: false } );
                                        insertTemplate( templates[ selectedTemplate ] );
                                    } }>
                                        Use Template
                                    </Button>
                                    or 
                                    <Button className="st-template-action" isLink isLarge onClick={ () => setState( { isOpen: false } ) }>
                                        Start with blank page
                                    </Button>
                                </div>
                            </form>

                        </div>
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
} )( window.wp );
