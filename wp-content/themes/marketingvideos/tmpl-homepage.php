<?php 
get_template_part( 'mobiledetect' ); 
$isMob = new Mobile_Detect;
$isMob =  $isMob->isMobile();
$bodydetectClass = ( $isMob )?"mob-l":"pc-l";
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">

<head>
<title>Gamma Tech and Groove Media Performance Marketing Solutions</title>

<meta name="description" content="Gamma Tech and Groove Media solutions delivers acquisition and  conversion services while focusing on Social media, paid digital media, search engine marketing, conversion rate optimization etc." />

<meta name="keywords" content="Gamma tech, Groove media, Performance marketing, Social Media, organic marketing, Conversion rate optimization, conversion services, paid digital media, Affiliate program strategy" />

<link rel="icon" type="image/x-icon" href="<?php echo get_template_directory_uri(); ?>/img/favicon.ico" sizes="16x16">
<link rel="icon" type="image/x-icon" href="<?php echo get_template_directory_uri(); ?>/img/favicon32.ico" sizes="32x32">
<link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/img/favicon.png" sizes="16x16">
<link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/img/favicon32.png" sizes="32x32">
<meta charset="<?php bloginfo( 'charset' ); ?>">
<?php if($isMob){ ?>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<?php }else{ ?>
<meta name="viewport" content="width=1100">
<?php } ?>
<script>
	var isMob = <?php echo ( $isMob )?"true":"false";?>;
</script>
<?php wp_head(); ?>
</head>

<body <?php body_class($bodydetectClass.' at-top'); ?>>
<div class="page-wrapper">
	<header class="fixed-nav">
		<div class="c-box header-nav-wrap">
			<?php if($isMob){ ?>
			<div class="mobile-header-nav">
				<div class="mobile-cursection-lbl">
					<span>&nbsp;</span>
				</div>
				<div class="mobile-menu-trigger">
					<hr /><hr /><hr />
				</div>
				<div class="mobile-nextsection-trigger">&nbsp;</div>
			</div>
			<?php } ?> 
			<nav class="header-nav">
				<ul>
					<?php
					$MenuListArg = array('posts_per_page' => -1,'post_type' => 'page','post_parent' => 2,
    					'meta_compare' => '!=','orderby' => 'menu_order','order' => 'DESC','meta_key' => 'page_menu_title','meta_value' => ' ');						
					$MenuList = new WP_Query( $MenuListArg );
					if ( $MenuList->have_posts() ) : while ( $MenuList->have_posts() ) : $MenuList->the_post(); ?>
					<li class="menu-item">
						<a href="#section-<?php echo get_the_ID();?>"><?php the_field('page_menu_title'); ?></a>
					</li>
					<?php endwhile; endif; wp_reset_query(); ?>
				</ul>
			</nav>
		</div>
	</header>
	<div class="sections-wrap">
	<?php
	$SectionListArg = array('posts_per_page' => -1,'post_type' => 'page','post_parent' => 2,'orderby' => 'menu_order','order' => 'DESC');						
	$SectionList = new WP_Query( $SectionListArg );
	if ( $SectionList->have_posts() ) : while ( $SectionList->have_posts() ) : $SectionList->the_post(); 
	$featuredImageMobileId = get_field('featured_image_mobile');
	if ($featuredImageMobileId && $isMob) {
		$sImgUrl = wp_get_attachment_image_src( $featuredImageMobileId, 'full');
	} else {
		$sImgUrl = wp_get_attachment_image_src( get_post_thumbnail_id(), 'full');
	}
	$postId = get_the_ID();?>
		<section id="section-<?php echo $postId;?>" class="c-section section-<?php echo $postId;?>">
			<div class="c-box">
				<div class="s-title">
					<?php the_title(); ?>
				</div>
				<div class="s-content-wrap">
					<?php if(!empty($sImgUrl)) { ?>
					<div class="s-mainimg">
						<img src="<?php echo $sImgUrl[0];?>">
					</div>
					<?php }	if ( !empty( get_the_content() ) ) { ?>
					<div class="s-content">
						<?php the_content();?>
					</div>
					<?php } ?>
				</div>
				<?php $galleryIds = get_field('photo_gallery');
				if ($galleryIds) { 
				$galleryIds = explode(",", $galleryIds);?>
				<div class="s-photogallery-wrap">
					<div class="s-photogallery-inner">
						<?php foreach($galleryIds as $key => $galleryId):	
						$galleryImgUrl = wp_get_attachment_image_src( $galleryId, 'full');?>
						<div class="photogallery-item">
							<div class="photogallery-image">
								<img src="<?php echo $galleryImgUrl[0];?>">	
							</div>	
							<?php 						
							$galleryImg = get_post($galleryId);
							$galleryImgCaption = $galleryImg->post_content; 
							if ( !empty( $galleryImgCaption ) ) {?>
							<div class="photogallery-caption">
								<?php echo $galleryImgCaption;?>
							</div>	
							<?php } ?>
						</div>	
						<?php endforeach; ?>	
					</div>	
				</div>	
				<?php }
				if ($postId == 30) {  
					$ChildListArg = array('posts_per_page' => 3,'post_type' => 'page','post_parent' => $postId,'orderby' => 'menu_order','order' => 'ASC',);						
					$ChildList = new WP_Query( $ChildListArg );
					if ( $ChildList->have_posts() ) { ?>
					<div class="s30-cols-wrap">
						<div class="s30-cols-block clearfix">
							<?php while ( $ChildList->have_posts() ) : $ChildList->the_post();
							$sImgUrl = wp_get_attachment_image_src( get_post_thumbnail_id(), 'full');?> 
							<div class="s30-col">
								<div class="s30-col-inner">
									<div class="s30-col-img">
										<img src="<?php echo $sImgUrl[0];?>">
									</div>
									<div class="s30-col-title">
										<?php the_title();?>
									</div>
									<div class="s30-col-content">
										<?php the_content();?>
									</div>
								</div>
							</div>
							<?php endwhile; ?> 
						</div>
					</div>
					<?php 
					}
					wp_reset_query();		
				}
				if ($postId == 58) {  
					$ChildListArg = array('posts_per_page' => -1,'post_type' => 'page','post_parent' => $postId,'orderby' => 'menu_order','order' => 'ASC',);						
					$ChildList = new WP_Query( $ChildListArg );
					if ( $ChildList->have_posts() ) { ?>
					<div class="s-photogallery-wrap">
						<div class="s-photogallery-inner s-video-block">
							<?php while ( $ChildList->have_posts() ) : $ChildList->the_post();
							$sImgUrl = wp_get_attachment_image_src( get_post_thumbnail_id(), 'full');
							if (get_field('video_link')) : ?> 
							<div class="photogallery-item">
								<div class="photogallery-video-block">
									<div class="photogallery-video">
										<video controls="controls" controlsList="nodownload" <?php if (!empty($sImgUrl)) echo 'poster="'.$sImgUrl[0].'"'?> >
											<source src="<?php the_field('video_link');?>" type="video/mp4">
										</video>
									</div>	
								</div>	
							</div>	
							<?php 
							endif;
							endwhile; 
							?> 
						</div>
					</div>
					<?php 
					}
					wp_reset_query();		
				}
				?>	
			</div>
		</section>
	<?php 
	endwhile; endif; wp_reset_query();?>
	</div>
	<?php
	wp_footer(); 
	?>
</div>
</body>
</html>
