<script setup lang="ts">
const id = useRoute().path.split("/")[2];
const lawyers = ref();
const consult = ref();

consult.value = await $fetch(`/api/consults/${id}`).catch((error) => console.log(error.data));

lawyers.value = await $fetch(`/api/lawyers/${consult.value[0].lawyer_id}/except`).catch((error) => console.log(error.data));
</script>
<template>
  <div class="hero-body" style="background-color: rgba(230, 230, 230); padding-bottom: 600px">
    <div class="container" style="background-color: rgba(0, 255, 255, 0)">
      <div class="column is-4 is-offset-4" style="background-color: rgba(240, 248, 255, 0)">
        <article class="message is-dark" style="border-radius: 20px">
          <div class="message-header" style="border-radius: 10px 10px 0px 0px">
            <h1 class="title p-1" style="font-size: x-large; color: white">
              Referir abogado
            </h1>
          </div>
          <div class="message-body">
            <referCard :lawyers="lawyers" :consult="consult"></referCard>
            <div class="buttons has-addons is-centered">
              <NuxtLink :to="`/profile`" class="button mt-5 is-dark is-rounded">Cancelar</NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
