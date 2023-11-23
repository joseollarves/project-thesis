<script setup lang="ts">
const filters = ref(["Penal", "Civil", "Mercantil"]);
const selectedFilters = useLawyerFiltered();

</script>
<template>
  <div class="block" style="background-color: white">
    <div class="box">
      <div class="columns is-mobile is-centered">
        <div class="field is-grouped" style="padding: 20px">
          <label class="checkbox" style="margin-right: 2px">
            <p style="margin-right: 5px">Filtrar Especialización:</p>
          </label>
          <div
            v-for="filter in filters"
            class="field is-grouped is-grouped-multiline"
          >
            <label class="checkbox" style="margin-right: 10px">
              <input
                v-model="selectedFilters"
                type="checkbox"
                :value="filter"
              />{{ filter }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
