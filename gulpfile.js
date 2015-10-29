var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var cssmin = require('gulp-minify-css');
var htmlmin = require('gulp-minify-html');
var path = require('path');
var annotate = require('gulp-ng-annotate');
var nodemon = require('gulp-nodemon');
var Server = require('karma').Server;
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var paths = {
  css: './public/assets/**/*.css',
  js: './public/app/**/*.js',
  html: './public/app/views/*.html',
  anno: './public/js/annotated.min.js'
};

gulp.task('style', function() {
  return gulp.src(paths.css).
  pipe(concat('styles')).
  pipe(cssmin()).
  pipe(rename({
    suffix: '.min.css'
  })).
  pipe(gulp.dest('./public/assets/css'));
});

gulp.task('lint', function() {
  gulp.src('public/app/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('annotate', function() {
  return gulp.src(paths.js).
  pipe(concat('index')).
  pipe(annotate()).
  pipe(uglify()).
  pipe(rename({
    suffix: '.min.js'
  })).
  pipe(gulp.dest('./public/js'));
});

gulp.task('watch', function() {
  gulp.watch('public/app/**/*.js', ['lint', 'annotate']);
  gulp.watch('public/app/assets/**/*.js', ['style']);
});


gulp.task('nodemon', function() {
  nodemon({
      script: 'server.js',
      ext: 'js'
    })
    .on('restart', function() {
      console.log('server restarted!')
    });
});

// Run test
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
  }, done).start();
});

gulp.task('default', ['watch', 'style', 'nodemon']);
