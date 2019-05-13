<?php
    wp_enqueue_style( 'login' );
    do_action( 'login_enqueue_scripts' );
    do_action( 'login_head' );
?>
<div id="login">
    <h1><a href="<?php home_url(); ?>" title="Video Dashboard">Video Dashboard</a></h1>
    <?php wp_login_form( array ($args = array(
            'remember' => true,
            'redirect' => '/videos'
    ) ));?>
</div>

