<script setup lang="js">
const props = defineProps({
  caso: {
    type: Object,
    default: {}
  }
});

// Constantes a utilizar
const id = useRoute().path.split("/")[2];
const supabase = useSupabaseClient();
const collaborators = useCollaborators();
const collaboratorsSelected = useCollaboratorsSelected();
const collaboratorsDeleted = useCollaboratorsDeleted();
const runtimeConfig = useRuntimeConfig();
const client_id = runtimeConfig.public.clientId;
const client_secret = runtimeConfig.public.clientSecret;
console.log(runtimeConfig)

// Funcion para eliminar Colaboradores
async function deleteCollaborator() {
  if(collaboratorsSelected.value.length > 0) {
    for(let i in collaboratorsSelected.value) {
      let calendar_id;
      const provider_refresh_token = ref();
      let check = false
      provider_refresh_token.value = await $fetch(`/api/lawyers/${collaboratorsSelected.value[i]}/provider_refresh_token`).catch((error) => console.log(error.data));
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

      console.log(newSession);
      // Obtenemos los calendarios del abogado
      const calendars = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + newSession.access_token,
        },
      }).then((data) => {
        return data.json();
      });

      // Verificamos si el calendario del caso existe
      for (let j in calendars.items) {
        if (calendars.items[j].summary == props.caso.motive) {
          calendar_id = calendars.items[j].id;
          check = true;
          break;
        }
      }
      // Si el calendario del proyecto existe lo eliminamos
      if (check == true) {
        await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + newSession.access_token,
          },
        });
        check = false;
      }
      collaborators.value = collaborators.value.filter((collaborator) => collaborator != collaboratorsSelected.value[i]);
    }

    const { error } = await supabase.from("cases").update({collaborators: collaborators.value}).eq('id', id);
    
    if(error) {
      return error;
    } else {
      collaboratorsDeleted.value = true;
    }

  } else {
    console.log('No ha seleccionado ningun colaborador');
  }
}

</script>

<template>
  <div class="block">
    <div class="block">
      <div class="columns is-mobile is-centered">
        <div class="field is-grouped">
          <div class="buttons has-addons is-centered">
            <div class="field has-addons" style="margin-top: 10px">
              <p class="control">
                <NuxtLink :to="`/project/${id}/collaborators/select`" class="button is-small is-rounded">
                  <span>Agregar Colaborador</span>
                </NuxtLink>
                <button @click="deleteCollaborator()" class="button is-small is-rounded">
                  <span>Eliminar Colaborador</span>
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
