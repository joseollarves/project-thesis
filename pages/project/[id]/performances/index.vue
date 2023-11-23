<script setup lang="ts">
// Middleware
definePageMeta({
  middleware: ["auth"],
});

// Constantes a utilizar
const id = useRoute().path.split("/")[2];
const performances = ref();
const caso = ref();

// Obtenemos los datos del caso
caso.value = await $fetch(`/api/cases/${id}`).catch((error) => console.log(error.data));
// Obtenemos las actuaciones
performances.value = await $fetch(`/api/cases/${id}/performances`).catch((error) => console.log(error.data));

</script>
<template>
  <accountNav/>
  <div class="columns">
    <projectSidebar :caso="caso"/>
    <div class="column is-10 modal-button" data-target="modal-card">
      <div class="card is-shady" style=" border-radius: 30px; padding-bottom: 400px; ">
        <div class="block" style="margin-bottom: -0px">
          <p class="title p-4" style=" background-color: gainsboro; border-radius: 30px 30px 0px 0px;">
            <i class="fa fa-handshake-o" aria-hidden="true" style="margin-right: 7px"></i>
            Lista de Actuaciones
          </p>
        </div>
        <div class="column messages is-fullheight pb-4">
          <div class="inbox-messages">
            <div class="block">
              <ProjectPerformancesOptions :id="id" :performances="performances" v-if="caso.status != false"/>
              <br />
              <ProjectPerformancesTable :performances="performances"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
