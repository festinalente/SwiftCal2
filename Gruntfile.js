const sass = require('sass');
module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {
          'clientSideJS/calendar.js': [
            'preBundlingJS/calendarApp.css',
            'preBundlingJS/basicFunctions.js',
            'preBundlingJS/calendarGenerator.js',
            'preBundlingJS/dateOnClickEvents.js',
            'preBundlingJS/displayTimeChooserModal.js',
            'preBundlingJS/displayTimesOnDate.js',
            'preBundlingJS/domFunctions.js',
            'preBundlingJS/domGenerator.js',
            'preBundlingJS/erros.js',
            'preBundlingJS/languages.js',
            'preBundlingJS/styles.js'
          ]
        },
        options: {
          browserifyOptions: {
            entries: ['preBundlingJS/calendarGenerator.js'],
            standalone: 'calendar',
            debug: true
          },
          transform: [
            ['browserify-css', { global: true }],
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
}
