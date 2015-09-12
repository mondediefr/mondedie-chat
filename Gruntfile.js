module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      lint: ['web.js', 'Gruntfile.js', 'routes/*.js']
    },

    bower: {
      options: {
        targetDir:'public/bower'
      },
      install: {}
    },

    uglify: {
      options: {
        banner:'/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
        separator:';'
      },
      compile: {
        files: {
          'public/javascripts/dest/scripts.min.js':[
            'public/bower/jquery/dist/jquery.min.js',
            'public/bower/pace/pace.min.js',
            'public/bower/bootstrap/dist/js/bootstrap.min.js',
            'public/javascripts/*.js'
          ]
        }
      }
    },

    cssmin: {
      compile: {
        files: {
          'public/stylesheets/dest/styles.min.css':[
            'public/bower/bootstrap/dist/css/bootstrap.min.css',
            'public/bower/pace/themes/blue/pace-theme-flash.css',
            'public/stylesheets/*.css'
          ]
        }
      }
    },

    watch: {
      lint: {
        files:['web.js', 'Gruntfile.js', 'routes/*.js'],
        tasks:['jshint:lint']
      },
      scripts: {
        files:['public/javascripts/*.js'],
        tasks:['uglify:compile']
      },
      styles: {
        files:['public/stylesheets/*.css'],
        tasks:['cssmin:compile']
      }
    }

  });

  // Tâche par défaut ( compilation automatique )
  grunt.registerTask('default', ['watch']);

  grunt.registerTask('run', [
    'jshint:lint',
    'bower:install',
    'uglify:compile',
    'cssmin:compile'
  ]);

  /* Tâche lancée lors du déploiement en prod
  grunt.registerTask('heroku:production', [
    'jshint:lint',
    'bower:install',
    'uglify:compile',
    'cssmin:compile'
  ]);
  */

};
