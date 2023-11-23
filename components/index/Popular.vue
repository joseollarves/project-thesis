<script setup lang="ts">

// Caso reciente
const props = defineProps({
  caso: {
    type: Object,
    default: {},
  },
});
// Constante a utilizar
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
  <div class="card" style="width: 420px; height: 250px; border-radius: 10px">
    <div class="card-content" style="margin-bottom: -30px;">
      <p class="title" style="height: 80px">Caso: {{ props.caso.motive }}</p>
      <p class="subtitle" style="font-size: small; text-align: justify;">
        {{ props.caso.description }}
      </p>
    </div>
    <footer class="">
      <div class="card-content">
        <div class="">
          <b>Abogado:</b> {{ props.caso.admin_data.name }}
          <br />
          <div v-if="props.caso.date_last_performance != null">
            <div v-for="fecha in props.caso.date_last_performance.split('-')">
              <div v-for="month in months">
                <div v-if="fecha == month.value">
                  <time datetime="2023-1-1"><b>Ultima Actuación:</b> {{ props.caso.date_last_performance.split("-")[2].split("T")[0] }} de {{ month.name }}
                    de {{ props.caso.date_last_performance.split("-")[0] }}</time
                  >
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <p><b>Sin Fecha</b></p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
