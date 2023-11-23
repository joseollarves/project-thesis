<script setup lang="ts">
const id = useRoute().path.split("/")[2];

const props = defineProps({
  events: {
    type: Array,
    default: [],
  },
});

const events = ref<any>(props.events);
const dates = [];

for (let i in events.value) {
  dates.push(new Date(events.value[i].start.dateTime));
}

const disabledDates = ref([
  {
    repeat: {
      weekdays: [1, 7],
    },
  },
]);

const attrs = ref([
  {
    content: "blue",
    dates: dates,
  },
]);
</script>
<template>
  <div class="column modal-button" data-target="modal-card">
    <div class="card is-shady" style="border-radius: 30px">
      <div class="block">
        <h1
          class="title p-4"
          style="background-color: gainsboro; border-radius: 30px 30px 0px 0px"
        >
          <i class="fa fa-calendar" aria-hidden="true"></i>
          Calendario del Proyecto
        </h1>
      </div>

      <div style="margin-top: -25px">
        <client-only>
          <VDatePicker :initial-page="{ month: new Date().getMonth(), year: new Date().getFullYear() }" expanded :min-date="new Date()" :disabled-dates="disabledDates" :attributes="attrs" />
        </client-only>
      </div>
      <div class="buttons has-addons is-centered" style="margin-top: 10px">
        <NuxtLink :to="`/project/${id}/events`" class="button is-rounded"
          >Ver todos</NuxtLink
        >
      </div>
    </div>
  </div>
</template>
