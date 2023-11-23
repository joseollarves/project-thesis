<script setup lang="ts">
const props = defineProps({
  caso: {
    type: Object,
    default: {},
  },
});
</script>

<template>
  <th>
    <NuxtLink :to="`/project/${caso.id}`" class="panel-block">{{
      caso.number
    }}</NuxtLink>
  </th>
  <td>
    <NuxtLink :to="`/project/${caso.id}`" class="panel-block">{{
      caso.motive
    }}</NuxtLink>
  </td>
  <td>
    <NuxtLink :to="`/project/${caso.id}`" class="panel-block">{{
      caso.demandant
    }}</NuxtLink>
  </td>
  <td>
    <NuxtLink :to="`/project/${caso.id}`" class="panel-block">{{
      caso.demanded
    }}</NuxtLink>
  </td>
</template>
