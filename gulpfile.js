var gulp = require('gulp');
var browserSync = require('browser-sync');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');


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

function getJS() {
    return gulp.src('./js/**/*.js', {read: false, cwd: './src'});
}

function getVendors() {
    console.log(bowerFiles());
    return gulp.src(bowerFiles(), {read: false, cwd: './src'});
}

gulp.task('inject', function() {
    var target = gulp.src('./index.html', {cwd: './src'});

    return target
        .pipe(inject(getVendors(), {name: 'bower'}))
        .pipe(inject(getJS()))
        .pipe(gulp.dest('./src'));
});

gulp.task('serve', ['inject', 'browser-sync'], function() {
    gulp.watch('./src/**/*.js', ['inject', 'browser-sync-reload']);
    gulp.watch('./src/**/*.html', ['browser-sync-reload']);
});

