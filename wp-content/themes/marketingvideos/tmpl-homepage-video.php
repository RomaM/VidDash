<?php
/* Template Name: Homepage Template */
    require_once('video-pages-list.php');
?>

<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Video Events</title>
    <meta name="description" content="Video Events" />
    <meta name="keywords" content="Video Events" />

    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo get_template_directory_uri(); ?>/img/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo get_template_directory_uri(); ?>/img/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo get_template_directory_uri(); ?>/img/favicon-16x16.png">
    <link rel="mask-icon" href="<?php echo get_template_directory_uri(); ?>/img/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <?php wp_head(); ?>

	<script type="module" src="<?php echo get_template_directory_uri(); ?>/js/general-statistics.js"></script>
</head>

<body>
<?php if( is_user_logged_in()){ ?>
    <div class="page">

        <?php $videoPages = json_encode($videoPages)?>

        <script>
          var generalData = <?php echo $videoPages?>;
          var dataParsing = new Data(generalData);
          dataParsing.init();
        </script>

        <?php
          wp_footer();
        ?>

    </div>
<?php }else {
    get_template_part( 'includes/login' );
}?>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const instance = new GeneralStatistics('Data');
    instance.init();
	});
</script>
</body>
</html>
