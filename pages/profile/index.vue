<script setup lang="js">
// Middleware
definePageMeta({
  middleware: ["auth"],
});

// Constantes a utilizar
const supabase = useSupabaseClient();
const route = useRoute();
const { data: { session } } = await supabase.auth.getSession();
const lawyer = ref();

console.log(session)
// Guardamos los datos del abogado y el token de actualizacion de acceso.
if (session != null) {
  lawyer.value = await $fetch(`/api/auth/${session.user.email}`).catch((error) => console.log(error.data));
  lawyer.value.email = session.user.email;

  if(lawyer.value.provider_refresh_token == null) {
    if (session.provider_refresh_token != null) {
      
      const { error } = await supabase.from('lawyers').update({provider_refresh_token: session.provider_refresh_token}).eq('id', lawyer.value.id);
      if(error) console.log(error);

    } else {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log(error);
      } else {
        if (route.path == "/") {
          location.reload();
        } else {
          navigateTo("/");
        }
      } 
    }
  } else if(lawyer.value.provider_refresh_token != session.provider_refresh_token) {
    const { error } = await supabase.from('lawyers').update({provider_refresh_token: session.provider_refresh_token}).eq('id', lawyer.value.id);
    if(error) console.log(error)
  }
}

</script>
<template>
  <accountNav></accountNav>
  <div class="block">
    <section class="container">
      <br />
      <div class="columns">
        <accountProfile :lawyer="lawyer"></accountProfile>
        <accountLastWorks :id="lawyer.id"></accountLastWorks>
        <accountFeed :lawyer="lawyer"></accountFeed>
      </div>
    </section>
  </div>
</template>
