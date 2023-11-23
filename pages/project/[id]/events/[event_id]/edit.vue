<script setup lang="js">
// Middleware
definePageMeta({
  middleware: ["auth"],
});

// Constantes a utilizar
const id = useRoute().path.split("/")[2];
const event_id = useRoute().path.split("/")[4];
const supabase = useSupabaseClient();
const caso = ref();
const lawyers = [];
const { data: { session } } = await supabase.auth.getSession();
const runtimeConfig = useRuntimeConfig();
const client_id = runtimeConfig.public.clientId;
const client_secret = runtimeConfig.public.clientSecret;
const event = ref();
const originalEvent = ref();

const disabledDates = ref([
  {
    repeat: {
      weekdays: [1, 7],
    },
  },
]);

// Obtenemos los datos del evento
event.value = await $fetch(`/api/cases/${id}/events/${event_id}`).catch((error) => console.log(error.data));
originalEvent.value = {name: event.value.name, collaborators: event.value.collaborators};
caso.value = await $fetch(`/api/cases/${id}`).catch((error) => console.log(error.data));

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

async function editEvent(event) {

  if(event.name == '') {
    console.log('No ha ingresado ningun nombre al evento');
  } else if(event.description == '') {
    console.log('No ha ingresado ninguna descripcion al evento');
  } else if(event.collaborators.length == 0) {
    console.log('No ha seleccionado a ningun colaborador');
  } else {

    const collaboratorsToAdd = event.collaborators.filter((lawyer) => {
      if(!originalEvent.value.collaborators.includes(lawyer)) {
        return lawyer
      }
    });

    const collaboratorsToEdit = originalEvent.value.collaborators.filter((lawyer) => {
      for(let j in event.collaborators) {
        if(event.collaborators[j].id == lawyer.id) {
          return lawyer;
        }
      }
    });

    const collaboratorsToDelete = originalEvent.value.collaborators.filter((lawyer) => {
      for(let k in collaboratorsToAdd) {
        if(event.collaborators[k].id != lawyer.id) {
          return lawyer;
        }
      }
    });

    if(collaboratorsToAdd.length > 0) {
      for(let l in collaboratorsToAdd) {
        const newSession = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          body: JSON.stringify({
            client_id: client_id,
            client_secret: client_secret,
            refresh_token: collaboratorsToAdd[l].provider_refresh_token,
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

        for(let i in calendars.items) {
          if(calendars.items[i].summary == caso.value.motive) {
            calendar_id = calendars.items[i].id;
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
    }

    if(collaboratorsToEdit.length > 0) {
      for(let m in collaboratorsToEdit) {
        const newSession = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          body: JSON.stringify({
            client_id: client_id,
            client_secret: client_secret,
            refresh_token: collaboratorsToEdit[m].provider_refresh_token,
            grant_type: 'refresh_token',
          }),
        }).then((data) => {
          return data.json();
        });

        let calendar_id;
        let event_id;
        let check = false;

        const calendars = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + newSession.access_token,
          },
        }).then((data) => { return data.json() }).catch((error) => console.log(error));

        for(let i in calendars.items) {
          if(calendars.items[i].summary == caso.value.motive) {
            calendar_id = calendars.items[i].id;
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

        } else {
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
          
          const events = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events`, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + newSession.access_token,
            },
          }).then((data) => { return data.json() }).catch((error) => console.log(error))

          for(let k in events.items) {
            if(originalEvent.value.name == events.items[k].summary) {
              event_id = events.items[k].id;
            }
          }

          await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events/${event_id}`, {
            method: "PUT",
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
      }
    }

    if (collaboratorsToDelete.length > 0) {
      for(let n in collaboratorsToDelete) {
        const newSession = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          body: JSON.stringify({
            client_id: client_id,
            client_secret: client_secret,
            refresh_token: collaboratorsToDelete[n].provider_refresh_token,
            grant_type: 'refresh_token',
          }),
        }).then((data) => {
          return data.json();
        });

        let calendar_id;
        let event_id;
        let check = false;

        const calendars = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + newSession.access_token,
          },
        }).then((data) => { return data.json() }).catch((error) => console.log(error));

        for(let i in calendars.items) {
          if(calendars.items[i].summary == caso.value.motive) {
            calendar_id = calendars.items[i].id;
            check = true
            break;
          }
        }

        if(check == true) {
          const events = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events`, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + newSession.access_token,
            },
          }).then((data) => { return data.json() }).catch((error) => console.log(error))

          for(let k in events.items) {
            if(originalEvent.value.name == events.items[k].summary) {
              event_id = events.items[k].id;
            }
          }

          //console.log(event_id);

          await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events/${event_id}`, {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + newSession.access_token,
            },
          });
        }
      }
    }

    const { error } = await supabase.from('events').update(event).eq('id', event.id);
    if(error) {
      return error;
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
              Editar un Evento existente
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
                @click="editEvent(event)"
                class="button mt-5 is-dark is-rounded"
              >
                Editar Evento
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
