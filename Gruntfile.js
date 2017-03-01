module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        assemble: {
            options:{
                partials: 'templates/partials/**/*.hbs',
                layoutdir: 'templates/layouts',
                flatten: true
            },
            pages: {
                options: {
                    layout: ['default.hbs']
                },
                src: ['templates/pages/*.hbs'],
                dest: '_deploy/site/pages/'
            },
            production: {
                options: {
                    layout: ['deploy.hbs']
                },
                src: ['templates/pages/*.hbs'],
                dest: '_deploy/site/pages/'
            }
        },
        sass: {                              // Task
            dist: {                            // Target
                options: {                       // Target options
                    style: 'expanded'
                },
                files: {
                    'resources/css/screen.css': 'source/scss/resp_styles.scss'
                }
            }
        },
        sync: {
            main: {
                files: [
                    {
                        src: ['resources/**'],
                        dest: '_deploy/'
                    }
                ],
                ignoreInDest: "site/**",
                verbose: true,
                failOnError: true,
                updateAndDelete: true
            }
        },
        watch: {
            html: {
                files: 'templates/**/*.hbs',
                tasks: ['assemble:pages', 'sync'], // to_html rausgenommen
            },
            styles: {
                files: 'source/scss/**/*',
                tasks: ['sass', 'postcss', 'sync'] // to_html rausgenommen
            },
            js: {
                files: 'resources/js/**/*',
                tasks: ['sync'] // to_html rausgenommen
            }
        },
        postcss: {
            options: {
                map: true, // inline sourcemaps

                processors: [
                    require('autoprefixer'), // add vendor prefixes
                    require('cssnano')() // minify the result
                ]
            },
            dist: {
                src: 'resources/de/vichy/css/resp_styles.css'
            }
        },
        browserSync: {
            bsFiles: {
                src : '_deploy/**'
            },
            options: {
                watchTask: true,
                reloadDelay: 500,
                startPath: "/site/pages/",
                server: {
                    baseDir: "./_deploy",
                    directory: true
                }
            }
        },
        // html_sitemap: {
        //   options: {
        //     siteBase: 'http://localhost:8700',
        //
        //   },
        //   files: {
        //     '_deploy/index.html': ['_deploy/site/**/*.html']
        //   }
        // },
        devUpdate: {
            main: {
                options: {
                    updateType: 'prompt',
                    packageJson: null
                }
            }
        }
    });

    // Loads Grunt Tasks
    grunt.loadNpmTasks('grunt-assemble');
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-dev-update');
    //grunt.loadNpmTasks('grunt-html-sitemap');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-browser-sync');

    // Default task(s).
    // This registers a task that runs `sass`, followed by `watch`.
    grunt.registerTask('default', ['assemble:pages', 'sass', 'postcss', 'sync', 'browserSync', 'watch']);
    grunt.registerTask('deploy', ['assemble:production', 'sass', 'postcss', 'sync']);
    grunt.registerTask('upgrade', ['devUpdate']);
};