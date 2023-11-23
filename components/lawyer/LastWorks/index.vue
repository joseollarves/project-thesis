<script setup lang="ts">
// ID del abogado
const props = defineProps({
  id: {
    type: String,
    default: "",
  },
});

// Constante a utilizar
const cases = ref();

// Obtenemos los ultimos casos del abogado
cases.value = await $fetch(`/api/cases/collaborators/${props.id}/lawyerProfile`).catch((error) => console.log(error.data));
cases.value = cases.value.slice(-3);
</script>

<template>
  <div class="column is-6 modal-button" data-target="modal-card">
    <div class="card is-shady">
      <div class="block">
        <h1 class="title p-4">
          <i class="fa fa-suitcase fa-fw mr-3"></i>Trabajos Recientes
        </h1>
      </div>
      <div v-for="caso in cases" class="card-content" style="margin-bottom: -50px;">
        <lawyerLastWorksPost :caso="caso"></lawyerLastWorksPost>
      </div>
    </div>
  </div>
</template>
