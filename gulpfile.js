var gulp = require('gulp');
var deploy = require('gulp-gh-pages');
var replace = require('gulp-replace');


gulp.task('deploy', function() {
	return gulp.src(["./app/**/*", "!./app/**/*.jpg", "!./app/**/*.png"])
		.pipe(replace('588036218022182','586301318195672'),
				{skipBinary: true})
		.pipe(deploy({branch: 'master'}))
});
