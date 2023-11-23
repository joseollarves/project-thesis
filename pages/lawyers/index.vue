<script setup lang="ts">
// Middleware
definePageMeta({
  middleware: ["auth"],
});

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
const search = useLawyerSearch();
const lawyers = ref();
const selectedFilters = useLawyerFiltered();

// Obtenemos todos los abogados que trabajan en el bufete
lawyers.value = await $fetch("/api/lawyers").catch((error) => console.log(error.data));

// Ordenamos los nombres por orden alfabetico
if (lawyers.value != null) {
  lawyers.value.sort((a: lawyer, b: lawyer) => {
    const nameA = ref();
    const nameB = ref();

    if (a.name != null && b.name != null) {
      nameA.value = a.name.toLowerCase();
      nameB.value = b.name.toLowerCase();
    }

    if (nameA.value < nameB.value) {
      return -1;
    } else if (nameA.value > nameB.value) {
      return 1;
    } else {
      return 0;
    }
  });
}

// El buscador de abogados, filtra por el nombre ingresado y las especializaciones
const lawyersFiltered = computed(() => {
  if (lawyers.value != null) {
    return lawyers.value.filter((lawyer: lawyer) => {
      if (lawyer.name != null) {
        const matchesSearch = lawyer.name
          .toLowerCase()
          .includes(search.value.toLowerCase());

        if (selectedFilters.value.length == 0) {
          return matchesSearch;
        }
        const matchesFilters = selectedFilters.value.every((filter: string) => {
          return lawyer.specializations.includes(filter);
        });
        return matchesFilters && matchesSearch;
      }
    });
  }
});

</script>
<template>
  <section class="hero is-info is-fullheight" style="background: url(backgroundHome.jpeg)">
    <div class="hero-head">
      <indexNav></indexNav>
      <section class="hero is-small">
        <LawyerSearch/>
        <div style="background-color: rgb(44, 44, 44); padding-bottom: 450px">
          <LawyerSelectBar/>
          <div class="block" style="background-color: rgba(250, 1, 1, 0); padding-bottom: 20px">
            <section class="container">
              <br />
              <div class="columns is-gapless is-multiline">
                <div v-for="lawyer in lawyersFiltered" class="column is-4 features">
                  <lawyerCard :lawyer="lawyer"></lawyerCard>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>
