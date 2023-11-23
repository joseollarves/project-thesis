<script setup lang="ts">
// Middleware
definePageMeta({
  middleware: ["auth"],
});

// Tipo Abogado
interface lawyer {
  id: string;
  name: string | null;
  email: string | null;
  description: string | null;
  specializations: string[];
  profile_picture: string | null;
}

// Constantes a utilizar
const id = useRoute().path.split("/")[2];
const lawyers = ref();
const caso = ref();

// Obtenemos los datos del caso y de los abogados disponibles
caso.value = await $fetch(`/api/cases/${id}`).catch((error) =>
  console.log(error.data)
);
lawyers.value = await $fetch("/api/lawyers").catch((error) =>
  console.log(error.data)
);

const filteredLawyers = lawyers.value.filter((lawyer: lawyer) => !caso.value.collaborators.includes(lawyer.id));
</script>
<template>
  <div class="hero-body" style="background-color: rgba(230, 230, 230); padding-bottom: 600px">
    <div class="container" style="background-color: rgba(0, 255, 255, 0)">
      <div class="column is-4 is-offset-4" style="background-color: rgba(240, 248, 255, 0)">
        <article class="message is-dark" style="border-radius: 20px">
          <div class="message-header" style="border-radius: 10px 10px 0px 0px">
            <h1 class="title p-1" style="font-size: x-large; color: white">
              Seleccione un Colaborador
            </h1>
          </div>
          <div class="message-body">
            <projectCollabLawyers
              :caso="caso"
              :lawyers="filteredLawyers"
            ></projectCollabLawyers>

            <div class="buttons has-addons is-centered">
              <NuxtLink
                :to="`/project/${id}/collaborators`"
                class="button mt-5 is-dark is-rounded"
                >Cancelar</NuxtLink
              >
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
