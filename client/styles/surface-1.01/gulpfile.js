var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifyCss = require('gulp-minify-css'),

	src = {
		scss: './src/surface_styles.scss'
	},

	prod = {
		css: '../'
	};

gulp.task('compile-scss', function(){
	gulp.src(src.scss)
	.pipe(sass({
		errLogToConsole: true
	}))
	.pipe(autoprefixer({
		browsers: ['last 2 versions']
	}))
	.pipe(minifyCss())
	.pipe(gulp.dest(prod.css));
});

gulp.task('default', ['compile-scss']);