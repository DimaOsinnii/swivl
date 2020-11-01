const {watch, src, dest, task, series, parallel} = require('gulp');//include gulp
const browserSync = require('browser-sync').create();//local server
const autoprefixer = require('gulp-autoprefixer');//Add prefix for new properties
const concat = require('gulp-concat');//file concatenation into one
const del = require('del');//plugin for cleaning build folder
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');//record source code js or sass to map
const less = require('gulp-less');
const pipeline = require("readable-stream/lib/internal/streams/pipeline"); //compiler code less to css


function addStyles(paths, outputFilename) {

    return pipeline(
        src(paths),
        sourcemaps.init(),
        less(),
        concat(outputFilename),
        autoprefixer('last 10 versions', 'ie 10'),
        cleanCSS(),
        rename({suffix: '.min'}),
        sourcemaps.write('./'),
        dest('./build/css'),
        browserSync.stream(),
    );
};


function styles() {
    return addStyles([
        './node_modules/normalize.css/normalize.css',
        './app/styles/*.less',
    ], 'index.css');
};


function clean() {
    return del(['build/*']);
};


function html() {
    return pipeline(
        src('index.html'),
        browserSync.stream(),
    );
};

function img() {
    return pipeline(
        src('./app/images/**'),
        dest('./build/img'),
        browserSync.stream(),
    )
};

function watcher() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 8080,
        open: true,
        notify: false,
    });

    watch('index.html', html);
    watch('./app/styles/index.less', styles);
    watch('./app/images/*');
    watch("/index.html").on('change', browserSync.reload);
}


task('styles', styles);
task('del', clean);
task('watch', watcher);
task('build', series(clean, styles, img));
task('dev', series('build', watcher));