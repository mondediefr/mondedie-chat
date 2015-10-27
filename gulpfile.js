var gulp = require('gulp');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var size = require('gulp-size');
var concat = require('gulp-concat');
var bower = require('gulp-bower');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var filter = require('gulp-filter');
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');
var runSequence = require('run-sequence');

// ########################### PATHS ###########################

var bowerPath = 'client/bower';
var jsPath = 'client/js';

var jshintFiles = [
  'app.js', 'gulpfile.js', 'routes/*.js', 'libs/*.js',
  'models/*.js', 'client/js/**/*.js'
];

var jsFiles = [
  // dependJsFiles
  bowerPath + '/jquery/dist/jquery.min.js',
  bowerPath + '/bootstrap/dist/js/bootstrap.min.js',
  bowerPath + '/visibilityjs/lib/visibility.core.js',
  bowerPath + '/HTML5-Desktop-Notifications/desktop-notify-min.js',
  bowerPath + '/bootstrap-markdown/js/bootstrap-markdown.js',
  bowerPath + '/bootstrap-markdown/locale/bootstrap-markdown.fr.js',
  bowerPath + '/mithril/mithril.min.js',
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
    bowerPath + '/font-awesome/css/font-awesome.min.css'
];

// ########################### ERROR ###########################

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// ########################### TASKS ###########################

gulp.task('default', ['sass', 'js', 'lint', 'fonts']);
gulp.task('heroku:production', ['default']);

gulp.task('bower', function() {
  return bower();
});

gulp.task('js', ['bower'], function() {
  var unminified = filter(
    ['**', '!**.min.js'],
    { restore: true }
  );
  return gulp.src(jsFiles)
    .pipe(unminified)
    .pipe(uglify())
    .pipe(unminified.restore)
    .pipe(concat('app.min.js'))
    .pipe(size({title: "fichier app.min.js"}))
    .pipe(gulp.dest('public/js'));
});

gulp.task('mithril-map', ['bower'], function() {
  return gulp.src([
    bowerPath + 'mithril/mithril.js',
    bowerPath + 'mithril/mithril.min.js.map'
  ]).pipe(gulp.dest('public/js'));
});

gulp.task('fonts', ['bower'], function() {
  return gulp.src([
    bowerPath + '/font-awesome/fonts/*',
  ]).pipe(gulp.dest('public/fonts'));
});

gulp.task('sass', ['bower'], function() {
  var sassFile = filter(
    ['**', '!**.min.css'],
    { restore: true }
  );
  return gulp.src(cssFiles)
    .pipe(sassFile)
    .pipe(sass({
      includePaths: [
        'client/bower/bootstrap/scss',
        'client/scss'
      ],
      outputStyle: 'expanded'
    })).on('error', handleError)
    .pipe(autoprefixer({
      browsers: [
        'Android 2.3',
        'Android >= 4',
        'Chrome >= 35',
        'Firefox >= 31',
        'Explorer >= 9',
        'iOS >= 7',
        'Opera >= 12',
        'Safari >= 7.1'
      ]
    }))
    .pipe(csscomb('client/bower/bootstrap/scss/.csscomb.json'))
    .pipe(sassFile.restore)
    .pipe(minify({keepSpecialComments: 0}))
    .pipe(concat('app.min.css'))
    .pipe(size({title: "fichier app.min.css"}))
    .pipe(gulp.dest('public/css'));
});

gulp.task('lint', function() {
  return gulp.src(jshintFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', ['default'], function() {
  gulp.watch(jshintFiles, ['lint']);
  gulp.watch('client/js/**/*.js', function() { runSequence('js') });
  gulp.watch('client/scss/**/*.scss', function() { runSequence('sass') });
});
