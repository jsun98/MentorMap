'use strict'

import autoprefixer from 'gulp-autoprefixer'
import browserSyncModule from 'browser-sync'
import cssnano from 'gulp-cssnano'
import del from 'del'
import gulp from 'gulp'
import nodemon from 'gulp-nodemon'
import rename from 'gulp-rename'
import sass from 'gulp-ruby-sass'

const
	browserSync = browserSyncModule.create(),
	folder = {
		src: 'src/',
		build: 'public/',
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
	gulp.watch([ 'views/*.ejs', 'routes/*.js' ], ejs)
	gulp.watch(folder.src + '**/stylesheets/*.scss', css)
	done()
})

gulp.task('serve', done => {
	var started = false
	nodemon({
		script: 'app.js',
		ignore: [ 'public/**/*', 'src/**/*', 'views/**/*', 'views/*' ],
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
	folder.build + '**/stylesheets/**/*',
]))

gulp.task('build', gulp.series('clean', css))
gulp.task('default', gulp.series('build', 'serve', gulp.parallel('watch', 'sync-local')))
