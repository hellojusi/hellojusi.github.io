/**
 * Require all the things!
 */
var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	gutil = require('gulp-util'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifyCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	browserSync = require('browser-sync'),
	cp = require('child_process');

/**
 * Set some path variables
 */
var base = './',
	src = base + '_dev',
	dist = base + 'assets',
	paths = {
		js: src + '/js/*.js',
		scss: [ src +'/sass/*.scss',
                src +'/sass/**/* .scss',
                src +'/sass/**/**/*.scss'],
        jekyll: ['index.html', '_posts/*', '_layouts/*', '_includes/*' , 'assets/*', 'assets/**/*', '*.md']
	};


/**
 * Compile sass to css
 */
gulp.task('compile-sass', function() {
	return gulp.src(paths.scss)
		.pipe(plumber((error) => {
	        gutil.log(gutil.colors.red(error.message));
	        gulp.task('compile-sass').emit('end');
	    }))
		.pipe(sass())
		.pipe(autoprefixer('last 3 versions', 'ie 9'))
		.pipe(minifyCSS())
		.pipe(rename( {dirname: dist + '/css', suffix: '.min'} ))
		.pipe(gulp.dest('./'))
		.pipe(browserSync.reload({stream:true}));
});

// 
// gulp.task('js', function() {
// 	return gulp.src(paths.js)
// 		.pipe()
// });

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify('Building Jekyll');
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        },
        host: "localhost"
    });
});

/**
 * Big Brother
 */
gulp.task('watch', function() {
  gulp.watch(paths.scss, ['compile-sass']);
  //gulp.watch(paths.js, ['js']);
  gulp.watch(paths.jekyll, ['jekyll-rebuild']);
});

gulp.task('default', function() {
    gulp.start('compile-sass', 'browser-sync', 'watch');
});