<script setup lang="ts">

// Middleware
definePageMeta({
  middleware: ["auth"],
});

// Tipo Archivo
interface file {
  id: string;
  name: string;
  metadata: object;
}

// Constantes a utilizar
const search = useFileSearch();
const id = useRoute().path.split("/")[2];
const files = ref();
const supabase = useSupabaseClient();
const fileState = useFileState();
const caso = ref();

// Obtenemos los datos del caso
caso.value = await $fetch(`/api/cases/${id}`).catch((error) => console.log(error.data));

// Obtenemos todos los archivos
const { data, error } = await supabase.storage.from("projects").list(id, {
  limit: 100,
  offset: 0,
  sortBy: { column: "name", order: "asc" },
});

if (error) console.log(error);

if (data != null) {
  files.value = data;
}

// Verificamos si se realizo algun cambio donde se guardan los archivos (se suben nuevos, se eliminan existentes, etc.)
watch(fileState, async () => {
  if (fileState.value == true) {
    const { data, error } = await supabase.storage.from("projects").list(id, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) console.log(error);

    if (data != null) {
      files.value = data;
    }
    fileState.value = false;
  }
});

// Ordenamos los archivos por orden alfabetico
if (files.value != null) {
  files.value.sort((a: file, b: file) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1; 
    } else {
      return 0; 
    }
  });
}

// Filtramos a los archivos por su nombre en el buscador
const filteredFiles = computed(() => {
  if (files.value != null) {
    return files.value.filter((file: file) => {
      if (file.name != null) {
        const matchesSearch = file.name
          .toLowerCase()
          .includes(search.value.toLowerCase());

        return matchesSearch;
      }
    });
  }
});

</script>
<template>
  <accountNav></accountNav>
  <div class="columns">
    <projectSidebar :caso="caso"></projectSidebar>
    <div class="column is-10 modal-button" data-target="modal-card">
      <div class="card is-shady" style=" border-radius: 30px; padding-bottom: 400px; margin-top: 10px; margin-right: 10px;">
        <div class="block" style="margin-bottom: -0px">
          <p class="title p-4" style=" background-color: gainsboro; border-radius: 30px 30px 0px 0px;">
            <i class="fa fa-files-o" aria-hidden="true" style="margin-right: 7px"></i>Archivos
          </p>
        </div>
        <div class="column messages is-fullheight pb-4">
          <div class="inbox-messages">
            <div class="block">
              <ProjectFilesSearch/>
              <ProjectFilesOptions v-if="caso.status != false"/>
              <br />
              <div class="columns is-gapless is-multiline">
                <div v-for="file in filteredFiles" class="column is-3">
                  <ProjectFilesCard :file="file"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
