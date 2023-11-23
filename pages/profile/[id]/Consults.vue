<script setup lang="ts">
// Middleware
definePageMeta({
  middleware: ["auth"],
});

// Tipo Consulta
interface consult {
  user_name: string;
  user_email: string;
  modality: string;
  description: string;
  starts: Date;
  ends: Date;
  location: string;
  lawyer_id: string;
  status: string;
}

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
const consults = ref();
const data = ref();

// Obtenemos los datos del abogado y sus solicitudes de consulta
data.value = await $fetch(`/api/lawyers/${id}`).catch((error) =>
  console.log(error.data)
);
const lawyer = ref(data.value);
consults.value = await $fetch(`/api/lawyers/${id}/consults`).catch((error) =>
  console.log(error.data)
);

/*const filteredConsults = computed(() => {
  return consults.value.filter((consult: consult) => consult.status == null);
});*/

for(let i in consults.value) {
  console.log(new Date(consults.value[i].starts).getHours())
  /*if(new Date(consults.value[i].starts).getHours() == 0) {
    console.log(new Date(consults.value[i].starts))
  }*/
  console.log(`Empieza: ${new Date(consults.value[i].starts)}`)
  console.log(`Termina: ${new Date(consults.value[i].ends)}`)
}


// Funcion de crear consulta
async function createConsultEvent(consult: consult) {
  // Verificamos que tenga guardado el provider_token
  if (lawyer.provider_token == null) {
    return navigateTo("/");
  }

  // El mensaje que va a enviar al usuario
  const message =
    "From: " +
    lawyer.email +
    "\r\n" +
    "To: " +
    consult.user_email +
    "\r\n" +
    "Subject: Aceptacion de la asesoria\r\n\r\n" +
    "Le informamos que su abogado ha aceptado la solicitud de su asesoria, por favor, verifique en su cuenta de Google Calendar la fecha y hora del evento y confirme su asistencia a dicha asesoria.";
  const encodedMessage = btoa(message);
  const reallyEncodedMessage = encodedMessage
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  let check = false;
  let event;
  let calendar_id;

  // Obtenemos los calendarios del abogado
  const calendars = await fetch(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + lawyer.provider_token,
      },
    }
  ).then((data) => {
    return data.json();
  });

  // Verificamos si el calendario de consultas existe
  for (let i in calendars.items) {
    if (calendars.items[i].summary == "Bufete: Consultas") {
      calendar_id = calendars.items[i].id;
      check = true;
      break;
    }
  }

  // Si el calendario de consultas no existe lo creamos
  if (check == false) {
    const summary = {
      summary: "Bufete: Consultas",
    };
    calendar_id = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + lawyer.provider_token,
        },
        body: JSON.stringify(summary),
      }
    ).then((data) => {
      return data.json();
    });

    calendar_id = calendar_id.id;
  }

  // Verificamos la modalidad de la consulta
  if (consult.modality == "Virtual (videollamada)") {
    event = {
      summary: `Asesoria: ${consult.modality}`,
      description: consult.description,
      start: {
        dateTime: consult.starts,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: consult.ends,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      attendees: [{ email: consult.user_email }],
      conferenceData: {
        createRequest: {
          requestId: "prueba124",
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };
  } else {
    if (consult.location == "Sede del bufete") {
      event = {
        summary: `Asesoria: ${consult.modality}`,
        description: consult.description,
        start: {
          dateTime: consult.starts,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: consult.ends,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        attendees: [{ email: consult.user_email }],
      };
    } else {
      event = {
        summary: `Asesoria: ${consult.modality}`,
        description: consult.description,
        start: {
          dateTime: consult.starts,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: consult.ends,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        attendees: [{ email: consult.user_email }],
        guestsCanModify: true,
      };
    }
  }

  // Guardamos el evento en el calendario
  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events?conferenceDataVersion=1`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + lawyer.provider_token,
      },
      body: JSON.stringify(event),
    }
  )
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      console.log(data);
    });

  // Enviamos el correo al usuario
  await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/${lawyer.email}/messages/send`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + lawyer.provider_token,
      },
      body: JSON.stringify({
        raw: reallyEncodedMessage,
      }),
    }
  )
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      console.log(data);
    });

  // Guardamos el estado de la consulta
  consult.status = "Aceptado";
  await $fetch(`/api/consults/${lawyer.id}/update/${consult.status}`).catch(
    (error) => console.log(error.data)
  );
}

// Funcion de rechazar consulta
async function rejectConsultEvent(consult: consult) {
  // Verificamos que tenga guardado el provider_token
  if (lawyer.provider_token == null) {
    return navigateTo("/");
  }

  // El mensaje que va a enviar al usuario
  const message =
    "From: " +
    lawyer.email +
    "\r\n" +
    "To: " +
    consult.user_email +
    "\r\n" +
    "Subject: Cancelacion de la asesoria\r\n\r\n" +
    "Lamentamos informarle que el abogado en cuestion no puede atender su caso en este momento, si quiere puede contactar a otros abogados de nuestra plataforma.";
  const encodedMessage = btoa(message);
  const reallyEncodedMessage = encodedMessage
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  // Enviamos el correo al usuario
  await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/${lawyer.email}/messages/send`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + lawyer.provider_token,
      },
      body: JSON.stringify({
        raw: reallyEncodedMessage,
      }),
    }
  )
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      console.log(data);
    });

  // Guardamos el estado de la consulta
  consult.status = "Rechazado";
  await $fetch(`/api/consults/${lawyer.id}/update/${consult.status}`).catch(
    (error) => console.log(error.data)
  );
}
</script>
<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <span class="navbar-burger burger" data-target="navbarMenu">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>
      <div id="navbarMenu" class="navbar-menu">
        <div class="navbar-end">
          <span class="navbar-item">
            <NuxtLink class="button is-black is-outlined" to="/profile">
              <span class="icon">
                <i class="fa fa-arrow-left" aria-hidden="true"></i>
              </span>
              <span>Volver</span>
            </NuxtLink>
          </span>
        </div>
      </div>
    </div>
  </nav>
  <article v-for="consult in consults" class="message" style="border-radius: 0px; padding: 0px; padding-left: 30px; padding-right: 30px; background-color: white">
    <div>
      <div class="message-header" style="border-radius: 10px 10px 0px 0px">
        <p style="margin: -5px">Solicitud: {{ consult.modality }}</p>
      </div>
      <div class="message-body" style="border-radius: 10px; background-color: rgb(243, 243, 243)">
        <strong>De {{ consult.user_name }}:</strong>
        <p>{{ consult.description }}</p>
        <p>El dia: {{ consult.starts.split('T')[0] }}</p>
        <!--**********************************************************************-->
        <!--Si es en la manana-->
        <div v-if="new Date(consult.starts).getHours() <= 12">
          <!--Si es a mediodia-->
          <div v-if="new Date(consult.starts).getHours() == 0">
            <!--Si los minutos tienen un solo digito-->
            <div v-if="new Date(consult.starts).getMinutes() >= 0 && new Date(consult.starts).getMinutes() <= 9 ">
              <p> Empieza a las: 12:0{{ new Date(consult.starts).getMinutes() }} AM</p>
            </div>
            <div v-else>
              <p> Empieza a las: 12:{{ new Date(consult.starts).getMinutes() }} AM</p>
            </div>
            <!--Si la consulta termina en la manana-->
            <div v-if="new Date(consult.ends).getHours() <= 12">
              <!--Si es a mediodia-->
              <div v-if="new Date(consult.ends).getHours() == 0">
                <!--Si los minutos tienen un solo digito-->
                <div v-if="new Date(consult.ends).getMinutes() >= 0 && new Date(consult.ends).getMinutes() <= 9">
                  <p> Termina a las: 12:0{{ new Date(consult.ends).getMinutes() }} AM</p>
                </div>
                <div v-else>
                  <p> Termina a las: 12:{{ new Date(consult.ends).getMinutes() }} AM</p>
                </div>
              </div>
              <div v-else>
                <!--Si los minutos tienen un solo digito-->
                <div v-if="new Date(consult.ends).getMinutes() >= 0 && new Date(consult.ends).getMinutes() <= 9">
                  <p> Termina a las: {{ new Date(consult.ends).getHours() }}:0{{ new Date(consult.ends).getMinutes() }} AM</p>
                </div>
                <div v-else>
                  <p> Termina a las: {{ new Date(consult.ends).getHours() }}:{{ new Date(consult.ends).getMinutes() }} AM</p>
                </div>
              </div>
            </div>
            <!--*********************-->
            <!--Si la consulta termina en la tarde-->
            <div v-else>
              <!--Si es a mediodia-->
              <div v-if="new Date(consult.ends).getHours() == 0">
                <!--Si los minutos tienen un solo digito-->
                <div v-if="new Date(consult.ends).getMinutes() >= 0 && new Date(consult.ends).getMinutes() <= 9">
                  <p> Termina a las: 12:0{{ new Date(consult.ends).getMinutes() }} PM</p>
                </div>
                <div v-else>
                  <p> Termina a las: 12:{{ new Date(consult.ends).getMinutes() }} PM</p>
                </div>
              </div>
              <div v-else>
                <!--Si los minutos tienen un solo digito-->
                <div v-if="new Date(consult.ends).getMinutes() >= 0 && new Date(consult.ends).getMinutes() <= 9">
                  <p> Termina a las: {{ new Date(consult.ends).getHours() }}:0{{ new Date(consult.ends).getMinutes() }} PM</p>
                </div>
                <div v-else>
                  <p> Termina a las: {{ new Date(consult.ends).getHours() }}:{{ new Date(consult.ends).getMinutes() }} PM</p>
                </div>
              </div>
            </div>
          </div>
          <!--******************-->
          <div v-else>
            <!--Si los minutos tienen un solo digito-->
            <div v-if="new Date(consult.starts).getMinutes() >= 0 && new Date(consult.starts).getMinutes() <= 9 ">
              <p> Empieza a las: {{ new Date(consult.starts).getHours() }}:0{{ new Date(consult.starts).getMinutes() }} AM</p>
            </div>
            <div v-else>
              <p> Empieza a las: {{ new Date(consult.starts).getHours() }}:{{ new Date(consult.starts).getMinutes() }} AM</p>
            </div>
            <!--Si la consulta termina en la manana-->
            <div v-if="new Date(consult.ends).getHours() <= 12">
              <!--Si es a mediodia-->
              <div v-if="new Date(consult.ends).getHours() == 0">
                <!--Si los minutos tienen un solo digito-->
                <div v-if="new Date(consult.ends).getMinutes() >= 0 && new Date(consult.ends).getMinutes() <= 9">
                  <p> Termina a las: 12:0{{ new Date(consult.ends).getMinutes() }} AM</p>
                </div>
                <div v-else>
                  <p> Termina a las: 12:{{ new Date(consult.ends).getMinutes() }} AM</p>
                </div>
              </div>
              <div v-else>
                <!--Si los minutos tienen un solo digito-->
                <div v-if="new Date(consult.ends).getMinutes() >= 0 && new Date(consult.ends).getMinutes() <= 9">
                  <p> Termina a las: {{ new Date(consult.ends).getHours() }}:0{{ new Date(consult.ends).getMinutes() }} AM</p>
                </div>
                <div v-else>
                  <p> Termina a las: {{ new Date(consult.ends).getHours() }}:{{ new Date(consult.ends).getMinutes() }} AM</p>
                </div>
              </div>
            </div>
            <!--*********************-->
            <!--Si la consulta termina en la tarde-->
            <div v-else>
              <!--Si es a mediodia-->
              <div v-if="new Date(consult.ends).getHours() == 0">
                <!--Si los minutos tienen un solo digito-->
                <div v-if="new Date(consult.ends).getMinutes() >= 0 && new Date(consult.ends).getMinutes() <= 9">
                  <p> Termina a las: 12:0{{ new Date(consult.ends).getMinutes() }} PM</p>
                </div>
                <div v-else>
                  <p> Termina a las: 12:{{ new Date(consult.ends).getMinutes() }} PM</p>
                </div>
              </div>
              <div v-else>
                <!--Si los minutos tienen un solo digito-->
                <div v-if="new Date(consult.ends).getMinutes() >= 0 && new Date(consult.ends).getMinutes() <= 9">
                  <p> Termina a las: {{ new Date(consult.ends).getHours() }}:0{{ new Date(consult.ends).getMinutes() }} PM</p>
                </div>
                <div v-else>
                  <p> Termina a las: {{ new Date(consult.ends).getHours() }}:{{ new Date(consult.ends).getMinutes() }} PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--**********************************************************************-->
        <!--Si es en la tarde-->
        <div v-else>
          <div v-if="new Date(consult.starts).getMinutes() >= 0 && new Date(consult.starts).getMinutes() <= 9 ">
            <p> Empieza a las: {{ new Date(consult.starts).getHours() }}:0{{ new Date(consult.starts).getMinutes() }} PM</p>
          </div>
          <div v-else>
            <p> Empieza a las: {{ new Date(consult.starts).getHours() }}:{{ new Date(consult.starts).getMinutes() }} PM</p>
          </div>
          <div v-if="new Date(consult.ends).getHours() <= 12">
            <div v-if="new Date(consult.ends).getMinutes() >= 0 && new Date(consult.ends).getMinutes() <= 9">
              <p> Termina a las: {{ new Date(consult.ends).getHours() }}:0{{ new Date(consult.ends).getMinutes() }} AM</p>
            </div>
            <div v-else>
              <p> Termina a las: {{ new Date(consult.ends).getHours() }}:{{ new Date(consult.ends).getMinutes() }} AM</p>
            </div>
          </div>
          <div v-else>
            <div v-if="new Date(consult.ends).getMinutes() >= 0 && new Date(consult.ends).getMinutes() <= 9">
              <p> Termina a las: {{ new Date(consult.ends).getHours() }}:0{{ new Date(consult.ends).getMinutes() }} PM</p>
            </div>
            <div v-else>
              <p> Termina a las: {{ new Date(consult.ends).getHours() }}:{{ new Date(consult.ends).getMinutes() }} PM</p>
            </div>
          </div>
        </div>
        <!--********************************************************-->
        <div class="field has-addons" style="margin-left: -15px; padding-top: 10px; margin-bottom: -5px">
          <p class="control">
            <button @click="createConsultEvent(consult)" class="button is-rounded">
              <span>Aceptar</span>
            </button>
          </p>
          <p class="control">
            <NuxtLink :to="`/refer/${id}`" class="button">
              <span>Referir</span>
            </NuxtLink>
          </p>
          <p class="control">
            <button @click="rejectConsultEvent(consult)" class="button is-rounded">
              <span>Rechazar</span>
            </button>
          </p>
        </div>
      </div>
    </div>
    <hr />
  </article>
</template>
