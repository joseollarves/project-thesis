<script setup lang="js">
// Middleware
definePageMeta({
  middleware: ["auth"],
});

// Constantes a utilizar
const id = useRoute().path.split("/")[2];
const supabase = useSupabaseClient();
const lawyers = [];
const caso = ref();
const { data: { session } } = await supabase.auth.getSession();
const runtimeConfig = useRuntimeConfig();
const client_id = runtimeConfig.public.clientId;
const client_secret = runtimeConfig.public.clientSecret;
const event = ref({
  name: '',
  description: '',
  date: new Date(),
  collaborators: [],
  case_id: id,
})

const disabledDates = ref([
  {
    repeat: {
      weekdays: [1, 7],
    },
  },
]);

// Obtenemos a los colaboradores del proyecto
caso.value = await $fetch(`/api/cases/${id}`).catch((error) => console.log(error.data));

// Obtenemos los datos de los colaboradores
for(let i in caso.value.collaborators) {
  const data = await $fetch(`/api/lawyers/${caso.value.collaborators[i]}/essential`).catch((error) => console.log(error.data));
  if(data != null) {
    lawyers.push({
      id: caso.value.collaborators[i],
      name: data.name,
      email: data.email,
      provider_refresh_token: data.provider_refresh_token,
    });
  }
}

// Funcion de crear evento
async function newEvent(event) {

  if(event.name == '') {
    console.log('No ha ingresado ningun nombre al evento');
  } else if(event.description == '') {
    console.log('No ha ingresado ninguna descripcion al evento');
  } else if(event.collaborators.length < 0) {
    console.log('No ha seleccionado a ningun colaborador');
  } else {
    for(let i in event.collaborators) {
      const newSession = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        body: JSON.stringify({
          client_id: client_id,
          client_secret: client_secret,
          refresh_token: event.collaborators[i].provider_refresh_token,
          grant_type: 'refresh_token',
        }),
      }).then((data) => {
        return data.json();
      });

      let calendar_id;
      let check = false;

      const calendars = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + newSession.access_token,
        },
      }).then((data) => { return data.json() }).catch((error) => console.log(error));

      for(let j in calendars.items) {
        if(calendars.items[j].summary == caso.value.motive) {
          calendar_id = calendars.items[j].id;
          check = true
          break;
        }
      }

      if(check == false) {
        const summary = {
          summary: caso.value.motive
        }

        calendar_id = await fetch("https://www.googleapis.com/calendar/v3/calendars", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + newSession.access_token,
          },
          body: JSON.stringify(summary)
        })
        .then((data) => { return data.json() }).catch((error) => console.log(error));
        calendar_id = calendar_id.id;
      }

      const calendar_event = {
        summary: event.name,
        description: event.description,
        start: {
          dateTime: event.date,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: event.date,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      //attendees: emails,
      }

      await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + newSession.access_token,
        },
        body: JSON.stringify(calendar_event),
      })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data)
      }).catch((error) => console.log(error));
    }

    const { error } = await supabase.from('events').insert(event);
    if(error) {
      return error
    } else {
      return navigateTo(`/project/${id}/events`);
    }
  }
}
</script>
<template>
  <div
    class="hero-body"
    style="background-color: rgba(230, 230, 230); padding-bottom: 600px"
  >
    <div class="container" style="background-color: rgba(0, 255, 255, 0)">
      <div
        class="column is-4 is-offset-4"
        style="background-color: rgba(240, 248, 255, 0)"
      >
        <article class="message is-dark" style="border-radius: 20px">
          <div class="message-header" style="border-radius: 10px 10px 0px 0px">
            <h1 class="title p-1" style="font-size: x-large; color: white">
              Crear un nuevo Evento
            </h1>
          </div>
          <div class="message-body">
            <input
              v-model="event.name"
              class="input is-rounded"
              placeholder="Nombre del evento"
              style="margin-bottom: 10px"
            />
            <client-only>
              <VDatePicker
                expanded
                :initial-page="{
                  month: new Date().getMonth(),
                  year: new Date().getFullYear(),
                }"
                :min-date="new Date()"
                v-model="event.date"
                mode="dateTime"
                :disabled-dates="disabledDates"
              />
            </client-only>
            <input
              v-model="event.description"
              class="input is-rounded"
              placeholder="Descripcion"
              style="margin-top: 10px; margin-bottom: 10px"
            />

            <nav class="">
              Colaboradores
              <label v-for="lawyer in lawyers" class="panel-block">
                <input
                  :value="lawyer"
                  v-model="event.collaborators"
                  type="checkbox"
                />
                {{ lawyer.name }}
              </label>
            </nav>

            <div class="buttons has-addons is-centered">
              <button
                @click="newEvent(event)"
                class="button mt-5 is-dark is-rounded"
              >
                Crear Evento
              </button>
              <NuxtLink
                :to="`/project/${id}/events`"
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
