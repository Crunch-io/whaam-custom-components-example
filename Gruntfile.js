module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            serve: {
                options : {
                    port: 8001,
                    base: 'app',
                    middleware : function(connect, options, middlewares) {
                        var corsMiddleware = require('cors')()

                        middlewares.unshift(corsMiddleware)

                        return middlewares
                    },
                    keepalive : true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('default', 'connect:serve');

};
