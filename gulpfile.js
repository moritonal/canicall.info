const gulp = require("gulp");

const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const replace = require("gulp-replace");
const minifycss = require('gulp-minify-css');
const livereload = require('gulp-livereload');
const raster = require('gulp-raster');
let workbox = require("workbox-build");

const stagingDirectory = "docs";
const appName = "C";

gulp.task("js", () => {
    return gulp.src("./app/**/*.js")
        .pipe(gulp.dest("docs"))
        .pipe(livereload(server));
});

gulp.task("images-144", function() {
    return gulp.src("./app/images/**/*.svg")
        .pipe(replace("%text%", appName))
        .pipe(raster({scale: 3}))
        .pipe(rename({extname: '.png', suffix: "-144"}))
        .pipe(gulp.dest(stagingDirectory));
});

gulp.task("images-528", ["images-144"], function() {
    return gulp.src("./app/images/**/*.svg")
        .pipe(replace("%text%", appName))
        .pipe(raster({scale: 11}))
        .pipe(rename({extname: '.png', suffix: "-528"}))
        .pipe(gulp.dest(stagingDirectory));
});

gulp.task("images", ["images-144"], function() {
    return gulp.src("./app/images/**/*.svg")
        .pipe(replace("%text%", appName))
        .pipe(raster({scale: 1}))
        .pipe(rename({extname: '.png'}))
        .pipe(gulp.dest(stagingDirectory));
});

gulp.task("sass", () => {
    return gulp.src("./app/**/*.scss")
        .pipe(sass({errLogToConsole: true}))
        .pipe(minifycss())
        .pipe(gulp.dest("docs"))
        .pipe(livereload(server));
});

gulp.task("index", () => {
    return gulp.src("./app/index.html")
        .pipe(gulp.dest("docs"))
        .pipe(livereload(server));
});

gulp.task("html", () => {
    return gulp.src("./app/**/*.html")
        .pipe(gulp.dest("docs"))
        .pipe(livereload(server));
});

gulp.task("copyPackageJson", function() {
    return gulp.src("package.json")
        .pipe(gulp.dest(stagingDirectory));    
});

const run = require("gulp-run");

gulp.task("runNpmInstall", ["copyPackageJson"], function() {
    return run("npm install --production", { cwd: stagingDirectory}).exec();
});

gulp.task("manifest", () => {
    return gulp.src("./app/manifest.json")
        .pipe(gulp.dest('docs/'));
});

let dist = "docs";

gulp.task('generate-service-worker', () => {
    return workbox.generateSW({
        globDirectory: dist,
        globPatterns: ["**\/*.{html,js,css,jpg}"],
        swDest: `${dist}/sw.js`,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
            {
                urlPattern: new RegExp('https://fonts.googleapis.com'),
                handler: 'staleWhileRevalidate'
            }, {
                urlPattern: new RegExp("https://fonts.gstatic.com"),
                handler: 'staleWhileRevalidate'
            },
            {
                urlPattern: new RegExp("\/"),
                handler: 'staleWhileRevalidate'
            }
        ]
    }).then(() => {
        console.info('Service worker generation completed.');
    }).catch((error) => {
        console.warn('Service worker generation failed: ' + error);
    });
});

const lr = require('tiny-lr');
const server = lr();

// Watch Files For Changes
gulp.task('watch', function() {

    livereload.listen();
    
    gulp.watch('./app/js/*.js', ['js']);
    gulp.watch('./app/scss/*.scss', ['sass']);
    gulp.watch('./app/images/**', ['images']);
    gulp.watch('./app/**/*.html', ['html']);
    gulp.watch('./app/*.html', ['index']);
});

gulp.task("default", ["js", "sass", "index", "html", "runNpmInstall", "images", "manifest"]);