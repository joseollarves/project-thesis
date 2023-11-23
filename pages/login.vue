<script setup lang="ts">
// Middleware
definePageMeta({
  middleware: ["auth"],
});

// Constante a utilizar
const supabase = useSupabaseClient();

// Funcion para iniciar sesion
async function signInWithOAuth() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      scopes: "https://www.googleapis.com/auth/calendar, https://www.googleapis.com/auth/gmail.modify",
      redirectTo: "https://project-tesis.vercel.app/profile",
    },
  });
  if (error) return (error);
};



</script>
<template>
  <section class="hero is-info is-fullheight" style="background: url(backgroundHome.jpeg)">
    <div class="hero-body" style="background-color: rgba(240, 248, 255, 0);">
      <div class="container has-text-centered" style="background-color: rgba(0, 255, 255, 0);">
        <div class="box column is-4 is-offset-4" style="background-color: rgba(240, 248, 255, 0);">
          <article class="message is-dark" style="border-radius: 20px;">
            <div class="message-header" style="border-radius: 10px 10px 0px 0px;">
              <h1 class="title p-1" style="font-size: x-large;">Acceda con su cuenta de Google</h1>
            </div>
            <div class="message-body">
              <button class="button is-dark is-rounded" @click="signInWithOAuth" style="margin-top: 50px; margin-bottom: 50px;">
                <span class="icon is-medium">
                  <i class="fa fa-google"></i>
                </span>
                <span style="font-size: x-large;">Acceder con Google</span>
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
    <!--
    <div class="hero-head">
      <indexNav></indexNav>
    </div>
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="box column is-4 is-offset-4">
          <p class="subtitle has-text-black">Acceda con su cuenta de Google.</p>
          <button class="button is-link is-rounded" @click="signInWithOAuth">
            <span class="icon is-medium">
              <i class="fa fa-google"></i>
            </span>
            <span>Acceder con Google</span>
          </button>
          <p class="has-text-grey mt-4">
            <a>¿Necesita ayuda?</a>
          </p>
        </div>
      </div>
    </div>
    -->
  </section>
  <!--
    <section class="hero is-success is-fullheight" style="background: url(backgroundHome.jpeg);">
        <div class="hero-body">
            <div class="container has-text-centered">
                <div class="column is-4 is-offset-4" style="background-color: white; border-radius: 10px;">
                    <p class="subtitle has-text-black" style="margin-top: 20px;">Por favor ingrese sus datos para acceder.</p>
                    <div class="box">
                        <figure class="avatar">
                     
                        </figure>
                        <form>
                            <div class="field">
                                <div class="control">
                                    <input class="input is-large" type="email" placeholder="Correo" >
                                </div>
                            </div>

                            <div class="field">
                                <div class="control">
                                    <input class="input is-large" type="password" placeholder="Cedula">
                                </div>
                            </div>
                            <div class="field">
                                <label class="checkbox">
                  <input type="checkbox">
                  Recordar este usuario
                </label>
                            </div>
                            <NuxtLink class="button is-block is-info is-large is-fullwidth" style="background-color: #737372;" to="/profile">Ingresar <i class="fa fa-sign-in" aria-hidden="true"></i></NuxtLink>
                        </form>
                    </div>
                    <p class="has-text-grey">
                        <a href="../">¿Necesita ayuda?</a>
                    </p>
                </div>
            </div>
        </div>
    </section>
-->
</template>
