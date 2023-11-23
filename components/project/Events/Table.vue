<script setup lang="js">

// Tipo Evento
/*interface event {
  id: String,
  name: String,
  description: String,
  date: String,
}

interface events extends Array<event> {} // Tipo Eventos
*/
// Eventos
const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})

// Constante a utilizar
const events = useEvents();
const eventSelected = useEventSelected();
const eventState = useEventState();
// Obtenemos los eventos del proyecto
events.value = await $fetch(`/api/cases/${props.id}/events`).catch((error) => console.log(error.data));

watch(eventState, async() => {
  if(eventState.value == true) {
    events.value = await $fetch(`/api/cases/${props.id}/events`).catch((error) => console.log(error.data));
    console.log(events.value);
    eventState.value = false;
  }
})

</script>
<template>
  <div class="columns is-gapless is-multiline">
    <div class="column">
      <table class="table is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th><abbr title="Position"> </abbr></th>
            <th>Nombre del evento</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events">
            <th>
              <label class="checkbox">
                <input v-model="eventSelected" :value="event" type="radio" />
              </label>
            </th>
            <td>{{ event.name }}</td>
            <td>{{ event.description }}</td>
            <td>{{ event.date.split('T')[0] }}</td>
            <div v-if="event.date.split('T')[1].split(':')[0] - 4 == -1"> 
              <td>24:{{ event.date.split("T")[1].split(":")[1] }} PM</td>
            </div>
            <div v-else>
              <div v-if="event.date.split('T')[1].split(':')[0] - 4 > 12">
                <td>{{ event.date.split("T")[1].split(":")[0] - 4 }}:{{ event.date.split("T")[1].split(":")[1]}} PM</td>
              </div>
              <div v-else>
                <td>{{ event.date.split("T")[1].split(":")[0] - 4 }}:{{ event.date.split("T")[1].split(":")[1]}} AM</td>
              </div>
            </div>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
