<script setup lang="js">
// Middleware
definePageMeta({
  middleware: ["auth"],
});

// Constantes a utilizar
const supabase = useSupabaseClient();
const id = useRoute().path.split("/")[2];
const runtimeConfig = useRuntimeConfig();
const client_id = runtimeConfig.public.clientId;
const client_secret = runtimeConfig.public.clientSecret;
const { data: { session } } = await supabase.auth.getSession();
const lawyer = ref();

// Obtenemos los datos del abogado creador del caso
lawyer.value = await $fetch(`/api/lawyers/${id}`);

// Los datos del nuevo caso
const newCase = {
  number: '',
  motive: '',
  description: '',
  demandant: '',
  demanded: '',
  status: true,
  collaborators: [id],
  admin_data: {id: id, name: lawyer.value.name},
};

// Funcion de crear caso
async function createCase(newCase) {
  if(session.provider_token == null) {
    const newSession = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      body: JSON.stringify({
        client_id: client_id,
        client_secret: client_secret,
        refresh_token: lawyer.value.provider_refresh_token,
        grant_type: 'refresh_token',
      }),
    }).then((data) => {
      return data.json();
    });

    const summary = {
      summary: newCase.motive
    }

    await fetch("https://www.googleapis.com/calendar/v3/calendars", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + newSession.access_token,
      },
      body: JSON.stringify(summary)
    }).then((data) => {
      return data.json();
    });

    const { error } = await supabase.from('cases').insert(newCase);

    if(error) {
      return error;
    } else {
      return navigateTo(`/projects/${id}`)
    }
  } else {
    const summary = {
      summary: newCase.motive
    }

    await fetch("https://www.googleapis.com/calendar/v3/calendars", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + session.provider_token,
      },
      body: JSON.stringify(summary)
    }).then((data) => {
      return data.json();
    });

    const { error } = await supabase.from('cases').insert(newCase);

    if(error) {
      return error;
    } else {
      return navigateTo(`/projects/${id}`)
    }
  }
}
</script>
<template>
  <div class="hero-body" style="background-color: rgba(230, 230, 230); padding-bottom: 600px">
    <div class="container has-text-centered" style="background-color: rgba(0, 255, 255, 0)">
      <div class="column is-4 is-offset-4" style="background-color: rgba(240, 248, 255, 0)">
        <article class="message is-dark" style="border-radius: 20px">
          <div class="message-header" style="border-radius: 10px 10px 0px 0px">
            <h1 class="title p-1" style="font-size: x-large; color: white">
              Crear un nuevo Proyecto
            </h1>
          </div>
          <div class="message-body">
            <input
              v-model="newCase.number"
              class="input is-rounded"
              type="number"
              placeholder="Número de Expediente"
            />
            <input
              v-model="newCase.motive"
              class="input mt-5 is-rounded"
              type="text"
              placeholder="Motivo"
            />
            <input
              v-model="newCase.description"
              class="input mt-5 is-rounded"
              type="text"
              placeholder="Descripción"
            />
            <input
              v-model="newCase.demandant"
              class="input mt-5 is-rounded"
              type="text"
              placeholder="Demandante"
            />
            <input
              v-model="newCase.demanded"
              class="input mt-5 is-rounded"
              type="text"
              placeholder="Demandado"
            />
            <div class="buttons has-addons is-centered">
              <button
                @click="createCase(newCase)"
                class="button mt-5 is-dark is-rounded"
              >
                Crear Proyecto
              </button>
              <NuxtLink
                :to="`/projects/${id}`"
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
