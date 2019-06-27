apos.define('apostrophe-rich-text-widgets', {

  construct: function(self, options) {

    self.getData = function($widget) {
      var content;
      var editor = $widget.data('tiptapApp');
      if (editor) {
        content = editor.value.content;
      } else {
        content = $widget.find('[data-rich-text]:first').html();
      }
      // Merge with properties found in the data attribute
      // of the widget, such as _id
      var data = JSON.parse($widget.attr('data') || '{}');
      _.extend(data, {
        type: 'apostrophe-rich-text',
        content: content
      });
      return data;
    };

  }

});
