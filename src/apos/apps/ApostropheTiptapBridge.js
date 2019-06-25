import Vue from 'apostrophe/vue';

export default function() {
  apos.on('tiptapStart', function(aposEditor, options) {
    const type = aposEditor.$widget.attr('data-apos-widget');
    const widgetEditorComponentType = apos.areas.getWidgetManager(type).options.components.widgetEditor;
    console.log('Initial content: ' + options.content);
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
      // TODO: figure out how we participate in getData
      template: `
  <Component :is="widgetEditorComponentType" :type="type" :value="value" :options="options" />
  `
    });
  });

  apos.on('tiptapStop', function(aposEditor) {
    aposEditor.tiptapApp.$original.html(aposEditor.tiptapApp.value);
    $(self.tiptapApp.el).replaceWith(aposEditor.tiptapApp.$original);
    aposEditor.focus = false;
  });
}

