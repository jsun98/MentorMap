var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');

gulp.task('styles', function() {
    gulp.src('public/sass/*.scss')
        .pipe(sass({outputStyle: 'expanded'})
        .on('error', sass.logError))
        .pipe(gulp.dest('./public/css/compiled'));
});

gulp.task('ejs',function(){
    return gulp.src('views/**/*.ejs')
    .pipe(livereload());
});

gulp.task('build', function () {
    return browserify({entries: 'react/main.js', extensions: ['.js'], debug: true})
        .transform(babelify, {presets: ["es2015", "react"]})
        .bundle()
        .on("error", function (err) { console.log("Error : " + err.message); })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('public/js'));
});


gulp.task('scripts', function() {
  return gulp.src('react/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(livereload());
});


gulp.task('eslint', function() {
  return gulp.src('react/main.js')
    .pipe(eslint({
      baseConfig: {
        "ecmaFeatures": {
           "jsx": true
         }
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('public/sass/*.scss', ['styles']);
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
