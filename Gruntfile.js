const fs = require('fs');
if (fs.existsSync('./wkny.env')) {
	require('dotenv').config({ path: 'wkny.env' });
}
let livereloadPort = 35729;
let environment = 'prod';
let buildPath = './rollout/';
let watch = false;
let sourcemaps = false;
let uglify = true;

if (process.env.ENV && (process.env.ENV === 'prod' || process.env.ENV === 'dev')) {
	environment = process.env.ENV;
}
if (process.env.BUILD_PATH) {
	buildPath = process.env.BUILD_PATH;
	if (!buildPath.endsWith('/')) {
		buildPath = buildPath + '/';
	}
}
if (environment === 'prod') {
	watch = false;
	sourcemaps = false;
	uglify = true;
} else if (environment === 'dev') {
	watch = true;
	sourcemaps = true;
	uglify = false;
}
if (process.env.WATCH && (process.env.WATCH === 'true' || process.env.WATCH === 'false')) {
	watch = JSON.parse(process.env.WATCH);
}
if (process.env.SOURCEMAPS && (process.env.SOURCEMAPS === 'true' || process.env.SOURCEMAPS === 'false')) {
	sourcemaps = JSON.parse(process.env.SOURCEMAPS);
}
if (process.env.UGLIFY && (process.env.UGLIFY === 'true' || process.env.UGLIFY === 'false')) {
	uglify = JSON.parse(process.env.UGLIFY);
}
process.env.BUILD_PATH = buildPath;
process.env.ENV = environment;
process.env.WATCH = watch;
process.env.SOURCEMAPS = sourcemaps;
process.env.UGLIFY = uglify;
const webpackConfig = require('./webpack.config')

module.exports = function(grunt) {
	const gruntConfig = {
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			init: {
				src: [ buildPath + '*' ],
				options: { 'force': true }
			}
		},

		copy: {
			themeFiles: { expand: true, src: '**', cwd: './src/php/', dest: buildPath }
		},

		sync: {
			themeFiles: {
				files: [{ cwd: './src/php/', src: ['**'], dest: buildPath }],
				verbose: true
			}
		},

		sass: {
			frontend: {
				files: {
					'css/style.css':'src/scss/style.scss'
				}
			},
			options: { }
		},
		postcss: {
			options:{
				processors: [
					require('autoprefixer')({browsers: 'last 5 versions'}),
				]
			},
			frontend: {
				src: buildPath + 'css/style.css'
			},
		},

		webpack: {
			options: { failOnError: false },
			build: webpackConfig
		},

		watch: {
			frontendscss: {
				files: [ 'src/scss/**/*.scss' ],
				tasks: [ 'sass:frontend', 'postcss:frontend' ]
			},
			sync: {
				files: [ './src/php/**/*' ],
				tasks: [ 'sync' ]
			},
			reload: {
				files: buildPath + '**/*',
				options: {
					livereload: livereloadPort,
					debounceDelay: 1000
				}
			}
		},

		concurrent: {
			target: {
				tasks: [ 'webpack:build', 'watch' ],
				options: { logConcurrentOutput: true }
			}
		}
	};

	if (sourcemaps === false) {
		gruntConfig.sass.options.sourcemap = 'none';
	}
	for(let file in gruntConfig.sass.frontend.files) {
		gruntConfig.sass.frontend.files[buildPath + file] = gruntConfig.sass.frontend.files[file]
		delete gruntConfig.sass.frontend.files[file]
	}

	grunt.initConfig(gruntConfig);

	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-clean')
	grunt.loadNpmTasks('grunt-contrib-copy')
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-sync')
	grunt.loadNpmTasks('grunt-webpack');

	const defaultTasks = ['clean:init' , 'copy', 'sass:frontend', 'postcss:frontend'];
	if (watch) {
		defaultTasks.push('concurrent:target');
	} else {
		defaultTasks.push('webpack:build');
	}
	grunt.registerTask('default', defaultTasks);
	grunt.registerTask('test', [ ]);

	console.log(gruntConfig.sass.frontend.files);
}
