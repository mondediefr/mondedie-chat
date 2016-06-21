'use strict';

var gulp = require('gulp');
var minify = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var size = require('gulp-size');
var concat = require('gulp-concat');
var bower = require('gulp-bower');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var filter = require('gulp-filter');
var autoprefixer = require('gulp-autoprefixer');
var rev = require('gulp-rev');
var sourcemaps = require('gulp-sourcemaps');
var inject = require('gulp-inject');
var del = require('del');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var livereload = require('gulp-livereload');

// ----------------------------
// Paths
// ----------------------------
var path = {
  bower: 'client/bower',
  js: 'client/js',
  fonts: 'client/fonts',
  npm: 'node_modules'
}

// ----------------------------
// Files
// ----------------------------
var files = {

  jshint: [
    'app.js', 'gulpfile.js', 'routes/*.js',
    'libs/*.js','models/*.js', 'client/js/**/*.js'
  ],

  js: [
    // dependJsFiles
    path.bower + '/jquery/dist/jquery.min.js',
    path.bower + '/tether/dist/js/tether.min.js',
    path.bower + '/bootstrap/dist/js/bootstrap.min.js',
    path.bower + '/mithril/mithril.min.js',
    path.bower + '/moment/min/moment.min.js',
    path.bower + '/jquery-textcomplete/dist/jquery.textcomplete.min.js',
    path.bower + '/slideout.js/dist/slideout.min.js',
    path.bower + '/visibilityjs/lib/visibility.core.js',
    path.bower + '/notify.js/notify.js',
    path.bower + '/moment/locale/fr.js',
    path.bower + '/bootstrap-markdown/js/bootstrap-markdown.js',
    path.bower + '/bootstrap-markdown/locale/bootstrap-markdown.fr.js',
    // appJsFiles
    path.js + '/app.js',
    path.js + '/mithril/third-party/*.js',
    path.js + '/mithril/models/*.js',
    path.js + '/mithril/views-models/*.js',
    path.js + '/mithril/controllers/*.js',
    path.js + '/mithril/views/*.js'
  ],

  css: [
    'client/scss/app.scss',
    path.bower + '/bootstrap-markdown/css/bootstrap-markdown.min.css',
    path.bower + '/font-awesome/css/font-awesome.min.css',
    path.npm + '/highlight.js/styles/github.css'
  ]
}

// ----------------------------
// Configuration
// ----------------------------
var option = {

  imagemin: {
    progressive: true,
    optimizationLevel: 7
  },

  size: {
    showFiles: true,
    showTotal: false
  },

  sass: {
    includePaths: [
      'client/bower/bootstrap/scss',
      'client/scss'
    ],
    outputStyle: 'expanded',
    precision: 6,
    sourceComments: false,
    sourceMap: false
  },

  autoprefixeur: {
    browsers: [
      'Chrome >= 35',
      'Firefox >= 38',
      'Edge >= 12',
      'Explorer >= 9',
      'iOS >= 8',
      'Safari >= 8',
      'Android 2.3',
      'Android >= 4',
      'Opera >= 12'
    ]
  }
}

// ----------------------------
// Gulp task definitions
// ----------------------------
gulp.task('default', function() {
  runSequence('bower', ['inject-css', 'inject-js', 'lint', 'fonts', 'emojione-strategy']);
});

gulp.task('bower', function() {
  return bower();
});

gulp.task('lint', function() {
  return gulp.src(files.jshint)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('fonts', function() {
  return gulp.src([path.bower + '/font-awesome/fonts/*', path.fonts + '/*'])
    .pipe(gulp.dest('public/fonts'));
});

gulp.task('emojione-strategy', function() {
  return gulp.src('node_modules/emojione/emoji_strategy.json')
    .pipe(gulp.dest('public/json'));
});

gulp.task('clean-js', function() {
  return del(['public/js/*']);
});

gulp.task('clean-css', function() {
  return del(['public/css/*']);
});

gulp.task('sass', ['clean-css'], function() {
  var sassFile = filter(['**', '!**/*.min.css'], {restore: true});
  return gulp.src(files.css)
    .pipe(sassFile)
    .pipe(plumber())
    .pipe(sass(option.sass))
    .pipe(plumber.stop())
    .pipe(autoprefixer(option.autoprefixer))
    .pipe(sassFile.restore)
    .pipe(minify({keepSpecialComments: 0}))
    .pipe(concat('app.min.css'))
    .pipe(rev())
    .pipe(size(option.size))
    .pipe(gulp.dest('public/css'));
});

gulp.task('js', ['clean-js'], function() {
  var unminified = filter(['**', '!**/*.min.js'], {restore: true});
  return gulp.src(files.js)
    .pipe(unminified)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(plumber.stop())
    .pipe(unminified.restore)
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(rev())
    .pipe(sourcemaps.write('.'))
    .pipe(size(option.size))
    .pipe(gulp.dest('public/js'));
});

gulp.task('inject-css', ['sass'], function() {
  return gulp.src('views/includes/assets/css.pug')
    .pipe(inject(gulp.src('public/css/app-*.min.css', {read: false}), {ignorePath:'public'}))
    .pipe(gulp.dest('views/includes/build'))
    .pipe(livereload());
});

gulp.task('inject-js', ['js'], function() {
  return gulp.src('views/includes/assets/javascript.pug')
    .pipe(inject(gulp.src('public/js/app-*.min.js', {read: false}), {ignorePath:'public'}))
    .pipe(gulp.dest('views/includes/build'))
    .pipe(livereload());
});

gulp.task('img', function() {
  return gulp.src('public/images/**/*')
    .pipe(imagemin(option.imagemin))
    .pipe(gulp.dest('public/images'));
});

gulp.task('watch', ['default'], function() {
  livereload.listen();
  gulp.watch(files.jshint, ['lint']);
  gulp.watch('client/js/**/*.js', ['inject-js']);
  gulp.watch('client/scss/**/*.scss', ['inject-css']);
});
