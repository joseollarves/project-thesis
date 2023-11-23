<script setup lang="js">
// Middleware
definePageMeta({
  middleware: ["auth"],
});

/*interface consult {
  user_name: string,
  user_email: string,
  modality: string,
  description: string,
  starts: Date,
  ends: Date,
  location: string,
  lawyer_id: string,
}*/

// Constantes a utilizar
const id = useRoute().path.split('/')[2]; // ID del abogado
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const range = ref({ start: new Date(), end: new Date() });
const user_name = user.value.user_metadata.full_name;
const user_email = user.value.email;

const body = ref({
  user_name: user_name,
  user_email: user_email,
  modality: '',
  description: '',
  starts: new Date(),
  ends: new Date(),
  location: '',
  lawyer_id: id
});

const disabledDate = new Date()
disabledDate.setDate(new Date().getDate() + 3)

const disabledDates = ref([
  {
    start: new Date(),
    end: disabledDate,
  },
  {
    repeat: {
      weekdays: [1, 7],
    },
  }
]);

// La fecha de cierre cambia cuando se selecciona la fecha de inicio
watch(range.value, async() => {
  if(range.value.start.getDate() != range.value.end.getDate()) {
    range.value.end = range.value.start;
  }
});

// Funcion de nueva asesoria
async function newConsult(body) {
  //range.value.start = range.value.start - 4
  body.starts = range.value.start;
  body.ends = range.value.end;

  if(body.modality == '') {
    console.log('Ha ingresado un nombre nulo');
  } else if(body.description == '') {
    console.log('Ha ingresado una descripcion nula');
  } else {
    const { error } = await supabase.from('consults').insert(body);
    if(error) {
      return (error);
    } else {
      return navigateTo(`/lawyers/${id}`);
    }
  }
}
</script>

<template>
  <lawyerBack />
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="columns is-8 is-variable">
          <div class="column is-two-thirds has-text-left">
            <h1 class="title is-1">¡Contacte a su Abogado!</h1>
            <p class="is-size-4">
              Llene este formulario para ponerlo en contacto directo con un abogado a través de nuestra plataforma, 
              un correo le será enviado con la respuesta de su abogado.
            </p>
            <div v-if="body.modality == 'Presencial' && body.location == 'Personalizada'"><img src="/guia.jpeg"/></div>
            
          </div>
          <div class="column is-one-third has-text-left">
            <div class="field">
              <label class="label">Modalidad</label>
              <div class="select is-medium">
                <select v-model="body.modality">
                  <option>Presencial</option>
                  <option>Virtual (videollamada)</option>
                </select>
              </div>
            </div>
            <div v-if="body.modality == 'Presencial'" class="field">
              <label class="label">Lugar de la Asesoría</label>
              <div class="select is-medium">
                <select v-model="body.location">
                  <option>Sede del bufete</option>
                  <option>Personalizada</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label class="label">Descripción del caso</label>
              <div class="control">
                <textarea
                  v-model="body.description"
                  class="textarea is-medium"
                ></textarea>
              </div>
            </div>
            <div class="field">
              <label class="label">Fecha y hora de la Asesoría</label>
              <client-only>
                <VDatePicker expanded :min-date="new Date()" v-model="range.start" mode="date" :disabled-dates="disabledDates"/>
                <div class="columns is-gapless is-multiline" style="margin-top: 5px;">
                  <div class="column is-8">
                    <label class="label">Hora de Inicio</label>
                    <VDatePicker v-model="range.start" mode="time" hide-time-header/>
                  </div>
                  <div class="column is-4">
                    <label class="label">Hora de Fin</label>
                    <VDatePicker v-model="range.end" mode="time" hide-time-header/>
                  </div>
                </div>
              </client-only>
            </div>
            <div class="control">
              <button
                type="submit"
                class="button is-link is-fullwidth has-text-weight-medium is-medium"
                @click="newConsult(body)"
              >
                Enviar Solicitud
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
