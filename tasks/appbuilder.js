/*
 * grunt-contrib-appbuilder
 * https://github.com/tgardner/grunt-contrib-appbuilder
 *
 * Copyright (c) 2014 Trent Gardner
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
    grunt.registerMultiTask('appbuilder', 'Grunt task to execute the Telerik AppBuilder CLI', function() {
        var done = this.async(),
            options;

        options = this.options({
            liveSync: true,
            download: true,
            companion: false,
            certificate: '',
            provision: ''
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
            env = process.env,
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
            args.push("--path");
            args.push(project);
        }

        if(!options.liveSync) {
            args.push("--no-livesync");
        }

        if(options.download) {
            args.push("--download");

            if(dest) {
                args.push("--save-to");
                args.push(dest);
            }
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
        grunt.log.debug(command);

        ab = exec(command, {
            cwd: process.cwd(),
            timeout: 0,
            killSignal: 'SIGTERM',
            env: env
        });

        ab.stdout.on('data', function (data) {
            grunt.log.write(data);
        });

        ab.stderr.on('data', function (data) {
            grunt.log.errorlns(data);
        });

        ab.on('exit', function (code) {
            done(code === 0);
        });
    }

};
