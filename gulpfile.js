const { src, dest, series, parallel, watch } = require('gulp');
const cp = require("child_process");

const render = () => {
    return cp.spawn("npx", ["eleventy", "--quiet"], { stdio: "inherit" });
};

const copy = () => {
    return src('./_site/**/*')
        .pipe(dest('./public'));
};
exports.default = (render, copy);