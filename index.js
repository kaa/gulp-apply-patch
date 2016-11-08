'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var glob = require('glob');
var diff = require('diff');
var fs = require('fs');
var path = require('path');

var PLUGIN_NAME = "gulp-apply-patch";

module.exports = function (patches, opts) {
	opts = opts || {};
  var patchLists = {};
  // Parse glob
  if(typeof(patches)==="string") {
    patches = glob.sync(patches)
      .map(fs.readFileSync);
  }
  patches.forEach(function(patch){
    patch = opts.replaceCRLF
      ? patch.toString().replace(/\r\n/g,"\n")
      : patch.toString();
    diff.parsePatch(patch.toString()).forEach(function(parsedPatch){
      var srcName = path.normalize(parsedPatch.oldFileName);
      var list = patchLists[srcName] = patchLists[srcName] || [];
      list.push(parsedPatch);
    });
  });

	return through.obj(function (file, enc, cb) {
    var self = this;
    function applyPatch(src,patch,i) {
      var results = diff.applyPatch(src, patch);
      if(results===false) {
        self.emit('error', new gutil.PluginError(PLUGIN_NAME, "Failed to apply patch "+patch.oldFileName));
      }
      return results; 
    }

		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return;
		}

    var patchesForFile = patchLists[file.relative];
    if(patchesForFile!==undefined) {
      try {
        var originalContents = opts.replaceCRLF
          ? file.contents.toString().replace(/\r\n/g,"\n")
          : file.contents.toString();
        file.contents = new Buffer(
          patchesForFile.reduce(applyPatch, originalContents)
        );
      } catch (err) {
        this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
      }
    }

		cb(null, file);
	});
};