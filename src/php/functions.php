<?php
$theme = wp_get_theme();
$ver = $theme->get('Version');

show_admin_bar( false );

add_action( 'wp_enqueue_scripts', 'wkny_enqueue_scripts' );
add_action( 'wp_enqueue_scripts', 'wkny_enqueue_styles' );
add_action( 'init', 'wkny_remove_post_type_support' );
add_action( 'init', 'wkny_remove_emoji_and_embed' );
add_action( 'admin_menu', 'wkny_remove_menus' );
add_action( 'after_setup_theme', 'wkny_setup' );
add_filter( 'upload_mimes', 'wkny_allow_svg', 1, 1);
add_filter( 'jpeg_quality', 'set_jpeg_quality' );
add_filter( 'jpeg_quality', 'set_jpeg_quality', 'image_resize' );
add_filter( 'jpeg_quality', 'set_jpeg_quality', 'edit_image' );
add_filter( 'wp_editor_set_quality', 'set_jpeg_quality' );
// add_filter( 'wp_calculate_image_srcset', 'wkny_calculate_image_srcset', 1 );

// function wkny_calculate_image_srcset($sources){
// 	foreach($sources as &$source){
// 		if($source['value'] > 100){
// 			$source['value'] -= 100;			
// 		}
// 	}
// 	return $sources;
// }

if( function_exists('acf_add_options_page') ) {
	acf_add_options_page('Content');
	acf_add_options_page('Options');
}

function wkny_remove_menus(){
	remove_menu_page( 'edit-comments.php' );
	remove_menu_page( 'edit.php?post_type=page' );
	remove_menu_page( 'edit.php' );
}

function wkny_allow_svg($mimes) {
	$mimes['svg'] = 'image/svg+xml';
	return $mimes;
}

function wkny_setup() {
	add_image_size( '_1920', 1920, 0, 0 );
	add_image_size( '_1280', 1280, 0, 0 );
	add_image_size( '_1024', 1024, 0, 0 );
	add_image_size( '_768', 768, 0, 0 );
	add_image_size( '_512', 512, 0, 0 );
}

function set_jpeg_quality(){
	return 100;
}

function wkny_remove_emoji_and_embed() {
	// all actions related to emojis
	remove_action( 'admin_print_styles', 'print_emoji_styles' );
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
	remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
	remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );

	// embed
	remove_action('wp_head', 'wp_oembed_add_host_js');
}

function wkny_remove_post_type_support(){
	remove_post_type_support( 'post', 'excerpt' );
	remove_post_type_support( 'post', 'post-formats' );
	remove_post_type_support( 'post', 'revisions' );
	remove_post_type_support( 'post', 'comments' );
	remove_post_type_support( 'post', 'trackbacks' );
	remove_post_type_support( 'post', 'author' );
	remove_post_type_support( 'post', 'editor' );
	remove_post_type_support( 'post', 'page-attributes' );
	remove_post_type_support( 'post', 'custom-fields' );

	remove_post_type_support( 'page', 'excerpt' );
	remove_post_type_support( 'page', 'post-formats' );
	remove_post_type_support( 'page', 'thumbnail' );
	remove_post_type_support( 'page', 'revisions' );
	remove_post_type_support( 'page', 'comments' );
	remove_post_type_support( 'page', 'trackbacks' );
	remove_post_type_support( 'page', 'author' );
	remove_post_type_support( 'page', 'editor' );
	remove_post_type_support( 'page', 'page-attributes' );
	remove_post_type_support( 'page', 'custom-fields' );

	unregister_taxonomy_for_object_type('post_tag', 'post');
}

function wkny_enqueue_scripts(){
	global $ver;
	wp_enqueue_script('app', get_template_directory_uri()."/wkny.min.js", array(), $ver, true);
	
	global $wkny_shop_enabled;
	global $wkny_show_intro;

	$locations = get_nav_menu_locations();
	$primary_menu_id = $locations['primary'];
	$footer_menu_id = $locations['footer'];

	$frontpage = get_field('frontpage', 'option');
	$first_frontpage_slide_has_white_text = $frontpage[0]['white_text'] == 1 ? true : false;
	
	global $Braintree_Tokenization_Key;
	global $Braintree_Environment;

	wp_localize_script( 'app', 'passedData',
		array(
			'siteName' => get_bloginfo('name'),
			'template_directory_uri' => get_template_directory_uri(),
		)
	);
}

function wkny_enqueue_styles(){
	global $ver;
	wp_enqueue_style('app-style', get_template_directory_uri()."/css/style.css", array(), $ver);
}

function wkny_get_body_data(){
	$type = '';
	$id = '';
	$slug = '';

	global $post;

	// post is null if page doesnt exist. then just show frontpage
	if(is_category()){
		$category = get_category( get_query_var( 'cat' ) );
		$type = 'category';
	}
	else if(is_singular('post')){
		$type = 'post';
	}
	else if(is_page()){
		$type = 'page';
	}
	else if($post == null){
		$type = 'frontpage';
	}
	else{
		$type = 'frontpage';
	}


	$return = 'data-type="'.$type.'"';

	echo $return;
}

require_once('endpoints.php');