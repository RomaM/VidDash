<?php
/**
 * The template for displaying all single posts and attachments
 *
 * @package WordPress
 * @subpackage Twenty_Fifteen
 * @since Twenty Fifteen 1.0
 */
get_header();
?>

<?php while ( have_posts() ) : the_post();
	if (has_term('VideoEvents','category',null)==1) : ?>

	<header class="header">
		<h1 class="header__title">Statistics for page <span><?php echo the_title();?></span></h1>
	</header>
	<main class="content">
		<section class="details">
        <?php the_content();?>
		</section>
		<section class="user-statistics">

		</section>
	</main>
	<footer class="footer">
		<small class="footer__copyright">Copyright &copy; <?php echo date('Y');?> Video Events</small>
	</footer>

	<?php else :
			the_title();
			the_content();
	endif;
endwhile;
?>
