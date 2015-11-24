'use strict';

var config = {
    bowerDir: 'bower_components',
    buildDir: 'dist',
    srcDir: 'src/app'
};

function getTimeStamp() {
    var now = new Date();
    var date = [
        ('0' + (now.getMonth() + 1)).slice(-2),
        ('0' + now.getDate()).slice(-2),
        now.getFullYear()
    ];
    var time = [
        now.getHours(),
        ('0' + now.getMinutes()).slice(-2),
        ('0' + now.getSeconds()).slice(-2)
    ];
    return [time.join(':'), date.join('/')];
}

var gulp = require('gulp'),
    browserify = require('browserify'),
    browserSync = require('browser-sync').create(),
    buffer = require('vinyl-buffer'),
    concat = require('gulp-concat'),
    changed = require('gulp-changed'),
    debug = require('gulp-debug'),
    del = require('del'),
    gutil = require('gulp-util'),
    maps = require('gulp-sourcemaps'),
    merge = require('merge-stream'),
    notify = require('gulp-notify'),
    reactify = require('reactify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    source = require('vinyl-source-stream'),
    uglify = require('gulp-uglify');

gulp.task('fontAwesome', function() {
    var styles = gulp.src(config.bowerDir + '/fontawesome/css/font-awesome.min.css')
        .pipe(changed(config.buildDir + '/css'))
        .pipe(gulp.dest(config.buildDir + '/css'));

    var fonts = gulp.src(config.bowerDir + '/fontawesome/fonts/**.*')
        .pipe(changed(config.buildDir + '/fonts'))
        .pipe(gulp.dest(config.buildDir + '/fonts'));

    return merge(styles, fonts);
});

gulp.task('JS', function () {
    var b = browserify({
        entries: config.srcDir + '/js/app.js',
        debug: true,
        transform: [reactify]
    });

    return b.bundle()
        .on('error', notify.onError({
            title: 'Error @ <%= options.time %> on <%= options.date %>',
            message: '<%= error.message %>',
            templateOptions: {
                time: getTimeStamp()[0],
                date: getTimeStamp()[1]
            }
        }))
        .on('error', function(err) {
            gutil.log(
                gutil.colors.red('Browserify compile error'),
                err.message
            );
            gutil.beep();
            this.emit('end');
        })
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(maps.init({loadMaps: true}))
        .pipe(debug({title: 'JS compiled:'}))
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .on('error', gutil.log)
        .pipe(maps.write('./'))
        .pipe(gulp.dest(config.buildDir + '/js/'))
        .pipe(browserSync.stream())
        .pipe(notify({
            title: 'Gulp: JavaScript',
            message: 'Created <%= file.relative %> @ <%= options.time %> on <%= options.date %>',
            templateOptions: {
                time: getTimeStamp()[0],
                date: getTimeStamp()[1]
            },
            onLast: true
        }));
});

gulp.task('moveSCSS', function() {
    return gulp.src([
            config.bowerDir + '/fuselage/scss/fuselage.scss',
            config.bowerDir + '/fuselage/scss/_settings.scss'
        ])
        .pipe(changed(config.srcDir + '/scss'))
        .pipe(debug({title: 'Styles moved:'}))
        .pipe(gulp.dest(config.srcDir + '/scss'));
});

gulp.task('compileSCSS', ['moveSCSS'], function() {
    return gulp.src(config.srcDir + '/scss/app.scss')
        .pipe(maps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: [config.bowerDir + '/fuselage/scss/components']
        })
        .on('error', sass.logError))
        .pipe(debug({title: 'Sass compiled:'}))
        .pipe(rename('app.min.css'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest(config.buildDir + '/css'))
        .pipe(browserSync.stream())
        .pipe(notify({
            title: 'Gulp: Sass',
            message: 'Created <%= file.relative %> @ <%= options.time %> on <%= options.date %>',
            templateOptions: {
                time: getTimeStamp()[0],
                date: getTimeStamp()[1]
            },
            onLast: true
        }));
});

gulp.task('moveHTML', function() {
    return gulp.src(config.srcDir + '/*.html')
        .pipe(changed(config.buildDir + '/*.html'))
        .pipe(debug({title: 'HTML moved:'}))
        .pipe(gulp.dest(config.buildDir))
        .pipe(browserSync.stream());
});

gulp.task('watchFiles', function() {
    gulp.watch(config.srcDir + '/scss/**/*.scss', ['compileSCSS']);
    gulp.watch(config.srcDir + '/js/**/*.js*', ['JS'])
        .on('change', function(event) {
            console.log('JS changed! Running tasks...');
        });
    gulp.watch(config.srcDir + '/*.html', ['moveHTML']);
});

gulp.task('clean', function() {
    del(config.buildDir);
});

gulp.task('build', ['fontAwesome', 'JS', 'compileSCSS', 'moveHTML']);

gulp.task('serve', ['build'], function() {
    browserSync.init({
        port: 3000,
        server: {
            baseDir: config.buildDir
        }
    });

    gulp.start('watchFiles');
});

gulp.task('default', ['clean'], function() {
    gulp.start('build');
});
