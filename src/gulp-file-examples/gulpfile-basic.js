// gulpfile.js
// basic gulpfile that takes a single js and css file, minifies, renames and sends them to the dist directory

var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	pump = require('pump'),
	cleanCSS = require('gulp-clean-css'),
	clean = require('gulp-clean');

gulp.task('cleanDir', function() {
    return gulp.src('dist/', {read: false})
        .pipe(clean());
});

gulp.task('process', function(cb) {
  pump([
        gulp.src('src/js/*.js'), // source files
        uglify(), // minify the script
        rename('example-min.js'), // rename the script
        gulp.dest('dist/js/') // destination for processed files
    ],
    cb
  );
});

gulp.task('minify-css', function() {
	return gulp.src('src/css/*.css') // source files
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename('example-min.css')) // rename the css files
    .pipe(gulp.dest('dist/css/')); // destination for processed files
});

// default gulp task
gulp.task('default', gulp.series('cleanDir', gulp.parallel('process', 'minify-css')));
//gulp.task('default', ['process', 'minify-css']); - old syntax for default task, changed for version 4

// run default task (all tasks) with: gulp
// run individual tasks with: gulp <task-name> for example, gulp cleanDir