<script setup lang="js">
// Tipo Caso
/*interface caso {
  id: string;
  number: string | null;
  motive: string | null;
  description: string | null;
  demandant: string | null;
  demanded: string | null;
  status: boolean;
  performances: object | null;
}*/

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
const caso = ref();


// Obtenemos los datos del caso
caso.value = await $fetch(`/api/cases/${id}`).catch((error) => console.log(error.data));


// Los datos originales del caso
const originalCase = {
  number: caso.value.number,
  motive: caso.value.motive,
  description: caso.value.description,
  demandant: caso.value.demandant,
  demanded: caso.value.demandanded,
  status: caso.value.status,
  collaborators: caso.value.collaborators,
  admin_data: caso.value.admin_data,
};

// Funcion de editar caso
async function editCase(caso) {
  let calendar_id;
  let check = false;

  const summary = {
    summary: caso.motive
  }

  if(session.provider_token == null) {
    const provider_refresh_token = ref();
    provider_refresh_token.value = await $fetch(`/api/lawyers/${caso.admin_data.id}/provider_refresh_token`).catch((error) => console.log(error.data));
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
    for (let i in calendars.items) {
      if (calendars.items[i].summary == originalCase.motive) {
        calendar_id = calendars.items[i].id;
        check = true;
        break;
      }
    }

    // Si el calendario de consultas del proyecto no existe lo creamos
    if (check == false) {
      await fetch("https://www.googleapis.com/calendar/v3/calendars", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + newSession.access_token,
        },
        body: JSON.stringify(summary),
      }).then((data) => {
        return data.json();
      });

    } else {
      await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + newSession.access_token,
        },
        body: JSON.stringify(summary)
      }).then((data) => {
        return data.json();
      });
      check = false;
    }
  } else {
    // Obtenemos los calendarios del abogado
    const calendars = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + session.provider_token,
      },
    }).then((data) => {
      return data.json();
    });

    // Verificamos si el calendario del caso existe
    for (let i in calendars.items) {
      if (calendars.items[i].summary == originalCase.motive) {
        calendar_id = calendars.items[i].id;
        check = true;
        break;
      }
    }

    // Si el calendario de consultas del proyecto no existe lo creamos
    if (check == false) {

      calendar_id = await fetch("https://www.googleapis.com/calendar/v3/calendars", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + session.provider_token,
        },
        body: JSON.stringify(summary),
      }).then((data) => {
        return data.json();
      });

      calendar_id = calendar_id.id;
    } else {

      await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + session.provider_token,
        },
        body: JSON.stringify(summary)
      }).then((data) => {
        return data.json();
      });

      check = false;
    }
  }

  const { error } = await supabase.from('cases').update(caso).eq('id', id);
  if(error) {
    return error;
  } else {
    return navigateTo(`/project/${id}`);
  }
}
</script>
<template>
  <div class="hero-body" style="background-color: rgba(230, 230, 230); padding-bottom: 600px" >
    <div class="container has-text-centered" style="background-color: rgba(0, 255, 255, 0)">
      <div class="column is-4 is-offset-4" style="background-color: rgba(240, 248, 255, 0)">
        <article class="message is-dark" style="border-radius: 20px">
          <div class="message-header" style="border-radius: 10px 10px 0px 0px">
            <h1 class="title p-1" style="font-size: x-large; color: white">
              Editar información
            </h1>
          </div>
          <div class="message-body">
            <input
              v-model="caso.number"
              class="input is-rounded"
              placeholder="Numero de Expediente"
              style="margin-bottom: 10px"
            />
            <input
              v-model="caso.motive"
              class="input is-rounded"
              placeholder="Motivo"
              style="margin-bottom: 10px"
            />
            <input
              v-model="caso.description"
              class="input is-rounded"
              placeholder="Descripcion"
              style="margin-bottom: 10px"
            />
            <input
              v-model="caso.demandant"
              class="input is-rounded"
              placeholder="Demandante"
              style="margin-bottom: 10px"
            />
            <input
              v-model="caso.demanded"
              class="input is-rounded"
              placeholder="Demandado"
              style="margin-bottom: 10px"
            />
            <div class="buttons has-addons is-centered">
              <button
                @click="editCase(caso)"
                class="button mt-5 is-dark is-rounded"
              >
                Editar Info
              </button>
              <NuxtLink
                :to="`/project/${id}`"
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
