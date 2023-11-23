<script setup lang="ts">
const props = defineProps({
  lawyer: {
    type: Object,
    default: {},
  },
});
</script>

<template>
  <th>
    <NuxtLink class="panel-block">{{props.lawyer.name}}</NuxtLink>
  </th>
  <td>
    <NuxtLink class="panel-block">{{props.lawyer.email}}</NuxtLink>
  </td>
  <td v-for="specialization in props.lawyer.specializations">
    <NuxtLink class="panel-block">{{specialization}}</NuxtLink>
  </td>
</template>
