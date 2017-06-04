module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
          src: "client/scripts/client.js",
          dest: "server/public/scripts/client.min.js"
         }
    },
    copy: {
      jquery: {
        expand: true,
        cwd: "node_modules/",
        src: ["jquery/dist/jquery.js"],
        dest: "server/public/vendors/"
      },
      pure: {
        expand: true,
        cwd: "node_modules/",
        src: ["purecss/build/base.css",
              "purecss/build/pure.css"],
        dest: "server/public/vendors/"
      },
      html: {
        expand: true,
        cwd: "client/views/",
        src: ["index.html"],
        dest: "server/public/views/"
      },
      css: {
        expand: true,
        cwd: "client/styles/",
        src: ["style.css"],
        dest: "server/public/views/"
      }
    },
    jsdoc : {
        dist : {
            src: "server/public/scripts/client.js",
            options: {
                destination: 'doc'
            }
        }
    },
    watch: {
      configFiles: {
        files: [ 'Gruntfile.js', 'config/*.js' ],
        options: {
          reload: true
        }
      },
      clientFiles: {
        files: ["client/scripts/*.js", "client/views/*.html"],
        tasks: ['uglify', 'copy']
      }
    }

  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('default', ['jsdoc']);
};
