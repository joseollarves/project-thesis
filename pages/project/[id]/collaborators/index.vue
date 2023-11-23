<script setup lang="js">
// Middleware
definePageMeta({
  middleware: ["auth"],
});

// Tipo Colaborador
/*interface collaborator {
  id: string,
  name: string,
  description: string,
  specializations: Array<string>,
  profile_picture: string,
}*/

// Constantes a utilizar
const id = useRoute().path.split("/")[2];
const collaborators = useCollaborators();
const collaboratorsDeleted = useCollaboratorsDeleted();
const search = useCollaboratorsSearch();
const lawyers = ref([]);
const admin = ref('');
const user = useSupabaseUser();
const caso = ref();

// Obtenemos los datos del caso
caso.value = await $fetch(`/api/cases/${id}`).catch((error) => console.log(error.data));

collaborators.value = caso.value.collaborators;

console.log(caso.value.collaborators)
// Guardamos los datos de cada colaborador y verificamos cual usuario es administrador
for (let i in caso.value.collaborators) {
  const data = await $fetch(`/api/lawyers/${caso.value.collaborators[i]}`).catch((error) => console.log(error.data));
  if (data != null) {
    lawyers.value.push({
      id: data.id,
      name: data.name,
      description: data.description,
      specializations: data.specializations,
      profile_picture: data.profile_picture,
    });

    if(caso.value.admin_data.id == data.id) {
      admin.value = data.id;
    }
  }
}

// Ordenamos los nombres por orden alfabetico

if (lawyers.value.length > 0) {
  lawyers.value.sort((a, b) => {
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

if(lawyers.value.length > 0) {
  const temp = ref(lawyers.value);

  for(let i in lawyers.value) {

    if(caso.value.admin_data.id == lawyers.value[i].id) {
      lawyers.value = [];
      lawyers.value.push(temp.value[i]);
      break;
    }
  }

  for(let j in temp.value) {
    if(caso.value.admin_data.id != temp.value[j].id) {
      lawyers.value.push(temp.value[j])
    }
  }
}

// Esta al pendiente si el administrador llega a eliminar un colaborador
watch(collaboratorsDeleted, async() => {
  if(collaboratorsDeleted.value == true) {
    caso.value = await $fetch(`/api/cases/${id}`).catch((error) => console.log(error.data));
    lawyers.value = [];
    for (let i in collaborators.value) {
      const data = await $fetch(`/api/lawyers/${caso.value.collaborators[i]}`).catch((error) => console.log(error.data));
      if (data != null) {
        lawyers.value.push({
          id: data.id,
          name: data.name,
          description: data.description,
          specializations: data.specializations,
          profile_picture: data.profile_picture,
        });
      }
    }
    
    if (lawyers.value.length > 0) {
      lawyers.value.sort((a, b) => {
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

    if(lawyers.value.length > 0) {
      const temp = ref(lawyers.value);
      
      for(let i in lawyers.value) {
        if(caso.value.admin_data.id == lawyers.value[i].id) {
          lawyers.value = [];
          lawyers.value.push(temp.value[i]);
          break;
        }
      }
      
      for(let j in temp.value) {
        if(caso.value.admin_data.id != temp.value[j].id) {
          lawyers.value.push(temp.value[j])
        }
      }
    }

    collaboratorsDeleted.value = false;
  }
})

// Filtramos a los colaboradores por su nombre en el buscador
const filteredLawyers = computed(() => {
  if (lawyers.value.length > 0) {
    return lawyers.value.filter((lawyer) => {
      if (lawyer.name != null) {
        const matchesSearch = lawyer.name
          .toLowerCase()
          .includes(search.value.toLowerCase());

        return matchesSearch;
      }
    });
  }
});
</script>
<template>
  <accountNav/>
  <div class="columns">
    <projectSidebar :caso="caso"/>
    <div class="column is-10 modal-button" data-target="modal-card">
      <div class="card is-shady" style=" border-radius: 30px; padding-bottom: 400px; margin-top: 10px; margin-right: 10px;">
        <div class="block" style="margin-bottom: -0px">
          <p class="title p-4" style=" background-color: gainsboro; border-radius: 30px 30px 0px 0px;">
            <i class="fa fa-files-o" aria-hidden="true" style="margin-right: 7px"></i>Colaboradores
          </p>
        </div>
        <div class="column messages is-fullheight pb-4">
          <div class="inbox-messages">
            <div class="block">
              <projectCollabSearch/>
              <projectCollabOptions :caso="caso" v-if="admin == user.id && caso.status != false" />
              <br />
              <div class="columns is-gapless is-multiline">
                <div v-for="lawyer in filteredLawyers" class="column is-3">
                  <projectCollabCard :admin="admin" :lawyer="lawyer"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
