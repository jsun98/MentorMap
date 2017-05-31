var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('styles', function() {
  return sass('public/css/scss/*.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('public/css'))
    .pipe(livereload());
});

gulp.task('ejs',function(){
    return gulp.src('views/**/*.ejs')
    .pipe(livereload());
});

gulp.task('build', function () {
    return browserify({entries: 'react/main.js', extensions: ['.js'], debug: true})
        .transform(babelify, {presets: ["es2015", "react"]})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('public/css/**/*.scss', ['styles']);
    //gulp.watch('react/**/*.js', ['scripts']);
    gulp.watch('views/**/*.ejs', ['ejs']);
    gulp.watch('react/**/*.js', ['build']);
});

gulp.task('server',function(){
    nodemon({
        'script': 'app.js',
    });
});

gulp.task('serve', ['server','watch']);
