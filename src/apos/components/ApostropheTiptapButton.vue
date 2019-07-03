<template>
  <button :data-apos-tooltip="tool.label" @click="click()" class="apos-tiptap-menubar__button" :class="{ 'apos-tiptap-menubar__button--active': active() }">
    <span v-if="icon">
      <component :title="tool.label" :size="18" :is="icon"/>
    </span>
    <span v-else>
      {{ tool.label }}
    </span>
  </button>
</template>

<script>

import FormatBold from 'vue-material-design-icons/FormatBold.vue'
import FormatItalic from 'vue-material-design-icons/FormatItalic.vue'
import WindowMinimize from 'vue-material-design-icons/WindowMinimize.vue'
import Link from 'vue-material-design-icons/Link.vue'
import FormatListBulleted from 'vue-material-design-icons/FormatListBulleted.vue'
import FormatListNumbered from 'vue-material-design-icons/FormatListNumbered.vue'
import FormatStrikethrough from 'vue-material-design-icons/FormatStrikethrough.vue'
import FormatQuoteOpen from 'vue-material-design-icons/FormatQuoteOpen.vue'
import CodeBraces from 'vue-material-design-icons/CodeBraces.vue'
import Undo from 'vue-material-design-icons/Undo.vue'
import Redo from 'vue-material-design-icons/Redo.vue'
import Table from 'vue-material-design-icons/Table.vue'

export default {
  name: 'ApostropheTiptapButton',
  props: {
    name: String,
    editor: Object,
    tool: Object,
    icon: String
  },
  components: { 
    FormatBold,
    FormatItalic,
    WindowMinimize,
    Link,
    FormatListBulleted,
    FormatListNumbered,
    FormatStrikethrough,
    FormatQuoteOpen,
    CodeBraces,
    Undo,
    Redo,
    Table 
  },
  methods: {
    command() {
      return this.tool.command || this.name;
    },
    click() {
      this.editor.commands[this.command()](this.tool.commandParameters || {});
    },
    active() {
      let activeTester = this.editor.isActive[this.command()];
      if (!activeTester) {
        return false;
      }
      activeTester.bind(this.editor);
      return activeTester(this.tool.commandParameters);
    }
  }
};
</script>

<style>
  .apos-tiptap-menubar__button {
    color: white;
    padding: 1.1rem 0.8rem;
  }

  .apos-tiptap-menubar__button:hover {
    cursor: pointer;
    background-color: #121212
  }

  .apos-tiptap-menubar__button--active {
    background-color: #8246DD;
  }

  .apos-tiptap-menubar__button--active:hover {
    background-color: #6D38BD;
  }
</style>