const { src, dest, task, series } = require("gulp");
var uglify = require("gulp-uglify");
var htmlmin = require("gulp-htmlmin");
var uglifycss = require("gulp-uglifycss");
var zip = require("gulp-zip");
var gulpCopy = require("gulp-copy");
var fontmin = require("gulp-fontmin");

// task("copy", function () {
//   return src("assets/**").pipe(gulpCopy("dist")).pipe(dest("dist/"));
// });

task("minify-fonts", function () {
  return src("assets/fonts/*.ttf")
    .pipe(fontmin({ text: "{}@#" }))
    .pipe(dest("dist/assets/fonts"));
});

task("minify-html", function () {
  return src("index.html").pipe(htmlmin()).pipe(dest("dist/"));
});

task("minify-js", function () {
  return src(["index.js", "assets/**/*.js", "components/**/*.js"])
    .pipe(uglify())
    .pipe(dest("dist/"));
});

task("zip", function () {
  return src("dist/**/**").pipe(zip("build.zip")).pipe(dest("./dist"));
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

task(
  "default",
  series("minify-html", "minify-js", "minify-css", "minify-fonts")
);
task("zip", series("zip"));
