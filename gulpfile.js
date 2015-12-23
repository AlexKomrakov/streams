var gulp       = require('gulp');
var concat     = require('gulp-concat');
var less       = require('gulp-less');
var livereload = require('gulp-livereload');
var del        = require('del');

var paths = {
  scripts: [
    'bower_components/angular/angular.min.js',
    'bower_components/angular-resource/angular-resource.min.js',
    'bower_components/angular-route/angular-route.min.js',
    'bower_components/angular-sanitize/angular-sanitize.min.js',
    'bower_components/ngstorage/ngStorage.min.js',
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/uikit/js/uikit.min.js',
    'bower_components/uikit/js/core/**/*.min.js',
    //'bower_components/uikit/js/components/**/*.min.js',
    'app/scripts/**/app.js',
    'app/scripts/**/*.js'
  ],
  styles: [
    'app/less/app.less'
  ],
  views: [
    'templates/**/*'
  ],
  fonts: [
    'bower_components/uikit/fonts/**/*'
  ]
};

gulp.task('clean', function() {
  return del(['build']);
});

gulp.task('fonts', function() {
  gulp.src(paths.fonts)
    .pipe(gulp.dest('public/fonts'));
});

gulp.task('views', function() {
  gulp.src(paths.views)
    .pipe(livereload());
});

gulp.task('styles', function() {
  gulp.src(paths.styles)
    .pipe(less())
    .pipe(concat('all.css'))
    .pipe(gulp.dest('public/css'))
    .pipe(livereload());
});

gulp.task('scripts', ['clean'], function() {
  return gulp.src(paths.scripts)
    .pipe(concat('all.js'))
    .pipe(gulp.dest('public/js'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.views, ['views']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'styles', 'fonts']);
