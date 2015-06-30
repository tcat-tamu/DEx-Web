var gulp = require('gulp');

var amdOptimize = require('amd-optimize');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var less = require('gulp-less');
var merge = require('gulp-merge');
var nunjucksCompile = require('gulp-nunjucks');
var nunjucksRender = require('gulp-nunjucks-render');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglifyCSS = require('gulp-cssmin');
var uglifyJS = require('gulp-uglify');


var srcPath = '../src/';
var stagingPath = '../build';
var vendorPath = stagingPath + '/vendor';
var distPath = '../dist/';
var baseUrl = '/~matt.barry/dex-site';


function makeCopyTask(source, dest) {
   return function () {
      return gulp.src(source).pipe(gulp.dest(dest));
   };
}



gulp.task('stylesheets', ['fonts'], function () {
   var vendorFiles = gulp.src([
         vendorPath + '/bootstrap/dist/css/bootstrap.css',
         vendorPath + '/font-awesome/css/font-awesome.css'
      ])
      .pipe(sourcemaps.init({
         loadMaps: true
      }));

   var lessFiles = gulp.src([
         srcPath + '/less/main.less'
      ])
      .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(autoprefixer());

   return merge(vendorFiles, lessFiles)
      .pipe(concat('main.css'))
      .pipe(uglifyCSS())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(distPath + '/css'));
});


gulp.task('templates', function () {
   gulp.src(srcPath + '/templates/**/*.j2')
      .pipe(nunjucksCompile({
         name: function (file) {
            // strip trailing '.j2' extension
            return file.relative.slice(0, -3);
         }
      }))
      .pipe(concat('templates.js'))
      .pipe(gulp.dest(distPath + '/js'));
});


gulp.task('javascripts', function () {
   var javascripts = gulp.src(srcPath + '/js/**/*.js')
      .pipe(amdOptimize('main', {
         findNestedDependencies: true,
         paths: {
            'backbone': vendorPath + '/backbone/backbone',
            'backbone.babysitter': vendorPath + '/backbone.babysitter/lib/backbone.babysitter',
            'backbone.radio': vendorPath + '/backbone.radio/build/backbone.radio',
            'backbone.wreqr': vendorPath + '/backbone.wreqr/lib/backbone.wreqr',
            'bootstrap': vendorPath + '/bootstrap/dist/js/bootstrap',
            'freewall': vendorPath + '/freewall/freewall',
            'jquery': vendorPath + '/jquery/dist/jquery',
            'marionette': vendorPath + '/marionette/lib/core/backbone.marionette',
            'nunjucks': vendorPath + '/nunjucks/browser/nunjucks-slim',
            'promise': vendorPath + '/bluebird/js/browser/bluebird',
            'underscore': vendorPath + '/underscore/underscore'
         },
         shim: {
            'bootstrap': ['jquery'],
            'freewall': {
               exports: 'freewall'
            }
         },
         exclude: ['config']
      }))
      .pipe(sourcemaps.init({
         loadMaps: true
      }))
      .pipe(concat('main.js'));

   var vendors = gulp.src([
         vendorPath + '/almond/almond.js'
      ])
      .pipe(sourcemaps.init({
         loadMaps: true
      }))
      .pipe(concat('vendors.js'));

   var minified = merge(vendors, javascripts)
      .pipe(uglifyJS())
      .pipe(sourcemaps.write('.'));

   var staticFiles = gulp.src([
         srcPath + '/js/config.js'
      ]);

   return merge(minified, staticFiles)
      .pipe(gulp.dest(distPath + '/js'));
});


gulp.task('html', function () {
   nunjucksRender.nunjucks.configure(srcPath + '/html/', {
      watch: false
   });

   return gulp.src([
         srcPath + '/html/index.html.j2',
         srcPath + '/html/about.html.j2',
         srcPath + '/html/bibliography.html.j2',
         srcPath + '/html/browse.html.j2',
         srcPath + '/html/browse-character.html.j2',
         srcPath + '/html/browse-manuscript.html.j2',
         srcPath + '/html/browse-play.html.j2',
         srcPath + '/html/browse-playwright.html.j2',
         srcPath + '/html/search-advanced.html.j2'
      ])
      .pipe(nunjucksRender({
         baseUrl: baseUrl
      }))
      .pipe(rename(function (path) {
         path.basename = path.basename.replace(/\.html$/i, '');
         path.ext = '.html';
      }))
      .pipe(gulp.dest(distPath));
});


gulp.task('images', makeCopyTask(srcPath + '/images/**/*', distPath + '/images'));
gulp.task('fonts', makeCopyTask([
      vendorPath + '/bootstrap/dist/fonts/*',
      vendorPath + '/font-awesome/fonts/*'
   ],
   distPath + '/fonts'
));

gulp.task('default', ['html', 'images', 'javascripts', 'templates', 'stylesheets']);


gulp.task('watch', ['default'], function () {
   gulp.watch(srcPath + '/html/**/*.html.j2', ['html']);
   gulp.watch(srcPath + '/images/**/*', ['images']);
   gulp.watch(srcPath + '/js/**/*.js', ['javascripts']);
   gulp.watch(srcPath + '/templates/**/*.j2', ['templates']);
   gulp.watch(srcPath + '/less/**/*.less', ['stylesheets']);
});
