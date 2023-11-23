<script setup lang="ts">
// Constante a utilizar
const search = useFileSearch();
</script>

<template>
  <div class="field is-grouped">
    <p class="control is-expanded">
      <input
        v-model="search"
        class="input is-rounded"
        type="text"
        placeholder="Buscar un archivo"
      />
    </p>
  </div>
</template>
