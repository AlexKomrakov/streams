var gulp = require('gulp');
//var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var less = require('gulp-less');
//var uglify = require('gulp-uglify');
//var imagemin = require('gulp-imagemin');
//var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var del = require('del');

var paths = {
    scripts: [
        'bower_components/angular/angular.min.js',
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/uikit/js/uikit.min.js',
        'bower_components/uikit/js/core/**/*.min.js',
        'bower_components/uikit/js/components/**/*.min.js'
    ],
    styles: [
        'resources/less/app.less'
    ],
    views: [
        'templates/**/*'
    ],
    fonts: [
        'bower_components/uikit/fonts/**/*'
    ]
};

//gulp.task('copy', ['clean'], function () {
//    return gulp.src(
//        [
//            'bower_components/angular/angular.min.js',
//            'bower_components/jquery/dist/jquery.min.js'
//        ], {
//        base: 'other'
//    }).pipe(gulp.dest('build'));
//});

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del(['build']);
});

gulp.task('fonts', function() {
    // You can use multiple globbing patterns as you would with `gulp.src`
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
        //.pipe(minifyCSS())
        .pipe(concat('all.css'))
        .pipe(gulp.dest('public/css'))
        .pipe(livereload());

    //.pipe(refresh(server))
});

gulp.task('scripts', ['clean'], function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(paths.scripts)
        //.pipe(sourcemaps.init())
            //.pipe(coffee())
            //.pipe(uglify())
            .pipe(concat('all.js'))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('public/js'))
        .pipe(livereload());
});

// Copy all static images
//gulp.task('images', ['clean'], function() {
//    return gulp.src(paths.images)
//        // Pass in options to the task
//        .pipe(imagemin({optimizationLevel: 5}))
//        .pipe(gulp.dest('build/img'));
//});

// Rerun the task when a file changes
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.views, ['views']);
    //gulp.watch(paths.images, ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'styles', 'fonts']);