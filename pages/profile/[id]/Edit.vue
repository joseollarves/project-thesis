<script setup lang="ts">
// Middleware
definePageMeta({
  middleware: ["auth"],
});

// Constantes a utilizar
const id = useRoute().path.split('/')[2];
const data = ref();

// Obtenemos los datos del abogado
data.value = await $fetch(`/api/lawyers/${id}`).catch((error) => console.log(error.data));
const lawyer = ref(data.value);

</script>
<template>
  <div class="block">
    <accountNav></accountNav>
    <section class="container">
      <br />
      <div class="columns is-centered">
        <accountProfileEdit :lawyer="lawyer"></accountProfileEdit>
      </div>
    </section>
  </div>
</template>
