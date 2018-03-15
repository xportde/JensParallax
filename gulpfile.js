var	gulp     = require('gulp')
  , babel    = require('gulp-babel')
  , concat   = require('gulp-concat')
  , cleanCSS = require('gulp-clean-css')
  , uglify   = require('gulp-uglify')
  , plumber  = require('gulp-plumber')
  , using    = require('gulp-using')
  // Define some individual deploy params
  , src_dir       = 'src/'
  , dist_dir      = 'dist/'
  , dist_js_file  = 'jquery.JensParallax.min.js'
  , dist_css_file = 'jquery.JensParallax.min.css'
  // Package options
  , using_options_processing = { prefix: 'Processing', path: 'cwd', filesize: true }
  , using_options_merging    = { prefix: 'Merging to', path: 'cwd', filesize: true }
  , using_options_cleaning   = { prefix: 'Cleaning',   path: 'cwd', filesize: true }

	/**
	 * Error handling function for plumber package
	 */
	, plumber_handle_err = function(err) {
		console.log(err);
		this.emit('end');
	};

/**
 * Deploy JS files
 */
gulp.task('deploy-js', function() {
	// First concat all js files together and compile babel
	var stream = gulp
		.src([src_dir + 'jensparallax.js'])
		.pipe(plumber({ plumber_handle_err }))
		.pipe(using(using_options_processing))
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(concat(dist_js_file));

	// After uglifying save into dest-directory
	return stream
		.pipe(using(using_options_merging))
		.pipe(gulp.dest(dist_dir))
		.pipe(uglify({preserveComments: 'license'}))
		.pipe(gulp.dest(dist_dir))
		.pipe(using(using_options_cleaning));
});

/**
 * Deploy CSS files
 */
gulp.task('deploy-css', function() {
	// First concat all less files together and compile less
	var stream = gulp
		.src([src_dir + 'jensparallax.css'])
		.pipe(plumber({ plumber_handle_err }))
		.pipe(using(using_options_processing))
		.pipe(concat(dist_css_file));

	// After css cleaning save into dist-directory
	return stream
		.pipe(using(using_options_merging))
		.pipe(gulp.dest(dist_dir))
		.pipe(cleanCSS())
		.pipe(gulp.dest(dist_dir))
		.pipe(using(using_options_cleaning));
});

/**
 * Watcher
 */
gulp.task('watch', function() {
	gulp.watch(src_dir + '*.css', [ 'deploy-css' ]);
	gulp.watch(src_dir + '*.js', [ 'deploy-js' ]);
});
