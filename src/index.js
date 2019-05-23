import replacePlaceholders from './utils/replace-placeholders';
import './styles/starter-page-templates-editor.scss';
import { keyBy } from 'lodash';

import TemplateSelectorControl from './components/template-selector-control';

( function( wp, config = {} ) {
    const registerPlugin = wp.plugins.registerPlugin;
    const createElement = wp.element.createElement;
    const { Modal, Button } = wp.components;
    const { withState } = wp.compose;
    
    const { siteInformation = {}, templates = [] } = config;
    
    const insertTemplate = template => {
        // set title
        wp.data.dispatch('core/editor').editPost({title: replacePlaceholders( template.title, siteInformation ) } );
        
        // load content
        const templateString = replacePlaceholders( template.content, siteInformation );
        const blocks = wp.blocks.parse( templateString );
        wp.data.dispatch('core/editor').insertBlocks( blocks );
    };
    
    const PageTemplateModal = withState( {
        isOpen: true,
        isLoading: false,
        selectedTemplate: 'home',
        templates: keyBy( templates, 'slug' ),
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
                                             preview: template.preview,
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
} )( window.wp, window.starterPageTemplatesConfig );
