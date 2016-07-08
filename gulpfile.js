var gulp = require('gulp'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  cssmin = require('gulp-cssmin');

var files = ['client/styles/*.scss', 'node_modules/materialize-css/sass/materialize.scss'];

gulp.task('build-sass', function() {

  return gulp.src('client/styles/*.scss')
    .pipe(sass())
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('client/styles'));

});
gulp.task('default', ['build-sass']);
