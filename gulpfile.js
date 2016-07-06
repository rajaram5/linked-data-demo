var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')(),
  merge = require('merge-stream');

gulp.task('vendor', function() {
  var js = gulp.src('bower.json')
    .pipe(plugins.mainBowerFiles())
    .pipe(plugins.filter('**/*.js'))
    .pipe(plugins.concat('vendor.js'))
    .pipe(gulp.dest('build'));
  
  var css = gulp.src('bower_components/**/*.min.css')
    .pipe(plugins.concat('vendor.css'))
    .pipe(gulp.dest('build'));
  
  return merge(js, css);
});

gulp.task('js', function() {
  var html = gulp.src('demo/**/!(index)*.html')
    .pipe(plugins.angularTemplatecache({standalone: true}));
  
  var js = gulp.src('demo/**/*.js');
  
  return merge(js, html)
    .pipe(plugins.concat('demo.js'))
    .pipe(plugins.insert.wrap('(function(){"use strict";', '})();'))
    .pipe(plugins.ngAnnotate())
    .pipe(gulp.dest('build'))
    .pipe(plugins.connect.reload());
});

gulp.task('css', function() {
  return gulp.src('demo/**/*.css')
    .pipe(plugins.concat('demo.css'))
    .pipe(gulp.dest('build'))
    .pipe(plugins.connect.reload());
});

gulp.task('html', ['vendor', 'js', 'css'], function() {
  return gulp.src('demo/index.html')
    .pipe(plugins.inject(gulp.src(['build/vendor.@(css|js)', 'build/demo.@(css|js)'], {read: false}), {addRootSlash: false, ignorePath: 'build'}))
    .pipe(gulp.dest('build'))
    .pipe(plugins.connect.reload());
});

gulp.task('connect', function() {
  return plugins.connect.server({
    root: 'build',
    port: 9000,
    livereload: true
  });
});

gulp.task('watch', function() {
  gulp.watch('demo/**/*.js', ['js']);
  gulp.watch('demo/**/*.html', ['js']);
  gulp.watch('demo/**/*.css', ['css']);
  gulp.watch('demo/index.html', ['html']);
});

gulp.task('dist', ['vendor', 'js', 'css', 'html']);

gulp.task('default', ['dist', 'connect', 'watch']);