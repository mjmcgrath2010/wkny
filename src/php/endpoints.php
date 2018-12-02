<?php

add_action( 'rest_api_init', function () {
    register_rest_route( 'wkny/v1', '/frontpage/', array(
        'methods' => 'GET',
        'callback' => 'wkny_get_frontpage',
    ) );
} );

function wkny_get_frontpage( WP_REST_Request $request ) {
    $intro_video = get_field('intro_video', 'option');
    $content = get_field('content', 'option');

    return array(
        "intro" => $intro_video,
        "content" => $content,
    );
}