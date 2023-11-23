export default defineNuxtRouteMiddleware(async (to) => {
  // Sin SSR
  const supabase = useSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  //console.log(session);
  if (session != null) {
    let lawyer: any = await useFetch(`/api/auth/${session.user.email}`);
    lawyer = lawyer.data.value
    if (
      (lawyer == undefined && to.path == "/profile") ||
      (lawyer == undefined && to.path == "/profile/:id/consults") ||
      (lawyer == undefined && to.path == "/profile/:id/edit") ||
      (lawyer == undefined && to.path == "/projects/:id") ||
      (lawyer == undefined && to.path == "/projects/:id/create") ||
      (lawyer == undefined && to.path == "/project/:id") ||
      (lawyer == undefined && to.path == "/project/:id/edit") || 
      (lawyer == undefined && to.path == "/project/:id/close") ||
      (lawyer == undefined && to.path == "/project/:id/files") ||
      (lawyer == undefined && to.path == "/project/:id/collaborators") ||
      (lawyer == undefined && to.path == "/project/:id/collaborators/select") ||
      (lawyer == undefined && to.path == "/project/:id/tasks") || 
      (lawyer == undefined && to.path == "/project/:id/events") ||
      (lawyer == undefined && to.path == "/project/:id/events/create") ||
      (lawyer == undefined && to.path == "/project/:id/events/:event_id/edit") ||
      (lawyer == undefined && to.path == "/project/:id/performances")
    ) {
      return navigateTo("/");
    } else if (
      (lawyer != undefined && to.path == "/") ||
      (lawyer != undefined && to.path == "/login") ||
      (lawyer != undefined && to.path == "/about") ||
      (lawyer != undefined && to.path == "/lawyers") ||
      (lawyer != undefined && to.path == "/lawyers/:id") ||
      (lawyer != undefined && to.path == "/contact/:id")
    ) {
      return navigateTo("/profile");
    }
  }

  //! Dejo este pocoton de codigo por si acaso
  //const user = await useFetch('/api/user', { headers: useRequestHeaders(['cookie']) });
  //console.log(user.data?.value);

  //if(user.data?.value != null) {
  //  console.log('si inicio sesion');
  //} else {
  //  console.log('no inicio sesion')
  //}
  /*const user = await useSupabaseUser();
  console.log(a);
  if(user.value != null) {
    const lawyer = await useFetch(`/api/auth/${user.value?.email}`, { headers: useRequestHeaders(['cookie']) });
    //console.log(lawyer.data.value);
    //console.log(to)
    if(lawyer.data.value == null && to.path == '/profile') {
      return navigateTo('/');
    } else if(lawyer.data.value != null && to.path == '/') {
      return navigateTo('/profile');
    }
  } else {
    console.log('no ha iniciado sesion');
  }*/

  // Sin SSR
  /*const user = useSupabaseUser();
  const headers = useRequestHeaders(['cookie'])
  //console.log(user);

  if (user != null) {
    const lawyer: string = await $fetch(`/api/auth/${user.value?.email}`, {headers});
    //console.log(lawyer);
    if (lawyer == null && to.path == "/profile") {
      return navigateTo("/");
    } else if (lawyer != "" && to.path == "/") {
      return navigateTo("/profile");
    }
  } else {
    console.log('es nulo')
  }*/
});
