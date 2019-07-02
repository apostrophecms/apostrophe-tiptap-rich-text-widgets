<template>
  <div class="apos-tiptap-editor">
    <div class="apos-tiptap-menubar__bubble"></div>
    <editor-menu-bar :editor="editor">
      <div class="apos-tiptap-menubar" slot-scope="{ commands, isActive }">
        <component v-for="item in toolbar"
          :is="(tools[item] && tools[item].component) || 'ApostropheTiptapUndefined'"
          :name="item"
          :tool="tools[item]"
          :options="options"
          :editor="editor"
          :icon="tools[item].icon"
        />
      </div>
    </editor-menu-bar>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
import { Doc, Text } from 'tiptap';
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
  HorizontalRule,
  Table,
  TableHeader,
  TableCell,
  TableRow
} from 'tiptap-extensions';

// Must be added early as extensions for core tags are very
// order dependent. TODO: a way for regular tiptap extensions
// delivered in other modules to participate in the ordering
// process. Right now those all go at the end
import Paragraph from '../tiptap-extensions/special/Paragraph';

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
    'Strikethrough': 'strike',
    'Table': 'table'
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
          new Doc(),
          new Text(),
          new Paragraph(),
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
          new HorizontalRule(),
          new Table(),
          new TableHeader(),
          new TableCell(),
          new TableRow()
        ].concat((apos.tiptapExtensions || []).map(C => new C(this.options))),
        autoFocus: true,
        onUpdate: this.update,
        content: this.value.content,
        useBuiltInExtensions: false
      }),
      widgetInfo: {
        data: this.value,
        hasErrors: false,
      }
    };
    result.editor.setContent(this.value.content);
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
.apos-tiptap-menubar {
  position: absolute;
  z-index: 150;
  display: flex;
  align-items: center;
  justify-content: center;
  top: -70px;
  background-color: #323232;
  color: white;
  border-radius: 4px;
  padding: 0 10px;
}

.apos-tiptap-editor .ProseMirror:focus {
  border: none;
  outline: 2px solid #6516DD;
  outline-offset: 10px;
}

.apos-tiptap-menubar__bubble {
  position: absolute;
  pointer-events: none;
  z-index: 1;
  bottom: 10px;
  left: 20px;
  background-color: #323232;
  border-radius: 4px;
  height: 35px;
  width: 35px;
  bottom: auto;
  top: -58px;
  transform: rotate(45deg);
}
</style>
