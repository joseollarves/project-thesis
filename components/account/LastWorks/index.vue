<script setup lang="ts">
// ID del abogado
const props = defineProps({
  id: {
    type: String,
    default: '',
  }
});

// Constante a utilizar
const cases = ref();

// Guardamos los casos en los que este involucrado el abogado
cases.value = await $fetch(`/api/cases/collaborators/${props.id}/lawyerProfile`).catch((error) => console.log(error.data));
cases.value = cases.value.slice(-3);
</script>

<template>
  <div class="column is-6 modal-button" data-target="modal-card">
    <div class="card is-shady" style="border-radius: 30px;">
      <div class="block">
        <h1 class="title p-4" style="background-color: gainsboro; border-radius: 30px 30px 0px 0px;">
          <i class="fa fa-suitcase fa-fw mr-3"></i>Trabajos Recientes
        </h1>
      </div>
      <div v-for="caso in cases" class="card-content" style="margin-bottom: -50px;">
        <accountLastWorksPost :caso="caso"></accountLastWorksPost>
      </div>
      <div class="buttons has-addons is-centered" style="padding: 10px; margin-bottom: -30px;">
        <NuxtLink :to="`/projects/${props.id}`" class="button is-rounded">Ver todos</NuxtLink>
      </div>
      <br />
    </div>
    <!--<hr />
    <div class="card is-shady" style="border-radius: 30px;">
      <div class="block">
        <h1 class="title p-4" style="background-color: gainsboro; border-radius: 30px 30px 0px 0px;">
          <i class="fa fa-certificate fa-fw mr-3"></i>Postgrados y trabajos de
          investigacion
        </h1>
      </div>
      <div class="card-content">
        <accountLastWorksStudies></accountLastWorksStudies>
      </div>
      <div class="buttons has-addons is-centered is-rounded">
        <NuxtLink class="button is-rounded">Ver todos</NuxtLink>
      </div>
      <br />
    </div>-->
  </div>
</template>
