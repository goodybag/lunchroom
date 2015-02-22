var gulp      = require('gulp');
var transform = require('vinyl-transform');
var alias     = require('alias-module');
var pkg       = require('./package.json');
var config    = require('./config');
var server    = require('./server');
var db        = require('./db');

gulp.util     = require('gulp-util');

var scripts = {
  public: ['./public/js/*.js', './public/js/**/*.js']
, server: ['*.js', './config/*.js', './server/*.js', './server/**/*.js', './server/**/**/*.js']
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
  gulp.watch( scripts.public, [ 'alias-modules', 'compile-frontend-js'] );
  gulp.watch( ['less/*.less', 'less/**/*.less'], ['less'] );
  gulp.watch( ['server/*.js', 'server/**/*.js', 'server/**/**/*.js'], [ 'stop-server', 'server'] );
});

gulp.task( 'server', function( done ){
  server = server.listen( config.http.port, function( error ){
    if ( error ) return done( error );

    gulp.util.log( 'Server started on port ' + gulp.util.colors.blue( config.http.port ) );

    done();
  });
});

gulp.task( 'stop-server', function( done ){
  gulp.util.log('Stopping server');
  server.close( done );
});

gulp.task( 'create-tables', function( done ){
  db.dirac.createTables( done );
});

gulp.task( 'alias-modules', function(){
  alias( 'utils', __dirname + '/lib/utils/server.js' );
});

gulp.task( 'fonts', function(){
  return gulp.src('./node_modules/font-avenir/font/*')
    .pipe( gulp.dest('./public/dist/font/avenir') );
});

gulp.task( 'less-modules', function(){
  return gulp.src('./node_modules/diet-tags/img/*')
    .pipe( gulp.dest('./public/dist/img') );
});

gulp.task( 'build', [
  'lint', 'less', 'less-modules'
, 'fonts', 'alias-modules'
, 'compile-frontend-js', 'create-tables'
]);

gulp.task( 'default', [ 'build', 'server', 'watch' ] );