/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { withInstanceId } from '@wordpress/compose';
import { BaseControl } from '@wordpress/components';
import { createElement } from '@wordpress/element';



function TemplateSelectorControl( { label, className, selected, help, instanceId, onChange, templates = [] } ) {
	const id = `inspector-radio-control-${ instanceId }`;
	const onChangeValue = ( event ) => onChange( event.target.value );

	return ! isEmpty( templates ) && (
		<BaseControl label={ label } id={ id } help={ help } className={ classnames( className, 'template-radio-control' ) }>
			{ templates.map( ( option, index ) =>
				<div
					key={ `${ id }-${ index }` }
					className="template-radio-control__option"
				>	
					<input
						id={ `${ id }-${ index }` }
						className="template-radio-control__input"
						type="radio"
						name={ id }
						value={ option.value }
						onChange={ onChangeValue }
						checked={ option.value === selected }
						aria-describedby={ !! help ? `${ id }__help` : undefined }
					/>
					<label className="template-radio-control__label" htmlFor={ `${ id }-${ index }` }>
						<img className="template-radio-control__media" src={ option.preview } />
						{ option.label }
					</label>
				</div>
			) }
		</BaseControl>
	);
}

export default withInstanceId( TemplateSelectorControl );
