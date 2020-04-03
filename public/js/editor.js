apos.define('apostrophe-rich-text-widgets-editor', {

  afterConstruct: function(self) {
    apos.utils.log(self.__meta.name);
    apos.utils.log('>>', apos.modules[self.__meta.name.replace(/-editor$/, '')].options);
    if (apos.modules[self.__meta.name.replace(/-editor$/, '')].options.tiptap === false) {
      return;
    }
    return self.start();
  },

  construct: function(self, options) {
    apos.utils.log(self.__meta.name);
    apos.utils.log('>>', apos.modules[self.__meta.name.replace(/-editor$/, '')].options);
    if (apos.modules[self.__meta.name.replace(/-editor$/, '')].options.tiptap === false) {
      return;
    }

    // Start contextual editing (on click for instance)

    self.start = function() {
      apos.utils.log('Starting!');
      if (self.started || options.readOnly) {
        return;
      }

      self.$richText = self.$widget.find('[data-rich-text]:first');

      self.options.styles = self.options.styles || [];
      self.options.toolbar = self.options.toolbar || [];

      self.focus = false;

      // Bulk of the work happens in the Bridge Vue app

      apos.emit('tiptapStart', self, {
        content: self.$richText.html()
      });

      // TODO self.focus updates

      self.$richText.data('aposRichTextState', 'started');
      self.$widget.trigger('aposRichTextStarted');

      self.setActive(true);
      self.started = true;

    };

    // End contextual editing (on blur for instance)

    self.stop = function() {

      apos.emit('tiptapStop', self);
      // Above event handler populates self.data
      self.$richText.html(self.data);
      self.$richText.data('aposRichTextState', undefined);
      self.$widget.trigger('aposRichTextStopped');
      self.started = false;
      self.setActive(false);
    };

  }
});
