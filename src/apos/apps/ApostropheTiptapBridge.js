import Vue from 'apostrophe/vue';

export default function() {
  apos.on('tiptapStart', function(aposEditor, options) {
    const type = aposEditor.$widget.attr('data-apos-widget');
    const widgetEditorComponentType = apos.areas.getWidgetManager(type).options.components.widgetEditor;
    aposEditor.tiptapApp = new Vue({
      el: aposEditor.$richText[0],
      data: {
        value: {
          content: options.content
        },
        options: aposEditor.options,
        original: aposEditor.$richText.clone(),
        type,
        widgetEditorComponentType
      },
      methods: {
        blur() {
          // Currently this results in loss of focus on any use of a menu button associated
          // with the editor, modal associated with the editor, etc.
          // aposEditor.stop();
        },
        stop() {
          this.original.html(this.value.content);
          $(this.$el).replaceWith(this.original);
        }
      },
      template: `
  <Component :is="widgetEditorComponentType" @blur="blur" :type="type" :value="value" :options="options" />
  `
    });
    aposEditor.$widget.data('tiptapApp', aposEditor.tiptapApp);
    // This is a temporary solution to the deficiencies of tiptap blur events.
    // One concern is that it does not account for tabbing/shift-tabbing
    aposEditor.focusWatcher = function(e) {
      if (!$(e.target).closest(aposEditor.$widget).length) {
        aposEditor.stop();
      } 
    };
    // Install on next tick to avoid being fired for the original click that opened
    // the editor in some cases, such as in a pieces modal
    setImmediate(function() {
      $('body').on('click', aposEditor.focusWatcher);
    });
  });

  apos.on('tiptapStop', function(aposEditor) {
    aposEditor.focus = false;
    aposEditor.tiptapApp.stop();
    $('body').off('click', aposEditor.focusWatcher);
  });
}

