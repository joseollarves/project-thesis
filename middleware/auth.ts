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
});
