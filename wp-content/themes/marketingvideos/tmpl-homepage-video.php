<?php
/* Template Name: Homepage Template */
    /*require_once 'wp-login.php';*/
    /*if( !is_user_logged_in()){
        wp_safe_redirect('/wp-admin');
        exit;
    }*/
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
        <div class="page">
        <header class="header">
            <div class="container">
                <div class="row">
                    <div class="header__filter">
                        <select class="header__filter-select form-control">
                            <option>Page name</option>
                        </select>
                        <select class="header__filter-select form-control">
                            <option>Video name</option>
                        </select>
                        <select class="header__filter-select form-control">
                            <option>Date from</option>
                        </select>
                        <select class="header__filter-select form-control">
                            <option>Date to</option>
                        </select>


                        <button class="btn btn-primary">
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <main class="content">
            <div class="container">
                <div class="chart">
                    <div class="chart__box">
                        <canvas id="avgTime" width="400" height="400"></canvas>
                    </div>
                    <div class="chart__box">
                        <canvas id="scrollIn" width="400" height="400"></canvas>
                    </div>
                    <div class="chart__box">
                        <canvas id="scrollOut" width="400" height="400"></canvas>
                    </div>
                    <div class="chart__box">
                        <canvas id="userCountry" width="400" height="400"></canvas>
                    </div>
                </div>

                <h1 class="content__title">POSTS:</h1>
                <div id="wrapper"></div>

                <?php
                		$videoPages = array(); // Main global array with data

                    $posts = get_posts(array('category_name' => 'videoEvents')); // All posts from VideoEvents

                    foreach ($posts as $i => $post) {
                    		// General details about post
                      	$fullContent = json_decode($post->post_content);
                        $pageDomain = $fullContent->domain;
                        $pageName = $fullContent->pageName;
                        $videoName = $fullContent->videoName;
                        $videoDuration = $fullContent->videoDuration;

                        // Creating a page for each unique page with video
                        $singlePage = (object)[];
                        $singlePage->pageName = $pageName;
                        $singlePage->videoName = $videoName;
                        $singlePage->duration = $videoDuration;
                        $singlePage->date = [];

                        // Getting metadata about each post
                        $postId = $post->ID;
                        $custom_fields = get_post_custom($postId, '', false);
                        $content = $custom_fields['meta-field'];

												// Check if video page exists in main array
												if (array_key_exists($pageDomain . '|' . $pageName, $videoPages)) {
													// Each post in the DB is unique now
												} else {
                            $currentDate = '';
                            foreach ( $content as $key => $value ) {
                                $decodedValues = json_decode($value);

                                foreach ($decodedValues as $decodedValue) {
                                    $userID = $decodedValue->uid;
                                    $userSession = $decodedValue->session;
                                    $userDate = $decodedValue->date;
                                    $userDevice = $decodedValue->device;
                                    $userEvent = $decodedValue->event;
                                    $userVideoTime = $decodedValue->videotime;
                                    $userTimestamp = $decodedValue->timestamp;

                                    // Check if event date exists in the video page
                                    if (array_key_exists($userDate, $singlePage->date)) {

                                        // Check if user ID exists in the IDs array
                                        if (array_key_exists($userID, $singlePage->date[$userDate]->uids)) {
                                            $eventInfo = (object)[
                                                'session' => $userSession,
                                                'date' => $userDate,
                                                'device' => json_encode($userDevice),
                                                'event' => $userEvent,
                                                'videoTime' => $userVideoTime,
                                                'timestamp' => $userTimestamp,
                                            ];

																						array_push($singlePage->date[$userDate]->uids[$userID]->events, $eventInfo);

																				}
																				else {
                                            $eventInfo = (object)[
                                                'session' => $userSession,
                                                'date' => $userDate,
                                                'device' => json_encode($userDevice),
                                                'event' => $userEvent,
                                                'videoTime' => $userVideoTime,
                                                'timestamp' => $userTimestamp,
                                            ];

                                            $singlePage->date[$userDate]->uids[$userID] = (object)[
                                                'events' => [$eventInfo]
                                            ];

																				}

                                    } else {
                                        $currentDate = $userDate;
                                        $eventInfo = (object)[
                                            'session' => $userSession,
                                            'date' => $userDate,
                                            'device' => json_encode($userDevice),
                                            'event' => $userEvent,
                                            'videoTime' => $userVideoTime,
                                            'timestamp' => $userTimestamp,
                                        ];

                                        $singlePage->date = [
                                            $userDate => (object)[
                                                'uids' => [
                                                    $userID => (object)[
                                                        'events' => [$eventInfo]
                                                    ]
                                                ]
                                            ]
                                        ];
																		}
                                }

                            }

                            $videoPages[$pageDomain . '|' . $pageName] = $singlePage;
												}

                    }

                		var_dump($videoPages);
                ?>

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
