<script setup lang="js">
// Tipo Consulta
/*interface consult {
  id: string,
  modality: string;
  description: string;
  starts: Date;
  ends: Date;
  user_name: string;
  user_email: string;
  status: string;
  location: string;
}*/

// Datos del abogado
const props = defineProps({
  lawyer: {
    type: Object,
    default: {},
  },
  consults: {
    type: Array,
    default: [],
  }
});

// Constantes a utilizar
const supabase = useSupabaseClient();
const runtimeConfig = useRuntimeConfig();
const client_id = runtimeConfig.public.clientId;
const client_secret = runtimeConfig.public.clientSecret;
const { data: { session } } = await supabase.auth.getSession();

// Esta pendiente por si llegan nuevas consultas
supabase
  .channel("any")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "consults" },
    (payload) => {
      if(payload.new.lawyer_id == props.lawyer.id) {
        props.consults.push(payload.new);
        props.consults = props.consults.slice(-5);
      }
    }
  )
  .subscribe();

// Funcion de crear consulta
async function createConsultEvent(consult) {
  // Verificamos que tenga guardado el provider_token
  if (session.provider_token == null) {
    const newSession = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      body: JSON.stringify({
        client_id: client_id,
        client_secret: client_secret,
        refresh_token: props.lawyer.provider_refresh_token,
        grant_type: 'refresh_token',
      }),
    }).then((data) => {
      return data.json();
    });

    console.log(newSession)
    let message;
    
    // El mensaje que se va a enviar al usuario
    if(consult.modality == 'Presencial') {
      if(consult.location == 'Personalizada') {
        message = "From: " + props.lawyer.email + "\r\n" +
                  "To: " + consult.user_email + "\r\n" +
                  "Subject: Aceptación de la asesoría\r\n\r\n" +
        `Le informamos que el abogado ha aceptado la solicitud de su asesoría, por favor, verifique en su cuenta de Google Calendar la fecha y hora del evento y confirme su asistencia a dicha asesoría. Como la localización que colocó fue "Personalizada", le pedimos que modifique la localización del evento en Google Calendar, tal y como se le fue explicado en el formulario de solicitud. Si es primera vez que contacta con un abogado, además del correo del abogado confirmando su asesoría, puede que se le envíe otro para que autorice la aparición del evento en su calendario. En ese correo solo, pulse el botón "Conozco al remitente", y el evento aparecerá en su calendario.`;
      } else {
        message = "From: " + props.lawyer.email + "\r\n" +
                  "To: " + consult.user_email + "\r\n" +
                  "Subject: Aceptación de la asesoría\r\n\r\n" +
        `Le informamos que el abogado ha aceptado la solicitud de su asesoría, por favor, verifique en su cuenta de Google Calendar la fecha y hora del evento y confirme su asistencia a dicha asesoría, solo seleccione el evento, y en la parte inferior del evento pulse el botón "Sí", de esa manera confirmará su asistencia al abogado que lo va a atender. Recuerde que la ubicación del evento va a ser dentro de nuestro bufete. Si es primera vez que contacta con un abogado, además del correo del abogado confirmando su asesoría, es posible que se le envíe otro correo para que autorice la aparición del evento en su calendario. En ese correo solo, pulse el botón "Conozco al remitente", y el evento aparecerá en su calendario.`;
      }
    } else {
      message = "From: " + props.lawyer.email + "\r\n" +
                "To: " + consult.user_email + "\r\n" +
                "Subject: Aceptación de la asesoría\r\n\r\n" +
        `Le informamos que su abogado ha aceptado la solicitud de su asesoría, por favor, verifique en su cuenta de Google Calendar la fecha y hora del evento y confirme su asistencia a dicha asesoría, solo seleccione el evento y en la parte inferior del evento pulse el botón "Sí", de esa manera confirmará su asistencia al abogado que lo va a atender. Recuerde que la modalidad de la misma es virtual, en el evento de Google Calendar va a encontrar el enlace para la videollamada. Si es primera vez que contacta con un abogado, además del correo del abogado confirmando su asesoría, es posible que se le envíe otro correo para que autorice la aparición del evento en su calendario. En ese correo solo, pulse el botón "Conozco al remitente", y el evento aparecerá en su calendario.`;
    }
    
    const encodedMessage = btoa(message);
    const reallyEncodedMessage = encodedMessage
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    let check = false;
    let event;
    let calendar_id;

    // Obtenemos los calendarios del abogado
    const calendars = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + newSession.access_token,
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

      calendar_id = await fetch("https://www.googleapis.com/calendar/v3/calendars", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + newSession.access_token,
        },
        body: JSON.stringify(summary),
      }).then((data) => {
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
    await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events?conferenceDataVersion=1`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + newSession.access_token,
      },
      body: JSON.stringify(event),
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
    });

    // Enviamos el correo al usuario
    await fetch(`https://gmail.googleapis.com/gmail/v1/users/${props.lawyer.email}/messages/send`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + newSession.access_token,
      },
      body: JSON.stringify({
        raw: reallyEncodedMessage,
      }),
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
    });

    // Guardamos el estado de la consulta
    consult.status = "Aceptado";
    //consult.lawyer_id = props.lawyer.id;
    const { error } = await supabase.from('consults').update(consult).eq('id',consult.id);
    if(error) {
      return error;
    }

  } else {
    let message;

    if(consult.modality == 'Presencial') {
      if(consult.location == 'Personalizada') {
        message = "From: " + props.lawyer.email + "\r\n" +
                  "To: " + consult.user_email + "\r\n" +
                  "Subject: Aceptación de la asesoría\r\n\r\n" +
        `Le informamos que el abogado ha aceptado la solicitud de su asesoría, por favor, verifique en su cuenta de Google Calendar la fecha y hora del evento y confirme su asistencia a dicha asesoría. Como la localización que colocó fue "Personalizada", le pedimos que modifique la localización del evento en Google Calendar, tal y como se le fue explicado en el formulario de solicitud. Si es primera vez que contacta con un abogado, además del correo del abogado confirmando su asesoría, puede que se le envíe otro para que autorice la aparición del evento en su calendario. En ese correo solo, pulse el botón "Conozco al remitente", y el evento aparecerá en su calendario.`;
      } else {
        message = "From: " + props.lawyer.email + "\r\n" +
                  "To: " + consult.user_email + "\r\n" +
                  "Subject: Aceptación de la asesoría\r\n\r\n" +
        `Le informamos que el abogado ha aceptado la solicitud de su asesoría, por favor, verifique en su cuenta de Google Calendar la fecha y hora del evento y confirme su asistencia a dicha asesoría, solo seleccione el evento, y en la parte inferior del evento pulse el botón "Sí", de esa manera confirmará su asistencia al abogado que lo va a atender. Recuerde que la ubicación del evento va a ser dentro de nuestro bufete. Si es primera vez que contacta con un abogado, además del correo del abogado confirmando su asesoría, es posible que se le envíe otro correo para que autorice la aparición del evento en su calendario. En ese correo solo, pulse el botón "Conozco al remitente", y el evento aparecerá en su calendario.`;
      }
    } else {
      message = "From: " + props.lawyer.email + "\r\n" +
                "To: " + consult.user_email + "\r\n" +
                "Subject: Aceptación de la asesoría\r\n\r\n" +
        `Le informamos que su abogado ha aceptado la solicitud de su asesoría, por favor, verifique en su cuenta de Google Calendar la fecha y hora del evento y confirme su asistencia a dicha asesoría, solo seleccione el evento y en la parte inferior del evento pulse el botón "Sí", de esa manera confirmará su asistencia al abogado que lo va a atender. Recuerde que la modalidad de la misma es virtual, en el evento de Google Calendar va a encontrar el enlace para la videollamada. Si es primera vez que contacta con un abogado, además del correo del abogado confirmando su asesoría, es posible que se le envíe otro correo para que autorice la aparición del evento en su calendario. En ese correo solo, pulse el botón "Conozco al remitente", y el evento aparecerá en su calendario.`;
    }
    
    const encodedMessage = btoa(message);
    const reallyEncodedMessage = encodedMessage
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    let check = false;
    let event;
    let calendar_id;

    // Obtenemos los calendarios del abogado
    const calendars = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + session.provider_token,
      },
    }).then((data) => {
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

      calendar_id = await fetch( "https://www.googleapis.com/calendar/v3/calendars", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + session.provider_token,
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
    await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events?conferenceDataVersion=1`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + session.provider_token,
      },
      body: JSON.stringify(event),
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
    });

    // Enviamos el correo al usuario
    await fetch(`https://gmail.googleapis.com/gmail/v1/users/${props.lawyer.email}/messages/send`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + session.provider_token,
      },
      body: JSON.stringify({
        raw: reallyEncodedMessage,
      }),
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
    });

    // Guardamos el estado de la consulta
    consult.status = "Aceptado";
    //consult.lawyer_id = props.lawyer.id;
    const { error } = await supabase.from('consults').update(consult).eq('id',consult.id);
    if(error) {
      return error;
    }
  }
}

// Funcion de rechazar consulta
async function rejectConsultEvent(consult) {
  // Verificamos que tenga guardado el provider_token
  if (session.provider_token == null) {
    const newSession = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      body: JSON.stringify({
        client_id: client_id,
        client_secret: client_secret,
        refresh_token: props.lawyer.provider_refresh_token,
        grant_type: 'refresh_token',
      }),
    }).then((data) => {
      return data.json();
    });

    console.log(newSession)
    
    // El mensaje que va a enviar al usuario
    const message = "From: " + props.lawyer.email + "\r\n" +
                    "To: " + consult.user_email + "\r\n" +
                    "Subject: Cancelación de la asesoría\r\n\r\n" +
                    "Lamentamos informarle que el abogado en cuestión no puede atender su caso en este momento, si lo desea puede contactar a otros abogados de nuestra plataforma.";
    const encodedMessage = btoa(message);
    const reallyEncodedMessage = encodedMessage
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Enviamos el correo al usuario
    await fetch(`https://gmail.googleapis.com/gmail/v1/users/${props.lawyer.email}/messages/send`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + newSession.access_token,
      },
      body: JSON.stringify({
        raw: reallyEncodedMessage,
      }),
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
    });

    // Guardamos el estado de la consulta
    consult.status = "Rechazado";
    consult.lawyer_id = props.lawyer.id;
    const { error } = await supabase.from('consults').update(consult).eq('id',consult.id);

    if(error) {
      return error;
    }
  } else {
    // El mensaje que va a enviar al usuario
    const message = "From: " + props.lawyer.email + "\r\n" +
                    "To: " + consult.user_email + "\r\n" +
                    "Subject: Cancelación de la asesoría\r\n\r\n" +
                    "Lamentamos informarle que el abogado en cuestion no puede atender su caso en este momento, si quiere puede contactar a otros abogados de nuestra plataforma.";
    const encodedMessage = btoa(message);
    const reallyEncodedMessage = encodedMessage
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Enviamos el correo al usuario
    await fetch(`https://gmail.googleapis.com/gmail/v1/users/${props.lawyer.email}/messages/send`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + session.provider_token,
      },
      body: JSON.stringify({
        raw: reallyEncodedMessage,
      }),
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
    });

    // Guardamos el estado de la consulta
    consult.status = "Rechazado";
    consult.lawyer_id = props.lawyer.id;
    const { error } = await supabase.from('consults').update(consult).eq('id',consult.id);

    if(error) {
      return error;
    }
  }
}
</script>

<template>
  <article v-for="consult in props.consults" class="message" style="border-radius: 40px">
    <div v-if="consult.status == null || consult.status == 'Referido'">
      <div class="message-header" style="border-radius: 20px 20px 0px 0px">
        <p style="margin: -5px">Solicitud: {{ consult.modality }}</p>
      </div>
      <div class="message-body">
        <strong>De {{ consult.user_name }}: </strong>
        {{ consult.description }}
        <p>El dia: {{ consult.starts.split("T")[0] }}</p>
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
        <div
          class="field has-addons"
          style="margin-left: -15px; padding-top: 10px; margin-bottom: -5px"
        >
          <p class="control">
            <button
              @click="createConsultEvent(consult)"
              class="button is-rounded"
            >
              <span>Aceptar</span>
            </button>
          </p>
          <p class="control">
            <NuxtLink :to="`/refer/${consult.id}`" class="button">
              <span>Referir</span>
            </NuxtLink>
          </p>
          <p class="control">
            <button
              @click="rejectConsultEvent(consult)"
              class="button is-rounded"
            >
              <span>Rechazar</span>
            </button>
          </p>
        </div>
      </div>
    </div>
  </article>
</template>
