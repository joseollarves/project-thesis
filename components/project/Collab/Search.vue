<script setup lang="ts">
// Constante a utilizar
const search = useCollaboratorsSearch();
</script>
<template>
  <div class="field is-grouped">
    <p class="control is-expanded">
      <input
        v-model="search"
        class="input is-rounded"
        type="text"
        placeholder="Buscar un colaborador"
      />
    </p>
  </div>
</template>
