<script setup lang="ts">
const search = useLawyerSearch();
</script>

<template>
  <div class="hero-body">
    <div class="container">
      <div class="card">
        <div class="card-content">
          <div class="control has-icons-left has-icons-right">
            <input
              v-model="search"
              class="input is-rounded"
              type="text"
              placeholder="Buscar un abogado"
            />
            <span class="icon is-medium is-left">
              <i class="fa fa-search"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
