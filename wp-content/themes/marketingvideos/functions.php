<?php
remove_action('wp_head', 'rest_output_link_wp_head');
remove_action('wp_head', 'wp_oembed_add_discovery_links');
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'wp_shortlink_wp_head');
remove_action('wp_head', 'wp_resource_hints', 2);
remove_action('wp_head', 'feed_links', 2);
remove_action('wp_head', 'feed_links_extra', 3);
add_filter('show_admin_bar', 'remove_admin_bar');

function remove_admin_bar() {
    return false;
}
/**
 * Disable the emoji's
 */
function disable_emojis() {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
    add_filter('tiny_mce_plugins', 'disable_emojis_tinymce');
    add_filter('wp_resource_hints', 'disable_emojis_remove_dns_prefetch', 10, 2);
}
add_action('init', 'disable_emojis');
/**
 * Filter function used to remove the tinymce emoji plugin.
 */
function disable_emojis_tinymce($plugins) {
    if (is_array($plugins)) {
        return array_diff($plugins, array('wpemoji'));
    } else {
        return array();
    }
}

function disable_emojis_remove_dns_prefetch($urls, $relation_type) {
    if ('dns-prefetch' == $relation_type) {
        /** This filter is documented in wp-includes/formatting.php */
        $emoji_svg_url = apply_filters('emoji_svg_url', 'https://s.w.org/images/core/emoji/2/svg/');

        $urls = array_diff($urls, array($emoji_svg_url));
    }

    return $urls;
}

function my_deregister_scripts() {
    wp_deregister_script('wp-embed');
}
add_action('wp_footer', 'my_deregister_scripts');

function page_assets_includes() {
    if ($GLOBALS['pagenow'] != 'wp-login.php' && !is_admin()) {

        function custom_logo() { ?>
            <style type="text/css">
                #login h1 a, .login h1 a {
                    background-image: url(<?php echo get_stylesheet_directory_uri(); ?>/img/android-chrome-192x192.png);
                }
            </style>
        <?php }

        add_action( 'login_enqueue_scripts', 'custom_logo' );

        wp_register_style('theme_styles', get_template_directory_uri().
            '/style.css', array(), time(), 'all');
        wp_enqueue_style('theme_styles'); // Enqueue it!

        wp_register_style('bootstrap_styles',
            "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css",
            array(), time(), 'all');
        wp_enqueue_style('bootstrap_styles');

        wp_register_script('bootstrap_js',
            "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js",
            array('jquery'), time());
        wp_enqueue_script('bootstrap_js');

        wp_register_script('html5blankscripts', get_template_directory_uri().
            '/js/scripts.js', array('jquery'), time()); // Custom scripts
        wp_enqueue_script('html5blankscripts'); // Enqueue it!

        wp_register_script('chartjs', get_template_directory_uri().
            '/js/Chart.min.js', array('jquery'), time()); // Custom scripts
        wp_enqueue_script('chartjs'); // Enqueue it!

        wp_register_script('chartjs-set', get_template_directory_uri().
            '/js/chart-settings.js', array('jquery','chartjs'), time(), false); // Custom scripts
        wp_enqueue_script('chartjs-set'); // Enqueue it!

        wp_register_script('chart-labels', get_template_directory_uri().
            '/js/chartjs-labels.js', array('jquery'), time(), false); // Custom scripts
        wp_enqueue_script('chart-labels'); // Enqueue it!

        wp_register_script('data', get_template_directory_uri().
            '/js/data.js', array('jquery'), time(), false); // Custom scripts
        wp_enqueue_script('data'); // Enqueue it!
    }
}


/*logic for adding custom meta field*/
add_action( 'rest_api_init', 'create_api_posts_meta_field' );

function create_api_posts_meta_field() {
    register_rest_field( 'post', 'meta-field', array(
            'get_callback' => 'get_post_meta_for_api',
            'update_callback' => 'update_post_meta_for_api',
            'schema' => null,
        )
    );
}


function get_post_meta_for_api( $object, $field_name, $request ) {
    $post_id = $object['id'];
    $meta = get_post_meta( $post_id, 'meta-field' );
    return $meta;
}

function update_post_meta_for_api( $value, $object, $field_name ) {

    return add_post_meta( $object->ID, 'meta-field' ,$value );
}
/*end meta field*/

/*adding custom field for reading raw content data*/
add_action( 'rest_api_init', function () {
    register_rest_field(
        'post',
        'content',
        array(
            'get_callback'    => 'do_raw_shortcodes',
            'update_callback' => null,
            'schema'          => null,
        )
    );
});

function do_raw_shortcodes( $object, $field_name, $request ){
    global $post;
    $post = get_post ($object['id']);
    $output['rendered'] = apply_filters( 'the_content',  $post->post_content);
    $output['_raw'] = $post->post_content;
    return $output;
}
/*end*/

function add_cors_http_header(){
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Authorization, Content-Type");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, PATCH");
};


/*add_filter( 'rest_endpoints', 'show_default_endpoints' );
function show_default_endpoints( $endpoints ) {
    var_export( array_keys( $endpoints ) );
    die;
}*/

/*increasing max posts per page limit*/
add_filter( 'rest_post_collection_params', 'big_json_change_post_per_page', 10, 1 );
function big_json_change_post_per_page( $params ) {
    if ( isset( $params['per_page'] ) ) {
        $params['per_page']['maximum'] = 2000;
    }
    return $params;
}
/*end*/

/*prevent authors role to delete posts*/
function wpb_change_author_role(){
    global $wp_roles;
    $wp_roles->remove_cap( 'author', 'delete_posts' );
    $wp_roles->remove_cap( 'author', 'delete_published_posts' );
}
add_action('init', 'wpb_change_author_role');
/*end*/

add_action('init','add_cors_http_header');
add_filter('flush_rewrite_rules_hard','__return_false');
add_action('init', 'page_assets_includes');
add_theme_support( 'post-thumbnails', array( 'post', 'page' ) );