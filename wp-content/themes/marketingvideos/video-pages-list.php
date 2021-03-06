<?php
/* Main array of the pages */

$videoPages = array(); // Main global array with data

$posts = get_posts(array('category_name' => 'videoEvents')); // All posts from VideoEvents

foreach ($posts as $i => $post) {
    // General details about post
//    $fullContent = json_decode($post->post_content);
    $fullContent = explode('-pageis-', $post->post_title);
    $pageDomain = $fullContent[0];
    $fullContent = explode('-videonameis-', $fullContent[1]);
    $pageName = $fullContent[0];
    $videoName = $fullContent[1];

    $videoDuration = json_decode($post->post_content)->videoDuration;

    // Creating a page for each unique page with video
    $singlePage = (object)[];
//    $singlePage->pageName = $pageName;
//    $singlePage->videoName = $videoName;
    $singlePage->duration = $videoDuration;
    $singlePage->date = [];

    // Getting metadata about each post
    $postId = $post->ID;
    $custom_fields = get_post_custom($postId, '', false);
    $content = $custom_fields['meta-field'];

    // Check if video page exists in main array
    if (array_key_exists($pageDomain . '|' . $pageName . '|' . $videoName, $videoPages)) {
        // Each post in the DB is unique now
    } else {
        foreach ( $content as $key => $value ) {
            $decodedValues = json_decode($value);

            foreach ($decodedValues as $decodedValue) {
                $userID = $decodedValue->uid;
                $userLocation = $decodedValue->location;
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

                        $singlePage->date[$userDate]->uids[$userID] = (object)[];
                        $singlePage->date[$userDate]->uids[$userID]->location = $userLocation;
                        $singlePage->date[$userDate]->uids[$userID]->events = [];

                        array_push($singlePage->date[$userDate]->uids[$userID]->events, $eventInfo);

                    }

                } else {
                    $eventInfo = (object)[
                        'session' => $userSession,
                        'date' => $userDate,
                        'device' => json_encode($userDevice),
                        'event' => $userEvent,
                        'videoTime' => $userVideoTime,
                        'timestamp' => $userTimestamp,
                    ];

                    $singlePage->date[$userDate] = (object)[
                        'uids' => [
                            $userID => (object)[
                                'location' => $userLocation,
                                'events' => [$eventInfo]
                            ]
                        ]
                    ];

                }
            }

        }

        $videoPages[$pageDomain . '|' . $pageName . '|' . $videoName] = $singlePage;
    }

}
?>