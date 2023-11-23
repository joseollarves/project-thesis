<script setup lang="js">
// Datos del caso y los abogados disponibles
const props = defineProps({
  caso: {
    type: Object,
    default: {},
  },
  lawyers: {
    type: Array,
    default: []
  },
});

// Constantes a utilizar
const supabase = useSupabaseClient();
const lawyers = props.lawyers;
const collaborators = props.caso.collaborators;
const runtimeConfig = useRuntimeConfig();
const client_id = runtimeConfig.public.clientId;
const client_secret = runtimeConfig.public.clientSecret;

// Funcion de asignar colaborador
async function setCollaborator(lawyer_id) {
  const provider_refresh_token = ref();
  provider_refresh_token.value = await $fetch(`/api/lawyers/${lawyer_id}/provider_refresh_token`).catch((error) => console.log(error.data));
  provider_refresh_token.value = provider_refresh_token.value.provider_refresh_token;
  
  const newSession = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: JSON.stringify({
      client_id: client_id,
      client_secret: client_secret,
      refresh_token: provider_refresh_token.value,
      grant_type: 'refresh_token',
    }),
  }).then((data) => {
    return data.json();
  }).catch((error) => {
    console.log(error)
  })

  console.log(newSession)
  const summary = {
    summary: props.caso.motive
  }

  await fetch("https://www.googleapis.com/calendar/v3/calendars", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + newSession.access_token,
    },
    body: JSON.stringify(summary)
  }).then((data) => {
    return data.json();
  }).catch((error) => {
    console.log(error);
  })

  collaborators.push(lawyer_id);
  const { error } = await supabase.from("cases").update({collaborators: collaborators}).eq('id', props.caso.id);

  if(error) {
    return error;
  } else {
    return navigateTo(`/project/${props.caso.id}/collaborators`);
  }
}
</script>

<template>
  <nav class="panel" v-for="lawyer in lawyers" style="margin-top: 10px">
    <div class="columns has-text-centered" style="padding-left: 10px; margin-right: -20px">
      <p class="panel-block column is-5">
        {{ lawyer.name }}
      </p>
      <p
        class="panel-block column is-2"
        v-for="specialization in lawyer.specializations"
      >
        {{ specialization }}
      </p>
      <div class="column has-text-right" style="margin-left: 0px; margin-right: 30px">
        <button
          @click="setCollaborator(lawyer.id)"
          class="button is-small is-dark is-rounded"
          href="#"
          style="padding: -50px"
        >
          <p
            style="
              font-weight: bolder;
              font-size: large;
              padding: -50px;
              margin: -100px;
            "
          >
            +
          </p>
        </button>
      </div>
    </div>
  </nav>
</template>
