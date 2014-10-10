var gulp = require('gulp');
var serve = require('gulp-serve');
var watch = require('gulp-watch');
var connect = require('connect');
var livereload = require('gulp-livereload');

gulp.task('server', function(next) {
    var server = connect();

    server.use(connect.static('src', {default: 'index.html'})).listen(process.env.PORT || 3000, next);
});

gulp.task('serve', ['server'], function() {
    var server = livereload();

    livereload.listen();
    gulp.watch('src/**/*.*').on('change', function(file) {
        server.changed(file.path);
    });
});