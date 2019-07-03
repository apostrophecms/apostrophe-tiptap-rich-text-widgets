<template>
  <button>Toolbar item has no definition: {{ name }}</button>
</template>

<script>

export default {
  name: 'ApostropheTiptapUndefined',
  props: {
    name: String
  }
};
</script>