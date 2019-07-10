<template>
  <div class="apos-tiptap-format">
    <FormatSize title="Text Format" :size="18" />
    <select class="apos-tiptap-format__select" :value="active()" @change="style">
      <option value="">----</option>
      <option v-for="style, i in options.styles" :value="i">{{ style.label }}</option>
    </select>
  </div>
</template>

<script>

import FormatSize from 'vue-material-design-icons/FormatSize.vue'

export default {
  name: 'ApostropheTiptapStyles',
  components: { FormatSize },
  props: {
    name: String,
    editor: Object,
    tool: Object,
    options: Object
  },
  methods: {
    active() {
      const styles = this.options.styles || [];
      for (let i = 0; (i < styles.length); i++) {
        const style = styles[i];
        const attrs = {
          class: style.class || null,
        };
        if (style.tag === 'p') {
          if (this.editor.isActive.paragraph(attrs)) {
            return i;
          }
        } else {
          attrs.tag = style.tag;
          if (this.editor.isActive.styles(attrs)) {
            return i;
          }
        }
      }
      return -1;
    },
    style($event) {
      let style = this.options.styles[$event.target.value];
      if (!style) {
        // None selected, no action
        return;
      }
      const attrs = {
        class: style.class || null
      };
      if (style.tag === 'p') {
        this.editor.commands.paragraph(attrs);
      } else {
        attrs.tag = style.tag;
        this.editor.commands.styles(attrs);
      }
    }
  }
};
</script>

<style>
  .apos-tiptap-format {
    display: flex;
    padding: 10px 8px;
  }

  .apos-tiptap-format__select {
    background-color: transparent;
    color: white;
    border: none;
    font-size: 14px;
  }

</style>
