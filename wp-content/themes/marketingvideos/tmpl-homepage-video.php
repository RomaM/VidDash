<?php
/* Template Name: Homepage Template */
    /*require_once 'wp-login.php';*/
    /*if( !is_user_logged_in()){
        wp_safe_redirect('/wp-admin');
        exit;
    }*/
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
</head>

<body <?php is_user_logged_in() ?  body_class() : body_class("login wp-core-ui"); ?>>
<?php if( is_user_logged_in()){ ?>
    <div class="loading"></div>
    <div class="page">
        <header class="header">
            <div class="container">
                <div class="row">
                    <div class="header__filter">
                        <select id="domainFilter" class="header__filter-select header__filter-select_domain form-control">

                        </select>
                        <select id="pageFilter" class="header__filter-select header__filter-select_page form-control">

                        </select>
                        <select id="videoFilter" class="header__filter-select form-control">

                        </select>
<!--                        <select id="dateFromFilter" class="header__filter-select form-control">-->
<!---->
<!--                        </select>-->
<!--                        <select id="dateToFilter" class="header__filter-select form-control">-->
<!---->
<!--                        </select>-->

                        <button type="button" id="button" class="btn btn-primary">
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <main class="content">
            <p class="content__title" id="title">Page</p>
            <div class="container">
                <div class="chart">
                    <div class="chart__box">
                        <canvas id="avgTime" width="400" height="400"></canvas>
                    </div>
                    <div class="chart__box">
                        <canvas id="deviceName" width="400" height="400"></canvas>
                    </div>
                    <div class="chart__box">
                        <canvas id="usersPerDay" width="400" height="400"></canvas>
                    </div>
                    <div class="chart__box">
                        <canvas id="orientation" width="400" height="400"></canvas>
                    </div>
                </div>

                <h1 class="content__title">Engagement:</h1>
                <div id="wrapper">
                    <div class="table">
                        <div class="table__header">
                            <div class="table__col table__header-videoname">Video Name</div>
                            <div class="table__col table__header-views">№ of views</div>
                            <div class="table__col table__header-avgtime">Average playtime</div>
                        </div>
                        <div id="tableBody" class="table__body">

                        </div>
                    </div>
                </div>

                <!--<?php
                    $videoPages = json_encode($videoPages);
                    var_dump($videoPages);
                    ?>-->

                <script>
                  var jsData = <?php echo $videoPages?>;
                  let chartDashboard = new ChartData(
                    jsData
                  );
                  chartDashboard.init();
                </script>
            </div>
        </main>

        <?php
        wp_footer();
        ?>

    </div>
<?php }else {
    get_template_part( 'includes/login' );
}?>
</body>
</html>
