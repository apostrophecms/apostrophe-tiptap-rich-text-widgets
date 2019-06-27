<template>
  <span>
    <button @click="createTable">
      {{ tool.labels.createTable }}
    </button>
    <span v-if="active()">
      <button v-for="action in actions" @click="editor.commands[action]">
        {{ tool.labels[action] }}
      </button>
    </span>
  </span>
</template>

<script>
export default {
  name: 'ApostropheTiptapTable',
  props: {
    editor: Object,
    tool: Object,
    actions: Array
  },
  methods: {
    createTable() {
      this.editor.commands.createTable({ rowsCount: 3, colsCount: 3, withHeaderRow: false });
    },
    active() {
      const result = this.editor.isActive.table();
      console.log(result);
      return result;
    }
  }
};
</script>
<style>
  td {
    min-width: 12px;
    min-height: 12px;
    border: 1px solid black;
  }
</style>
