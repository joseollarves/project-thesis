<script setup lang="ts">
// Middleware
definePageMeta({
  middleware: ["auth"],
});

// Constante a utilizar
const cases = ref();

// Obtenemos los casos mas recientes
cases.value = await $fetch("/api/cases/indexPage").catch((error) => console.log(error.data));
cases.value = cases.value.slice(-3);
</script>
<template>
  <section class="hero is-info is-fullheight" style="background: url(backgroundHome.jpeg)">
    <div class="hero-head">
      <indexNav></indexNav>
    </div>
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-6 is-offset-3">
          <h1 class="title">Proyecto Bufete</h1>
          <h2 class="subtitle">
            La mejor plataforma de software administrativa de bufetes en la ciudad de Valencia,
            estado Carabobo.
          </h2>
        </div>
      </div>
    </div>
  </section>
  <section class="" style="background-color: black">
    <h1 class="title" style="color: white; padding: 40px; margin-bottom: -5px">
      ¡NUESTROS CASOS MÁS RECIENTES!
    </h1>
    <section class="section" style="background: url(muro.png)">
      <div class="container">
        <div class="columns">
          <div v-for="caso in cases" class="column">
            <IndexPopular :caso="caso"></IndexPopular>
          </div>
        </div>
      </div>
    </section>
  </section>
  <section class="section" style="background-color: black">
    <footer class="footer" style="background-color: black; color: white">
      <div class="content has-text-centered">
        <p>
          <strong style="color: gainsboro">Proyecto Bufete</strong> Hecho con ❤,
          por Arnaldo Mujica y José Ollarves.
        </p>
      </div>
    </footer>
  </section>
</template>
