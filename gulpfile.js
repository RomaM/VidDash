const gulp = require('gulp'),
	  uglify = require('gulp-uglify'),
	  sass  = require('gulp-sass'),
	  prefixer = require('gulp-autoprefixer'),
	  cleanCSS = require('gulp-clean-css'),
	  changed = require ('gulp-changed');

var paths = {
	srcCSS: 'wp-content/themes/**/*.scss',
	distCSS: 'wp-content/themes/**/'
};

// ---- ONE TIME TASKS  ----
// - Run individually after making changes to the files in the specified src directories -


var sassOptions = {
	errLogToConsole: true
};
// ---- WATCH AT ALL TIME TASKS ----

/* - Run gulp watch in the command line to: 
		- watch any modifications made on *.php files from the src directory
		- minify the files and copy it to the page(build) directory
*/

gulp.task('css', function() {
	return (gulp.src(paths.srcCSS, { base: "./" })
		 .pipe(changed('.', {extension: '.css'}))
		 .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		 .pipe(gulp.dest('.'))
		 );
});

gulp.task('watch', function() {
	gulp.watch(paths.srcCSS, ['css']);
});

gulp.task('default', ['watch']);