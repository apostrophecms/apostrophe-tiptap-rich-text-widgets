// Implements Vue-based rich text editor widgets. Unlike most widget types,
// the rich text editor does not use a modal; instead you edit in context
// on the page.

module.exports = {
  improve: 'apostrophe-rich-text-widgets',

  browser: {
    components: {
      widgetEditor: 'ApostropheRichTextWidgetEditor'
    },
    tools: {
      'styles': {
        component: 'ApostropheTiptapStyles',
        label: 'Styles'
      },
      '|': {
        component: 'ApostropheTiptapDivider'
      },
      'bold': {
        component: 'ApostropheTiptapButton',
        label: 'Bold'
      },
      'italic': {
        component: 'ApostropheTiptapButton',
        label: 'Italic'
      },
      'horizontal_rule': {
        component: 'ApostropheTiptapButton',
        label: 'Horizontal Rule'
      },
      'link': {
        component: 'ApostropheTiptapLink',
        label: 'Link'
      },
      'bullet_list': {
        component: 'ApostropheTiptapButton',
        label: 'Bullets'
      },
      'ordered_list': {
        component: 'ApostropheTiptapButton',
        label: 'Ordered'
      },
      'strike': {
        component: 'ApostropheTiptapButton',
        label: 'Strike'
      },
      'blockquote': {
        component: 'ApostropheTiptapButton',
        label: 'Blockquote'
      },
      'code_block': {
        component: 'ApostropheTiptapButton',
        label: 'Code Block'
      },
      'undo': {
        component: 'ApostropheTiptapButton',
        label: 'Undo'
      },
      'redo': {
        component: 'ApostropheTiptapButton',
        label: 'Redo'
      }
    }
  },

  construct: function(self, options) {

    const superGetCreateSingletonOptions = self.getCreateSingletonOptions;
    self.getCreateSingletonOptions = function(req) {
      return { 
        ...superGetCreateSingletonOptions(req),
        tools: self.options.browser.tools,
        components: self.options.browser.components
      };
    };

    const superPushAssets = self.pushAssets;
    self.pushAssets = function() {
      self.pushAsset('script', 'bundle', { when: 'user' });
      superPushAssets();
    };

    self.addTask('build', 'Build the bundle.js asset bundle that powers this module on the front end', async function(apos, argv) {

      // This is a cut-down version of the webpack build used for all
      // 3.x assets as of July 24th, 2019. It supports finding stuff
      // in this module, both npm level and project level, but
      // that's it. TODO: some better shared way of allowing future
      // 2.x Vue-based backports to cooperate on this. -Tom

      const glob = require('glob');
      const fs = require('fs-extra');
      const VueLoaderPlugin = require('vue-loader/lib/plugin');
      const webpackModule = require('webpack');

      // Wrap webpack to report its errors readably, in
      // preparation to promisify it

      function webpack(config, cb) {
        return webpackModule(config, function(err, stats) {
          if (err || stats.hasErrors()) {
            return cb(err || stats.toJson().errors.join('\n'));
          }
          return cb(null);
        });
      }

      const buildDir = __dirname + '/build';
      // Don't clutter up with previous builds.
      await fs.remove(buildDir);
      await fs.mkdir(buildDir);

      const componentImports = getImports('components', '*.vue', { registerComponents: true });
      const tiptapExtensionImports = getImports('tiptap-extensions', '*.js', { registerTiptapExtensions: true });
      const appImports = getImports('apps', '*.js', { invokeApps: true });
      const importFile = `${buildDir}/import.js`;
      fs.writeFileSync(importFile, `
import Vue from 'apostrophe/vue';
${componentImports.importCode}
${tiptapExtensionImports.importCode}
${appImports.importCode}
${componentImports.registerCode}
${tiptapExtensionImports.registerCode}
setImmediate(() => {
${appImports.invokeCode}
});
`
      );
      await require('util').promisify(webpack)({
        entry: importFile,
        mode: 'development',
        optimization: {
          minimize: false
        },
        output: {
          path: __dirname + '/public/js',
          filename: 'bundle.js'
        },
        resolveLoader: {
          extensions: ['*', '.js', '.vue', '.json'],
          modules: [ 'node_modules/apostrophe-tiptap-rich-text-editor-widgets/node_modules', 'node_modules' ]
        },
        resolve: {
          extensions: ['*', '.js', '.vue', '.json'],
          alias: {
            'apostrophe/vue$': 'vue/dist/vue.esm.js'
          },
          modules: [ 'node_modules/apostrophe-tiptap-rich-text-editor-widgets/node_modules', 'node_modules' ]
        },
        stats: 'verbose',
        module: {
          rules: [
            {
              test: /\.vue$/,
              loader: 'vue-loader'
            },
            {
              test: /\.css$/,
              use: [
                'vue-style-loader',
                'css-loader'
              ]
            },
            {
              test: /\.scss$/,
              use: [
                'vue-style-loader',
                'css-loader',
                'sass-loader'
              ]
            },
            {
              test: /\.sass$/,
              use: [
                'vue-style-loader',
                'css-loader',
                'sass-loader?indentedSyntax'
              ]
            }
          ]
        },
        plugins: [
          // make sure to include the plugin for the magic
          new VueLoaderPlugin()
        ]
      });

      function getImports(folder, pattern, options) {
        let components = [];
        const seen = {};
        // Allow project level to participate
        self.__meta.chain.forEach(function(entry) {
          if (seen[entry.dirname]) {
            return;
          }
          components = components.concat(glob.sync(`${entry.dirname}/src/apos/${folder}/${pattern}`));
          seen[entry.dirname] = true;
        });
        const output = {
          importCode: '',
          registerCode: '',
          invokeCode: ''
        };
        components.forEach(component => {
          const jsFilename = JSON.stringify(component);
          const name = require('path').basename(component).replace(/\.\w+/, '');
          const jsName = JSON.stringify(name);
          const importCode = `
          import ${name} from ${jsFilename};
          `;
          output.importCode += `${importCode}\n`;
          if (options.registerComponents) {
            output.registerCode += `Vue.component(${jsName}, ${name});\n`;
          }
          if (options.registerTiptapExtensions) {
            output.registerCode += `
apos.tiptapExtensions = apos.tiptapExtensions || [];
apos.tiptapExtensions.push(${name});
`;
          }
          if (options.invokeApps) {
            output.invokeCode += `${name}();\n`;
          }
        });
        return output;
      }

    });

  }
};