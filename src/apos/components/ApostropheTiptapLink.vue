<template>
  <div class="apostrophe-tiptap-link-control">
    <button @click="click()" class="apos-tiptap-menubar__button" :class="{ 'apos-tiptap-menubar__button--active': active() }">
      <Link :title="tool.label" :size="18" />
    </button>
    <ApostropheWindow v-if="editing">
      <template slot="body">
        <form v-if="editing">
          <fieldset class="apos-window-fieldset">
            <label class="apos-window-label" for="href">URL</label>
            <input class="apos-window-input" v-model="href" />
          </fieldset>
          <fieldset class="apos-window-fieldset">
            <label class="apos-window-label" for="id">Anchor Name</label>
            <input class="apos-window-input" v-model="id" />
          </fieldset>
          <fieldset class="apos-window-fieldset">
            <label class="apos-window-label" for="target">Target</label>
            <input class="apos-window-input" v-model="target" />
          </fieldset>
        </form>
      </template>
      <template slot="footer">
        <slot name="footer">
          <button class="apos-window-button" @click="close">
            Cancel
          </button>
          <button class="apos-window-button apos-window-button--primary" @click="save()">
            Save
          </button>
        </slot>
      </template>
    </ApostropheWindow>
  </div>
</template>

<script>

import Link from 'vue-material-design-icons/Link.vue'
import ApostropheWindow from './ApostropheWindow.vue'

export default {
  name: 'ApostropheTiptapLink',
  components: { Link, ApostropheWindow },
  props: {
    name: String,
    tool: Object,
    editor: Object
  },
  data () {
    return {
      href: '',
      id: '',
      target: '',
      editing: false
    };
  },
  methods: {
    click() {
      this.editing = !this.editing;
      if (this.editing) {
        const values = this.editor.getMarkAttrs('link');
        this.href = values.href;
        this.id = values.id;
        this.target = values.target;
      }
    },
    close() {
      this.editing = false;
      this.editor.focus();
    },
    save() {
      this.editor.commands[this.name]({
        href: this.href,
        id: this.id,
        target: this.target
      });
      this.editing = false;
    },
    active() {
      return this.editor.isActive.link();
    }
  }
};
</script>

<style type="text/css">
  .apostrophe-tiptap-link-control {
    display: inline-block;
  }
</style>
