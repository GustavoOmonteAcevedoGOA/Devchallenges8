const {src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const browsersync = require('browser-sync').create();

const paths={
    imagenes: 'img/**/*',
    scss: 'scss/**/*.scss',
    js: 'js/**/*.js'
}

//Sass Task
function scssTask(){
    return src(paths.scss, { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest('./build/css', { sourcemaps: '.' }));
}

//JavaScript Task
function jsTask(){
    return src(paths.js, { sourcemaps: true })
    .pipe( concat('bundle.js'))
    .pipe(terser())
    .pipe(dest('./build/js', {sourcemaps: '.' }));
}

//Imagenes Task
function imagenes(){
    return src(paths.imagenes)
    .pipe(imagemin())
    .pipe(dest('./build/img'))
    .pipe(notify({message : 'Imagen Minificada' }));
}

function versionWebp(){
    return src(paths.imagenes)
    .pipe(webp())
    .pipe(dest('./build/img'))
    .pipe(notify({message : 'Version Webp Lista'}))
}

//Browsersync Task
function browsersyncServer(done){
    browsersync.init({
        server: {
            baseDir: '.'
        }
    });
    done;
}

function browsersyncReload(done){
    browsersync.reload();
    done();
}

//Watch Task
function watchTask(){
    watch('*.html', browsersyncReload);
    watch([paths.scss, paths.js], series(scssTask, jsTask, browsersyncReload));
}

//Gulp Task
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;

//Default Gulp Task
exports.default = series(
    scssTask,
    jsTask,
    browsersyncServer,
    watchTask
);