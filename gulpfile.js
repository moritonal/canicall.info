const gulp = require("gulp");

const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const replace = require("gulp-replace");
const minifycss = require('gulp-minify-css');
const livereload = require('gulp-livereload');
const raster = require('gulp-raster');
const workbox = require("workbox-build");
const autoprefix = require("gulp-autoprefixer");

const stagingDirectory = "dist";
const appName = "CiC";

gulp.task("js", () => {
    return gulp.src("./app/**/*.js")
        .pipe(gulp.dest(stagingDirectory))
        .pipe(livereload(server));
});

gulp.task("images-144", () => {
    return gulp.src("./app/images/**/*.svg")
        .pipe(replace("%text%", appName))
        .pipe(raster({scale: 3}))
        .pipe(rename({extname: '.png', suffix: "-144"}))
        .pipe(gulp.dest(stagingDirectory));
});

gulp.task("images-528", gulp.series("images-144", () => {
    return gulp.src("./app/images/**/*.svg")
        .pipe(replace("%text%", appName))
        .pipe(raster({scale: 11}))
        .pipe(rename({extname: '.png', suffix: "-528"}))
        .pipe(gulp.dest(stagingDirectory));
}));

gulp.task("images", gulp.series("images-528", () => {
    return gulp.src("./app/images/**/*.svg")
        .pipe(replace("%text%", appName))
        .pipe(raster({scale: 1}))
        .pipe(rename({extname: '.png'}))
        .pipe(gulp.dest(stagingDirectory));
}));

gulp.task("sass", () => {
    return gulp.src("./app/**/*.scss")
        .pipe(sass({errLogToConsole: true}))
        .pipe(minifycss())
        .pipe(autoprefix())
        .pipe(gulp.dest(stagingDirectory))
        .pipe(livereload(server));
});

gulp.task("index", () => {
    return gulp.src("./app/index.html")
        .pipe(gulp.dest(stagingDirectory))
        .pipe(livereload(server));
});

gulp.task("html", () => {
    return gulp.src("./app/**/*.html")
        .pipe(gulp.dest(stagingDirectory))
        .pipe(livereload(server));
});

gulp.task("copyPackageJson", () => {
    return gulp.src("package.json")
        .pipe(gulp.dest(stagingDirectory));    
});

const run = require("gulp-run");

gulp.task("runNpmInstall", gulp.series("copyPackageJson", () => {
    return run("npm install --production", { cwd: stagingDirectory}).exec();
}));

gulp.task("manifest", () => {
    return gulp.src("./app/manifest.json")
        .pipe(gulp.dest(stagingDirectory));
});

gulp.task("code", ["js", "sass", "index", "html", "runNpmInstall", "images", "manifest"])

gulp.task('generate-service-worker', gulp.series("code", () => {
    return workbox.generateSW({
        globDirectory: stagingDirectory,
        globPatterns: ["**\/*.{html,js,css,jpg}"],
        swDest: `${stagingDirectory}/sw.js`,
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
}));

gulp.task("noJekyll", gulp.series("generate-service-worker", async () => {
    const path = require("path");
    const fs = require("fs");

    new Promise(res => 
        fs.writeFile(path.join(stagingDirectory, ".nojekyll"), "",
            () => res()));
}));

gulp.task("default", gulp.series("noJekyll"));