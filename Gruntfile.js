/*jshint node:true, es3:false*/
var grunt = require('grunt');
var AWS_CONFIG = grunt.file.readJSON('OathKeeper/frontend/aws.json');
// var lrSnippet = require('connect-livereload')();

function mountFolder(connect, dir) {
    return connect.static(require('path').resolve(dir));
}

module.exports = function(grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        paths: {
            app: 'app',
            tmp: '.tmp',
            dist: 'dist',
            sass: 'app/styles',
            css: '.tmp/styles',
            js: 'app/scripts',
            deploy: 'deploy'
        },
        clean: {
            all: ['<%= paths.tmp %>', '<%= paths.dist %>'],
            tmp: ['<%= paths.tmp %>']
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                '<%= paths.app %>/scripts/**/*.js',
                '!<%= paths.app %>/scripts/vendor/**/*'
            ]
        },

        compass: {
            options: {
                importPath: '<%= paths.app %>/bower_components',
                sassDir: '<%= paths.sass %>',
                cssDir: '<%= paths.css %>',
                imagesDir: '<%= paths.app %>/images',
                generatedImagesDir: '<%= paths.tmp %>/images',
                httpImagesPath: '../images',
                httpGeneratedImagesPath: '../images',
            },
            dev: {
                options: {
                    assetCacheBuster: true
                }
            },
            dist: {
                options: {
                    assetCacheBuster: false
                }
            }
        },

        connect: {
            options: {
                port: 9000,
                hostname: '*'
            },
            dev: {
                options: {
                    // livereload: 35722,
                    middleware: function(connect, options) {
                        return [
                            // _utils.fakeDataMiddleware,
                            mountFolder(connect, grunt.config('paths.tmp')),
                            mountFolder(connect, grunt.config('paths.app'))
                        ];
                    },
                    open: true,
                    useAvailablePort: true
                }
            }
        },

        watch: {
            compass: {
                files: ['<%= paths.sass %>/**/*.scss'],
                tasks: ['compass:dev']
            },
            livereload: {
                options: {
                    livereload: 35722
                },
                files: [
                    '<%= paths.app %>/templates/**/*.html',
                    '<%= paths.css %>/*.css',
                    '<%= paths.js %>/**/*.js'
                ]
            }
        },

        useminPrepare: {
            options: {
                dest: '<%= paths.dist %>',
                root: '<%= paths.tmp %>'
            },
            dist: {
                src: ['<%= paths.tmp %>/templates/**/index.html']
            }
            // html: ['<%= paths.tmp %>/templates/**/index.html']
        },

        copy: { // a little bit verbose
            image: {
                expand: true,
                cwd: '<%= paths.app %>/images/',
                src: ['*'],
                filter: 'isFile',
                dest: '<%= paths.tmp %>/images/'
            },
            bower: {
                expand: true,
                cwd: '<%= paths.app %>/bower_components/',
                src: ['**/*'],
                dest: '<%= paths.tmp %>/bower_components/'
            },
            html: {
                expand: true,
                cwd: '<%= paths.app %>/templates/',
                src: ['**/*.html'],
                dest: '<%= paths.tmp %>/templates/'
            },
            htmlDist: {
                expand: true,
                cwd: '<%= paths.tmp %>/templates/',
                src: ['**/*.html'],
                dest: '<%= paths.dist %>/templates/'
            },
            imageDist: {
                expand: true,
                cwd: '<%= paths.tmp %>/images/',
                src: ['*'],
                filter: 'isFile',
                dest: '<%= paths.dist %>/images/'
            },
            fontDist: {
                expand: true,
                cwd: '<%= paths.app %>/font/',
                src: ['*'],
                filter: 'isFile',
                dest: '<%= paths.dist %>/font/'
            }
        },

        imagemin: {
            static: {
                expand: true,
                cwd: '<%= paths.tmp %>/images/',
                src: ['*'],
                dest: '<%= paths.dist %>/images/'
            }
        },

        filerev: {
            assets: {
                src: [
                    '<%= paths.dist %>/**/*',
                    '!<%= paths.dist %>/templates/**/*'
                ],
                filter: 'isFile'
            }
        },

        usemin: {
            options: {
                assetsDirs: [
                    '<%= paths.dist %>/'
                ]
            },
            html: '<%= paths.dist %>/templates/**/index.html',
            css: '<%= paths.dist %>/styles/*.css'
        },

        uglify: {
            options: {
                preserveComments: 'some'
            },
            dist: {
                expand: true,
                cwd: '<%= paths.tmp %>/scripts/',
                src: ['**/index.js'],
                dest: '<%= paths.dist %>/scripts/'
            }
        },

        requirejs: {
            options: {
                appDir: '<%= paths.app %>/scripts',
                baseUrl: './',
                dir: '<%= paths.tmp %>/scripts',
                mainConfigFile: '<%= paths.app %>/scripts/config.js',
                optimize: 'none'
            },
            dist: {
                options: {
                    // modules: _utils.RequireModules,
                    almond: true
                    // replaceRequireScript: _utils.RequireReplaceModules
                }
            }
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: '<%= paths.tmp %>/styles/',
                src: ['*.css', '!*.min.css'],
                dest: '<%= paths.dist %>/styles/',
                ext: '.css',
                report: true
            }
        },

        'sftp-deploy': {
            test47: {
                auth: {
                    host: '192.168.100.47',
                    port: 22,
                    authKey: 'test47'
                },
                src: '<%= paths.dist %>',
                dest: '/home/work/devcenter',
                server_sep: '/'
            }
        },

        removelogging: {
            dist: {
                src: "<%= paths.tmp %>/scripts/**/*.js"
            }
        },

        replace: {
            deploy: {
                options: {
                    patterns: [{
                        match: /test.wandoujia.com/g,
                        replacement: 'open.wandoujia.com'
                    }, {
                        match: /src="\/scripts/g,
                        replacement: 'src="http://static.wdjimg.com/devcenter/scripts'
                    }, {
                        match: /href="\/styles/g,
                        replacement: 'href="http://static.wdjimg.com/devcenter/styles'
                    }, {
                        match: /<!-- GA_PARTIAL -->/,
                        replacement: '<%= grunt.file.read("ga_partial.html") %>'
                    }],
                    force: true
                },
                files: [{
                    expand: true,
                    src: ['<%= paths.dist %>/scripts/**/*.js', '<%= paths.dist %>/templates/**/index.html', ],
                    dest: '.'
                }]
            },
            test: {
                options: {
                    patterns: [{
                        match: /open.wandoujia.com/g,
                        replacement: 'test.wandoujia.com'
                    }, {
                        match: /<!-- GA_PARTIAL -->/,
                        replacement: '<%= grunt.file.read("ga_partial.html") %>'
                    }],
                    force: true
                },
                files: [{
                    expand: true,
                    src: ['<%= paths.dist %>/scripts/**/*.js', '<%= paths.dist %>/templates/**/index.html', ],
                    dest: '.'
                }]
            },
            home: {
                options: {
                    patterns: [{
                        match: /<!-- FRAMEWORK_PARTIAL -->/,
                        replacement: '<%= grunt.file.read("framework_partial.html") %>'
                    }]
                },
                files: [{
                    expand: true,
                    src: ['<%= paths.tmp %>/templates/home/index.html'],
                    dest: '.'
                }]
            },
            framework: {
                options: {
                    patterns: [{
                        match: /<!-- FRAMEWORK_PARTIAL -->/
                        // replacement: _utils.getFrameworkFilename
                    }]
                },
                files: [{
                    expand: true,
                    src: ['<%= paths.dist %>/templates/**/index.html'],
                    dest: '.'
                }]
            },
            injectBugTrack: {
                options: {
                    patterns: [{
                        match: /<\/head>/,
                        replacement: '<script src="http://img.wdjimg.com/static-files/devcenter/bugsnag-2.min.js" data-apikey="20d72f7d45770572a21272305cd3d248"></script></head>'
                    }]
                },
                files: [{
                    expand: true,
                    src: ['<%= paths.dist %>/templates/**/index.html'],
                    dist: '.'
                }]
            }
        },

        wandoulabs_deploy: {
            options: grunt.file.readJSON('OathKeeper/frontend/ldap.json'),
            product: {
                deployCDN: {
                    src: '<%= paths.dist %>', // the folder you want to deploy,
                    target: 'devcenter' // Target folder on server
                }
            }
        },

        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false
            }
        },
        changelog: {
            options: {
                dest: 'CHANGELOG.md',
                templateFile: 'changelog.tpl'
            }
        },
        aws_s3: {
            options: {
                accessKeyId: AWS_CONFIG.accessKeyId,
                secretAccessKey: AWS_CONFIG.secretAccessKey,
                region: 'cn-north-1',
                uploadConcurrency: 5,
                signatureVersion: 'v4'
            },
            staging: {
                options: {
                    bucket: 'web-statics-staging',
                    differential: true,
                    params: {
                        CacheControl: '31536000'
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['**'],
                    dest: 'devcenter/'

                }]
            },
            production: {
                options: {
                    bucket: 'web-statics-production',
                    differential: true,
                    params: {
                        CacheControl: '31536000'
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['**'],
                    dest: 'devcenter/'
                }]
            }
        }
    });

    grunt.registerTask('server', function(target) {
        // you just need to server, even after grunt's tasks have finished
        // use connect keepalive opt to enable it
        grunt.task.run([
            'compass:dev',
            'connect:dev',
            'watch'
        ]);
    });

    grunt.registerTask('_build', [
        'clean:all',
        'compass:dist',
        'copy:image',
        'copy:bower',
        'copy:html',
        'requirejs:dist',
        'replace:home', // replace FRAMEWORK_PARTIAL for usemin to produce templates.js
        'useminPrepare:dist',
        'concat',
        'removelogging',
        'uglify',
        'cssmin',
        // 'imagemin',
        'copy:htmlDist',
        'filerev',
        'copy:imageDist',
        'copy:fontDist',
        'usemin',
        'replace:framework', // get generated framework.js filename and replace for other index template
        'removelogging', // use for other library using console
        'clean:tmp'
    ]);

    grunt.registerTask('build', [
        '_build',
        'replace:test'
    ]);

    grunt.registerTask('default', ['server']);

    grunt.registerTask('build:production', [
        '_build',
        'replace:deploy', // replace for online(e.g.: ga, host, etc)
        'replace:injectBugTrack',
        'aws_s3' // upload static files to wandoulabs cdn
    ]);

    grunt.registerTask('build:staging', [
        '_build',
        'replace:test'
    ]);

    grunt.registerTask('release', [
        'bump-only:patch',
        'changelog',
        'bump-commit'
    ]);
};