> [!NOTE]
> This project is no longer maintained

# gulp-apply-patch

Patch files using unified diffs as part of a gulp build process.

## Usage

Install `gulp-apply-patch` using `npm` as a development dependency:

```
npm install --save-dev gulp-apply-patch
```

In your `gulpfile.js` use it in a task as follows.

```javascript
var applyPatch  = require('gulp-apply-patch');

gulp.task('patch', function() {
  gulp.src('vnd/**/*.js')
    .pipe(patch("patches/*.patch"))
    .pipe(gulp.dest('out'));
});
```

## Reference

### applyPath(patches, options)

Take one or more unified diffs and applies those in order to the piped files, when ever the relative path of the piped file matches the path of the diff.

#### patches
Type: `String` | `Array`

Either a path string or glob string that will be used to load patch files from disk, or an array of raw unified diffs.

#### options
Type: `Object`

##### options.replaceCLRLF
Type: `Boolean`  
Default: `false`

Replace `\r\n` with `\n` for Windows compatibility.
