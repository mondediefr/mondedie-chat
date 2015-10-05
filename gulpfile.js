var gulp = require('gulp'),
minifyCss = require('gulp-minify-css'),
uglify = require('gulp-uglify'),
size = require('gulp-size'),
concat = require('gulp-concat'),
bower = require('gulp-bower'),
jshint = require('gulp-jshint');

var pathJs  = 'public/javascripts/';
var pathCss = 'public/stylesheets/';

var filesJshint = [
  'app.js', 'gulpfile.js', 'routes/*.js', 'libs/*.js',
  'models/*.js', pathJs + '*.js', pathJs + 'mithril/*.js',
  pathJs + 'mithril/**/*.js'
];

gulp.task('default', ['js-script', 'js-io.scripts', 'mithril-map', 'css', 'lint']);
gulp.task('heroku:production', ['default']);

gulp.task('bower', function() {
  return bower();
});

gulp.task('js-script', ['bower'], function() {
  var fileJs = [
    'public/bower/jquery/dist/jquery.min.js',
    'public/bower/bootstrap/dist/js/bootstrap.min.js',
    'public/bower/mithril/mithril.min.js'
  ];
  return gulp.src(fileJs)
    .pipe(concat('scripts.min.js'))
    .pipe(size({title: "fichier scripts.min.js"}))
    .pipe(gulp.dest(pathJs + 'dest'));
});

gulp.task('js-io.scripts', function() {
  var fileJs = [
    pathJs + 'app.js',
    pathJs + 'mithril/third-party/*.js',
    pathJs + 'mithril/models/*.js',
    pathJs + 'mithril/views-models/*.js',
    pathJs + 'mithril/controllers/*.js',
    pathJs + 'mithril/views/*.js',
  ];
  return gulp.src(fileJs)
    .pipe(uglify())
    .pipe(concat('io.scripts.min.js'))
    .pipe(size({title: "fichier io.scripts.min.js"}))
    .pipe(gulp.dest(pathJs + 'dest'));
});

gulp.task('mithril-map', ['bower'], function() {
  return gulp.src('public/bower/mithril/mithril.min.js.map')
    .pipe(gulp.dest(pathJs + 'dest'));
});

gulp.task('css', ['bower'], function() {
  var fileCss = [
    'public/bower/bootstrap/dist/css/bootstrap.min.css',
    pathCss + '*.css'
  ];
  return gulp.src(fileCss)
    .pipe(minifyCss())
    .pipe(concat('styles.min.css'))
    .pipe(size({title: "fichier styles.min.css"}))
    .pipe(gulp.dest(pathCss + 'dest'));
});

gulp.task('lint', function() {
  return gulp.src(filesJshint)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', ['default'], function() {
  gulp.watch(filesJshint, ['lint'])
    .on('change', function(event){
      console.log('Le fichier ' + event.path + ' vient d\'être modifié');
  });
  gulp.watch(pathJs + '*.js', ['js-io.scripts'])
    .on('change', function(event){
      console.log('Le fichier ' + event.path + ' vient d\'être modifié');
  });
  gulp.watch(pathCss + '*.css', ['css'])
    .on('change', function(event){
      console.log('Le fichier ' + event.path + ' vient d\'être modifié');
  });
});
