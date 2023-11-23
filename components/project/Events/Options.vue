<script setup lang="js">

// ID del proyecto
const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  motive: {
    type: String,
    default: '',
  }
})

// Constante a utilizar
const eventSelected = useEventSelected();
const supabase = useSupabaseClient();
const eventState = useEventState();
const runtimeConfig = useRuntimeConfig();
const client_id = runtimeConfig.public.clientId;
const client_secret = runtimeConfig.public.clientSecret;

// Funcion de editar evento
async function editEvent() {
  if(eventSelected.value.name == undefined) {
    console.log('No ha seleccionado ningun evento porfavor elija uno.');
  } else {
    const id = eventSelected.value.id;
    eventSelected.value = null;
    return navigateTo(`/project/${props.id}/events/${id}/edit`);
  }
  
}

// Funcion de editar evento
async function deleteEvent() {
  if(eventSelected.value.name != undefined) {
    for(let i in eventSelected.value.collaborators) {
      //console.log(eventSelected.value);
      const newSession = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        body: JSON.stringify({
          client_id: client_id,
          client_secret: client_secret,
          refresh_token: eventSelected.value.collaborators[i].provider_refresh_token,
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
        if(calendars.items[i].summary == props.motive) {
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
          if(eventSelected.value.name == events.items[k].summary) {
            event_id = events.items[k].id;
          }
        }
        
        await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events/${event_id}`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + newSession.access_token,
          },
        });
      }
    }
    
    const { error } = await supabase.from('events').delete().eq('id', eventSelected.value.id);
    
    if(error) {
      return error
    } else {
      eventState.value = true;
    }
  } else {
    console.log('No ha seleccionado ningun evento')
  }
}
</script>
<template>
  <div class="block">
    <div class="columns is-mobile is-centered">
      <div class="field is-grouped">
        <div class="buttons has-addons is-centered">
          <div class="field has-addons" style="margin-top: 10px">
            <p class="control">
              <NuxtLink :to="`/project/${props.id}/events/create`" class="button is-small is-rounded">
                <span>Agregar Evento</span>
              </NuxtLink>
              <button @click="editEvent()" class="button is-small is-rounded">
                <span>Modificar Evento</span>
              </button>
              <button @click="deleteEvent()" class="button is-small is-rounded">
                <span>Eliminar Evento</span>
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
