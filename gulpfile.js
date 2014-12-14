var gulp = require('gulp');
var browserSync = require('browser-sync');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
var gulpIgnore = require('gulp-ignore');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var jsmin = require('gulp-jsmin');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var order = require('gulp-order');
var modernizr = require('gulp-modernizr');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './src'
        }
    });
});

gulp.task('browser-sync-reload', function() {
    browserSync.reload();
});

function getJsOrder() {
    return order([
        'String/String.js',
        'Game.js',
        'Game/Utils/**/*.js',
        'Game/Controller/Controller.js',
        'Game/ObjectiveManager/ObjectiveManager.js',
        'Game/ObjectiveManager/Objective/Objective.js',
        'Game/**/*.js'
    ]);
}

function getJS() {
    return [
        './src/js/**'
    ];
}

function getModernizrPath() {
    return './src/js/modernizr.js';
}

function getVendors() {
    return bowerFiles().concat([ getModernizrPath() ]);
}

gulp.task('modernizr', function() {
    return gulp.src(getJS())
        .pipe(modernizr())
        .pipe(gulp.dest('./src/js'));
});

gulp.task('compile-index', function() {
    return gulp.src('./src/index.html.tpl')
        .pipe(rename('index.html'))
        .pipe(inject(gulp.src(getVendors(), {read: false}), {name: 'bower', addRootSlash: false, ignorePath: 'src'}))
        .pipe(inject(gulp.src(getJS(), {read: false}).pipe(getJsOrder()), { addRootSlash: false, ignorePath: 'src' }))
        .pipe(gulp.dest('./src'));
});

gulp.task('serve-prepare', function(next) {
    runSequence('modernizr', 'compile-index', 'browser-sync', next);
});

gulp.task('serve', ['serve-prepare'], function() {
    gulp.watch('./src/**/*.js', ['compile-index', 'browser-sync-reload']);
    gulp.watch('./src/**/*.html', ['browser-sync-reload']);
});

gulp.task('dist-clean', function() {
    return gulp.src('./dist', {read: false})
        .pipe(clean());
});

gulp.task('dist-copy', function() {
    return gulp.src(['./src/**', '!.src/vendors', '!./src/vendors/**', '!./src/js/**'])
        .pipe(gulp.dest('./dist'));    
});

gulp.task('dist-prepare', function(next) {
    runSequence('dist-clean', 'dist-copy', next);
});

gulp.task('dist-js', function() {
    return gulp.src(getJS())
        .pipe(getJsOrder())
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('dist-js-inject', ['dist-js'], function() {
    return gulp.src('./index.html', {cwd: './dist'})
        .pipe(rename('index.html'))
        .pipe(inject(gulp.src('./scripts.min.js', {read: false, cwd: './dist'}), {name: 'dist', addRootSlash: false}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('dist-vendors', ['modernizr'], function() {
    return gulp.src(getVendors())
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('dist-vendors-inject', ['dist-vendors'], function() {
    return gulp.src('./index.html', {cwd: './dist'})
        .pipe(inject(gulp.src('./vendors.min.js', {read: false, cwd: './dist'}), {name: 'vendors', addRootSlash: false}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('dist-rename-index', function() {
    return gulp.src('./dist/index.html.tpl')
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('dist-compile-index', ['dist-rename-index'], function(next) {
    runSequence('dist-js-inject', 'dist-vendors-inject', next);
});

gulp.task('dist', function(next) {
    runSequence('dist-prepare', 'dist-compile-index', next);
});
