<script setup lang="js">
// ID del proyecto
const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  performances: {
    type: Array,
    default: [],
  }
})

// Constante a utilizar
const performanceSelected = usePerformanceSelected();
const recentPerformance = useRecentPerformance();

// Funcion de editar actuacion
async function editPerformance() {

  console.log(performanceSelected.value)
  if(performanceSelected.value.name == undefined) {
    console.log('No ha seleccionado ninguna actuacion')
  } else {
    for(let i in props.performances) {
      if(performanceSelected.value.date > props.performances[i].date) {
        recentPerformance.value = true;
      }
    }
    return navigateTo(`/project/${props.id}/performances/${performanceSelected.value.id}/edit`);
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
              <NuxtLink :to="`/project/${id}/performances/create`" class="button is-small is-rounded">
                <span>Agregar Actuación</span>
              </NuxtLink>
              <button @click="editPerformance()" class="button is-small is-rounded">
                <span>Modificar Actuación</span>
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
