<script setup lang="js">

// Constantes a utilizar
const supabase = useSupabaseClient();
const id = useRoute().path.split("/")[2];
const caso = ref();
const user = useSupabaseUser();

// Obtenemos los datos del caso
caso.value = await $fetch(`/api/cases/${id}`).catch((error) => console.log(error.data));
// Funcion de cerrar caso
async function closeCase() {
  const { error } = await supabase.from('cases').update({status: false}).eq('id', id);
  if(error) {
    return error;
  } else {
    return navigateTo(`/projects/${user.value.id}`);
  }
}
</script>
<template>
  <div class="hero-body" style="background-color: rgba(230, 230, 230); padding-bottom: 600px">
    <div class="container has-text-centered" style="background-color: rgba(0, 255, 255, 0)">
      <div class="column is-4 is-offset-4" style="background-color: rgba(240, 248, 255, 0)">
        <article class="message is-dark" style="border-radius: 20px">
          <div class="message-header" style="border-radius: 10px 10px 0px 0px">
            <h1 class="title p-1" style="font-size: x-large; color: white">
              ¿Está seguro que desea cerrar el caso?
            </h1>
          </div>
          <div class="message-body">
            <div class="buttons has-addons is-centered">
              <button @click="closeCase(caso)" class="button mt-5 is-dark is-rounded">
                Aceptar
              </button>
              <NuxtLink :to="`/project/${id}`" class="button mt-5 is-dark is-rounded">Cancelar</NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
