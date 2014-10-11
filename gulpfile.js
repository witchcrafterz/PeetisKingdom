var gulp = require('gulp');
var browserSync = require('browser-sync');
var inject = require('gulp-inject');

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

gulp.task('js', function() {
    var target = gulp.src('./index.html', {cwd: './src'});

    var sources = gulp.src('./js/**/*.js', {read: false, cwd: './src'});

    return target.pipe(inject(sources)).pipe(gulp.dest('./src'));

});

gulp.task('serve', ['browser-sync'], function() {
    gulp.watch('./src/**/*.js', ['js', 'browser-sync-reload']);
    gulp.watch('./src/**/*.html', ['browser-sync-reload']);
});

