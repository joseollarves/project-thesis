<script setup lang="js">

// Constantes a utilizar
const id = useRoute().path.split("/")[2];
const in_charge = [];
const supabase = useSupabaseClient();
const caso = ref();
const task = ref({
  case_id: id,
  name: '',
  in_charge: [],
  status: true,
});

// Obtenemos los datos de los colaboradores del proyecto
caso.value = await $fetch(`/api/cases/${id}`).catch((error) => console.log(error.data));

// Guardamos los datos de los colaboradores
for(let i in caso.value.collaborators) {
  const data = await $fetch(`/api/lawyers/${caso.value.collaborators[i]}/name`).catch((error) => console.log(error.data));
  if(data != null) {
    in_charge.push({
      name: data.name,
      id: caso.value.collaborators[i],
    });
  }
}

// Funcion de crear tarea
async function createTask(task) {
  const { error } = await supabase.from('tasks').insert({
    case_id: task.case_id,
    name: task.name,
    in_charge: task.in_charge,
    status: true,
  });

  if(error) {
    return (error);
  } else {
    return navigateTo(`/project/${id}/tasks`);
  }
}
</script>
<template>
  <div class="hero-body" style="background-color: rgba(230, 230, 230); padding-bottom: 600px">
    <div class="container" style="background-color: rgba(0, 255, 255, 0)">
      <div class="column is-4 is-offset-4" style="background-color: rgba(240, 248, 255, 0)">
        <article class="message is-dark" style="border-radius: 20px">
          <div class="message-header" style="border-radius: 10px 10px 0px 0px">
            <h1 class="title p-1" style="font-size: x-large; color: white">
              Crear una nueva Tarea
            </h1>
          </div>
          <div class="message-body">
            <input v-model="task.name" class="input is-rounded" placeholder="Nombre de la tarea"/>
            <aside class="menu" style="margin-top: 10px; margin-bottom: -10px">
              <ul class="menu-list">
                <li>
                  <p class="is-active">Seleccione un abogado</p>
                  <ul v-for="lawyer in in_charge">
                    <li>
                      <input v-model="task.in_charge" :value="lawyer" type="checkbox" />{{ lawyer.name }}
                    </li>
                  </ul>
                </li>
              </ul>
            </aside>
            <div class="buttons has-addons is-centered">
              <button @click="createTask(task)" class="button mt-5 is-dark is-rounded">
                Crear Tarea
              </button>
              <NuxtLink :to="`/project/${id}/tasks`" class="button mt-5 is-dark is-rounded">Cancelar</NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
