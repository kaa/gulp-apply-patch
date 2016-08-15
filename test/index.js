var gutil = require("gulp-util");
var assert = require('assert');
var path = require("path");
var stream = require("stream");
var applyPatch = require("../index.js");

var patch = `--- folder/test.txt	2016-08-15 12:16:39.000000000 +0300
+++ folder/test.txt	2016-08-15 12:16:11.000000000 +0300
@@ -1,3 +1,3 @@
 The quick fox
-jumps over the
+runs over the
 lazy dog.`;

var chainedPatch = `--- folder/test.txt	2016-08-15 12:16:39.000000000 +0300
+++ folder/test.txt	2016-08-15 12:16:11.000000000 +0300
@@ -1,3 +1,3 @@
 The quick fox
-runs over the
+flies over the
 lazy dog.`;

var input = `The quick fox
jumps over the
lazy dog.`;
var output = `The quick fox
runs over the
lazy dog.`;
var chainedOutput = `The quick fox
flies over the
lazy dog.`;

describe('gulp-apply-patch', function() {
  describe('when names match', function() {

    it('should apply patch', function(done) {
      var patcher = applyPatch([new Buffer(patch)]);
      patcher.write(new gutil.File({
        base: "",
        path: "folder/test.txt",
        contents: Buffer(input)
      }));
      patcher.once('data', function(file) {
        assert.equal(output, file.contents.toString('utf8'));
        done();
      });
    });
    it('should apply many patches', function(done) {
      var patcher = applyPatch([new Buffer(patch),new Buffer(chainedPatch)]);
      patcher.write(new gutil.File({
        base: "",
        path: "folder/test.txt",
        contents: Buffer(input)
      }));
      patcher.once('data', function(file) {
        assert.equal(chainedOutput, file.contents.toString('utf8'));
        done();
      });
    });
  });
  describe('when names dont match', function() {
    // create the fake file
    var fakeFile = new gutil.File({
      base: "",
      path: "folder/not_test.txt",
      contents: Buffer(input)
    });
    var patcher = applyPatch([new Buffer(patch)]);
    patcher.write(fakeFile);

    it('should not apply patch', function(done) {
      patcher.once('data', function(file) {
        assert.equal(input, file.contents.toString('utf8'));
        done();
      });
    });
  });
});