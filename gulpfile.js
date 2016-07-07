var gulp = require('gulp'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  cssmin = require('gulp-cssmin');

var files = ['client/styles/*.scss', 'node_modules/materialize-css/sass/materialize.scss'];

gulp.task('build-sass', function() {
  var tasks = files.map(function(element) {
    return gulp.src(element)
      .pipe(sass())
      .pipe(cssmin())
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest('client/styles'));
  })
});

gulp.task('copy-fonts', function() {
  gulp.src('node_modules/materialize-css/dist/font/**/*.{ttf,woff,woff2,eof,svg}')
    .pipe(gulp.dest('client/font/'));
});

gulp.task('default', ['build-sass', 'copy-fonts']);
