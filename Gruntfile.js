
/* HINTS
 *  - https://github.com/Frederikam/Screeps/blob/master/gruntfile.js
 */

const credentials = require('./screeps-credentials')

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-screeps')

  grunt.initConfig({
    screeps: {
      options: {
        email: credentials.email,
        password: credentials.password,
        branch: 'develop',
        ptr: false,
      },
      dist: {
        //
        src: ['game/*.js'],
      },
    },
  })
}
