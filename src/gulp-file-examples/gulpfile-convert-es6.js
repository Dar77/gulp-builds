// gulpfile.js
// gulpfile that includes concat and minification of css files as listed in the html build comments,
// also copies the index.html into the dist directory with new min.css links.
// converts ES6 js code to ES5 js code with babel and webpack and minifies output

var gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    gulpIf = require('gulp-if'),
    cleanCSS = require('gulp-clean-css'),
    rename = require("gulp-rename"),
    webpack = require('webpack-stream'),
    size = require('gulp-size'),
    sourcemaps = require('gulp-sourcemaps'),
    clean = require('gulp-clean');


// clean the dist directory
gulp.task('cleanDist', function() {
    return gulp.src('dist/+(js|css|fonts|images|*.html)', {read: false})
    // if they exist it deletes the js, css, fonts, images directories and any html files
    .pipe(clean());
});

// clean the .tmp directory
gulp.task('cleanTmp', function() {
    return gulp.src('.tmp/+(js|scripts)', {read: false})
    // if they exist it deletes the js and scripts directories
    .pipe(clean());
});

// convert ES6 code to ES5 code and minify using babel and webpack
gulp.task('convertEs6', function() { //ref, stack overflow - https://github.com/google/web-starter-kit/issues/904
    return gulp.src('./src/es6/app.js')
    .pipe(webpack({
      output: {
        filename: '[name].js'
      },
      module: {
        rules: [
          {
            test: /\.js/,
            exclude: /(node_modules)/, // can include bower - (node_modules|bower_components)
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['env']
              }
            }
          }
        ]
      },
      devtool: '#inline-source-map'
    }))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(rename('app-min.js'))
    // Output files
    .pipe(size({title: 'js'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
    .pipe(gulp.dest('.tmp/js'))
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

//process css code listed within build/endbuild comments in index.html
gulp.task('useref', function(){
  return gulp.src('*.html') // takes the js/css files referenced in the html files
    .pipe(useref()) //concatenates them (they could even be in different folders)
    .pipe(gulpIf('*.css', cleanCSS({compatibility: 'ie8'}))) // minifies only if it's a css file
    .pipe(gulp.dest('dist')); // destination for processed css files
    // also copies across the index.html file with new 'src="js/app-min.js' and 'css/app.min.css' links.
});

// 'build' combined gulp task
gulp.task('build', gulp.series('cleanDist', 'cleanTmp', 'convertEs6', gulp.parallel('useref', 'fonts')));



// =============================================================================================================
// use to add plugins listed at top of file: npm install --save-dev <plugin-name-goes-here>

// npm install --save-dev gulp-babel babel-core babel-preset-env
// npm install --save-dev gulp-useref
// npm install --save-dev gulp-uglify
// npm install --save-dev gulp-if
// npm install --save-dev gulp-clean-css
// npm install --save-dev gulp-clean

// for babel es6 conversion task
// npm install --save-dev webpack-stream babel-loader babel-preset-env gulp-rename
// npm install --save-dev gulp-size
// npm install gulp-sourcemaps

// run build (combined task) with: gulp build
// run individual tasks with: gulp <task-name> for example, gulp cleanDir