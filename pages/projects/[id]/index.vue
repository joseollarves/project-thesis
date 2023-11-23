<script setup lang="js">

// Middleware
definePageMeta({
  middleware: ["auth"],
});

// Tipo Caso
/*interface caso {
  id: string;
  number: string | null;
  motive: string | null;
  description: string | null;
  demandant: string | null;
  demanded: string | null;
  status: boolean;
  performances: object | null;
}*/

// Constantes a utilizar
const id = useRoute().path.split("/")[2];
const cases = ref();
const generalCases = ref([]);
const search = ref("");
const stateSelected = useStateSelected();

// Obtenemos los casos del abogado
cases.value = await $fetch(`/api/cases/collaborators/${id}`).catch((error) => console.log(error.data));

for(let i in cases.value) {
  const { data } = await useFetch(`/api/cases/${cases.value[i].id}/performances`);
  if(data.value != null) {
    if (data.value.length > 0) {
      generalCases.value.push({
        id: cases.value[i].id,
        number: cases.value[i].number,
        motive: cases.value[i].motive,
        demandant: cases.value[i].demandant,
        demanded: cases.value[i].demanded,
        status: cases.value[i].status,
        last_performance: data.value[data.value.length - 1].name,
        date_last_performance: data.value[data.value.length - 1].date
      });
    } else {
      generalCases.value.push({
        id: cases.value[i].id,
        number: cases.value[i].number,
        motive: cases.value[i].motive,
        demandant: cases.value[i].demandant,
        demanded: cases.value[i].demanded,
        status: cases.value[i].status,
        last_performance: null,
        date_last_performance: null
      });
    }
  } 
}

// Buscador de casos, los busca por motivo
const filteredCases = computed(() => {
  return generalCases.value.filter((caso) => {
    if (caso.motive != null) {
      const matchesSearch = caso.motive
        .toLowerCase()
        .includes(search.value.toLowerCase());

      const matchesFilters = caso.status == stateSelected.value;

      return matchesSearch && matchesFilters;
    }
  });
});

</script>
<template>
  <accountNav></accountNav>
  <nav class="panel">
    <p class="panel-heading">Mis Proyectos</p>
    <div class="panel-block">
      <p class="control has-icons-left">
        <input
          class="input"
          type="text"
          v-model="search"
          placeholder="Buscar"
        />
        <span class="icon is-left">
          <i class="fa fa-search" aria-hidden="true"></i>
        </span>
      </p>
      <NuxtLink :to="`/projects/${id}/create`" class="button ml-4">Crear Proyecto</NuxtLink>
    </div>
    <p class="panel-tabs">
      <a @click="stateSelected = true">Activos</a>
      <a @click="stateSelected = false">Cerrados</a>
    </p>
    <div class="table-container">
      <table class="table is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th style="padding-left: 19px; width: 200px;">Nº</th>
            <th style="padding-left: 19px; width: 200px;">Motivo</th>
            <th style="padding-left: 19px; width: 200px;">Demandante</th>
            <th style="padding-left: 19px; width: 200px;">Demandado</th>
            <th style="padding-left: 19px; width: 200px;">Última Actuación</th>
            <th style="padding-left: 19px; width: 200px;">Fecha Última Actuación</th>
          </tr>
        </thead>
        <tbody v-for="caso in filteredCases">
          <tr>
            <projectFiles :caso="caso"/>
          </tr>
        </tbody>
      </table>
    </div>
  </nav>
</template>
