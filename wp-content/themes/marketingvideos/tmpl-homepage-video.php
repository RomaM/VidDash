<?php
/* Template Name: Homepage Template */
    require_once('video-pages-list.php');
    get_header();
?>

<body>
<script type="module" src="<?php echo get_template_directory_uri(); ?>/js/general-statistics.js"></script>
<?php if( is_user_logged_in()){ ?>
    <div class="page">



        <?php $videoPages = json_encode($videoPages)?>
        <div id="table-wrapper"></div>

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
    const instance = new GeneralStatistics(<?php echo $videoPages;?>);
    instance.init();
	});
</script>
</body>
</html>
