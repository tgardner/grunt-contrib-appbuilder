# grunt-contrib-appbuilder

> Grunt task to build a mobile application using the [Telerik AppBuilder CLI](http://www.telerik.com/appbuilder/command-line-interface)

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-contrib-appbuilder --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-contrib-appbuilder');
```

## The "appbuilder" task

### Overview
In your project's Gruntfile, add a section named `appbuilder` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  appbuilder: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.platform
Type: `String`
Default value: `'android'`

The target build platform can be either, android, ios, wp8.

#### options.liveSync
Type: `Boolean`
Default value: `true`

Enables LiveSync with the three-finger tap and hold gesture.

#### options.download
Type: `Boolean`
Default value: `true`

Downloads the application package to the root of the project

#### options.companion
Type: `Boolean`
Default value: `false`

Produces a QR code for deployment in the Telerik AppBuilder companion app.
You cannot set both the companion and download switches.

#### options.certificate
Type: `String`
Default value: `''`

Sets the certificate that you want to use for code signing your iOS or Android app.

#### options.provision
Type: `String`
Default value: `''`

Sets the provisioning profile that you want to use for code signing your iOS app.

### Usage Examples

```js
grunt.initConfig({
    appbuilder: {
      files: {
        "HelloWorld.apk": ["test/HelloWorld"]
      },
      options: {
        liveSync: false
      }
    },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
- 0.1.2 Escaped string inputs
- 0.1.1 Set android as the default platform
- 0.1.0 Initial Implementation