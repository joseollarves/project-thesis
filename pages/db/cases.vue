<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const cases = ref();
cases.value = await $fetch("/api/cases/closed").catch((error) =>
  console.log(error.data)
);

/*const closedCases = computed(() => {
  return cases.value.filter((caso: any) => caso.status == false);
})*/
</script>
<template>
  <accountNav></accountNav>
  <nav class="panel">
    <p class="panel-heading">Base de Expedientes Cerrados</p>
    <div class="panel-block">
      <p class="control has-icons-left">
        <input class="input" type="text" placeholder="Buscar" />
        <span class="icon is-left">
          <i class="fa fa-search" aria-hidden="true"></i>
        </span>
      </p>
    </div>
    <div class="table-container">
      <table class="table is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th style="padding-left: 19px; width: 200px">Nº</th>
            <th style="padding-left: 19px; width: 200px">Motivo</th>
            <th style="padding-left: 19px; width: 200px">Demandante</th>
            <th style="padding-left: 19px; width: 200px">Demandado</th>
          </tr>
        </thead>
        <tbody v-for="caso in cases">
          <tr>
            <File :caso="caso" />
          </tr>
        </tbody>
      </table>
    </div>
  </nav>
</template>
