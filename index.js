// Implements Vue-based rich text editor widgets. Unlike most widget types,
// the rich text editor does not use a modal; instead you edit in context
// on the page.

const fs = require('fs-extra');

module.exports = {
  improve: 'apostrophe-rich-text-widgets',

  beforeConstruct: function(self, options) {
    options.browser = Object.assign({}, {
      components: {
        widgetEditor: 'ApostropheRichTextWidgetEditor'
      },
      tools: {
        styles: {
          component: 'ApostropheTiptapStyles',
          label: 'Styles'
        },
        '|': {
          component: 'ApostropheTiptapDivider',
          icon: 'PowerOn'
        },
        bold: {
          component: 'ApostropheTiptapButton',
          label: 'Bold',
          icon: 'FormatBold'
        },
        italic: {
          component: 'ApostropheTiptapButton',
          label: 'Italic',
          icon: 'FormatItalic'
        },
        horizontal_rule: {
          component: 'ApostropheTiptapButton',
          label: 'Horizontal Rule',
          icon: 'WindowMinimize'
        },
        link: {
          component: 'ApostropheTiptapLink',
          label: 'Link',
          icon: 'Link'
        },
        bullet_list: {
          component: 'ApostropheTiptapButton',
          label: 'Bullets',
          icon: 'FormatListBulleted'
        },
        ordered_list: {
          component: 'ApostropheTiptapButton',
          label: 'Ordered',
          icon: 'FormatListNumbered'
        },
        strike: {
          component: 'ApostropheTiptapButton',
          label: 'Strike',
          icon: 'FormatStrikethrough'
        },
        blockquote: {
          component: 'ApostropheTiptapButton',
          label: 'Blockquote',
          icon: 'FormatQuoteOpen'
        },
        code_block: {
          component: 'ApostropheTiptapButton',
          label: 'Code Block',
          icon: 'CodeBraces'
        },
        undo: {
          component: 'ApostropheTiptapButton',
          label: 'Undo',
          icon: 'Undo'
        },
        redo: {
          component: 'ApostropheTiptapButton',
          label: 'Redo',
          icon: 'Redo'
        },
        table: {
          component: 'ApostropheTiptapTable',
          icon: 'Table',
          // createTable is always allowed when this component is present in the toolbar,
          // these are the actions allowed on an existing table
          actions: [
            'deleteTable',
            'addColumnBefore',
            'addColumnAfter',
            'deleteColumn',
            'addRowBefore',
            'addRowAfter',
            'deleteRow',
            'toggleCellMerge',
            'toggleHeaderRow',
            'toggleHeaderColumn'
          ],
          icons: {
            createTable: 'Table',
            deleteTable: 'TableRemove',
            addColumnBefore: 'TableColumnPlusBefore',
            addColumnAfter: 'TableColumnPlusAfter',
            deleteColumn: 'TableColumnRemove',
            addRowBefore: 'TableRowPlusBefore',
            addRowAfter: 'TableRowPlusAfter',
            deleteRow: 'TableRowRemove',
            toggleCellMerge: 'TableMergeCells',
            toggleHeaderRow: 'TableHeaderRow',
            toggleHeaderColumn: 'TableHeaderColumn'
          },
          labels: {
            createTable: 'Create Table',
            deleteTable: 'Delete Table',
            addColumnBefore: 'Add Column Before',
            addColumnAfter: 'Add Column After',
            deleteColumn: 'Delete Column',
            addRowBefore: 'Add Row Before',
            addRowAfter: 'Add Row After',
            deleteRow: 'Delete Row',
            toggleCellMerge: 'Merge Cells',
            toggleHeaderRow: 'Toggle Table Header Row',
            toggleHeaderColumn: 'Toggle Table Header Column'

          }
        },
        modal: {
          component: 'ApostropheTiptapImportData',
          label: 'Upload',
          icon: 'FileUpload'
        },
        import: {
          component: 'ApostropheTiptapImportData',
          label: 'Upload',
          icon: 'FileUpload'
        }
      }
    }, options.browser || {});
  },

  construct: function(self, options) {

    const superGetCreateSingletonOptions = self.getCreateSingletonOptions;
    self.getCreateSingletonOptions = function(req) {
      if (options.tiptap === false) {
        return {
          ...superGetCreateSingletonOptions(req),
          tiptap: false
        };
      } else {
        const result = {
          ...superGetCreateSingletonOptions(req),
          tools: self.options.browser.tools,
          components: self.options.browser.components
        };
        return result;
      }
    };

    if (options.tiptap === false) {
      return;
    }

    const superPushAssets = self.pushAssets;
    self.pushAssets = function() {
      // If project level bundle exists, push that instead.
      // The default push-both behavior would be problematic here
      var pushing = fs.existsSync(self.apos.rootDir + '/lib/modules/apostrophe-rich-text-widgets/public/js/project-tiptap-bundle.js') ? 'project-tiptap-bundle' : 'tiptap-bundle';
      self.pushAsset('script', pushing, { when: 'user' });
      superPushAssets();
    };

    self.addTask('build', 'Build the tiptap-bundle.js asset bundle that powers this module on the front end', async function(apos, argv) {

      // This is a cut-down version of the webpack build used for all
      // 3.x assets as of July 24th, 2019. It supports finding stuff
      // in this module, both npm level and project level, but
      // that's it. TODO: some better shared way of allowing future
      // 2.x Vue-based backports to cooperate on this. -Tom

      const glob = require('glob');
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

      const buildDir = apos.rootDir + '/data/temp/tiptap-build';
      fs.mkdirpSync(buildDir);
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
      const outputDir = argv.npm ? (__dirname + '/public/js') : (apos.rootDir + '/lib/modules/apostrophe-rich-text-widgets/public/js');
      const moduleNpmDir = __dirname + '/node_modules';
      const projectNpmDir = apos.rootDir + '/node_modules';
      fs.mkdirpSync(outputDir);
      await require('util').promisify(webpack)({
        entry: importFile,
        mode: 'development',
        optimization: {
          minimize: false
        },
        output: {
          path: outputDir,
          filename: argv.npm ? 'tiptap-bundle.js' : 'project-tiptap-bundle.js'
        },
        resolveLoader: {
          extensions: ['*', '.js', '.vue', '.json'],
          modules: argv.npm ? [moduleNpmDir] : [moduleNpmDir, projectNpmDir]
        },
        resolve: {
          extensions: ['*', '.js', '.vue', '.json'],
          alias: {
            'apostrophe/vue$': 'vue/dist/vue.esm.js'
          },
          modules: argv.npm ? [moduleNpmDir] : [moduleNpmDir, projectNpmDir]
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
          if (argv.npm && (!entry.dirname.match(/node_modules/))) {
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
