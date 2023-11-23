<script setup lang="ts">
const props = defineProps({
  performance: {
    type: Object,
    default: {},
  }
})
console.log(props.performance);
</script>

<template>
  <a class="panel-block">
    <span class="panel-icon">
      <i class="fa fa-calendar-o" aria-hidden="true"></i>
    </span>
    {{ props.performance.name }}
  </a>
</template>