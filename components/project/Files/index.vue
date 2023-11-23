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
    <NuxtLink :to="`/project/${caso.id}`" class="panel-block">{{caso.number}}</NuxtLink>
  </th>
  <td>
    <NuxtLink :to="`/project/${caso.id}`" class="panel-block">{{caso.motive}}</NuxtLink>
  </td>
  <td>
    <NuxtLink :to="`/project/${caso.id}`" class="panel-block">{{caso.demandant}}</NuxtLink>
  </td>
  <td>
    <NuxtLink :to="`/project/${caso.id}`" class="panel-block">{{caso.demanded}}</NuxtLink>
  </td>
  <td v-if="caso.last_performance != null">
    <NuxtLink :to="`/project/${caso.id}`" class="panel-block">{{caso.last_performance}}</NuxtLink>
  </td>
  <td v-if="caso.date_last_performance != null">
    <NuxtLink :to="`/project/${caso.id}`" class="panel-block">{{ caso.date_last_performance.split("-")[2].split("T")[0] }}-{{ caso.date_last_performance.split("-")[1] }}-{{caso.date_last_performance.split("-")[0]}}</NuxtLink>
  </td>
</template>
