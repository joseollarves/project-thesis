<script setup lang="ts">

// Datos del abogado
const props = defineProps({
  lawyer: {
    type: Object,
    default: {},
  },
});

const consults = ref();

// Obtenemos las consultas
consults.value = await $fetch(`/api/lawyers/${props.lawyer.id}/consults`).catch((error) => console.log(error.data));
consults.value = consults.value.slice(-2);

</script>

<template>
  <div class="column is-3 modal-button" data-target="modal-card">
    <div class="card is-shady" style="border-radius: 30px; height: 650px;">
      <div class="block" style="margin-bottom: -0px;">
        <p class="title p-4" style="background-color: gainsboro; border-radius: 30px 30px 0px 0px;">
          <i class="fa fa-envelope" aria-hidden="true" style="margin-right: 7px;"></i>
            Bandeja
        </p>
      </div>
      <div class="column messages is-fullheight pb-4">
        <div class="inbox-messages">
          <div class="block">
            <accountFeedMsg :lawyer="props.lawyer" :consults="consults"></accountFeedMsg>
          </div>
          <div v-if="consults.length > 0" class="buttons has-addons is-centered">
            <NuxtLink :to="`/profile/${props.lawyer.id}/consults`" class="button is-rounded" style="margin-top: -10px;">Ver todos</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
