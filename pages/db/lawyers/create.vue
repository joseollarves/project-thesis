<script setup lang="js">

// Constantes a utilizar
const supabase = useSupabaseClient();
const specializations = ['Penal', 'Civil', 'Mercantil'];
const users = ref();
const lawyers = ref();
const lawyer = ref({
  id: '',
  name: '',
  description: '',
  email: '',
  specializations: [],
  profile_picture: '',
  is_admin: false,
})
const lawyer_data = ref({
  id: [],
  email: [],
});

users.value = await $fetch('/api/users').catch((error) => console.log(error.data));
lawyers.value = await $fetch('/api/lawyers').catch((error) => console.log(error.data));

const usersFiltered = users.value.filter((user) => {
  return lawyers.value.every((lawyer) => {
    return !lawyer.email.includes(user.email);
  })
});

// Funcion de crear nuevo abogado
async function newLawyer() {
  lawyer.value.id = lawyer_data.value.id;
  lawyer.value.email = lawyer_data.value.email;
  const { error } = await supabase.from('lawyers').insert(lawyer.value);
  if(error) {
    return error; 
  } else {
      return navigateTo('/db/lawyers');
  }
}
</script>
<template>







  <div
    class="hero-body"
    style="background-color: rgba(230, 230, 230); padding-bottom: 600px"
  >
    <div class="container" style="background-color: rgba(0, 255, 255, 0)">
      <div
        class="column is-4 is-offset-4"
        style="background-color: rgba(240, 248, 255, 0)"
      >
        <article class="message is-dark" style="border-radius: 20px">
          <div class="message-header" style="border-radius: 10px 10px 0px 0px">
            <h1 class="title p-1" style="font-size: x-large; color: white">
              Agregar un nuevo abogado
            </h1>
          </div>
          <div class="message-body">
            <input
              v-model="lawyer.name"
              type="text"
              class="input is-rounded"
              placeholder="Nombre del abogado"
            />

            
            <p style="margin-top: 10px;">Correos disponibles</p>
            <nav class="panel">
              <label v-for="user in usersFiltered" class="panel-block">
                <input v-model="lawyer_data" :value="user" type="radio"/>
                {{ user.email }}
              </label>
            </nav>


            <aside class="menu" style="margin-top: 10px; margin-bottom: -10px">
              <ul class="menu-list">
                <li>
                  <p class="is-active">Selecciona una especializacion</p>
                  <ul>
                    <li v-for="specialization in specializations">
                      <input
                        v-model="lawyer.specializations" :value="specialization"
                        type="checkbox"
                      />{{ specialization }}
                    </li>
                  </ul>
                </li>
              </ul>
            </aside>

            <div class="buttons has-addons is-centered">
              <button
                @click="newLawyer"
                class="button mt-5 is-dark is-rounded"
              >
                Crear Abogado
              </button>
              <NuxtLink
                :to="`/db/lawyers`"
                class="button mt-5 is-dark is-rounded"
                >Cancelar</NuxtLink
              >
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>












<!--
    <section class="hero is-info is-fullheight" style="background-color: rgb(230, 230, 230)">
    <div class="hero-head"></div>
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="box column is-4 is-offset-4">
          <p class="subtitle has-text-black">Agregar un nuevo abogado</p>
          <input v-model="lawyer.name" class="input mt-5" type="text" placeholder="Nombre del abogado"/>
          <p>Correos disponibles</p>
          <nav class="panel">
            <label v-for="user in usersFiltered" class="panel-block">
              <input v-model="lawyer_data" :value="user" type="radio"/>
              {{ user.email }}
            </label>
          </nav>
          <p>Especializaciones</p>
          <nav class="panel">
            <label v-for="specialization in specializations" class="panel-block">
              <input v-model="lawyer.specializations" :value="specialization" type="checkbox"/>
              {{ specialization }}
            </label>
          </nav>
          <button @click="newLawyer" class="button mt-5">Crear evento</button>
          <NuxtLink to="/db/lawyers" class="button mt-5">Cancelar</NuxtLink>
        </div>
      </div>
    </div>
  </section>
-->
</template>