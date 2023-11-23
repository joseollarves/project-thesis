<script setup lang="js">
const supabase = useSupabaseClient();
const runtimeConfig = useRuntimeConfig();
const client_id = runtimeConfig.public.clientId;
const client_secret = runtimeConfig.public.clientSecret;
const { data: { session } } = await supabase.auth.getSession();

const props = defineProps({
  lawyers: {
    type: Array,
    default: []
  },
  consult: {
    type: Object,
    default: {},
  }
});

async function referConsultEvent(lawyer) {
  if(session.provider_token == null) {
    const newSession = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      body: JSON.stringify({
        client_id: client_id,
        client_secret: client_secret,
        refresh_token: lawyer.provider_refresh_token,
        grant_type: 'refresh_token',
      }),
    }).then((data) => {
      return data.json();
    });

    // El mensaje que va a enviar al usuario
    const message = "From: " + lawyer.email + "\r\n" +
                    "To: " + props.consult[0].user_email + "\r\n" +
                    "Subject: Estado de la asesoría\r\n\r\n" +
                    "Le informamos que el abogado no puede atender su solicitud a la fecha y hora que usted requiere. Sin embargo, dicho abogado refirió su asesoría a otro de nuestros abogados, con la posibilidad de que el pueda atender su caso. Le mantendremos informado/a a través de su correo electrónico, en caso de que el abogado acepte su solicitud. Agradecemos su comprensión.";
    const encodedMessage = btoa(message);
    const reallyEncodedMessage = encodedMessage
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Enviamos el correo al usuario
    await fetch(`https://gmail.googleapis.com/gmail/v1/users/${lawyer.email}/messages/send`, {
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
    }).catch((error) => {
      console.log(error);
    })
    
    const { error } = await supabase.from("consults").update({status: 'Referido', lawyer_id: lawyer.id}).eq('id', props.consult[0].id);
    if(error) {
      return error
    } else {
      return navigateTo('/profile')
    }
  } else {
    // El mensaje que va a enviar al usuario
    const message = "From: " + lawyer.email + "\r\n" +
                    "To: " + props.consult[0].user_email + "\r\n" +
                    "Subject: Estado de la asesoría\r\n\r\n" +
                    "Le informamos que el abogado que usted solicitó no puede atender su solicitud a la fecha y hora que usted requiere, sin embargo, dicho abogado refirió su asesoría a otro de los abogados de nuestra plataforma, con la posibilidad de que él pueda atender su caso, esté pendiente de su correo electrónico por si el abogado llega a aceptar su solicitud.";
    const encodedMessage = btoa(message);
    const reallyEncodedMessage = encodedMessage
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Enviamos el correo al usuario
    await fetch(`https://gmail.googleapis.com/gmail/v1/users/${lawyer.email}/messages/send`, {
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
    }).catch((error) => {
      console.log(error);
    });
    
    const { error } = await supabase.from("consults").update({status: 'Referido', lawyer_id: lawyer.id}).eq('id', props.consult[0].id);
    if(error) {
      return error
    } else {
      return navigateTo('/profile')
    }
  }
}
</script>

<template>
  <nav class="panel" v-for="lawyer in lawyers" style="margin-top: 10px">
    <div class="columns has-text-centered" style="padding-left: 10px; margin-right: -20px">
      <p class="panel-block column is-5">
        {{ lawyer.name }}
      </p>
      <p class="panel-block column is-2" v-for="specialization in lawyer.specializations">
        {{ specialization }}
      </p>
      <div class="column has-text-right" style="margin-left: 0px; margin-right: 30px">
        <button @click="referConsultEvent(lawyer)" class="button is-small is-dark is-rounded" href="#" style="padding: -50px">
          <p style="font-weight: bolder; font-size: large; padding: -50px; margin: -100px;">+</p>
        </button>
      </div>
    </div>
  </nav>
</template>
