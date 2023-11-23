<script setup lang="ts">
// Datos del caso
const props = defineProps({
  caso: {
    type: Object,
    default: {},
  },
});

</script>
<template>
  <aside class="column is-2 " style="background-color: rgb(235, 235, 235); ">
    <div style="text-align: center; background-color: gainsboro; border-radius: 50px; margin-top: 15px;">
          <span class="is-5" style="font-size: larger;">{{ props.caso.motive }}</span>
    </div>
    <ul class="menu-list">
      <li>
        <NuxtLink :to="`/project/${props.caso.id}`" style="font-size: x-large; border-radius: 100px; margin-bottom: 5px; margin-top: 5px;">
          <label class="checkbox">
            <i class="fa fa-address-book mr-4" aria-hidden="true"></i>
            Inicio
          </label>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="`/project/${props.caso.id}/files`" style="font-size: x-large; border-radius: 50px; margin-bottom: 5px; margin-top: 5px;"><label class="checkbox"><i class="fa fa-files-o mr-4" aria-hidden="true" style="width: 25px; text-align: center;"></i>Archivos</label></NuxtLink>
      </li>
      <li>
        <NuxtLink :to="`/project/${props.caso.id}/collaborators`" style="font-size: x-large; border-radius: 50px; margin-bottom: 5px; margin-top: 5px;"><label class="checkbox"><i class="fa fa-users mr-4" aria-hidden="true" style="width: 25px; text-align: center;"></i>Colaboradores</label></NuxtLink>
      </li>
      <li>
        <NuxtLink :to="`/project/${props.caso.id}/tasks`" style="font-size: x-large; border-radius: 50px; margin-bottom: 5px; margin-top: 5px;" ><label class="checkbox"><i class="fa fa-thumb-tack mr-4" aria-hidden="true" style="width: 25px; text-align: center;"></i>Tareas</label></NuxtLink>
      </li>
      <li>
        <NuxtLink :to="`/project/${props.caso.id}/performances`" style="font-size: x-large; border-radius: 50px; margin-bottom: 5px; margin-top: 5px;"><label class="checkbox"><i class="fa fa-handshake-o mr-4" aria-hidden="true" style="width: 25px;"></i>Actuaciones</label></NuxtLink>
      </li>
      <li>
        <NuxtLink :to="`/project/${props.caso.id}/events`" style="font-size: x-large; border-radius: 50px; margin-bottom: 5px; margin-top: 5px;"><label class="checkbox"><i class="fa fa-calendar-o mr-4" aria-hidden="true" style="width: 25px; text-align: center;"></i>Eventos</label></NuxtLink>
      </li>
    </ul>
  </aside>
</template>
