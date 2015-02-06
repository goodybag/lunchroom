var gulp      = require('gulp');
var transform = require('vinyl-transform');
var pkg       = require('./package.json');
var config    = require('./config');
var server    = require('./server');

var scripts = {
  public: ['public/js/*.js', 'public/js/**/*.js']
, server: ['*.js', 'config/*.js', 'server/*.js', 'server/**/*.js', 'server/**/**/*.js']
};

scripts.lint = scripts.public.concat(['*.js', 'test/*.js']);
scripts.lint = scripts.lint.concat( scripts.server );

gulp.task( 'compile-frontend-js', function(){
  return gulp.src('./public/js/app.js')
  .pipe( transform( function( filename ){
    return require('browserify')({
      debug: true
    })
    .add( filename )
    .bundle();
  }))
  .pipe( gulp.dest('public/dist') );
});

gulp.task( 'less', function(){
  return gulp.src('less/app.less')
    .pipe( require('gulp-less')() )
    .pipe( gulp.dest('public/dist') );
});

gulp.task( 'lint', function(){
  return gulp.src( scripts.lint )
    .pipe( require('gulp-jshint')( pkg.jshint || {} ) )
    .pipe( require('gulp-jshint').reporter('default') );
});

gulp.task( 'watch', function(){
  gulp.watch( scripts.lint, ['lint'] );
  gulp.watch( scripts.public, ['compile-frontend-js'] );
  gulp.watch( ['less/*.less', 'less/**/*.less'], ['less'] );
});

gulp.task( 'server', function(){
  server.listen( config.http.port );
});

gulp.task( 'build', [ 'lint', 'less', 'compile-frontend-js' ] );
gulp.task( 'default', [ 'build', 'server', 'watch' ] );