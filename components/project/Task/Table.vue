<script setup lang="js">
// Tipo Abogado
/*interface lawyer {
  task_id: String,
  lawyer_id: String,
  name: String | null,
}

// Tipo Tarea
interface task {
  id: String,
  in_charge: Array<Object>,
  name: String,
  status: Boolean
}*/

//interface lawyers extends Array<lawyer> {} // Tipo Abogados
//interface tasks extends Array<task> {} // Tipo Tareas

// Tareas
const props = defineProps({
  tasks: {
    type: Array,
    default: {}
  }
})

// Constantes a utilizar
const taskSelected = useTaskSelected();
const tasks = props.tasks;
const lawyers = [];

// Guardamos los datos esenciales de los colaboradores de cada tarea
for(let i in tasks) {
  for (let j in tasks[i].in_charge) {
    console.log(tasks[i].id);
    lawyers.push({
        task_id: tasks[i].id,
        lawyer_id: tasks[i].in_charge[j].id,
        name: tasks[i].in_charge[j].name,
      });
  }
}

// Tareas Activas
const activeTasks = computed(() => {
  return tasks.filter((task) => task.status == true);
});

// Tareas Terminadas
const finishedTasks = computed(() => {
  return tasks.filter((task) => task.status == false);
})

</script>
<template>
  <div class="columns is-gapless is-multiline">
    <div class="column is-6" style="margin-left: -8px; margin-right: 15px">
      <p class="title p-4" style="background-color: gainsboro; border-radius: 30px 30px 0px 0px">
        Pendientes
      </p>
      <table class="table is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th><abbr title="Position"> </abbr></th>
            <th>Nombre</th>
            <th>Responsable(s)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in activeTasks">
            <th>
              <label class="checkbox">
                <input v-model="taskSelected" :value="task" type="radio" />
              </label>
            </th>
            <td>{{ task.name }}</td>
            <div v-for="lawyer in lawyers">
              <td v-if="lawyer.task_id == task.id">{{ lawyer.name }}</td>
            </div> 
          </tr>
        </tbody>
      </table>
    </div>
    <div class="column is-6" style="margin-right: -8px">
      <p class="title p-4" style="background-color: gainsboro; border-radius: 30px 30px 0px 0px">
        Completadas
      </p>
      <table class="table is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th><abbr title="Position"></abbr></th>
            <th>Nombre</th>
            <th>Responsable(s)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in finishedTasks">
            <th>
              <label class="checkbox">
                <input v-model="taskSelected" :value="task" type="radio" />
              </label>
            </th>
            <td>{{ task.name }}</td>
            <div v-for="lawyer in lawyers">
              <td v-if="lawyer.task_id == task.id">{{ lawyer.name }}</td>
            </div> 
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
