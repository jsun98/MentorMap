'use strict'

import autoprefixer from 'gulp-autoprefixer'
import babel from 'gulp-babel'
import browserSyncModule from 'browser-sync'
import cssnano from 'gulp-cssnano'
import del from 'del'
import gulp from 'gulp'
// import imagemin from 'gulp-imagemin'
// import newer from 'gulp-newer'
import nodemon from 'gulp-nodemon'
import rename from 'gulp-rename'
import sass from 'gulp-ruby-sass'
import stripdebug from 'gulp-strip-debug'
import uglify from 'gulp-uglify'
import webpack from 'webpack-stream'
import webpackConfig from './webpack.config'

const
	browserSync = browserSyncModule.create(),
	devBuild = process.env.NODE_ENV !== 'production',
	folder = {
		src: 'src/',
		build: 'public/',
	}


// function images () {
// 	return gulp.src(folder.src + 'images/**/*')
// 		.pipe(newer(folder.build + 'images/'))
// 		.pipe(imagemin({ optimizationLevel: 5 }))
// 		.pipe(gulp.dest(folder.build + 'images/'))
// 		.pipe(browserSync.stream())
// }


function js () {

	let build = gulp.src(folder.src + 'index/javascript/index.js')
		.pipe(webpack(webpackConfig))
		.pipe(babel({ presets: [ 'es2015' ] }))

	if (!devBuild)
		build = build
			.pipe(stripdebug())
			.pipe(uglify())


	return build
		.pipe(gulp.dest('./build'))
		.pipe(browserSync.stream())
}


function css () {
	return sass('src/**/styles.scss', { style: 'expanded' })
		.pipe(autoprefixer('last 2 version'))
		.pipe(rename(path => {
			path.basename = 'bundle'
			path.extname = '.css'
		}))
		.pipe(gulp.dest(folder.build))
		.pipe(rename(path => {
			path.basename = 'bundle'
			path.extname = '.min.css'
		}))
		.pipe(cssnano())
		.pipe(gulp.dest(folder.build))
		.pipe(browserSync.stream())
}

function ejs () {
	return gulp.src('views/*.ejs')
		.pipe(browserSync.stream())
}

// watch for changes
gulp.task('watch', done => {
	// gulp.watch(folder.src + 'images/**/*', images)
	gulp.watch([ 'views/*.ejs', 'routes/*.js' ], ejs)
	gulp.watch(folder.src + '**/javascript/*.js', js)
	gulp.watch(folder.src + '**/stylesheets/*.scss', css)
	done()
})

gulp.task('serve', done => {
	var started = false
	nodemon({
		script: 'app.js',
		ignore: [ 'public/**/*', 'src/**/*', 'views/*', 'views/**/*' ],
		ext: 'js ejs scss',
		verbose: true,
		env: { NODE_ENV: process.env.NODE_ENV },
	}).on('start', () => {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			started = true
			setTimeout(() => done(), 1000)
		}

	})
})

gulp.task('sync-local', done => {
	browserSync.init({
		proxy: 'http://localhost:' + 3000,
		browser: 'Google Chrome',
		port: 3001,
		notify: true,
	})
	done()
})


gulp.task('clean', () => del([
	// folder.build + 'images/**/*',
	folder.build + 'build/*',
	folder.build + '**/stylesheets/**/*',
]))

gulp.task('build', gulp.series('clean', gulp.parallel(css, js)))
gulp.task('default', gulp.series('build', 'serve', gulp.parallel('watch', 'sync-local')))
