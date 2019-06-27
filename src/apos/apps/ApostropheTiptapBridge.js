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
        $original: aposEditor.$richText.clone(),
        type,
        widgetEditorComponentType
      },
      template: `
  <Component :is="widgetEditorComponentType" :type="type" :value="value" :options="options" />
  `
    });
    aposEditor.$widget.data('tiptapApp', aposEditor.tiptapApp);
  });

  apos.on('tiptapStop', function(aposEditor) {
    aposEditor.tiptapApp.$original.html(aposEditor.tiptapApp.value);
    $(self.tiptapApp.el).replaceWith(aposEditor.tiptapApp.$original);
    aposEditor.focus = false;
    aposEditor.tiptapApp = null;
    aposEditor.$widget.data('tiptapApp', null);
  });
}

