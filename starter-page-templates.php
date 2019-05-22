<?php
/**
 * Plugin Name: Starter Page Templates
 * Description: Create new pages by selecting pre-built page templates.
 * Version: 1.0.0
 * Author: Automattic
 *
 * @package starter-page-templates
 */

/**
 * Retrieves a URL to a file in the plugin's directory.
 *
 * @param  string $path Relative path of the desired file.
 * @return string       Fully qualified URL pointing to the desired file.
 */
function wp_js_plugin_starter_url( $path ) {
	return plugins_url( $path, __FILE__ );
}

/**
 * Register scripts.
 */
function page_templates_register() {
	wp_register_script(
		'starter-page-templates',
		wp_js_plugin_starter_url( 'dist/index.js' ),
		array( 'wp-plugins', 'wp-edit-post', 'wp-element' ),
		filemtime( plugin_dir_path( __FILE__ ) . '/dist/index.js' ),
		true
	);
}
add_action( 'init', 'page_templates_register' );

/**
 * Enqueue scripts.
 */
function page_templates_enqueue() {
	$screen = get_current_screen();

	// Return early if we don't meet conditions to show templates.
	if ( 'page' !== $screen->id || 'add' !== $screen->action ) {
		return;
	}

	wp_enqueue_script( 'starter-page-templates' );
}
add_action( 'enqueue_block_editor_assets', 'page_templates_enqueue' );
