var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')(),
  merge = require('merge-stream');

gulp.task('vendor', function() {
  var js = gulp.src('bower.json')
    .pipe(plugins.mainBowerFiles())
    .pipe(plugins.filter('**/*.js'))
    .pipe(plugins.using())
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
  
  var js = gulp.src('demo/**/*.js')
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
  
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
    .pipe(plugins.inject(gulp.src(['build/vendor.*', 'build/demo.*'], {read: false}), {addRootSlash: false, ignorePath: 'build'}))
    .pipe(gulp.dest('build'))
    .pipe(plugins.connect.reload());
});

gulp.task('resources', function() {
  var stream = merge();
  
  var fonts = gulp.src('bower_components/bootstrap/dist/fonts/**')
    .pipe(plugins.using())
    .pipe(gulp.dest('build/fonts'));
  stream.add(fonts);
  
  var data = gulp.src('demo/data/questions.json')
    .pipe(gulp.dest('build/data'));
  stream.add(data);
  
  var images = gulp.src('demo/images/**')
    .pipe(gulp.dest('build/images'));
  stream.add(images);
  
  var queries = gulp.src('sparqlQueries/*.sparql')
    .pipe(gulp.dest('build/data/query'));
  stream.add(queries);
  
  return stream
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
  gulp.watch('sparqlQueries/**', ['resources']);
});

gulp.task('dist', ['vendor', 'js', 'css', 'html', 'resources']);

gulp.task('default', ['dist', 'connect', 'watch']);