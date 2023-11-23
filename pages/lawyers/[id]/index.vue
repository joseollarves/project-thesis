<script setup lang="ts">
// Middleware
definePageMeta({
  middleware: ["auth"],
});

// Constantes a utilizar
const id = useRoute().path.split('/')[2];
const lawyer = ref();

// Obtenemos los datos del abogado
lawyer.value = await $fetch(`/api/lawyers/${id}`).catch((error) => console.log(error.data));
</script>
<template>
  <lawyerBack />
  <div class="block">
    <section class="container">
      <br />
      <div class="columns is-centered">
        <lawyerProfile :lawyer="lawyer"></lawyerProfile>
        <lawyerLastWorks :id="lawyer.id"></lawyerLastWorks>
      </div>
    </section>
  </div>
</template>
