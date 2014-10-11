var gulp = require('gulp');
var browserSync = require('browser-sync');

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

gulp.task('serve', ['browser-sync'], function() {
    gulp.watch(['**/*.js', '**/*.html'], ['browser-sync-reload'], {cwd: './src'});
});

