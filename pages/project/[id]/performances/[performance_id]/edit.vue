<script setup lang="js">

// Constantes a utilizar
const id = useRoute().path.split("/")[2];
const performance_id = useRoute().path.split("/")[4];
const supabase = useSupabaseClient();
const performance = ref();
const recentPerformance = useRecentPerformance();
const disabledDates = ref([
  {
    repeat: {
      weekdays: [1, 7],
    },
  },
]);

// Obtenemos la actuacion a modificar
performance.value = await $fetch(`/api/cases/${id}/performances/${performance_id}`).catch((error) => console.log(error.data));
console.log(performance.value)
// Funcion editar actuacion
async function editPerformance(performance) {
  const { error } = await supabase.from('performances').update(performance).eq('id', performance_id);

  if(error) {
    return error;
  } else {
    if(recentPerformance.value == true) {
      const { error } = await supabase.from('cases').update({date_last_performance: performance.date}).eq('id', performance.case_id);
      
      if(error) {
        return error;
      } else {
        return navigateTo(`/project/${id}/performances`);   
      }
    } else {
      return navigateTo(`/project/${id}/performances`);
    }
  }
}
</script>
<template>
  <div
    class="hero-body"
    style="background-color: rgba(230, 230, 230); padding-bottom: 600px"
  >
    <div class="container" style="background-color: rgba(0, 255, 255, 0)">
      <div
        class="column is-4 is-offset-4"
        style="background-color: rgba(240, 248, 255, 0)"
      >
        <article class="message is-dark" style="border-radius: 20px">
          <div class="message-header" style="border-radius: 10px 10px 0px 0px">
            <h1 class="title p-1" style="font-size: x-large; color: white">
              Editar una Actuación existente
            </h1>
          </div>
          <div class="message-body">
            <input
              v-model="performance.name"
              class="input is-rounded"
              placeholder="Nombre de la actuación"
              style="margin-bottom: 10px"
            />
            <client-only>
              <VDatePicker
                expanded
                v-model="performance.date"
                mode="dateTime"
                :disabled-dates="disabledDates"
              />
            </client-only>

            <div class="buttons has-addons is-centered">
              <button
                @click="editPerformance(performance)"
                class="button mt-5 is-dark is-rounded"
              >
                Editar Actuación
              </button>
              <NuxtLink
                :to="`/project/${id}/performances`"
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
