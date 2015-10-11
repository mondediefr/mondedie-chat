"use strict";
var gulp   = require('gulp');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var size   = require('gulp-size');
var concat = require('gulp-concat');
var bower  = require('gulp-bower');
var jshint = require('gulp-jshint');

// ########################### PATHS ###########################

var jsPath  = 'public/javascripts/';
var cssPath = 'public/stylesheets/';

var jshintFiles = [
  'app.js', 'gulpfile.js', 'routes/*.js', 'libs/*.js',
  'models/*.js', jsPath + '*.js', jsPath + 'mithril/*.js',
  jsPath + 'mithril/**/*.js'
];

var dependJsFiles = [
  'public/bower/jquery/dist/jquery.min.js',
  'public/bower/bootstrap/dist/js/bootstrap.min.js',
  'public/bower/visibilityjs/lib/visibility.core.js',
  'public/bower/HTML5-Desktop-Notifications/desktop-notify-min.js',
  'public/bower/mithril/mithril.min.js'
];

var appJsFiles = [
  jsPath + 'app.js',
  jsPath + 'mithril/third-party/*.js',
  jsPath + 'mithril/models/*.js',
  jsPath + 'mithril/views-models/*.js',
  jsPath + 'mithril/controllers/*.js',
  jsPath + 'mithril/views/*.js',
];

var cssFiles = [
  'public/bower/bootstrap/dist/css/bootstrap.min.css',
  cssPath + '*.css'
];

// ########################### TASKS ###########################

gulp.task('default', ['js-scripts', 'js-io.scripts', 'mithril-map', 'css', 'lint']);
gulp.task('heroku:production', ['default']);

gulp.task('bower', function() {
  return bower();
});

gulp.task('js-scripts', ['bower'], function() {
  return gulp.src(dependJsFiles)
    .pipe(concat('scripts.min.js'))
    .pipe(size({title: "fichier scripts.min.js"}))
    .pipe(gulp.dest(jsPath + 'dest'));
});

gulp.task('js-io.scripts', function() {
  return gulp.src(appJsFiles)
    .pipe(uglify())
    .pipe(concat('io.scripts.min.js'))
    .pipe(size({title: "fichier io.scripts.min.js"}))
    .pipe(gulp.dest(jsPath + 'dest'));
});

gulp.task('mithril-map', ['bower'], function() {
  return gulp.src([
    'public/bower/mithril/mithril.js',
    'public/bower/mithril/mithril.min.js.map'
  ]).pipe(gulp.dest(jsPath + 'dest'));
});

gulp.task('css', ['bower'], function() {
  return gulp.src(cssFiles)
    .pipe(minify())
    .pipe(concat('styles.min.css'))
    .pipe(size({title: "fichier styles.min.css"}))
    .pipe(gulp.dest(cssPath + 'dest'));
});

gulp.task('lint', function() {
  return gulp.src(jshintFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', ['default'], function() {
  gulp.watch(jshintFiles, ['lint'])
    .on('change', function(event) {
      console.log("Le fichier " + event.path + " vient d'être modifié");
  });
  gulp.watch(appJsFiles, ['js-io.scripts'])
    .on('change', function(event) {
      console.log("Le fichier " + event.path + " vient d'être modifié");
  });
  gulp.watch(cssPath + '*.css', ['css'])
    .on('change', function(event) {
      console.log("Le fichier " + event.path + " vient d'être modifié");
  });
});
