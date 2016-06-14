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

// ----------------------------
// Paths
// ----------------------------
var bowerPath = 'client/bower';
var jsPath = 'client/js';
var fontsPath = 'client/fonts';
var jshintFiles = [
  'app.js', 'gulpfile.js', 'routes/*.js', 'libs/*.js',
  'models/*.js', 'client/js/**/*.js'
];
var jsFiles = [
  // dependJsFiles
  bowerPath + '/jquery/dist/jquery.min.js',
  bowerPath + '/tether/dist/js/tether.min.js',
  bowerPath + '/bootstrap/dist/js/bootstrap.min.js',
  bowerPath + '/visibilityjs/lib/visibility.core.js',
  bowerPath + '/notify.js/notify.js',
  bowerPath + '/moment/min/moment.min.js',
  bowerPath + '/moment/locale/fr.js',
  bowerPath + '/bootstrap-markdown/js/bootstrap-markdown.js',
  bowerPath + '/bootstrap-markdown/locale/bootstrap-markdown.fr.js',
  bowerPath + '/jquery-textcomplete/dist/jquery.textcomplete.min.js',
  bowerPath + '/mithril/mithril.min.js',
  bowerPath + '/slideout.js/dist/slideout.min.js',
  // appJsFiles
  jsPath + '/app.js',
  jsPath + '/mithril/third-party/*.js',
  jsPath + '/mithril/models/*.js',
  jsPath + '/mithril/views-models/*.js',
  jsPath + '/mithril/controllers/*.js',
  jsPath + '/mithril/views/*.js'
];
var cssFiles = [
  'client/scss/app.scss',
  bowerPath + '/bootstrap-markdown/css/bootstrap-markdown.min.css',
  bowerPath + '/font-awesome/css/font-awesome.min.css',
  'node_modules/highlight.js/styles/github.css'
];

// ----------------------------
// Configuration
// ----------------------------
var optionAutoprefixer = {
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
};
var optionSass = {
  includePaths: [
    'client/bower/bootstrap/scss',
    'client/scss'
  ],
  outputStyle: 'expanded',
  precision: 6,
  sourceComments: false,
  sourceMap: false
};
var optionSize = {
  showFiles: true,
  showTotal: false
};

// ----------------------------
// Gulp task definitions
// ----------------------------
gulp.task('default', function() {
  runSequence('bower', ['inject-css', 'inject-js', 'lint', 'fonts', 'emojione-strategy']);
});

gulp.task('heroku:production', ['default']);

gulp.task('bower', function() {
  return bower();
});

gulp.task('lint', function() {
  return gulp.src(jshintFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('fonts', function() {
  return gulp.src([bowerPath + '/font-awesome/fonts/*', fontsPath + '/*'])
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
  return gulp.src(cssFiles)
    .pipe(sassFile)
    .pipe(plumber())
    .pipe(sass(optionSass))
    .pipe(plumber.stop())
    .pipe(autoprefixer(optionAutoprefixer))
    .pipe(sassFile.restore)
    .pipe(minify({keepSpecialComments: 0}))
    .pipe(concat('app.min.css'))
    .pipe(rev())
    .pipe(size(optionSize))
    .pipe(gulp.dest('public/css'));
});

gulp.task('js', ['clean-js'], function() {
  var unminified = filter(['**', '!**/*.min.js'], {restore: true});
  return gulp.src(jsFiles)
    .pipe(unminified)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(plumber.stop())
    .pipe(unminified.restore)
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(rev())
    .pipe(sourcemaps.write('.'))
    .pipe(size(optionSize))
    .pipe(gulp.dest('public/js'));
});

gulp.task('inject-css', ['sass'], function() {
  return gulp.src('views/includes/assets/css.pug')
    .pipe(inject(gulp.src('public/css/app-*.min.css', {read: false}), {ignorePath:'public'}))
    .pipe(gulp.dest('views/includes/build'));
});

gulp.task('inject-js', ['js'], function() {
  return gulp.src('views/includes/assets/javascript.pug')
    .pipe(inject(gulp.src('public/js/app-*.min.js', {read: false}), {ignorePath:'public'}))
    .pipe(gulp.dest('views/includes/build'));
});

gulp.task('watch', ['default'], function() {
  gulp.watch(jshintFiles, ['lint']);
  gulp.watch('client/js/**/*.js', ['inject-js']);
  gulp.watch('client/scss/**/*.scss', ['inject-css']);
});
