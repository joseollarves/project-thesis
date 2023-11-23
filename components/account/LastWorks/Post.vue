<script setup lang="ts">

// Datos del caso
const props = defineProps({
  caso: {
    type: Object,
    default: {},
  },
});

// Meses en el ano
const months = [
  {
    name: "Enero",
    value: "01",
  },
  {
    name: "Febrero",
    value: "02",
  },
  {
    name: "Marzo",
    value: "03",
  },
  {
    name: "Abril",
    value: "04",
  },
  {
    name: "Mayo",
    value: "05",
  },
  {
    name: "Junio",
    value: "06",
  },
  {
    name: "Julio",
    value: "07",
  },
  {
    name: "Agosto",
    value: "08",
  },
  {
    name: "Septiembre",
    value: "09",
  },
  {
    name: "Octubre",
    value: "10",
  },
  {
    name: "Noviembre",
    value: "11",
  },
  {
    name: "Diciembre",
    value: "12",
  },
];

</script>

<template>
  <div class="content">
    <h5 class="w3-opacity">
      <b>{{ props.caso.motive }}</b>
    </h5>
    <div v-if="props.caso.date_last_performance != null">
      <h6 class="w3-text-teal" v-for="fecha in props.caso.date_last_performance.split('-')">
        <div v-for="month in months">
          <div v-if="fecha == month.value">
            <i class="fa fa-calendar fa-fw w3-margin-right"></i
            >{{ month.name }} {{ props.caso.date_last_performance.split("-")[2].split("T")[0] }},
            {{ props.caso.date_last_performance.split("-")[0] }}
          </div>
        </div>
      </h6>
    </div>
    <div v-else>
      <p>Sin Fecha</p>
    </div>
    <div v-if="props.caso.status == true">
      <span class="w3-tag w3-teal w3-round">En Curso</span>
    </div>
    <div v-else>
      <span class="w3-tag w3-teal w3-round">Finalizado</span>
    </div>
    <p>{{ props.caso.description }}</p>
    <hr />
  </div>
</template>
