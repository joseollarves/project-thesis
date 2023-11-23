<script setup lang="js">
// ID del proyecto
const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})

// Constante a utilizar
const taskSelected = useTaskSelected();
const supabase = useSupabaseClient();

// Funcion de editar tarea
async function editTask() {
  
  if(taskSelected.value.status == false) {
    console.log('Esa tarea ya fue completada, por favor seleccione una tarea que se encuentre activa.');
  } else if(taskSelected.value.status == null) {
    console.log('No ha seleccionado ninguna tarea porfavor elija una.');
  } else {
    const id = taskSelected.value.id;
    taskSelected.value = null;
    return navigateTo(`/project/${props.id}/tasks/${id}/edit`);
  }
}

// Funcion de cambiar estado de la tarea
async function changeTaskState() {
  if(taskSelected.value.status == true) {
    taskSelected.value.status = false;
  } else {
    taskSelected.value.status = true;
  }

  const { error } = await supabase.from('tasks').update({status: taskSelected.value.status}).eq('id',taskSelected.value.id);
  if(error) console.log(error);
  taskSelected.value = null;
}
</script>
<template>
  <div class="block">
    <div class="columns is-mobile is-centered">
      <div class="field is-grouped">
        <div class="buttons has-addons is-centered">
          <div class="field has-addons" style="margin-top: 10px">
            <p class="control">
              <NuxtLink :to="`/project/${props.id}/tasks/create`" class="button is-small is-rounded">
                <span>Agregar Tarea</span>
              </NuxtLink>
              <button @click="editTask()" class="button is-small is-rounded">
                <span>Editar Tarea</span>
              </button>
              <button class="button is-small is-rounded">
                <span @click="changeTaskState()">Cambiar estado de la Tarea</span>
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
