<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <section class="hero is-info is-fullheight" style="background: url(backgroundHome.jpeg)">
    <div class="hero-head">
      <indexNav></indexNav>
    </div>
    <div class="hero-body">
      <div class="">
        <div class="column is-6 is-offset-3">
          <h1 class="title">Sobre nosotros</h1>
          <h2 class="subtitle" style="text-align: justify;">
            Entendemos que las cuestiones legales pueden ser complicadas y abrumadoras. Nuestra misión es brindarle un apoyo legal sólido y experto en cada paso del camino. Con una dedicación inquebrantable hacia nuestros clientes y un profundo conocimiento de la ley, nuestro bufete se destaca como un líder en la industria legal.
          </h2>
        </div>
      </div>
    </div>
  </section>
  <section class="" style="background-color: black; margin-top: 0px;">
    <section class="section" style="background: url(muro.png)">
      <div class="container has-text-centered">
        <h1 class="title" style="color: white; padding: 40px; margin-bottom: -5px">
          Nuestra firma
        </h1>
        <div class="columns">
          <div class="column card" style="width: 420px; height: 250px; border-radius: 10px; margin-right: 10px; margin-bottom: 10px;">
            <div class="card-content">
              <p class="title" style="height: 80px">Experiencia y Profesionalismo</p>
              <p class="subtitle" style="font-size: medium;">
                Nuestro equipo de abogados altamente calificados y experimentados se enorgullece de ofrecer un servicio legal excepcional en diversas áreas del derecho. Hemos manejado con éxito una amplia gama de casos, desde asuntos civiles hasta casos penales, litigios comerciales y mucho más. 
              </p>
            </div>
          </div>
          <div class="column card" style="width: 420px; height: 250px; border-radius: 10px; margin-right: 10px; margin-bottom: 10px;">
            <div class="card-content">
              <p class="title" style="height: 80px">Compromiso con el Cliente</p>
              <p class="subtitle" style="font-size: medium;">
                Creemos en la importancia de una relación sólida y confiable con nuestros clientes. Entendemos que cada caso es único y trabajamos estrechamente con usted para comprender sus necesidades y objetivos específicos.
              </p>
            </div>
          </div>
          <div class="column card" style="width: 420px; height: 250px; border-radius: 10px; margin-right: 10px; margin-bottom: 10px;">
            <div class="card-content">
              <p class="title" style="height: 80px">Resolución Efectiva de Casos</p>
              <p class="subtitle" style="font-size: medium;">
                Nuestro enfoque es resolver los casos de manera efectiva y eficiente. Buscamos soluciones que satisfagan sus intereses y protejan sus derechos, ya sea a través de la negociación, la mediación o el litigio en el tribunal.
              </p>
            </div>
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
          <!--<a href="https://github.com/Retro0w0">Arnaldo Mujica</a> y
          <a href="https://github.com/joseollarves">José Ollarves</a>.--> 
          <!--El codigo del sistema
          es de licencia
          <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.-->
        </p>
      </div>
    </footer>
  </section>
</template>
