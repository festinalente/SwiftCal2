const sass = require('sass');
module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {
          'clientSideJS/calendar.js': [
            'preBundlingJS/*.css',
            'preBundlingJS/*.js'
          ]
        },
        options: {
          browserifyOptions: {
            entries: ['preBundlingJS/calendarGenerator.js'],
            standalone: 'calendar',
            debug: true
          },
          transform: [
            ['browserify-css', { 
              global: true, 
              autoInject: false
            }],
            ['babelify', {
              presets: [
                [
                  '@babel/preset-env'
                ]
              ]
            }]]
        }
      }
    },
    sass: {
      options: {
        implementation: sass,
        sourceMap: false
      },
      dist: {
        files: {
          'preBundlingJS/calendarApp.css': 'scss/calendarApp.scss',       
        }
      }
    },
    watch: {
      calendarCode: {
        files: [
          'preBundlingJS/*.js'
        ],
        tasks: ['browserify']
      },
      calendarStyle: {
        files: [
          'scss/*.scss'
        ],
        tasks: ['sass', 'browserify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
};
