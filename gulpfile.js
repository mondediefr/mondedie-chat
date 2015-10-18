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

var jsPath  = 'public/javascripts/';

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

// ########################### ERROR ###########################

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// ########################### TASKS ###########################

gulp.task('default', ['sass', 'js-scripts', 'js-io.scripts', 'mithril-map', 'lint']);
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

gulp.task('sass', ['bower'], function() {
  var file = [
    'public/bower/bootstrap/dist/css/bootstrap.min.css',
    'public/scss/app.scss'
  ];
  var sassFile = filter(
    '*.scss',
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
  gulp.watch(appJsFiles, ['js-io.scripts']);
  gulp.watch('public/scss/**/*.scss', ['sass']);
});
