<script setup lang="ts">
// Middleware
definePageMeta({
  middleware: ["auth"],
});

// Constantes a utilizar
const id = useRoute().path.split("/")[2];
const supabase = useSupabaseClient();
const { data: { session } } = await supabase.auth.getSession();
const runtimeConfig = useRuntimeConfig();
const client_id = runtimeConfig.public.clientId;
const client_secret = runtimeConfig.public.clientSecret;
const performances = ref();
let calendar_id;
let events: any;
const caso = ref();

// Obtenemos los datos del caso
caso.value = await $fetch(`/api/cases/${id}`).catch((error) => console.log(error.data));

// Obtenemos las ultimas actuaciones
performances.value = await $fetch(`/api/cases/${id}/performances`).catch((error) => console.log(error.data));

// Obtenemos los eventos proximos
if(caso.value.status == true) {
  if(session != null) {
    if(session.provider_token == null) {
      const provider_refresh_token = ref();
      provider_refresh_token.value = await $fetch(`/api/lawyers/${caso.value.admin_data.id}/provider_refresh_token`);
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
      });

      const calendars = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + newSession.access_token,
        },
      }).then((data) => { return data.json() });
  
      for(let i in calendars.items) {
        if(calendars.items[i].summary == caso.value.motive) {
          calendar_id = calendars.items[i].id;
          break;
        }   
      }
  
      events = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + newSession.access_token,
        },
      }).then((data) => { return data.json() });

      //console.log(events)

    } else {
      const calendars = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + session.provider_token,
        },
      }).then((data) => { return data.json() });
  
      for(let i in calendars.items) {
        if(calendars.items[i].summary == caso.value.motive) {
          calendar_id = calendars.items[i].id;
          break;
        }   
      }
      events = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + session.provider_token,
        },
      }).then((data) => { return data.json() });
    }
  }
} else {
  events = []
}

</script>
<template>
  <accountNav/>
  <div class="columns">
    <projectSidebar :caso="caso"></projectSidebar>
    <div class="column is-5 messages hero is-fullheight">
      <projectCalendar :events="events.items"></projectCalendar>
    </div>
    <div class="column is-4 modal-button" data-target="modal-card">
      <div class="column modal-button" data-target="modal-card">
        <div class="card is-shady" style="border-radius: 30px; height: 400px">
          <div class="block" style="margin-bottom: -0px">
            <p class="title p-4" style="background-color: gainsboro; border-radius: 30px 30px 0px 0px;">
              <i class="fa fa-flag" aria-hidden="true" style="margin-right: 7px"></i>
              Actuaciones Recientes
            </p>
          </div>
          <div class="column messages is-fullheight pb-4">
            <div class="inbox-messages">
              <div v-for="performance in performances" class="block">
                <projectPerformances :performance="performance"/>
              </div>
              <div class="buttons has-addons is-centered">
                <NuxtLink :to="`/project/${id}/performances`" class="button is-rounded">Ver todos</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr v-if="caso.status != false" />
      <div v-if="caso.status != false" class="card is-shady" style="border-radius: 30px">
        <div class="block" style="margin-bottom: -15px">
          <h1 class="title p-4" style=" background-color: gainsboro; border-radius: 30px 30px 0px 0px;">
            <i class="fa fa-cog" aria-hidden="true"></i>
            Opciones Del Proyecto
          </h1>
        </div>
        <div class="card-content">
          <NuxtLink :to="`/project/${id}/edit`" class="button is-rounded" style="margin-right: 10px;">Editar Información</NuxtLink>
          <NuxtLink :to="`/project/${id}/close`" class="button is-rounded">Cerrar Caso</NuxtLink>
        </div>
      </div>
    </div>    
  </div>
</template>
