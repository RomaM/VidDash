<?php
/* Template Name: Homepage Template */
    require_once('video-pages-list.php');
    get_header();
?>

<body <?php is_user_logged_in() ?  body_class() : body_class("login wp-core-ui"); ?>>
<?php if( is_user_logged_in()){ ?>
    <script type="module" src="<?php echo get_template_directory_uri(); ?>/js/general-statistics.js"></script>
    <div class="page">
        <?php $videoPages = json_encode($videoPages)?>
        <h1 class="page__title">Video Dashboard</h1>

        <section class="charts">
            <div class="charts__box charts__box-pie">
                <p class="charts__subtitle">Failed to upload</p>
                <div class="charts__chart">
                    <ul class="charts__chart-legend">
                        <li><span class="js-error">15</span>% - Failed</li>
                    </ul>
                    <div class="charts__chart-pie">
                        <svg class="progress" width="160" height="160" viewBox="0 0 160 160">
                            <circle class="progress__meter" cx="80" cy="80" r="78" stroke-width="4" />
                            <circle class="progress__value" id="progress-failed" cx="80" cy="80" r="78" stroke-width="4" />
                        </svg>
                    </div>
                </div>
            </div>
            <div class="charts__box charts__box-pie">
                <p class="charts__subtitle">Stopped playing</p>
                <div class="charts__chart">
                    <ul class="charts__chart-legend">
                        <li><span class="js-error">15</span>% - Stopped</li>
                    </ul>
                    <div class="charts__chart-pie">
                        <svg class="progress"  width="160" height="160" viewBox="0 0 160 160">
                            <circle class="progress__meter" cx="80" cy="80" r="78" stroke-width="4" />
                            <circle class="progress__value" id="progress-stopped" cx="80" cy="80" r="78" stroke-width="4" />
                        </svg>
                    </div>
                </div>
            </div>
            <div class="charts__box">
                <p class="charts__subtitle">Video views</p>
                <div id="view-chart" class="charts__views">
                    <div class="charts__timeline">
                        <div class="charts__timeline-title">Time, s:</div>
                        <div class="charts__timeline-time">
                            <div class="charts__timeline-step">
                                5
                            </div>
                            <div class="charts__timeline-step">
                                10
                            </div>
                            <div class="charts__timeline-step">
                                15
                            </div>
                            <div class="charts__timeline-step charts__timeline-middlestep">
                                25
                            </div>
                            <div class="charts__timeline-step charts__timeline-middlestep">
                                45
                            </div>
                            <div class="charts__timeline-step charts__timeline-largestep">
                                60+
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="charts__box">
                <p class="charts__subtitle">Distribution</p>
                <div id="map-container" style="position: relative; width: 450px; height: 190px;">

                </div>
            </div>
        </section>

        <h2 class="tabulator-title">Engagement:</h2>
        <div id="table-wrapper"></div>

        <?php
          wp_footer();
        ?>

        <script>
          document.addEventListener('DOMContentLoaded', () => {
            const instance = new GeneralStatistics(<?php echo $videoPages;?>);
            instance.init();
          });
        </script>
    </div>
<?php } else {
    get_template_part( 'includes/login' );
}?>

</body>
</html>
