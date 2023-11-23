<template>
  <nav class="navbar has-shadow">
    <div class="container">
      <div class="navbar-brand">
        <NuxtLink class="navbar-item" to="/">
          <img
            src="https://www.zarla.com/images/zarla-oficina-legal-1x1-2400x2400-20210607-84q9tchdhy7xjkmvqywr.png?crop=1:1,smart&width=250&dpr=2"
            alt="Bulma: a modern CSS framework based on Flexbox"
          />
        </NuxtLink>
        <div class="" data-target="navMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <!--<div class="navbar-end">
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link"> Cuenta </a>
          <div class="navbar-dropdown">
            <NuxtLink class="navbar-item" to="/dbExp"> Base de Datos </NuxtLink>
            <NuxtLink class="navbar-item" to="/myProjects">
              Mis Proyectos
            </NuxtLink>
            <NuxtLink class="navbar-item" to="/profile">
              Area Personal
            </NuxtLink>
            <hr class="navbar-divider" />
            <a class="navbar-item" @click="signOut"> Salir </a>
          </div>
        </div>
      </div>-->
      <div class="navbar-end">
        <AccountButton />
      </div>
    </div>
  </nav>
</template>
