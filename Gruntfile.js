'use strict';

var files = {
    js: [
        'Gruntfile.js',
        'js/*.js',
        '!js/desktop-adapter.js',
        '!js/geometry.js'

    ],

    jshint: [
        'Gruntfile.js',
        'js/*.js',
        '!js/desktop-adapter.js',
        '!js/geometry.js'
    ],

    scss: [
        '**/*.{scss,sass}'
    ],

    html: [
        '*.html',
    ]
};

module.exports = function(grunt) {
    var target = grunt.option('target') || 'http://localhost:9000';
    //load all npm tasks automagically
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        paths: {
            build: 'build'
        },

        watch: {
            js: {
                files: ['js/*.js'],
                tasks: ['jsbeautifier', 'jshint', 'docco'],
                options: {
                    livereload: true
                }
            },
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['jsbeautifier']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: ['js/*.js', '*.html', 'views/*.html', 'css/*.css']
            }

        },

        jshint: {
            files: files.jshint,
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            }
        },

        concurrent: {
            server: [
                'sass'
            ]
        },

        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'build/styles/',
                    src: '{,*/}*.css',
                    dest: 'build/styles/'
                }]
            }
        },
        jsbeautifier: {
            files: files.js,
            options: {
                js: {
                    braceStyle: 'collapse',
                    breakChainedMethods: false,
                    e4x: false,
                    evalCode: false,
                    indentChar: ' ',
                    indentLevel: 0,
                    indentSize: 4,
                    indentWithTabs: false,
                    jslintHappy: false,
                    keepArrayIndentation: false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    spaceBeforeConditional: true,
                    spaceInParen: false,
                    unescapeStrings: false,
                    wrapLineLength: 0
                }
            }
        },
        prettify: {
            options: {
                'indent': 4,
                'indent_char': ' ',
                'indent_scripts': 'normal',
                'wrap_line_length': 0,
                'brace_style': 'collapse',
                'preserve_newlines': true,
                'max_preserve_newlines': 1,
                'unformatted': [
                    'a',
                    'code',
                    'pre',
                    'span'
                ]
            },
            rootViews: {
                expand: true,
                cwd: 'examples/dev/',
                ext: '.html',
                src: ['*.html'],
                dest: 'examples/dev/'
            }
        },

        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: '0.0.0.0',
                livereload: 35730
            },
            livereload: {}
        },
        docco: {
            debug: {
                src: ['js/tearout.js', 'js/drop-target.js'],
                options: {
                    output: 'docs/'
                }
            }
        },
        openfin: {
            options: {
                open: true,
                configPath: target + '/app.json',
                config: {
                    create: true,
                    filePath: 'app.json',
                    options: {
                        startup_app: {
                            name: 'Tear-out-demo ',
                            url: target + '/index.html',
                        },
                        runtime: {
                            version: "alpha"
                        }
                    }
                }
            },
            serve: {
                options: {
                    open: true
                }
            },
            build: {
                options: {
                    open: false
                }
            }
        }
    });

    grunt.registerTask('default', function() {
        return grunt.task.run([
            'connect:livereload',
            'openfin:serve',
            'watch'
        ]);
    });

    grunt.registerTask('docs', ['docco']);
};
