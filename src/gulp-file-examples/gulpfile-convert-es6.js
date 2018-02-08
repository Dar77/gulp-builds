// gulpfile.js
// gulpfile that includes concat and minification of css and js files as listed in the html build comments,
// also copies the index.html into the dist directory with new min.js and min.css links.
// converts ES6 js code to ES5 js code with babel

var gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    gulpIf = require('gulp-if'),
    cleanCSS = require('gulp-clean-css'),
    clean = require('gulp-clean');

// clean the dist directory
gulp.task('cleanDir', function() {
    return gulp.src('dist/+(js|css|fonts|images|*.html)', {read: false})
    // if they exist it deletes the js, css, fonts, images directories and any html files
    .pipe(clean());
});

// clean the src/js directory
gulp.task('cleanJs', function() {
    return gulp.src('src/+(js)', {read: false})
    // if they exist it deletes the js directory
    .pipe(clean());
});

//gulp babel - convert ES6 code to ES5 code
gulp.task('convertEs6', function() {
  return gulp.src('src/es6/app.js')
  .pipe(babel({
    presets: ['env']
  }))
  .pipe(gulp.dest('src/js'));
});

// copy images to dist directory (same technique could be used to copy any files across to dist)
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
  .pipe(gulp.dest('dist/images'));
});

// copy fonts to dist directory
gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'));
});

//process js and css code listed within build/endbuild comments in index.html
gulp.task('useref', function(){
  return gulp.src('*.html') // takes the js/css files referenced in the html files
    .pipe(useref()) //concatenates them (they could even be in different folders)
    .pipe(gulpIf('*.js', uglify())) // minifies only if it's a js file
    .pipe(gulpIf('*.css', cleanCSS({compatibility: 'ie8'}))) // minifies only if it's a css file
    .pipe(gulp.dest('dist')); // destination for processed js and css files
    // also copies across the index.html file with new 'src="js/app.min.js' and 'css/app.min.css' links.
});

// 'build' combined gulp task
gulp.task('build', gulp.series('cleanDir', 'cleanJs', 'convertEs6', gulp.parallel('useref', 'fonts')));






// use to add plugins listed at top of file: npm install --save-dev <plugin-name-goes-here>

// npm install --save-dev gulp-babel babel-core babel-preset-env
// npm install --save-dev gulp-useref
// npm install --save-dev gulp-uglify
// npm install --save-dev gulp-if
// npm install --save-dev gulp-clean-css
// npm install --save-dev gulp-clean

// run build (combined task) with: gulp build
// run individual tasks with: gulp <task-name> for example, gulp cleanDir