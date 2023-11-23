<script setup lang="ts">
// Middleware
definePageMeta({
  middleware: ["auth"],
});

// Constantes a utilizar
const id = useRoute().path.split("/")[2];
const tasks = ref();
const caso = ref();

// Obtenemos los datos del caso
caso.value = await $fetch(`/api/cases/${id}`).catch((error) => console.log(error.data));

// Guardamos las tareas
tasks.value = await $fetch(`/api/cases/${id}/tasks`).catch((error) => console.log(error.data));

</script>
<template>
  <accountNav />
  <div class="columns">
    <projectSidebar :caso="caso"/>
    <div class="column is-10 modal-button" data-target="modal-card">
      <div class="card is-shady" style=" border-radius: 30px; padding-bottom: 400px; margin-top: 10px; margin-right: 10px;">
        <div class="block" style="margin-bottom: -0px">
          <p class="title p-4" style=" background-color: gainsboro; border-radius: 30px 30px 0px 0px;" >
            <i class="fa fa-thumb-tack" aria-hidden="true" style="margin-right: 7px"></i>
            Lista de Tareas
          </p>
        </div>
        <div class="column messages is-fullheight pb-4">
          <div class="inbox-messages">
            <div class="block">
              <ProjectTaskOptions :id="id" v-if="caso.status != false"/>
              <br />
              <ProjectTaskTable :tasks="tasks"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
