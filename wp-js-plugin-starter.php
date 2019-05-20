<?php
/**
 * Plugin Name: WP JS Plugin Starter
 * Plugin URI: https://github.com/youknowriad/wp-js-plugin-starter
 * Description: Just another WordPress plugin starter
 * Version: 1.0.1
 * Author: Riad Benguella
 *
 * @package wp-js-plugin-starter
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

function page_templates_register() {
	wp_register_script(
		'plugin-sidebar-js',
		wp_js_plugin_starter_url( 'dist/index.js' ),
		array( 'wp-plugins', 'wp-edit-post', 'wp-element' )
	);
}
add_action( 'init', 'page_templates_register' );

function page_templates_enqueue() {
	$screen = get_current_screen();

	// Return early if we don't meet conditions to show templates.
	if ( 'page' !== $screen->id || 'add' !== $screen->action ) {
		return;
	}

	wp_enqueue_script( 'plugin-sidebar-js' );
}
add_action( 'enqueue_block_editor_assets', 'page_templates_enqueue' );
