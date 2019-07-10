<template>
  <button :data-apos-tooltip="tool.label" @click="createTable" class="apos-tiptap-menubar__button" v-if="!active()">
    <span v-if="tool.icons.createTable">
      <component :title="tool.labels.createTable" :size="18" :is="tool.icons.createTable"/>
    </span>
    <span v-else>
      {{ tool.labels.createTable }}
    </span>
  </button>
  <span v-else>
    <button v-for="action in tool.actions" @click="editor.commands[action]" :data-apos-tooltip="tool.labels[action]" class="apos-tiptap-menubar__button">
      <span v-if="tool.icons[action]">
        <component :title="tool.labels[action]" :size="18" :is="tool.icons[action]"/>
      </span>
      <span v-else>
        {{ tool.labels[action] }}
      </span>
    </button>
  </span>
</template>

<script>
export default {
  name: 'ApostropheTiptapTable',
  props: {
    editor: Object,
    tool: Object,
    options: Object
  },
  methods: {
    createTable() {
      this.editor.commands.createTable({ rowsCount: 3, colsCount: 3, withHeaderRow: false });
    },
    active() {
      return this.editor.isActive.table();
    }
  },
  components: { 
    Table,
    TableRemove,
    TableColumnPlusBefore,
    TableColumnPlusAfter,
    TableColumnRemove,
    TableRowPlusBefore,
    TableRowPlusAfter,
    TableRowRemove,
    TableMergeCells
  },
};

import Table from 'vue-material-design-icons/Table.vue'
import TableRemove from 'vue-material-design-icons/TableRemove.vue'
import TableColumnPlusBefore from 'vue-material-design-icons/TableColumnPlusBefore.vue'
import TableColumnPlusAfter from 'vue-material-design-icons/TableColumnPlusAfter.vue'
import TableColumnRemove from 'vue-material-design-icons/TableColumnRemove.vue'
import TableRowPlusBefore from 'vue-material-design-icons/TableRowPlusBefore.vue'
import TableRowPlusAfter from 'vue-material-design-icons/TableRowPlusAfter.vue'
import TableRowRemove from 'vue-material-design-icons/TableRowRemove.vue'
import TableMergeCells from 'vue-material-design-icons/TableMergeCells.vue'
</script>
<style>
  td {
    min-width: 12px;
    min-height: 12px;
    border: 1px solid black;
  }
  .apos-tiptap-menubar__button {
    color: white;
    padding: 10px 8px;
    border: none;
    background-color: transparent;
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
