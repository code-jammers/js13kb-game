const { src, dest, task, series } = require("gulp");
var uglify = require("gulp-uglify");
var htmlmin = require("gulp-html-minifier");
var uglifycss = require("gulp-uglifycss");
var zip = require("gulp-zip");
var gulpCopy = require("gulp-copy");
var del = require("del");
const size = require("gulp-size");

task("copy-images", function () {
  return src("assets/images/*")
    .pipe(gulpCopy("dist"))
    .pipe(dest("assets/images"));
});

task("minify-html", function () {
  return src("index.html")
    .pipe(
      htmlmin({
        removeAttributeQuotes: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        removeTagWhitespace: true,
        useShortDoctype: true,
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
      })
    )
    .pipe(dest("dist/"));
});

task("minify-js", function () {
  return src(["index.js"]).pipe(uglify()).pipe(dest("dist/"));
});

task("minify-js-assets-scripts", function () {
  return src(["assets/scripts/*.js"])
    .pipe(uglify())
    .pipe(dest("dist/assets/scripts"));
});

task("minify-web-components", function () {
  return src(["components/**/*.js"])
    .pipe(uglify())
    .pipe(dest("dist/components"));
});

task("zip", function () {
  return src("dist/**/**").pipe(zip("build.zip")).pipe(dest("./dist"));
});

task("size", function () {
  return src("dist/build.zip").pipe(size()).pipe(dest("dist"));
});

task("minify-css", function () {
  return src("index.css")
    .pipe(
      uglifycss({
        maxLineLen: 80,
        uglyComments: true,
      })
    )
    .pipe(dest("dist/"));
});

task("minify-component-css", function () {
  return src("components/*.css")
    .pipe(
      uglifycss({
        maxLineLen: 80,
        uglyComments: true,
      })
    )
    .pipe(dest("dist/components"));
});

task("clean", function () {
  return del(["dist/**", "!dist"]);
});

task(
  "default",
  series(
    "clean",
    "minify-html",
    "minify-js",
    "minify-js-assets-scripts",
    "minify-web-components",
    "minify-css",
    "minify-component-css",
    "copy-images"
  )
);
task("zip", series("zip"));
task("size", series("size"));
