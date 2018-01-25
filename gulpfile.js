// gulpfile.js
// gulpfile that includes concat and minification of css and js files as listed in the html build comments,
// also copies the index.html into the dist directory with new min.js and min.css links.
// includes a watch and auto browser reload for sass file changes with the 'watch' task.

var gulp = require('gulp'),
    sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    gulpIf = require('gulp-if'),
	cleanCSS = require('gulp-clean-css'),
    clean = require('gulp-clean'),
    browserSync = require('browser-sync').create();

// clean the dist directory
gulp.task('cleanDir', function() {
    return gulp.src('dist/+(js|css|scss|fonts|images|*.html)', {read: false})
    // if they exist it deletes the js, css, fonts, images directories and any html files
        .pipe(clean());
})

// auto refresh the browser - TODO - not working
//gulp.task('browserSync', function() {
//    browserSync.init({
//        server: {
//            proxy: 'localhost:8080/UDACITY/gulp-test/'
//            // using browser sync with xampp - ref: https://stackoverflow.com/questions/39897163/using-browsersync-with-xampp
//        }
//    })
//    gulp.watch(['index.html', 'src/css/**/*.css', 'src/js/**/*.js'], {cwd: './'}, reload);
//})


// compile sass to css
gulp.task('sass', function(){
  return gulp.src('src/scss/sample.scss')
    .pipe(sass().on('error', sass.logError)) // passes it through gulp-sass, logs errors to console
    .pipe(gulp.dest('src/css')) // place processed file in the css folder
    .pipe(browserSync.reload({
       stream: true
    }))
})

// watch sass files for changes, run the Sass preprocessor with the 'watch' task auto reloads browser
gulp.task('watch', gulp.series('sass', function() {
    browserSync.init({
        server: {
            proxy: 'localhost:8080/UDACITY/gulp-test/'
        }
    });

    gulp.watch('src/scss/*.scss', gulp.series('sass'));
}));

// copy images to dist directory (same technique could be used to copy any files across to dist)
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
  .pipe(gulp.dest('dist/images'))
})

// copy fonts to dist directory
gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

//process js and css code listed within build/endbuild comments in index.html
gulp.task('useref', function(){
  return gulp.src('*.html') // takes the js/css files referenced in the html files
    .pipe(useref()) //concatenates them (they could even be in different folders)
    .pipe(gulpIf('*.js', uglify())) // minifies only if it's a js file
    .pipe(gulpIf('*.css', cleanCSS({compatibility: 'ie8'}))) // minifies only if it's a css file
    .pipe(gulp.dest('dist')) // destination for processed js and css files
    // also copies across the index.html file with new 'src="js/main.min.js' and 'css/styles.min.css' links.
})

// 'build' combined gulp task
gulp.task('build', gulp.series('cleanDir', gulp.parallel('useref', 'fonts')));
//gulp.task('default', ['process', 'minify-css']); - old syntax for default task, changed for version 4

// use to add plugins listed at top of file: npm install --save-dev <plugin-name-goes-here>

// run build (combined task) with: gulp build
// run individual tasks with: gulp <task-name> for example, gulp cleanDir