var gulp   = require('gulp');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var size   = require('gulp-size');
var concat = require('gulp-concat');
var bower  = require('gulp-bower');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var filter = require('gulp-filter');
var autoprefixer = require('gulp-autoprefixer');

// ########################### PATHS ###########################

var jsPath  = 'client/js/';
var bowerPath = 'client/bower/';

var jshintFiles = [
  'app.js', 'gulpfile.js', 'routes/*.js', 'libs/*.js',
  'models/*.js', jsPath + '*.js', jsPath + 'mithril/**/*.js'
];

var jsFilesWatch = [
  jsPath + 'app.js',
  jsPath + 'mithril/third-party/*.js',
  jsPath + 'mithril/models/*.js',
  jsPath + 'mithril/views-models/*.js',
  jsPath + 'mithril/controllers/*.js',
  jsPath + 'mithril/views/*.js'
];

var JsFiles = [
  // dependJsFiles
  bowerPath + 'jquery/dist/jquery.min.js',
  bowerPath + 'bootstrap/dist/js/bootstrap.min.js',
  bowerPath + 'visibilityjs/lib/visibility.core.js',
  bowerPath + 'HTML5-Desktop-Notifications/desktop-notify-min.js',
  bowerPath + 'mithril/mithril.min.js',
  // appJsFiles
  jsPath + 'app.js',
  jsPath + 'mithril/third-party/*.js',
  jsPath + 'mithril/models/*.js',
  jsPath + 'mithril/views-models/*.js',
  jsPath + 'mithril/controllers/*.js',
  jsPath + 'mithril/views/*.js'
];

// ########################### ERROR ###########################

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// ########################### TASKS ###########################

gulp.task('default', ['sass', 'js', 'lint']);
gulp.task('heroku:production', ['default']);

gulp.task('bower', function() {
  return bower();
});

gulp.task('js', ['bower'], function() {
  return gulp.src(JsFiles)
    .pipe(uglify())
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

gulp.task('sass', ['bower'], function() {
  var file = [
    bowerPath + 'bootstrap/dist/css/bootstrap.min.css',
    'client/scss/app.scss'
  ];
  var sassFile = filter(
    'app.scss',
    {restore: true}
  );
  return gulp.src(file)
    .pipe(sassFile)
    .pipe(sass({outputStyle: 'expanded'})).on('error', handleError)
    .pipe(sassFile.restore)
    .pipe(autoprefixer({
      browsers: ['> 1%'],
      cascade: true
    }))
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
  gulp.watch(jsFilesWatch, ['js']);
  gulp.watch('client/scss/**/*.scss', ['sass']);
});
