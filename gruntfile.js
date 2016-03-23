var pkgjson = require('./package.json');

var config = {
    pkg: pkgjson,
    app: 'app',
    dist: 'dist'
}

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-gh-pages') ;
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-build-control');

    grunt.initConfig({
        config: config,
        pkg: config.pkg,
        bower: grunt.file.readJSON('./.bowerrc'),
        clean: {
            dist: 'dist'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            grunt: {
                src: ['Gruntfile.js']
            },
            core: {
                src: [
                    '<%= config.app %>/app.js',
                    '<%= config.app %>/component/*.js',
                    '<%= config.app %>/flyer/*.js',
                    '<%= config.app %>/flyer-list/*.js',
                    '<%= config.app %>/lint/*.js',
                    '<%= config.app %>/schedule/*.js',
                ],
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/_lib/angular',
                    src: 'angular.js',
                    dest: '<%= config.dist %>'
                }]
            }
        },
        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: /588036218022182/g,
                            replacement: '586301318195672'
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: true, src:['app/app.js'], dest: 'build/'}

                ]
            }
        },
        buildcontrol: {
            options: {
                dir: 'dist',
                commit: true,
                push: true,
                message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
            },
            pages: {
                options: {
                    remote: 'git@github.com:coworkal/coworkal.github.io.git',
                    branch: 'master'
                }
            },
            local: {
                options: {
                    remote: '../',
                    branch: 'build'
                }
            }
        }
    });

    grunt.registerTask('default', [
        'clean',
        'copy',
        'uglify'
    ]);

    grunt.registerTask('build', [
        'clean',
        'copy',
        'replace',
        'buildcontrol:local'
    ]);
};


