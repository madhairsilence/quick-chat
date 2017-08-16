var gulp = require('gulp');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('css', () => {
  gulp.src('css/style.css')
    .pipe(minify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
});

gulp.task('js',() => {
  gulp.src('js/quickchat.js')
  .pipe(uglify())
  .pipe(rename({ suffix: '.min' }))
  .pipe( gulp.dest( 'dist/js'))
});

gulp.task('default', ['js', 'css']);
