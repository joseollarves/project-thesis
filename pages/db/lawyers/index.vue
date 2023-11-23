<script setup lang="ts">

// Tipo Abogado
interface lawyer {
  id: string;
  name: string | null;
  email: string | null;
  description: string | null;
  specializations: string[];
  profile_picture: string | null;
}


// Constantes a utilizar
const lawyers = ref();
const lawyerSelected = ref();
const lawyerState = ref(false);
const supabase = useSupabaseClient();
const search = ref('');
lawyers.value = await $fetch('/api/lawyers').catch((error) => console.log(error.data));

// Verificamos si se crearon o eliminaron a algun abogado.
watch(lawyerState, async() => {
  if(lawyerState.value = true) {
    lawyers.value = await $fetch('/api/lawyers').catch((error) => console.log(error.data));
    lawyerState.value = false;
  }
});

const lawyersFiltered = computed(() => {
  if (lawyers.value != null) {
    return lawyers.value.filter((lawyer: lawyer) => {
      if (lawyer.name != null) {
        const matchesSearch = lawyer.name
          .toLowerCase()
          .includes(search.value.toLowerCase());

        return matchesSearch;
      }
    });
  }
});


// Funcion de borrar abogado
async function deleteLawyer() {
  if(lawyerSelected.value == undefined) {
    //console.log('Por favor, seleccione un abogado')
  } else {
    const { error } = await supabase.from('lawyers').delete().eq('id', lawyerSelected.value.id);
    if(error) {
      return error;
    } else {
      lawyerState.value = true;
    }
  }
}
</script>

<template>
  <accountNav></accountNav>
  <nav class="panel">
    <p class="panel-heading">Base de datos de Abogados</p>
    <div class="panel-block">
      <p class="control has-icons-left">
        <input class="input is-rounded" v-model="search" type="text" placeholder="Buscar" />
        <span class="icon is-left">
          <i class="fa fa-search" aria-hidden="true"></i>
        </span>
      </p>
      <div class="field has-addons">
        <NuxtLink :to="`/db/lawyers/create`" class="button is-rounded ml-4">Agregar Abogado</NuxtLink>
        <button @click="deleteLawyer()" class="button is-rounded ml-4">Eliminar Abogado</button>
      </div>
    </div>
    <table class="table is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th style="padding-left: 19px; width: 10px;"></th>
            <th style="padding-left: 19px; width: 10px;">Nombre</th>
            <th style="padding-left: 19px; width: 200px;">Email</th>
            <th style="padding-left: 19px; width: 200px;">Especializaciones</th>
          </tr>
        </thead>
        <tbody v-for="lawyer in lawyersFiltered">
          <tr>
            <th>
              <div class="control" style="margin-left: 15px; margin-top: 13px;">
                <label class="radio">
                  <input v-model="lawyerSelected" :value="lawyer" type="radio" >
                </label>
              </div>
              <!--
              <label class="checkbox">
                <input v-model="lawyerSelected" :value="lawyer" type="radio" />
              </label>
              -->
            </th>
            <td>
              <a class="panel-block">{{ lawyer.name }}</a>
            </td>
            <td>
              <a class="panel-block">{{ lawyer.email }}</a>
            </td>
            <td>
              <NuxtLink a class="panel-block">
                <div
                  v-for="specialization in lawyer.specializations"
                  class="button mr-2 is-rounded is-outlined"
                  href="#"
                >
                  {{ specialization }}
                </div>
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
  </nav>
</template>
