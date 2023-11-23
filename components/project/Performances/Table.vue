<script setup lang="js">
// Tipo Actuacion
/*interface performance {
    date: String,
    id: String,
    name: String
}*/

// Tipo Actuaciones
//interface performances extends Array<performance> {} // Tipo Abogados

// Actuaciones
const props = defineProps({
  performances: {
    type: Array,
    default: []
  }
})

// Constantes a utilizar
const performances = props.performances
const performanceSelected = usePerformanceSelected();

</script>
<template>
  <div class="columns is-gapless is-multiline">
    <div class="column">
      <table class="table is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th><abbr title="Position"> </abbr></th>
            <th>Nombre de la Actuación</th>
            <th>Fecha</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody v-for="performance in performances">
          <tr>
            <th>
              <label class="checkbox">
                <input v-model="performanceSelected" :value="performance" type="radio" />
              </label>
            </th>
            <td>{{ performance.name }}</td>
            <td>{{ performance.date.split('T')[0] }}</td>
            <div v-if="performance.date.split('T')[1].split(':')[0] - 4 == -1"> 
              <td>24:{{ performance.date.split("T")[1].split(":")[1] }} PM</td>
            </div>
            <div v-else>
              <div v-if="performance.date.split('T')[1].split(':')[0] - 4 > 12">
                <td>{{ performance.date.split("T")[1].split(":")[0] - 4 }}:{{ performance.date.split("T")[1].split(":")[1]}} PM</td>
              </div>
              <div v-else>
                <td>{{ performance.date.split("T")[1].split(":")[0] - 4 }}:{{ performance.date.split("T")[1].split(":")[1]}} AM</td>
              </div>
            </div>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
