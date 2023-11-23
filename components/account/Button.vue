<script setup lang="ts">

// Constantes a utilizar
const route = useRoute();
const supabase = useSupabaseClient();
const { data: { session } } = await supabase.auth.getSession();
const lawyer = ref();

// Verificamos si el usuario es abogado
if (session != null) {
  lawyer.value = await $fetch(`/api/auth/${session.user.email}`).catch((error) => console.log(error.data));
}

// Funcion de cerrar sesion
async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return error
  } else {
    if (route.path == "/") {
      location.reload();
    } else {
      return navigateTo("/");
    }
  } 
}
</script>

<template>
  <div v-if="session != null">
    <div v-if="lawyer == undefined">
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="button is-white is-outlined" style="width: 100%;">
            <span class="icon">
              <figure class="image is 128x128">
                <img class="is-rounded" :src="session.user.user_metadata.avatar_url" />
              </figure>
            </span>
            <p>{{ session.user.user_metadata.name }}</p>
          </a>
          <div class="navbar-dropdown">
            <a class="navbar-item has-text-black" style="background-color: white" @click="signOut">
              Salir
            </a>
          </div>
        </div>
    </div>
    <div v-else>
      <div class="navbar-end">
        <div class="navbar-item is-hoverable">
          <a class="button is-white is-outlined">
            <span v-if="lawyer.profile_picture != ''" class="icon">
              <figure class="image is 128x128">
                <img class="is-rounded" :src="lawyer.profile_picture" />
              </figure>
            </span>
            <span v-else class="icon">
              <figure class="image is 128x128">
                <img class="is-rounded" :src="session.user.user_metadata.avatar_url" />
              </figure>
            </span>
            <a class="navbar-link"> {{ lawyer.name }} </a>
          </a>
          <div class="navbar-dropdown">
            <NuxtLink class="navbar-item" to="/profile">
              Area Personal
            </NuxtLink>
            <NuxtLink class="navbar-item" :to="`/projects/${lawyer.id}`">
              Mis Proyectos
            </NuxtLink>
            <NuxtLink class="navbar-item" to="/db/cases"> Base de Expedientes Cerrados </NuxtLink>
            <NuxtLink v-if="lawyer.is_admin == true" class="navbar-item" to="/db/lawyers"> Base de Datos de Abogados </NuxtLink>
            <hr class="navbar-divider" />
            <a class="navbar-item" @click="signOut"> Salir </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <NuxtLink class="button is-white is-outlined" to="/login" style="width: 100%;">
      <span class="icon">
        <i class="fa fa-sign-in" aria-hidden="true"></i>
      </span>
      <span>Inicia/Regístrate</span>
    </NuxtLink>
  </div>
</template>
