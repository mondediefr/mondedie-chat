var gulp = require('gulp'),
minifyCss = require('gulp-minify-css'),
uglify = require('gulp-uglify'),
size = require('gulp-size'),
concat = require('gulp-concat'),
bower = require('gulp-bower');

gulp.task('default', ['js-script', 'js-io.scripts', 'css'], function() {});

// All tasks
gulp.task('bower', function() {
  return bower();
});

gulp.task('js-script', ['bower'], function() {
  var fileJs = [
    'public/bower/jquery/dist/jquery.min.js',
    'public/bower/bootstrap/dist/js/bootstrap.min.js'
  ];
  return gulp.src(fileJs)
    .pipe(concat('scripts.min.js'))
    .pipe(size({title: "fichier scripts.min.js"}))
    .pipe(gulp.dest('public/javascripts/dest'));
});

gulp.task('js-io.scripts', function() {
  var fileJs = [
    'public/javascripts/chat.js'
  ];
  return gulp.src(fileJs)
    .pipe(uglify())
    .pipe(size({title: "fichier io.scripts.min.js"}))
    .pipe(gulp.dest('public/javascripts/dest'));
});

gulp.task('css', ['bower'], function() {
  var fileCss = [
    'public/bower/bootstrap/dist/css/bootstrap.min.css',
    'public/stylesheets/*.css'
  ];
  return gulp.src(fileCss)
    .pipe(minifyCss())
    .pipe(concat('styles.min.css'))
    .pipe(size({title: "fichier styles.min.css"}))
    .pipe(gulp.dest('public/stylesheets/dest'));
});

gulp.task('watch', function() {
  gulp.watch('public/javascripts/*.js', ['js-io.scripts'])
    .on('change', function(event){
      console.log('Le fichier ' + event.path + ' vient d\'être modifié');
  });
  gulp.watch('public/stylesheets/*.css', ['css'])
    .on('change', function(event){
      console.log('Le fichier ' + event.path + ' vient d\'être modifié');
  });
});


/*

jshint: {
  options: {
    jshintrc: '.jshintrc'
  },
  lint: ['web.js', 'Gruntfile.js', 'routes/*.js', 'libs/*.js', 'models/*.js']
},


watch: {
  lint: {
    files:['web.js', 'Gruntfile.js', 'routes/*.js', 'libs/*.js', 'models/*.js'],
    tasks:['jshint:lint']
  },

*/
