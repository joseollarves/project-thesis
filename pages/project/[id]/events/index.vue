<script setup lang="js">

// Constantes a utilizar
const id = useRoute().path.split("/")[2];
const caso = ref();
caso.value = await $fetch(`/api/cases/${id}`).catch((error) => console.log(error.data));
</script>

<template>
  <accountNav/>
  <div class="columns">
    <projectSidebar :caso="caso"/>
    <div class="column is-10 modal-button" data-target="modal-card">
      <div class="card is-shady"
        style="border-radius: 30px; padding-bottom: 400px; margin-top: 10px; margin-right: 10px;">
        <div class="block" style="margin-bottom: -0px">
          <p class="title p-4" style="background-color: gainsboro; border-radius: 30px 30px 0px 0px;">
            <i class="fa fa-calendar-o" aria-hidden="true" style="margin-right: 7px"></i>
            Lista de Eventos
          </p>
        </div>
        <div class="column messages is-fullheight pb-4">
          <div class="inbox-messages">
            <div class="block">
              <ProjectEventsOptions :id="id" :motive="caso.motive" v-if="caso.status != false"/>
              <br />
              <ProjectEventsTable :id="id"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
