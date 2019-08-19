<?php
/* Template Name: Homepage Template */
    require_once('video-pages-list.php');
    get_header();
?>

<body>
<?php if( is_user_logged_in()){ ?>
    <script type="module" src="<?php echo get_template_directory_uri(); ?>/js/general-statistics.js"></script>
    <div class="page">
        <?php $videoPages = json_encode($videoPages)?>
        <h1 class="page__title">Video Dashboard</h1>

        <section class="charts">
            <div class="charts__box">
                <p class="charts__subtitle">Failed to upload</p>
                <div class="charts__chart">
                    <ul class="charts__chart-legend">
                        <li>15% - Internet</li>
                        <li>85% - CDN</li>
                    </ul>
                    <div class="charts__chart-pie">
                        <div class="charts__chart-pieborder"></div>
                    </div>
                </div>
            </div>
            <div class="charts__box">
                <p class="charts__subtitle">Stopped playing</p>
                <div class="charts__chart">
                    <ul class="charts__chart-legend">
                        <li>15% - Stopped</li>
                    </ul>
                    <div class="charts__chart-pie">
                        <div class="charts__chart-pieborder"></div>
                    </div>
                </div>
            </div>
            <div class="charts__box">
                <p class="charts__subtitle">Video views</p>
                <div class="charts__views">
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                    <div class="charts__views-block"></div>
                </div>
            </div>
            <div class="charts__box">
                <p class="charts__subtitle">Distribution</p>
                World pecentage
            </div>
        </section>

        <h2 class="tabulator-title">Engagement:</h2>
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
