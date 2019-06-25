<template>
  <select :value="active()" @change="style">
    <option v-for="style, i in options.styles" :value="i">{{ style.label }}</option>
  </select>
</template>

<script>

export default {
  name: 'ApostropheTiptapStyles',
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
      console.log('no match');
      return 0;
    },
    style($event) {
      let style = this.options.styles[$event.target.value];
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
