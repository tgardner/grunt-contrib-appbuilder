/*
 * grunt-appbuilder-contrib
 * https://github.com/tgardner/grunt-appbuilder-contrib
 *
 * Copyright (c) 2014 Trent Gardner
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
    var _ = require('lodash')

    grunt.registerMultiTask('appbuilder', 'Grunt task to execute the Telerik AppBuilder CLI', function() {
        var done = this.async(),
            options;

        options = this.options({
            liveSync: true,
            download: true,
            companion: false,
            certificate: false,
            provision: false,
            maxBuffer: 300 * 1024,
            debug: false
        });

        this.files.forEach(function(file) {
            var src = file.src.filter(function(filepath) {
                // Remove nonexistent files (it's up to you to filter or warn here).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).join(' ');

            build(src, file.dest, options, function (results) {
                if(results === false) {
                    done(false);
                } else {
                    done(true);
                }
            });
        });
    });

    function build(project, dest, options, done) {
        var args = [],
            exec = require('child_process').exec,
            spawn = require('child_process').spawn,
            env = process.env,
            fs = require("fs"),
            ab;

        args.push("appbuilder");
        args.push("build");

        //Add Platform
        if(!options.platform) {
            grunt.log.errorlns('No platform specified');
            return done(false);
        } else {
            args.push(options.platform);
        }

        if(project) {
            var path = fs.lstatSync(project.toString());
            if(!path || !path.isDirectory()) {
                grunt.log.errorlns('Project path must be a directory');
                return done(false);
            }

            args.push("--path");
            args.push(project);
        }

        if(dest && grunt.file.exists(dest)) {
            args.push("--save-to");
            args.push(dest);
        }

        if(!options.liveSync) {
            args.push("--no-livesync");
        }

        if(options.download) {
            args.push("--download");
        } else if(options.companion) {
            args.push("--companion");
        }

        if(options.certificate) {
            args.push("--certificate");
            args.push(options.certificate);
        }

        if(options.provision) {
            args.push("--provision");
            args.push(options.provision);
        }

        var command = args.join(' ');
        if(options.debug) {
            grunt.log.writeln(command);
        }

        // ab = spawn(command)
        // ab.stdout.on('data', function (data) {
        //     console.log('stdout: ' + data);
        // });

        // ab.stderr.on('data', function (data) {
        //     grunt.log.errorlns(data);
        // });

        // ab.on('exit', function (code) {
        //     done(code === 0);
        // });

        ab = exec(command, {
            maxBuffer: options.maxBuffer,
            cwd: process.cwd(),
            timeout: 0,
            killSignal: 'SIGTERM',
            env: env
        }, function (err, results, code) {
            var message;

            if(err && err.code !== 1 && err.code !== 2 && err.code !== 65) {
                grunt.log.errorlns('appbuilder failed with error code: ' + err.code);
                grunt.log.errorlns('and the following message:' + err);

                return done(false);
            }

            results = results.trim();

            done(results);
        });

        ab.stdout.pipe(process.stdout);
        ab.stderr.pipe(process.stderr);
    }

};
