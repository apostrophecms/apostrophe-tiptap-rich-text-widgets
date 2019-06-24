<template>
  <div class="apos-richtext-editor">
    <editor-menu-bar :editor="editor">
      <div class="apos-richtext-menubar" slot-scope="{ commands, isActive }">
        <component v-for="item in toolbar"
          :is="(tools[item] && tools[item].component) || 'ApostropheTiptapUndefined'"
          :name="item"
          :tool="tools[item]"
          :options="options"
          :editor="editor"
        />
      </div>
    </editor-menu-bar>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
  HardBreak,
  ListItem,
  OrderedList,
  BulletList,
  Bold,
  Italic,
  History,
  Strike,
  Blockquote,
  CodeBlock,
  HorizontalRule
} from 'tiptap-extensions';

// Here because we cannot access computed inside data

function moduleOptionsBody(type) {
  return apos.areas.getWidgetManager(type).options;
}

function toolbarCompatibility(toolbar) {
  const ckeditorCompatible = {
    'Bold': 'bold',
    'Italic': 'italic',
    'Anchor': 'link',
    'Styles': 'styles',
    'Blockquote': 'blockquote',
    'Link': 'link',
    'Unlink': 'link',
    'BulletedList': 'bullet_list',
    'OrderedList': 'ordered_list',
    'HorizontalRule': 'horizontal_rule',
    'Redo': 'redo',
    'Undo': 'undo',
    'Strikethrough': 'strike'
  };
  toolbar = toolbar.map(item => {
    if (ckeditorCompatible[item]) {
      return ckeditorCompatible[item];
    }
    return item;
  });
  const seen = {};
  toolbar = toolbar.filter(item => {
    if (seen[item]) {
      return false;
    }
    seen[item] = true;
    return true;
  });
  console.log(toolbar);
  return toolbar;
}

function stylesCompatibility(styles) {
  styles.forEach(style => {
    style.tag = style.tag || style.element;
    style.label = style.label || style.name;
  });
}

export default {
  name: 'ApostropheRichTextWidgetEditor',
  components: {
    EditorMenuBar,
    EditorContent
  },
  props: {
    type: String,
    options: Object,
    value: Object
  },
  computed: {
    moduleOptions() {
      return moduleOptionsBody(this.type);
    }
  },
  data() {
    stylesCompatibility(this.options.styles || []);
    const result = {
      tools: moduleOptionsBody(this.type).tools,
      toolbar: toolbarCompatibility(this.options.toolbar),
      editor: new Editor({
        extensions: [
          new BulletList(),
          new HardBreak(),
          new ListItem(),
          new OrderedList(),
          new Bold(),
          new Italic(),
          new History(),
          new Strike(),
          new Blockquote(),
          new CodeBlock(),
          new HorizontalRule()
        ].concat((apos.tiptapExtensions || []).map(C => new C(this.options))),
        autoFocus: true,
        onUpdate: this.update,
        content: this.value.content
      }),
      widgetInfo: {
        data: this.value,
        hasErrors: false,
      }
    };
    return result;
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    update() {
      const content = this.editor.getHTML();
      const widget = this.widgetInfo.data;
      widget.content = content;

      this.$emit('input', this.widgetInfo.data);
    },
    command(name, options) {
      this.commands[name](options);
    }
  }
};
</script>

<style type="text/css">
  .apos-richtext-menubar {
    margin: 12px 0;
  }
</style>
