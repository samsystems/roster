'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths for the application
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        dist: 'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        inventory: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= inventory.app %>/src/{,*/,modules/*/controllers/,modules/*/services/,modules/*/wizards/}*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: '<%= connect.options.livereload %>',
                    spawn: false
                }
            },
            html: {
                files: ['<%= inventory.app %>/src/{,*/,modules/*/views/,data/*/}*.html'],
                options: {
                    livereload: '<%= connect.options.livereload %>',
                    spawn: false
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            styles: {
                files: ['<%= inventory.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= inventory.app %>/{,*/,modules/*/views/,data/*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= inventory.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        includeSource: {
            options: {
                basePath: 'app',
                baseUrl: '/'
            },
            server: {
                files: {
                    '.tmp/index.html': '<%= inventory.app %>/index.html'
                }
            },
            dist: {
                files: {
                    '<%= inventory.dist %>/index.html': '<%= inventory.app %>/index.html'
                }
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect.static(appConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            connect.static('.tmp'),
                            connect.static('test'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect.static(appConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= inventory.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= inventory.app %>/src/{,*/,modules/*/controllers/,modules/*/filters/,modules/*/models/,modules/*/services/,modules/*/providers/,modules/*/directives/}*.js'
                ]
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        po2json_angular_translate: {
            dev: {
                options: {
                    pretty: false,
                    cleanPrevStrings: false
                },
                files: {
                    '<%= inventory.app %>/src/i18n/en_US.json' : [
                        '<%= inventory.app %>/src/modules/patient/i18n/*.po'
                    ]
                }
            },
            dist: {
                options: {
                    pretty: false,
                    cleanPrevStrings: true
                },
                files: {
                    '<%= inventory.dist %>/src/i18n/en_US.json' : [
                        '<%= inventory.app %>/src/modules/patient/i18n/*.po'
                    ]
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= inventory.dist %>/{,*/}*',
                        '!<%= inventory.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= inventory.app %>/index.html', '<%= inventory.app %>/src/modules/common/views/print.html'],
                ignorePath:  /\.\.\//
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= inventory.dist %>/src/{,*/}*.js',
                    '<%= inventory.dist %>/styles/{,*/}*.css'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= inventory.app %>/index.html',
            options: {
                dest: '<%= inventory.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= inventory.dist %>/{,*/,src/modules/common/views/}*.html'],
            css: ['<%= inventory.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= inventory.dist %>','<%= inventory.dist %>/images']
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= inventory.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= inventory.dist %>/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= inventory.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= inventory.dist %>/images'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: false,
                    conservativeCollapse: false,
                    collapseBooleanAttributes: false,
                    removeCommentsFromCDATA: false,
                    removeOptionalTags: false
                },
                files: [{
                    expand: true,
                    cwd: '<%= inventory.dist %>',
                    src: ['*.html', 'modules/*/views/{,*/}*.html', 'data/*/*.html'],
                    dest: '<%= inventory.dist %>'
                }]
            }
        },

        // ngmin tries to make the code safe for minification automatically by
        // using the Angular long form for dependency injection. It doesn't work on
        // things like resolve or inject so those have to be done manually.
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/src',
                    src: '*.js',
                    dest: '.tmp/concat/src'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= inventory.app %>',
                    dest: '<%= inventory.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '*.html',
                        'src/data/*/{,forms/,messages/,templates/}*.html',
                        'src/modules/*/views/*.html',
                        'images/{,*/}*.{webp}',
                        'fonts/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= inventory.dist %>/images',
                    src: ['generated/*']
                },
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap/dist',
                        src: 'fonts/*',
                        dest: '<%= inventory.dist %>'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/font-awesome',
                        src: 'fonts/*',
                        dest: '<%= inventory.dist %>'
                    }]
            },
            styles: {
                expand: true,
                cwd: '<%= inventory.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        }
    });


    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'wiredep',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'includeSource:dist',
        'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'ngmin',
        'copy:dist',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin',
        'po2json_angular_translate'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
};