<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <figure class="image is-48x48" style="margin-top: 10px;">
          <img
            src="https://www.zarla.com/images/zarla-oficina-legal-1x1-2400x2400-20210607-84q9tchdhy7xjkmvqywr.png?crop=1:1,smart&width=250&dpr=2"
            alt="Logo"
          />
        </figure>
        <span class="" data-target="navbarMenu">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>
      <div id="navbarMenu" class="navbar-menu is-active" style="background-color: rgba(255, 255, 255, 0);">
        <div class="navbar-end">
          <span class="navbar-item">
            <NuxtLink class="button is-white is-outlined" to="/" style="width: 100%;">
              <span class="icon">
                <i class="fa fa-home"></i>
              </span>
              <span>Inicio</span>
            </NuxtLink>
          </span>
          <span class="navbar-item">
            <NuxtLink class="button is-white is-outlined" to="/lawyers" style="width: 100%;">
              <span class="icon">
                <i class="fa fa-users" aria-hidden="true"></i>
              </span>
              <span>Abogados</span>
            </NuxtLink>
          </span>
          <span class="navbar-item">
            <NuxtLink class="button is-white is-outlined" to="/about" style="width: 100%;">
              <span class="icon">
                <i class="fa fa-book"></i>
              </span>
              <span>Nosotros</span>
            </NuxtLink>
          </span>
          <span class="navbar-item" style="margin-left: 0px;">
            <AccountButton />
          </span>
          <!--<span class="navbar-item">
            <NuxtLink class="button is-white is-outlined" to="/login">
              <span class="icon">
                <i class="fa fa-sign-in" aria-hidden="true"></i>
              </span>
              <span>Inicia/Registrate</span>
            </NuxtLink>
          </span>-->
        </div>
      </div>
    </div>
  </nav>
</template>
